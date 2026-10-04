import type { Topic } from '../../types/content.ts';

/** Dijkstra: greedy shortest paths on non-negative weights. */
export const dijkstraTopic: Topic = {
  slug: 'dijkstra',
  title: "Dijkstra's Algorithm",
  category: 'algorithms',
  order: 21,
  summary: 'Settle the closest unsettled vertex, relax its edges, repeat. O((V + E) log V) shortest paths — non-negative weights only.',
  level: 'intermediate',
  prerequisites: ['weighted-graph', 'heap'],
  sections: [
    {
      heading: 'The idea',
      body: 'Keep best-known distances from the source. Repeatedly **settle** the unsettled vertex with the smallest distance — with non-negative weights, no later detour can beat it — then **relax** its edges (`dist[v] = min(dist[v], dist[u] + w)`).\n\nA min-heap always hands over the next vertex to settle. The animation settles A → C → B → D → E on a five-node map.',
    },
    {
      heading: 'How it works',
      body: 'Init all distances to ∞ except 0 at the source. Pop `(d, u)` from the heap; skip stale entries (`d != dist[u]`); relax every edge. Each vertex settles once, each edge relaxes once.\n\n- **Time O((V + E) log V)** with a binary heap, **space O(V + E)**.\n- Stale heap entries are normal (a vertex can improve after being queued) — skipping them is correctness, not optimization.\n- Negative edges break the settle promise: that is Bellman-Ford territory.',
    },
    {
      heading: 'Java notes',
      body: '`PriorityQueue<int[]>` ordered by `Comparator.comparingInt(a -> a[0])` is the standard frontier; pairs beat tiny objects in hot loops. Guard `dist[u] + w` against `Integer.MAX_VALUE` overflow before adding.\n\nFor dense graphs an O(V²) array scan beats the heap. `long` distances when weights or paths are large; `int` otherwise.',
    },
  ],
  complexity: [
    { operation: 'Binary heap', best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V + E)' },
    { operation: 'Array scan (dense)', best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', space: 'O(V + E)' },
  ],
  javaCode: [
    {
      title: "Dijkstra from scratch",
      description: 'Heap frontier with stale-entry skipping.',
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
            int[] cur = pq.poll();
            int d = cur[0];
            int u = cur[1];
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
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            adj.add(new ArrayList<>());
        }
        int[][] raw = {{0, 1, 4}, {0, 2, 2}, {1, 2, 1}, {1, 3, 5}, {2, 3, 8}, {2, 4, 10}, {3, 4, 2}};
        for (int[] e : raw) {
            adj.get(e[0]).add(new Edge(e[1], e[2]));
            adj.get(e[1]).add(new Edge(e[0], e[2]));
        }
        System.out.println(Arrays.toString(shortest(adj, 0))); // [0, 3, 2, 8, 10]
    }
}
`,
    },
    {
      title: 'Path reconstruction variant',
      description: 'Parent pointers turn distances into routes.',
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class DijkstraPath {
    static List<Integer> route(int[] parent, int target) {
        List<Integer> path = new ArrayList<>();
        for (int v = target; v != -1; v = parent[v]) {
            path.add(v);
        }
        Collections.reverse(path);
        return path;
    }

    public static void main(String[] args) {
        // Parents recorded during relaxation: parent[B]=C, parent[C]=A,
        // parent[D]=B, parent[E]=D gives A -> C -> B -> D -> E.
        int[] parent = {-1, 2, 0, 1, 3};
        System.out.println(route(parent, 4)); // [0, 2, 1, 3, 4]
    }
}
`,
    },
  ],
  mistakes: [
    'Running on negative weights: settled-is-final fails — use Bellman-Ford.',
    'Processing stale heap entries: always skip when popped distance differs from dist[u].',
    'Adding to Integer.MAX_VALUE: guard the addition or distances wrap negative.',
    'Forgetting reverse edges on undirected graphs: half the roads vanish from the map.',
    'Reconstructing without parents: record parent[v] = u on every successful relax.',
  ],
  vizId: 'dijkstra-algo-steps',
  problemIds: ['network-delay-time', 'path-with-minimum-effort', 'cheapest-flights-within-k-stops'],
};
