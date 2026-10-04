import type { Topic } from '../../types/content.ts';

/** Linear search: the baseline scan every other search is measured against. */
export const linearSearchTopic: Topic = {
  slug: 'linear-search',
  title: 'Linear Search',
  category: 'algorithms',
  order: 1,
  summary: 'Check each element in order until you find the target. O(n) time, O(1) space — the baseline everything else must beat.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: '**Linear search** walks an array from left to right, comparing each element with the `target`, and returns the first matching index — or -1 when nothing matches. It assumes nothing about order, so it works on **any** array, sorted or not.\n\nEvery fancier search justifies itself against this baseline: if your data is small or unsorted, the simple scan often wins in practice because of its tiny constant factors and perfect cache behavior.',
    },
    {
      heading: 'How it works',
      body: 'Set `i = 0`. While `i < n`: if `a[i] == target`, return `i`; otherwise `i++`. Fall off the end and return -1.\n\n- **Best case O(1)**: the target sits at index 0.\n- **Worst case O(n)**: the target is last or absent — every element is checked.\n- **Space O(1)**: one loop counter, no extra storage.',
    },
    {
      heading: 'Java notes',
      body: 'Hand-rolled loops use `==` for primitives but **must use `.equals()`** for objects (a `String` target compared with `==` is the classic bug). The built-ins already do this correctly: `List.contains`, `List.indexOf`, and `Arrays.asList(a).contains(x)` all run a linear scan with proper equality.\n\nFor streams, `Arrays.stream(a).anyMatch(x -> x == target)` reads well; on hot paths the plain loop is just as fast and easier to step through.',
    },
  ],
  complexity: [
    { operation: 'Search (target first)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Search (target absent)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Linear search from scratch',
      description: 'The baseline scan with early exit.',
      code: `public class LinearSearch {
    static int search(int[] a, int target) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == target) {
                return i;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] scores = {7, 2, 9, 4, 6};
        System.out.println(search(scores, 4)); // 3
        System.out.println(search(scores, 5)); // -1
    }
}
`,
    },
    {
      title: 'Built-in equivalents',
      description: 'List.contains, indexOf, and a stream one-liner.',
      code: `import java.util.Arrays;
import java.util.List;

public class LinearSearchBuiltIn {
    public static void main(String[] args) {
        List<Integer> scores = Arrays.asList(7, 2, 9, 4, 6);
        System.out.println(scores.contains(4)); // true
        System.out.println(scores.indexOf(4)); // 3
        System.out.println(scores.indexOf(5)); // -1

        int[] raw = {7, 2, 9, 4, 6};
        boolean present = Arrays.stream(raw).anyMatch(x -> x == 4);
        System.out.println(present); // true
    }
}
`,
    },
  ],
  mistakes: [
    'Using `==` on objects: compare `String` and wrapper targets with `.equals()`, not reference equality.',
    'Returning the value instead of the index: callers usually need the position — return `i`, not `a[i]`.',
    'Forgetting the not-found path: every caller must handle -1 before indexing with the result.',
    'Scanning a sorted array linearly out of habit: binary search turns O(n) into O(log n) for free.',
  ],
  vizId: 'linear-search-steps',
  problemIds: ['two-sum', 'contains-duplicate', 'missing-number'],
};
