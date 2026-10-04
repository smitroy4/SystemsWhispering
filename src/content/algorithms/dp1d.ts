import type { Topic } from '../../types/content.ts';

/** 1D dynamic programming: remember answers, never recompute. */
export const dp1dTopic: Topic = {
  slug: 'dynamic-programming-1d',
  title: '1D Dynamic Programming',
  category: 'algorithms',
  order: 26,
  summary: 'Overlapping subproblems on a line: define dp[i], fill in order, read the answer. Climbing stairs to house robber.',
  level: 'beginner',
  prerequisites: ['recursion-tree', 'array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Recursion re-solves the same subproblems; **memoization** caches them. **1D DP** goes further: the answer for position `i` depends only on earlier positions, so fill a table left to right and never recurse at all.\n\nClimbing stairs (1 or 2 steps): `dp[i] = dp[i-1] + dp[i-2]` — Fibonacci wearing a story. The animation fills `dp[0..5]` live.',
    },
    {
      heading: 'How it works',
      body: 'Name the state (`dp[i]` = ways to reach step i), write the recurrence, seed the bases, iterate in dependency order, return the target cell.\n\n- **Time O(n · work-per-cell)**, **space O(n)** — often compressible to O(1) when only the last cells matter (two rolling variables for stairs/robber).\n- Order is everything: fill dependencies before dependents, or read garbage.',
    },
    {
      heading: 'Java notes',
      body: 'Tables are `int[]`/`long[]` sized n+1 (answers overflow `int` fast — Fibonacci hits 2³¹ at n = 47). Memoized recursion uses a `HashMap` or sentinel-filled array (`-1` = unknown).\n\n`Math.max`/`Math.min` transitions read cleanly; for "ways" problems the transition is usually addition modulo 1e9+7.',
    },
  ],
  complexity: [
    { operation: 'Fill 1D table', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Space-optimized', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Climbing stairs from scratch',
      description: 'Bottom-up table with O(1) space form.',
      code: `public class ClimbingStairs {
    static int climb(int n) {
        if (n <= 2) {
            return n;
        }
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    static int climbCompact(int n) {
        if (n <= 2) {
            return n;
        }
        int prev2 = 1;
        int prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int cur = prev1 + prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(climb(5)); // 8
        System.out.println(climbCompact(5)); // 8
    }
}
`,
    },
    {
      title: 'House robber variant',
      description: 'Same skeleton, max-transition instead of sum.',
      code: `public class HouseRobber {
    static int rob(int[] nums) {
        int prev2 = 0;
        int prev1 = 0;
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(rob(new int[]{2, 7, 9, 3, 1})); // 12
    }
}
`,
    },
  ],
  mistakes: [
    'Wrong iteration direction: filling before dependencies reads garbage — order follows the recurrence arrows.',
    'Forgetting base cases: dp[0]/dp[1] seeds everything — an off-by-one seed corrupts the whole table.',
    'int overflow on counting DPs: ways grow exponentially — use long or modulo early.',
    'Memoizing without a sentinel: re-solving "unknown vs computed zero" needs -1/boolean guards, not null hopes.',
    'Compressing space too early: keep the full table until the recurrence is proven, then roll variables.',
  ],
  vizId: 'dp-1d-steps',
  problemIds: ['climbing-stairs', 'house-robber', 'coin-change', 'fibonacci-number'],
};
