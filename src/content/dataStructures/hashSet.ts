import type { Topic } from '../../types/content.ts';

/** Hash sets: membership in O(1) and the end of duplicates. */
export const hashSetTopic: Topic = {
  slug: 'hash-set',
  title: 'Hash Sets',
  category: 'data-structures',
  order: 9,
  summary: 'A HashMap that only remembers keys: O(1) membership tests, automatic dedupe, and set algebra.',
  level: 'beginner',
  group: 'non-linear',
  prerequisites: ['hash-table'],
  sections: [
    {
      heading: 'Membership, not mapping',
      body: 'A **hash set** answers one question — *have I seen this before?* — in `O(1)`. Underneath it is literally a hash table: Java’s `HashSet` is implemented as a `HashMap` where every key shares a single dummy value.\n\nAdding a duplicate changes nothing and `add` returns `false`, which makes sets the natural tool for **deduplication**, visited-tracking in graph search, and cycle detection.',
    },
    {
      heading: 'How sets live in memory',
      body: 'Same buckets-and-chains layout as a hash table, minus the value storage. Each entry holds only the key (plus the chain link), so a set is leaner than a map with the same keys.\n\nThe same rules apply: good `hashCode`/`equals` or lookups break, mutable elements corrupt the table, and the default load factor 0.75 balances chains against wasted buckets.',
    },
    {
      heading: 'Set algebra in one-liners',
      body: 'Java’s `Set` interface speaks mathematics:\n\n- **Union**: `a.addAll(b)` — everything in either.\n- **Intersection**: `a.retainAll(b)` — only what is in both.\n- **Difference**: `a.removeAll(b)` — what is only in `a`.\n\nThese mutate in place, so copy first (`new HashSet<>(a)`) when the originals must survive. `LinkedHashSet` keeps insertion order; `TreeSet` keeps sorted order at `O(log n)` per op.',
    },
    {
      heading: 'HashSet in practice',
      body: 'Reach for a set when duplicates are the enemy or membership is the question:\n\n- Dedupe while preserving order: `new ArrayList<>(new LinkedHashSet<>(list))`.\n- Visited sets in DFS/BFS and tortoise-adjacent cycle checks.\n- Fast `contains` guards before expensive work (already processed? skip).\n\nWhen iteration order must be predictable, say so explicitly with `LinkedHashSet` — plain `HashSet` order is unspecified and *will* surprise you after resizes.',
    },
  ],
  complexity: [
    { operation: 'Add / contains / remove', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Union / intersection / difference', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'MyHashSet from scratch',
      description: 'Chained buckets of keys; add returns false for duplicates.',
      code: `import java.util.Objects;

public class MyHashSet<E> {
    private Node<E>[] table = create(8);
    private int size;

    private static class Node<E> {
        final E key;
        Node<E> next;

        Node(E key, Node<E> next) {
            this.key = key;
            this.next = next;
        }
    }

    @SuppressWarnings("unchecked")
    private static <E> Node<E>[] create(int capacity) {
        return (Node<E>[]) new Node[capacity];
    }

    private int index(Object key) {
        int h = key.hashCode();
        return (table.length - 1) & (h ^ (h >>> 16));
    }

    public boolean add(E key) {
        int i = index(key);
        for (Node<E> n = table[i]; n != null; n = n.next) {
            if (Objects.equals(n.key, key)) {
                return false; // duplicate: set unchanged
            }
        }
        table[i] = new Node<>(key, table[i]);
        size++;
        return true;
    }

    public boolean contains(E key) {
        for (Node<E> n = table[index(key)]; n != null; n = n.next) {
            if (Objects.equals(n.key, key)) {
                return true;
            }
        }
        return false;
    }

    public int size() {
        return size;
    }

    public static void main(String[] args) {
        MyHashSet<Integer> seen = new MyHashSet<>();
        int[] nums = {7, 3, 7, 12, 3};
        for (int n : nums) {
            System.out.println("add " + n + " -> " + seen.add(n));
        }
        System.out.println("contains 12: " + seen.contains(12));
    }
}
`,
    },
    {
      title: 'HashSet built-in equivalent',
      description: 'Idiomatic Java: dedupe, membership, and set algebra.',
      code: `import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class SetDemo {
    public static void main(String[] args) {
        List<Integer> nums = List.of(7, 3, 7, 12, 3);

        Set<Integer> unique = new LinkedHashSet<>(nums);
        System.out.println("deduped: " + unique);
        System.out.println("has 12: " + unique.contains(12));

        Set<Integer> a = new HashSet<>(List.of(1, 2, 3));
        Set<Integer> b = new HashSet<>(List.of(2, 3, 4));

        Set<Integer> both = new HashSet<>(a);
        both.retainAll(b);
        System.out.println("intersection: " + both);

        List<Integer> onlyA = new ArrayList<>(a);
        onlyA.removeAll(b);
        System.out.println("difference: " + onlyA);
    }
}
`,
    },
  ],
  mistakes: [
    'Mutable elements: hash them, mutate them, and contains() can never find them again.',
    'Depending on HashSet iteration order: it is unspecified — use LinkedHashSet for insertion order, TreeSet for sorted.',
    'Forgetting equals/hashCode on custom classes: distinct-but-equal objects pile up as duplicates.',
    'Assuming add() always grows the set: it returns false and changes nothing for duplicates — check the return value.',
    'Modifying a set during for-each: throws ConcurrentModificationException — collect first or use removeIf.',
    'Using List.contains in a loop for membership: O(n) per check turns dedupe into O(n²) — a HashSet does it in O(n).',
  ],
  vizId: 'hash-set-ops',
  problemIds: ['contains-duplicate', 'happy-number', 'intersection-of-two-arrays'],
};
