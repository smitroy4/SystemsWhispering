import type { Topic } from '../../types/content.ts';

/** ArrayDeque: the circular array behind modern stacks and queues. */
export const arrayDequeTopic: Topic = {
  slug: 'arraydeque-jcf',
  title: 'ArrayDeque',
  category: 'data-structures',
  order: 40,
  summary: 'The circular-array workhorse: ArrayDeque as stack and queue, resizing, and the no-nulls rule.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['queue-deque', 'collections-framework'],
  choiceBox: {
    choose: [
      'Every stack, queue, or deque in single-threaded code — the documented default.',
      'Sliding windows and both-ends processing (`pollFirst`/`pollLast` in one structure).',
      'BFS frontiers and bracket matching where allocation rate matters.',
    ],
    avoid: [
      'Indexed access (`get(i)` doesn’t exist) — that’s `ArrayList` territory.',
      'Null elements — forbidden; `null` is the “empty” signal for `poll`/`peek`.',
      'Shared-across-threads queues — `ConcurrentLinkedQueue` or a `BlockingQueue` instead.',
    ],
  },
  sections: [
    {
      heading: 'A ring that resizes',
      body: 'Internally `ArrayDeque` is a power-of-two circular array with `head`/`tail` indices (see the ring-buffer animation on Circular Queue — same arithmetic, but this one **grows**). Full means double the array and unwrap the two segments into order; empty means `poll` returns `null` instead of throwing.\n\n- No `null` elements, ever: `offer(null)` throws `NullPointerException` because `poll()` uses `null` to mean “nothing here”.\n- Head and tail chase with bit-masking (`(i + 1) & (len − 1)`), so capacities stay powers of two.\n- As a `Deque` it speaks stack (`push`/`pop`/`peek`), queue (`offer`/`poll`), and both-ends fluently — one class, three roles.',
    },
    {
      heading: 'The Deque vocabulary, precisely',
      body: 'Twelve methods, two philosophies: throwing (`addFirst`, `removeFirst`, `getFirst`) vs polite (`offerFirst`, `pollFirst`, `peekFirst`). Use throwing variants when emptiness is a bug; polite variants when it is routine (stream ends, optional work).\n\n- `push` = `addFirst`, `pop` = `removeFirst` — stack spelling over deque mechanics.\n- `descendingIterator` walks back-to-front without copying.\n- Bulk `addAll`/`removeAll` exist but iterate internally — still `O(n)`, just convenient.',
    },
    {
      heading: 'Resizing without tears',
      body: 'Growth doubles (unlike `ArrayList`’s 1.5×) because rings copy in two segments and powers of two keep the mask trick working. Amortized cost stays `O(1)`; the copy is one contiguous `System.arraycopy` per segment.\n\n- Constructor capacity rounds up to the next power of two — `new ArrayDeque<>(1000)` allocates 1024.\n- Never shrinks: like most JDK structures, it holds its high-water mark. Recreate it to release memory.',
    },
    {
      heading: 'Sliding windows: the showcase',
      body: 'Monotonic deques (see Monotonic Structures) are `ArrayDeque<Integer>` holding indices: evict smaller values from the back, expired indices from the front, read the max off the front — every window in `O(1)` amortized. `Sliding Window Maximum` is the canonical drill, and the pattern recurs in rate limiters and streaming medians.',
    },
  ],
  complexity: [
    { operation: 'offer / poll / peek (either end)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'push / pop (stack use)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Resize (double + unwrap)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'remove(Object) / contains', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Stack, queue, and deque idioms',
      description: 'One class, three roles — plus the null rule.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class DequeRoles {
    static boolean balanced(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else if (st.isEmpty()) {
                return false;
            } else {
                char open = st.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) {
                    return false;
                }
            }
        }
        return st.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(balanced("{[()]}")); // true

        Deque<Integer> window = new ArrayDeque<>();
        for (int v : new int[]{4, 1, 7, 3}) {
            window.offerLast(v); // queue role
        }
        System.out.println(window.pollFirst()); // 4
        System.out.println(window.peekLast()); // 3
    }
}
`,
    },
    {
      title: 'Sliding-window maximum interview core',
      description: 'Monotonic deque of indices — every window’s max in O(n).',
      code: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class SlidingMax {
    static int[] maxInWindows(int[] a, int k) {
        int[] ans = new int[a.length - k + 1];
        Deque<Integer> dq = new ArrayDeque<>(); // decreasing values, by index
        for (int i = 0; i < a.length; i++) {
            while (!dq.isEmpty() && a[i] >= a[dq.peekLast()]) {
                dq.pollLast();
            }
            dq.offerLast(i);
            if (dq.peekFirst() <= i - k) {
                dq.pollFirst(); // index left the window
            }
            if (i >= k - 1) {
                ans[i - k + 1] = a[dq.peekFirst()];
            }
        }
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(
            maxInWindows(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
    }
}
`,
    },
  ],
  mistakes: [
    'Adding nulls: offer(null) throws — null is reserved as the empty signal for poll/peek.',
    'Using pop() where emptiness is routine: pop throws on empty — pollFirst returns null for end-of-stream handling.',
    'Indexing into it: there is no get(i) — indexed work belongs to ArrayList.',
    'Assuming it shrinks: capacity only grows — recreate the deque to release a high-water mark.',
    'Sharing across threads: concurrent offers corrupt head/tail — concurrent queues live in java.util.concurrent.',
    'Forgetting window expiry: evict out-of-range indices BEFORE reading the front, or stale maxima leak through.',
  ],
  vizId: 'circular-queue-ops',
  problemIds: ['sliding-window-maximum', 'implement-queue-using-stacks', 'number-of-recent-calls'],
  javaBuiltIn: ['java.util.ArrayDeque', 'java.util.Deque'],
  related: ['queue-deque', 'circular-queue', 'stack'],
};
