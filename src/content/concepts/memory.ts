import type { Topic } from '../../types/content.ts';

/** Stack vs heap memory in Java: what lives where, and who cleans up. */
export const memoryTopic: Topic = {
  slug: 'memory-stack-vs-heap',
  title: 'Memory: Stack vs Heap',
  category: 'concepts',
  order: 4,
  summary: 'Primitives and references live on the stack; objects live on the heap. References connect them, the GC reclaims them.',
  level: 'beginner',
  prerequisites: [],
  sections: [
    {
      heading: 'Two neighborhoods',
      body: 'The **stack** holds method frames: primitives (`int x = 5` stores the 5 itself) and **references** (variables pointing at objects). The **heap** holds the objects themselves: arrays, `ArrayList`s, nodes — everything created with `new`.\n\n`int[] a = new int[4]` therefore lives in *both* places: 4 bytes of reference on the stack, 16+ bytes of ints on the heap.',
    },
    {
      heading: 'References, not boxes',
      body: 'Java object variables are **remote controls**, never boxes. `Node p = head` copies the *address*, so `p.next = x` mutates the shared heap object. `==` compares addresses (same object?), `.equals()` compares contents — confusing them is the most common Java bug after off-by-one.\n\n`null` is a remote with no TV: dereferencing it throws `NullPointerException`. `Optional` and early null-checks exist to make absence explicit.',
    },
    {
      heading: 'Who cleans up',
      body: 'Stack frames vanish when methods return — locals die for free. Heap objects die when **unreachable**: the **garbage collector** traces from roots (stacks, statics) and reclaims the rest.\n\nLeaks in Java are *unintentional retention*: static collections, forgotten listeners, and remnant references (like a `pop()` that never nulls its slot) keep objects reachable forever. `try`-with-resources closes files/sockets deterministically; memory itself needs no manual free.',
    },
  ],
  complexity: [
    { operation: 'Stack push / pop (frame)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Heap allocation (new)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'GC minor collection', best: 'O(live)', average: 'O(live)', worst: 'O(heap)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'References share objects',
      description: 'Two remotes, one heap object.',
      code: `import java.util.ArrayList;
import java.util.List;

public class SharedRefs {
    public static void main(String[] args) {
        List<String> a = new ArrayList<>();
        a.add("x");
        List<String> b = a; // copies the reference, not the list
        b.add("y");
        System.out.println(a); // [x, y]: shared heap object
        System.out.println(a == b); // true: same address

        List<String> c = new ArrayList<>(a); // real copy
        c.add("z");
        System.out.println(a); // [x, y]: untouched
        System.out.println(a.equals(c)); // false: contents differ
    }
}
`,
    },
    {
      title: 'Nulling slots avoids leaks',
      description: 'The stack-pop pattern every array structure needs.',
      code: `import java.util.Arrays;

public class LeakyStack {
    private String[] data = new String[4];
    private int size = 0;

    void push(String s) {
        data[size++] = s;
    }

    String pop() {
        String s = data[--size];
        data[size] = null; // without this, popped strings stay reachable
        return s;
    }

    public static void main(String[] args) {
        LeakyStack st = new LeakyStack();
        st.push(new String("hello"));
        System.out.println(st.pop());
        System.out.println(Arrays.toString(st.data)); // [null, null, null, null]
    }
}
`,
    },
  ],
  mistakes: [
    'Treating object variables as boxes: assignment copies references — mutation is shared, unexpectedly.',
    'Comparing objects with ==: use .equals() for contents; == only asks "same object?".',
    'Dereferencing maybe-null: validate inputs and prefer Optional returns over nulls.',
    'Static collections as caches: they pin everything forever — bound them or use WeakHashMap.',
    'Forgetting to null popped slots: "removed" elements stay reachable and leak.',
  ],
  problemIds: ['reverse-linked-list', 'copy-list-with-random-pointer'],
};
