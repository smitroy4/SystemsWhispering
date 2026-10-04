import type { Topic } from '../../types/content.ts';

/** Quick sort: partition around a pivot, recurse on the sides. */
export const quickSortTopic: Topic = {
  slug: 'quick-sort',
  title: 'Quick Sort',
  category: 'algorithms',
  order: 7,
  summary: 'Partition around a pivot so the pivot lands final, then recurse. O(n log n) average, O(n²) worst — the practical default.',
  level: 'intermediate',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Pick a **pivot**, then **partition**: shuffle smaller values left of it and larger ones right. The pivot sits in its **final** position, so recurse on the two sides and never touch it again.\n\nPartitioning is linear and in place. Good pivots split evenly (O(n log n)); bad ones peel off one element per level (O(n²)) — which is why pivot choice is the entire game.',
    },
    {
      heading: 'How it works (Lomuto)',
      body: 'With the last element as pivot: boundary `i` starts at `lo - 1`; scan `j` from `lo` to `hi - 1`, swapping each `a[j] ≤ pivot` into the small side (`++i`); finally swap the pivot into `i + 1`.\n\n- **Time**: O(n log n) average, O(n²) worst (sorted input + naive pivot).\n- **Space**: O(log n) stack average; in place besides recursion.\n- **Not stable** in place — equal elements cross during swaps.',
    },
    {
      heading: 'Java notes',
      body: '`Arrays.sort(int[])` runs **dual-pivot** quicksort — two pivots, three partitions, fewer swaps on real data. For objects it switches to TimSort for stability.\n\nProduction defenses you should know: **randomized** pivots (kills adversarial input), **median-of-three**, and falling back to insertion sort under ~47 elements. `Arrays.parallelSort` adds multi-core partitioning on top.',
    },
  ],
  complexity: [
    { operation: 'Sort (random input)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(log n)' },
    { operation: 'Sort (sorted + naive pivot)', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(n)' },
    { operation: 'Partition step', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Quick sort from scratch',
      description: 'Lomuto partition with a randomized pivot.',
      code: `import java.util.concurrent.ThreadLocalRandom;

public class QuickSort {
    static void sort(int[] a) {
        sort(a, 0, a.length - 1);
    }

    static void sort(int[] a, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int p = partition(a, lo, hi);
        sort(a, lo, p - 1);
        sort(a, p + 1, hi);
    }

    static int partition(int[] a, int lo, int hi) {
        int pick = lo + ThreadLocalRandom.current().nextInt(hi - lo + 1);
        swap(a, pick, hi); // random pivot dodges skewed input
        int pivot = a[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (a[j] <= pivot) {
                swap(a, ++i, j);
            }
        }
        swap(a, i + 1, hi);
        return i + 1;
    }

    static void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2, 7, 1};
        sort(scores);
        System.out.println(java.util.Arrays.toString(scores));
    }
}
`,
    },
    {
      title: 'Built-in equivalent',
      description: 'Dual-pivot quicksort plus quickselect-style nth element.',
      code: `import java.util.Arrays;

public class QuickSortBuiltIn {
    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2, 7, 1};
        Arrays.sort(scores); // dual-pivot quicksort, O(n log n)
        System.out.println(Arrays.toString(scores));

        // Kth smallest without full sort: partial selection
        int[] data = {5, 3, 8, 4, 2, 7, 1};
        Arrays.sort(data, 0, 3);
        System.out.println(Arrays.toString(data)); // first 3 sorted
    }
}
`,
    },
  ],
  mistakes: [
    'Fixing the pivot at an end on sorted input: classic O(n²) — randomize or use median-of-three.',
    'Recursing with `sort(lo, p)` instead of `sort(lo, p - 1)`: the pivot is final; re-sorting it loops forever.',
    'Forgetting `i` starts at `lo - 1`: the pre-increment `++i` assumes one step back.',
    'Expecting stability: in-place swaps cross equals — need stability, use merge sort.',
    'Ignoring stack depth on skewed partitions: worst case needs O(n) frames — random pivots keep it logarithmic.',
  ],
  vizId: 'quick-sort-steps',
  problemIds: ['sort-an-array', 'kth-largest-element-in-an-array', 'top-k-frequent-elements'],
};
