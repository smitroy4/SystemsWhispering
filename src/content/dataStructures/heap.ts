import type { Topic } from '../../types/content.ts';

/** Heaps: complete trees in arrays, bubble-up/down, PriorityQueue. */
export const heapTopic: Topic = {
  slug: 'heap',
  title: 'Heaps & Priority Queues',
  category: 'data-structures',
  order: 12,
  summary: 'Complete binary trees packed into arrays: O(1) max/min, O(log n) insert and extract — the engine behind PriorityQueue.',
  level: 'intermediate',
  prerequisites: ['binary-tree', 'dynamic-array'],
  sections: [
    {
      heading: 'The biggest (or smallest) always on top',
      body: 'A **max-heap** guarantees every parent ≥ its children, so the maximum sits at the root — readable in `O(1)`. A **min-heap** mirrors this for the minimum. Unlike a BST there is **no left/right ordering**: 30 can sit left or right of 50, both are legal.\n\nHeaps answer "give me the extreme, repeatedly" — top-k elements, schedulers, Dijkstra’s frontier, and heapsort.',
    },
    {
      heading: 'Complete trees live in plain arrays',
      body: 'A heap is a **complete** binary tree (every level full except possibly the last, filled left to right), which packs perfectly into an array with zero pointers:\n\n- Children of index `i`: `2i + 1` and `2i + 2`. Parent: `(i - 1) / 2`.\n- **Insert**: append at the end, then **bubble up** (swap with the parent while larger) — `O(log n)`.\n- **Extract max**: save the root, move the last element to the root, then **bubble down** (swap with the larger child) — `O(log n)`.\n- Building from an unsorted array bottom-up (**heapify**) costs just `O(n)`, not `O(n log n)`.',
    },
    {
      heading: 'Bubble-up and bubble-down, precisely',
      body: 'Both repairs walk one root-to-leaf path. On insert, the new leaf rises while it beats its parent; each swap fixes one level, so at most height-many swaps. On extraction, the relocated last element sinks while a child beats it — always swapping with the **larger** child (max-heap) to preserve the invariant everywhere else.\n\nThe animation inserts 70 then extracts the max so you can watch both repairs.',
    },
    {
      heading: 'PriorityQueue in practice',
      body: 'Java’s `PriorityQueue` is a min-heap by default:\n\n- `offer` / `peek` / `poll` mirror queue naming; iteration order is unspecified — only removal is sorted.\n- Max-heap via `new PriorityQueue<>(Comparator.reverseOrder())`, or custom order with `Comparator.comparing(...)`.\n- Elements need `Comparable` or a `Comparator`; fixed capacity is absent (it grows like an ArrayList).\n- Classic uses: k-largest via a size-k min-heap, merging k sorted lists, event simulation.',
    },
  ],
  complexity: [
    { operation: 'Peek max / min', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Extract max / min', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Heapify an array', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'MinHeap from scratch',
      description: 'Array storage with swim (up) and sink (down) repairs.',
      code: `import java.util.Arrays;
import java.util.NoSuchElementException;

public class MinHeap {
    private int[] data = new int[8];
    private int size = 0;

    public void add(int value) {
        if (size == data.length) {
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[size] = value;
        swim(size);
        size++;
    }

    public int poll() {
        if (size == 0) {
            throw new NoSuchElementException("empty heap");
        }
        int min = data[0];
        data[0] = data[--size];
        sink(0);
        return min;
    }

    private void swim(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[i] >= data[parent]) {
                break;
            }
            swap(i, parent);
            i = parent;
        }
    }

    private void sink(int i) {
        while (true) {
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            int smallest = i;
            if (left < size && data[left] < data[smallest]) {
                smallest = left;
            }
            if (right < size && data[right] < data[smallest]) {
                smallest = right;
            }
            if (smallest == i) {
                break;
            }
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int a, int b) {
        int tmp = data[a];
        data[a] = data[b];
        data[b] = tmp;
    }

    public static void main(String[] args) {
        MinHeap heap = new MinHeap();
        for (int v : new int[]{50, 30, 70, 20}) {
            heap.add(v);
        }
        while (true) {
            try {
                System.out.print(heap.poll() + " ");
            } catch (NoSuchElementException e) {
                break;
            }
        }
    }
}
`,
    },
    {
      title: 'PriorityQueue built-in equivalent',
      description: 'Idiomatic Java: min/max heaps and k-largest.',
      code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

public class HeapDemo {
    static List<Integer> largest(int[] nums, int k) {
        Queue<Integer> heap = new PriorityQueue<>();
        for (int n : nums) {
            heap.offer(n);
            if (heap.size() > k) {
                heap.poll();
            }
        }
        return new ArrayList<>(heap);
    }

    public static void main(String[] args) {
        System.out.println(largest(new int[]{50, 30, 70, 20, 40}, 2));

        Queue<Integer> maxHeap =
            new PriorityQueue<>(Comparator.reverseOrder());
        maxHeap.offer(30);
        maxHeap.offer(70);
        maxHeap.offer(50);
        System.out.println("max=" + maxHeap.poll());
    }
}
`,
    },
  ],
  mistakes: [
    'Assuming iteration is sorted: only poll() order is guaranteed — for-each over a PriorityQueue looks random.',
    'Forgetting sizing on k-largest: keep the min-heap at exactly k, polling the excess every insert.',
    'Using a heap for plain FIFO: that is a queue’s job — heaps reorder by priority, not arrival.',
    'Off-by-one parent math: parent of i is (i - 1) / 2 with integer division — i / 2 is wrong for right children.',
    'Sinking toward the smaller child in a max-heap: always swap with the LARGER child or the invariant breaks.',
    'Comparable inconsistency: compareTo must agree with equals, or PriorityQueue silently misbehaves on ties.',
  ],
  vizId: 'heap-ops',
  problemIds: ['kth-largest-element-in-an-array', 'last-stone-weight', 'top-k-frequent-elements'],
};
