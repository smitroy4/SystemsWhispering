import type { Topic } from '../../types/content.ts';

/** Breadth-first search: level-by-level traversal with a queue. */
export const bfsTopic: Topic = {
  slug: 'bfs',
  title: 'Breadth-First Search',
  category: 'algorithms',
  order: 18,
  summary: 'Explore in waves from the source using a queue. Shortest paths on unweighted graphs, level by level.',
  level: 'beginner',
  prerequisites: ['queue-deque', 'graph-representations'],
  sections: [
    {
      heading: 'The idea',
      body: 'BFS visits vertices in **waves**: the source, then all its neighbors, then all of theirs. A **queue** enforces the order — whoever is discovered first is processed first — and a **visited set** stops re-entry.\n\nThe first time BFS reaches a vertex, it arrives by the **fewest edges** possible. That single property makes BFS the shortest-path algorithm for unweighted graphs.',
    },
    {
      heading: 'How it works',
      body: 'Enqueue the source and mark visited. While the queue is nonempty: dequeue `u`, and for each neighbor `v` not yet visited, mark and enqueue it.\n\n- **Time O(V + E)**: every vertex dequeued once, every edge examined twice (undirected).\n- **Space O(V)**: queue plus visited set.\n- Track **levels** by snapshotting queue size per wave, or store distances alongside vertices.',
    },
    {
      heading: 'Java notes',
      body: '`ArrayDeque` is the queue (`offer`/`poll`), `HashSet` or a `boolean[]` is the visited set — arrays win when vertices are 0..n-1. For grids, encode cells as `r * cols + c` or keep `int[]` pairs.\n\nLevel-order tree traversal *is* BFS on a tree (no visited set needed — trees have no cycles). Rotting Oranges adds multi-source seeding: enqueue everything at distance zero first.',
    },
  ],
  complexity: [
    { operation: 'Traverse (adjacency list)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    { operation: 'Shortest path (unweighted)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  ],
  javaCode: [
    {
      title: 'BFS from scratch',
      description: 'Queue plus visited set over an adjacency list.',
      code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Bfs {
    static List<Integer> traverse(List<List<Integer>> adj, int source) {
        List<Integer> order = new ArrayList<>();
        boolean[] seen = new boolean[adj.size()];
        Queue<Integer> queue = new ArrayDeque<>();
        seen[source] = true;
        queue.offer(source);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (!seen[v]) {
                    seen[v] = true;
                    queue.offer(v);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            adj.add(new ArrayList<>());
        }
        adj.get(0).add(1);
        adj.get(0).add(2);
        adj.get(1).add(3);
        adj.get(2).add(3);
        System.out.println(traverse(adj, 0)); // [0, 1, 2, 3]
    }
}
`,
    },
    {
      title: 'Level-order built-in style',
      description: 'Wave tracking with per-level queue snapshots.',
      code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class BfsLevels {
    static List<List<Integer>> levels(List<List<Integer>> adj, int source) {
        List<List<Integer>> out = new ArrayList<>();
        boolean[] seen = new boolean[adj.size()];
        Queue<Integer> queue = new ArrayDeque<>();
        seen[source] = true;
        queue.offer(source);
        while (!queue.isEmpty()) {
            List<Integer> wave = new ArrayList<>();
            for (int i = 0, n = queue.size(); i < n; i++) {
                int u = queue.poll();
                wave.add(u);
                for (int v : adj.get(u)) {
                    if (!seen[v]) {
                        seen[v] = true;
                        queue.offer(v);
                    }
                }
            }
            out.add(wave);
        }
        return out;
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            adj.add(new ArrayList<>());
        }
        adj.get(0).add(1);
        adj.get(0).add(2);
        adj.get(1).add(3);
        adj.get(2).add(3);
        System.out.println(levels(adj, 0)); // [[0], [1, 2], [3]]
    }
}
`,
    },
  ],
  mistakes: [
    'Marking visited on dequeue instead of enqueue: the same vertex queues many times — mark when discovered.',
    'Forgetting disconnected components: one BFS covers one component — loop over all vertices for full coverage.',
    'Using a stack (or recursion) by accident: depth-first order loses the shortest-path guarantee.',
    'Re-snapshoting queue size wrong: capture `queue.size()` before the inner loop or waves bleed together.',
    'Storing full paths per queue entry: O(V²) memory — store parents and reconstruct once instead.',
  ],
  vizId: 'bfs-steps',
  problemIds: ['binary-tree-level-order-traversal', 'number-of-islands', 'rotting-oranges'],
};
