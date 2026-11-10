import type { Topic } from '../../types/content.ts';

/** Hash table in Python using dict. */
export const pythonHashTableTopic: Topic = {
  slug: 'python-hash-table',
  title: 'Hash Table (dict)',
  category: 'data-structures',
  order: 104,
  summary: "Key-value store backed by a hash table — average O(1) insert, lookup, and delete using Python's dict.",
  section: 'core',
  level: 'intermediate',
  group: 'python',
  prerequisites: ['python-array'],
  sections: [
    {
      heading: "What is Python's dict?",
      body: "Python's `dict` is a **hash table**: it maps keys to values using a hash function. Keys must be hashable (immutable types like `str`, `int`, `tuple` of immutables).\n\nCPython uses open addressing with a sparse table. Lookup, insert, and delete are **average O(1)**, worst-case **O(n)** if many keys collide.\n\nDictionary order is guaranteed insertion-ordered since Python 3.7.",
    },
    {
      heading: 'Core operations',
      body: '- `d[key] = value` — insert/update: average **O(1)**\n- `value = d[key]` — lookup: average **O(1)**\n- `del d[key]` — delete: average **O(1)**\n- `key in d` — membership: average **O(1)**\n- `d.get(key, default)` — safe lookup: average **O(1)**\n- `len(d)` — size: **O(1)**',
    },
    {
      heading: 'When to use a dict',
      body: 'Use a `dict` when you need fast key-based lookup, counting frequencies, grouping items, or memoization. Avoid it when you need ordered access by position (use a `list`) or when keys are not hashable.',
    },
  ],
  complexity: [
    { operation: 'Insert / update', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Lookup', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Delete', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Membership (key in d)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'dict as a hash table',
      description: 'Insert, lookup, delete, membership, and counting with dict.',
      code: `# Counting frequencies — classic hash table use
nums = [1, 2, 3, 2, 1, 4, 2]
freq = {}
for n in nums:
    freq[n] = freq.get(n, 0) + 1   # average O(1) insert/update
print(freq)                        # {1: 2, 2: 3, 3: 1, 4: 1}

# Lookup: average O(1)
print(freq.get(2, 0))              # 3
print(freq.get(99, 0))             # 0 (safe, no KeyError)

# Membership: average O(1)
print(3 in freq)                   # True
print(99 in freq)                  # False

# Delete: average O(1)
del freq[4]
print(freq)                        # {1: 2, 2: 3, 3: 1}
`,
    },
  ],
  mistakes: [
    "Using a mutable key (like a `list`) — keys must be hashable/immutable, or you get `TypeError`.",
    "Assuming `d[key]` never fails — use `.get(key, default)` when the key might be missing.",
    "Thinking dict order is arbitrary — insertion order is guaranteed since Python 3.7.",
    "Using a list for membership checks (`x in lst`) instead of a dict/set — O(n) vs average O(1).",
  ],
  vizId: 'hash-collision',
  problemIds: ['two-sum', 'contains-duplicate', 'group-anagrams'],
};
