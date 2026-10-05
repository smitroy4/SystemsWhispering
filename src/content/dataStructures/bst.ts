import type { Topic } from '../../types/content.ts';

/** Binary search trees: ordering invariant, logarithmic ops, degeneracy. */
export const bstTopic: Topic = {
  slug: 'binary-search-tree',
  title: 'Binary Search Trees',
  category: 'data-structures',
  order: 11,
  summary: 'Left < node < right: the ordering invariant that turns a tree into a sorted map with O(log n) operations.',
  level: 'intermediate',
  group: 'non-linear',
  prerequisites: ['binary-tree'],
  sections: [
    {
      heading: 'Order is the whole trick',
      body: 'A **binary search tree** adds one rule to binary trees: every value in the left subtree is **smaller** than the node, every value in the right subtree is **larger**. That single invariant makes search a guided walk — compare once per level and discard half the tree.\n\nInorder traversal therefore visits keys in **sorted order**, which is both the point of the structure and the standard way to verify one.',
    },
    {
      heading: 'Insert, search, and the three delete cases',
      body: 'Insert and search walk from the root, turning left or right per comparison: `O(h)` where `h` is height. Deletion has three cases:\n\n- **Leaf**: unlink it.\n- **One child**: bypass it (like singly linked list removal).\n- **Two children**: replace with the **inorder successor** (minimum of the right subtree), then delete that successor — it has at most one child, reducing to an easy case.',
    },
    {
      heading: 'Degeneracy: when O(log n) becomes O(n)',
      body: 'Insert 1, 2, 3, 4 in order and every node goes right — the "tree" is a linked list and every operation costs `O(n)`. Height, not node count, rules BST performance.\n\nReal libraries refuse to degenerate: `TreeMap`/`TreeSet` are **red-black trees** that rebalance on every insert to guarantee `O(log n)`. Random input also stays balanced with high probability — sorted input is the enemy.',
    },
    {
      heading: 'TreeMap and TreeSet in practice',
      body: 'Java’s sorted maps are red-black BSTs under the hood:\n\n- `TreeMap<K, V>` / `TreeSet<E>`: sorted iteration, `firstKey`/`lastKey`, `floor`/`ceiling` (nearest below/above), `subMap` views.\n- Keys need ordering: `Comparable` or a `Comparator` — inconsistent comparison corrupts the tree silently.\n- Need hashing speed instead of order? That is `HashMap`. Need both? Maintain both, or reach for `LinkedHashMap`.',
    },
  ],
  complexity: [
    { operation: 'Search / insert (balanced)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Search / insert (skewed)', best: 'O(log n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Delete', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Min / max', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'BST from scratch',
      description: 'Insert, search, and the three delete cases.',
      code: `public class Bst {
    private static class Node {
        int value;
        Node left;
        Node right;

        Node(int value) {
            this.value = value;
        }
    }

    private Node root;

    public void insert(int value) {
        root = insert(root, value);
    }

    private Node insert(Node node, int value) {
        if (node == null) {
            return new Node(value);
        }
        if (value < node.value) {
            node.left = insert(node.left, value);
        } else if (value > node.value) {
            node.right = insert(node.right, value);
        }
        return node;
    }

    public boolean contains(int value) {
        Node curr = root;
        while (curr != null) {
            if (value == curr.value) {
                return true;
            }
            curr = value < curr.value ? curr.left : curr.right;
        }
        return false;
    }

    public static void main(String[] args) {
        Bst bst = new Bst();
        for (int v : new int[]{50, 30, 70, 20, 40}) {
            bst.insert(v);
        }
        System.out.println(bst.contains(40) + " " + bst.contains(99));
    }
}
`,
    },
    {
      title: 'TreeMap built-in equivalent',
      description: 'Idiomatic Java: sorted map with floor/ceiling and views.',
      code: `import java.util.NavigableMap;
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        NavigableMap<Integer, String> scores = new TreeMap<>();
        scores.put(50, "ada");
        scores.put(30, "bob");
        scores.put(70, "cid");
        scores.put(20, "dan");
        scores.put(40, "eli");

        System.out.println(scores);
        System.out.println("floor(35)=" + scores.floorKey(35));
        System.out.println("ceiling(35)=" + scores.ceilingKey(35));
        System.out.println("head(50)=" + scores.headMap(50));
    }
}
`,
    },
  ],
  mistakes: [
    'Validating with inorder-sorted on duplicates: decide where equals go (usually right) and enforce it in validation.',
    'Deleting two-child nodes by copying the successor but forgetting to delete the successor node itself.',
    'Assuming balance: plain BSTs degenerate on sorted input — that is what TreeMap’s red-black rebalancing prevents.',
    'Recursive insert without assigning the result: node.left = insert(...) — the return value IS the subtree.',
    'Inconsistent compareTo/equals: TreeMap uses comparison only; keys "equal" by comparator overwrite each other.',
    'Null keys in TreeMap: natural ordering throws NullPointerException — use a null-tolerant Comparator or HashMap.',
  ],
  vizId: 'bst-ops',
  problemIds: ['validate-binary-search-tree', 'lowest-common-ancestor-of-a-binary-search-tree', 'kth-smallest-element-in-a-bst'],
};
