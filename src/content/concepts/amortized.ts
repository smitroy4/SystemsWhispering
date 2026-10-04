import type { Topic } from '../../types/content.ts';

/** Amortized analysis: why occasionally-expensive operations are cheap on average. */
export const amortizedTopic: Topic = {
  slug: 'amortized-analysis',
  title: 'Amortized Analysis',
  category: 'concepts',
  order: 2,
  summary: 'One expensive operation among many cheap ones: averaged cost over a sequence, the ArrayList/HashMap resizing argument.',
  level: 'intermediate',
  prerequisites: ['big-o-notation', 'dynamic-array'],
  sections: [
    {
      heading: 'Worst case lies about sequences',
      body: 'Appending to an `ArrayList` is `O(n)` in the worst case (a resize copies everything). Yet in practice appends feel constant — because that expensive copy happens **rarely**, and each one buys a long stretch of cheap appends. **Amortized analysis** averages cost over a whole sequence of operations instead of judging one in isolation.',
    },
    {
      heading: 'The doubling argument',
      body: 'Start empty, capacity 1, doubling on resize. Appending `n` items triggers resizes at sizes 1, 2, 4, …, copying `1 + 2 + 4 + … + n = 2n − 1` elements total. Add the `n` cheap writes: under `3n` work for `n` appends — **O(1) amortized** each.\n\nThe key: each resize doubles capacity, so the *next* resize is twice as far away. Growing by a constant (+100) instead would re-copy every 100 appends and stay O(n) amortized.',
    },
    {
      heading: 'Where amortization appears',
      body: 'Hash table resizes, `StringBuilder` growth, splay-tree operations, and the two-stack queue (each element moves between stacks at most once per enqueue–dequeue cycle) all lean on the same idea. The accounting method makes it formal: charge each cheap operation a little extra "credit" that pays for the rare expensive one.',
    },
  ],
  complexity: [
    { operation: 'ArrayList append (doubling)', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'ArrayList append (+k growth)', best: 'O(1)', average: 'O(n) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Two-stack queue op', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Counting resize work',
      description: 'Measure total copies across n appends to see amortization.',
      code: `public class AmortizedDemo {
    int[] data = new int[1];
    int size = 0;
    long copies = 0;

    void add(int x) {
        if (size == data.length) {
            int[] bigger = new int[data.length * 2];
            for (int i = 0; i < size; i++) {
                bigger[i] = data[i];
                copies++;
            }
            data = bigger;
        }
        data[size++] = x;
    }

    public static void main(String[] args) {
        AmortizedDemo demo = new AmortizedDemo();
        for (int i = 0; i < 1000; i++) {
            demo.add(i);
        }
        System.out.println("appends=1000 copies=" + demo.copies);
        System.out.println("copies per append=" + (demo.copies / 1000.0));
    }
}
`,
    },
    {
      title: 'Amortized queue with two stacks',
      description: 'Each element shifts stacks at most once per cycle.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

public class TwoStackQueue<E> {
    private final Deque<E> inbox = new ArrayDeque<>();
    private final Deque<E> outbox = new ArrayDeque<>();

    public void offer(E x) {
        inbox.push(x);
    }

    public E poll() {
        if (outbox.isEmpty()) {
            while (!inbox.isEmpty()) {
                outbox.push(inbox.pop()); // each element moves once
            }
        }
        if (outbox.isEmpty()) {
            throw new NoSuchElementException();
        }
        return outbox.pop();
    }

    public static void main(String[] args) {
        TwoStackQueue<Integer> q = new TwoStackQueue<>();
        q.offer(1);
        q.offer(2);
        System.out.println(q.poll()); // 1
        q.offer(3);
        System.out.println(q.poll()); // 2
        System.out.println(q.poll()); // 3
    }
}
`,
    },
  ],
  mistakes: [
    'Quoting worst case for resizable structures: append is O(1) amortized — say "amortized" out loud.',
    'Growing by constants: +k capacity keeps appends O(n) amortized; doubling is what makes it O(1).',
    'Forgetting the break-even math: each doubling must be *used* — pre-sizing huge lists wastes real memory.',
    'Applying amortization to single operations: it describes sequences, never one call in isolation.',
    'Ignoring the two-stack queue pattern: it is the canonical interview amortized structure — know the once-per-element argument.',
  ],
  problemIds: ['implement-queue-using-stacks', 'design-hashmap'],
};
