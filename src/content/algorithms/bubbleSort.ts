import type { Topic } from '../../types/content.ts';

/** Bubble sort: adjacent swaps that float large values home. */
export const bubbleSortTopic: Topic = {
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  category: 'algorithms',
  order: 3,
  summary: 'Repeatedly swap adjacent out-of-order pairs; the largest unsorted value bubbles to its slot each pass. O(n²), in place.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Walk the array comparing **neighbors**: whenever `a[j] > a[j + 1]`, swap them. After one full pass, the **largest** value has floated to the end — so the next pass can stop one slot earlier. Repeat until a pass makes zero swaps.\n\nThe name comes from the visual: big values "bubble up" to the surface like air in water.',
    },
    {
      heading: 'How it works',
      body: 'Outer pass `i` from 0 while swapped: inner `j` from 0 to `n - 2 - i`, swapping inverted neighbors. Track whether anything swapped — a clean pass means the array is sorted and you stop early (**adaptive** best case O(n)).\n\n- **Time**: O(n²) worst/average, O(n) best (already sorted + early exit).\n- **Space O(1)**, **stable** (equal elements never cross), in place.',
    },
    {
      heading: 'Java notes',
      body: 'Nobody ships bubble sort — `Arrays.sort` is O(n log n) — but the swap idiom and early-exit flag recur everywhere. For objects, swap references and compare with `Comparator.comparing(...)` or `compareTo`.\n\nThe inner bound `n - 1 - i` is the classic off-by-one: forget the `- i` and you re-scan the sorted tail; forget the `- 1` and `a[j + 1]` walks off the end.',
    },
  ],
  complexity: [
    { operation: 'Sort (random)', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    { operation: 'Sort (sorted input)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Bubble sort from scratch',
      description: 'Adjacent swaps with an early-exit flag.',
      code: `public class BubbleSort {
    static void sort(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int tmp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
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
      description: 'Arrays.sort: dual-pivot quicksort, O(n log n).',
      code: `import java.util.Arrays;

public class BubbleSortBuiltIn {
    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2};
        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores)); // [2, 3, 4, 5, 8]

        String[] words = {"pear", "fig", "apple"};
        Arrays.sort(words);
        System.out.println(Arrays.toString(words)); // [apple, fig, pear]
    }
}
`,
    },
  ],
  mistakes: [
    'Inner loop to `a.length - 1` every pass: re-scans the sorted tail and risks `a[j + 1]` overflow — bound it by `n - 1 - i`.',
    'Skipping the swapped flag: without early exit, sorted input still costs the full O(n²).',
    'Swapping with addition/subtraction tricks: overflows and obfuscates — use a temp variable.',
    'Using bubble sort on large inputs in production: O(n²) with a big constant loses to `Arrays.sort` by orders of magnitude.',
  ],
  vizId: 'bubble-sort-steps',
  problemIds: ['sort-colors', 'height-checker'],
};
