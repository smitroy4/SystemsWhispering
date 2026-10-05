import type { Topic } from '../../types/content.ts';

/** Vector & Stack (legacy): synchronized history — read, recognise, replace. */
export const vectorStackLegacyTopic: Topic = {
  slug: 'vector-stack-legacy',
  title: 'Vector & Stack (Legacy)',
  category: 'data-structures',
  order: 39,
  summary: 'Synchronized relics of Java 1.0: what Vector and Stack do, and why ArrayList and ArrayDeque replaced them.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['dynamic-array'],
  choiceBox: {
    choose: [
      'Maintaining Java 1.0/1.1-era code that already uses them — understand before migrating.',
      'Answering “Vector vs ArrayList” or “why not Stack” in interviews.',
      'Never for new code — the replacements below win on every axis.',
    ],
    avoid: [
      'New development: `ArrayList` replaces `Vector`, `ArrayDeque` replaces `Stack`.',
      '“Thread safety via Vector”: per-method sync is not compound-safe — iteration still races.',
      'Subclassing `Vector` for Stack-like behavior (what `Stack` itself does) — prefer composition with `ArrayDeque`.',
    ],
  },
  sections: [
    {
      heading: 'What they are',
      body: '`Vector<E>` (Java 1.0) is a growable array like `ArrayList`, except **every method is `synchronized`** and it grows by doubling (or a `capacityIncrement`). `Stack<E>` extends `Vector` and adds `push`, `pop`, `peek`, `empty`, `search` — inheritance, not composition, exposing all of `Vector`’s indexed methods on a supposed stack.\n\nBoth predate the Collections Framework and were retrofitted (`Vector` implements `List`). They work, they are tested, and they are slow-by-default: uncontended synchronization cost plus no modern API (`removeIf`, streams-friendly bulk ops came late or never).',
    },
    {
      heading: 'Why synchronized-everything fails',
      body: 'Per-method `synchronized` makes single calls atomic — and almost nothing else. `if (!v.isEmpty()) v.pop()` still races between the check and the act; iteration needs external `synchronized (v)` blocks anyway. So you pay lock overhead on every access *and* still write your own locking for anything real.\n\n- `Stack` inherits `insertElementAt`, `remove(int)` — any caller can violate LIFO from anywhere.\n- `Vector.elements()` returns an `Enumeration` without fail-fast behavior: concurrent changes go undetected instead of loud.\n- Modern replacements: unsynchronized classes plus explicit locks, or `java.util.concurrent` collections designed for the job.',
    },
    {
      heading: 'The migration table',
      body: 'Mechanical replacements that preserve behavior and drop the baggage:\n\n| Legacy | Modern | Notes |\n| --- | --- | --- |\n| `Vector` | `ArrayList` | same API minus sync; pre-size like-for-like |\n| `Stack` | `ArrayDeque` | `push`/`pop`/`peek` exist on `Deque` too |\n| `Hashtable` | `HashMap` | plus null-key support; concurrent → `ConcurrentHashMap` |\n| `Enumeration` | `Iterator` / for-each | `remove()` support, fail-fast checks |\n\n`Collections.synchronizedList(new ArrayList<>())` exists for drop-in sync wrappers, but read its topic before trusting it: iteration still needs manual locking.',
    },
    {
      heading: 'Recognising them in the wild',
      body: 'Telltale signs: `new Vector()`, `instanceof Stack`, `Enumeration` loops, `capacity()`/`capacityIncrement` tuning, `addElement`/`elementAt` method names. Migration strategy: swap the constructor, run the tests, then delete the now-unneeded `synchronized` blocks around single calls — and audit every check-then-act sequence regardless of container.',
    },
  ],
  complexity: [
    { operation: 'Vector get / set', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Vector add (sync + doubling)', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Stack push / pop / peek', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Iteration (n elements)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Legacy in the wild, modern beside it',
      description: 'Same program, both eras — then the one-line migration.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.Stack;
import java.util.Vector;

public class LegacyVsModern {
    public static void main(String[] args) {
        // Legacy: works, synchronized per call, LIFO violable via Vector API.
        Stack<String> legacy = new Stack<>();
        legacy.push("a");
        legacy.push("b");
        legacy.insertElementAt("sneaky", 0); // not a stack operation!
        System.out.println("legacy pop=" + legacy.pop());

        // Modern: same LIFO vocabulary, no sync tax, no backdoors.
        Deque<String> modern = new ArrayDeque<>();
        modern.push("a");
        modern.push("b");
        System.out.println("modern pop=" + modern.pop());

        Vector<String> v = new Vector<>(List.of("x", "y"));
        System.out.println("vector=" + v);
    }
}
`,
    },
    {
      title: 'Why sync-everything still races',
      description: 'Check-then-act defeats per-method synchronization.',
      code: `import java.util.Stack;

public class LegacyRace {
    /** Supposed to pop safely — but isEmpty() and pop() are separate locks. */
    static String tryPop(Stack<String> stack) {
        if (!stack.isEmpty()) {
            return stack.pop(); // another thread may empty it first
        }
        return null;
    }

    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        stack.push("only");
        // Two threads racing tryPop: one can pop, the other hits EmptyStackException.
        System.out.println(tryPop(stack));
    }
}
`,
    },
  ],
  mistakes: [
    'Believing Vector is “thread-safe”: single calls are atomic — sequences like check-then-act still race.',
    'Using Stack in new code: it exposes Vector’s indexed backdoors — ArrayDeque keeps LIFO honest.',
    'Iterating a Vector without sync: per-method locks don’t cover loops — wrap iteration in synchronized (v) or copy first.',
    'Trusting Enumeration for change detection: it is not fail-fast — concurrent edits go silently wrong.',
    'Tuning capacityIncrement instead of migrating: growth policy is not the problem — the design era is.',
    'Wrapping ArrayList in synchronizedList and calling it done: same compound-operation holes — see Synchronized Wrappers.',
  ],
  vizId: 'dynamic-array-growth',
  problemIds: ['min-stack', 'evaluate-reverse-polish-notation', 'implement-stack-using-queues'],
  javaBuiltIn: ['java.util.Vector', 'java.util.Stack'],
  related: ['arraylist-jcf', 'stack', 'synchronized-wrappers'],
};
