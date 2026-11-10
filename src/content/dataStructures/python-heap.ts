import type { Topic } from '../../types/content.ts';

/** Heap in Python using heapq. */
export const pythonHeapTopic: Topic = {
  slug: 'python-heap',
  title: 'Heap (Priority Queue)',
  category: 'data-structures',
  order: 107,
  summary: 'A complete binary tree where parent <= children (min-heap) — push and pop are O(log n). Python provides heapq for list-based heaps.',
  section: 'core',
  level: 'intermediate',
  group: 'python',
  prerequisites: ['python-array'],
  sections: [
    {
      heading: 'What is a heap?',
      body: "A **heap** is a complete binary tree with the **heap property**: every parent is <= its children (min-heap) or >= its children (max-heap). The root is always the minimum (min-heap) or maximum (max-heap).\n\nHeaps are stored in arrays: for index `i`, left child is at `2i+1`, right at `2i+2`, parent at `(i-1)//2`. This gives O(1) access to the root and O(log n) push/pop.\n\nPython's `heapq` module provides min-heap operations on a plain list. For a max-heap, negate values before pushing.",
    },
    {
      heading: 'Core operations',
      body: '- `heapq.heappush(h, x)` — push: **O(log n)**\n- `heapq.heappop(h)` — pop smallest: **O(log n)**\n- `h[0]` — peek smallest: **O(1)**\n- `heapq.heapify(lst)` — build heap from list: **O(n)**\n- `heapq.heappushpop(h, x)` — push then pop: **O(log n)**\n- `heapq.heapreplace(h, x)` — pop then push: **O(log n)**',
    },
    {
      heading: 'Classic heap uses',
      body: '- Priority queues and task scheduling\n- Dijkstra\'s algorithm / Prim\'s MST\n- Finding k largest or k smallest elements\n- Median maintenance\n- Huffman coding',
    },
  ],
  complexity: [
    { operation: 'Push (heappush)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Pop (heappop)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Peek (h[0])', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Heapify', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Min-heap and max-heap with heapq',
      description: 'Push, pop, peek, heapify, and max-heap via negation.',
      code: `import heapq


# Min-heap: smallest at root
h = []
heapq.heappush(h, 10)   # [10]
heapq.heappush(h, 3)    # [3, 10]
heapq.heappush(h, 7)    # [3, 10, 7]
heapq.heappush(h, 1)    # [1, 3, 7, 10]

print(h[0])             # 1 — peek smallest, O(1)
print(heapq.heappop(h)) # 1 — pop smallest, O(log n)
print(h)                # [3, 10, 7]

# Heapify: build heap from list in O(n)
nums = [5, 2, 8, 1, 9]
heapq.heapify(nums)
print(nums)             # [1, 2, 8, 5, 9] (heap order, not sorted)

# Max-heap: negate values
max_h = []
for v in [5, 2, 8, 1, 9]:
    heapq.heappush(max_h, -v)
print(-max_h[0])        # 9 — peek largest
print(-heapq.heappop(max_h))  # 9 — pop largest
`,
    },
  ],
  mistakes: [
    "Using `list.pop()` on a heap — it removes the last element, not the root. Always use `heapq.heappop()`.",
    "Forgetting `heapq` is a min-heap — for max-heap, negate values on push and pop.",
    "Calling `heapq.heappop()` on an empty list — raises `IndexError`.",
    "Assuming `h[0]` is the maximum in a min-heap — it is always the minimum.",
  ],
  vizId: 'heap-ops',
  problemIds: ['merge-k-sorted-lists', 'top-k-frequent-elements', 'find-median-from-data-stream'],
};
