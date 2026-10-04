import type { Topic } from '../../types/content.ts';

/** Insertion sort: grow a sorted hand one card at a time. */
export const insertionSortTopic: Topic = {
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  category: 'algorithms',
  order: 5,
  summary: 'Take each element and insert it into the sorted prefix. O(n²) worst case, O(n) nearly sorted — the small-array champion.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Sort cards in your hand: take the next card and slide it left until it sits among larger-or-equal neighbors. The prefix `[0, i)` stays **sorted** while the rest waits its turn.\n\nInsertion sort is **adaptive**: nearly sorted input needs almost no shifts (O(n)), and each new element costs only its own displacement.',
    },
    {
      heading: 'How it works',
      body: 'For `i` from 1: hold `key = a[i]`; shift every `a[j] > key` one slot right (`j` from `i - 1` downward); write `key` into the gap.\n\n- **Time**: O(n) best (sorted), O(n²) average/worst.\n- **Space O(1)**, in place, **stable** (strict `>` never moves equals).\n- Real systems use it for tiny partitions: TimSort and dual-pivot quicksort switch to insertion below ~32–47 elements.',
    },
    {
      heading: 'Java notes',
      body: 'Shifting beats swapping here: one temp for the key plus plain assignments, no three-way swap per step. For objects, compare with `compareTo` and keep the strict `> 0` test to preserve stability.\n\n`Arrays.sort` on small ranges delegates to exactly this algorithm — writing it yourself is mostly an exercise in understanding why the library is fast.',
    },
  ],
  complexity: [
    { operation: 'Sort (sorted input)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Sort (random/reversed)', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Insertion sort from scratch',
      description: 'Key-hold with rightward shifts.',
      code: `public class InsertionSort {
    static void sort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
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
      description: 'Arrays.sort delegates to insertion sort on tiny ranges.',
      code: `import java.util.Arrays;

public class InsertionSortBuiltIn {
    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2};
        Arrays.sort(scores, 1, 4); // insertion-style range on small spans
        System.out.println(Arrays.toString(scores)); // [5, 3, 4, 8, 2]

        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores)); // [2, 3, 4, 5, 8]
    }
}
`,
    },
  ],
  mistakes: [
    'Writing `key` back to `a[j]` instead of `a[j + 1]`: the loop exits one slot left of the gap.',
    'Using `>=` in the shift test: breaks stability by moving equal elements past each other.',
    'Losing the key: overwriting `a[i]` before saving it destroys the value being inserted.',
    'Starting the outer loop at 0: a one-element prefix is trivially sorted — start at 1.',
  ],
  vizId: 'insertion-sort-steps',
  problemIds: ['sort-an-array', 'squares-of-a-sorted-array', 'merge-sorted-array'],
};
