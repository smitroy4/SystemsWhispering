import type { Topic } from '../../types/content.ts';

/** Prim: grow the MST one cheapest frontier edge at a time. */
export const primTopic: Topic = {
  slug: 'prim',
  title: "Prim's Algorithm",
  category: 'algorithms',
  order: 25,
  summary: 'Minimum spanning tree by expansion: always attach the cheapest edge leaving the grown tree. O((V + E) log V).',
  level: 'intermediate',
  prerequisites: ['heap', 'weighted-graph'],
  sections: [
    {
      heading: 'The idea',
      body: 'Where Kruskal scans all edges globally, **Prim grows one tree**: start anywhere, repeatedly attach the **cheapest edge crossing** from the tree to the outside. The cut property blesses each choice — the cheapest crossing edge belongs to some MST.\n\nIt is Dijkstra’s shape with a different key: distance-from-source becomes cheapest-edge-to-tree. Same heap, same loop, different meaning.',
    },
    {
      heading: 'How it works',
      body: 'Seed a min-heap with edges from the start vertex. Pop the cheapest; if its far end is already in the tree, discard; else attach it (add weight, push its outgoing edges).\n\n- **Time O((V + E) log V)** with a binary heap, **space O(V + E)**.\n- Shines on **dense** graphs where Kruskal’s full sort hurts; Kruskal wins on sparse ones.\n- Stops after V−1 attachments; leftover heap entries mean a disconnected graph.',
    },
    {
      heading: 'Java notes',
      body: 'The frontier holds `int[]{weight, from, to}` triples in a `PriorityQueue` ordered by weight; a `boolean[] inTree` marks membership. Identical scaffolding to Dijkstra — only the relaxation step differs (edge weight, not accumulated distance).\n\nFor dense graphs the O(V²) no-heap variant (track min edge per vertex in arrays) is simpler and faster in practice.',
    },
  ],
  complexity: [
    { operation: 'Binary heap', best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V + E)' },
    { operation: 'Array scan (dense)', best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)', space: 'O(V + E)' },
  ],
  javaCode: [
    {
      title: "Prim from scratch",
      description: 'Heap frontier of crossing edges.',
      code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

public class Prim {
    record Edge(int to, int weight) {}

    static int mstWeight(List<List<Edge>> adj) {
        int n = adj.size();
        boolean[] inTree = new boolean[n];
        Queue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        inTree[0] = true;
        for (Edge e : adj.get(0)) {
            pq.offer(new int[]{e.weight(), 0, e.to()});
        }
        int total = 0;
        int attached = 0;
        while (!pq.isEmpty() && attached < n - 1) {
            int[] cur = pq.poll();
            int w = cur[0];
            int v = cur[2];
            if (inTree[v]) {
                continue;
            }
            inTree[v] = true;
            total += w;
            attached++;
            for (Edge e : adj.get(v)) {
                if (!inTree[e.to()]) {
                    pq.offer(new int[]{e.weight(), v, e.to()});
                }
            }
        }
        return total;
    }

    public static void main(String[] args) {
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            adj.add(new ArrayList<>());
        }
        int[][] raw = {{0, 1, 4}, {0, 2, 3}, {1, 2, 1}, {1, 3, 2}, {2, 3, 5}};
        for (int[] e : raw) {
            adj.get(e[0]).add(new Edge(e[1], e[2]));
            adj.get(e[1]).add(new Edge(e[0], e[2]));
        }
        System.out.println(mstWeight(adj)); // 6
    }
}
`,
    },
    {
      title: 'Dense-graph variant',
      description: 'O(V²) Prim with plain arrays, no heap.',
      code: `import java.util.Arrays;

public class PrimDense {
    static int mstWeight(int[][] w) {
        int n = w.length;
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        boolean[] inTree = new boolean[n];
        best[0] = 0;
        int total = 0;
        for (int i = 0; i < n; i++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!inTree[v] && (u < 0 || best[v] < best[u])) {
                    u = v;
                }
            }
            inTree[u] = true;
            total += best[u];
            for (int v = 0; v < n; v++) {
                if (!inTree[v] && w[u][v] < best[v]) {
                    best[v] = w[u][v];
                }
            }
        }
        return total;
    }
}
`,
    },
  ],
  mistakes: [
    'Relaxing with accumulated distance: Prim keys on edge weight to the tree, not path length — that confusion rebuilds Dijkstra.',
    'Pushing edges to in-tree vertices and attaching blindly: check membership on pop (or push), or cycles enter the tree.',
    'Starting the total at the seed edge weight: the first vertex costs 0 — best[0] = 0, not its cheapest edge.',
    'Stopping at empty heap on disconnected graphs: V−1 attachments is the real done condition.',
    'Using Prim on sparse graphs by default: Kruskal’s sort-then-scan usually wins when E ≈ V.',
  ],
  vizId: 'prim-steps',
  problemIds: ['min-cost-to-connect-all-points'],
};
