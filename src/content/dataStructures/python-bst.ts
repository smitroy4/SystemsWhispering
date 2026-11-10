import type { Topic } from '../../types/content.ts';

/** Binary search tree in pure Python. */
export const pythonBSTTopic: Topic = {
  slug: 'python-bst',
  title: 'Binary Search Tree',
  category: 'data-structures',
  order: 106,
  summary: 'A binary tree where left < root < right — search, insert, and delete are O(h), degenerating to O(n) if the tree becomes a chain.',
  section: 'core',
  level: 'intermediate',
  group: 'python',
  prerequisites: ['python-binary-tree'],
  sections: [
    {
      heading: 'What is a BST?',
      body: "A **binary search tree** is a binary tree with the **BST invariant**: every value in the left subtree is less than the root, and every value in the right subtree is greater. This makes search, insert, and delete proportional to the tree height `h`.\n\nIn a balanced tree `h = O(log n)`, so operations are **O(log n)**. In the worst case (inserting sorted values) the tree becomes a chain and `h = n`, degrading to **O(n)**.",
    },
    {
      heading: 'Core operations',
      body: '- **Search**: compare with root, go left if smaller, right if larger.\n- **Insert**: walk down like search, then attach a new leaf.\n- **Delete**: three cases — leaf (just remove), one child (splice out), two children (replace with inorder successor, then delete it).',
    },
    {
      heading: 'BST vs sorted list',
      body: 'A BST gives you ordered data with O(log n) insert/delete/search when balanced — better than a sorted list (O(n) insert/delete) but worse than a hash table (average O(1) lookup, no ordering).',
    },
  ],
  complexity: [
    { operation: 'Search', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Delete', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)' },
    { operation: 'In-order traversal', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
  ],
  pythonCode: [
    {
      title: 'BST with insert, search, and delete',
      description: 'Recursive BST implementation in Python.',
      code: `class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    # O(h): walk down, then attach a leaf
    if not root:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root


def search(root, value):
    # O(h): follow left/right pointers
    if not root:
        return None
    if value == root.value:
        return root
    if value < root.value:
        return search(root.left, value)
    return search(root.right, value)


def delete(root, value):
    # O(h): three cases — leaf, one child, two children
    if not root:
        return None
    if value < root.value:
        root.left = delete(root.left, value)
    elif value > root.value:
        root.right = delete(root.right, value)
    else:
        # Found the node to delete
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        # Two children: replace with inorder successor (min of right subtree)
        succ = root.right
        while succ.left:
            succ = succ.left
        root.value = succ.value
        root.right = delete(root.right, succ.value)
    return root


def in_order(root):
    if root:
        in_order(root.left)
        print(root.value, end=' ')
        in_order(root.right)


# Demo
root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)

print('In-order (sorted): ', end='')
in_order(root)  # 20 30 40 50 60 70 80
print()

print('Search 60:', search(root, 60) is not None)   # True
print('Search 99:', search(root, 99) is not None)   # False

root = delete(root, 30)
print('After deleting 30: ', end='')
in_order(root)  # 20 40 50 60 70 80
print()
`,
    },
  ],
  mistakes: [
    "Forgetting that BST operations degrade to O(n) on sorted input — use AVL/Red-Black trees for guaranteed balance.",
    "Mishandling the two-child delete case — you must replace with the inorder successor (or predecessor), not just delete the node.",
    "Assuming duplicate values are allowed — the classic BST invariant doesn't define where equal values go; decide on a convention.",
    "Using recursion on skewed trees — can exceed Python's recursion limit.",
  ],
  vizId: 'bst-ops',
  problemIds: ['validate-binary-search-tree', 'lowest-common-ancestor-of-a-binary-search-tree', 'kth-smallest-element-in-a-bst'],
};
