import type { Topic } from '../../types/content.ts';

/** TreeMap & NavigableMap: sorted keys, neighbor queries, and live range views. */
export const treeMapTopic: Topic = {
  slug: 'treemap-navigablemap',
  title: 'TreeMap & NavigableMap',
  category: 'data-structures',
  order: 44,
  summary: 'Sorted maps on red-black trees: floor/ceiling/subMap views and comparators that must stay consistent.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['binary-search-tree', 'collections-framework'],
  choiceBox: {
    choose: [
      'Sorted keys, ranges, “nearest” queries: `floorKey`, `ceilingEntry`, `subMap`, `headMap`.',
      'Schedules, leaderboards by score, time-series keyed by timestamp.',
      'Deterministic sorted output without a separate sort pass.',
    ],
    avoid: [
      'Plain lookups — `HashMap` is O(1); TreeMap pays O(log n) per op plus red-black overhead.',
      'Inconsistent comparators: compare==0 must mean “same key” or entries silently overwrite.',
      'Null keys with a custom comparator — allowed only under natural ordering; avoid regardless.',
    ],
  },
  sections: [
    {
      heading: 'A red-black tree with a Map face',
      body: 'Internally `TreeMap` is a red-black tree keyed by the map’s keys (see Red-Black Tree for the balancing rules): every `get`/`put`/`remove` walks `O(log n)` comparisons, and iteration is an inorder walk — always sorted, always deterministic.\n\nThe `NavigableMap` interface is the payoff over a bare sorted structure: `lowerKey`/`floorKey`/`ceilingKey`/`higherKey` find neighbours, `firstKey`/`lastKey` grab extremes, and `pollFirstEntry`/`pollLastEntry` remove-and-return them. These exist on no hash map at any price.',
    },
    {
      heading: 'Views: subMap, headMap, tailMap',
      body: '`subMap(from, to)` returns a **live view** bounded by keys — writes through it hit the original, and vice versa. The two-arg form is half-open `[from, to)`; the four-arg form takes inclusivity flags per end (`subMap(2, true, 5, false)`).\n\n- Views are cheap (no copying) and reflect concurrent modification — structural changes to the backing map show through immediately.\n- `headMap(to)` / `tailMap(from)` are the one-sided equivalents; `descendingMap()` flips the whole order.\n- Range scans (“all events in [t1, t2)”) iterate the view directly — no filtering, no sorting.',
    },
    {
      heading: 'Comparator consistency is the contract',
      body: 'With natural ordering, keys must implement `Comparable` consistently with `equals`. With a custom `Comparator`, `compare(a,b)==0` *defines* key equality: two distinct objects comparing 0 **overwrite each other** — the map holds one entry, silently.\n\n- Comparators must be transitive and consistent, or the tree corrupts (infinite loops are possible, not just wrong answers).\n- Case-insensitive keys? `String.CASE_INSENSITIVE_ORDER` — but remember “A” and “a” then collide by design.\n- Key sets from `TreeMap` inherit the order: `keySet()` iterates sorted — free sorted-keys views.',
    },
    {
      heading: 'Schedules and time series',
      body: '`Time Based Key-Value Store` is the signature drill: `floorEntry(timestamp)` retrieves the latest value at-or-before t — a one-liner on `TreeMap`, a binary search by hand on anything else. `Hand of Straights` consumes straights via ordered counts. Calendar conflict checks (`ceilingKey(start)` vs next booking’s start) reduce to two neighbour queries.',
    },
  ],
  complexity: [
    { operation: 'get / put / remove', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'floor / ceiling / lower / higher', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'first / last / pollFirst / pollLast', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'subMap view creation / scan k', best: 'O(1) / O(k)', average: 'O(1) / O(k)', worst: 'O(log n) / O(k)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Neighbour queries and range views',
      description: 'floorKey, subMap windows, and descending iteration.',
      code: `import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

public class NavigableIdioms {
    public static void main(String[] args) {
        NavigableMap<Integer, String> schedule = new TreeMap<>();
        schedule.put(9, "standup");
        schedule.put(11, "review");
        schedule.put(14, "deploy");
        schedule.put(16, "retro");

        System.out.println(schedule.floorKey(12)); // 11 — latest at-or-before noon
        System.out.println(schedule.ceilingKey(12)); // 14 — next after noon

        // Live window [9, 14): writes here land in the original map.
        NavigableMap<Integer, String> morning = schedule.subMap(9, true, 14, false);
        morning.put(10, "coffee");
        System.out.println(schedule); // {9=standup, 10=coffee, 11=review, ...}

        for (Map.Entry<Integer, String> e : schedule.descendingMap().entrySet()) {
            System.out.print(e.getKey() + " "); // 16 14 11 10 9
        }
    }
}
`,
    },
    {
      title: 'Time-based store interview core',
      description: 'floorEntry turns timestamped history into one lookup.',
      code: `import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class TimeStore {
    private final Map<String, TreeMap<Integer, String>> store = new HashMap<>();

    public void set(String key, String value, int timestamp) {
        store.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
    }

    public String get(String key, int timestamp) {
        TreeMap<Integer, String> history = store.get(key);
        if (history == null) {
            return "";
        }
        Map.Entry<Integer, String> e = history.floorEntry(timestamp);
        return e == null ? "" : e.getValue();
    }

    public static void main(String[] args) {
        TimeStore ts = new TimeStore();
        ts.set("file", "v1", 1);
        ts.set("file", "v2", 4);
        System.out.println(ts.get("file", 3)); // v1 — latest at-or-before 3
        System.out.println(ts.get("file", 4)); // v2
    }
}
`,
    },
  ],
  mistakes: [
    'Inconsistent comparator: compare==0 on distinct keys silently overwrites — equality must match key identity intent.',
    'Using subMap(to, from) reversed bounds: from > to throws IllegalArgumentException — order the ends.',
    'Mutating keys’ compared fields after put: the tree position freezes at insertion — entries become unreachable.',
    'Assuming HashMap speed: every op is O(log n) with red-black constants — plain lookups belong to HashMap.',
    'Modifying through a view during iteration of the original: views are live — concurrent structural change fails fast.',
    'Null keys with comparators: only natural ordering tolerates one null — custom comparators NPE on it.',
  ],
  vizId: 'treemap-rotations',
  problemIds: ['hand-of-straights', 'time-based-key-value-store'],
  practiceNote: 'Two verified drills cover the signature patterns (ordered counts, floor-entry history) — the remaining NavigableMap surface (views, descending maps) is API fluency from the sections above.',
  javaBuiltIn: ['java.util.TreeMap', 'java.util.NavigableMap'],
  related: ['binary-search-tree', 'red-black-tree', 'hashmap-internals'],
};
