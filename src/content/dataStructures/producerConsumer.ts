import type { Topic } from '../../types/content.ts';

/** Producer-Consumer with Collections: stages, pills, shutdown, and backpressure. */
export const producerConsumerTopic: Topic = {
  slug: 'producer-consumer-collections',
  title: 'Producer-Consumer with Collections',
  category: 'data-structures',
  order: 62,
  summary: 'Putting it together: poison pills, backpressure and shutdown patterns on top of blocking queues.',
  level: 'advanced',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['blocking-queue-family'],
  choiceBox: {
    choose: [
      'Work pipelines: producers feed, consumers drain, the queue absorbs bursts.',
      'Pipeline stages: queue-per-stage chains with independent scaling per stage.',
      'Graceful shutdown needs: pills + awaitTermination compose into clean exits.',
    ],
    avoid: [
      'Single-threaded fan-out — queues add nothing without concurrency; call the function.',
      'Unbounded queues as “simpler”: overload becomes OOM; bound and monitor instead.',
      'Shared mutable work items — publish immutable jobs or safe copies, never live state.',
    ],
  },
  sections: [
    {
      heading: 'The pattern in one picture',
      body: 'Producers `put` work items; consumers `take` them; the bounded queue between them absorbs bursts and applies backpressure both ways (full parks producers, empty parks consumers). Scale by adding consumers — the queue serializes nothing, `take` load-balances naturally.\n\n- One queue per stage chains pipelines: parse → validate → persist, each stage independently sized.\n- `drainTo` batches turn per-item handoff into bulk flow — consumers should drain, not nibble.\n- Monitor `size`/`remainingCapacity`: queue depth is the system’s pulse — alert on sustained full.',
    },
    {
      heading: 'Shutdown: pills, joins, and interrupts',
      body: 'A consumer blocked in `take()` waits forever — stopping the system needs choreography:\n\n| Step | Mechanism |\n| --- | --- |\n| Signal end of work | N poison pills (one per consumer) |\n| Consumers exit | break on pill (re-offer for siblings if shared) |\n| Producer finishes first | `shutdown()` after last pill offered |\n| Bounded wait | `awaitTermination(timeout)` then `shutdownNow()` |\n| Unblock stuck takes | `shutdownNow()` interrupts parked threads |\n\n`ExecutorService` owns thread lifecycles; pills own *work* lifecycles — both halves are required. Interrupt handling (restore flag or exit) belongs in every catch block.',
    },
    {
      heading: 'Backpressure and load-shedding',
      body: 'When producers outrun consumers, something must yield: block (bounded `put`), drop (`offer` + drop-counter + metrics), or shed upstream (reject with `RejectedExecutionHandler`). The queue bound *is* the policy knob — size it from Little’s law (sustained throughput × tolerable latency).\n\n- Unbounded queues defer the decision to the GC (as `OutOfMemoryError`) — the worst policy is no policy.\n- `SynchronousQueue` pipelines apply maximum pressure: every put waits for a take — use when buffering itself is the bug.\n- Timed `offer(e, timeout)` bounds producer stalls: wait briefly, then shed with a metric.',
    },
    {
      heading: 'Work-item discipline',
      body: 'Items crossing threads must be safely published: immutable jobs (final fields, no setters) are automatically thread-safe; mutable payloads need copying at handoff. Results flow back via `Future` (from `submit`) or a second response queue — never via shared mutable slots.\n\n- One poison value per consumer; pills travel the same queue (ordering guarantees delivery after all real work).\n- FizzBuzz multithreaded, H2O building, and Zero-Even-Odd are this pattern as LeetCode drills: staged handoffs with condition coordination.',
    },
  ],
  complexity: [
    { operation: 'put / take handoff', best: 'O(1)', average: 'O(1)', worst: 'blocks', space: 'O(cap)' },
    { operation: 'drainTo batch (k)', best: 'O(k)', average: 'O(k)', worst: 'O(k)', space: 'O(cap)' },
    { operation: 'Poison-pill shutdown (N consumers)', best: 'O(N)', average: 'O(N)', worst: 'O(N)', space: 'O(cap)' },
  ],
  javaCode: [
    {
      title: 'Pipeline with stages and metrics',
      description: 'Two stages, pill shutdown, queue-depth pulse — the production shape.',
      code: `import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.LongAdder;

public class Pipeline {
    private static final String POISON = "POISON";

    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> raw = new ArrayBlockingQueue<>(8);
        BlockingQueue<String> cooked = new ArrayBlockingQueue<>(8);
        LongAdder done = new LongAdder();
        ExecutorService pool = Executors.newFixedThreadPool(4);

        pool.submit(() -> { // producer
            try {
                for (int i = 0; i < 10; i++) {
                    raw.put("item-" + i);
                }
                raw.put(POISON);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        pool.submit(() -> { // stage: upper-case, 2 workers
            try {
                while (true) {
                    String item = raw.take();
                    if (item.equals(POISON)) {
                        cooked.put(POISON);
                        break;
                    }
                    cooked.put(item.toUpperCase());
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        for (int c = 0; c < 2; c++) { // consumers
            pool.submit(() -> {
                try {
                    while (true) {
                        String item = cooked.take();
                        if (item.equals(POISON)) {
                            cooked.put(POISON); // pass to the sibling
                            break;
                        }
                        done.increment();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("done=" + done.sum() + " rawDepth=" + raw.size());
    }
}
`,
    },
    {
      title: 'H2O barrier sketch',
      description: 'Condition handoff behind a queue — the Building H2O shape.',
      code: `import java.util.concurrent.Semaphore;

public class H2OBarrier {
    private final Semaphore hydrogen = new Semaphore(2); // two H per molecule
    private final Semaphore oxygen = new Semaphore(0); // gated on H pair

    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {
        hydrogen.acquire();
        releaseHydrogen.run();
        if (hydrogen.availablePermits() == 0) {
            oxygen.release(); // pair complete: admit one O
        }
    }

    public void oxygen(Runnable releaseOxygen) throws InterruptedException {
        oxygen.acquire();
        releaseOxygen.run();
        hydrogen.release(2); // reset for the next molecule
    }
}
`,
    },
  ],
  mistakes: [
    'One pill for many consumers: stranded takers wait forever — N pills, or re-offer on receipt.',
    'Forgetting shutdown/awaitTermination: non-daemon pool threads hold the JVM open — always close the lifecycle.',
    'Unbounded middle queues: stage imbalance OOMs silently — bound every queue, monitor every depth.',
    'Sharing mutable items: publication without safety — immutable jobs or defensive copies at handoff.',
    'Swallowing interrupts in takes: shutdownNow cannot stop deaf threads — restore the flag or exit.',
    'Polling with sleep instead of take: latency plus CPU burn — blocking takes exist precisely to avoid this.',
  ],
  vizId: 'pc-bounded',
  problemIds: ['design-bounded-blocking-queue', 'building-h2o', 'fizz-buzz-multithreaded'],
  javaBuiltIn: ['java.util.concurrent.ExecutorService', 'java.util.concurrent.ArrayBlockingQueue'],
  related: ['blocking-queue-family', 'concurrent-linked-queue', 'circular-queue'],
};
