import type { Topic } from '../../types/content.ts';

/** Collections.synchronizedXxx Wrappers: one lock, many holes. */
export const synchronizedWrappersTopic: Topic = {
  slug: 'synchronized-wrappers',
  title: 'Collections.synchronizedXxx Wrappers',
  category: 'data-structures',
  order: 61,
  summary: "synchronizedList, synchronizedMap and friends: what they lock, what they don't, and the iteration trap.",
  level: 'intermediate',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['collections-utility', 'concurrent-overview'],
  choiceBox: {
    choose: [
      'Legacy code already using them — understand the contract before migrating.',
      'Low-contention maps/lists where a single lock’s simplicity beats CHM’s machinery.',
      'Wrapping for safe *publication* of rarely-mutated structures (with locked iteration).',
    ],
    avoid: [
      'Hot shared state — one global lock serializes all threads; CHM/queues scale.',
      'Iteration without external locking — the wrapper never covers loops.',
      'Compound logic — check-then-act races identically through the wrapper.',
    ],
  },
  sections: [
    {
      heading: 'One mutex around every method',
      body: '`Collections.synchronizedList(list)` returns a view whose methods (`get`, `add`, `size`, …) each synchronize on a shared **mutex** (itself, by default). Single calls become atomic and memory-visible — the map/list underneath is an ordinary `ArrayList`/`HashMap` with identical layout and iteration order.\n\n- `synchronizedMap`, `synchronizedSet`, `synchronizedSortedMap/Set`, `synchronizedCollection/Queue/Deque/NavigableMap/Set` cover the whole framework.\n- The mutex is exposed (`getMutex` is not public, but `synchronized (wrapped)` on the wrapper synchronizes on it) — external locking uses the wrapper itself as the lock.',
    },
    {
      heading: 'What the lock does not cover',
      body: 'Everything spanning more than one call: iteration, check-then-act, bulk logic. The canonical trap is looping over a synchronized list bare: the for-each takes its iterator outside any lock, so a concurrent `add` trips fail-fast (or worse). The documented pattern wraps the *entire loop* in a `synchronized` block on the wrapper itself — the runnable trap-and-fix is in Java code below. Same for `containsKey`+`put`, `isEmpty`+`poll`, `size`-gated logic — all race through the wrapper.',
    },
    {
      heading: 'Head-to-head: wrapper vs concurrent vs plain',
      body: 'The decision in one table:\n\n| | plain `ArrayList`/`HashMap` | `synchronizedXxx` | concurrent (`CHM`/queues) |\n| --- | --- | --- | --- |\n| Single-call safety | no | yes (one lock) | yes (fine-grained) |\n| Iteration safety | fail-fast | manual `synchronized` block | weakly consistent, no locks |\n| Throughput | fastest single-thread | serializes all threads | scales |\n| Compounds | race | race | atomic one-calls |\n| Memory overhead | baseline | one mutex object | bins/cells machinery |\n\nMigrate wrapper → concurrent when contention or compounds appear; keep wrappers where contention is theoretical and code churn is expensive.',
    },
    {
      heading: 'Locking the loop correctly',
      body: 'The safe iteration pattern synchronizes on the wrapper for the whole traversal — including streams created from it (wrap the terminal op’s execution, or snapshot with `copyOf` first). `toArray` is the cheap escape hatch: one locked call copies, then iterate the array lock-free.\n\n- Deadlock risk: locking the wrapper while calling foreign code (listeners) that re-enters the map — keep locked regions leaf-only.\n- `synchronizedMap` + `computeIfAbsent`: the default method synchronizes per call, but the *mapping function* runs under the global lock — slow loaders stall every thread.',
    },
  ],
  complexity: [
    { operation: 'Single op (global lock)', best: 'O(op)', average: 'O(op)', worst: 'O(op) + contention', space: 'O(n)' },
    { operation: 'Locked iteration (n)', best: 'O(n)', average: 'O(n)', worst: 'O(n) + contention', space: 'O(n)' },
    { operation: 'toArray snapshot', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'The trap and the fix, runnable',
      description: 'Unsynchronized iteration trips; the synchronized block holds.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class WrapperTrap {
    public static void main(String[] args) throws InterruptedException {
        List<Integer> safe = Collections.synchronizedList(new ArrayList<>());
        for (int i = 0; i < 100; i++) {
            safe.add(i);
        }

        ExecutorService pool = Executors.newFixedThreadPool(2);
        pool.submit(() -> {
            for (int i = 100; i < 200; i++) {
                safe.add(i); // concurrent writer
            }
        });
        pool.submit(() -> {
            int sum = 0;
            // THE fix: hold the wrapper lock for the whole traversal.
            synchronized (safe) {
                for (int v : safe) {
                    sum += v;
                }
            }
            System.out.println("sum=" + sum);
        });
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
    }
}
`,
    },
    {
      title: 'Snapshot-and-release pattern',
      description: 'One locked copy, then iterate freely — minimal contention.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SnapshotEscape {
    private final List<String> events = Collections.synchronizedList(new ArrayList<>());

    public void record(String e) {
        events.add(e);
    }

    /** Copy under the lock, process outside it: readers never block writers long. */
    public List<String> drain() {
        synchronized (events) {
            List<String> copy = new ArrayList<>(events);
            events.clear();
            return copy;
        }
    }

    public static void main(String[] args) {
        SnapshotEscape log = new SnapshotEscape();
        log.record("a");
        log.record("b");
        System.out.println(log.drain()); // [a, b]
        System.out.println(log.drain()); // []
    }
}
`,
    },
  ],
  mistakes: [
    'Iterating without synchronized: the #1 wrapper bug — for-each, streams, and toString all need the lock held.',
    'Streaming without holding the lock: pipelines evaluate lazily — the traversal escapes the synchronized block.',
    'Check-then-act through the wrapper: two locked calls, one unlocked gap — putIfAbsent/compute live on concurrent maps.',
    'Slow mapping functions in computeIfAbsent: global lock held during load — every thread stalls behind one fetch.',
    'Locking the wrapper while calling back out: listener re-entry deadlocks — keep locked regions leaf-only.',
    'Choosing wrappers for hot state: single-lock throughput caps early — measure, then migrate to concurrent types.',
  ],
  vizId: 'race-demo',
  problemIds: ['print-in-order', 'the-dining-philosophers'],
  practiceNote: 'Closest verified drills: ordering and lock-discipline problems — the iteration trap above is the interview payload; Dining Philosophers rewards the same lock-ordering care.',
  javaBuiltIn: ['java.util.Collections'],
  related: ['concurrent-overview', 'concurrent-hashmap', 'vector-stack-legacy'],
};
