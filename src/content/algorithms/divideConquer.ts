import type { Topic } from '../../types/content.ts';

/** Divide and conquer: split, solve, combine — the strategy behind the sorts. */
export const divideConquerTopic: Topic = {
  slug: 'divide-and-conquer',
  title: 'Divide & Conquer',
  category: 'algorithms',
  order: 16,
  summary: 'Split into independent halves, solve recursively, combine in linear time. Maximum subarray shows the full pattern.',
  level: 'intermediate',
  prerequisites: ['merge-sort', 'recursion-tree'],
  sections: [
    {
      heading: 'The idea',
      body: '**Divide** the input in half, **conquer** each half recursively, **combine** the partial answers. Merge sort is the poster child (combine = merge); maximum subarray is the deeper demo because its combine step is genuinely clever.\n\nThe strategy applies when subproblems are **independent** — no shared state, no overlap. Overlap means dynamic programming instead.',
    },
    {
      heading: 'How it works: maximum subarray',
      body: 'The best subarray of `[lo, hi]` either lies wholly left, wholly right, or **crosses mid**. The crossing case is linear: extend left from mid for the best left suffix, extend right for the best right prefix, add them.\n\n- Recurrence `T(n) = 2T(n/2) + O(n)` → **O(n log n)** (same shape as merge sort).\n- Kadane’s O(n) beats it here — divide and conquer earns its keep where no linear scan exists (closest pair, count of range sums).\n- The animation splits `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` and crosses at each level.',
    },
    {
      heading: 'Java notes',
      body: 'Combine steps love small records: `record Result(int sum, int left, int right)` carries both value and position. `Math.max` nesting gets unreadable past three — extract a `better(a, b)` helper with your tie-breaking rule.\n\nRecursion depth is log n for halving splits, so stack overflow is rarely the worry; the O(n log n) vs O(n) decision is.',
    },
  ],
  complexity: [
    { operation: 'Max subarray (D&C)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(log n)' },
    { operation: 'Max subarray (Kadane)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Max subarray from scratch',
      description: 'Divide, conquer, and linear crossing combine.',
      code: `public class MaxSubarray {
    static int maxSub(int[] a) {
        return solve(a, 0, a.length - 1).sum();
    }

    record Result(int sum, int left, int right) {}

    static Result solve(int[] a, int lo, int hi) {
        if (lo == hi) {
            return new Result(a[lo], lo, hi);
        }
        int mid = lo + (hi - lo) / 2;
        Result left = solve(a, lo, mid);
        Result right = solve(a, mid + 1, hi);
        Result cross = crossing(a, lo, mid, hi);
        Result best = left.sum() >= right.sum() ? left : right;
        return cross.sum() > best.sum() ? cross : best;
    }

    static Result crossing(int[] a, int lo, int mid, int hi) {
        int leftSum = Integer.MIN_VALUE;
        int sum = 0;
        int bestL = mid;
        for (int i = mid; i >= lo; i--) {
            sum += a[i];
            if (sum > leftSum) {
                leftSum = sum;
                bestL = i;
            }
        }
        int rightSum = Integer.MIN_VALUE;
        sum = 0;
        int bestR = mid + 1;
        for (int i = mid + 1; i <= hi; i++) {
            sum += a[i];
            if (sum > rightSum) {
                rightSum = sum;
                bestR = i;
            }
        }
        return new Result(leftSum + rightSum, bestL, bestR);
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSub(nums)); // 6
    }
}
`,
    },
    {
      title: 'Kadane built-in style',
      description: 'The O(n) rival every D&C solution should cite.',
      code: `public class Kadane {
    static int maxSub(int[] a) {
        int best = a[0];
        int running = a[0];
        for (int i = 1; i < a.length; i++) {
            running = Math.max(a[i], running + a[i]);
            best = Math.max(best, running);
        }
        return best;
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSub(nums)); // 6
    }
}
`,
    },
  ],
  mistakes: [
    'Skipping the crossing case: left/right-only misses subarrays spanning mid — the classic wrong answer.',
    'Integer.MIN_VALUE plus addition overflow: seed with MIN_VALUE but never add to it — accumulate separately.',
    'Off-by-one mid ownership: left half ends at mid, right starts at mid + 1 — double-counting mid corrupts sums.',
    'Assuming D&C is optimal here: Kadane’s O(n) wins — use D&C where no linear scan exists.',
    'Recomputing crossing from scratch per level naively: the linear two-sided walk IS the efficient version.',
  ],
  vizId: 'divide-and-conquer-steps',
  problemIds: ['maximum-subarray', 'sort-an-array', 'search-a-2d-matrix'],
};
