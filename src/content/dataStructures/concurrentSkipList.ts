import type { Topic } from '../../types/content.ts';

/** ConcurrentSkipListMap & Set: lock-free sorted maps. */
export const concurrentSkipListTopic: Topic = {
  slug: 'concurrent-skiplist',
  title: 'ConcurrentSkipListMap & Set',
  category: 'data-structures',
  order: 60,
  summary: 'Sorted, lock-free maps on skip lists: concurrent navigation with log-time steps and no tree rotations.',
  level: 'advanced',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['skip-list', 'treemap-navigablemap'],
  choiceBox: {
    choose: [
      'Sorted maps/sets under concurrency: the ONLY concurrent `NavigableMap`/`NavigableSet` in the JDK.',
      'Range scans with writers active: weakly-consistent subMap views without locking.',
      'Leaderboards and time-series shared across threads where order plus scale both matter.',
    ],
    avoid: [
      'Plain concurrent lookup — `ConcurrentHashMap` is faster per op without ordering overhead.',
      'Memory-tight maps — multi-level index nodes cost more per entry than bins or tree nodes.',
      'Snapshot iteration — views are live and weakly consistent; copy for point-in-time reads.',
    ],
  },
  sections: [
    {
      heading: 'Skip lists go concurrent naturally',
      body: 'Balanced trees rebalance globally (rotations touch shared ancestors — locking nightmares); skip lists splice **locally** (a tower links into its lanes with CAS, lanes never rotate). `ConcurrentSkipListMap` exploits this: finds walk down like the sequential version, inserts CAS-link level by level, deletes mark-then-unlink — all lock-free, expected `O(log n)`.\n\n- Index levels use CAS on `next` pointers; contention retries locally instead of blocking globally.\n- No treeification, no bin locks, no segments — the structure that needed no rebalancing needs no rebalancing locks either.',
    },
    {
      heading: 'The concurrent NavigableMap',
      body: 'It implements the full `ConcurrentNavigableMap`: `floorKey`/`ceilingKey`, `subMap`/`headMap`/`tailMap` views, `firstKey`/`lastKey`, `pollFirstEntry`/`pollLastEntry` — sorted-map fluency under threads, which `ConcurrentHashMap` deliberately does not offer.\n\n- Views are live and weakly consistent: range scans run while writers write, never throwing.\n- `ConcurrentSkipListSet` is the set face (plus `newKeySet` equivalents via the map).\n- Compound ops (`putIfAbsent`, `compute`, `merge`) carry the same atomic guarantees as CHM’s.',
    },
    {
      heading: 'Head-to-head: sorted maps under threads',
      body: 'Three ways to sort concurrently:\n\n| | `ConcurrentSkipListMap` | `Collections.synchronizedSortedMap(TreeMap)` | `ConcurrentHashMap` |\n| --- | --- | --- | --- |\n| Sorted + ranges | yes, lock-free | yes, one global lock | no |\n| Single-op speed | O(log n) | O(log n) + contention | O(1) |\n| Iteration | weakly consistent | manual locking | weakly consistent |\n| Memory/entry | highest (towers) | tree nodes | bins |\n\nSynchronized sorted maps serialize everything (fine for tiny, terrible for hot); CHM is fastest but unordered; skip lists pay memory for lock-free order.',
    },
    {
      heading: 'Where it actually runs',
      body: 'In-memory time-series indexes (metrics with concurrent writers + range readers), concurrent leaderboards, ordered task queues with cancellation, and memtable-adjacent structures in storage engines. `ConcurrentNavigableMap` is also the type to *declare* when an API needs “sorted + threads” without naming the implementation.',
    },
  ],
  complexity: [
    { operation: 'get / put / remove (expected)', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'floor / ceiling / neighbours', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'subMap view / scan k', best: 'O(1) / O(k)', average: 'O(1) / O(k)', worst: 'O(log n) / O(k)', space: 'O(n)' },
    { operation: 'pollFirst / pollLast', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Concurrent leaderboard with ExecutorService',
      description: 'Writers CAS lanes while readers scan ranges — no locks anywhere.',
      code: `import java.util.Map;
import java.util.NavigableMap;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ConcurrentLeaderboard {
    private final NavigableMap<Integer, String> board = new ConcurrentSkipListMap<>();

    public static void main(String[] args) throws InterruptedException {
        ConcurrentLeaderboard lb = new ConcurrentLeaderboard();
        ExecutorService pool = Executors.newFixedThreadPool(4);

        // Writers: scores land concurrently, lanes splice lock-free.
        for (int i = 0; i < 100; i++) {
            final int score = i;
            pool.submit(() -> lb.board.put(score, "player-" + score));
        }
        // Reader: top-3 range scan while writers write — never throws.
        pool.submit(() -> {
            NavigableMap<Integer, String> top = lb.board.descendingMap();
            int shown = 0;
            for (Map.Entry<Integer, String> e : top.entrySet()) {
                if (shown++ >= 3) {
                    break;
                }
                System.out.print(e.getKey() + " ");
            }
        });
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("\nsize=" + lb.board.size()); // 100
    }
}
`,
    },
    {
      title: 'Time-series window scan',
      description: 'subMap over a live concurrent index — ranges without locking.',
      code: `import java.util.NavigableMap;
import java.util.concurrent.ConcurrentSkipListMap;

public class TimeSeries {
    private final NavigableMap<Long, Double> series = new ConcurrentSkipListMap<>();

    public void record(long timestamp, double value) {
        series.put(timestamp, value);
    }

    /** Live window [from, to): writers may add while this scans. */
    public double average(long from, long to) {
        NavigableMap<Long, Double> window = series.subMap(from, true, to, false);
        return window.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    public static void main(String[] args) {
        TimeSeries ts = new TimeSeries();
        ts.record(1000L, 1.0);
        ts.record(2000L, 3.0);
        ts.record(3000L, 5.0);
        System.out.println("avg=" + ts.average(1000L, 3000L)); // 2.0
    }
}
`,
    },
  ],
  mistakes: [
    'Using it for plain concurrent maps: O(log n) + tower memory vs CHM’s O(1) — order must justify the cost.',
    'Expecting snapshot views: subMap is live and weakly consistent — copy for point-in-time ranges.',
    'Comparing memory with TreeMap: index towers cost extra levels per entry — measure before large-scale adoption.',
    'Locking around it “to be safe”: lock-free structures plus external locks equal contention with extra steps.',
    'Assuming wait-free: lock-free means system progress, not per-thread bounds — retries cluster under write storms.',
    'Null keys/values: forbidden like CHM — sentinels or Optional for absence.',
  ],
  vizId: 'skip-list-ops',
  problemIds: [],
  practiceNote: 'Specialist topic: no verified drill isolates concurrent sorted maps — the Skip List visualization shows the lane mechanics; the leaderboard above is the usage pattern.',
  javaBuiltIn: ['java.util.concurrent.ConcurrentSkipListMap', 'java.util.concurrent.ConcurrentSkipListSet'],
  related: ['skip-list', 'treemap-navigablemap', 'concurrent-hashmap'],
};
