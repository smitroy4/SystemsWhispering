import type { Topic } from '../../types/content.ts';

/** LinkedHashMap & LRU Caches: hash speed with a predictable walk order. */
export const linkedHashMapTopic: Topic = {
  slug: 'linkedhashmap-lru',
  title: 'LinkedHashMap & LRU Caches',
  category: 'data-structures',
  order: 43,
  summary: 'HashMap with insertion or access order — the five-line LRU cache via removeEldestEntry.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['hashmap-internals'],
  choiceBox: {
    choose: [
      'Predictable iteration: insertion order for configs, manifests, deterministic output.',
      'LRU caches in five lines: access order + `removeEldestEntry` — the interview answer verbatim.',
      'Dedupe-while-preserving-order pipelines (with `LinkedHashSet` for the set half).',
    ],
    avoid: [
      'Sorted keys — order of arrival is not sorted order; `TreeMap` sorts.',
      'Concurrent caches — single-threaded only; `ConcurrentHashMap` + manual policy or Caffeine instead.',
      'Memory-sensitive huge maps — two extra references per entry add up past millions of entries.',
    ],
  },
  sections: [
    {
      heading: 'A linked list threaded through the buckets',
      body: '`LinkedHashMap` extends `HashMap`: same table, spreading, and resize — plus `before`/`after` pointers on every entry forming a **doubly linked list across all entries**. The list costs two references per entry and buys a guaranteed iteration order the base class cannot offer.\n\nTwo modes: **insertion order** (default — the list appends on `put`) and **access order** (constructor flag — every `get`/`put` moves the entry to the tail). Iteration follows the list head-to-tail in both modes; only what “moves to the tail” differs.',
    },
    {
      heading: 'Access order: the LRU machine',
      body: 'In access-order mode the tail is always the most-recently-used entry and the head the least-recently-used — eviction is “remove the head”. Overriding `removeEldestEntry` to return `size() > CAPACITY` drops the head automatically after every `put` (the five-liner is in Java code below). The animation shows hits bubbling entries to the tail while the head waits for eviction.',
    },
    {
      heading: 'Insertion order: determinism as a feature',
      body: 'Default mode never reorders: iteration replays `put` order (updates keep original position). Uses: deterministic JSON/config emission, stable test fixtures, “first seen” bookkeeping, and `LinkedHashSet` (the same list behind a set facade) for order-preserving dedupe: `new ArrayList<>(new LinkedHashSet<>(list))`.\n\n- Re-`put` of an existing key updates the value, keeps the position (insertion mode).\n- `null` key and values behave exactly like `HashMap` — one null key, many null values.',
    },
    {
      heading: 'Costs and limits',
      body: 'Two pointers per entry (~16 bytes extra) and slightly slower writes (list splicing on top of bucket work). Iteration is *faster* than `HashMap` — it walks the list, skipping empty buckets entirely.\n\n- Not synchronized: wrap or guard for threads — and access-order mode mutates on `get`, so even “reads” need locking.\n- Capacity-bounded via `removeEldestEntry` only; no TTL, no weight, no async refresh — real caches (Caffeine, Guava) take over from here.',
    },
  ],
  complexity: [
    { operation: 'get / put / remove', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Iteration (insertion/access order)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'LRU eviction via removeEldestEntry', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Five-line LRU from scratch (via LinkedHashMap)',
      description: 'Access order plus removeEldestEntry — the canonical answer.',
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public class LruFiveLiner {
    static class Lru<K, V> extends LinkedHashMap<K, V> {
        private final int capacity;

        Lru(int capacity) {
            super(capacity, 0.75f, true); // true = access order
            this.capacity = capacity;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity; // drop the head (least recently used)
        }
    }

    public static void main(String[] args) {
        Lru<Integer, String> cache = new Lru<>(2);
        cache.put(1, "one");
        cache.put(2, "two");
        cache.get(1); // 1 is now most recent
        cache.put(3, "three"); // evicts 2, the head
        System.out.println(cache.keySet()); // [1, 3] — insertion-walk of survivors
    }
}
`,
    },
    {
      title: 'Mini linked-hash map from scratch',
      description: 'Hash table plus insertion-order list — the structure beneath.',
      code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MiniLinkedHashMap<K, V> {
    private final Map<K, V> map = new HashMap<>();
    private final List<K> order = new ArrayList<>(); // insertion-order sidecar

    public void put(K key, V value) {
        if (!map.containsKey(key)) {
            order.add(key); // first sight: append position
        }
        map.put(key, value);
    }

    public V get(K key) {
        return map.get(key);
    }

    /** Iteration replays insertion order — the LinkedHashMap promise. */
    public List<Map.Entry<K, V>> entries() {
        List<Map.Entry<K, V>> out = new ArrayList<>();
        for (K key : order) {
            out.add(Map.entry(key, map.get(key)));
        }
        return out;
    }

    public static void main(String[] args) {
        MiniLinkedHashMap<String, Integer> m = new MiniLinkedHashMap<>();
        m.put("b", 2);
        m.put("a", 1);
        m.put("b", 20); // update keeps original position
        System.out.println(m.entries()); // [b=20, a=1]
    }
}
`,
    },
  ],
  mistakes: [
    'Forgetting the access-order flag: default is insertion order — LRU needs (capacity, load, true).',
    'Expecting sorted iteration: arrival order is not sorted order — TreeMap sorts, LinkedHashMap replays.',
    'Sharing an access-order map across threads: even get() mutates structure — guard everything, not just puts.',
    'Re-putting to “refresh” position in insertion mode: updates keep the original slot — only access mode moves entries.',
    'Overriding removeEldestEntry with side effects: it runs per put — keep it a pure size check.',
    'Using it as a real cache: no TTL, no weights, no concurrency — graduate to Caffeine for production caching.',
  ],
  vizId: 'linkedhashmap-access',
  problemIds: ['lru-cache'],
  javaBuiltIn: ['java.util.LinkedHashMap'],
  related: ['hashmap-internals', 'lru-lfu-cache', 'treemap-navigablemap'],
};
