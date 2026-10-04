import type { Topic } from '../../types/content.ts';

/** Java Collections framework map: picking the right List, Set, Map, and Queue. */
export const collectionsTopic: Topic = {
  slug: 'collections-framework-map',
  title: 'Collections Framework Map',
  category: 'concepts',
  order: 8,
  summary: 'A decision map for java.util: ArrayList vs LinkedList, HashMap vs TreeMap, HashSet vs TreeSet, ArrayDeque vs PriorityQueue.',
  level: 'intermediate',
  prerequisites: ['dynamic-array', 'hash-table', 'stack'],
  sections: [
    {
      heading: 'Program to interfaces',
      body: 'Declare `List`, `Set`, `Map`, `Queue`, `Deque` — implement with the concrete class that fits. Interfaces keep options open: swapping `ArrayList` → `LinkedList` (or `HashMap` → `TreeMap`) touches one constructor, and methods accept any implementation.\n\nThe map below is ordered by *default choice first*: reach for the default unless a named reason pushes you elsewhere.',
    },
    {
      heading: 'The decision map',
      body: 'Lists: `ArrayList` default (indexing, cache); `LinkedList` only for deque-heavy splicing; `CopyOnWriteArrayList` for concurrent iteration.\n\nSets: `HashSet` default O(1); `LinkedHashSet` for insertion order; `TreeSet` for sorted O(log n); `EnumSet` for enums (bit-vector fast).\n\nMaps: `HashMap` default; `LinkedHashMap` for insertion/access order (LRU in 5 lines); `TreeMap` for sorted keys/ranges; `EnumMap` for enum keys.\n\nQueues: `ArrayDeque` for stack/queue/deque; `PriorityQueue` for ordered-by-priority; `LinkedBlockingQueue` across threads.',
    },
    {
      heading: 'Iteration and views that bite',
      body: 'Enhanced for-loops fail on structural modification mid-loop — use `Iterator.remove()`, `removeIf`, or collect-then-apply. `subList`, `keySet`, and `entrySet` are **views**: writes through them hit the original, and structural changes to the original invalidate them (`ConcurrentModificationException`).\n\n`List.of`/`Set.of`/`Map.of` build immutable snapshots; `Collections.unmodifiable*` wraps live ones. `Arrays.asList` is fixed-size but *writable* — the classic trap between the two.',
    },
  ],
  complexity: [
    { operation: 'ArrayList get / HashMap get', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'TreeMap / TreeSet op', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'LinkedList indexed get', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Picking implementations',
      description: 'One task, four canonical choices.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class Picking {
    public static void main(String[] args) {
        // Counting: HashMap default
        Map<String, Integer> freq = new HashMap<>();
        for (String w : List.of("a", "b", "a")) {
            freq.merge(w, 1, Integer::sum);
        }

        // Insertion-ordered counting: LinkedHashMap
        Map<String, Integer> ordered = new LinkedHashMap<>(freq);
        System.out.println(ordered); // {a=2, b=1}

        // Sorted keys with range views: TreeMap
        TreeMap<Integer, String> byScore = new TreeMap<>();
        byScore.put(50, "ada");
        byScore.put(30, "bob");
        byScore.put(40, "cid");
        System.out.println(byScore.firstKey()); // 30
        System.out.println(byScore.subMap(30, 50)); // {30=bob, 40=cid}

        // Stack discipline: ArrayDeque, not legacy Stack
        Deque<String> history = new ArrayDeque<>();
        history.push("home");
        System.out.println(history.peek()); // home
    }
}
`,
    },
    {
      title: 'LRU cache in five lines',
      description: 'LinkedHashMap access order does the work.',
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LruCache(int capacity) {
        super(capacity, 0.75f, true); // access order
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }

    public static void main(String[] args) {
        LruCache<Integer, String> cache = new LruCache<>(2);
        cache.put(1, "a");
        cache.put(2, "b");
        cache.get(1);
        cache.put(3, "c"); // evicts 2, not 1
        System.out.println(cache); // {1=a, 3=c}
    }
}
`,
    },
  ],
  mistakes: [
    'Defaulting to LinkedList: ArrayList wins on cache and constants for almost everything — measure first.',
    'Using legacy Vector/Stack/Hashtable: synchronized dinosaurs — prefer ArrayList/ArrayDeque/HashMap.',
    'Modifying during for-each: use removeIf or an explicit Iterator, or face ConcurrentModificationException.',
    'Trusting Arrays.asList as immutable: it is fixed-size but writable — List.of is the true immutable.',
    'Ignoring views: subList/keySet write through to the original; structural changes invalidate them.',
  ],
  problemIds: ['two-sum', 'group-anagrams', 'top-k-frequent-elements', 'design-hashmap'],
};
