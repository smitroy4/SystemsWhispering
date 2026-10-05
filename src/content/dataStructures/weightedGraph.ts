import type { Topic } from '../../types/content.ts';

/** Weighted graphs: Dijkstra, Bellman-Ford, and MST sketches. */
export const weightedGraphTopic: Topic = {
  slug: 'weighted-graph',
  title: 'Weighted Graphs',
  category: 'data-structures',
  order: 18,
  summary: 'Edges with costs: Dijkstra’s greedy shortest paths, Bellman-Ford for negatives, and MST ideas.',
  level: 'intermediate',
  group: 'non-linear',
  prerequisites: ['graph-representations', 'heap'],
  sections: [
    {
      heading: 'When edges have prices',
      body: 'A **weighted** graph labels every edge with a cost — kilometres, latency, rupees. The flagship question is **shortest path**: cheapest route from a source to everywhere else.\n\nWeights change everything: BFS (hop-counting) goes wrong the moment one road costs more than another. You need algorithms that respect prices.',
    },
    {
      heading: 'Dijkstra: greed that works',
      body: 'With **non-negative** weights, **Dijkstra** is optimal and simple: keep best-known distances, repeatedly settle the unsettled vertex with the smallest distance (a min-heap), and relax its edges. A settled vertex never improves — any alternative route would add non-negative cost.\n\nComplexity `O((V + E) log V)` with a binary heap. The animation settles A → C → B → D → E on a 5-node map.',
    },
    {
      heading: 'Negatives need Bellman-Ford',
      body: 'One negative edge breaks Dijkstra’s "settled is final" promise. **Bellman-Ford** relaxes *every* edge `V − 1` times (`O(VE)`): slow, but handles negatives and **detects negative cycles** with one extra pass — if anything still improves, a cycle prints money.\n\nFor all-pairs needs, **Floyd-Warshall** (`O(V³)`) fills a distance matrix; for cheapest total wiring, **Kruskal** (sort edges + Union-Find) or **Prim** (grow from a start with a heap) build minimum spanning trees.',
    },
    {
      heading: 'Weighted graphs in Java',
      body: 'Model edges as `record Edge(int to, int weight)` and adjacency as `List<List<Edge>>`. Distances live in an `int[]` initialized to `Integer.MAX_VALUE` (guard additions against overflow!), settled flags in a `boolean[]`, and the frontier in a `PriorityQueue<int[]>` ordered by distance.\n\n- Store pairs as `new int[]{dist, vertex}` — arrays beat tiny objects in hot loops.\n- `Map.Entry` or records both work; records document the shape better.',
    },
  ],
  complexity: [
    { operation: 'Dijkstra (binary heap)', best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V + E)' },
    { operation: 'Bellman-Ford', best: 'O(VE)', average: 'O(VE)', worst: 'O(VE)', space: 'O(V + E)' },
    { operation: 'Floyd-Warshall', best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)', space: 'O(V²)' },
    { operation: 'Kruskal / Prim MST', best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V + E)' },
  ],
  javaCode: [
    {
      title: 'Dijkstra from scratch',
      description: 'Heap frontier with lazy deletion of stale entries.',
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

public class Dijkstra {
    record Edge(int to, int weight) {}

    static int[] shortest(List<List<Edge>> adj, int source) {
        int n = adj.size();
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        Queue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, source});
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0];
            int u = curr[1];
            if (d != dist[u]) {
                continue; // stale entry
            }
            for (Edge e : adj.get(u)) {
                if (dist[u] != Integer.MAX_VALUE && dist[u] + e.weight() < dist[e.to()]) {
                    dist[e.to()] = dist[u] + e.weight();
                    pq.offer(new int[]{dist[e.to()], e.to()});
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        int[][] raw = {{0, 1, 4}, {0, 2, 2}, {1, 2, 1}, {1, 3, 5}, {2, 3, 8}, {2, 4, 10}, {3, 4, 2}};
        int n = 5;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] e : raw) {
            adj.get(e[0]).add(new Edge(e[1], e[2]));
            adj.get(e[1]).add(new Edge(e[0], e[2]));
        }
        System.out.println(Arrays.toString(shortest(adj, 0)));
    }
}
`,
    },
    {
      title: 'Bellman-Ford for negatives',
      description: 'Slower, but correct with negative edges and cycle detection.',
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

    public static void main(String[] args) {
        int[][] edges = {{0, 1, 4}, {0, 2, 2}, {1, 2, -3}, {1, 3, 5}, {2, 3, 8}};
        System.out.println(Arrays.toString(shortest(4, edges, 0)));
    }
}
`,
    },
  ],
  mistakes: [
    'Running Dijkstra on negative weights: settled-is-final fails — Bellman-Ford is the correct tool.',
    'Overflowing MAX_VALUE: dist[u] + w wraps negative when dist[u] is infinite — guard before adding.',
    'Processing stale heap entries: always skip when popped distance != dist[u], or vertices settle twice.',
    'Forgetting reverse edges in undirected graphs: Dijkstra on half a road network invents one-way streets.',
    'Using int for path counts/costs that exceed 2³¹: switch to long before the sum overflows.',
    'BFS for weighted shortest path: hop count ≠ cost — one expensive edge beats three cheap ones.',
  ],
  vizId: 'dijkstra-steps',
  problemIds: ['network-delay-time', 'cheapest-flights-within-k-stops'],
};
