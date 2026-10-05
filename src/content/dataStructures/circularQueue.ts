import type { Topic } from '../../types/content.ts';

/** Circular Queue: a fixed array reused as an endless ring. */
export const circularQueueTopic: Topic = {
  slug: 'circular-queue',
  title: 'Circular Queue',
  category: 'data-structures',
  order: 21,
  summary: 'A fixed-size queue on a ring buffer: head and tail chase each other with modulo arithmetic, no shifting.',
  level: 'beginner',
  group: 'linear',
  status: 'complete',
  prerequisites: ['queue-deque'],
  sections: [
    {
      heading: 'The ring buffer idea',
      body: 'A **circular queue** stores FIFO order in a fixed-size array whose ends are glued together: when an index runs past the last slot it wraps to slot `0` via modulo. Enqueue writes at `tail` and advances it; dequeue reads at `head` and advances it. Nothing ever shifts, so both operations are `O(1)` with zero allocation after construction.\n\nThe wrap is the whole trick: freed slots at the front are reused by later arrivals, so a capacity-5 buffer serves an unbounded *stream* of items as long as no more than 5 are waiting at once.',
    },
    {
      heading: 'Head, tail, size: telling full from empty',
      body: 'Three fields run the ring: `head` (next to dequeue), `tail` (next free slot), and `size` (current count). All movement is `(index + 1) % capacity`.\n\n- **Empty**: `size == 0`. **Full**: `size == capacity`. The counter disambiguates the `head == tail` case, which means *both* states.\n- The classic alternative wastes one slot and calls the queue full when `(tail + 1) % capacity == head`. Prefer the explicit `size` — it also makes `size()` `O(1)`.\n- Resizing a wrapped buffer copies in **two segments** (head→end, then start→tail) and resets `head = 0`. `ArrayDeque` does exactly this when it grows.',
    },
    {
      heading: 'How it lives in memory',
      body: 'One contiguous `Object[]` allocated once, reused forever — the friendliest possible cache pattern for a queue. No nodes, no pointers, no garbage per operation, which is why rings dominate hot paths.\n\n- Wraparound is pure arithmetic: no branchy special cases, just `% capacity` (power-of-two capacities can use faster bit-masking: `(i + 1) & (cap - 1)`).\n- The price is fixed capacity: `offer` on a full ring must fail, block, or overwrite. Pick the policy up front — queues that must grow unboundedly want `ArrayDeque` instead.',
    },
    {
      heading: 'Offer, poll, peek — with wrap',
      body: '`offer(x)`: fail if full; else `data[tail] = x; tail = (tail + 1) % cap; size++`. `poll()`: fail/return null if empty; else `x = data[head]; data[head] = null; head = (head + 1) % cap; size--` (nulling lets the garbage collector reclaim payloads). `peek()` reads `data[head]` without moving anything.\n\nThe animation enqueues past the end of the array so you can watch `tail` wrap to slot 0, then fills the ring until `head == tail` with `size == capacity` — full, not empty.',
    },
    {
      heading: 'Real-world use',
      body: 'Audio and video streaming buffer frames in rings; device drivers queue packets the same way. Logging frameworks keep the last N events in a ring (see `Number of Recent Calls`, which is a queue over a time window). OS keyboard buffers, BFS frontiers in memory-tight embedded code, and `ArrayDeque` — Java’s default stack/queue — is a growable ring buffer under the hood.\n\nChoose a ring when throughput matters, capacity is knowable, and allocation must stay flat; choose a linked queue when capacity is unknowable and per-node overhead is acceptable.',
    },
  ],
  complexity: [
    { operation: 'offer (enqueue)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(cap)' },
    { operation: 'poll / peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(cap)' },
    { operation: 'size / isEmpty / isFull', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(cap)' },
    { operation: 'Resize (grow)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'CircularQueue from scratch',
      description: 'Fixed array plus head/tail/size — wrap with modulo, fail when full.',
      code: `import java.util.NoSuchElementException;

public class CircularQueue<E> {
    private final Object[] data;
    private int head; // next slot to dequeue
    private int tail; // next free slot
    private int size;

    public CircularQueue(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("capacity must be positive");
        }
        this.data = new Object[capacity];
    }

    public boolean offer(E value) {
        if (size == data.length) {
            return false; // full: caller decides (block, grow, or drop)
        }
        data[tail] = value;
        tail = (tail + 1) % data.length;
        size++;
        return true;
    }

    @SuppressWarnings("unchecked")
    public E poll() {
        if (size == 0) {
            throw new NoSuchElementException("empty queue");
        }
        E value = (E) data[head];
        data[head] = null; // let GC reclaim the payload
        head = (head + 1) % data.length;
        size--;
        return value;
    }

    @SuppressWarnings("unchecked")
    public E peek() {
        if (size == 0) {
            throw new NoSuchElementException("empty queue");
        }
        return (E) data[head];
    }

    public int size() {
        return size;
    }

    public boolean isFull() {
        return size == data.length;
    }

    public static void main(String[] args) {
        CircularQueue<Integer> q = new CircularQueue<>(3);
        q.offer(10);
        q.offer(20);
        q.offer(30);
        System.out.println("full=" + q.isFull() + " offer(40)=" + q.offer(40));
        System.out.println("poll=" + q.poll()); // 10 leaves from the head
        System.out.println("offer(40)=" + q.offer(40)); // tail wraps to slot 0
        while (q.size() > 0) {
            System.out.print(q.poll() + " "); // 20 30 40
        }
    }
}
`,
    },
    {
      title: 'ArrayDeque built-in equivalent',
      description: 'Idiomatic Java: a growable ring buffer with the same wrap idea.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class RingDemo {
    public static void main(String[] args) {
        // ArrayDeque is a circular array that resizes instead of failing.
        Deque<Integer> q = new ArrayDeque<>(4);
        q.offerLast(10);
        q.offerLast(20);
        q.offerLast(30);
        System.out.println("poll=" + q.pollFirst()); // 10
        q.offerLast(40); // reuses the freed slot, like a ring
        System.out.println(q); // [20, 30, 40]
    }
}
`,
    },
  ],
  mistakes: [
    'Reading head == tail as always-empty: it also means full — keep an explicit size counter to tell them apart.',
    'Forgetting the modulo on advance: head and tail walk off the end of the array instead of wrapping to 0.',
    'Allowing usable capacity confusion: with a size counter all slots are usable; the waste-one-slot trick holds one fewer item than allocated.',
    'Not nulling dequeued slots: the array keeps referencing payloads and the garbage collector cannot free them.',
    'Resizing with a single arraycopy: a wrapped buffer occupies two segments — copy head→end then start→tail, in that order.',
    'Picking a ring for unbounded growth: fixed capacity is the contract — when the size is unknowable, use ArrayDeque or a linked queue.',
  ],
  vizId: 'circular-queue-ops',
  problemIds: ['number-of-recent-calls', 'implement-queue-using-stacks', 'implement-stack-using-queues'],
  javaBuiltIn: ['java.util.ArrayDeque'],
  related: ['queue-deque', 'circular-linked-list'],
};
