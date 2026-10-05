import type { Topic } from '../../types/content.ts';

/** Thread-Safe Collections Overview: why plain collections break, and the map of fixes. */
export const concurrentOverviewTopic: Topic = {
  slug: 'concurrent-overview',
  title: 'Thread-Safe Collections Overview',
  category: 'data-structures',
  order: 55,
  summary: 'The concurrency map: synchronized wrappers, concurrent collections and queues — what to reach for and when.',
  level: 'intermediate',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['collections-framework'],
  choiceBox: {
    choose: [
      '`ConcurrentHashMap` for shared maps; concurrent queues for handoffs; `CopyOnWriteArrayList` for read-heavy listener lists.',
      'Blocking queues (`LinkedBlockingQueue`) for producer-consumer with backpressure built in.',
      '`LongAdder`/`Atomic*` for counters — not a map holding an `Integer` you read-modify-write.',
    ],
    avoid: [
      'Sharing `ArrayList`/`HashMap` across threads “because it usually works” — races are timing-dependent, not absent.',
      '`Vector`/`Hashtable` as the fix — per-method sync without compound safety, plus a global lock bottleneck.',
      '`Collections.synchronizedXxx` without external locking on iteration — the wrapper covers calls, not loops.',
    ],
  },
  sections: [
    {
      heading: 'Why normal collections break',
      body: 'Two threads `put` into a `HashMap` and entries vanish; two threads `add` to an `ArrayList` and the size lies. The causes compose: **lost updates** (read-modify-write interleaves), **torn structures** (resize/rehash mid-read exposes half-moved tables), and **fail-fast roulette** (iterators trip — or worse, silently skip — on concurrent change).\n\nThe race demo below runs two writers deterministically step-by-step: they interleave on one bucket and an entry silently overwrites the other. The full runnable version (thread pool included) is in Java code.',
    },
    {
      heading: 'The three families of fixes',
      body: 'Every thread-safe collection picks a strategy:\n\n| Family | Mechanism | Members |\n| --- | --- | --- |\n| **Wrappers** | one lock around every method | `Collections.synchronizedList/Map` |\n| **Concurrent** | fine-grained locks, CAS, lock-free reads | `ConcurrentHashMap`, `ConcurrentLinkedQueue`, `ConcurrentSkipListMap` |\n| **Copy-on-write** | mutate a fresh copy, swap the reference | `CopyOnWriteArrayList/Set` |\n| **Blocking queues** | locks + conditions, waiting built in | `Array/LinkedBlockingQueue`, `SynchronousQueue`, `DelayQueue` |\n\nWrappers are simple and slow-ish; concurrent collections scale; copy-on-write fits read-heavy data; blocking queues coordinate threads instead of just storing.',
    },
    {
      heading: 'Compound actions: the universal hole',
      body: 'No collection makes **sequences** atomic: `if (!map.containsKey(k)) map.put(k, v)` races no matter the map — between the check and the act, another thread slips in. Concurrent collections fix this with **single-call compounds**: `putIfAbsent`, `computeIfAbsent`, `merge`, `compute` execute atomically (per-bin) inside the structure.\n\n- Queues: `drainTo` moves batches atomically; `poll(timeout)` waits-and-takes as one call.\n- Rule: if correctness spans two calls, find the one call that spans it — or lock externally around both.',
    },
    {
      heading: 'Visibility, not just atomicity',
      body: 'Locks and concurrent structures also publish memory: writes inside `synchronized` (or before a `volatile` write / queue handoff) become visible to the next thread that synchronizes. A `HashMap` guarded by nothing can show *stale* data forever on some architectures — `volatile` reference + immutable snapshots is the minimal safe publication pattern.\n\n- `final` fields of safely-published objects are always visible — immutability does half the concurrency job.\n- `ConcurrentHashMap.get` is lock-free *and* current: volatile reads per bin, no stale caches.',
    },
  ],
  complexity: [
    { operation: 'Unsynchronized shared access', best: 'racy', average: 'racy', worst: 'corrupt / lost', space: 'O(n)' },
    { operation: 'Wrapper (single global lock)', best: 'O(op)', average: 'O(op)', worst: 'O(op) + contention', space: 'O(n)' },
    { operation: 'CHM get / put (fine-grained)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'CopyOnWrite write / read', best: 'O(n) / O(1)', average: 'O(n) / O(1)', worst: 'O(n) / O(1)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'The race, runnable',
      description: 'Two threads, one HashMap, lost entries — then the one-line fix.',
      code: `import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class RaceDemo {
    static int race(Map<Integer, Integer> map) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        for (int t = 0; t < 2; t++) {
            final int base = t * 1000;
            pool.submit(() -> {
                for (int i = 0; i < 1000; i++) {
                    map.put(base + i, i); // distinct keys — still races on resize!
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        return map.size();
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("HashMap size=" + race(new HashMap<>()));
        System.out.println("CHM size=" + race(new ConcurrentHashMap<>()));
    }
}
`,
    },
    {
      title: 'Compound actions done right',
      description: 'putIfAbsent/computeIfAbsent/merge: the atomic one-call versions.',
      code: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class AtomicCompounds {
    public static void main(String[] args) throws InterruptedException {
        Map<String, Integer> counts = new ConcurrentHashMap<>();
        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int t = 0; t < 4; t++) {
            pool.submit(() -> {
                for (int i = 0; i < 1000; i++) {
                    counts.merge("hits", 1, Integer::sum); // atomic per key
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("hits=" + counts.get("hits")); // always 4000

        // Lazy cache fill without double-compute (mostly): one call, atomic per bin.
        Map<String, String> cache = new ConcurrentHashMap<>();
        String v = cache.computeIfAbsent("config", k -> "loaded-" + k);
        System.out.println(v);
    }
}
`,
    },
  ],
  mistakes: [
    '“Distinct keys, so no race”: resize/rehash is structural — disjoint keys still corrupt a HashMap together.',
    'Check-then-act on any map: containsKey+put races everywhere — putIfAbsent/computeIfAbsent/merge instead.',
    'Catching CME as a retry strategy: corruption already happened — the exception is a symptom, not a signal.',
    'Synchronizing the block but iterating the wrapper outside it: iteration needs the same lock held throughout.',
    'Assuming “it passed tests”: races are schedule-dependent — stress with thread pools and repeats, never single runs.',
    'Sharing Random/SimpleDateFormat-style stateful helpers alongside collections: thread-safety is a whole-program property.',
  ],
  vizId: 'race-demo',
  problemIds: ['print-in-order', 'the-dining-philosophers', 'traffic-light-controlled-intersection'],
  javaBuiltIn: ['java.util.concurrent.ConcurrentHashMap', 'java.util.concurrent.ExecutorService'],
  related: ['synchronized-wrappers', 'concurrent-hashmap', 'hashmap-internals'],
};
