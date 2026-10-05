import type { Topic } from '../../types/content.ts';

/** ConcurrentHashMap: lock-free reads, bin-locked writes, atomic compounds. */
export const concurrentHashMapTopic: Topic = {
  slug: 'concurrent-hashmap',
  title: 'ConcurrentHashMap',
  category: 'data-structures',
  order: 56,
  summary: 'Striped locks and CAS bins: how ConcurrentHashMap scales reads and writes, plus atomic helpers like computeIfAbsent.',
  level: 'intermediate',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['hashmap-internals', 'concurrent-overview'],
  choiceBox: {
    choose: [
      'Any map shared across threads: caches, counters, registries, dedupe sets (`newKeySet()`).',
      'High read ratios: `get` is lock-free and current — readers never block writers.',
      'Atomic compounds: `merge`/`computeIfAbsent`/`putIfAbsent` replace check-then-act sequences.',
    ],
    avoid: [
      '`null` keys or values — forbidden (unlike HashMap); absence is the only “empty” signal.',
      'Multi-key atomicity: per-bin atomicity only — cross-key transactions need external locking.',
      'Iteration-time consistency: weakly consistent views, not snapshots — copy first for point-in-time reads.',
    ],
  },
  sections: [
    {
      heading: 'Bins, CAS, and synchronized heads',
      body: 'Modern `ConcurrentHashMap` keeps `HashMap`’s table/buckets but synchronizes **per bin-head** (the first node), not per table: threads writing different buckets never contend. Empty bins install via **CAS** (compare-and-swap: atomic “write only if still empty”), and `get` reads `volatile` fields with no locks at all.\n\n- Old “segments” (16 striped locks) are gone since Java 8 — bin-level locking plus CAS scales further and adapts to the actual collision pattern.\n- Treeification applies per bin like `HashMap`, with `TreeBin` wrappers that coordinate readers during structural changes.\n- Resizing happens cooperatively: threads that arrive mid-resize *help move bins* (`transfer`) instead of waiting — throughput scales with helper count.',
    },
    {
      heading: 'Atomic compounds: the real API',
      body: 'Single ops are safe everywhere; the map earns its keep on compounds executed atomically per bin: `putIfAbsent` (insert-only-if-missing), `computeIfAbsent` (lazy load), `compute` (read-modify-write), `merge` (combine with existing), `replace(key, old, new)` (compare-and-set). The `merge` one-liner in Java code below is the entire concurrent-counter idiom — and for hot numeric tallies `LongAdder` beats even `merge` (striped cells beat bin locks under write storms): count in adders, keep categories in the map.',
    },
    {
      heading: 'Weak consistency and bulk ops',
      body: 'Iterators and views never throw: they traverse live bins and reflect *some* recent state — no snapshots, no locks. Bulk operations exploit this with parallelism thresholds: `forEach(parallelismThreshold, action)`, `search`, and `reduce` split the table across the common pool.\n\n- `mappingCount()` (a `long`) replaces `size()` for huge maps — `size()` still works but sums bins with less care.\n- Need a set? `ConcurrentHashMap.newKeySet()` (and `newKeySet(size)`) gives a concurrent `Set` backed by the same machinery.',
    },
    {
      heading: 'Head-to-head: HashMap vs synchronizedMap vs CHM',
      body: 'Three maps, three stories:\n\n| | `HashMap` | `synchronizedMap` | `ConcurrentHashMap` |\n| --- | --- | --- | --- |\n| Read cost | O(1), unsafe | O(1) + global lock | O(1), lock-free |\n| Write scaling | corrupts | serializes all | bin-level parallelism |\n| Nulls | key+values | key+values | forbidden |\n| Iteration | fail-fast | manual locking | weakly consistent |\n| Compounds | race | race (still!) | atomic per bin |\n\n`synchronizedMap` keeps `HashMap` semantics plus a single mutex: safe single calls, serialized throughput, and iteration that demands external `synchronized (map)` blocks. CHM changes the semantics (no nulls, live iterators) to buy scale.',
    },
  ],
  complexity: [
    { operation: 'get (lock-free, volatile)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'put / remove (bin lock + CAS)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'merge / computeIfAbsent (atomic)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'forEach / search / reduce (parallel)', best: 'O(n/p)', average: 'O(n/p)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Word count with ExecutorService',
      description: 'merge() across threads: the counter that cannot lose updates.',
      code: `import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ConcurrentCount {
    public static void main(String[] args) throws InterruptedException {
        Map<String, Integer> counts = new ConcurrentHashMap<>();
        List<String> docs = List.of("a b a", "b c", "a c c");

        ExecutorService pool = Executors.newFixedThreadPool(3);
        for (String doc : docs) {
            pool.submit(() -> {
                for (String w : doc.split(" ")) {
                    counts.merge(w, 1, Integer::sum); // atomic per key
                }
            });
        }
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println(counts); // {a=3, b=2, c=3} — always exact
    }
}
`,
    },
    {
      title: 'Cache + key set idioms',
      description: 'computeIfAbsent loading and the concurrent Set face.',
      code: `import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class ChmIdioms {
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    String load(String key) {
        // Loader runs at most once per key as long as it completes;
        // recursive computeIfAbsent on the same map deadlocks — never nest it.
        return cache.computeIfAbsent(key, k -> "value-for-" + k);
    }

    public static void main(String[] args) {
        ChmIdioms demo = new ChmIdioms();
        System.out.println(demo.load("a"));

        // A true concurrent Set backed by the same machinery.
        Set<String> seen = ConcurrentHashMap.newKeySet();
        seen.add("x");
        System.out.println(seen.contains("x")); // true, lock-free read
    }
}
`,
    },
  ],
  mistakes: [
    'Null keys/values: NullPointerException by design — use sentinel values or Optional to represent absence.',
    'Recursive computeIfAbsent: the bin lock is held during mapping — nesting on the same map deadlocks.',
    'Assuming snapshot iteration: weakly consistent views miss concurrent writes — copy (new HashMap<>(chm)) for point-in-time.',
    'Cross-key transactions: per-bin atomicity only — multi-key invariants need external locking or redesign.',
    'size() on gigantic maps: int overflow past 2^31 — mappingCount() returns long safely.',
    'Side-effecting mapping functions: compute may retry under contention — keep mapping functions pure and fast.',
  ],
  vizId: 'chm-segments',
  problemIds: ['design-hit-counter', 'lfu-cache'],
  practiceNote: 'Closest verified drills: Hit Counter (sliding-window maps) and LFU Cache (companion structure) — no bank drill isolates CHM mechanics; the race demo on the Overview shows what it prevents.',
  javaBuiltIn: ['java.util.concurrent.ConcurrentHashMap'],
  related: ['hashmap-internals', 'concurrent-overview', 'synchronized-wrappers'],
};
