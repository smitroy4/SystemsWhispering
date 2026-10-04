import type { Topic } from '../../types/content.ts';

/** Heap sort: heapify, then repeatedly extract the max. */
export const heapSortTopic: Topic = {
  slug: 'heap-sort',
  title: 'Heap Sort',
  category: 'algorithms',
  order: 8,
  summary: 'Build a max-heap in O(n), then extract the max into place n times. Guaranteed O(n log n), in place, not stable.',
  level: 'intermediate',
  prerequisites: ['heap', 'array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Turn the array into a **max-heap** in place, then repeat: swap the root (the current maximum) with the last unsorted slot and shrink the heap by one. Each extraction locks one more element into its final position from the right.\n\nTwo phases, both O(n log n) total: heapify costs O(n) (bottom-up, not n inserts), extraction costs n rounds of O(log n) sink-downs.',
    },
    {
      heading: 'How it works',
      body: 'Heapify: sink every parent from `n / 2 - 1` down to 0 — leaves already satisfy the heap property. Extract: for `end` from `n - 1` down to 1, swap `a[0]` with `a[end]`, then sink the new root within `[0, end)`.\n\n- **Time O(n log n)** best/average/worst — no input defeats it.\n- **Space O(1)**, in place — its edge over merge sort.\n- **Not stable**: long-distance swaps cross equal elements.',
    },
    {
      heading: 'Java notes',
      body: 'You will call `Arrays.sort` instead — but heap sort’s ideas recur: `PriorityQueue` *is* the extraction phase as a data structure, and bottom-up heapify is the fastest way to initialize one from bulk data.\n\nFor object arrays where stability matters, TimSort wins; where memory is tight and guarantees matter, heap sort is the honest answer. `Arrays.parallelSort` on primitives uses parallel merge, not heaps — different tradeoff, same O(n log n).',
    },
  ],
  complexity: [
    { operation: 'Heapify (bottom-up)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Sort (any input)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Heap sort from scratch',
      description: 'Bottom-up heapify plus extract-and-sink.',
      code: `public class HeapSort {
    static void sort(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) {
            sink(a, i, a.length);
        }
        for (int end = a.length - 1; end > 0; end--) {
            swap(a, 0, end);
            sink(a, 0, end);
        }
    }

    static void sink(int[] a, int i, int size) {
        while (true) {
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            int largest = i;
            if (left < size && a[left] > a[largest]) {
                largest = left;
            }
            if (right < size && a[right] > a[largest]) {
                largest = right;
            }
            if (largest == i) {
                break;
            }
            swap(a, i, largest);
            i = largest;
        }
    }

    static void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
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
      description: 'PriorityQueue extraction mirrors the sort phase.',
      code: `import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Queue;

public class HeapSortBuiltIn {
    public static void main(String[] args) {
        int[] scores = {5, 3, 8, 4, 2};
        Arrays.sort(scores); // dual-pivot quicksort, not a heap
        System.out.println(Arrays.toString(scores));

        // The extraction phase as a data structure:
        Queue<Integer> heap = new PriorityQueue<>(Arrays.asList(5, 3, 8, 4, 2));
        while (!heap.isEmpty()) {
            System.out.print(heap.poll() + " "); // 2 3 4 5 8
        }
    }
}
`,
    },
  ],
  mistakes: [
    'Heapifying top-down with n inserts: O(n log n) setup instead of the O(n) bottom-up pass.',
    'Sinking within the full array during extraction: bound the sink by `end` or sorted slots get disturbed.',
    'Starting heapify at `n - 1`: leaves need no sinking — start at the last parent, `n / 2 - 1`.',
    'Swapping with the smaller child on sink: max-heaps always promote the larger child.',
    'Expecting stability: distant swaps reorder equals — use merge sort when order of equals matters.',
  ],
  vizId: 'heap-sort-steps',
  problemIds: ['sort-an-array', 'kth-largest-element-in-an-array'],
};
