import type { Topic } from '../../types/content.ts';

/** Topological sort: linearize a DAG so every edge points forward. */
export const topoSortTopic: Topic = {
  slug: 'topological-sort',
  title: 'Topological Sort',
  category: 'algorithms',
  order: 20,
  summary: 'Kahn’s indegree queue lines up DAG vertices so every dependency comes first. Leftovers mean a cycle.',
  level: 'intermediate',
  prerequisites: ['graph-representations', 'dfs'],
  sections: [
    {
      heading: 'The idea',
      body: 'A **topological order** lists DAG vertices so every edge `u → v` has `u` before `v` — a valid build order, course schedule, or task pipeline. Only **DAGs** have one: a cycle makes "before" impossible.\n\n**Kahn’s algorithm** finds it greedily: repeatedly emit a vertex with **indegree zero** (nothing depends on it... rather, nothing precedes it) and delete its outgoing edges. If vertices remain but none is indegree-zero, the leftovers form a cycle.',
    },
    {
      heading: 'How it works',
      body: 'Compute all indegrees. Queue every 0-indegree vertex. Pop `u`, append to order, and decrement each neighbor — newly-zero neighbors join the queue.\n\n- **Time O(V + E)**, **space O(V)**.\n- Output shorter than V ⟺ cycle exists — the verdict is built in.\n- DFS finishing times reversed give the same order; Kahn additionally *detects* cycles for free.',
    },
    {
      heading: 'Java notes',
      body: 'Indegrees live in an `int[]`, the ready set in an `ArrayDeque`. Decrement with `--indegree[v] == 0` inline, but keep it readable — a helper `ready(v)` documents intent.\n\nCourse Schedule I asks only "possible?" (`order.size() == numCourses`); Course Schedule II wants the order itself. Same code, different return.',
    },
  ],
  complexity: [
    { operation: 'Kahn’s algorithm', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    { operation: 'DFS-based topo order', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  ],
  javaCode: [
    {
      title: 'Kahn’s algorithm from scratch',
      description: 'Indegree queue with built-in cycle verdict.',
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
        System.out.println(order(adj)); // [0, 1, 2, 3]
    }
}
`,
    },
    {
      title: 'DFS finishing-times variant',
      description: 'Reverse postorder gives the same linearization.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TopoDfs {
    static List<Integer> order(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        List<Integer> finish = new ArrayList<>();
        for (int s = 0; s < adj.size(); s++) {
            if (!seen[s]) {
                dfs(adj, s, seen, finish);
            }
        }
        Collections.reverse(finish);
        return finish;
    }

    static void dfs(List<List<Integer>> adj, int u, boolean[] seen, List<Integer> finish) {
        seen[u] = true;
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                dfs(adj, v, seen, finish);
            }
        }
        finish.add(u); // finished last => earliest in topo order
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
        System.out.println(order(adj)); // e.g. [0, 2, 1, 3]
    }
}
`,
    },
  ],
  mistakes: [
    'Treating short output as success: fewer than V vertices means a cycle — check the size.',
    'Decrementing neighbors of never-queued vertices: only pop from the queue; leftovers are the cycle.',
    'Using a stack instead of a queue: still a valid order, but queue order reads as level-by-level priority.',
    'Forgetting disconnected components: seed ALL indegree-zero vertices, not just node 0.',
    'Reversing DFS order wrong: postorder reversed, not preorder — finishing last means earliest.',
  ],
  pythonCode: [
    {
      title: "Kahn's algorithm from scratch",
      description: 'Indegree queue with built-in cycle verdict.',
      code: `from collections import deque


def topo_sort(adj):
    # O(V + E) time, O(V) space
    n = len(adj)
    indegree = [0] * n
    for vs in adj:
        for v in vs:
            indegree[v] += 1

    ready = deque(i for i in range(n) if indegree[i] == 0)
    out = []
    while ready:
        u = ready.popleft()
        out.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                ready.append(v)

    return out  # len(out) < n means a cycle exists


# Demo
adj = [[1, 2], [3], [3], []]  # 0 -> 1, 2 ; 1 -> 3 ; 2 -> 3
print(topo_sort(adj))  # [0, 1, 2, 3]

adj_cycle = [[1], [2], [0]]  # 0->1->2->0 cycle
print(topo_sort(adj_cycle))  # [] (cycle detected)
`,
    },
    {
      title: 'DFS finishing-times variant',
      description: 'Reverse postorder gives the same linearization.',
      code: `def topo_sort_dfs(adj):
    # O(V + E) time, O(V) stack space
    n = len(adj)
    seen = [False] * n
    finish = []

    def visit(u):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]:
                visit(v)
        finish.append(u)  # finished last => earliest in topo order

    for s in range(n):
        if not seen[s]:
            visit(s)

    finish.reverse()
    return finish


# Demo
adj = [[1, 2], [3], [3], []]
print(topo_sort_dfs(adj))  # e.g. [0, 2, 1, 3]
`,
    },
  ],
  vizId: 'topological-sort-steps',
  problemIds: ['course-schedule', 'course-schedule-ii', 'find-eventual-safe-states'],
};
