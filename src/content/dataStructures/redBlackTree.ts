import type { Topic } from '../../types/content.ts';

/** Red-Black Tree: five color rules that keep TreeMap honest. */
export const redBlackTreeTopic: Topic = {
  slug: 'red-black-tree',
  title: 'Red-Black Tree',
  category: 'data-structures',
  order: 27,
  summary: 'The balancing act behind TreeMap: color rules, rotations and recolors — concept first, code later.',
  level: 'advanced',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['binary-search-tree'],
  sections: [
    {
      heading: 'Balance in colors, not heights',
      body: 'A **red-black tree** is a BST where every node is painted red or black, obeying five rules: every node is red or black; the root is black; red nodes have black children (no double-red); every root-to-leaf path holds the same number of black nodes (**black-height**); leaves (`null`) count as black.\n\nThese rules bound the height: the longest path (alternating red/black) is at most twice the shortest (all black), so height stays `O(log n)` — looser than AVL, which is exactly the point. Fewer rotations per write, still logarithmic reads. This is the structure inside `java.util.TreeMap` and `TreeSet`.',
    },
    {
      heading: 'How it lives in memory',
      body: 'BST nodes plus one **color bit** each — a boolean, the smallest balancing metadata possible. No heights, no counts. The classic implementation adds a single shared black **sentinel** leaf object so every null check becomes “is it the sentinel”, simplifying the fix-up code.\n\n- Memory overhead is one bit per node (one byte in practice): cheaper than AVL heights.\n- Rotations are the same pointer surgery as AVL; the difference is *when* they fire — color violations, not height differences.\n- Black-height uniformity means every search pays a predictable, bounded number of steps even mid-update.',
    },
    {
      heading: 'Insert: recolor up, rotate once',
      body: 'Insert like a BST, paint the node **red**, then fix double-red violations upward. Two cases at the violating node’s parent: a **red uncle** → recolor parent/uncle black, grandparent red, and continue upward (the violation bubbles); a **black uncle** → rotate (single for lines, double for zig-zags) and recolor — done, one structural fix total.\n\nThe animation inserts 10, 20, 30: red-red at 20–30 with a black (null) uncle triggers a left rotation plus recolor, ending black-rooted and balanced. Deletion is the harder mirror (double-black cases) — know it exists, reach for references when implementing.',
    },
    {
      heading: 'Red-black vs AVL: the real tradeoff',
      body: 'AVL rebalances on height: stricter (~1.44·log n), faster lookups, more rotations per write. Red-black rebalances on color: looser (≤2·log n), slightly slower lookups, fewer rotations — inserts need at most 2 rotations, deletes at most 3.\n\nThat is why **write-heavy ordered maps** (`TreeMap`, Linux CFS scheduler, `std::map`) choose red-black, while read-heavy static indexes lean AVL. Same `O(log n)` on paper; the constant and the write cost decide in practice.',
    },
    {
      heading: 'Real-world use',
      body: '`TreeMap`/`TreeSet` (and C++ `std::map`), the Linux Completely Fair Scheduler’s runqueue, memory allocators’ free-block trees, and most language-runtime ordered maps. Anywhere an ordered dictionary takes steady writes with bounded read latency, red-black is the default answer.\n\nReach for red-black when writes are frequent and worst-case read bounds matter; reach for B-trees when data lives on disk; reach for hash maps when order is never needed at all.',
    },
  ],
  complexity: [
    { operation: 'Search / contains', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Insert (≤2 rotations)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Delete (≤3 rotations)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Min / max / successor', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Color rules from scratch',
      description: 'Node colors, rotations, and the insert fix-up (recolor + rotate).',
      code: `public class RedBlackTree<E extends Comparable<E>> {
    private static final boolean RED = true;
    private static final boolean BLACK = false;

    private static class Node<E> {
        E value;
        Node<E> left, right, parent;
        boolean color = RED; // new nodes arrive red
        Node(E value, Node<E> parent) {
            this.value = value;
            this.parent = parent;
        }
    }

    private Node<E> root;

    public void add(E value) {
        Node<E> parent = null;
        Node<E> curr = root;
        while (curr != null) {
            parent = curr;
            curr = value.compareTo(curr.value) < 0 ? curr.left : curr.right;
        }
        Node<E> node = new Node<>(value, parent);
        if (parent == null) {
            root = node;
        } else if (value.compareTo(parent.value) < 0) {
            parent.left = node;
        } else {
            parent.right = node;
        }
        fixInsert(node);
    }

    private void fixInsert(Node<E> n) {
        while (n != root && n.parent.color == RED) {
            Node<E> p = n.parent;
            Node<E> g = p.parent; // grandparent exists: root is always black
            if (p == g.left) {
                Node<E> uncle = g.right;
                if (uncle != null && uncle.color == RED) {
                    p.color = BLACK; // red uncle: recolor and bubble up
                    uncle.color = BLACK;
                    g.color = RED;
                    n = g;
                } else {
                    if (n == p.right) { // zig-zag: straighten first
                        n = p;
                        rotateLeft(n);
                    }
                    n.parent.color = BLACK; // black uncle: rotate once
                    n.parent.parent.color = RED;
                    rotateRight(n.parent.parent);
                }
            } else {
                Node<E> uncle = g.left; // mirror image of the left case
                if (uncle != null && uncle.color == RED) {
                    p.color = BLACK;
                    uncle.color = BLACK;
                    g.color = RED;
                    n = g;
                } else {
                    if (n == p.left) {
                        n = p;
                        rotateRight(n);
                    }
                    n.parent.color = BLACK;
                    n.parent.parent.color = RED;
                    rotateLeft(n.parent.parent);
                }
            }
        }
        root.color = BLACK; // rule: the root is always black
    }

    private void rotateLeft(Node<E> x) {
        Node<E> y = x.right;
        x.right = y.left;
        if (y.left != null) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent == null) {
            root = y;
        } else if (x == x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    private void rotateRight(Node<E> y) {
        Node<E> x = y.left;
        y.left = x.right;
        if (x.right != null) {
            x.right.parent = y;
        }
        x.parent = y.parent;
        if (y.parent == null) {
            root = x;
        } else if (y == y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }
        x.right = y;
        y.parent = x;
    }

    public static void main(String[] args) {
        RedBlackTree<Integer> t = new RedBlackTree<>();
        for (int v : new int[]{10, 20, 30, 5, 15}) {
            t.add(v);
        }
        System.out.println("root=" + t.root.value + " black=" + (t.root.color == BLACK));
    }
}
`,
    },
    {
      title: 'TreeMap built-in equivalent',
      description: 'Idiomatic Java: the red-black tree you already use.',
      code: `import java.util.NavigableMap;
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        // TreeMap IS a red-black tree: sorted keys, log-time everything.
        NavigableMap<Integer, String> map = new TreeMap<>();
        map.put(20, "twenty");
        map.put(10, "ten");
        map.put(30, "thirty");
        System.out.println("keys=" + map.keySet());
        System.out.println("floor(25)=" + map.floorKey(25)); // 20
        System.out.println("first=" + map.firstKey()); // 10 in O(log n)
    }
}
`,
    },
  ],
  mistakes: [
    'Forgetting root.color = BLACK: recolor bubbling can redden the root — the fix-up must end by blackening it.',
    'Treating null uncles as red: null leaves are BLACK — a missing uncle means the rotate case, not the recolor case.',
    'Skipping the zig-zag straighten: LR/RL needs a child rotation first — rotating the grandparent directly keeps the violation.',
    'Recoloring without continuing upward: red-uncle fixes bubble the red grandparent higher — loop until the root or a black parent.',
    'Deleting like a BST and stopping: removal can create double-black — deletion fix-up is mandatory, not optional.',
    'Hand-rolling what TreeMap gives: production code should use TreeMap — write red-black yourself to learn, not to ship.',
  ],
  vizId: 'redblack-ops',
  problemIds: [],
  practiceNote: 'Concept-level topic: our verified bank holds no red-black drill — the balancing intuition here pays off in TreeMap/TreeSet reasoning; practice ordered BST problems under Binary Search Trees first.',
  related: ['binary-search-tree', 'avl-tree'],
};
