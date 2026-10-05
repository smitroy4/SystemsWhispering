import type { Topic } from '../../types/content.ts';

/** Queues and deques: FIFO fairness and two-ended access. */
export const queueDequeTopic: Topic = {
  slug: 'queue-deque',
  title: 'Queues & Deques',
  category: 'data-structures',
  order: 7,
  summary: 'First-in, first-out fairness plus double-ended flexibility: the shape of BFS, task scheduling, and sliding windows.',
  level: 'beginner',
  group: 'linear',
  prerequisites: ['stack'],
  sections: [
    {
      heading: 'Waiting in line, fairly',
      body: 'A **queue** serves in arrival order: **FIFO** (first in, first out). You `offer` (enqueue) at the rear and `poll` (dequeue) from the front — like a supermarket line, nobody cuts.\n\nA **deque** (double-ended queue, pronounced "deck") opens both ends: `addFirst`, `addLast`, `removeFirst`, `removeLast`. Every stack and every queue is a restricted deque, which is why Java models all three through the `Deque` interface.',
    },
    {
      heading: 'How queues live in memory',
      body: 'Two classic builds, both `O(1)` per operation:\n\n- **Circular buffer**: a fixed array with `head`/`tail` indices that wrap around with modulo arithmetic. Full vs empty is disambiguated by tracking size (or sacrificing one slot). `ArrayDeque` works this way and grows by doubling.\n- **Linked nodes**: head/tail references with `O(1)` splice at both ends, at the cost of per-node objects.\n\nThe circular buffer wins on cache and memory; nodes win when capacity must be unbounded without copies.',
    },
    {
      heading: 'Where queues run the show',
      body: 'Queues serialize work that must stay fair and ordered:\n\n- **Breadth-first search** visits graph layers with a queue — swap in a stack and you silently get DFS instead.\n- **Schedulers and printers** drain FIFO work lists; **rate limiters** (like Recent Calls) evict timestamps older than the window.\n- **Sliding window maximum** keeps a decreasing deque of candidates so each window’s max is always at the front — `O(n)` overall.',
    },
    {
      heading: 'ArrayDeque in practice',
      body: 'Declare `Deque<Task> line = new ArrayDeque<>()`. Queue end: `offer`/`poll`/`peek` (null-safe) vs `add`/`remove`/`element` (throwing). Deque ends: `offerFirst`, `offerLast`, `pollFirst`, `pollLast`.\n\n- `ArrayDeque` forbids `null` elements — a deliberate design choice so `null` from `poll` unambiguously means empty.\n- Need thread safety? Use `ConcurrentLinkedQueue` or `LinkedBlockingQueue`, never the legacy synchronized `Vector`/`Stack`.',
    },
  ],
  complexity: [
    { operation: 'Enqueue / dequeue', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Deque add/remove either end', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Peek front / rear', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Circular ArrayQueue from scratch',
      description: 'Head/tail indices wrapping around a fixed buffer.',
      code: `import java.util.NoSuchElementException;

public class ArrayQueue<E> {
    private final Object[] data;
    private int head = 0;
    private int size = 0;

    public ArrayQueue(int capacity) {
        data = new Object[capacity];
    }

    public void offer(E value) {
        if (size == data.length) {
            throw new IllegalStateException("queue full");
        }
        data[(head + size) % data.length] = value;
        size++;
    }

    @SuppressWarnings("unchecked")
    public E poll() {
        if (size == 0) {
            throw new NoSuchElementException("queue empty");
        }
        E value = (E) data[head];
        data[head] = null;
        head = (head + 1) % data.length;
        size--;
        return value;
    }

    public int size() {
        return size;
    }

    public static void main(String[] args) {
        ArrayQueue<String> q = new ArrayQueue<>(3);
        q.offer("a");
        q.offer("b");
        q.offer("c");
        System.out.println(q.poll() + " size=" + q.size());
        q.offer("d"); // wraps into the freed slot
        while (q.size() > 0) {
            System.out.println(q.poll());
        }
    }
}
`,
    },
    {
      title: 'ArrayDeque built-in equivalent',
      description: 'Idiomatic Java: one class serving as queue and deque.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<String> printer = new ArrayDeque<>();
        printer.offer("doc-1");
        printer.offer("doc-2");
        System.out.println("printing " + printer.poll());

        Deque<Integer> deck = new ArrayDeque<>();
        deck.offerLast(20);
        deck.offerFirst(10);
        deck.offerLast(30);
        System.out.println(deck);
        System.out.println("first=" + deck.pollFirst());
        System.out.println("last=" + deck.pollLast());
    }
}
`,
    },
  ],
  mistakes: [
    'Using a stack for BFS: layers need FIFO — a stack explores depth-first and gives wrong level order.',
    'add/remove vs offer/poll confusion: the first pair throws on failure, the second returns null/false — pick deliberately.',
    'Inserting null into ArrayDeque: it throws NullPointerException by design; use a sentinel value instead.',
    'Forgetting modulo on wrap: head = (head + 1) % capacity, or the buffer walks off its own end.',
    'Full/empty ambiguity in circular buffers: track size explicitly or one state becomes unrepresentable.',
    'Reaching for LinkedList out of habit: ArrayDeque is faster for queue/deque work — benchmark before assuming nodes win.',
  ],
  vizId: 'queue-deque-ops',
  problemIds: ['implement-queue-using-stacks', 'number-of-recent-calls'],
};
