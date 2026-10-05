import type { Topic } from '../../types/content.ts';

/** ConcurrentLinkedQueue & Deque: lock-free FIFO on CAS. */
export const concurrentLinkedQueueTopic: Topic = {
  slug: 'concurrent-linked-queue',
  title: 'ConcurrentLinkedQueue & ConcurrentLinkedDeque',
  category: 'data-structures',
  order: 58,
  summary: 'Lock-free linked queues on CAS: unbounded FIFO for producers and consumers that never block.',
  level: 'intermediate',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['queue-deque', 'concurrent-overview'],
  choiceBox: {
    choose: [
      'Many producers/consumers passing work without ever blocking — logging, metrics, task handoff.',
      'Unbounded flows where drops are unacceptable and memory is the only bound.',
      'Iteration that tolerates concurrency (weakly consistent) instead of throwing.',
    ],
    avoid: [
      'Backpressure needs — unbounded means OOM under overload; blocking queues bound the flow.',
      'Blocking takes — `poll()` returns null when empty; waiting needs a `BlockingQueue`.',
      'Size-based decisions — `size()` is O(n) and instantly stale; design protocols that don’t count.',
    ],
  },
  sections: [
    {
      heading: 'CAS instead of locks: the Michael-Scott queue',
      body: 'Both classes implement the classic lock-free queue: `head` and `tail` are `volatile` node references updated with **compare-and-swap**. `offer` links the new node then swings `tail` (helping lagging tails forward on the way); `poll` reads `head`, takes its item, and swings `head` to the next node. Losers of a CAS race simply retry — no thread ever waits on another.\n\n- Nodes are the same lazy `item`/`next` shape as linked lists, with `volatile` links for safe cross-thread publication.\n- `ConcurrentLinkedDeque` extends the protocol to both ends (more CAS choreography, same non-blocking guarantee).\n- Progress is **lock-free** (some thread always advances), though not wait-free: the theoretical worst case is unbounded — a thread can lose every CAS race while the system as a whole progresses. In practice retries are rare and brief.',
    },
    {
      heading: 'Unbounded, non-blocking, null-hostile',
      body: 'No capacity: `offer` always succeeds (until memory runs out), `poll` returns `null` when empty, `peek` never blocks. That contract splits the use cases cleanly from `BlockingQueue`: handoff without coordination vs handoff with flow control.\n\n- `null` elements are forbidden — `null` already means “empty” for `poll`/`peek`, exactly like `ArrayDeque`.\n- `size()` walks the whole queue (`O(n)`) and is stale before it returns — never branch on it; use `isEmpty()` (also approximate) or restructure the protocol.\n- Iterators are weakly consistent: they tolerate concurrent modification, may reflect some recent writes, never throw.',
    },
    {
      heading: 'Head-to-head: queue choices under threads',
      body: 'Three queues, three contracts:\n\n| | `ConcurrentLinkedQueue` | `LinkedBlockingQueue` | `ArrayBlockingQueue` |\n| --- | --- | --- | --- |\n| Bound | unbounded | optionally bounded | fixed |\n| Empty take | `null` immediately | waits (interruptible) | waits (interruptible) |\n| Mechanism | lock-free CAS | two locks + conditions | single lock + conditions |\n| `size()` | O(n), stale | O(1) counter | O(1) counter |\n\nPick CLQ for fire-and-forget handoff; `LinkedBlockingQueue` for producer-consumer with backpressure; `ArrayBlockingQueue` for fixed buffers with minimal footprint.',
    },
    {
      heading: 'Drain patterns that scale',
      body: 'Consumers should batch: `poll` in a loop, or drain via repeated `poll` into a local list (no atomic `drainTo` here — that’s a `BlockingQueue` method). Single-consumer + many-producer is the sweet spot: one thread polls relentlessly while producers CAS their offers in.\n\n- `Design Hit Counter`’s canonical solution is a queue of timestamps with old-head eviction — this class fits it exactly.\n- Shutdown protocol: offer a POISON sentinel and have consumers exit on it — no `null` available for the signal.',
    },
  ],
  complexity: [
    { operation: 'offer (CAS retry)', best: 'O(1)', average: 'O(1)', worst: 'unbounded*', space: 'O(n)' },
    { operation: 'poll / peek (CAS retry)', best: 'O(1)', average: 'O(1)', worst: 'unbounded*', space: 'O(n)' },
    { operation: 'size (full walk)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Iteration (weakly consistent)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Fan-in logging with ExecutorService',
      description: 'Producers never block; one consumer drains relentlessly.',
      code: `import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class FanInLog {
    private static final String POISON = "POISON";

    public static void main(String[] args) throws InterruptedException {
        Queue<String> log = new ConcurrentLinkedQueue<>();
        AtomicBoolean done = new AtomicBoolean(false);

        ExecutorService pool = Executors.newFixedThreadPool(4);
        // Three producers: offers never block, never fail.
        for (int p = 0; p < 3; p++) {
            final int id = p;
            pool.submit(() -> {
                for (int i = 0; i < 5; i++) {
                    log.offer("p" + id + "-" + i);
                }
            });
        }
        // One consumer: poll until poisoned.
        pool.submit(() -> {
            int seen = 0;
            while (!done.get() || !log.isEmpty()) {
                String line = log.poll(); // null when momentarily empty
                if (line == null) {
                    Thread.yield();
                    continue;
                }
                if (line.equals(POISON)) {
                    break;
                }
                seen++;
            }
            System.out.println("consumed=" + seen); // 15
        });
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        done.set(true);
        log.offer(POISON);
        pool.awaitTermination(10, TimeUnit.SECONDS);
    }
}
`,
    },
    {
      title: 'Hit counter over a queue',
      description: 'Timestamps in, expired heads out — the Design Hit Counter shape.',
      code: `import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

public class HitCounter {
    private final Queue<Integer> hits = new ConcurrentLinkedQueue<>();

    public void hit(int timestamp) {
        hits.offer(timestamp);
    }

    /** Hits in [timestamp - 300, timestamp): evict expired heads first. */
    public int getHits(int timestamp) {
        while (!hits.isEmpty() && hits.peek() <= timestamp - 300) {
            hits.poll();
        }
        return hits.size(); // O(n) walk — fine for counters, never for control flow
    }

    public static void main(String[] args) {
        HitCounter c = new HitCounter();
        c.hit(1);
        c.hit(2);
        c.hit(3);
        c.hit(300);
        System.out.println(c.getHits(300)); // 4
        System.out.println(c.getHits(301)); // 3
    }
}
`,
    },
  ],
  mistakes: [
    'Branching on size(): O(n) and stale on arrival — protocols must work without counting.',
    'Busy-polling an empty queue: null-spin burns CPU — backoff/yield, or switch to a BlockingQueue take().',
    'Offering nulls as sentinels: forbidden — null means “empty”; use a POISON constant.',
    'Expecting FIFO fairness: lock-free is not fair — a fast producer can lap a slow consumer indefinitely.',
    'Assuming poll() waits: it returns null instantly — waiting is a BlockingQueue feature, not this one.',
    'Unbounded growth under overload: no backpressure exists — pair with monitoring or bound the producers.',
  ],
  vizId: 'cas-queue',
  problemIds: ['design-hit-counter', 'number-of-recent-calls'],
  practiceNote: 'Closest verified drills: Hit Counter and Recent Calls are both queue-over-time designs — the CAS mechanics above power them without blocking.',
  javaBuiltIn: ['java.util.concurrent.ConcurrentLinkedQueue', 'java.util.concurrent.ConcurrentLinkedDeque'],
  related: ['queue-deque', 'blocking-queue-family', 'concurrent-overview'],
};
