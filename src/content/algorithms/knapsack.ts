import type { Topic } from '../../types/content.ts';

/** 0/1 Knapsack: take-or-skip over items × capacity. */
export const knapsackTopic: Topic = {
  slug: 'knapsack',
  title: '0/1 Knapsack',
  category: 'algorithms',
  order: 28,
  summary: 'Each item taken at most once: dp[i][w] = max(skip, take + best remainder). O(n·W) pseudo-polynomial time.',
  level: 'intermediate',
  prerequisites: ['dynamic-programming-2d'],
  sections: [
    {
      heading: 'The idea',
      body: 'Capacity W, items with weights and values, each taken **at most once**. `dp[i][w]` = best value using the first `i` items within capacity `w`: **skip** item i (`dp[i-1][w]`) or **take** it (`value[i] + dp[i-1][w-weight[i]]`, when it fits).\n\nThe animation packs weights [1, 3, 4, 5] / values [1, 4, 5, 7] into W = 7: answer 9 (items of weight 3 + 4).',
    },
    {
      heading: 'How it works',
      body: 'Row 0 is all zeros (no items, no value). Each row copies the skip option, then improves capacities where the item fits. **Iterate capacities forward per row but read the previous row** — same-row reads would reuse the item (that bug *is* the unbounded variant).\n\n- **Time O(n·W)**, **space O(n·W)** — compressible to O(W) by walking capacities **backward**.\n- "Pseudo-polynomial": fast when W is small, exponential in W’s bit-length — the formal hardness stays intact.',
    },
    {
      heading: 'Java notes',
      body: 'Tables are `int[n+1][W+1]`; zero-initialization *is* the base row. Traceback walks from `dp[n][W]`: moving up means skipped, diagonal means taken.\n\nVariants share the skeleton: subset-sum (values = weights, target check), partition-equal-subset (half-sum target), coin-change-II (unbounded: forward capacities, combinations via outer-coin order).',
    },
  ],
  complexity: [
    { operation: 'Fill n×W table', best: 'O(n·W)', average: 'O(n·W)', worst: 'O(n·W)', space: 'O(n·W)' },
    { operation: 'Space-optimized row', best: 'O(n·W)', average: 'O(n·W)', worst: 'O(n·W)', space: 'O(W)' },
  ],
  javaCode: [
    {
      title: '0/1 Knapsack from scratch',
      description: 'Full table with take-or-skip transition.',
      code: `public class Knapsack {
    static int best(int[] weight, int[] value, int capacity) {
        int n = weight.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w]; // skip item i
                if (weight[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i][w], value[i - 1] + dp[i - 1][w - weight[i - 1]]);
                }
            }
        }
        return dp[n][capacity];
    }

    public static void main(String[] args) {
        int[] weight = {1, 3, 4, 5};
        int[] value = {1, 4, 5, 7};
        System.out.println(best(weight, value, 7)); // 9 (items 3 + 4)
    }
}
`,
    },
    {
      title: 'Space-optimized variant',
      description: 'One row walked backward so items stay single-use.',
      code: `public class KnapsackCompact {
    static int best(int[] weight, int[] value, int capacity) {
        int[] dp = new int[capacity + 1];
        for (int i = 0; i < weight.length; i++) {
            for (int w = capacity; w >= weight[i]; w--) {
                dp[w] = Math.max(dp[w], value[i] + dp[w - weight[i]]);
            }
        }
        return dp[capacity];
    }

    public static void main(String[] args) {
        int[] weight = {1, 3, 4, 5};
        int[] value = {1, 4, 5, 7};
        System.out.println(best(weight, value, 7)); // 9
    }
}
`,
    },
  ],
  mistakes: [
    'Walking capacities forward in 1D: reuses the item (unbounded) — go backward for 0/1.',
    'Reading the same row for "skip": dp[i][w] must come from row i−1, or takes leak across.',
    'Off-by-one item indexing: item i lives at weight[i−1] — align carefully or shift arrays.',
    'Forgetting the fit check: `w - weight` below zero indexes garbage — guard with `weight <= w`.',
    'Assuming polynomial: O(n·W) explodes when W is huge — that is pseudo-polynomial, still NP-hard.',
  ],
  vizId: 'knapsack-steps',
  problemIds: ['partition-equal-subset-sum', 'coin-change', 'coin-change-ii', 'target-sum'],
};
