import type { Topic } from '../../types/content.ts';

/** A problem-solving framework: UNDERSTAND → EXAMPLES → BRUTE FORCE → OPTIMIZE → CODE → TEST. */
export const frameworkTopic: Topic = {
  slug: 'problem-solving-framework',
  title: 'Problem-Solving Framework',
  category: 'concepts',
  order: 12,
  summary: 'A repeatable interview loop: understand, examples, brute force, optimize (BUD), code, test. Never stare — always execute a step.',
  level: 'beginner',
  prerequisites: [],
  sections: [
    {
      heading: 'UNDERSTAND: interrogate first',
      body: 'Restate the problem in your own words and pin down everything vague: input ranges, types, sorted or not, duplicates allowed, what exactly to return. Ask about **constraints** (`n ≤ 10⁵` rules out O(n²)) and **edge cases** (empty, single, all-same) before touching code.\n\nThirty seconds of questions prevents thirty minutes of solving the wrong problem. Interviewers score this phase — silence here reads as guessing.',
    },
    {
      heading: 'EXAMPLES then BRUTE FORCE',
      body: 'Walk a small example by hand, then a nasty one (duplicates, boundaries). A hand-trace often reveals the pattern — and becomes your first test case.\n\nThen state the **naive solution out loud** and its complexity ("check every pair: O(n²) time, O(1) space"). Brute force is not failure: it is the baseline your optimization must beat, and sometimes constraints accept it outright.',
    },
    {
      heading: 'OPTIMIZE with BUD, then CODE and TEST',
      body: 'Attack the bottleneck with **BUD**: look for **B**ottlenecks (the repeated work), **U**nnecessary work (results computed twice — memoize), and **D**uplicated work (same subproblem via different paths — hash it).\n\nCommon upgrades: sort first (O(n log n) unlocks two pointers/binary search), trade space for time (hash maps, prefix tables), shrink the search (prune, greedy choice with proof).\n\nCODE cleanly — helpers with names, no cleverness — then TEST: your hand-trace, plus empty/single/duplicate/adversarial cases. Dry-run one full pass before declaring done.',
    },
  ],
  complexity: [
    { operation: 'Brute force baseline', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { operation: 'After BUD optimization', best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Brute force, stated honestly',
      description: 'The baseline: every pair, O(n²).',
      code: `public class Baseline {
    static int[] twoSumBrute(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            for (int j = i + 1; j < a.length; j++) {
                if (a[i] + a[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(
            twoSumBrute(new int[]{2, 7, 11, 15}, 9))); // [0, 1]
    }
}
`,
    },
    {
      title: 'Optimized after BUD',
      description: 'Trade space for time: one pass with a map.',
      code: `import java.util.HashMap;
import java.util.Map;

public class Optimized {
    static int[] twoSumFast(int[] a, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // value -> index
        for (int i = 0; i < a.length; i++) {
            int need = target - a[i];
            if (seen.containsKey(need)) {
                return new int[]{seen.get(need), i};
            }
            seen.put(a[i], i);
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(
            twoSumFast(new int[]{2, 7, 11, 15}, 9))); // [0, 1]
    }
}
`,
    },
  ],
  mistakes: [
    'Coding before understanding: solving the wrong problem fast still scores zero.',
    'Skipping the brute force: without a baseline you cannot argue your optimization wins.',
    'Optimizing silently: narrate the bottleneck and the tradeoff — interviews grade thinking, not just code.',
    'No test pass: hand-trace your example plus empty/single/duplicate cases before finishing.',
    'Memorizing solutions: frameworks transfer, scripts do not — practice the loop, not the answers.',
  ],
  problemIds: ['two-sum', 'valid-palindrome'],
};
