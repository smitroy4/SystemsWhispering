import type { Topic } from '../../types/content.ts';

/** Union-Find: near-constant connectivity via parent pointers. */
export const unionFindTopic: Topic = {
  slug: 'union-find',
  title: 'Union-Find (DSU)',
  category: 'data-structures',
  order: 16,
  summary: 'Disjoint Set Union: parent arrays, path compression, and union by rank — connectivity in near-constant time.',
  level: 'intermediate',
  group: 'non-linear',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'Sets that merge',
      body: '**Union-Find** (Disjoint Set Union) tracks a partition of elements into groups with two operations: `union(a, b)` merges their groups, `find(x)` returns the group’s **representative** (root). `connected(a, b)` is just `find(a) == find(b)`.\n\nIt powers Kruskal’s MST, percolation, image components, friend circles, and cycle detection — anywhere connectivity arrives one edge at a time.',
    },
    {
      heading: 'How forests live in two arrays',
      body: 'Each element stores a **parent** index; roots point to themselves, forming upside-down trees. Two optimizations make it effectively constant:\n\n- **Path compression**: every `find` rewires visited nodes directly to the root, flattening future walks.\n- **Union by rank/size**: always hang the shorter tree under the taller one, so height grows only logarithmically.\n\nTogether they give the famous **inverse-Ackermann** amortized cost — ≤ 5 for any input you will ever meet. Two int arrays, no objects per element.',
    },
    {
      heading: 'The animation’s story',
      body: 'Six singletons: `union(0, 1)` and `union(2, 3)` build two pairs; `union(1, 2)` hangs one tree under the other by rank; then `find(3)` walks 3 → 2 → 0 and **compresses** 3 straight to the root. Watch the parent edges rewire.',
    },
    {
      heading: 'No JDK equivalent — this is the idiom',
      body: 'Java ships no DisjointSet class, so every codebase carries this same ~30-line version — which is exactly why it is worth memorizing. The second snippet applies it to **cycle detection**: an edge whose ends are already connected closes a loop (the heart of Kruskal and Redundant Connection).',
    },
  ],
  complexity: [
    { operation: 'Find (with compression)', best: 'O(1)', average: 'O(α(n))', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Union (by rank)', best: 'O(1)', average: 'O(α(n))', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Connected', best: 'O(1)', average: 'O(α(n))', worst: 'O(log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'DisjointSet from scratch',
      description: 'Parent + rank arrays with both optimizations.',
      code: `public class DisjointSet {
    private final int[] parent;
    private final int[] rank;
    private int components;

    public DisjointSet(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }

    public boolean union(int a, int b) {
        int ra = find(a);
        int rb = find(b);
        if (ra == rb) {
            return false; // already connected: this edge is a cycle
        }
        if (rank[ra] < rank[rb]) {
            parent[ra] = rb;
        } else if (rank[ra] > rank[rb]) {
            parent[rb] = ra;
        } else {
            parent[rb] = ra;
            rank[ra]++;
        }
        components--;
        return true;
    }

    public boolean connected(int a, int b) {
        return find(a) == find(b);
    }

    public int components() {
        return components;
    }

    public static void main(String[] args) {
        DisjointSet dsu = new DisjointSet(6);
        dsu.union(0, 1);
        dsu.union(2, 3);
        dsu.union(1, 2);
        System.out.println(dsu.connected(0, 3)); // true
        System.out.println(dsu.components()); // 3
    }
}
`,
    },
    {
      title: 'Cycle detection with DisjointSet',
      description: 'Applied Java: redundant edge = union that returns false.',
      code: `public class CycleCheck {
    static boolean hasCycle(int n, int[][] edges) {
        DisjointSet dsu = new DisjointSet(n);
        for (int[] e : edges) {
            if (!dsu.union(e[0], e[1])) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] triangle = {{0, 1}, {1, 2}, {2, 0}};
        int[][] line = {{0, 1}, {1, 2}};
        System.out.println(hasCycle(3, triangle)); // true
        System.out.println(hasCycle(3, line)); // false
    }
}
`,
    },
  ],
  mistakes: [
    'Skipping path compression: without it, find degrades to O(n) on adversarial unions.',
    'Union without rank: always attaching b under a grows tall trees — compare ranks (or sizes) every time.',
    'Comparing find results with stale roots: call find fresh; cached representatives die on the next union.',
    'Forgetting union returns a signal: false means "already connected" — that IS the cycle/redundancy answer.',
    '1-indexed input, 0-indexed arrays: size n + 1 or shift — pick one before the first union.',
    'Recursive find on huge sets: depth stays tiny with both optimizations, but an iterative find removes all doubt.',
  ],
  vizId: 'union-find-ops',
  problemIds: ['number-of-provinces', 'redundant-connection'],
};
