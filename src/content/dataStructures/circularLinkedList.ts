import type { Topic } from '../../types/content.ts';

/** Circular Linked List: the ring that never ends — and how to stop anyway. */
export const circularLinkedListTopic: Topic = {
  slug: 'circular-linked-list',
  title: 'Circular Linked List',
  category: 'data-structures',
  order: 20,
  summary: 'A linked list whose tail points back to the head — round-robin turns and ring buffers start here.',
  level: 'beginner',
  group: 'linear',
  status: 'complete',
  prerequisites: ['singly-linked-list'],
  sections: [
    {
      heading: 'What makes it circular?',
      body: 'A **circular linked list** is a singly linked list with one change: the last node points back to the **head** instead of `null`. There is no end — following `next` from any node visits every node, forever.\n\nTwo flavours exist. A **singly circular** list links each node to its successor, with the tail closing the ring. A **doubly circular** list closes both directions (this is exactly how `java.util.LinkedList` thinks, though it keeps a `null`-terminated view). This topic covers the singly circular form; the doubly form behaves like a Doubly Linked List bent into a ring.',
    },
    {
      heading: 'How it lives in memory',
      body: 'Nodes are the same heap-scattered objects as a singly linked list — value plus one `next` reference each. The only structural difference is a single pointer: `tail.next` holds the head address instead of `null`.\n\n- An **empty** ring is still `head == null`. There is no way to tell empty from non-empty by following pointers, so every operation checks `head` first.\n- A **single-node** ring points to itself (`node.next == node`). Constructors and edge cases must handle this or deletes corrupt the ring.\n- Memory cost is identical to a singly linked list: `O(n)` references, no array slack, no capacity to manage.',
    },
    {
      heading: 'Termination: the do-while discipline',
      body: 'Without `null` there is no natural stop, so traversal must count or compare. The three safe patterns:\n\n- **do-while**: `do { visit(curr); curr = curr.next; } while (curr != head)` — visits every node exactly once, and handles the one-node ring correctly (a plain `while` skips it).\n- **Count k steps**: rotate or deal exactly `k` turns, e.g. `for (i in 0..<k) curr = curr.next`.\n- **Tortoise and hare**: Floyd cycle detection *assumes* possible circularity — which is why `linked-list-cycle` is this topic’s signature drill.\n\nInsertion and deletion splice exactly like a singly list (`O(1)` once located); only the *locating walk* needs the ring-aware stop condition.',
    },
    {
      heading: 'Rotate: the operation rings are for',
      body: '`rotate()` — advance `head` to `head.next` — is `O(1)` and is the whole point: each rotation hands the turn to the next participant. Round-robin schedulers rotate processes, multiplayer games rotate turns, and the Josephus problem deletes every k-th node while rotating.\n\nKeeping a **`tail` pointer** (where `tail.next` is the head) makes append `O(1)` without a head pointer at all: insert after `tail`, then advance `tail`. Many implementations store only `tail` for this reason.',
    },
    {
      heading: 'Real-world use',
      body: 'Round-robin CPU schedulers cycle processes through equal time slices. Token-ring networks pass a permission token around the loop. Music and video players loop playlists. OS alarm lists and timer wheels reuse ring slots instead of allocating. Undo histories with a fixed budget overwrite the oldest entry ring-style.\n\nReach for a ring when turns repeat forever and the participant count changes; reach for a plain array ring (see Circular Queue) when the capacity is fixed and cache locality matters.',
    },
  ],
  complexity: [
    { operation: 'Access / search by value', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Insert / delete (position known)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Insert / delete (by value)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Rotate (advance head)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Full traversal', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'CircularLinkedList from scratch',
      description: 'Tail-pointer ring: O(1) append and rotate, do-while traversal.',
      code: `import java.util.NoSuchElementException;

public class CircularLinkedList<E> {
    private static class Node<E> {
        E value;
        Node<E> next;
        Node(E value) { this.value = value; }
    }

    private Node<E> tail; // tail.next is the head; null when empty
    private int size;

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    /** O(1): insert after tail, then it becomes the new tail. */
    public void add(E value) {
        Node<E> node = new Node<>(value);
        if (tail == null) {
            node.next = node; // single-node ring points to itself
            tail = node;
        } else {
            node.next = tail.next;
            tail.next = node;
            tail = node;
        }
        size++;
    }

    /** O(1): hand the turn to the next node. */
    public void rotate() {
        if (tail != null) {
            tail = tail.next;
        }
    }

    public E head() {
        if (tail == null) {
            throw new NoSuchElementException("empty ring");
        }
        return tail.next.value;
    }

    /** O(n): remove first occurrence; keeps the ring closed. */
    public boolean remove(E value) {
        if (tail == null) {
            return false;
        }
        Node<E> prev = tail;
        Node<E> curr = tail.next;
        for (int i = 0; i < size; i++) {
            if (curr.value.equals(value)) {
                if (curr == tail) {
                    tail = (size == 1) ? null : prev;
                }
                prev.next = curr.next;
                size--;
                return true;
            }
            prev = curr;
            curr = curr.next;
        }
        return false;
    }

    @Override
    public String toString() {
        if (tail == null) {
            return "[]";
        }
        StringBuilder sb = new StringBuilder("[");
        Node<E> curr = tail.next; // the head
        do {
            sb.append(curr.value).append(" -> ");
            curr = curr.next;
        } while (curr != tail.next);
        return sb.append("(head)").toString();
    }

    public static void main(String[] args) {
        CircularLinkedList<String> turns = new CircularLinkedList<>();
        turns.add("Asha");
        turns.add("Ben");
        turns.add("Cleo");
        System.out.println(turns);
        turns.rotate();
        System.out.println("After rotate, head=" + turns.head());
        turns.remove("Ben");
        System.out.println(turns);
    }
}
`,
    },
    {
      title: 'Round-robin turns with a ring',
      description: 'Deal turns forever: rotate, serve, repeat — no index math.',
      code: `public class RoundRobin {
    public static void main(String[] args) {
        CircularLinkedList<String> players = new CircularLinkedList<>();
        players.add("Asha");
        players.add("Ben");
        players.add("Cleo");

        // Six turns for three players: the ring never runs out.
        for (int turn = 1; turn <= 6; turn++) {
            System.out.println("Turn " + turn + ": " + players.head());
            players.rotate();
        }
    }
}
`,
    },
  ],
  mistakes: [
    'Looping with while (curr != null): a ring has no null — use do-while against head or count exactly size steps.',
    'Using a plain while (curr != head): skips the single-node ring entirely, since head.next == head on entry.',
    'Forgetting the self-loop: a one-node ring must point to itself, or add() builds a null-terminated list by accident.',
    'Deleting the tail without moving the tail pointer: tail dangles at a removed node — reassign tail to prev (or null when empty).',
    'Rotating k times without k % size: full laps waste time and hide off-by-one errors in Josephus-style deletes.',
    'Treating the ring as a queue: rings re-serve members forever — if each item must leave exactly once, use a Queue instead.',
  ],
  vizId: 'circular-list-ops',
  problemIds: ['linked-list-cycle', 'middle-of-the-linked-list', 'design-linked-list'],
  related: ['singly-linked-list', 'circular-queue'],
};
