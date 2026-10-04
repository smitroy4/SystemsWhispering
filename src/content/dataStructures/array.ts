import type { Topic } from '../../types/content.ts';

/** Arrays: contiguous storage, index arithmetic, and the shifting tax. */
export const arrayTopic: Topic = {
  slug: 'array',
  title: 'Arrays',
  category: 'data-structures',
  order: 1,
  summary: 'Contiguous blocks of memory that store elements side by side — the foundation of almost every other data structure.',
  level: 'beginner',
  prerequisites: [],
  sections: [
    {
      heading: 'What is an array?',
      body: 'An **array** is a fixed-size container that stores elements of the same type in **contiguous memory**. Each element sits at an `index` starting from `0`, so reaching any element is just arithmetic: address of element `i` = base address + `i` × element size.\n\nBecause the layout is so simple, arrays are the yardstick every other structure is measured against.',
    },
    {
      heading: 'How arrays live in memory',
      body: 'When you write `new int[4]`, the JVM reserves one unbroken block for 4 integers (16 bytes) and gives you a **reference** to its start — the variable holds an address, not the data itself.\n\n- Contiguity is why access is `O(1)`: no traversal, just one multiplication and one addition.\n- Neighbouring elements share **cache lines**, so scanning an array is among the fastest things a CPU can do.\n- The price: the block cannot grow. Inserting in the middle means **shifting** every element after it one slot to the right.',
    },
    {
      heading: 'Insert and delete: the shifting tax',
      body: 'A plain array has no `insert` method — you implement it by hand. To insert at index `i`, copy elements `n-1` down to `i` one slot right, then write the new value. Deleting is the mirror image: copy everything left and ignore the duplicate tail.\n\nBoth cost `O(n)` in the worst case, which is exactly the problem `ArrayList` was invented to hide (see Dynamic Arrays).',
    },
    {
      heading: 'The built-in toolbox: java.util.Arrays',
      body: 'You rarely need hand-rolled loops. `java.util.Arrays` ships the classics:\n\n- `Arrays.toString(a)` and `Arrays.equals(a, b)` for printing and content comparison.\n- `Arrays.sort(a)` (dual-pivot quicksort for primitives) and `Arrays.binarySearch(a, key)`.\n- `Arrays.copyOf(a, n)` and `Arrays.fill(a, v)` for resizing and initialising.',
    },
  ],
  complexity: [
    { operation: 'Access by index', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Search (unsorted)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Search (sorted, binary)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Insert / delete at index', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Manual insert and delete',
      description: 'From scratch: shifting elements by hand in a fixed-size array.',
      code: `import java.util.Arrays;

public class ManualArrayOps {
    static int insert(int[] a, int size, int index, int value) {
        for (int i = size; i > index; i--) {
            a[i] = a[i - 1];
        }
        a[index] = value;
        return size + 1;
    }

    static int delete(int[] a, int size, int index) {
        for (int i = index; i < size - 1; i++) {
            a[i] = a[i + 1];
        }
        return size - 1;
    }

    public static void main(String[] args) {
        int[] a = new int[6];
        a[0] = 10; a[1] = 20; a[2] = 30; a[3] = 40;
        int size = 4;

        size = insert(a, size, 2, 25);
        System.out.println(Arrays.toString(a));

        size = delete(a, size, 1);
        System.out.println(Arrays.toString(
            Arrays.copyOf(a, size)));
    }
}
`,
    },
    {
      title: 'java.util.Arrays toolbox',
      description: 'The built-in equivalent: sort, search, copy, compare.',
      code: `import java.util.Arrays;

public class ArraysToolbox {
    public static void main(String[] args) {
        int[] scores = {78, 85, 92, 90};

        Arrays.sort(scores);
        System.out.println(Arrays.toString(scores));

        int pos = Arrays.binarySearch(scores, 90);
        System.out.println("90 at index: " + pos);

        int[] bigger = Arrays.copyOf(scores, 8);
        Arrays.fill(bigger, 4, 8, -1);
        System.out.println(Arrays.toString(bigger));

        int[] copy = Arrays.copyOf(scores, scores.length);
        System.out.println("Equal: " + Arrays.equals(scores, copy));
    }
}
`,
    },
  ],
  mistakes: [
    'Off-by-one loops: valid indices are 0 to arr.length - 1, so loop with i < arr.length, never i <= arr.length.',
    'Comparing arrays with == or .equals() checks identity, not contents — use Arrays.equals(a, b).',
    'Forgetting arrays are fixed-size: assigning past the end throws ArrayIndexOutOfBoundsException.',
    'Assuming new int[4] holds nulls: numeric arrays default to 0, which can hide missing-value bugs.',
    'Calling Arrays.binarySearch on an unsorted array: the result is undefined unless the array is sorted first.',
    'Thinking Arrays.copyOf resizes in place: it returns a new array — you must assign the result.',
  ],
  vizId: 'array-ops',
  problemIds: ['two-sum', 'contains-duplicate', 'best-time-to-buy-and-sell-stock'],
};
