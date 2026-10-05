import type { Topic } from '../../types/content.ts';

/** Arrays Utility Class: the static toolbox for raw arrays. */
export const arraysUtilityTopic: Topic = {
  slug: 'arrays-utility',
  title: 'Arrays Utility Class',
  category: 'data-structures',
  order: 51,
  summary: 'java.util.Arrays: sort, binarySearch, copyOf, fill, equals and the toString that saves your debugging.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['array'],
  choiceBox: {
    choose: [
      'Sorting primitives fast: dual-pivot quicksort tuned for `int[]`/`long[]`.',
      'Copying, filling, comparing, and printing arrays — never hand-roll these loops.',
      'Bridging arrays and lists: `asList` for fixed views, `stream`/`setAll` for generation.',
    ],
    avoid: [
      'Object sorting when stability matters across equal keys — `Arrays.sort(Object[])` is stable (TimSort); primitives sort is not.',
      'asList for growable lists — fixed-size view; wrap with `new ArrayList<>(...)` to append.',
      'equals on nested arrays — `equals` is shallow; `deepEquals` compares grids.',
    ],
  },
  sections: [
    {
      heading: 'Sort, search, and their contracts',
      body: '`Arrays.sort(int[])` runs dual-pivot quicksort (`O(n log n)` average, blazing constants); `Arrays.sort(Object[])` runs stable TimSort. `parallelSort` splits large arrays across the ForkJoin pool — worth it past ~10k elements, overhead below.\n\n- `binarySearch` demands the same sorted order (and returns `-(insertion point) − 1` when absent — decode it, don’t just check negativity).\n- `mismatch` finds the first differing index of two arrays — diffing without loops.',
    },
    {
      heading: 'Copy, fill, and compare',
      body: '`copyOf` resizes (pads with defaults) and `copyOfRange` slices — both allocate fresh arrays. `fill` (and `setAll` with a generator) initialises without loops. `equals` compares content element-wise; `deepEquals`/`deepToString` recurse into nested arrays.\n\n- `copyOf` never resizes in place: it *returns* the new array — assign the result.\n- `hashCode`/`toString` have content-based overloads too: `Arrays.toString` for 1D, `deepToString` for grids.',
    },
    {
      heading: 'Bridges: asList, stream, setAll',
      body: '`Arrays.asList(...)` views an array as a fixed-size `List` — `set` writes through to the array, `add` throws. `List.of` differs: fully immutable, no write-through. `Arrays.stream` feeds pipelines; `Arrays.setAll(a, i -> ...)` fills by index function (squares, randoms, sequences).\n\n- Prefer `asList` for passing arrays to list-shaped APIs; prefer streams when transforming.\n- `sort` on the `asList` view sorts the underlying array — views share storage, always.',
    },
  ],
  complexity: [
    { operation: 'sort primitives (dual-pivot)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    { operation: 'sort objects (TimSort, stable)', best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'binarySearch / equals / fill / copyOf', best: 'O(log n) / O(n)', average: 'O(log n) / O(n)', worst: 'O(log n) / O(n)', space: 'O(1) / O(n)' },
  ],
  javaCode: [
    {
      title: 'Sort, search, and slice idioms',
      description: 'The daily-invoked half of the toolbox.',
      code: `import java.util.Arrays;

public class ArraysIdioms {
    public static void main(String[] args) {
        int[] scores = {88, 42, 95, 42, 71};
        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores)); // [42, 42, 71, 88, 95]

        int at = Arrays.binarySearch(scores, 71);
        System.out.println("71 at " + at); // 2

        int[] top3 = Arrays.copyOfRange(scores, 2, 5);
        System.out.println(Arrays.toString(top3)); // [71, 88, 95]

        int[] padded = Arrays.copyOf(scores, 8); // pads with 0s
        Arrays.fill(padded, 5, 8, -1);
        System.out.println(Arrays.toString(padded));
    }
}
`,
    },
    {
      title: 'asList views and setAll generation',
      description: 'Fixed-size bridges plus index-function fills.',
      code: `import java.util.Arrays;
import java.util.List;

public class ArrayBridges {
    public static void main(String[] args) {
        String[] words = {"ash", "birch", "cedar"};
        List<String> view = Arrays.asList(words);
        view.set(0, "alder"); // writes THROUGH to the array
        System.out.println(Arrays.toString(words)); // [alder, birch, cedar]

        int[] squares = new int[5];
        Arrays.setAll(squares, i -> i * i);
        System.out.println(Arrays.toString(squares)); // [0, 1, 4, 9, 16]

        int[][] grid = {{1, 2}, {3, 4}};
        System.out.println(Arrays.deepToString(grid)); // [[1, 2], [3, 4]]
    }
}
`,
    },
  ],
  mistakes: [
    'Calling binarySearch on unsorted arrays: undefined results — sort first, same order, every time.',
    'Ignoring copyOf’s return: it allocates — the original never changes size; assign the result.',
    'Adding to asList: fixed-size view — add/remove throw; wrap with new ArrayList<>(...) to grow.',
    'equals on 2D arrays: shallow — nested arrays need deepEquals, or grids compare by reference.',
    'Assuming primitive sort stability: dual-pivot quicksort is NOT stable — stability needs object TimSort.',
    'Misreading negative binarySearch: -(insertion point) − 1 encodes position — decode with -at - 1 before inserting.',
  ],
  vizId: 'arrays-fill-copy',
  problemIds: ['squares-of-a-sorted-array', 'merge-sorted-array', 'height-checker'],
  javaBuiltIn: ['java.util.Arrays'],
  related: ['array', 'collections-utility', 'matrix-2d-arrays'],
};
