import type { Topic } from '../../types/content.ts';

/** Advanced graphs: DAGs, topological order, bipartiteness, SCCs. */
export const advancedGraphsTopic: Topic = {
  slug: 'advanced-graphs',
  title: 'Advanced Graphs',
  category: 'data-structures',
  order: 19,
  summary: 'Structure beyond traversal: DAGs and topo order, bipartite coloring, and strongly connected components.',
  level: 'advanced',
  group: 'non-linear',
  prerequisites: ['graph-representations', 'weighted-graph'],
  sections: [
    {
      heading: 'When direction means order',
      body: 'A **DAG** (directed acyclic graph) models precedence: courses, builds, task pipelines. Its superpower is **topological order** — a line-up where every edge points forward. Kahn’s algorithm produces one: repeatedly emit indegree-0 vertices and delete their edges. No such vertex but vertices remain? That leftover is a **cycle**, and no order exists.\n\nTopo order is how build tools, schedulers, and spreadsheet recalculation all serialize dependency graphs.',
    },
    {
      heading: 'Two colors are enough sometimes',
      body: 'A graph is **bipartite** if vertices split into two sets with every edge crossing between them — think workers/shifts, students/courses. Test with BFS **2-coloring**: paint the start A, neighbours B, and so on. Any edge joining same colors proves impossibility.\n\nBipartiteness equals "no odd cycle", and the coloring itself is the matching/scheduling assignment you usually wanted.',
    },
    {
      heading: 'Mutually reachable clusters',
      body: 'In directed graphs, reachability is one-way. A **strongly connected component** (SCC) is a maximal cluster where everyone reaches everyone — cycles glued together. **Kosaraju’s** method finds them: DFS order on the graph, then DFS on the **reversed** graph in that order; each pass carves one SCC.\n\nCondensing every SCC to a single node always yields a DAG — the "big picture" of any directed graph.',
    },
    {
      heading: 'Topo sort and 2-coloring in Java',
      body: 'Both patterns share one skeleton: integer state arrays over adjacency lists. Kahn keeps an indegree array plus a queue of ready vertices. Bipartite BFS keeps a color array (`-1` unvisited) and flips `0 ↔ 1` across edges, failing on any same-color edge.',
    },
  ],
  complexity: [
    { operation: 'Topological sort (Kahn)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V + E)' },
    { operation: 'Bipartite check (BFS)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V + E)' },
    { operation: 'SCC (Kosaraju / Tarjan)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V + E)' },
  ],
  javaCode: [
    {
      title: 'Kahn’s topological sort',
      description: 'Indegree counting with a ready queue; leftovers mean cycle.',
      code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class TopoSort {
    static List<Integer> order(List<List<Integer>> adj) {
        int n = adj.size();
        int[] indegree = new int[n];
        for (List<Integer> vs : adj) {
            for (int v : vs) {
                indegree[v]++;
            }
        }
        Queue<Integer> ready = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                ready.offer(i);
            }
        }
        List<Integer> out = new ArrayList<>();
        while (!ready.isEmpty()) {
            int u = ready.poll();
            out.add(u);
            for (int v : adj.get(u)) {
                if (--indegree[v] == 0) {
                    ready.offer(v);
                }
            }
        }
        return out; // size < n means a cycle ate the rest
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
        System.out.println(order(adj)); // e.g. [0, 1, 2, 3]
    }
}
`,
    },
    {
      title: 'Bipartite check with BFS coloring',
      description: 'Two-coloring that fails loudly on odd cycles.',
      code: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class Bipartite {
    static boolean isBipartite(List<List<Integer>> adj) {
        int n = adj.size();
        int[] color = new int[n];
        Arrays.fill(color, -1);
        for (int start = 0; start < n; start++) {
            if (color[start] != -1) {
                continue;
            }
            color[start] = 0;
            Queue<Integer> queue = new ArrayDeque<>();
            queue.offer(start);
            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : adj.get(u)) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        queue.offer(v);
                    } else if (color[v] == color[u]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
`,
    },
  ],
  mistakes: [
    'Topo-sorting a cyclic graph silently: check output size == V — short output IS the cycle verdict.',
    'Forgetting disconnected components in bipartite BFS: outer loop over all vertices, not one BFS from 0.',
    'Reversing edges wrong for Kosaraju: the second pass needs the transpose — same vertices, flipped edges.',
    'Treating SCCs as undirected components: one-way reachability splits what undirected DFS would merge.',
    'Using DFS finish order as topo order directly: reverse it — finish times come out backwards.',
    'Coloring with booleans: you need THREE states (unvisited/A/B) — a boolean array cannot represent "unseen".',
  ],
  vizId: 'advanced-graphs-tour',
  problemIds: ['course-schedule', 'course-schedule-ii', 'is-graph-bipartite'],
};
