import type { Topic } from '../../types/content.ts';

/** Bellman-Ford: relax everything V−1 times; negatives welcome. */
export const bellmanFordTopic: Topic = {
  slug: 'bellman-ford',
  title: 'Bellman-Ford',
  category: 'algorithms',
  order: 22,
  summary: 'Relax every edge V−1 times: O(VE) shortest paths with negative weights, plus negative-cycle detection.',
  level: 'intermediate',
  prerequisites: ['weighted-graph', 'dijkstra'],
  sections: [
    {
      heading: 'The idea',
      body: 'Dijkstra settles vertices greedily, which fails the moment an edge goes negative. Bellman-Ford drops the greed: **relax every edge, V−1 rounds**. Any shortest simple path uses at most V−1 edges, so after V−1 rounds every reachable distance is final — no matter the order.\n\nOne extra round doubles as a **negative-cycle detector**: if anything still improves, a reachable money-printing loop exists.',
    },
    {
      heading: 'How it works',
      body: 'Init dist[source] = 0, rest ∞. Repeat V−1 times: for each directed edge (u, v, w), if `dist[u] + w < dist[v]`, update. Early-exit when a round changes nothing.\n\n- **Time O(VE)**, **space O(V)** — slower than Dijkstra, strictly more general.\n- Cheapest Flights (≤ k stops) is Bellman-Ford capped at k rounds: each round adds exactly one more edge to every route.\n- Undirected graphs need both directions listed as separate directed edges.',
    },
    {
      heading: 'Java notes',
      body: 'Edges as `int[]{u, v, w}` in a flat list keep the inner loop tight. Guard `dist[u] != MAX_VALUE` before adding, and snapshot distances per round (`prev` array) when the problem limits edge counts — in-place updates let one round use many edges (fine for vanilla shortest paths, wrong for k-stop limits).',
    },
  ],
  complexity: [
    { operation: 'Shortest paths', best: 'O(VE)', average: 'O(VE)', worst: 'O(VE)', space: 'O(V)' },
    { operation: 'Negative-cycle check', best: 'O(E)', average: 'O(E)', worst: 'O(E)', space: 'O(V)' },
  ],
  javaCode: [
    {
      title: 'Bellman-Ford from scratch',
      description: 'V−1 relaxation rounds plus the detection pass.',
      code: `import java.util.Arrays;

public class BellmanFord {
    static int[] shortest(int n, int[][] edges, int source) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        for (int i = 0; i < n - 1; i++) {
            boolean changed = false;
            for (int[] e : edges) {
                int u = e[0];
                int v = e[1];
                int w = e[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
        return dist;
    }

    static boolean hasNegativeCycle(int n, int[][] edges, int[] dist) {
        for (int[] e : edges) {
            if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]]) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 4}, {0, 2, 2}, {1, 2, -3}, {1, 3, 5}, {2, 3, 8}};
        int[] dist = shortest(4, edges, 0);
        System.out.println(Arrays.toString(dist)); // [0, 4, 1, 9]
        System.out.println(hasNegativeCycle(4, edges, dist)); // false
    }
}
`,
    },
    {
      title: 'K-stop variant built-in style',
      description: 'Snapshot-per-round limits every route to k edges.',
      code: `import java.util.Arrays;

public class BoundedBellmanFord {
    static int cheapest(int n, int[][] flights, int src, int dst, int k) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] prev = dist.clone(); // freeze the round: one edge per route
            for (int[] f : flights) {
                if (prev[f[0]] != Integer.MAX_VALUE && prev[f[0]] + f[2] < dist[f[1]]) {
                    dist[f[1]] = prev[f[0]] + f[2];
                }
            }
        }
        return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
    }

    public static void main(String[] args) {
        int[][] flights = {{0, 1, 100}, {1, 2, 100}, {0, 2, 500}};
        System.out.println(cheapest(3, flights, 0, 2, 1)); // 200
    }
}
`,
    },
  ],
  mistakes: [
    'Skipping the dist[u] != ∞ guard: MAX_VALUE + w wraps negative and invents phantom paths.',
    'Updating in place for k-stop limits: one round must use one edge per route — clone the array per round.',
    'Listing undirected edges once: Bellman-Ford reads directed edges — add both directions.',
    'Forgetting the Vth detection pass: V−1 rounds assume no negative cycle; verify when negatives exist.',
    'Using it by default: O(VE) loses to Dijkstra whenever weights are non-negative.',
  ],
  vizId: 'bellman-ford-steps',
  problemIds: ['cheapest-flights-within-k-stops', 'network-delay-time'],
};
