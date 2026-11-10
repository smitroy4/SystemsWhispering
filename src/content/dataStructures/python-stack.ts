import type { Topic } from '../../types/content.ts';

/** Stack in Python using a list. */
export const pythonStackTopic: Topic = {
  slug: 'python-stack',
  title: 'Stack',
  category: 'data-structures',
  order: 102,
  summary: 'Last-in, first-out (LIFO) structure — push and pop from the same end, both O(1) with a Python list.',
  section: 'core',
  level: 'beginner',
  group: 'python',
  prerequisites: ['python-array'],
  sections: [
    {
      heading: 'What is a stack?',
      body: 'A **stack** is a last-in, first-out (LIFO) container. You **push** onto the top and **pop** from the top. Only the most recently added element is accessible.\n\nThink of a stack of plates: you add to the top and remove from the top. The `call stack`, undo/redo, and DFS all use stacks under the hood.',
    },
    {
      heading: 'Stack in Python',
      body: "Python's `list` makes a perfectly good stack: `append()` pushes and `pop()` pops from the end, both **O(1)**. Use `collections.deque` only if you also need fast operations at the front (then it becomes a deque, not a pure stack).\n\n- `lst.append(x)` — push: **O(1)** amortized\n- `lst.pop()` — pop: **O(1)**\n- `lst[-1]` — peek: **O(1)**\n- `len(lst)` — size: **O(1)**",
    },
    {
      heading: 'Classic stack uses',
      body: '- Matching parentheses / brackets\n- Undo / redo in editors\n- Call stack during recursion\n- Depth-first search (iterative)\n- Evaluating postfix expressions',
    },
  ],
  complexity: [
    { operation: 'Push', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Pop', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Peek / top', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Stack using a Python list',
      description: 'Push, pop, peek, and size using list append/pop.',
      code: `class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        # O(1) amortized
        self._items.append(item)

    def pop(self):
        # O(1) — raises IndexError if empty
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self):
        # O(1)
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self._items[-1]

    def is_empty(self):
        return len(self._items) == 0

    def size(self):
        return len(self._items)


# Demo
s = Stack()
s.push(10)
s.push(20)
s.push(30)
print(s.peek())   # 30
print(s.pop())    # 30
print(s.pop())    # 20
print(s.size())   # 1
`,
    },
  ],
  mistakes: [
    "Using `pop(0)` instead of `pop()` — `pop(0)` removes from the front and is O(n).",
    "Forgetting to check for empty stack before `pop()` or `peek()` — raises `IndexError`.",
    "Confusing stack (LIFO) with queue (FIFO).",
    "Using a linked list when a list works fine — Python lists are already efficient stacks.",
  ],
  vizId: 'stack-push-pop',
  problemIds: ['valid-parentheses', 'min-stack', 'evaluate-reverse-polish-notation'],
};
