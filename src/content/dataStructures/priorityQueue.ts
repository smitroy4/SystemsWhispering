import type { Topic } from '../../types/content.ts';

/** PriorityQueue: the heap in Queue clothing — comparators, sifts, and limits. */
export const priorityQueueTopic: Topic = {
  slug: 'priorityqueue-jcf',
  title: 'PriorityQueue',
  category: 'data-structures',
  order: 41,
  summary: "Java's binary-heap queue: offer/peek/poll, ordering with Comparable and Comparator, and what iteration won't promise.",
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['heap', 'collections-framework'],
  choiceBox: {
    choose: [
      'Top-k, schedulers, event simulation, merge-k-lists — anywhere the extreme matters, repeatedly.',
      'K-largest via a size-k min-heap; running medians via two heaps (see Min-Max Heap).',
      'Custom orderings with `Comparator.comparing(...)` — no `Comparable` required on the element.',
    ],
    avoid: [
      'FIFO or LIFO — that’s `ArrayDeque`; heaps reorder by priority, not arrival.',
      'Sorted iteration — only `poll()` order is defined; for-each looks random.',
      'Fixed-size or blocking needs — no capacity bound, no waiting; `ArrayBlockingQueue`/`PriorityBlockingQueue` instead.',
    ],
  },
  sections: [
    {
      heading: 'A heap wearing Queue clothes',
      body: 'Internally `PriorityQueue` is an array-packed binary heap (min-heap by default): `offer` appends and swims up, `poll` removes the root and sinks the last element down — the sift dance from the animation, `O(log n)` each, `peek` at `O(1)`.\n\nThe Queue naming is the trap: `offer`/`poll`/`peek` suggest FIFO, but removal order is *priority* order. If elements are tasks with deadlines, the earliest deadline leaves first regardless of arrival — exactly right for schedulers, exactly wrong for waiting lines.',
    },
    {
      heading: 'Ordering: Comparable vs Comparator',
      body: 'Elements must be mutually comparable: either implement `Comparable` (natural order) or supply a `Comparator` at construction. Max-heap? `new PriorityQueue<>(Comparator.reverseOrder())`. Multi-field order? `Comparator.comparing(Task::deadline).thenComparing(Task::priority)`.\n\n- Inconsistent ordering corrupts the heap silently: `compare(a,b)==0` should mean “interchangeable here” — never return 0 for distinct priorities you care about.\n- `null` elements are rejected (`NullPointerException`): heaps compare on every sift, and null has no order.\n- Ordering is fixed at construction: changing an element’s priority after insertion strands it — remove, mutate, re-offer.',
    },
    {
      heading: 'What iteration will not promise',
      body: 'Only `poll()` sequence is sorted. The backing array is heap-ordered, so for-each/`toArray`/`stream` visit a *valid heap layout*, not a sorted one — printing “to check the order” shows scrambled output and panics beginners yearly.\n\n- `contains`/`remove(Object)` scan linearly (`O(n)`): heaps locate extremes, not arbitrary members.\n- `toArray` + `Arrays.sort` (or draining via `poll`) materialises sorted order when you truly need it.\n- Size-k patterns never store more: offer, and `poll` the excess — the heap holds exactly the k winners.',
    },
    {
      heading: 'Sizing, growth, and relatives',
      body: 'No capacity bound: the array grows like `ArrayList` (doubling-ish) when full — `offer` never fails for capacity reasons. Initial capacity only avoids early copies.\n\n- Need blocking? `PriorityBlockingQueue` (unbounded, thread-safe). Need bounded + blocking? `ArrayBlockingQueue` (but FIFO, not priority).\n- Need decrease-key (Dijkstra)? The JDK has no indexed PQ — lazy deletion (re-offer, skip stale on poll) or a hand-rolled indexed heap.',
    },
  ],
  complexity: [
    { operation: 'offer / peek', best: 'O(1)', average: 'O(log n) / O(1)', worst: 'O(log n) / O(1)', space: 'O(n)' },
    { operation: 'poll', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'remove(Object) / contains', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'heapify (bulk via addAll)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Comparators and k-largest',
      description: 'Max-heap, field ordering, and the size-k pattern.',
      code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityIdioms {
    record Task(String name, int deadline, int priority) {
    }

    /** K largest values via a size-k min-heap. */
    static List<Integer> largest(int[] nums, int k) {
        Queue<Integer> heap = new PriorityQueue<>();
        for (int n : nums) {
            heap.offer(n);
            if (heap.size() > k) {
                heap.poll(); // evict the smallest of the k+1
            }
        }
        return new ArrayList<>(heap);
    }

    public static void main(String[] args) {
        System.out.println(largest(new int[]{50, 30, 70, 20, 40}, 2));

        Queue<Task> urgent = new PriorityQueue<>(
            Comparator.comparingInt(Task::deadline).thenComparingInt(Task::priority));
        urgent.offer(new Task("deploy", 2, 1));
        urgent.offer(new Task("review", 1, 5));
        urgent.offer(new Task("lunch", 1, 1));
        while (!urgent.isEmpty()) {
            System.out.print(urgent.poll().name() + " "); // lunch review deploy
        }
    }
}
`,
    },
    {
      title: 'Lazy deletion interview snippet',
      description: 'Stale entries skipped on poll — decrease-key without an indexed heap.',
      code: `import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;

public class LazyDeletion {
    /** Best-known distance map; the queue may hold stale (node, oldDist) pairs. */
    static int siftBest(Queue<int[]> pq, Map<Integer, Integer> best) {
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            if (cur[1] == best.getOrDefault(cur[0], Integer.MAX_VALUE)) {
                return cur[0]; // fresh entry — the true minimum
            }
            // stale entry: a better distance was offered later — skip it
        }
        return -1;
    }

    public static void main(String[] args) {
        Queue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        Map<Integer, Integer> best = new HashMap<>();
        best.put(7, 10);
        pq.offer(new int[]{7, 99}); // stale: offered before the update
        pq.offer(new int[]{7, 10}); // fresh
        System.out.println("node=" + siftBest(pq, best)); // 7, stale skipped
    }
}
`,
    },
  ],
  mistakes: [
    'Reading iteration order as sorted: only poll() is ordered — for-each over a heap looks random by design.',
    'Forgetting the size-k eviction: offer without the poll-guard grows to n — the pattern keeps exactly k.',
    'Mutating priorities in place: the heap never re-sifts edited elements — remove, mutate, re-offer (or go lazy).',
    'Inconsistent compareTo/Comparator: equal-priority ties that aren’t equal break heap invariants unpredictably.',
    'Offering nulls: NullPointerException on sift — filter nulls before they reach the queue.',
    'Using it as a FIFO: priority order is not arrival order — queues that must be fair need ArrayDeque or LinkedBlockingQueue.',
  ],
  vizId: 'heap-ops',
  problemIds: ['task-scheduler', 'kth-largest-element-in-a-stream', 'find-median-from-data-stream'],
  javaBuiltIn: ['java.util.PriorityQueue', 'java.util.Comparator'],
  related: ['heap', 'min-max-heap', 'arraydeque-jcf'],
};
