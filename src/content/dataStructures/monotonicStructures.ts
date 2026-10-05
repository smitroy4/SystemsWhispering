import type { Topic } from '../../types/content.ts';

/** Monotonic Stack/Queue Structures: sorted containers that answer in O(n). */
export const monotonicStructuresTopic: Topic = {
  slug: 'monotonic-structures',
  title: 'Monotonic Stack/Queue Structures',
  category: 'data-structures',
  order: 33,
  summary: 'Stacks and deques kept in sorted order — next-greater elements and sliding-window maxima in linear time.',
  level: 'intermediate',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['stack'],
  sections: [
    {
      heading: 'Sorted by construction',
      body: 'A **monotonic stack** keeps its elements in sorted order — decreasing for next-greater problems, increasing for next-smaller. The invariant is enforced on push: before pushing `x`, pop every element that violates the order. Each element is pushed once and popped at most once, so the whole pass is `O(n)`.\n\nA **monotonic deque** (queue) extends the idea to sliding windows: it stores *indices* in value order, evicting from the back on arrival and from the front when indices leave the window. The front always holds the current window’s extreme.',
    },
    {
      heading: 'How it lives in memory',
      body: 'No new layout — a monotonic structure *is* an `ArrayDeque` (or array + top index) plus the pop-before-push discipline. Memory is `O(n)` worst case (a sorted input never pops), `O(1)`–`O(k)` typically.\n\n- Store **indices**, not values, whenever positions matter (windows, distances, spans): values compare, indices locate and expire.\n- Strict vs non-strict comparisons decide ties: `<` vs `<=` chooses whether equal elements pop each other — and that choice changes answers (e.g. in Largest Rectangle).\n- The deque variant needs both ends: pop-back for order, pop-front for expiry. A stack cannot expire old indices — that is why windows need deques.',
    },
    {
      heading: 'The three canonical patterns',
      body: '**Next greater element**: decreasing stack of indices; when `a[i]` exceeds the top, every popped index found its answer at `i`. Leftovers get -1. **Daily Temperatures** is this pattern in disguise (answer = distance, not value).\n\n**Largest Rectangle in Histogram**: increasing stack; when a shorter bar arrives, each popped bar’s maximal width is settled — height × (right boundary − left boundary − 1). Append a sentinel 0 to flush the stack.\n\n**Sliding Window Maximum**: decreasing deque of indices; push-back evicts smaller values, pop-front evicts out-of-window indices, front is each window’s max — `O(n)` total, no heap needed.',
    },
    {
      heading: 'Real-world use',
      body: 'Stock-span problems, trap-rain-water volume, car fleets merging, remove-duplicate-letters (lexicographic monotonicity), and streaming dashboards maintaining windowed maxima over sensor data. Compilers use monotonic value numbering; layout engines resolve collapsing margins with the same “pop while violated” shape.\n\nReach for monotonic containers when a brute force rescans neighbours for extremes — if each element can settle the moment a bigger (or smaller) neighbour appears, the stack does it in one pass.',
    },
  ],
  complexity: [
    { operation: 'Next greater / previous greater (all)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Largest rectangle / trapping rain', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Sliding window max (all windows)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(k)' },
  ],
  javaCode: [
    {
      title: 'Next greater + sliding maximum',
      description: 'Decreasing stack of indices; decreasing deque with expiry.',
      code: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class Monotonic {
    /** Next greater element for every index; -1 where none exists. */
    static int[] nextGreater(int[] a) {
        int[] ans = new int[a.length];
        Arrays.fill(ans, -1);
        Deque<Integer> st = new ArrayDeque<>(); // decreasing values by index
        for (int i = 0; i < a.length; i++) {
            while (!st.isEmpty() && a[i] > a[st.peek()]) {
                ans[st.pop()] = a[i]; // i is their next greater
            }
            st.push(i);
        }
        return ans;
    }

    /** Maximum of every window of size k in O(n). */
    static int[] slidingMax(int[] a, int k) {
        int[] ans = new int[a.length - k + 1];
        Deque<Integer> dq = new ArrayDeque<>(); // decreasing values by index
        for (int i = 0; i < a.length; i++) {
            while (!dq.isEmpty() && a[i] >= a[dq.peekLast()]) {
                dq.pollLast(); // i dominates them
            }
            dq.offerLast(i);
            if (dq.peekFirst() <= i - k) {
                dq.pollFirst(); // left the window
            }
            if (i >= k - 1) {
                ans[i - k + 1] = a[dq.peekFirst()];
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{4, 5, 2, 10, 8})));
        System.out.println(Arrays.toString(slidingMax(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
    }
}
`,
    },
    {
      title: 'Largest rectangle in histogram',
      description: 'Increasing stack: each popped bar settles its maximal width.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class LargestRectangle {
    static int largest(int[] h) {
        Deque<Integer> st = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= h.length; i++) {
            int cur = (i == h.length) ? 0 : h[i]; // sentinel flushes the stack
            while (!st.isEmpty() && cur < h[st.peek()]) {
                int height = h[st.pop()];
                int left = st.isEmpty() ? -1 : st.peek();
                best = Math.max(best, height * (i - left - 1));
            }
            st.push(i);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(largest(new int[]{2, 1, 5, 6, 2, 3})); // 10
    }
}
`,
    },
  ],
  mistakes: [
    'Storing values instead of indices: values compare, but only indices give distances, spans, and window expiry.',
    'Popping with the wrong strictness: >= vs > decides how equal elements treat each other — mismatched ties break rectangle widths.',
    'Forgetting the sentinel: without a trailing 0 (or final flush loop), bars surviving in the stack never settle.',
    'Using a stack for sliding windows: stacks cannot evict the front — windows need a deque with pop-front expiry.',
    'Checking expiry after reading the answer: evict out-of-window indices first, or stale fronts poison results.',
    'Recomputing with a heap per window: O(n log k) works but misses the point — the deque does it in O(n) total.',
  ],
  vizId: 'monotonic-ops',
  problemIds: ['daily-temperatures', 'next-greater-element-i', 'largest-rectangle-in-histogram'],
  javaBuiltIn: ['java.util.ArrayDeque'],
  related: ['stack', 'queue-deque'],
};
