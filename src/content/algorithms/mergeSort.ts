import type { Topic } from '../../types/content.ts';

/** Merge sort: divide, conquer, and linear merge. */
export const mergeSortTopic: Topic = {
  slug: 'merge-sort',
  title: 'Merge Sort',
  category: 'algorithms',
  order: 6,
  summary: 'Split in half, sort each half, merge in linear time. Guaranteed O(n log n), stable — at the cost of O(n) space.',
  level: 'intermediate',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: '**Divide and conquer**: split the array into halves until pieces hold one element (trivially sorted), then **merge** sorted halves back together by repeatedly taking the smaller front element.\n\nThe merge is the whole trick — two sorted runs fuse in one linear pass, like zipping two sorted card piles. Recursion depth is log n and every level costs n work: O(n log n), always.',
    },
    {
      heading: 'How it works',
      body: '`sort(lo, hi)`: if the range holds one element, return; else `mid`, sort both halves, then merge `[lo, mid]` with `[mid + 1, hi]` using a temp buffer, copying back.\n\n- **Time O(n log n)** best/average/worst — no input defeats it.\n- **Space O(n)** for the merge buffer (the price of stability and guarantees).\n- **Stable**: the merge takes from the left run on ties, preserving equal order.',
    },
    {
      heading: 'Java notes',
      body: '`Arrays.sort(Object[])` runs TimSort — a production merge/insertion hybrid with the same guarantees. For primitives, `Arrays.sort(int[])` uses dual-pivot quicksort instead (faster, not stable).\n\n`Arrays.parallelSort` literally parallelizes the merge phase across cores. And `Collections.sort(list)` delegates to TimSort on an array copy — linked lists get dumped to arrays first, which is why random access matters.',
    },
  ],
  complexity: [
    { operation: 'Sort (any input)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'Merge two runs', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Merge sort from scratch',
      description: 'Recursive split with a reusable temp buffer.',
      code: `public class MergeSort {
    static void sort(int[] a) {
        int[] tmp = new int[a.length];
        sort(a, tmp, 0, a.length - 1);
    }

    static void sort(int[] a, int[] tmp, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int mid = lo + (hi - lo) / 2;
        sort(a, tmp, lo, mid);
        sort(a, tmp, mid + 1, hi);
        merge(a, tmp, lo, mid, hi);
    }

    static void merge(int[] a, int[] tmp, int lo, int mid, int hi) {
        System.arraycopy(a, lo, tmp, lo, hi - lo + 1);
        int i = lo;
        int j = mid + 1;
        for (int k = lo; k <= hi; k++) {
            if (j > hi || (i <= mid && tmp[i] <= tmp[j])) {
                a[k] = tmp[i++];
            } else {
                a[k] = tmp[j++];
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
      description: 'TimSort via Arrays.sort on objects; parallelSort for scale.',
      code: `import java.util.Arrays;

public class MergeSortBuiltIn {
    public static void main(String[] args) {
        Integer[] scores = {5, 3, 8, 4, 2};
        Arrays.sort(scores); // TimSort: stable O(n log n)
        System.out.println(Arrays.toString(scores)); // [2, 3, 4, 5, 8]

        int[] big = {5, 3, 8, 4, 2};
        Arrays.parallelSort(big); // merges across cores
        System.out.println(Arrays.toString(big));
    }
}
`,
    },
  ],
  mistakes: [
    'Allocating the temp buffer per merge: one reusable array for the whole sort, or GC churn dominates.',
    'Breaking ties from the right run: take left on `<=` or stability is lost.',
    'Copying the wrong range back: merge reads `[lo, hi]` — an off-by-one drops or duplicates an element.',
    'Recursing without the `lo >= hi` base case: infinite recursion on empty ranges.',
    'Using merge sort where quicksort fits: the O(n) buffer is real memory — measure before defaulting to guarantees.',
  ],
  pythonCode: [
    {
      title: 'Merge sort from scratch',
      description: 'Recursive split with a reusable temp buffer.',
      code: `def merge_sort(a):
    # O(n log n) best/average/worst; O(n) space; stable
    if len(a) <= 1:
        return a

    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        # <= takes from left on ties: preserves stability
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


# Demo
scores = [5, 3, 8, 4, 2]
print(merge_sort(scores))  # [2, 3, 4, 5, 8]
`,
    },
    {
      title: 'Python built-in equivalent',
      description: '`list.sort()` / `sorted()`: Timsort, stable O(n log n).',
      code: `scores = [5, 3, 8, 4, 2]
scores.sort()
print(scores)  # [2, 3, 4, 5, 8]

# sorted() returns a new list
original = [5, 3, 8, 4, 2]
copy = sorted(original)
print(copy)    # [2, 3, 4, 5, 8]
print(original)  # [5, 3, 8, 4, 2] (unchanged)
`,
    },
  ],
  vizId: 'merge-sort-steps',
  problemIds: ['sort-an-array', 'merge-intervals', 'merge-sorted-array'],
};
