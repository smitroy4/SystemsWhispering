import type { Topic } from '../../types/content.ts';

/** Fast and slow pointers: cycle detection and middle-finding in one pass. */
export const fastSlowTopic: Topic = {
  slug: 'fast-slow-pointers',
  title: 'Fast & Slow Pointers',
  category: 'algorithms',
  order: 13,
  summary: 'Two cursors at different speeds: meeting means a cycle, and the slow one marks the middle. O(n) time, O(1) space.',
  level: 'intermediate',
  prerequisites: ['singly-linked-list'],
  sections: [
    {
      heading: 'The idea',
      body: 'Send two pointers down a linked structure: `slow` advances one step, `fast` advances two. On a straight road, fast hits the end; in a **cycle**, fast laps around and **must** land on slow — like two runners on a circular track.\n\nThe animation runs `0 → 1 → 2 → 3 → 4 → (back to 2)`: they meet at node 4 after four rounds.',
    },
    {
      heading: 'How it works',
      body: 'Loop while `fast != null && fast.next != null`: advance both; return true the moment they coincide. No meeting means no cycle.\n\n- **Time O(n)**, **space O(1)** — no visited set needed.\n- **Middle of a list**: when fast reaches the end, slow stands at the middle — same speeds, different question.\n- **Cycle start**: after meeting, reset one pointer to the head and walk both at speed 1; they meet at the entrance (Floyd’s proof in one line of algebra).',
    },
    {
      heading: 'Java notes',
      body: 'Guard the loop on `fast` **and** `fast.next` — checking only `fast != null` throws on odd-length lists. For `happy-number` style digit cycles, the "nodes" are computed values in a `Set` or via the same two-speed trick on the digit-square function.\n\n`fast.next.next` chains read clever but crash on short lists; the nested-null loop guard is the professional form.',
    },
  ],
  complexity: [
    { operation: 'Cycle detect / middle', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Cycle start (second phase)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Cycle detection from scratch',
      description: 'Floyd’s two-speed walk with null guards.',
      code: `class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
    }
}

public class CycleDetect {
    static boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        ListNode a = new ListNode(0);
        ListNode b = new ListNode(1);
        ListNode c = new ListNode(2);
        a.next = b;
        b.next = c;
        System.out.println(hasCycle(a)); // false: straight road
        c.next = b;
        System.out.println(hasCycle(a)); // true: 1 <-> 2 cycle
    }
}
`,
    },
    {
      title: 'Middle node built-in style',
      description: 'Same speeds answering a different question.',
      code: `public class MiddleNode {
    static ListNode middle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow; // second middle on even lengths
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);
        System.out.println(middle(head).val); // 3
    }
}
`,
    },
  ],
  mistakes: [
    'Guarding only `fast != null`: `fast.next.next` throws on odd lengths — require `fast.next != null` too.',
    'Comparing values instead of references: cycle detection needs `slow == fast` (identity), not `.equals`.',
    'Using a HashSet by default: correct but O(n) space — the two-speed trick exists to avoid it.',
    'Stopping at the first meeting for cycle start: reset to head and walk at equal speed to find the entrance.',
    'Off-by-one middle on even lists: define first-vs-second middle up front and test both.',
  ],
  vizId: 'fast-slow-steps',
  problemIds: ['linked-list-cycle', 'middle-of-the-linked-list', 'happy-number'],
};
