import type { Topic } from '../../types/content.ts';

/** Monotonic stacks and queues: candidates in order, each element handled once. */
export const monotonicTopic: Topic = {
  slug: 'monotonic-stack-queue',
  title: 'Monotonic Stack & Queue',
  category: 'concepts',
  order: 11,
  summary: 'Keep candidates sorted in a stack or deque: next-greater, daily temperatures, and sliding-window maximum in O(n).',
  level: 'intermediate',
  prerequisites: ['stack', 'queue-deque'],
  sections: [
    {
      heading: 'Order as a data structure',
      body: 'A **monotonic stack** keeps its contents sorted (increasing or decreasing) by popping violators on every insert. For **next greater element**, scan right → left: pop everything ≤ x (they can never be anyone’s answer again), and the new top — larger than x — is x’s answer.\n\nEach element pushes once and pops once: **O(n)** total. The stack always holds a sorted chain of "still relevant" candidates.',
    },
    {
      heading: 'The queue twin: sliding maximum',
      body: 'A **monotonic deque** does the same job for windows: store indices with decreasing values, drop the front when it leaves the window, and pop smaller values from the back on every arrival. The front is always the window maximum — `O(n)` where a heap would cost `O(n log k)`.\n\nSame invariant, different direction: stacks look backward (what came before), deques frame a moving window.',
    },
    {
      heading: 'Recognizing the pattern',
      body: 'Reach for monotonic structures on "next/previous greater/smaller", "how long until warmer/taller", largest rectangle, trapping rain water, and constrained maximums. The giveaway: a naive solution re-scans to the left (or the window) for every element — the monotonic structure remembers exactly that scan.',
    },
  ],
  complexity: [
    { operation: 'Next greater (all)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Sliding window maximum', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(k)' },
    { operation: 'Largest rectangle', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Next greater element from scratch',
      description: 'Right-to-left scan with an increasing stack.',
      code: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class NextGreater {
    static int[] nextGreater(int[] a) {
        int[] ans = new int[a.length];
        Deque<Integer> stack = new ArrayDeque<>(); // increasing values
        for (int i = a.length - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= a[i]) {
                stack.pop(); // smaller: useless to the left
            }
            ans[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(a[i]);
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(nextGreater(new int[]{4, 5, 2, 10, 8})));
        // [5, 10, 10, -1, -1]
    }
}
`,
    },
    {
      title: 'Sliding window maximum variant',
      description: 'Monotonic deque of indices with window eviction.',
      code: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class SlidingMax {
    static int[] maxWindow(int[] a, int k) {
        int[] ans = new int[a.length - k + 1];
        Deque<Integer> dq = new ArrayDeque<>(); // decreasing values
        for (int i = 0; i < a.length; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst(); // left the window
            }
            while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) {
                dq.pollLast(); // smaller: never the max
            }
            dq.offerLast(i);
            if (i >= k - 1) {
                ans[i - k + 1] = a[dq.peekFirst()];
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(maxWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
        // [3, 3, 5, 5, 6, 7]
    }
}
`,
    },
  ],
  mistakes: [
    'Popping with < instead of ≤: equal values linger and report each other — decide ties deliberately.',
    'Forgetting window eviction: check the front index against i − k every step, not just on insert.',
    'Storing values instead of indices in deques: eviction needs positions — values alone cannot expire.',
    'Scanning left-to-right for next-greater: the stack holds *previous* candidates — go right-to-left.',
    'Re-sorting per window: the deque maintains order incrementally — that is the entire O(n) win.',
  ],
  vizId: 'monotonic-stack-steps',
  problemIds: ['daily-temperatures', 'next-greater-element-i', 'largest-rectangle-in-histogram', 'trapping-rain-water'],
};
