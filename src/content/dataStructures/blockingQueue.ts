import type { Topic } from '../../types/content.ts';

/** BlockingQueue Family: waiting is a feature — bounded buffers and handoffs. */
export const blockingQueueTopic: Topic = {
  slug: 'blocking-queue-family',
  title: 'BlockingQueue Family',
  category: 'data-structures',
  order: 59,
  summary: 'ArrayBlockingQueue to SynchronousQueue: bounded buffers, handoffs and delays — the producer-consumer toolkit.',
  level: 'advanced',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['concurrent-linked-queue'],
  choiceBox: {
    choose: [
      'Producer-consumer with backpressure: full producers wait, empty consumers wait — no polling loops.',
      'Fixed buffers: `ArrayBlockingQueue` (one lock) for tight bounded handoff.',
      'Handoffs (`SynchronousQueue`), schedules (`DelayQueue`), priority flow (`PriorityBlockingQueue`).',
    ],
    avoid: [
      'Non-blocking handoff — put/take park threads; `ConcurrentLinkedQueue` never waits.',
      'Null elements — forbidden across the whole family (null means “nothing taken”).',
      'Unbounded growth with LinkedBlockingQueue’s default constructor — capacity is Integer.MAX_VALUE in disguise.',
    ],
  },
  sections: [
    {
      heading: 'Waiting as an API: put and take',
      body: '`put(e)` blocks when full; `take()` blocks when empty — both interruptible, both condition-queued (no busy spin). Timed `offer(e, timeout)` / `poll(timeout)` bound the wait; untimed `offer`/`poll` never wait (like the concurrent queues); `add`/`remove` throw instead.\n\n- Interruption is first-class: blocked threads wake with `InterruptedException` on shutdown — design for it (restore the flag or exit).\n- `drainTo(collection, max)` moves batches atomically — consumers should drain, not single-take, under load.\n- `remainingCapacity()` exposes backpressure depth for monitoring and load-shedding.',
    },
    {
      heading: 'The family, one by one',
      body: 'Six implementations, one interface:\n\n| Queue | Bound | Order | Mechanism |\n| --- | --- | --- | --- |\n| `ArrayBlockingQueue` | fixed | FIFO | one lock, circular array |\n| `LinkedBlockingQueue` | optional (default ~unbounded) | FIFO | two locks (put/take), linked nodes |\n| `PriorityBlockingQueue` | unbounded | priority | heap + single lock |\n| `DelayQueue` | unbounded | by delay | priority of `Delayed` elements |\n| `SynchronousQueue` | zero | handoff | direct producer↔consumer rendezvous |\n| `LinkedTransferQueue` | unbounded | FIFO | lock-free + `transfer` handoff |\n\n`SynchronousQueue` holds nothing: `put` waits for a matching `take` — pure handoff, the Executors cached-pool secret. `DelayQueue` releases elements only after their delay expires — schedulers and retry timers without a timing thread.',
    },
    {
      heading: 'Poison pills and shutdown',
      body: 'Blocking consumers loop on `take()` forever — stopping them needs a protocol: N **poison pills** (one per consumer) offered at shutdown, each consumer exiting on receipt (and optionally re-offering for siblings). `ExecutorService.shutdown()` + `awaitTermination` wraps the lifecycle; `shutdownNow()` interrupts blocked takes as the last resort.\n\n- Pills must be distinguishable values (a sentinel constant), never `null`.\n- Count pills per consumer: one pill wakes one taker — N consumers need N pills.',
    },
    {
      heading: 'Bounded beats unbounded (usually)',
      body: 'Unbounded queues convert overload into OutOfMemoryError; bounded queues convert it into *waiting*, which is observable, monitorable, and shed-able. Size the bound from Little’s law (throughput × latency tolerance), expose `remainingCapacity`, and alert before zero.\n\n- `LinkedTransferQueue.transfer()` hands off directly when a consumer waits, queues otherwise — the adaptive middle ground.\n- `PriorityBlockingQueue` is unbounded and heap-ordered: priority flow without bounds needs its own overflow policy.',
    },
  ],
  complexity: [
    { operation: 'put / take (uncontended)', best: 'O(1)', average: 'O(1)', worst: 'blocks', space: 'O(cap)' },
    { operation: 'offer / poll (never wait)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(cap)' },
    { operation: 'drainTo (batch of k)', best: 'O(k)', average: 'O(k)', worst: 'O(k)', space: 'O(cap)' },
    { operation: 'PriorityBlockingQueue take', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Producer-consumer with poison pills',
      description: 'Bounded buffer, batch drain, N pills for N consumers — the full pattern.',
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ProducerConsumer {
    private static final String POISON = "POISON";

    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> buffer = new ArrayBlockingQueue<>(4);
        int consumers = 2;
        ExecutorService pool = Executors.newFixedThreadPool(consumers + 1);

        // Producer: put() blocks when the buffer is full — backpressure, free.
        pool.submit(() -> {
            try {
                for (int i = 0; i < 6; i++) {
                    buffer.put("job-" + i);
                }
                for (int c = 0; c < consumers; c++) {
                    buffer.put(POISON); // one pill per consumer
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        // Consumers: drain in batches, exit on poison.
        for (int c = 0; c < consumers; c++) {
            pool.submit(() -> {
                try {
                    while (true) {
                        List<String> batch = new ArrayList<>();
                        batch.add(buffer.take()); // wait for at least one
                        buffer.drainTo(batch, 3); // then grab more, atomically
                        if (batch.contains(POISON)) {
                            break;
                        }
                        System.out.println("processed " + batch);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
    }
}
`,
    },
    {
      title: 'Bounded design drill shape',
      description: 'Semaphores behind put/take — the Design Bounded Blocking Queue core.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class BoundedBuffer<T> {
    private final Deque<T> queue = new ArrayDeque<>();
    private final int capacity;

    public BoundedBuffer(int capacity) {
        this.capacity = capacity;
    }

    /** Mirrors BlockingQueue.put: wait while full, signal non-empty after. */
    public synchronized void enqueue(T value) throws InterruptedException {
        while (queue.size() == capacity) {
            wait();
        }
        queue.offerLast(value);
        notifyAll();
    }

    /** Mirrors BlockingQueue.take: wait while empty, signal non-full after. */
    public synchronized T dequeue() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        T value = queue.pollFirst();
        notifyAll();
        return value;
    }

    public synchronized int size() {
        return queue.size();
    }
}
`,
    },
  ],
  mistakes: [
    'Single poison pill for N consumers: one taker exits, the rest starve — count pills per consumer.',
    'Swallowing InterruptedException: blocked takes wake on shutdown — restore the flag or exit, never ignore.',
    'Default-constructing LinkedBlockingQueue as “bounded”: capacity is Integer.MAX_VALUE — pass an explicit bound.',
    'Single-taking under load: per-item lock round-trips — drainTo batches amortize the handoff cost.',
    'Nulls as sentinels: forbidden — null means “empty take”; poison must be a distinguishable value.',
    'Mixing offer (non-blocking) where backpressure is needed: dropped work looks like fast work — choose put/take deliberately.',
  ],
  vizId: 'pc-bounded',
  problemIds: ['design-bounded-blocking-queue', 'print-foobar-alternately', 'print-zero-even-odd'],
  javaBuiltIn: ['java.util.concurrent.ArrayBlockingQueue', 'java.util.concurrent.LinkedBlockingQueue'],
  related: ['concurrent-linked-queue', 'producer-consumer-collections', 'circular-queue'],
};
