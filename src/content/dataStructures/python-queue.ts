import type { Topic } from '../../types/content.ts';

/** Queue in Python using collections.deque. */
export const pythonQueueTopic: Topic = {
  slug: 'python-queue',
  title: 'Queue (Deque)',
  category: 'data-structures',
  order: 103,
  summary: 'First-in, first-out (FIFO) structure — enqueue at the back, dequeue from the front, both O(1) with collections.deque.',
  section: 'core',
  level: 'beginner',
  group: 'python',
  prerequisites: ['python-array'],
  sections: [
    {
      heading: 'What is a queue?',
      body: 'A **queue** is a first-in, first-out (FIFO) container. You **enqueue** at the back and **dequeue** from the front. The first element added is the first one removed.\n\nThink of a line at a ticket counter. BFS, print spoolers, and task scheduling all use queues.',
    },
    {
      heading: 'Queue in Python',
      body: "Never use a plain `list` as a queue — `pop(0)` shifts every element, making dequeue **O(n)**. Use `collections.deque` (double-ended queue) instead: `append()` enqueues at the back and `popleft()` dequeues from the front, both **O(1)**.\n\n- `deque.append(x)` — enqueue: **O(1)**\n- `deque.popleft()` — dequeue: **O(1)**\n- `deque[0]` — peek front: **O(1)**\n- `len(d)` — size: **O(1)**",
    },
    {
      heading: 'Classic queue uses',
      body: '- Breadth-first search (BFS)\n- Print spoolers and task queues\n- Sliding window problems\n- Level-order tree traversal',
    },
  ],
  complexity: [
    { operation: 'Enqueue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Dequeue', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Peek / front', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Queue using collections.deque',
      description: 'Enqueue, dequeue, peek, and size using deque.',
      code: `from collections import deque


class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, item):
        # O(1) — add to back
        self._items.append(item)

    def dequeue(self):
        # O(1) — remove from front
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self._items.popleft()

    def peek(self):
        # O(1)
        if self.is_empty():
            raise IndexError("peek from empty queue")
        return self._items[0]

    def is_empty(self):
        return len(self._items) == 0

    def size(self):
        return len(self._items)


# Demo
q = Queue()
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
print(q.peek())    # 10
print(q.dequeue()) # 10
print(q.dequeue()) # 20
print(q.size())    # 1
`,
    },
  ],
  mistakes: [
    "Using `list.pop(0)` to dequeue — it shifts all remaining elements, O(n). Always use `deque.popleft()`.",
    "Forgetting to check for empty queue before `dequeue()` or `peek()` — raises `IndexError`.",
    "Confusing queue (FIFO) with stack (LIFO).",
    "Using `queue.Queue` (threading module) when you don't need thread safety — `collections.deque` is faster for single-threaded use.",
  ],
  vizId: 'queue-deque-ops',
  problemIds: ['binary-tree-level-order-traversal', 'number-of-islands', 'rotting-oranges'],
};
