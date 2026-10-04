import type { Topic } from '../../types/content.ts';

/** Binary search: halving a sorted range until the target is cornered. */
export const binarySearchTopic: Topic = {
  slug: 'binary-search',
  title: 'Binary Search',
  category: 'algorithms',
  order: 2,
  summary: 'Halve a sorted range again and again: O(log n) lookup, plus lower/upper-bound superpowers.',
  level: 'beginner',
  prerequisites: ['array', 'linear-search'],
  sections: [
    {
      heading: 'The idea',
      body: 'On a **sorted** array, compare the target with the middle element: equal means done, smaller means the answer lives left, larger means right. Each step discards **half** the candidates, so 1,000,000 elements need at most 20 checks.\n\nThe maintained promise is the **invariant**: if the target exists, it lies within `[left, right]`. Every move must preserve it — that single sentence is the whole algorithm.',
    },
    {
      heading: 'How it works',
      body: 'Loop while `left <= right`: `mid = left + (right - left) / 2`. If `a[mid] == target` return `mid`; if smaller, `left = mid + 1`; else `right = mid - 1`. Exit the loop and return -1.\n\n- **Time O(log n)**, **space O(1)** iterative (recursion adds O(log n) stack).\n- `left + (right - left) / 2` avoids the `(left + right)` integer-overflow trap.\n- Variants: **lower bound** (first ≥ target) and **upper bound** (first > target) power insertion points and counting queries.',
    },
    {
      heading: 'Java notes',
      body: '`Arrays.binarySearch(a, key)` and `Collections.binarySearch(list, key)` are production-ready: they return the index, or `-(insertion point) - 1` when absent — decode negatives with `int pos = -result - 1`.\n\nBoth demand a **sorted** array (ascending, same ordering as the search). Searching unsorted data returns garbage, silently. For custom objects, pass a `Comparator` or implement `Comparable`.',
    },
  ],
  complexity: [
    { operation: 'Search (sorted)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Lower / upper bound', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Binary search from scratch',
      description: 'Overflow-safe midpoint with the [left, right] invariant.',
      code: `public class BinarySearch {
    static int search(int[] a, int target) {
        int left = 0;
        int right = a.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (a[mid] == target) {
                return mid;
            } else if (a[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] scores = {2, 4, 7, 9, 12, 15, 21};
        System.out.println(search(scores, 12)); // 4
        System.out.println(search(scores, 5)); // -1
    }
}
`,
    },
    {
      title: 'Built-in equivalents',
      description: 'Arrays.binarySearch and its insertion-point encoding.',
      code: `import java.util.Arrays;

public class BinarySearchBuiltIn {
    public static void main(String[] args) {
        int[] scores = {2, 4, 7, 9, 12, 15, 21};
        System.out.println(Arrays.binarySearch(scores, 12)); // 4

        int missing = Arrays.binarySearch(scores, 5);
        System.out.println(missing); // negative: not found
        int insertAt = -missing - 1;
        System.out.println(insertAt); // 2: where 5 would slot in
    }
}
`,
    },
  ],
  mistakes: [
    'Searching an unsorted array: binary search returns meaningless results without sorted input.',
    'Writing `(left + right) / 2`: overflows for large indices — use `left + (right - left) / 2`.',
    'Looping `while (left < right)` for exact search: the `<=` keeps the final single candidate alive.',
    'Misreading negative returns from `Arrays.binarySearch`: decode with `-result - 1` to get the insertion point.',
    'Moving bounds by `mid` instead of `mid ± 1`: the loop can stall forever on a two-element range.',
  ],
  vizId: 'binary-search-steps',
  problemIds: ['binary-search', 'search-insert-position', 'first-bad-version'],
};
