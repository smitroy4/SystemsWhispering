import type { Topic } from '../../types/content.ts';

/** Cycle detection with Union-Find: the edge that connects the connected is redundant. */
export const unionFindCycleTopic: Topic = {
  slug: 'union-find-cycle-detection',
  title: 'Union-Find Cycle Detection',
  category: 'algorithms',
  order: 23,
  summary: 'Process edges one by one: union endpoints, and the first edge inside one component closes a cycle. Near-constant time.',
  level: 'intermediate',
  prerequisites: ['union-find'],
  sections: [
    {
      heading: 'The idea',
      body: 'Walk the edge list, unioning each edge’s endpoints. An edge joining **two components** merges them; an edge inside **one component** is redundant — its endpoints already connect, so it closes a **cycle**.\n\nThe animation feeds `[0-1, 1-2, 2-3, 3-0, 0-2]`: four unions build the tree, the fifth edge finds 0 and 2 already connected — cycle.',
    },
    {
      heading: 'How it works',
      body: 'For each edge `(u, v)`: if `find(u) == find(v)`, report cycle (or return the redundant edge); else `union(u, v)`. Path compression plus union-by-rank keeps every operation near-constant.\n\n- **Time O(E · α(V))** — effectively linear in the edges.\n- **Space O(V)** for parent/rank arrays.\n- Undirected only: directed cycles need DFS coloring or Kahn’s leftovers instead.',
    },
    {
      heading: 'Java notes',
      body: 'Reuse one `DisjointSet` class across union-find problems (provinces, redundant connection, Kruskal) — the only per-problem code is the edge loop and what "already connected" means.\n\nSize the DSU to the vertex count (or `maxId + 1` when ids are sparse), and return the edge itself for "find the redundant connection" style tasks.',
    },
  ],
  complexity: [
    { operation: 'All edges (amortized)', best: 'O(E · α(V))', average: 'O(E · α(V))', worst: 'O(E · α(V))', space: 'O(V)' },
  ],
  javaCode: [
    {
      title: 'Cycle detection from scratch',
      description: 'Union endpoints; same root means cycle.',
      code: `public class CycleCheck {
    static int[] findRedundant(int n, int[][] edges, DisjointSet dsu) {
        for (int[] e : edges) {
            if (!dsu.union(e[0], e[1])) {
                return e; // endpoints already connected: cycle
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {1, 2}, {2, 3}, {3, 0}, {0, 2}};
        DisjointSet dsu = new DisjointSet(4);
        System.out.println(java.util.Arrays.toString(findRedundant(4, edges, dsu))); // [3, 0]
    }
}
`,
    },
    {
      title: 'Counting provinces variant',
      description: 'Same DSU, different question: how many components?',
      code: `public class Provinces {
    static int count(int[][] grid, DisjointSet dsu) {
        int n = grid.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (grid[i][j] == 1) {
                    dsu.union(i, j);
                }
            }
        }
        return dsu.components();
    }

    public static void main(String[] args) {
        int[][] grid = {{1, 1, 0}, {1, 1, 0}, {0, 0, 1}};
        System.out.println(count(grid, new DisjointSet(3))); // 2
    }
}
`,
    },
  ],
  mistakes: [
    'Applying it to directed graphs: same-root in a digraph is not a directed cycle — use DFS colors.',
    'Sizing the DSU to the edge count: size by vertex count (or max id + 1), not number of edges.',
    'Unioning without checking first: the boolean return IS the cycle signal — discarding it loses the answer.',
    'Forgetting path compression in find: without it the "near-constant" promise collapses to O(n).',
    'Returning the wrong edge: Redundant Connection wants the LAST cycle-closing edge in input order — keep scanning.',
  ],
  vizId: 'union-find-cycle-steps',
  problemIds: ['redundant-connection', 'number-of-provinces', 'graph-valid-tree'],
};
