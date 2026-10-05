import type { Topic } from '../../types/content.ts';

/** Skip List: express lanes over a sorted list, built on coin flips. */
export const skipListTopic: Topic = {
  slug: 'skip-list',
  title: 'Skip List',
  category: 'data-structures',
  order: 22,
  summary: 'Layered express lanes over a sorted linked list — logarithmic search with coin flips instead of rotations.',
  level: 'advanced',
  group: 'linear',
  status: 'complete',
  prerequisites: ['singly-linked-list'],
  sections: [
    {
      heading: 'Express lanes over a sorted list',
      body: 'A **skip list** is a sorted linked list with extra fast lanes: level 0 links every element; each higher level links a sparser subsequence. Search starts at the top lane, scoots right while the next value is too small, then drops down a level and repeats — skipping whole stretches the way an express train skips stations.\n\nThe magic is that lanes are chosen by **coin flip**, not rebalancing: when inserting, flip a coin; each heads adds one more level to the new tower. Half the nodes reach level 1, a quarter reach level 2, and so on — expected `O(log n)` levels with zero rotation code.',
    },
    {
      heading: 'How it lives in memory',
      body: 'Each element is a **tower**: one node object holding the value plus a `forward[]` array of next-pointers, one per level it occupies. A `head` sentinel with maximum height anchors every lane.\n\n- Total pointers average `2n` (each tower averages 2 levels: 1 + 1/2 + 1/4 + …), so space is `O(n)` expected — more than a list, far less than a tree with parent pointers and colors.\n- Nodes at high levels are cache-friendly hubs: the top lanes fit in cache and absorb most traversals.\n- Worst case is a degenerate coin run (`O(n)` height), but the probability shrinks exponentially — level ≥ k needs k heads in a row (`1/2^k`). Cap the height (e.g. 32) and the risk vanishes in practice.',
    },
    {
      heading: 'Search, insert, delete: one pattern',
      body: 'All three operations share the **drop-down walk**: from the top lane, move right while `next.value < target`, record each lane’s predecessor in an `update[]` array, then drop. Search checks whether the level-0 successor equals the target; insert splices a randomly-tall tower through every `update[i]` below its height; delete unlinks level by level and trims empty top lanes.\n\nEvery operation touches `O(log n)` nodes expected, and — unlike balanced trees — insert needs no fix-up pass: the coin already decided the shape. That lock-free-friendly simplicity is why `ConcurrentSkipListMap` exists.',
    },
    {
      heading: 'Random level: the one-line balancer',
      body: '`level = 1; while (random.nextBoolean() && level < MAX) level++` — that loop *is* the balancing strategy. Because heights are independent of insertion order, an adversary cannot craft a degenerate sequence the way sorted input degrades an unbalanced BST.\n\nDuplicates policy matters: allow them (multiset), reject them (set), or overwrite values (map). Decide up front — the walk logic branches on `<` vs `<=`, and getting it wrong silently duplicates or drops entries.',
    },
    {
      heading: 'Real-world use',
      body: 'Redis sorted sets (ZSET) are skip lists — leaderboard and range queries with simple code. `java.util.concurrent.ConcurrentSkipListMap/Set` gives lock-free sorted maps. LevelDB/MemTables pair them with SSTables for ordered storage. Interviewers love them as the “balanced BST without rotations” answer.\n\nReach for a skip list when you need ordered, concurrent-friendly structure without writing a rotation; reach for a tree when worst-case (not expected) guarantees are contractually required.',
    },
  ],
  complexity: [
    { operation: 'Search', best: 'O(1)', average: 'O(log n)*', worst: 'O(n)', space: 'O(n)*' },
    { operation: 'Insert', best: 'O(1)', average: 'O(log n)*', worst: 'O(n)', space: 'O(n)*' },
    { operation: 'Delete', best: 'O(1)', average: 'O(log n)*', worst: 'O(n)', space: 'O(n)*' },
    { operation: 'Min / max (lane 0 ends)', best: 'O(1)', average: 'O(1)', worst: 'O(log n)', space: 'O(n)*' },
  ],
  javaCode: [
    {
      title: 'SkipList from scratch',
      description: 'Coin-flip towers, drop-down walk, and the update[] splice.',
      code: `import java.util.Random;

public class SkipList<E extends Comparable<E>> {
    private static final int MAX_LEVEL = 16;

    private static class Node<E> {
        final E value;
        final Node<E>[] forward;
        @SuppressWarnings("unchecked")
        Node(E value, int level) {
            this.value = value;
            this.forward = new Node[level];
        }
    }

    private final Node<E> head = new Node<>(null, MAX_LEVEL);
    private final Random random = new Random(42);
    private int level = 1;
    private int size;

    /** One-line balancer: each heads adds a lane. */
    private int randomLevel() {
        int lvl = 1;
        while (lvl < MAX_LEVEL && random.nextBoolean()) {
            lvl++;
        }
        return lvl;
    }

    public boolean contains(E target) {
        Node<E> curr = head;
        for (int i = level - 1; i >= 0; i--) {
            while (curr.forward[i] != null && curr.forward[i].value.compareTo(target) < 0) {
                curr = curr.forward[i];
            }
        }
        curr = curr.forward[0];
        return curr != null && curr.value.compareTo(target) == 0;
    }

    public void add(E value) {
        @SuppressWarnings("unchecked")
        Node<E>[] update = new Node[MAX_LEVEL];
        Node<E> curr = head;
        for (int i = level - 1; i >= 0; i--) {
            while (curr.forward[i] != null && curr.forward[i].value.compareTo(value) < 0) {
                curr = curr.forward[i];
            }
            update[i] = curr;
        }
        int lvl = randomLevel();
        if (lvl > level) {
            for (int i = level; i < lvl; i++) {
                update[i] = head;
            }
            level = lvl;
        }
        Node<E> node = new Node<>(value, lvl);
        for (int i = 0; i < lvl; i++) {
            node.forward[i] = update[i].forward[i];
            update[i].forward[i] = node;
        }
        size++;
    }

    public static void main(String[] args) {
        SkipList<Integer> sl = new SkipList<>();
        for (int v : new int[]{3, 7, 12, 19, 25}) {
            sl.add(v);
        }
        System.out.println("has 12=" + sl.contains(12));
        System.out.println("has 13=" + sl.contains(13));
    }
}
`,
    },
    {
      title: 'ConcurrentSkipListMap built-in equivalent',
      description: 'Idiomatic Java: the JDK’s lock-free sorted map, same structure.',
      code: `import java.util.concurrent.ConcurrentNavigableMap;
import java.util.concurrent.ConcurrentSkipListMap;

public class SkipDemo {
    public static void main(String[] args) {
        // Same layered structure — with lock-free concurrency built in.
        ConcurrentNavigableMap<Integer, String> scores = new ConcurrentSkipListMap<>();
        scores.put(12, "twelve");
        scores.put(3, "three");
        scores.put(25, "twenty-five");
        System.out.println("keys=" + scores.keySet());
        System.out.println("range 5..20=" + scores.subMap(5, 20).keySet());
    }
}
`,
    },
  ],
  mistakes: [
    'Walking with <= instead of <: predecessors must stop before the target — the wrong comparison duplicates entries or skips them.',
    'Forgetting the update[] array: splicing without recording every lane’s predecessor corrupts the upper lanes silently.',
    'Not trimming empty top lanes after delete: level stays high forever and every search pays for ghost lanes.',
    'Uncapped random levels: bound the height (e.g. 16–32) or a freak coin run allocates absurd forward arrays.',
    'Assuming worst-case O(log n): the guarantee is expected — contracts needing hard bounds want a balanced tree instead.',
    'Using a skip list for plain membership: an unordered HashSet is simpler and faster when order is never queried.',
  ],
  vizId: 'skip-list-ops',
  problemIds: [],
  practiceNote: 'Concept-level topic: our verified bank holds no direct Skip List drill (it lives on concurrency interviews and systems design) — study the lanes here, then practice ordered-structure problems under Binary Search Trees.',
  related: ['singly-linked-list', 'binary-search-tree'],
};
