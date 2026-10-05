import type { Topic } from '../../types/content.ts';

/** Binary trees: structure, height, and the four traversals. */
export const binaryTreeTopic: Topic = {
  slug: 'binary-tree',
  title: 'Binary Trees & Traversals',
  category: 'data-structures',
  order: 10,
  summary: 'Nodes with at most two children: height, traversals (in/pre/post/level order), and recursive thinking.',
  level: 'beginner',
  group: 'non-linear',
  prerequisites: ['stack', 'queue-deque'],
  sections: [
    {
      heading: 'A tree is nodes with directions',
      body: 'A **binary tree** is a node (the **root**) plus up to two subtrees, **left** and **right**. Every node has exactly one **parent** (except the root) and zero to two **children**; nodes with no children are **leaves**.\n\n- **Height** = longest root-to-leaf path (in edges). A tree with `n` nodes is at least `log n` tall — and at most `n - 1` when it degenerates into a line.\n- Trees are **recursive structures**: every subtree is itself a tree, so almost every algorithm is a 5-line recursion.',
    },
    {
      heading: 'The four traversals',
      body: 'Visiting every node exactly once comes in four flavours:\n\n- **Inorder** (left, node, right): yields sorted order on a binary *search* tree.\n- **Preorder** (node, left, right): copies / serializes the tree shape.\n- **Postorder** (left, right, node): deletes safely children-before-parent, evaluates expression trees.\n- **Level order**: breadth-first with a **queue**, level by level.\n\nThe first three are one recursive idea with the print statement moved; the animation walks inorder below.',
    },
    {
      heading: 'How trees live in memory',
      body: 'Each node is a heap object with `value`, `left`, `right` references — no index arithmetic exists, so reaching a node means walking pointers from the root. A skewed tree of `n` nodes costs `n` references per lookup and `n` recursion depth (hello, `StackOverflowError`).\n\nRecursion depth equals tree height: `O(log n)` for balanced trees, `O(n)` for skewed ones. Iterative versions trade the call stack for an explicit `ArrayDeque`.',
    },
    {
      heading: 'TreeNode from scratch, traversals with java.util',
      body: 'Java has no built-in binary tree node — you write the 10-line `TreeNode` once and reuse it forever. The classic companion skills are the **iterative** traversals: preorder with an explicit stack, level order with a queue.\n\n- Recursive inorder: `traverse(node.left); visit(node); traverse(node.right)` with a `null` base case.\n- Level order: seed a `Queue` with the root, repeatedly poll, print, and offer non-null children.',
    },
  ],
  complexity: [
    { operation: 'Traverse all nodes', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'Height (balanced)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Height (skewed)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Search (plain binary tree)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'TreeNode from scratch',
      description: 'The reusable node plus recursive traversals.',
      code: `import java.util.ArrayList;
import java.util.List;

public class TreeNode {
    int value;
    TreeNode left;
    TreeNode right;

    TreeNode(int value) {
        this.value = value;
    }

    static void inorder(TreeNode node, List<Integer> out) {
        if (node == null) {
            return;
        }
        inorder(node.left, out);
        out.add(node.value);
        inorder(node.right, out);
    }

    static void preorder(TreeNode node, List<Integer> out) {
        if (node == null) {
            return;
        }
        out.add(node.value);
        preorder(node.left, out);
        preorder(node.right, out);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2);
        root.right = new TreeNode(6);
        root.left.left = new TreeNode(1);
        root.left.right = new TreeNode(3);

        List<Integer> out = new ArrayList<>();
        inorder(root, out);
        System.out.println("inorder: " + out);
    }
}
`,
    },
    {
      title: 'Iterative traversals with ArrayDeque',
      description: 'Built-in equivalent: explicit stack and queue instead of recursion.',
      code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Queue;

public class IterativeTraversals {
    static List<Integer> levelOrder(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) {
            return out;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            out.add(node.value);
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        return out;
    }

    static List<Integer> preorder(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) {
            return out;
        }
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            out.add(node.value);
            if (node.right != null) {
                stack.push(node.right);
            }
            if (node.left != null) {
                stack.push(node.left);
            }
        }
        return out;
    }
}
`,
    },
  ],
  mistakes: [
    'Missing the null base case: every recursive traversal must return on null first, or it throws NullPointerException.',
    'Comparing Integer node values with ==: cached only for -128..127 — use equals or unbox to int.',
    'Counting height in nodes vs edges: pick one convention (edges here) and stay consistent, or off-by-ones creep in.',
    'Recursing down a skewed tree: depth n blows the call stack — know the iterative versions.',
    'Pushing children in the wrong order in iterative preorder: push right first so left pops first.',
    'Assuming inorder is sorted: that holds only for binary search trees, not arbitrary binary trees.',
  ],
  vizId: 'binary-tree-traversals',
  problemIds: ['maximum-depth-of-binary-tree', 'invert-binary-tree', 'binary-tree-inorder-traversal'],
};
