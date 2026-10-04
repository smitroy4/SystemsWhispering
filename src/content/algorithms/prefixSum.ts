import type { Topic } from '../../types/content.ts';

/** Prefix sums: pay O(n) once, answer every range sum in O(1). */
export const prefixSumTopic: Topic = {
  slug: 'prefix-sum',
  title: 'Prefix Sums',
  category: 'algorithms',
  order: 12,
  summary: 'Precompute running totals so sum(l, r) = P[r+1] − P[l]. O(n) setup, O(1) queries — plus difference arrays for range updates.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Define `P[0] = 0` and `P[i + 1] = P[i] + a[i]`: `P[i]` is the sum of the first `i` elements. Any range sum is then one subtraction: `sum(l, r) = P[r + 1] − P[l]`.\n\nThe animation builds `P` for `[1, 2, 3, 4]`, then answers `sum(1, 3) = P[4] − P[1] = 9`. One O(n) pass buys unlimited O(1) queries.',
    },
    {
      heading: 'How it works',
      body: 'Build left to right — each entry reuses the last. Queries never touch the original array again.\n\n- **Build O(n)**, **query O(1)**, **space O(n)** (or O(1) extra by overwriting the input).\n- The same shape counts things: prefix **counts**, prefix **XOR** (range xor via `P[r+1] ^ P[l]`), and 2D prefix sums for submatrix queries.\n- **Difference arrays** flip the tradeoff: range *updates* in O(1) each, one final prefix pass materializes the result.',
    },
    {
      heading: 'Java notes',
      body: 'Sums overflow `int` on large inputs — accumulate into `long` (or at least reason about constraints first). `Arrays.parallelPrefix(a, Integer::sum)` builds prefix sums with multiple cores for huge arrays.\n\nFor 2D grids, `P[i+1][j+1]` holds the rectangle above-left; each query combines four corners with inclusion–exclusion.',
    },
  ],
  complexity: [
    { operation: 'Build prefix array', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Range sum query', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Range update (diff array)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Prefix sums from scratch',
      description: 'Build once, query forever.',
      code: `public class PrefixSum {
    private final long[] pref;

    PrefixSum(int[] a) {
        pref = new long[a.length + 1];
        for (int i = 0; i < a.length; i++) {
            pref[i + 1] = pref[i] + a[i];
        }
    }

    long rangeSum(int left, int right) {
        return pref[right + 1] - pref[left];
    }

    public static void main(String[] args) {
        PrefixSum ps = new PrefixSum(new int[]{1, 2, 3, 4});
        System.out.println(ps.rangeSum(1, 3)); // 2 + 3 + 4 = 9
        System.out.println(ps.rangeSum(0, 3)); // 10
    }
}
`,
    },
    {
      title: 'Built-in and 2D equivalents',
      description: 'parallelPrefix plus the 2D inclusion–exclusion pattern.',
      code: `import java.util.Arrays;

public class PrefixSumBuiltIn {
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4};
        int[] pref = new int[a.length + 1];
        System.arraycopy(a, 0, pref, 1, a.length);
        Arrays.parallelPrefix(pref, Integer::sum);
        System.out.println(Arrays.toString(pref)); // [0, 1, 3, 6, 10]
        System.out.println(pref[4] - pref[1]); // sum(1, 3) = 9
    }
}
`,
    },
  ],
  mistakes: [
    'Sizing prefix as n instead of n + 1: the leading zero needs its slot — queries read `P[r + 1]`.',
    'Summing into `int` on big inputs: overflow wraps silently — accumulate in `long`.',
    'Rebuilding per query: the whole point is building once; per-query scans defeat it.',
    'Mixing inclusive/exclusive ends: `sum(l, r)` inclusive needs `P[r + 1] − P[l]` — test on single-element ranges.',
  ],
  vizId: 'prefix-sum-steps',
  problemIds: ['range-sum-query-immutable', 'subarray-sum-equals-k', 'find-pivot-index'],
};
