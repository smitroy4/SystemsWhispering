import type { Topic } from '../../types/content.ts';

/** AVL Tree: balance measured in heights, restored with rotations. */
export const avlTreeTopic: Topic = {
  slug: 'avl-tree',
  title: 'AVL Tree',
  category: 'data-structures',
  order: 26,
  summary: 'The first self-balancing BST: height differences of at most one, restored with single and double rotations.',
  level: 'intermediate',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['binary-search-tree'],
  sections: [
    {
      heading: 'Balance you can measure',
      body: 'An **AVL tree** is a BST with one invariant: at every node, the left and right subtree heights differ by **at most one**. That number — `balance = height(left) − height(right)` — is stored (or recomputed) per node and checked after every insert and delete.\n\nThe payoff is a hard guarantee: an AVL tree with n nodes is never taller than ~1.44·log₂(n). Search, insert, and delete all cost `O(log n)` *worst case*, not merely on average. `Balanced Binary Tree` on LeetCode literally asks you to verify this property.',
    },
    {
      heading: 'How it lives in memory',
      body: 'Plain BST nodes plus one `height` field each (a byte-sized balance factor `-1/0/+1` works too — heights are just easier to teach). No colors, no parent pointers needed for the classic recursive implementation: rotations return the new subtree root and callers reattach it.\n\n- Height updates flow bottom-up: after splicing a leaf, each ancestor recomputes `1 + max(h(left), h(right))` on the way back up.\n- Only the **first** unbalanced ancestor on that path needs rotation — one fix restores the whole tree, unlike red-black trees which may recolor upward.\n- Memory overhead over a BST is one integer per node: the cheapest balancing metadata of any self-balancing tree.',
    },
    {
      heading: 'Four cases, two rotations',
      body: 'Imbalance always reduces to four shapes at the lowest unbalanced node. **LL** (tall left-left): single right rotation. **RR**: single left rotation. **LR**: left rotation on the child, then right rotation on the node. **RL**: mirror image. Double rotations just straighten a zig-zag into a line so a single rotation can finish.\n\nThe animation inserts 10, 20, 30 — a textbook RR case — and left-rotates 10 down so 20 becomes the balanced root. Deletion mirrors insertion: remove like a BST, then walk up rebalancing; a delete can trigger `O(log n)` rotations (insert needs at most two).',
    },
    {
      heading: 'Augmentation: order statistics for free',
      body: 'Because AVL stores per-node metadata anyway, adding a `size` field (subtree node count) is natural — and unlocks **k-th smallest in O(log n)** by comparing k against `1 + size(left)`. The same trick powers indexed sequences and leaderboard ranks.\n\nRule: any statistic computable from children (`size`, `sum`, `min`, `max`) can ride the height-update pass for free. If your BST needs ranks, augment the AVL you already balance.',
    },
    {
      heading: 'Real-world use',
      body: 'In-memory indexes with read-heavy workloads (AVL lookups need fewer comparisons than red-black on average), order-statistic trees, and interval bookkeeping. Databases usually prefer B-trees (disk pages beat pointer chasing), and `TreeMap` chose red-black (cheaper writes) — but when lookups dominate and data fits RAM, AVL’s stricter balance wins measured time.\n\nReach for AVL when reads dominate and worst-case latency matters; reach for red-black or B-trees when writes dominate or data lives on disk.',
    },
  ],
  complexity: [
    { operation: 'Search / contains', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Insert (with rebalancing)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Delete (with rebalancing)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'K-th smallest (augmented)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'AVLTree from scratch',
      description: 'Heights, balance factors, and the four rotation cases.',
      code: `public class AVLTree<E extends Comparable<E>> {
    private static class Node<E> {
        E value;
        Node<E> left, right;
        int height = 1;
        Node(E value) { this.value = value; }
    }

    private Node<E> root;

    private int height(Node<E> n) {
        return n == null ? 0 : n.height;
    }

    private int balance(Node<E> n) {
        return n == null ? 0 : height(n.left) - height(n.right);
    }

    private void update(Node<E> n) {
        n.height = 1 + Math.max(height(n.left), height(n.right));
    }

    /** Right rotation: LL case — x was the tall left child. */
    private Node<E> rotateRight(Node<E> y) {
        Node<E> x = y.left;
        y.left = x.right;
        x.right = y;
        update(y);
        update(x);
        return x;
    }

    /** Left rotation: RR case — mirror image. */
    private Node<E> rotateLeft(Node<E> x) {
        Node<E> y = x.right;
        x.right = y.left;
        y.left = x;
        update(x);
        update(y);
        return y;
    }

    private Node<E> rebalance(Node<E> n) {
        update(n);
        int b = balance(n);
        if (b > 1) { // left-heavy
            if (balance(n.left) < 0) {
                n.left = rotateLeft(n.left); // LR: straighten first
            }
            return rotateRight(n);
        }
        if (b < -1) { // right-heavy
            if (balance(n.right) > 0) {
                n.right = rotateRight(n.right); // RL: straighten first
            }
            return rotateLeft(n);
        }
        return n;
    }

    public void add(E value) {
        root = add(root, value);
    }

    private Node<E> add(Node<E> n, E value) {
        if (n == null) {
            return new Node<>(value);
        }
        int cmp = value.compareTo(n.value);
        if (cmp < 0) {
            n.left = add(n.left, value);
        } else if (cmp > 0) {
            n.right = add(n.right, value);
        }
        return rebalance(n);
    }

    public int height() {
        return height(root);
    }

    public static void main(String[] args) {
        AVLTree<Integer> t = new AVLTree<>();
        for (int v : new int[]{10, 20, 30, 5, 4}) {
            t.add(v);
        }
        System.out.println("height=" + t.height()); // 3, never 5
    }
}
`,
    },
    {
      title: 'Balance check drill',
      description: 'The Balanced Binary Tree check: heights plus the ±1 contract.',
      code: `public class BalanceCheck {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    /** Returns height, or -1 the moment imbalance is found. */
    static int check(TreeNode n) {
        if (n == null) {
            return 0;
        }
        int left = check(n.left);
        if (left == -1) {
            return -1;
        }
        int right = check(n.right);
        if (right == -1) {
            return -1;
        }
        if (Math.abs(left - right) > 1) {
            return -1; // the AVL invariant, violated
        }
        return 1 + Math.max(left, right);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(10);
        root.left = new TreeNode(5);
        root.right = new TreeNode(20);
        root.right.right = new TreeNode(30);
        System.out.println("balanced=" + (check(root) != -1)); // false
    }
}
`,
    },
  ],
  mistakes: [
    'Recomputing heights from scratch per node: cache height in the node and update bottom-up, or inserts degrade to O(n log n).',
    'Rotating before updating heights: update the lower node first (y, then x) — stale heights poison every ancestor above.',
    'Handling only LL and RR: zig-zags (LR, RL) need the child straightened first — a single rotation on a zig-zag keeps it unbalanced.',
    'Forgetting delete rebalances upward: one delete can rotate at every level — rebalance the whole return path, not just the parent.',
    'Storing balance as height difference but comparing wrong: left-heavy means balance > +1 with the left-tall convention — pick one sign and stay consistent.',
    'Choosing AVL for write-heavy maps: stricter balance costs more rotations per write — red-black or B-trees fit better there.',
  ],
  vizId: 'avl-ops',
  problemIds: ['balanced-binary-tree', 'validate-binary-search-tree', 'kth-smallest-element-in-a-bst'],
  related: ['binary-search-tree', 'red-black-tree'],
};
