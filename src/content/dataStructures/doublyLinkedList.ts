import type { Topic } from '../../types/content.ts';

/** Doubly linked lists: prev links, tail pointers, and O(1) both ends. */
export const doublyLinkedListTopic: Topic = {
  slug: 'doubly-linked-list',
  title: 'Doubly Linked Lists',
  category: 'data-structures',
  order: 5,
  summary: 'Nodes with next and prev links plus a tail pointer: delete any known node in O(1) and walk both directions.',
  level: 'intermediate',
  group: 'linear',
  prerequisites: ['singly-linked-list'],
  sections: [
    {
      heading: 'Links in both directions',
      body: 'A **doubly linked** node carries two references: `next` and `prev`. The list tracks both a **head** and a **tail**, so you can walk forward or backward and insert or delete at either end in `O(1)`.\n\nThe superpower over singly linked lists: given a node, you can delete it **without knowing its predecessor** — `node.prev.next = node.next` does the bypass directly.',
    },
    {
      heading: 'How nodes live in memory',
      body: 'Each node now holds two references instead of one, so per-element overhead grows (object header + value + 2 references). The list object itself is tiny: head, tail, and size.\n\nMany implementations use a **sentinel** (dummy) node whose next/prev point at head/tail. Sentinels erase every empty-list special case — at the cost of one extra node — which is why `java.util.LinkedList` historically used them.',
    },
    {
      heading: 'Splicing needs four pointer writes',
      body: 'Inserting 25 between 20 and 30 rewires four links, and order matters — set the **new node\'s** pointers first, then swing the neighbours:\n\n- `node25.next = node30` and `node25.prev = node20`.\n- `node20.next = node25` and `node30.prev = node25`.\n\nDeleting is symmetric: `node.prev.next = node.next` and `node.next.prev = node.prev`. The animation shows each write lighting up.',
    },
    {
      heading: 'Where doubly linked lists win',
      body: 'Two-way links power browser history (back/forward), undo stacks with redo, LRU caches (with a hash map pointing at nodes), and `Deque` implementations.\n\nIn Java, `LinkedList` implements `Deque`, but `ArrayDeque` — a resizable circular array — beats it on memory and cache for most queue work. Reach for linked nodes when you must **splice the middle in O(1)** with an iterator, or share structure between versions.',
    },
  ],
  complexity: [
    { operation: 'Access by index', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Insert / delete at either end', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Delete a known node', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'DoublyLinkedList from scratch',
      description: 'Prev/next nodes, head + tail, and O(1) end operations.',
      code: `public class DoublyLinkedList<E> {
    private static class Node<E> {
        E value;
        Node<E> prev;
        Node<E> next;

        Node(E value) {
            this.value = value;
        }
    }

    private Node<E> head;
    private Node<E> tail;
    private int size;

    public void addLast(E value) {
        Node<E> node = new Node<>(value);
        if (tail == null) {
            head = tail = node;
        } else {
            node.prev = tail;
            tail.next = node;
            tail = node;
        }
        size++;
    }

    public E remove(Node<E> node) {
        if (node.prev == null) {
            head = node.next;
        } else {
            node.prev.next = node.next;
        }
        if (node.next == null) {
            tail = node.prev;
        } else {
            node.next.prev = node.prev;
        }
        size--;
        return node.value;
    }

    public int size() {
        return size;
    }

    public static void main(String[] args) {
        DoublyLinkedList<Integer> list = new DoublyLinkedList<>();
        list.addLast(10);
        list.addLast(20);
        list.addLast(30);
        System.out.println(list.remove(list.head.next) + " size=" + list.size());
    }
}
`,
    },
    {
      title: 'LinkedList as a Deque',
      description: 'Built-in equivalent: two-ended operations via the Deque interface.',
      code: `import java.util.Deque;
import java.util.LinkedList;

public class BrowserHistory {
    private final Deque<String> back = new LinkedList<>();
    private final Deque<String> forward = new LinkedList<>();
    private String current = "home";

    void visit(String url) {
        back.addLast(current);
        forward.clear();
        current = url;
    }

    void goBack() {
        if (!back.isEmpty()) {
            forward.addLast(current);
            current = back.removeLast();
        }
    }

    public static void main(String[] args) {
        BrowserHistory h = new BrowserHistory();
        h.visit("docs");
        h.visit("api");
        h.goBack();
        System.out.println(h.current);
    }
}
`,
    },
  ],
  mistakes: [
    'Updating only one direction: every splice must fix both next and prev, or backward walks silently break.',
    'Rewiring neighbours before the new node: set the new node’s own pointers first so nothing becomes unreachable.',
    'Forgetting head/tail edge cases: inserting into or deleting the last node of an empty/singleton list needs explicit handling.',
    'Stale references after removal: clear node.prev/node.next so the GC can reclaim detached chains.',
    'Using indexed get/add in loops: LinkedList.get(i) walks from the nearer end — still O(n) per call.',
    'Choosing LinkedList over ArrayDeque for queues: the array version wins on memory, cache, and constants.',
  ],
  vizId: 'dll-ops',
  problemIds: ['design-linked-list', 'design-browser-history'],
};
