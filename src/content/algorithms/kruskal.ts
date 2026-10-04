import type { Topic } from '../../types/content.ts';

/** Kruskal: sort edges, take the cheapest that connects two components. */
export const kruskalTopic: Topic = {
  slug: 'kruskal',
  title: "Kruskal's Algorithm",
  category: 'algorithms',
  order: 24,
  summary: 'Minimum spanning tree by greed: sort all edges, union what connects. O(E log E) with a DSU referee.',
  level: 'intermediate',
  prerequisites: ['union-find-cycle-detection', 'heap'],
  sections: [
    {
      heading: 'The idea',
      body: 'A **minimum spanning tree** connects every vertex for the least total edge weight — cheapest wiring, cheapest roads. Kruskal builds it greedily: **sort all edges by weight**, then take each edge unless its endpoints are already connected (Union-Find referees).\n\nThe cut property guarantees safety: the cheapest edge crossing any partition belongs to *some* MST, and skipping cycle-edges never hurts.',
    },
    {
      heading: 'How it works',
      body: 'Sort edges ascending. Walk them: if `union(u, v)` merges two components, keep the edge (add its weight); else discard it. Stop at V−1 kept edges.\n\n- **Time O(E log E)** — sorting dominates; the DSU work is near-linear.\n- **Space O(V + E)** for the DSU plus edge list.\n- Needs the full edge list up front, unlike Prim which grows from a start vertex.',
    },
    {
      heading: 'Java notes',
      body: 'Edges sort with `Comparator.comparingInt(e -> e[2])` on `int[]{u, v, w}` triples, or a tiny record for readability. Reuse the same `DisjointSet` class as cycle detection — Kruskal *is* cycle detection that collects instead of stopping.\n\nStop early at V−1 edges on connected graphs; fewer kept edges means the graph was disconnected (a forest, not a tree).',
    },
  ],
  complexity: [
    { operation: 'Sort edges', best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V + E)' },
    { operation: 'Union-find passes', best: 'O(E · α(V))', average: 'O(E · α(V))', worst: 'O(E · α(V))', space: 'O(V)' },
  ],
  javaCode: [
    {
      title: "Kruskal from scratch",
      description: 'Sorted edges plus DSU referee.',
      code: `import java.util.Arrays;
import java.util.Comparator;

public class Kruskal {
    static int mstWeight(int n, int[][] edges) {
        Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));
        DisjointSet dsu = new DisjointSet(n);
        int total = 0;
        int kept = 0;
        for (int[] e : edges) {
            if (dsu.union(e[0], e[1])) {
                total += e[2];
                kept++;
                if (kept == n - 1) {
                    break;
                }
            }
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 4}, {0, 2, 3}, {1, 2, 1}, {1, 3, 2}, {2, 3, 5}};
        System.out.println(mstWeight(4, edges)); // 1 + 2 + 3 = 6
    }
}
`,
    },
    {
      title: 'Edge record variant',
      description: 'Readable triples instead of int arrays.',
      code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class KruskalRecords {
    record Edge(int u, int v, int w) {}

    static int mstWeight(int n, List<Edge> edges) {
        List<Edge> sorted = new ArrayList<>(edges);
        sorted.sort(Comparator.comparingInt(Edge::w));
        DisjointSet dsu = new DisjointSet(n);
        int total = 0;
        for (Edge e : sorted) {
            if (dsu.union(e.u(), e.v())) {
                total += e.w();
            }
        }
        return total;
    }

    public static void main(String[] args) {
        List<Edge> edges = List.of(
            new Edge(0, 1, 4),
            new Edge(0, 2, 3),
            new Edge(1, 2, 1),
            new Edge(1, 3, 2),
            new Edge(2, 3, 5)
        );
        System.out.println(mstWeight(4, edges)); // 6
    }
}
`,
    },
  ],
  mistakes: [
    'Stopping at the wrong count: a tree needs exactly V−1 edges — fewer means disconnected input, not a bug to hide.',
    'Sorting descending: the greed needs ascending weight — reversed order builds a maximum spanning tree.',
    'Re-sorting per union: sort once up front; the DSU handles the rest in near-constant time.',
    'Using Kruskal for single-source paths: MST minimizes total wiring, not routes from A — that is Dijkstra.',
    'Forgetting both directions are one edge: list undirected edges once, or the DSU sees phantom duplicates.',
  ],
  vizId: 'kruskal-steps',
  problemIds: ['min-cost-to-connect-all-points', 'number-of-provinces'],
};
