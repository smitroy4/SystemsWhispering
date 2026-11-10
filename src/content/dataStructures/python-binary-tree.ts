import type { Topic } from '../../types/content.ts';

/** Binary tree in pure Python. */
export const pythonBinaryTreeTopic: Topic = {
  slug: 'python-binary-tree',
  title: 'Binary Tree',
  category: 'data-structures',
  order: 105,
  summary: 'A hierarchy where each node has at most two children — traversals (pre/in/post-order and level-order) are the core algorithms.',
  section: 'core',
  level: 'beginner',
  group: 'python',
  prerequisites: [],
  sections: [
    {
      heading: 'What is a binary tree?',
      body: 'A **binary tree** is a hierarchical structure where each node has at most two children: left and right. The top node is the **root**; nodes with no children are **leaves**. Each node points to its children, never its parent.\n\nTrees model hierarchies (file systems, DOM, org charts) and are the basis for BSTs, heaps, and expression parsing.\n\n**Height** = edges on the longest root-to-leaf path. **Depth** = edges from root to a node.',
    },
    {
      heading: 'Traversals',
      body: 'Depth-first (visit node, then recurse into children):\n- **Pre-order**: root → left → right (copy/clone a tree)\n- **In-order**: left → root → right (sorted output on a BST)\n- **Post-order**: left → right → root (delete/free a tree)\n\nBreadth-first:\n- **Level-order**: visit row by row using a queue (BFS)',
    },
    {
      heading: 'Complexity',
      body: 'Traversal visits every node once: **O(n)** time. Recursive depth-first uses **O(h)** call-stack space where `h` is height; level-order uses **O(w)** queue space where `w` is the widest level.',
    },
  ],
  complexity: [
    { operation: 'Traversal (any order)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'Search (unsorted tree)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'Insert (unsorted)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Binary tree with DFS and BFS traversals',
      description: 'Node class with pre-order, in-order, post-order, and level-order traversal.',
      code: `from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def pre_order(node):
    # Root → Left → Right
    if not node:
        return
    print(node.value, end=' ')
    pre_order(node.left)
    pre_order(node.right)


def in_order(node):
    # Left → Root → Right
    if not node:
        return
    in_order(node.left)
    print(node.value, end=' ')
    in_order(node.right)


def post_order(node):
    # Left → Right → Root
    if not node:
        return
    post_order(node.left)
    post_order(node.right)
    print(node.value, end=' ')


def level_order(root):
    # Breadth-first: row by row using a queue
    if not root:
        return
    q = deque([root])
    while q:
        node = q.popleft()
        print(node.value, end=' ')
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)


# Build a small tree:
#      1
#     / \
#    2   3
#   / \
#  4   5
root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.left.right = Node(5)

print('Pre-order: ', end='')
pre_order(root)   # 1 2 4 5 3
print()
print('In-order:  ', end='')
in_order(root)    # 4 2 5 1 3
print()
print('Post-order:', end='')
post_order(root)  # 4 5 2 3 1
print()
print('Level-order:', end='')
level_order(root) # 1 2 3 4 5
print()
`,
    },
  ],
  mistakes: [
    "Forgetting the base case (`if not node: return`) in recursive traversals — infinite recursion.",
    "Confusing in-order with pre-order — only in-order gives sorted output on a BST.",
    "Using recursion for very deep trees — can hit Python's recursion limit (~1000). Use an iterative approach instead.",
    "Thinking level-order uses a stack — it uses a queue (FIFO), not a stack.",
  ],
  vizId: 'binary-tree-traversals',
  problemIds: ['maximum-depth-of-binary-tree', 'same-tree', 'invert-binary-tree'],
};
