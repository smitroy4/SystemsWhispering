import type { Topic } from '../../types/content.ts';

/** Singly linked list in pure Python. */
export const pythonLinkedListTopic: Topic = {
  slug: 'python-linked-list',
  title: 'Linked List (Singly)',
  category: 'data-structures',
  order: 101,
  summary: 'A chain of nodes where each node points to the next — insertion and deletion are O(1) once you have the position, but access is O(n).',
  section: 'core',
  level: 'beginner',
  group: 'python',
  prerequisites: [],
  sections: [
    {
      heading: 'What is a linked list?',
      body: 'A **singly linked list** is a sequence of nodes. Each node holds a value and a `next` reference to the following node. The list starts at a `head` reference and ends at a node whose `next` is `None`.\n\nUnlike Python lists, nodes are not contiguous in memory. You reach element `i` by walking `next` pointers from the head, so access is **O(n)**. The tradeoff: inserting or deleting at a known position is **O(1)** — just rewire two pointers, no shifting.',
    },
    {
      heading: 'Core operations',
      body: '- **Append to tail**: O(n) unless you keep a tail pointer, then O(1).\n- **Prepend to head**: O(1) — create a node and point it at the old head.\n- **Insert after a node**: O(1) — rewire `new.next = node.next` then `node.next = new`.\n- **Delete a node**: O(1) if you have the node, O(n) if you only have the value.\n- **Search by value**: O(n) — must walk from head.',
    },
    {
      heading: 'Linked list vs Python list',
      body: "Python's built-in `list` is a dynamic array, not a linked list. Use a hand-rolled linked list when you need frequent middle insertions/deletions and already have node references; otherwise prefer `list` or `collections.deque`.",
    },
  ],
  complexity: [
    { operation: 'Access by index', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Search by value', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Prepend to head', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Insert / delete at known node', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Append to tail (no tail ptr)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Singly linked list implementation',
      description: 'Node class with append, prepend, delete, and search.',
      code: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, value):
        # O(1): new node points to old head
        new_node = Node(value)
        new_node.next = self.head
        self.head = new_node

    def append(self, value):
        # O(n) without tail pointer: walk to end
        new_node = Node(value)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def delete(self, value):
        # O(n): find node, then rewire
        if not self.head:
            return
        if self.head.value == value:
            self.head = self.head.next
            return
        current = self.head
        while current.next and current.next.value != value:
            current = current.next
        if current.next:
            current.next = current.next.next

    def search(self, value):
        # O(n): walk from head
        current = self.head
        while current:
            if current.value == value:
                return True
            current = current.next
        return False

    def __str__(self):
        values = []
        current = self.head
        while current:
            values.append(str(current.value))
            current = current.next
        return ' -> '.join(values) if values else 'empty'


# Demo
ll = LinkedList()
ll.append(10)
ll.append(20)
ll.prepend(5)      # 5 -> 10 -> 20
print(ll)          # 5 -> 10 -> 20
ll.delete(10)      # 5 -> 20
print(ll)          # 5 -> 20
print(ll.search(20))  # True
`,
    },
  ],
  mistakes: [
    "Forgetting to update `head` when deleting the first node.",
    "Walking from head every time to append — keep a `tail` pointer for O(1) appends.",
    "Assuming linked list access by index is O(1) like Python lists — it is O(n).",
    "Creating cycles by accident when rewiring pointers.",
  ],
  vizId: 'sll-ops',
  problemIds: ['reverse-linked-list', 'linked-list-cycle', 'merge-two-sorted-lists'],
};
