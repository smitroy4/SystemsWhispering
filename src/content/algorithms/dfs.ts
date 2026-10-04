import type { Topic } from '../../types/content.ts';

/** Depth-first search: plunge down one path before trying the next. */
export const dfsTopic: Topic = {
  slug: 'dfs',
  title: 'Depth-First Search',
  category: 'algorithms',
  order: 19,
  summary: 'Chase each path to its end with a stack (or recursion). Topological order, cycle detection, and connected components all start here.',
  level: 'beginner',
  prerequisites: ['stack', 'graph-representations'],
  sections: [
    {
      heading: 'The idea',
      body: 'DFS explores **as far as possible** along each branch before backtracking — maze-solving by keeping one hand on the wall. A **stack** (explicit, or the call stack via recursion) remembers where to resume.\n\nWhere BFS fans out in waves, DFS dives: same O(V + E), opposite order. Reachability, components, and cycle detection don’t care about the order — shortest paths do, which is the real BFS-vs-DFS decision.',
    },
    {
      heading: 'How it works',
      body: 'Iterative: push the source; while the stack is nonempty, pop `u`; if unvisited, mark and push all neighbors. Recursive: mark on entry, recurse on each unvisited neighbor.\n\n- **Time O(V + E)**, **space O(V)** worst case (a line graph parks every vertex on the stack).\n- Iterative order depends on push sequence: push neighbors **right-to-left** to visit left first.\n- Recursion reads cleaner but inherits stack-overflow risk on deep graphs — iterative is the production default.',
    },
    {
      heading: 'Java notes',
      body: '`ArrayDeque` as an explicit stack (`push`/`pop`) mirrors the recursive shape without depth limits. A `boolean[]` visited array covers 0..n-1 vertices; `HashSet` covers arbitrary labels.\n\nGrid DFS usually mutates the board in place (`grid[r][c] = 0`) instead of a separate visited set — the animation’s diamond uses an explicit set so the mechanism stays visible.',
    },
  ],
  complexity: [
    { operation: 'Traverse (adjacency list)', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    { operation: 'Connected components', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  ],
  javaCode: [
    {
      title: 'DFS from scratch',
      description: 'Iterative with an explicit stack, plus the recursive twin.',
      code: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class Dfs {
    static List<Integer> iterative(List<List<Integer>> adj, int source) {
        List<Integer> order = new ArrayList<>();
        boolean[] seen = new boolean[adj.size()];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(source);
        while (!stack.isEmpty()) {
            int u = stack.pop();
            if (seen[u]) {
                continue;
            }
            seen[u] = true;
            order.add(u);
            List<Integer> nbrs = adj.get(u);
            for (int i = nbrs.size() - 1; i >= 0; i--) {
                stack.push(nbrs.get(i)); // reverse: visit left first
            }
        }
        return order;
    }

    static void recursive(List<List<Integer>> adj, int u, boolean[] seen, List<Integer> order) {
        seen[u] = true;
        order.add(u);
        for (int v : adj.get(u)) {
            if (!seen[v]) {
                recursive(adj, v, seen, order);
            }
        }
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
        System.out.println(iterative(adj, 0)); // [0, 1, 3, 2]
    }
}
`,
    },
    {
      title: 'Components built-in style',
      description: 'One DFS per unvisited vertex counts components.',
      code: `import java.util.ArrayList;
import java.util.List;

public class Components {
    static int count(List<List<Integer>> adj) {
        boolean[] seen = new boolean[adj.size()];
        int components = 0;
        for (int s = 0; s < adj.size(); s++) {
            if (!seen[s]) {
                components++;
                Dfs.recursive(adj, s, seen, new ArrayList<>());
            }
        }
        return components;
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            adj.add(new ArrayList<>());
        }
        adj.get(0).add(1);
        adj.get(2).add(3);
        System.out.println(count(adj)); // 3: {0,1}, {2,3}, {4}
    }
}
`,
    },
  ],
  mistakes: [
    'Marking visited after popping without a guard: duplicates pile the stack — check `seen` on pop or mark on push.',
    'Pushing neighbors left-to-right: the stack reverses order — push right-to-left for left-first visits.',
    'One DFS for disconnected graphs: loop over all vertices or components go uncounted.',
    'Recursing on deep graphs: line-shaped input overflows the call stack — go iterative past ~10⁴ depth.',
    'Using DFS for unweighted shortest paths: depth-first arrival is arbitrary — BFS owns shortest hops.',
  ],
  vizId: 'dfs-steps',
  problemIds: ['number-of-islands', 'max-area-of-island', 'clone-graph'],
};
