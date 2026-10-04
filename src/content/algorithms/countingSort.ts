import type { Topic } from '../../types/content.ts';

/** Counting sort: sort small integers by frequency, no comparisons. */
export const countingSortTopic: Topic = {
  slug: 'counting-sort',
  title: 'Counting Sort',
  category: 'algorithms',
  order: 9,
  summary: 'Count occurrences of each value, then write them back in order. O(n + k) for small integer ranges — faster than comparison sorts.',
  level: 'intermediate',
  prerequisites: ['array', 'hash-table'],
  sections: [
    {
      heading: 'The idea',
      body: 'When values come from a small range (ages, grades, bytes), skip comparing entirely: **count** how many of each value exist, then walk the counts writing each value back that many times.\n\nNo decision tree bounds this — comparison sorts need Ω(n log n), but counting sort is O(n + k) for range size k. The catch is written into the complexity: k must stay small.',
    },
    {
      heading: 'How it works',
      body: 'Find `max` (assume non-negative). Build `count[0..max]` zeroed; for each `x`, `count[x]++`. Then for `v` from 0 to `max`, append `v` exactly `count[v]` times.\n\n- **Time O(n + k)**, **space O(k)** for the count array.\n- **Stable variant**: prefix-sum the counts into positions and place from the right — the classic form used inside radix sort.\n- Negative values need an offset (`x - min`); huge ranges need a HashMap of frequencies instead (and lose the speed edge).',
    },
    {
      heading: 'Java notes',
      body: 'The frequency map *is* the general idea: `counts.merge(x, 1, Integer::sum)` builds the same table with a `HashMap` when the range is unknown — that is also how `valid-anagram` and `top-k-frequent` start.\n\nFor bytes and small ints, a plain `int[]` beats the map by 10×. `Arrays.fill(count, 0)` is redundant (Java zero-initializes), but stating it documents intent.',
    },
  ],
  complexity: [
    { operation: 'Sort (range k)', best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' },
    { operation: 'Sort (k ≈ n)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Counting sort from scratch',
      description: 'Frequency table plus ordered write-back.',
      code: `public class CountingSort {
    static void sort(int[] a) {
        if (a.length == 0) {
            return;
        }
        int max = a[0];
        for (int x : a) {
            max = Math.max(max, x);
        }
        int[] count = new int[max + 1];
        for (int x : a) {
            count[x]++;
        }
        int i = 0;
        for (int v = 0; v < count.length; v++) {
            while (count[v]-- > 0) {
                a[i++] = v;
            }
        }
    }

    public static void main(String[] args) {
        int[] ages = {4, 2, 2, 8, 3, 2, 4};
        sort(ages);
        System.out.println(java.util.Arrays.toString(ages));
    }
}
`,
    },
    {
      title: 'Built-in equivalent',
      description: 'Frequency maps with merge for unknown ranges.',
      code: `import java.util.HashMap;
import java.util.Map;

public class CountingSortBuiltIn {
    static Map<Integer, Integer> frequencies(int[] a) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int x : a) {
            counts.merge(x, 1, Integer::sum);
        }
        return counts;
    }

    public static void main(String[] args) {
        int[] ages = {4, 2, 2, 8, 3, 2, 4};
        System.out.println(frequencies(ages)); // {2=3, 3=1, 4=2, 8=1}
    }
}
`,
    },
  ],
  mistakes: [
    'Forgetting non-negativity: negative values index below zero — offset by min first.',
    'Sizing count by n instead of max: the table spans the value range k, not the element count.',
    'Using it on huge ranges: k = 10⁹ allocates gigabytes — fall back to comparison sorts or a HashMap.',
    'Breaking stability unknowingly: plain write-back reorders equals; use prefix-sum placement when order matters.',
    'Recomputing max inside the loop: one pass finds it; repeated `Arrays.stream(a).max()` per element is O(n²).',
  ],
  vizId: 'counting-sort-steps',
  problemIds: ['sort-colors', 'h-index', 'valid-anagram'],
};
