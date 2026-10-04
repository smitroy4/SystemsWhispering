import type { Topic } from '../../types/content.ts';

/** Singly linked lists: nodes, references, and O(1) ends. */
export const singlyLinkedListTopic: Topic = {
  slug: 'singly-linked-list',
  title: 'Singly Linked Lists',
  category: 'data-structures',
  order: 4,
  summary: 'Chains of node objects linked by references: O(1) inserts at the ends, O(n) everything that needs an index.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'Nodes instead of slots',
      body: 'A **linked list** stores each element in a separate **node** object holding the value plus a `next` reference to the following node. The list itself only remembers the **head** (first node); the chain ends where `next` is `null`.\n\nUnlike arrays, nodes can scatter anywhere in memory — there is no index arithmetic. To reach element `i` you walk `i` references from the head, which is why indexed access costs `O(n)`.',
    },
    {
      heading: 'How nodes live in memory',
      body: 'Each node is an independent heap object: roughly 12 bytes of object header plus the value and one 4–8 byte reference. A list of `n` integers therefore uses far more memory than an `int[n]` — locality is poor and the garbage collector has `n` objects to track.\n\nWhat you buy with that overhead: **structural sharing**. Inserting at the front only allocates one node and repoints head — no shifting, no copying, `O(1)` worst case.',
    },
    {
      heading: 'The two-pointer dance',
      body: 'Splicing the middle needs the node **before** the target: walk a `prev`/`curr` pair until `curr` is where the new node belongs, then rewire `prev.next → newNode → curr`. Deleting is the same dance minus allocation: `prev.next = curr.next` and let the GC reclaim `curr`.\n\nThe animation below shows both: inserting 25 after 20, then unlinking 20.',
    },
    {
      heading: 'java.util.LinkedList in practice',
      body: 'Java ships `LinkedList` (actually doubly linked) with `Deque` operations: `addFirst`, `addLast`, `pollFirst`, `peekLast`. It shines as a **queue or deque**, not as a random-access list — `get(i)` still walks from the nearer end.\n\n- Prefer `ArrayList` for index-heavy work; it wins on cache and memory.\n- Use `LinkedList` when you add/remove mostly at the ends and iterate sequentially.\n- Program to `Deque`/`Queue` interfaces so you can swap in `ArrayDeque` later.',
    },
  ],
  complexity: [
    { operation: 'Access by index', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Insert / delete at head', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Insert / delete at tail (no tail ref)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'SinglyLinkedList from scratch',
      description: 'Node class, head pointer, and O(1) head operations.',
      code: `public class SinglyLinkedList<E> {
    private static class Node<E> {
        E value;
        Node<E> next;

        Node(E value, Node<E> next) {
            this.value = value;
            this.next = next;
        }
    }

    private Node<E> head;
    private int size;

    public void addFirst(E value) {
        head = new Node<>(value, head);
        size++;
    }

    public E removeFirst() {
        if (head == null) {
            throw new IllegalStateException("empty list");
        }
        E value = head.value;
        head = head.next;
        size--;
        return value;
    }

    public E get(int index) {
        Node<E> curr = head;
        for (int i = 0; i < index; i++) {
            if (curr == null) {
                throw new IndexOutOfBoundsException(index);
            }
            curr = curr.next;
        }
        if (curr == null) {
            throw new IndexOutOfBoundsException(index);
        }
        return curr.value;
    }

    public int size() {
        return size;
    }

    public static void main(String[] args) {
        SinglyLinkedList<Integer> list = new SinglyLinkedList<>();
        list.addFirst(30);
        list.addFirst(20);
        list.addFirst(10);
        System.out.println(list.get(1) + " size=" + list.size());
        System.out.println("removed " + list.removeFirst());
    }
}
`,
    },
    {
      title: 'LinkedList built-in equivalent',
      description: 'Idiomatic Java: LinkedList used as a Deque.',
      code: `import java.util.Deque;
import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        Deque<String> train = new LinkedList<>();
        train.addLast("engine");
        train.addLast("wagon-a");
        train.addFirst("cowcatcher");

        System.out.println(train);
        System.out.println("first=" + train.peekFirst());
        System.out.println("left=" + train.pollFirst());
        System.out.println(train);
    }
}
`,
    },
  ],
  mistakes: [
    'Losing the rest of the list: always link the new node to its successor before overwriting prev.next.',
    'Forgetting the empty-list case: addFirst/removeFirst must handle head == null explicitly.',
    'Using get(i) in a loop: each call walks from the head, turning a traversal into O(n²) — use an Iterator or for-each.',
    'Comparing node values with == instead of equals (or Objects.equals for null-safety).',
    'Creating cycles by accident: node.next pointing backwards makes traversals loop forever — draw the rewiring first.',
    'Assuming LinkedList.get is fast: it is O(n); index-heavy code belongs on an ArrayList.',
  ],
  vizId: 'sll-ops',
  problemIds: ['reverse-linked-list', 'merge-two-sorted-lists', 'linked-list-cycle'],
};
