import type { Topic } from '../../types/content.ts';

/** Graph representations: edge lists, adjacency lists and matrices. */
export const graphRepresentationsTopic: Topic = {
  slug: 'graph-representations',
  title: 'Graph Representations',
  category: 'data-structures',
  order: 17,
  summary: 'Three ways to store a graph — edge lists, adjacency lists, adjacency matrices — and how the choice shapes every algorithm.',
  level: 'intermediate',
  prerequisites: ['dynamic-array', 'singly-linked-list'],
  sections: [
    {
      heading: 'Graphs are everywhere first',
      body: 'A **graph** is vertices (nodes) joined by **edges** — friendships, roads, dependencies, flights. Edges may be **directed** (one-way) or **undirected** (mutual). Before any traversal or shortest path runs, the graph must live *somewhere*: the representation you pick decides the Big-O of everything after.',
    },
    {
      heading: 'The three classic layouts',
      body: 'The same diamond graph (0–1, 0–2, 1–3, 2–3) stored three ways:\n\n- **Edge list**: flat pairs `[[0,1],[0,2],[1,3],[2,3]]`. Tiny (`O(E)`), perfect input format — but finding neighbours scans everything.\n- **Adjacency list**: `list.get(v)` returns v’s neighbours directly. `O(V + E)` memory, neighbour iteration in `O(deg(v))` — the default for traversal-heavy code.\n- **Adjacency matrix**: `matrix[u][v]` answers "is there an edge?" in `O(1)` — for `O(V²)` memory, brutal on sparse graphs.',
    },
    {
      heading: 'How graphs live in memory',
      body: 'An adjacency list is usually `List<List<Integer>>`: one outer array plus a small list per vertex — scattered objects, but each neighbourhood is contiguous. A matrix is one `V × V` block (boolean or int weights): superb cache behaviour, terrible sparsity cost.\n\nRule of thumb: sparse graphs (roads, social nets) get lists; dense graphs (timetables, Floyd-Warshall) get matrices. The animation shows all three views of one graph lighting up together.',
    },
    {
      heading: 'HashMap adjacency as the flexible equivalent',
      body: 'When vertices are strings or sparse IDs, `Map<V, Set<V>>` adjacency beats index-based lists: no id compression, `O(1)` edge tests via the neighbour set, and natural support for dynamic graphs. It is the pragmatic "built-in" graph for interview code and real tooling alike.',
    },
  ],
  complexity: [
    { operation: 'List neighbours of v', best: 'O(deg(v))', average: 'O(deg(v))', worst: 'O(deg(v))', space: 'O(V + E)' },
    { operation: 'Edge query (list)', best: 'O(1)', average: 'O(deg)', worst: 'O(V)', space: 'O(V + E)' },
    { operation: 'Edge query (matrix)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(V²)' },
    { operation: 'Add vertex / edge (list)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(V + E)' },
  ],
  javaCode: [
    {
      title: 'Graph from scratch',
      description: 'Adjacency lists plus a matrix view of the same graph.',
      code: `import java.util.ArrayList;
import java.util.List;

public class Graph {
    private final List<List<Integer>> adj;
    private final boolean directed;

    public Graph(int vertices, boolean directed) {
        this.directed = directed;
        adj = new ArrayList<>(vertices);
        for (int i = 0; i < vertices; i++) {
            adj.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        if (!directed) {
            adj.get(v).add(u);
        }
    }

    public List<Integer> neighbors(int v) {
        return List.copyOf(adj.get(v));
    }

    public boolean[][] toMatrix() {
        boolean[][] m = new boolean[adj.size()][adj.size()];
        for (int u = 0; u < adj.size(); u++) {
            for (int v : adj.get(u)) {
                m[u][v] = true;
            }
        }
        return m;
    }

    public static void main(String[] args) {
        Graph g = new Graph(4, false);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 3);
        System.out.println(g.neighbors(0));
        System.out.println(g.toMatrix()[1][3]);
    }
}
`,
    },
    {
      title: 'Map-based adjacency equivalent',
      description: 'Built-in equivalent: flexible graphs over arbitrary labels.',
      code: `import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class LabeledGraph {
    private final Map<String, Set<String>> adj = new HashMap<>();

    public void addEdge(String u, String v) {
        adj.computeIfAbsent(u, k -> new HashSet<>()).add(v);
        adj.computeIfAbsent(v, k -> new HashSet<>()).add(u);
    }

    public boolean hasEdge(String u, String v) {
        return adj.getOrDefault(u, Set.of()).contains(v);
    }

    public Set<String> neighbors(String v) {
        return adj.getOrDefault(v, Set.of());
    }

    public static void main(String[] args) {
        LabeledGraph g = new LabeledGraph();
        g.addEdge("delhi", "agra");
        g.addEdge("delhi", "jaipur");
        g.addEdge("agra", "kanpur");
        System.out.println(g.neighbors("delhi"));
        System.out.println(g.hasEdge("agra", "kanpur"));
    }
}
`,
    },
  ],
  mistakes: [
    'Forgetting the reverse edge in undirected graphs: addEdge must link both directions or traversals miss half the graph.',
    'Sizing adjacency lists wrong: allocate one list per vertex up front — lazy nulls cause NullPointerExceptions mid-traversal.',
    'Exposing internal neighbour lists: return copies or unmodifiable views so callers cannot corrupt the graph.',
    'Using a matrix for sparse graphs: 100k vertices need 10 billion cells — lists use O(V + E) instead.',
    'Treating directed edges as mutual: dependency and flight graphs are one-way; symmetrizing them invents routes.',
    'Rebuilding representations per query: convert once (edge list → adjacency list) and reuse it for every traversal.',
  ],
  vizId: 'graph-representations',
  problemIds: ['number-of-islands', 'max-area-of-island'],
};
