import type { TopicLevel } from '../../types/content.ts';

export type RoadmapStatus = 'done' | 'planned';

export interface RoadmapEntry {
  slug: string;
  title: string;
  level: TopicLevel;
  /** Pedagogical position inside the level (sidebar sorts by this). */
  order: number;
  status: RoadmapStatus;
}

/**
 * The full data-structures curriculum: 19 published topics plus 49
 * planned ones. `order` is pedagogically sequenced inside each level
 * (beginner 1-15, intermediate 16-35, advanced 36-56, expert 57-68).
 * The sidebar merges `planned` entries as disabled "Coming soon" rows.
 */
export const roadmap: RoadmapEntry[] = [
  // ----- Beginner (done) -----
  { slug: 'array', title: 'Arrays', level: 'beginner', order: 1, status: 'done' },
  { slug: 'dynamic-array', title: 'Dynamic Arrays', level: 'beginner', order: 2, status: 'done' },
  { slug: 'array-2d-matrices', title: '2D Arrays & Matrices', level: 'beginner', order: 3, status: 'planned' },
  { slug: 'string', title: 'Strings & StringBuilder', level: 'beginner', order: 4, status: 'done' },
  { slug: 'singly-linked-list', title: 'Singly Linked Lists', level: 'beginner', order: 5, status: 'done' },
  { slug: 'circular-linked-list', title: 'Circular Linked List', level: 'beginner', order: 6, status: 'planned' },
  { slug: 'java-linkedlist-class', title: 'Java LinkedList Class', level: 'beginner', order: 7, status: 'planned' },
  { slug: 'stack', title: 'Stacks', level: 'beginner', order: 8, status: 'done' },
  { slug: 'queue-deque', title: 'Queues & Deques', level: 'beginner', order: 9, status: 'done' },
  { slug: 'circular-queue-ring-buffer', title: 'Circular Queue / Ring Buffer', level: 'beginner', order: 10, status: 'planned' },
  { slug: 'priority-queue-basics', title: 'PriorityQueue Basics', level: 'beginner', order: 11, status: 'planned' },
  { slug: 'hash-set', title: 'Hash Sets', level: 'beginner', order: 12, status: 'done' },
  { slug: 'bitset', title: 'BitSet', level: 'beginner', order: 13, status: 'planned' },
  { slug: 'enumset-enummap', title: 'EnumSet & EnumMap', level: 'beginner', order: 14, status: 'planned' },
  { slug: 'binary-tree', title: 'Binary Trees & Traversals', level: 'beginner', order: 15, status: 'done' },
  // ----- Intermediate (done + planned) -----
  { slug: 'doubly-linked-list', title: 'Doubly Linked Lists', level: 'intermediate', order: 16, status: 'done' },
  { slug: 'hash-table', title: 'Hash Tables', level: 'intermediate', order: 17, status: 'done' },
  { slug: 'treemap-treeset', title: 'TreeMap & TreeSet', level: 'intermediate', order: 18, status: 'planned' },
  { slug: 'multiset-treemap', title: 'Multiset via TreeMap', level: 'intermediate', order: 19, status: 'planned' },
  { slug: 'linkedhashmap-lru-cache', title: 'LinkedHashMap & LRU Cache', level: 'intermediate', order: 20, status: 'planned' },
  { slug: 'lfu-cache', title: 'LFU Cache', level: 'intermediate', order: 21, status: 'planned' },
  { slug: 'immutable-collections', title: 'Immutable Collections', level: 'intermediate', order: 22, status: 'planned' },
  { slug: 'concurrent-collections', title: 'Concurrent Collections', level: 'intermediate', order: 23, status: 'planned' },
  { slug: 'binary-search-tree', title: 'Binary Search Trees', level: 'intermediate', order: 24, status: 'done' },
  { slug: 'avl-tree', title: 'AVL Tree', level: 'intermediate', order: 25, status: 'planned' },
  { slug: 'heap', title: 'Heaps & Priority Queues', level: 'intermediate', order: 26, status: 'done' },
  { slug: 'min-max-heap', title: 'Min-Max Heap', level: 'intermediate', order: 27, status: 'planned' },
  { slug: 'trie', title: 'Tries', level: 'intermediate', order: 28, status: 'done' },
  { slug: 'monotonic-structures', title: 'Monotonic Stack & Queue Structures', level: 'intermediate', order: 29, status: 'planned' },
  { slug: 'deque-sliding-structures', title: 'Deque-Based Sliding Structures', level: 'intermediate', order: 30, status: 'planned' },
  { slug: 'sparse-table', title: 'Sparse Table', level: 'intermediate', order: 31, status: 'planned' },
  { slug: 'sqrt-decomposition', title: 'Sqrt Decomposition', level: 'intermediate', order: 32, status: 'planned' },
  { slug: 'union-find', title: 'Union-Find (DSU)', level: 'intermediate', order: 33, status: 'done' },
  { slug: 'graph-representations', title: 'Graph Representations', level: 'intermediate', order: 34, status: 'done' },
  { slug: 'weighted-graph', title: 'Weighted Graphs', level: 'intermediate', order: 35, status: 'done' },
  // ----- Advanced (done + planned) -----
  { slug: 'segment-tree', title: 'Segment Trees', level: 'advanced', order: 36, status: 'done' },
  { slug: 'fenwick-tree', title: 'Fenwick Trees (BIT)', level: 'advanced', order: 37, status: 'done' },
  { slug: 'red-black-tree', title: 'Red-Black Tree', level: 'advanced', order: 38, status: 'planned' },
  { slug: 'splay-tree', title: 'Splay Tree', level: 'advanced', order: 39, status: 'planned' },
  { slug: 'treap', title: 'Treap', level: 'advanced', order: 40, status: 'planned' },
  { slug: 'skip-list', title: 'Skip List', level: 'advanced', order: 41, status: 'planned' },
  { slug: 'b-tree-b-plus-tree', title: 'B-Tree & B+ Tree', level: 'advanced', order: 42, status: 'planned' },
  { slug: 'ternary-search-tree', title: 'Ternary Search Tree', level: 'advanced', order: 43, status: 'planned' },
  { slug: 'radix-trie', title: 'Radix / Compressed Trie', level: 'advanced', order: 44, status: 'planned' },
  { slug: 'suffix-array', title: 'Suffix Array', level: 'advanced', order: 45, status: 'planned' },
  { slug: 'suffix-automaton', title: 'Suffix Automaton', level: 'advanced', order: 46, status: 'planned' },
  { slug: 'interval-tree', title: 'Interval Tree', level: 'advanced', order: 47, status: 'planned' },
  { slug: 'binomial-heap', title: 'Binomial Heap', level: 'advanced', order: 48, status: 'planned' },
  { slug: 'fibonacci-heap', title: 'Fibonacci Heap', level: 'advanced', order: 49, status: 'planned' },
  { slug: 'indexed-priority-queue', title: 'Indexed Priority Queue', level: 'advanced', order: 50, status: 'planned' },
  { slug: 'mst-structures', title: 'Minimum Spanning Tree Structures', level: 'advanced', order: 51, status: 'planned' },
  { slug: 'advanced-graphs', title: 'Advanced Graphs', level: 'advanced', order: 52, status: 'done' },
  { slug: 'strongly-connected-components', title: 'Strongly Connected Components', level: 'advanced', order: 53, status: 'planned' },
  { slug: 'bridges-articulation-points', title: 'Bridges & Articulation Points', level: 'advanced', order: 54, status: 'planned' },
  { slug: 'bipartite-graphs-matching', title: 'Bipartite Graphs & Matching', level: 'advanced', order: 55, status: 'planned' },
  { slug: 'network-flow-graphs', title: 'Network Flow Graphs', level: 'advanced', order: 56, status: 'planned' },
  // ----- Expert (planned) -----
  { slug: 'bloom-filter', title: 'Bloom Filter', level: 'expert', order: 57, status: 'planned' },
  { slug: 'count-min-sketch', title: 'Count-Min Sketch', level: 'expert', order: 58, status: 'planned' },
  { slug: 'hyperloglog', title: 'HyperLogLog', level: 'expert', order: 59, status: 'planned' },
  { slug: 'cuckoo-hashing', title: 'Cuckoo Hashing', level: 'expert', order: 60, status: 'planned' },
  { slug: 'merkle-tree', title: 'Merkle Tree', level: 'expert', order: 61, status: 'planned' },
  { slug: 'rope', title: 'Rope', level: 'expert', order: 62, status: 'planned' },
  { slug: 'kd-tree', title: 'KD-Tree', level: 'expert', order: 63, status: 'planned' },
  { slug: 'persistent-segment-tree', title: 'Persistent Segment Tree', level: 'expert', order: 64, status: 'planned' },
  { slug: 'lazy-segment-tree', title: 'Lazy Segment Tree & Segment Tree Beats', level: 'expert', order: 65, status: 'planned' },
  { slug: 'heavy-light-decomposition', title: 'Heavy-Light Decomposition', level: 'expert', order: 66, status: 'planned' },
  { slug: 'link-cut-tree', title: 'Link-Cut Tree', level: 'expert', order: 67, status: 'planned' },
  { slug: 'csr-graph-optimizations', title: 'Sparse/Dense Graph Optimizations (CSR)', level: 'expert', order: 68, status: 'planned' },
];
