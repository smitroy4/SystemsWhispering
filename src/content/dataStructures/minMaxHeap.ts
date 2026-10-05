import type { Topic } from '../../types/content.ts';

/** Min-Max Heap & Indexed Priority Queue: extremes at both ends, handles for the middle. */
export const minMaxHeapTopic: Topic = {
  slug: 'min-max-heap',
  title: 'Min-Max Heap & Indexed Priority Queue',
  category: 'data-structures',
  order: 29,
  summary: "Double-ended extremes in one heap, plus handle-based updates and deletes — the scheduler's upgrade.",
  level: 'advanced',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['heap'],
  sections: [
    {
      heading: 'Both extremes in one array',
      body: 'A **min-max heap** alternates levels: even depths (root = level 0) are **min levels** — each node is the smallest of its subtree; odd depths are **max levels** — each node is the largest of its subtree. The minimum sits at the root; the maximum is one of its children. Both ends answer in `O(1)` from a single array.\n\nInsert bubbles up through *grandparents* (same-level comparisons): a new node rises past min-level grandparents while smaller, past max-level grandparents while larger. Extract-min/max removes the end and trickles the last element down through grandchildren — still `O(log n)`, with a wider but shallower repair path than a plain heap.',
    },
    {
      heading: 'How it lives in memory',
      body: 'One array, zero pointers — the same complete-tree packing as a binary heap (`children 2i+1/2i+2`, `grandchildren ±4`). Level parity comes free from the index: `floor(log2(i+1))` tells min from max level, or track depth during the walk.\n\n- No extra metadata per element: the min/max discipline is positional, not stored.\n- The classic extension keeps an **index map** (`value → position`) alongside, turning the heap into an **indexed priority queue**: locate any element in `O(1)`, then update or delete it in `O(log n)`.\n- Cache behaviour matches binary heaps — the structure earns its keep when *both* extremes are queried; for one-sided use a plain heap is simpler.',
    },
    {
      heading: 'Indexed PQ: handles change everything',
      body: 'A vanilla `PriorityQueue` cannot find, update, or delete an arbitrary element efficiently — and Dijkstra’s algorithm wants exactly that (decrease-key). An **indexed priority queue** assigns each inserted item a stable **handle** (its key id) and maintains two arrays: `heap[position] = handle` and `indexOf[handle] = position`, each the inverse of the other.\n\nEvery swap updates both arrays, so `changeKey(handle, newPriority)` and `delete(handle)` locate the element instantly and restore order in `O(log n)`. The animation shows a min-heap peek both ends, then pop-min with the last element trickling down.',
    },
    {
      heading: 'Two heaps: the median trick',
      body: 'The most interview-relevant double-ended pattern needs no exotic heap: maintain a **max-heap of the lower half** and a **min-heap of the upper half**, rebalancing so sizes differ by at most one. The median is a root peek (`O(1)`); inserts cost `O(log n)`. `Find Median from Data Stream` is this pattern verbatim — and it generalises to percentiles, sliding medians, and dual-priority schedulers.\n\nRule: one extreme → one heap; both extremes with updates → min-max or indexed PQ; running median → two heaps.',
    },
    {
      heading: 'Real-world use',
      body: 'Double-ended task schedulers (urgent-first and deadline-first views of one queue), game matchmaking (best and worst candidate picks), network packet schedulers with min/max latency bounds, and Dijkstra/A* frontiers with decrease-key via indexed heaps. Java’s `PriorityQueue` covers the simple cases; Guava and algorithm libraries ship indexed variants for the rest.\n\nReach for min-max/indexed heaps when priorities change after insertion or both ends matter; reach for two plain heaps when the median (or any fixed rank split) is the target.',
    },
  ],
  complexity: [
    { operation: 'Peek min / peek max', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Extract min / max', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Update / delete by handle (indexed)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'IndexedMinPQ from scratch',
      description: 'Handles plus inverse index: O(log n) change-key and delete.',
      code: `import java.util.NoSuchElementException;

public class IndexedMinPQ {
    private final int[] heap;    // heap[position] = handle (1-based)
    private final int[] indexOf; // indexOf[handle] = position, -1 when absent
    private final int[] key;     // key[handle] = priority
    private int size;

    public IndexedMinPQ(int handles) {
        heap = new int[handles + 1];
        indexOf = new int[handles];
        key = new int[handles];
        java.util.Arrays.fill(indexOf, -1);
    }

    public void insert(int handle, int priority) {
        key[handle] = priority;
        heap[++size] = handle;
        indexOf[handle] = size;
        swim(size);
    }

    public void changeKey(int handle, int priority) {
        key[handle] = priority;
        int pos = indexOf[handle];
        swim(pos);
        sink(pos);
    }

    public int pollMin() {
        if (size == 0) {
            throw new NoSuchElementException("empty pq");
        }
        int min = heap[1];
        swap(1, size--);
        sink(1);
        indexOf[min] = -1;
        return min;
    }

    private boolean less(int a, int b) {
        return key[heap[a]] < key[heap[b]];
    }

    private void swap(int a, int b) {
        int tmp = heap[a];
        heap[a] = heap[b];
        heap[b] = tmp;
        indexOf[heap[a]] = a;
        indexOf[heap[b]] = b;
    }

    private void swim(int i) {
        while (i > 1 && less(i, i / 2)) {
            swap(i, i / 2);
            i /= 2;
        }
    }

    private void sink(int i) {
        while (2 * i <= size) {
            int child = 2 * i;
            if (child < size && less(child + 1, child)) {
                child++;
            }
            if (!less(child, i)) {
                break;
            }
            swap(i, child);
            i = child;
        }
    }

    public static void main(String[] args) {
        IndexedMinPQ pq = new IndexedMinPQ(4);
        pq.insert(0, 30);
        pq.insert(1, 10);
        pq.insert(2, 20);
        pq.changeKey(0, 5); // handle 0 jumps to the front
        System.out.println("min=" + pq.pollMin()); // 0
        System.out.println("min=" + pq.pollMin()); // 1
    }
}
`,
    },
    {
      title: 'Running median with two heaps',
      description: 'Max-heap lower half, min-heap upper half — median in O(1).',
      code: `import java.util.Collections;
import java.util.PriorityQueue;
import java.util.Queue;

public class RunningMedian {
    private final Queue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    private final Queue<Integer> high = new PriorityQueue<>();

    public void add(int value) {
        if (low.isEmpty() || value <= low.peek()) {
            low.offer(value);
        } else {
            high.offer(value);
        }
        if (low.size() > high.size() + 1) {
            high.offer(low.poll());
        } else if (high.size() > low.size()) {
            low.offer(high.poll());
        }
    }

    public double median() {
        if (low.size() > high.size()) {
            return low.peek();
        }
        return (low.peek() + high.peek()) / 2.0;
    }

    public static void main(String[] args) {
        RunningMedian m = new RunningMedian();
        for (int v : new int[]{5, 15, 1, 3}) {
            m.add(v);
            System.out.println("median=" + m.median());
        }
    }
}
`,
    },
  ],
  mistakes: [
    'Comparing with parents instead of grandparents: min-max levels alternate — repairs compare two levels up, not one.',
    'Forgetting the inverse index: every swap must update both heap[] and indexOf[] — one stale map entry corrupts all later updates.',
    'Using two heaps for plain min/max: the two-heap pattern targets medians — for both extremes in one structure, use min-max.',
    'Allowing handles to leak: polled handles must reset to absent (-1) or changeKey resurrects removed entries.',
    'Rebalancing median heaps wrong: low may exceed high by one, never the reverse — the invariant decides which root is the median.',
    'Reaching for indexed heaps too early: PriorityQueue plus lazy deletion (skip stale entries on poll) is simpler and often fast enough.',
  ],
  vizId: 'minmax-heap-ops',
  problemIds: ['find-median-from-data-stream', 'kth-largest-element-in-an-array', 'last-stone-weight'],
  javaBuiltIn: ['java.util.PriorityQueue'],
  related: ['heap', 'segment-tree'],
};
