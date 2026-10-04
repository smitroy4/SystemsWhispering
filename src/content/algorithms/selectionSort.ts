import type { Topic } from '../../types/content.ts';

/** Selection sort: repeatedly select the minimum of the rest. */
export const selectionSortTopic: Topic = {
  slug: 'selection-sort',
  title: 'Selection Sort',
  category: 'algorithms',
  order: 4,
  summary: 'Find the minimum of the unsorted region and swap it into place. O(n²) always, but only O(n) swaps.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Split the array into a sorted prefix and an unsorted rest. Each pass **scans the rest for its minimum** and swaps it into the boundary position. After pass `i`, the first `i + 1` slots are final.\n\nUnlike bubble sort, the prefix is truly finished after each pass — but finding each minimum still scans everything, so there is no early exit.',
    },
    {
      heading: 'How it works',
      body: 'For `i` from 0 to `n - 2`: set `min = i`; for `j` from `i + 1` to `n - 1`, move `min` whenever `a[j] < a[min]`; swap `a[i]` with `a[min]` (skip when equal).\n\n- **Time O(n²)** in all cases — best, average, worst. The scans happen regardless.\n- **Space O(1)**, in place, but **not stable**: a swap can leapfrog equal elements.\n- **Swaps O(n)**: at most one per pass — its one virtue, handy when writes are expensive (flash memory, EEPROM).',
    },
    {
      heading: 'Java notes',
      body: 'Compare objects with `compareTo` (or a `Comparator`), never `<`. The `if (min != i)` guard skips pointless self-swaps and preserves a little stability in practice.\n\nFor partial ordering, `Arrays.sort(a, from, to)` and streams (`sorted().limit(k)`) cover the use cases where selection sort’s minimal-write property would matter.',
    },
  ],
  complexity: [
    { operation: 'Sort (any input)', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { operation: 'Number of swaps', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Selection sort from scratch',
      description: 'Minimum-select with a self-swap guard.',
      code: `public class SelectionSort {
    static void sort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) {
                    min = j;
                }
            }
            if (min != i) {
                int tmp = a[i];
                a[i] = a[min];
                a[min] = tmp;
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2};
        sort(scores);
        System.out.println(java.util.Arrays.toString(scores));
    }
}
`,
    },
    {
      title: 'Built-in equivalent',
      description: 'Partial-range sort for the cases selection suits.',
      code: `import java.util.Arrays;

public class SelectionSortBuiltIn {
    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2};
        Arrays.sort(scores, 0, 3); // sort just the prefix
        System.out.println(Arrays.toString(scores)); // [3, 5, 8, 4, 2]

        Arrays.sort(scores); // or the whole thing, O(n log n)
        System.out.println(Arrays.toString(scores)); // [2, 3, 4, 5, 8]
    }
}
`,
    },
  ],
  mistakes: [
    'Swapping unconditionally: guard with `if (min != i)` to skip self-swaps.',
    'Starting the inner scan at 0: the point is scanning only the unsorted rest from `i + 1`.',
    'Assuming stability: equal elements can be leapfrogged — never use it where order of equals matters.',
    'Expecting early exit: selection sort always scans fully; sorted input costs the same O(n²).',
  ],
  vizId: 'selection-sort-steps',
  problemIds: ['sort-an-array', 'height-checker'],
};
