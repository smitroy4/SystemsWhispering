import type { Topic } from '../../types/content.ts';

/** Iterable/Iterator/ListIterator: the cursor contract behind every for-each. */
export const iterableIteratorTopic: Topic = {
  slug: 'iterable-iterator',
  title: 'Iterable, Iterator & ListIterator',
  category: 'data-structures',
  order: 36,
  summary: 'How for-each really works: hasNext/next, fail-fast cursors and two-way list iteration.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: [],
  choiceBox: {
    choose: [
      'For-each loops for plain reads — the compiler writes the iterator for you.',
      'Explicit `Iterator` when you must **remove while traversing** (`it.remove()` is the only safe in-loop delete).',
      '`ListIterator` when a list needs **two-way** walks, index queries, or in-place `set`/`add` during traversal.',
    ],
    avoid: [
      'Removing from a for-each loop body — it throws; use `removeIf` or an explicit iterator.',
      'Calling `next()` without `hasNext()` or `remove()` twice in a row — both are state-machine violations.',
      'Sharing one iterator across threads or nestings — cursors are single-use, single-thread state.',
    ],
  },
  sections: [
    {
      heading: 'For-each is syntax sugar',
      body: 'Every `for (String w : words)` compiles to an `Iterator`: `for (Iterator<String> it = words.iterator(); it.hasNext(); ) { String w = it.next(); … }`. `Iterable` is the one-method interface (`iterator()`) that opts a type into this; `Iterator` is the three-method cursor (`hasNext`, `next`, `remove`).\n\nThe cursor holds a **position** between elements plus, in fail-fast collections, a snapshot of the modification count. `next()` advances and returns; `hasNext()` peeks without moving. That is the entire protocol — everything else (streams, forEach, spliterators) builds on it.',
    },
    {
      heading: 'Remove, fail-fast, and modCount',
      body: '`Iterator.remove()` deletes the last-returned element — legal only once per `next()`, and it syncs the iterator’s expected count so traversal continues. Any *other* structural change (direct `list.add/remove`, even from the same thread) desyncs the counts, and the next `next()` throws `ConcurrentModificationException`.\n\nThis **fail-fast** behavior (see the visualization: `modCount` vs `expectedModCount`) detects bugs loudly instead of skipping or repeating silently. The safe in-loop mutations: `it.remove()`, `removeIf`, or collect-then-apply after the loop.\n\nCost note: cursor removal is `O(1)` on linked structures (unlink at the cursor) but `O(n)` on `ArrayList` (the tail still shifts) — the cursor saves the *search*, not the shift.',
    },
    {
      heading: 'ListIterator: two directions, indexed',
      body: '`ListIterator` extends `Iterator` for lists: `hasPrevious`/`previous` walk backward, `nextIndex`/`previousIndex` report cursor position, and `set`/`add` modify at the cursor without invalidating it. It is how `Collections.reverse`, list shuffles, and bidirectional parsers traverse.\n\n- `add` inserts *before* the would-be-next element and leaves the cursor after it — a subsequent `previous()` returns the inserted element.\n- `set` replaces the last-returned element — the in-loop update that for-each cannot express.',
    },
    {
      heading: 'Custom iterables: ranges and views',
      body: 'Any class can be for-each-able: implement `Iterable<T>` and return an `Iterator<T>` (often an anonymous class holding an index). Lazy ranges, paginated API clients, and tree traversals all expose iteration instead of materialising lists.\n\nIterator invalidation rules are yours to define for custom types — but follow the framework: fail fast on structural change, document it, and never return the same iterator twice from `iterator()`.',
    },
  ],
  complexity: [
    { operation: 'hasNext / next', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Iterator.remove', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'ListIterator previous / set / add', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'removeIf (bulk)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Custom Range iterable from scratch',
      description: 'Iterable + Iterator in twenty lines: lazy numbers, for-each ready.',
      code: `import java.util.Iterator;
import java.util.NoSuchElementException;

public class Range implements Iterable<Integer> {
    private final int start;
    private final int end; // exclusive

    public Range(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            private int cursor = start;

            @Override
            public boolean hasNext() {
                return cursor < end;
            }

            @Override
            public Integer next() {
                if (!hasNext()) {
                    throw new NoSuchElementException("past end");
                }
                return cursor++;
            }
        };
    }

    public static void main(String[] args) {
        for (int n : new Range(3, 7)) {
            System.out.print(n + " "); // 3 4 5 6, nothing stored
        }
    }
}
`,
    },
    {
      title: 'Safe in-loop removal idioms',
      description: 'Iterator.remove, removeIf, and ListIterator.set — the only legal mutations.',
      code: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

public class SafeRemoval {
    public static void main(String[] args) {
        List<String> words = new ArrayList<>(List.of("ash", "axe", "birch", "avocado"));

        // Idiom 1: explicit iterator — remove() is cursor-safe.
        for (Iterator<String> it = words.iterator(); it.hasNext(); ) {
            if (it.next().startsWith("a")) {
                it.remove();
            }
        }

        // Idiom 2: removeIf — the one-liner for whole-list filtering.
        words.removeIf(w -> w.length() < 4);

        // Idiom 3: ListIterator.set — replace while walking, both directions.
        List<String> tags = new ArrayList<>(List.of("todo", "doing", "done"));
        ListIterator<String> it = tags.listIterator();
        while (it.hasNext()) {
            it.set(it.next().toUpperCase());
        }
        System.out.println(words + " " + tags);
    }
}
`,
    },
  ],
  mistakes: [
    'Removing inside for-each: the hidden iterator desyncs — ConcurrentModificationException, always.',
    'Calling next() without hasNext(): past-the-end access throws NoSuchElementException instead of returning null.',
    'Calling remove() twice per next() (or before any next()): the cursor protocol allows exactly one remove per element.',
    'Modifying the list by index inside an iterator loop: index shifts plus cursor state corrupt traversal silently or loudly.',
    'Reusing an exhausted iterator: hasNext() stays false forever — call list.iterator() again for a fresh cursor.',
    'Assuming fail-fast means thread-safe: it detects concurrent change by luck and timing — never rely on it for correctness.',
  ],
  vizId: 'failfast-modcount',
  problemIds: [],
  practiceNote: 'Mechanics topic: no direct drill in the verified bank — the payoff lands everywhere you mutate a list mid-loop; study Fail-Fast vs Fail-Safe next.',
  javaBuiltIn: ['java.lang.Iterable', 'java.util.Iterator', 'java.util.ListIterator'],
  related: ['fail-fast-fail-safe', 'arraylist-jcf', 'collections-framework'],
};
