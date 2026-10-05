import type { Topic } from '../../types/content.ts';

/** Collections Framework Map: the hub — interfaces, classes, and default picks. */
export const collectionsFrameworkMapTopic: Topic = {
  slug: 'collections-framework',
  title: 'Collections Framework Map',
  category: 'data-structures',
  order: 35,
  summary: 'The big picture: Collection vs Map, List vs Set vs Queue, and how the interfaces fit together.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: [],
  choiceBox: {
    choose: [
      '**ArrayList** as the default list, **HashMap** as the default map, **HashSet** as the default set — reach for these first.',
      'Sorted or ranged data → the **Tree** variants; insertion order → the **Linked** variants; threads → the **Concurrent** group.',
      'Declare variables as **interfaces** (`List`, `Map`) so the implementation can change in one constructor call.',
    ],
    avoid: [
      'Using `Vector`, `Stack`, or `Hashtable` in new code — synchronized legacies superseded by faster unsynchronized classes.',
      'Picking by gut feeling: order, sorting, nulls, and thread-safety decide — the map below makes it mechanical.',
      'Storing primitives in collections without thought: every `int` boxes to `Integer` — arrays win for hot numeric loops.',
    ],
  },
  sections: [
    {
      heading: 'One framework, two hierarchies',
      body: 'The framework splits in two. **`Collection`** holds single elements and branches into `List` (ordered by index), `Set` (unique members), and `Queue`/`Deque` (ends-first processing). **`Map`** stands apart: it holds key→value pairs and is *not* a `Collection` — no iteration, no `add`, just `put`, `get`, and views (`keySet`, `values`, `entrySet`).\n\nEverything is used through **interfaces**: `Collection` adds `add`, `remove`, `size`, and an `iterator()`; `Iterable` (the root of it all) is what makes for-each loops work. The clickable map in the Visualization section walks every interface to its implementations — follow it once and the group stops feeling like alphabet soup.',
    },
    {
      heading: 'The default triad (and when to leave it)',
      body: 'Three classes cover ~90% of code: `ArrayList` (indexed, cache-friendly), `HashMap` (`O(1)` lookup), `HashSet` (`O(1)` membership). Leave the triad only for a named reason:\n\n- Need **sorted** keys or ranges (`floorKey`, `headSet`)? → `TreeMap` / `TreeSet` (`O(log n)`, red-black inside).\n- Need **insertion order** preserved? → `LinkedHashMap` / `LinkedHashSet` (hash plus a running order list).\n- Need **access order** (LRU)? → `LinkedHashMap` in access-order mode.\n- Need **stack/queue** ends? → `ArrayDeque` (never `Stack`, never `LinkedList` for this).\n- Need **priority** order? → `PriorityQueue` (a binary heap).\n- Need **threads**? → leave `java.util` for `java.util.concurrent` (see the Concurrent group).',
    },
    {
      heading: 'Program to interfaces',
      body: 'Write `List<String> names = new ArrayList<>()`, not `ArrayList<String> names`. The interface carries every operation you need; the constructor names the one decision (layout, ordering, thread-safety) that can change later without touching call sites. Methods should accept `List`, `Set`, `Map` — tests then pass `List.of(...)` fixtures and production passes anything faster.\n\nTwo corollaries: use the **diamond** (`<>`) so generic types are written once, and prefer `List.of`/`Map.of` for fixed data — immutable snapshots with zero builder ceremony.',
    },
    {
      heading: 'Ordering, nulls, and the fine print',
      body: '`HashMap`/`HashSet` order is unspecified and *shifts after resizes* — never depend on it, never assert on it. `TreeMap`/`TreeSet` order by `Comparable`/`Comparator` (one `null` key allowed only with natural ordering absent — in practice, avoid null keys there). `ArrayList`/`LinkedList`/`ArrayDeque` accept many nulls; `ArrayDeque` and all queues reject `null` elements (they use `null` as “empty” signals); `PriorityQueue` forbids nulls entirely.\n\n- `equals`/`hashCode` contracts power every hash structure: break them and entries vanish.\n- Mutating a key’s hash-relevant fields after insertion strands the entry — keys should be effectively immutable.',
    },
  ],
  complexity: [
    { operation: 'ArrayList get / set', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'HashMap / HashSet get / add', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'TreeMap / TreeSet op', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'ArrayDeque offer / poll', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Program to interfaces',
      description: 'One constructor names the implementation; everything else speaks interfaces.',
      code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProgramToInterfaces {
    /** Accepts any List — ArrayList today, anything tomorrow. */
    static int totalLength(List<String> words) {
        int total = 0;
        for (String w : words) {
            total += w.length();
        }
        return total;
    }

    public static void main(String[] args) {
        List<String> words = new ArrayList<>(List.of("ash", "birch", "cedar"));
        Map<String, Integer> lengths = new HashMap<>();
        for (String w : words) {
            lengths.put(w, w.length());
        }
        System.out.println(totalLength(words)); // 14
        System.out.println(lengths.getOrDefault("oak", -1)); // -1, no null check
    }
}
`,
    },
    {
      title: 'Frequency map interview core',
      description: 'getOrDefault + merge: the two lines behind countless solutions.',
      code: `import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FrequencyCore {
    static Map<String, Integer> frequencies(List<String> words) {
        Map<String, Integer> counts = new HashMap<>();
        for (String w : words) {
            counts.merge(w, 1, Integer::sum); // insert-or-add, atomically per call
        }
        return counts;
    }

    public static void main(String[] args) {
        System.out.println(frequencies(List.of("a", "b", "a", "c", "b", "a")));
    }
}
`,
    },
  ],
  mistakes: [
    'Declaring ArrayList/HashMap everywhere: program to List/Map — concrete types freeze the one decision most likely to change.',
    'Depending on HashMap iteration order: it is unspecified and shifts on resize — LinkedHashMap for insertion order, TreeMap for sorted.',
    'Using raw types (List without <>): erasure plus raw types move type errors from compile time to ClassCastException at runtime.',
    'Storing an item, then mutating its key fields: the hash changes, the entry strands — keys must be effectively immutable.',
    'Passing Arrays.asList(...) where growth is needed: it is fixed-size — new ArrayList<>(Arrays.asList(...)) when appends follow.',
    'Reaching for Vector/Hashtable “to be safe”: synchronized-everything is slower and still not compound-safe — use java.util.concurrent instead.',
  ],
  vizId: 'collections-framework-map',
  problemIds: [],
  practiceNote: 'Hub topic: no drills here by design — pick a lane in the map above (each box links its topic) and practice there.',
  javaBuiltIn: ['java.util.Collection', 'java.util.Map', 'java.util.List', 'java.util.Set'],
  related: ['iterable-iterator', 'arraylist-jcf', 'hashmap-internals'],
};
