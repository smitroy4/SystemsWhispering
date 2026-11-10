import type { Topic } from '../../types/content.ts';

/** Python lists: dynamic arrays under the hood. */
export const pythonArrayTopic: Topic = {
  slug: 'python-array',
  title: 'Python Lists (Dynamic Arrays)',
  category: 'data-structures',
  order: 100,
  summary: "Python's list is a dynamic array — contiguous storage that grows and shrinks automatically, with amortized O(1) append.",
  section: 'core',
  level: 'beginner',
  group: 'python',
  prerequisites: [],
  sections: [
    {
      heading: 'What is a Python list?',
      body: "A Python `list` is a **dynamic array**: a contiguous block of object references that grows when you append beyond its capacity and shrinks when you pop. Items are stored by reference, so a list can hold mixed types.\n\nBecause elements sit next to each other in memory, indexing by position is **O(1)** — just base address + index × pointer size. Appending is **amortized O(1)**: CPython overallocates, so most appends are cheap, and occasional resizes copy the whole block.",
    },
    {
      heading: 'Core operations',
      body: 'Common list operations and their costs:\n\n- `lst[i]` — access by index: **O(1)**\n- `lst.append(x)` — add to end: **amortized O(1)**\n- `lst.insert(i, x)` — insert at position: **O(n)** (shifts everything after `i`)\n- `lst.pop()` — remove from end: **O(1)**\n- `lst.pop(i)` — remove from position: **O(n)**\n- `x in lst` — membership scan: **O(n)**\n- `lst.sort()` — in-place Timsort: **O(n log n)**\n- `len(lst)` — size: **O(1)**',
    },
    {
      heading: 'When to use a list',
      body: 'Use a `list` when you need ordered, indexable storage with fast appends and random access. Avoid it when you need fast inserts/deletes at the front (use `collections.deque`) or fast key-based lookup (use a `dict`).',
    },
  ],
  complexity: [
    { operation: 'Access by index', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Append', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Insert / delete at index', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Search (unsorted)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Basic list operations',
      description: 'Indexing, append, insert, pop, and membership in a Python list.',
      code: `# Python list = dynamic array
scores = [78, 85, 92, 90]

# Access by index: O(1)
print(scores[1])        # 85

# Append: amortized O(1)
scores.append(88)       # [78, 85, 92, 90, 88]

# Insert at position: O(n) — shifts elements after index
scores.insert(2, 95)    # [78, 85, 95, 92, 90, 88]

# Pop from end: O(1)
last = scores.pop()     # 88

# Pop from position: O(n)
scores.pop(0)           # removes 78

# Membership scan: O(n)
print(92 in scores)     # True

# Sort: O(n log n)
scores.sort()
print(scores)           # [85, 90, 92, 95]
`,
    },
  ],
  mistakes: [
    "Using `pop(0)` on a list — it shifts every element, making it O(n). Use `collections.deque.popleft()` instead.",
    "Thinking `lst.insert(0, x)` is fast — it's O(n) because every element shifts right.",
    "Assuming lists store values directly — they store references, so mutating a shared object affects every list that holds it.",
    "Confusing `list.remove(x)` (removes by value, O(n)) with `pop(i)` (removes by index, O(1) at end).",
  ],
  vizId: 'array-ops',
  problemIds: ['two-sum', 'contains-duplicate', 'best-time-to-buy-and-sell-stock'],
};
