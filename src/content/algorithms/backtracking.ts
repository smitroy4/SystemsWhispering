import type { Topic } from '../../types/content.ts';

/** Backtracking: explore, record, undo — exhaustive search with pruning. */
export const backtrackingTopic: Topic = {
  slug: 'backtracking',
  title: 'Backtracking',
  category: 'algorithms',
  order: 15,
  summary: 'Choose, explore, unchoose: DFS over decisions with pruning. Subsets, permutations, and N-Queens share one skeleton.',
  level: 'intermediate',
  prerequisites: ['stack', 'recursion-tree'],
  sections: [
    {
      heading: 'The idea',
      body: 'Some problems must **try everything**: every subset, every ordering, every board layout. Backtracking walks the decision tree depth-first — **choose** an option, **explore** what follows, then **unchoose** (undo) and try the next option.\n\nThe undo is the technique: one shared `path` list plus add-then-remove turns exponential memory into O(n). The animation builds all 8 subsets of [1, 2, 3] this way.',
    },
    {
      heading: 'How it works',
      body: '`dfs(i)`: if `i == n`, record a copy of `path` and return. Otherwise include `a[i]` (add, recurse, remove), then exclude it (recurse).\n\n- **Time**: proportional to the decision tree — O(n · 2ⁿ) for subsets (n work per leaf copy).\n- **Space**: O(n) path + recursion depth, besides the output itself.\n- **Pruning** cuts branches early: N-Queens skips attacked squares, combination-sum stops past the target. Pruning is what separates backtracking from brute force.',
    },
    {
      heading: 'Java notes',
      body: 'Record `new ArrayList<>(path)` — storing the live reference records eight copies of the final (empty) path. Pass `start` indices to avoid duplicate permutations of the same set, and sort first when **skipping duplicates** (`if (i > start && a[i] == a[i-1]) continue`).\n\n`StringBuilder` with `setLength(len)` is the character-level undo for letter problems (phone combinations, palindromic partitions).',
    },
  ],
  complexity: [
    { operation: 'Subsets (n elements)', best: 'O(n · 2ⁿ)', average: 'O(n · 2ⁿ)', worst: 'O(n · 2ⁿ)', space: 'O(n)' },
    { operation: 'Permutations', best: 'O(n · n!)', average: 'O(n · n!)', worst: 'O(n · n!)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Subsets from scratch',
      description: 'Include/exclude with add-then-remove undo.',
      code: `import java.util.ArrayList;
import java.util.List;

public class Subsets {
    static List<List<Integer>> subsets(int[] a) {
        List<List<Integer>> out = new ArrayList<>();
        dfs(a, 0, new ArrayList<>(), out);
        return out;
    }

    static void dfs(int[] a, int i, List<Integer> path, List<List<Integer>> out) {
        if (i == a.length) {
            out.add(new ArrayList<>(path)); // copy! path keeps mutating
            return;
        }
        path.add(a[i]); // choose: include
        dfs(a, i + 1, path, out);
        path.remove(path.size() - 1); // unchoose: undo
        dfs(a, i + 1, path, out); // choose: exclude
    }

    public static void main(String[] args) {
        System.out.println(subsets(new int[]{1, 2, 3}).size()); // 8
    }
}
`,
    },
    {
      title: 'Permutations variant',
      description: 'Same skeleton with a used-set instead of an index.',
      code: `import java.util.ArrayList;
import java.util.List;

public class Permutations {
    static List<List<Integer>> permute(int[] a) {
        List<List<Integer>> out = new ArrayList<>();
        dfs(a, new boolean[a.length], new ArrayList<>(), out);
        return out;
    }

    static void dfs(int[] a, boolean[] used, List<Integer> path, List<List<Integer>> out) {
        if (path.size() == a.length) {
            out.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < a.length; i++) {
            if (used[i]) {
                continue; // prune: already placed
            }
            used[i] = true;
            path.add(a[i]);
            dfs(a, used, path, out);
            path.remove(path.size() - 1); // undo both choices
            used[i] = false;
        }
    }

    public static void main(String[] args) {
        System.out.println(permute(new int[]{1, 2, 3}).size()); // 6
    }
}
`,
    },
  ],
  mistakes: [
    'Storing the live path: record `new ArrayList<>(path)` or every entry mirrors the final empty list.',
    'Forgetting the remove: without undo, choices accumulate and later branches inherit garbage.',
    'Generating duplicates from duplicate input: sort first, then skip `a[i] == a[i-1]` past the start.',
    'Pruning after recursing: test constraints before the call, not inside it, or dead branches still cost.',
    'Exponential surprise: n = 25 subsets means 33M leaves — confirm constraints before brute force.',
  ],
  vizId: 'backtracking-steps',
  problemIds: ['subsets', 'permutations', 'combination-sum'],
};
