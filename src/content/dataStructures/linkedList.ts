import type { Topic } from '../../types/content.ts';

/** LinkedList: JDK doubly linked list — ends are cheap, indices are not. */
export const linkedListTopic: Topic = {
  slug: 'linkedlist-jcf',
  title: 'LinkedList',
  category: 'data-structures',
  order: 38,
  summary: "Java's doubly linked list plus Deque: where it shines, where ArrayList wins, and the cache cost of nodes.",
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['singly-linked-list', 'collections-framework'],
  choiceBox: {
    choose: [
      'End-heavy workloads with **unknown size**: queues, deques, and splice-in-the-middle edits via `ListIterator`.',
      'You need `Deque` operations **plus** `List` indexing in one object (rare — usually pick one role).',
      'Interview drills that say “linked list” — the mental model transfers directly to these problems.',
    ],
    avoid: [
      'Random access or iteration-heavy code — node hops trash the cache; `ArrayList` is 10–50× faster to scan.',
      'Stacks and queues — `ArrayDeque` beats it on every metric (memory, speed, allocation).',
      'Primitive-heavy storage — one node object per element plus two references each.',
    ],
  },
  sections: [
    {
      heading: 'Doubly linked, doubly interfaced',
      body: '`LinkedList<E>` implements **both** `List` and `Deque`: indexed access (`get(i)`) *and* end operations (`addFirst`, `pollLast`, `push`, `pop`). Internally it is textbook doubly linked nodes — `item`, `next`, `prev` — with `first`/`last` pointers, so end operations are `O(1)` while `get(i)` walks from the nearer end (`O(n)`).\n\nThat dual citizenship is historical more than practical: modern code uses `ArrayList` for lists and `ArrayDeque` for deques. `LinkedList` survives for end-heavy mutation and as the reference implementation of both contracts.',
    },
    {
      heading: 'Internals: nodes and the size field',
      body: 'Each element allocates a `Node` (~24 bytes overhead + item reference). `size` is maintained explicitly, so `size()` is `O(1)` — but `get(i)` costs `min(i, size−i)` hops, and each hop likely misses the cache (nodes scatter across the heap).\n\n- `addFirst/addLast`: allocate, rewire two pointers — `O(1)`, no growth policy, no capacity.\n- `remove(Object)`: linear search plus `O(1)` unlink once found.\n- `listIterator(i)` starts a cursor *at* index i after one walk — subsequent `next/previous/add/remove` are all `O(1)`. Bulk middle edits belong to this cursor, not to indexed loops.',
    },
    {
      heading: 'ListIterator splicing: the fast path',
      body: 'The one workload where `LinkedList` beats `ArrayList`: walk once with a `ListIterator` and `add`/`remove` at the cursor — each edit is `O(1)`, total `O(n)` for n edits. The same loop on `ArrayList` shifts the tail per edit (`O(n²)`).\n\nText editors (gap buffers aside), playlist reorderings, and merge-style algorithms use exactly this shape. Everywhere else, measure before choosing nodes over arrays.',
    },
    {
      heading: 'Deque role and its limits',
      body: 'As a `Deque`, `LinkedList` supports stack (`push`/`pop`), queue (`offer`/`poll`), and double-ended ops — but `ArrayDeque`’s circular array does the same with no per-element allocation and better locality. The JDK docs themselves recommend `ArrayDeque` over both `Stack` and `LinkedList`-as-stack.\n\n- `LinkedList` allows `null` elements; `ArrayDeque` forbids them (null = “empty” signal).\n- Neither is thread-safe: concurrent ends need `ConcurrentLinkedDeque` or blocking queues.',
    },
  ],
  complexity: [
    { operation: 'addFirst / addLast / push / offer', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'poll / pop / peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'get / set by index', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'add / remove at ListIterator cursor', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'remove(Object) / contains', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Deque ends and ListIterator splicing',
      description: 'Both interfaces in action: ends for queues, cursor for middle edits.',
      code: `import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;

public class LinkedListRoles {
    public static void main(String[] args) {
        // Role 1: Deque — ends are O(1).
        Deque<String> queue = new LinkedList<>();
        queue.offerLast("first");
        queue.offerLast("second");
        queue.offerFirst("zeroth");
        System.out.println(queue.pollFirst()); // zeroth

        // Role 2: List + ListIterator — O(1) edits at the cursor.
        List<Integer> nums = new LinkedList<>(List.of(1, 2, 4));
        ListIterator<Integer> it = nums.listIterator();
        while (it.hasNext()) {
            int v = it.next();
            if (v == 2) {
                it.add(3); // splice without shifting a tail
            }
        }
        System.out.println(nums); // [1, 2, 3, 4]
    }
}
`,
    },
    {
      title: 'Reversal interview snippet',
      description: 'descendingIterator: the built-in backward walk.',
      code: `import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class ReverseWalk {
    public static void main(String[] args) {
        LinkedList<String> stops = new LinkedList<>(List.of("a", "b", "c"));
        Iterator<String> down = stops.descendingIterator();
        while (down.hasNext()) {
            System.out.print(down.next() + " "); // c b a
        }
    }
}
`,
    },
  ],
  mistakes: [
    'Indexing in a loop (get(i) × n): quadratic node walks — iterate with for-each or a ListIterator instead.',
    'Choosing LinkedList for stacks/queues by habit: ArrayDeque is faster, leaner, and the documented recommendation.',
    'Assuming O(1) get: get(i) walks min(i, size−i) hops — there is no array underneath.',
    'Storing primitives at scale: one Node per int plus boxing — memory explodes versus int[] or ArrayList.',
    'Removing by index while iterating forward: indices shift under the cursor — use iterator.remove() or iterate backward.',
    'Sharing across threads: concurrent add/removes corrupt pointers silently — fail-fast may not even fire.',
  ],
  vizId: 'dll-ops',
  problemIds: ['reverse-linked-list', 'merge-two-sorted-lists', 'reorder-list'],
  javaBuiltIn: ['java.util.LinkedList', 'java.util.Deque'],
  related: ['singly-linked-list', 'doubly-linked-list', 'arraydeque-jcf'],
};
