import type { Topic } from '../../types/content.ts';

/** Stacks: LIFO discipline, call stacks, and monotonic patterns. */
export const stackTopic: Topic = {
  slug: 'stack',
  title: 'Stacks',
  category: 'data-structures',
  order: 6,
  summary: 'Last-in, first-out: push and pop from one end. The shape of method calls, undo, brackets, and next-greater problems.',
  level: 'beginner',
  group: 'linear',
  prerequisites: ['dynamic-array'],
  sections: [
    {
      heading: 'One door in, one door out',
      body: 'A **stack** exposes a single end — the **top**. You `push` items on and `pop` them off in reverse order: **LIFO** (last in, first out). `peek` reads the top without removing it.\n\nEvery Java method call rides a stack: arguments and return addresses pile onto the **call stack**, and recursion is just the JVM pushing frames for you. `StackOverflowError` literally means this structure ran out of room.',
    },
    {
      heading: 'How stacks live in memory',
      body: 'A stack is an **adapter**, not a layout — it wraps an array or linked list and hides every operation except the top. The classic build is a plain array plus a `top` index starting at -1:\n\n- `push(x)`: `data[++top] = x` (grow the array if full, exactly like a dynamic array).\n- `pop()`: read `data[top]`, null the slot, `top--`.\n- All three core operations are `O(1)` worst case (amortized for push with growth).',
    },
    {
      heading: 'The patterns stacks unlock',
      body: 'Stacks remember "what was I doing before this" — that makes them the tool for nested structure:\n\n- **Balanced brackets**: push openers, pop on closers, mismatch means invalid.\n- **Undo / back buttons**: each action pushes the previous state.\n- **Monotonic stacks**: keep a decreasing stack to find the next greater element in `O(n)` — the canonical hard-looking-easy interview pattern.\n- **Min tracking**: a second parallel stack of running minimums gives `O(1)` getMin.',
    },
    {
      heading: 'ArrayDeque, not Stack, in practice',
      body: 'Java has a class literally named `Stack`, but it extends synchronized `Vector` and is effectively legacy. Modern code uses **`ArrayDeque` as a stack** via the `Deque` interface: `push`, `pop`, `peek` — same names, no synchronization overhead, backed by a fast circular array.\n\n- `Deque<Integer> st = new ArrayDeque<>()` is the idiomatic declaration.\n- Prefer `poll`/`peek` (null on empty) over `pop` (throws) when emptiness is routine, not exceptional.',
    },
  ],
  complexity: [
    { operation: 'Push', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Pop / peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'ArrayStack from scratch',
      description: 'Array plus top index — push, pop, peek with growth.',
      code: `import java.util.Arrays;
import java.util.EmptyStackException;

public class ArrayStack<E> {
    private Object[] data = new Object[4];
    private int top = -1;

    public void push(E value) {
        if (top + 1 == data.length) {
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[++top] = value;
    }

    @SuppressWarnings("unchecked")
    public E pop() {
        if (top < 0) {
            throw new EmptyStackException();
        }
        E value = (E) data[top];
        data[top--] = null;
        return value;
    }

    @SuppressWarnings("unchecked")
    public E peek() {
        if (top < 0) {
            throw new EmptyStackException();
        }
        return (E) data[top];
    }

    public boolean isEmpty() {
        return top < 0;
    }

    public static void main(String[] args) {
        ArrayStack<Integer> st = new ArrayStack<>();
        st.push(10);
        st.push(20);
        st.push(30);
        System.out.println("peek=" + st.peek());
        while (!st.isEmpty()) {
            System.out.println("pop=" + st.pop());
        }
    }
}
`,
    },
    {
      title: 'ArrayDeque built-in equivalent',
      description: 'Idiomatic Java: Deque used as a stack, plus bracket matching.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class StackDemo {
    static boolean balanced(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '(', case '[', case '{' -> st.push(c);
                case ')' -> { if (st.isEmpty() || st.pop() != '(') return false; }
                case ']' -> { if (st.isEmpty() || st.pop() != '[') return false; }
                case '}' -> { if (st.isEmpty() || st.pop() != '{') return false; }
                default -> { }
            }
        }
        return st.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(balanced("{[()]}"));
        System.out.println(balanced("{[(])}"));
    }
}
`,
    },
  ],
  mistakes: [
    'Using legacy Stack: it is synchronized Vector-based — prefer ArrayDeque for single-threaded code.',
    'Popping an empty stack: pop() throws — guard with isEmpty() or use pollFirst() when emptiness is expected.',
    'Forgetting stacks reverse order: printing by popping gives reversed output; copy or iterate if order matters.',
    'Recursion without a base case: each call pushes a frame until StackOverflowError — the stack made visible.',
    'Storing minimums wrong in Min Stack: push the running min every time (or pairs), not only new records, so pops stay correct.',
    'Using a stack where a queue belongs: BFS with a stack silently becomes DFS — match the discipline to the traversal.',
  ],
  vizId: 'stack-push-pop',
  problemIds: ['valid-parentheses', 'min-stack', 'design-browser-history'],
};
