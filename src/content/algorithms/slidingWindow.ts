import type { Topic } from '../../types/content.ts';

/** Sliding window: a resizable frame that glides over arrays and strings. */
export const slidingWindowTopic: Topic = {
  slug: 'sliding-window',
  title: 'Sliding Window',
  category: 'algorithms',
  order: 11,
  summary: 'Maintain a window [left, right] and slide it: O(n) subarray and substring answers with zero re-scanning.',
  level: 'intermediate',
  prerequisites: ['array', 'two-pointers'],
  sections: [
    {
      heading: 'The idea',
      body: 'Many problems ask about **contiguous** chunks: max sum of k elements, longest substring with constraints. Recomputing each chunk from scratch costs O(n·k) — instead keep a **running aggregate** and update it at the edges: add `a[right]` as the window grows, subtract `a[left]` as it slides.\n\nEach index enters and leaves once: O(n) total, O(1) space for sums and counts.',
    },
    {
      heading: 'Fixed vs flexible windows',
      body: '**Fixed size k** (max sum of 3): expand `right` until the window holds k, record, then move both ends together — the animation traces exactly this.\n\n**Flexible size** (longest substring without repeats): expand `right` always; while the window is **invalid**, advance `left` until valid again; track the best valid window. The invariant — "window [left, right] is always valid when measured" — is the whole proof.',
    },
    {
      heading: 'Java notes',
      body: 'Sums fit in a `long` when inputs are large (constraint-check first). Character windows use `int[26]` or `int[128]` frequency tables with a `formed`/`violations` counter instead of re-scanning.\n\n`Deque<Integer>` holds candidate indices for max/min windows (monotonic queue); `LinkedHashMap` with access order approximates LRU-style windows. Both keep the O(n) promise with O(k) memory.',
    },
  ],
  complexity: [
    { operation: 'Fixed window scan', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Flexible window scan', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'With frequency table', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(k)' },
  ],
  javaCode: [
    {
      title: 'Max sum window from scratch',
      description: 'Fixed-size window with a running sum.',
      code: `public class MaxSumWindow {
    static int maxSum(int[] a, int k) {
        int window = 0;
        for (int i = 0; i < k; i++) {
            window += a[i];
        }
        int best = window;
        for (int right = k; right < a.length; right++) {
            window += a[right] - a[right - k];
            best = Math.max(best, window);
        }
        return best;
    }

    public static void main(String[] args) {
        int[] nums = {2, 1, 5, 1, 3, 2};
        System.out.println(maxSum(nums, 3)); // 9
    }
}
`,
    },
    {
      title: 'Flexible window template',
      description: 'Expand right, shrink left while invalid.',
      code: `import java.util.HashSet;
import java.util.Set;

public class LongestUnique {
    static int lengthOfLongestSubstring(String s) {
        Set<Character> seen = new HashSet<>();
        int left = 0;
        int best = 0;
        for (int right = 0; right < s.length(); right++) {
            while (seen.contains(s.charAt(right))) {
                seen.remove(s.charAt(left));
                left++;
            }
            seen.add(s.charAt(right));
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
    }
}
`,
    },
  ],
  mistakes: [
    'Recomputing the window aggregate from scratch each slide: that is O(n·k) — update at the edges instead.',
    'Shrinking with `if` instead of `while`: one step may not restore validity — loop until valid.',
    'Measuring the window before shrinking: record the best only when the invariant holds.',
    'Off-by-one window length: size is `right - left + 1` with inclusive ends — verify on k = 1.',
    'Using substring/collections copies per step: O(k) hidden work per slide breaks the O(n) promise.',
  ],
  vizId: 'sliding-window-steps',
  problemIds: ['best-time-to-buy-and-sell-stock', 'longest-substring-without-repeating-characters', 'minimum-window-substring'],
};
