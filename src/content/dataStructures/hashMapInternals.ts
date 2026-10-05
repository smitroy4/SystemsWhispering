import type { Topic } from '../../types/content.ts';

/** HashMap Internals: table, spreading, buckets, treeification, resize. */
export const hashMapInternalsTopic: Topic = {
  slug: 'hashmap-internals',
  title: 'HashMap Internals',
  category: 'data-structures',
  order: 42,
  summary: 'Buckets, hashes and treeification: how HashMap stores entries, handles collisions and resizes at load factor 0.75.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['hash-table', 'collections-framework'],
  choiceBox: {
    choose: [
      'Default map for lookups, caches, indexes, frequency tables — O(1) average everything.',
      'Keys with well-distributed immutable `hashCode` (`String`, `Integer`, records).',
      'Iteration plus mutation of *values*: `merge`/`compute` update entries in place.',
    ],
    avoid: [
      'Sorted or ranged keys — `TreeMap` owns ordering; HashMap order is unspecified.',
      'Null-hostile designs needing explicit absence: `getOrDefault`/`containsKey` discipline, or `Optional` values.',
      'Shared-across-threads maps — `ConcurrentHashMap`, never `Collections.synchronizedMap` for hot paths.',
    ],
  },
  sections: [
    {
      heading: 'Table, spreading, and the index mask',
      body: 'A `HashMap` is `Node<K,V>[] table` (default capacity 16, always a power of two) plus `size` and `threshold = capacity × 0.75`. The bucket index is `(n − 1) & hash` — a bit-mask, not a modulo — which is why capacities stay powers of two.\n\nRaw `hashCode()` values cluster (small ints hash to themselves), so `HashMap` **spreads**: `h ^ (h >>> 16)` folds the high bits down where the mask can see them. Skipping the spread would pile consecutive integers into consecutive buckets and starve the high bits — the classic “works until resize, then degrades” bug in hand-rolled maps.',
    },
    {
      heading: 'Buckets: lists that become trees',
      body: 'Each bucket starts as a linked list of `Node` entries (hash, key, value, next). Lookups walk the chain comparing hashes then `equals`. When a chain hits **8 entries** (`TREEIFY_THRESHOLD`) *and* the table holds ≥64 buckets, it **treeifies** into a red-black tree of `TreeNode`s — worst case drops from `O(n)` to `O(log n)` even under adversarial hashes.\n\n- Below 64 buckets, growth is preferred over treeification: resize first, treeify later.\n- Trees **untreeify** back to lists when small (≤6 on resize splits) — the structure breathes with the data.\n- Iteration order is bucket order: unspecified, unstable across resizes — never asserted upon.',
    },
    {
      heading: 'Resize at load factor 0.75',
      body: 'When `size > threshold`, the table **doubles** and every entry is re-indexed. Because capacity doubles, each entry either stays put or moves exactly `oldCapacity` slots over — decided by one bit of the (spread) hash — so resize splits chains without recomputing hashes.\n\n- 0.75 balances space vs collisions: higher wastes less memory but lengthens chains; lower wastes table.\n- `new HashMap<>(expectedSize)` plus the `/ 0.75 + 1` rule (or `HashMap.newHashMap` in newer JDKs) avoids every resize when the count is known.\n- Resize is the map’s stop-the-world: bulk-load via constructor/`putAll` rather than incremental growth when possible.',
    },
    {
      heading: 'Equals, hashCode, and key discipline',
      body: 'The contract is load-bearing: equal objects must share `hashCode`; unequal objects should differ (for speed). `HashMap` locates by hash, then confirms by `equals` — break either and entries become unreachable ghosts that still count toward `size`.\n\n- Keys must be **effectively immutable**: mutating hash-relevant fields after `put` strands the entry in the wrong bucket.\n- `String`/`Integer`/records are ideal keys; arrays are not (`hashCode` is identity-based — wrap or use `List`).\n- `null` key is allowed exactly once (bucket 0) — a deliberate special case, not an invitation.',
    },
  ],
  complexity: [
    { operation: 'get / put / remove (average)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'get / put (treeified bucket)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'containsKey / containsValue', best: 'O(1)', average: 'O(1) / O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Resize (rehash n entries)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'MyHashMap from scratch',
      description: 'Table, spreading, chaining, and load-factor resize — the real mechanics.',
      code: `public class MyHashMap<K, V> {
    private static class Node<K, V> {
        final int hash;
        final K key;
        V value;
        Node<K, V> next;
        Node(int hash, K key, V value, Node<K, V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    private Node<K, V>[] table = newTable(16);
    private int size;
    private static final float LOAD = 0.75f;

    @SuppressWarnings("unchecked")
    private static <K, V> Node<K, V>[] newTable(int cap) {
        return new Node[cap];
    }

    /** Spread like HashMap: fold high bits where the mask can see them. */
    static int spread(Object key) {
        int h = key.hashCode();
        return h ^ (h >>> 16);
    }

    public V get(K key) {
        int hash = spread(key);
        for (Node<K, V> e = table[(table.length - 1) & hash]; e != null; e = e.next) {
            if (e.hash == hash && e.key.equals(key)) {
                return e.value;
            }
        }
        return null;
    }

    public void put(K key, V value) {
        int hash = spread(key);
        int i = (table.length - 1) & hash;
        for (Node<K, V> e = table[i]; e != null; e = e.next) {
            if (e.hash == hash && e.key.equals(key)) {
                e.value = value; // keys match: overwrite, size unchanged
                return;
            }
        }
        table[i] = new Node<>(hash, key, value, table[i]);
        if (++size > table.length * LOAD) {
            resize();
        }
    }

    private void resize() {
        Node<K, V>[] old = table;
        table = newTable(old.length * 2);
        size = 0;
        for (Node<K, V> head : old) {
            for (Node<K, V> e = head; e != null; e = e.next) {
                put(e.key, e.value); // re-index into the doubled table
            }
        }
    }

    public static void main(String[] args) {
        MyHashMap<String, Integer> map = new MyHashMap<>();
        for (int i = 0; i < 20; i++) { // crosses threshold 12: resizes 16 → 32
            map.put("k" + i, i);
        }
        System.out.println("k7=" + map.get("k7") + " missing=" + map.get("zz"));
    }
}
`,
    },
    {
      title: 'Modern Map API idioms',
      description: 'merge, computeIfAbsent, and getOrDefault — the methods interviews expect.',
      code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapIdioms {
    public static void main(String[] args) {
        // Pre-size for a known count: no resizes (n / 0.75 + 1).
        Map<String, List<Integer>> index = new HashMap<>(64);

        // computeIfAbsent: group-by in one line, list created on demand.
        for (int v : new int[]{3, 1, 3, 2, 1, 3}) {
            index.computeIfAbsent(v % 2 == 0 ? "even" : "odd", k -> new ArrayList<>()).add(v);
        }
        System.out.println(index); // {even=[2], odd=[3, 1, 3, 1, 3]}

        // merge: frequency counting without a containsKey check.
        Map<String, Integer> counts = new HashMap<>();
        for (String w : List.of("a", "b", "a")) {
            counts.merge(w, 1, Integer::sum);
        }
        System.out.println(counts.getOrDefault("zzz", 0)); // 0, no null
    }
}
`,
    },
  ],
  mistakes: [
    'Breaking equals/hashCode: equal keys with different hashes strand entries — always override both or neither.',
    'Mutating a key after put: the hash moves, the entry doesn’t — keys must be effectively immutable.',
    'Using arrays as keys: array hashCode is identity — equal contents map to different buckets; wrap in List or a record.',
    'Forgetting getOrDefault/defaults: get returns null for missing keys — unboxing it throws; default explicitly.',
    'Growing blindly to known sizes: each resize rehashes everything — pre-size with (expected / 0.75) + 1.',
    'Iterating + removing via map.remove: use entrySet().iterator().remove() or collect keys first — else fail-fast fires.',
  ],
  vizId: 'hashmap-buckets',
  problemIds: ['top-k-frequent-elements', 'valid-anagram', 'contains-duplicate'],
  javaBuiltIn: ['java.util.HashMap', 'java.util.Map'],
  related: ['hash-table', 'linkedhashmap-lru', 'hashset-jcf'],
};
