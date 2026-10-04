import type { Topic } from '../../types/content.ts';

/** Hash tables: hashing, buckets, chaining, and HashMap internals. */
export const hashTableTopic: Topic = {
  slug: 'hash-table',
  title: 'Hash Tables',
  category: 'data-structures',
  order: 8,
  summary: 'Key → value in O(1): hash functions pick a bucket, chains absorb collisions, resizing keeps it all fast.',
  level: 'intermediate',
  prerequisites: ['array', 'dynamic-array'],
  sections: [
    {
      heading: 'Arrays indexed by anything',
      body: 'A **hash table** turns any key into an array index: `index = hash(key) % capacity`. Equal keys must land in the same bucket, so `put` and `get` both jump straight there — `O(1)` on average, with no searching.\n\nJava developers live here: `HashMap`, `HashSet`, `LinkedHashMap`, and caches of all kinds are hash tables underneath.',
    },
    {
      heading: 'How hashing works in memory',
      body: 'The table is a plain array of **buckets**; each bucket holds a chain (linked list or tree) of entries whose keys collided there.\n\n- `hashCode()` produces a 32-bit number; the table **spreads** its bits (`h ^ (h >>> 16)`) so patterns in low bits do not pile into few buckets.\n- The index uses a bitmask `(capacity - 1) & hash` — which is why capacity is always a **power of two**.\n- A **collision** (two keys, one bucket) just extends the chain; lookups then compare with `equals` down the chain. Long chains degrade toward `O(n)`, which is why Java treeifies chains longer than 8.',
    },
    {
      heading: 'Load factor and resizing',
      body: 'Short chains need spare buckets. The **load factor** (`size / capacity`, default 0.75) triggers a **resize**: allocate double capacity and **rehash every entry** into new buckets — an `O(n)` operation that, like dynamic arrays, amortizes to `O(1)` per insert.\n\nSize your maps when you know the volume: `new HashMap<>(10_000)` avoids a cascade of early resizes.',
    },
    {
      heading: 'HashMap in practice',
      body: 'The modern API removes most manual bookkeeping:\n\n- `getOrDefault(key, fallback)` and `containsKey` for safe reads.\n- `computeIfAbsent(key, k -> new ArrayList<>())` for grouping (the developer’s best friend).\n- `merge(key, 1, Integer::sum)` for one-line frequency counting.\n- Iterate with `entrySet()`, never `keySet()` + `get` (that doubles the hashing work).',
    },
  ],
  complexity: [
    { operation: 'Get / put / remove', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Contains key', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Resize / rehash', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'MyHashMap from scratch',
      description: 'Separate chaining, spread hashing, and load-factor resize.',
      code: `import java.util.Objects;

public class MyHashMap<K, V> {
    private static class Entry<K, V> {
        final K key;
        V value;
        Entry<K, V> next;

        Entry(K key, V value, Entry<K, V> next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    private Entry<K, V>[] table = create(16);
    private int size;

    @SuppressWarnings("unchecked")
    private static <K, V> Entry<K, V>[] create(int capacity) {
        return (Entry<K, V>[]) new Entry[capacity];
    }

    private int index(Object key) {
        int h = key.hashCode();
        return (table.length - 1) & (h ^ (h >>> 16));
    }

    public void put(K key, V value) {
        if (size + 1 > table.length * 0.75) {
            resize();
        }
        int i = index(key);
        for (Entry<K, V> e = table[i]; e != null; e = e.next) {
            if (Objects.equals(e.key, key)) {
                e.value = value;
                return;
            }
        }
        table[i] = new Entry<>(key, value, table[i]);
        size++;
    }

    public V get(K key) {
        for (Entry<K, V> e = table[index(key)]; e != null; e = e.next) {
            if (Objects.equals(e.key, key)) {
                return e.value;
            }
        }
        return null;
    }

    private void resize() {
        Entry<K, V>[] old = table;
        table = create(old.length * 2);
        size = 0;
        for (Entry<K, V> e : old) {
            for (; e != null; e = e.next) {
                put(e.key, e.value);
            }
        }
    }

    public static void main(String[] args) {
        MyHashMap<String, Integer> map = new MyHashMap<>();
        map.put("a", 1);
        map.put("b", 2);
        map.put("a", 3);
        System.out.println(map.get("a") + " " + map.get("zzz"));
    }
}
`,
    },
    {
      title: 'HashMap built-in equivalent',
      description: 'Idiomatic Java: merge, computeIfAbsent, entrySet.',
      code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HashMapDemo {
    static Map<String, Integer> frequencies(List<String> words) {
        Map<String, Integer> counts = new HashMap<>();
        for (String w : words) {
            counts.merge(w.toLowerCase(), 1, Integer::sum);
        }
        return counts;
    }

    public static void main(String[] args) {
        System.out.println(frequencies(List.of("a", "b", "A", "c", "b", "a")));

        Map<String, List<String>> byLength = new HashMap<>();
        for (String w : List.of("hi", "hey", "yo")) {
            byLength.computeIfAbsent(String.valueOf(w.length()), k -> new ArrayList<>()).add(w);
        }
        for (Map.Entry<String, List<String>> e : byLength.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }
    }
}
`,
    },
  ],
  mistakes: [
    'Mutable keys: changing a key after insertion moves its hash but not its bucket — the entry becomes unreachable.',
    'hashCode without equals (or vice versa): the contract demands both agree; break it and lookups silently fail.',
    'Identity vs equality in chains: entries compare with equals — using == on keys misses logically equal keys.',
    'Iterating keySet() + get(): hashes every key twice — loop over entrySet() instead.',
    'Null surprises: HashMap allows one null key, but ConcurrentHashMap and ArrayDeque reject nulls entirely.',
    'Ignoring load factor on big maps: default capacity 16 with 100k entries resizes ~13 times — pre-size with new HashMap<>(expected).',
  ],
  vizId: 'hash-collision',
  problemIds: ['two-sum', 'group-anagrams', 'longest-substring-without-repeating-characters'],
};
