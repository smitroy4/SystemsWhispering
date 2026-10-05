import type { Topic } from '../../types/content.ts';

/** Fail-Fast vs Fail-Safe Iterators: which cursors snap and which shrug. */
export const failFastFailSafeTopic: Topic = {
  slug: 'fail-fast-fail-safe',
  title: 'Fail-Fast vs Fail-Safe Iterators',
  category: 'data-structures',
  order: 54,
  summary: 'ConcurrentModificationException explained: which iterators snap, which shrug, and how to mutate safely mid-loop.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['iterable-iterator'],
  choiceBox: {
    choose: [
      'Fail-fast (ArrayList, HashMap) as the default: bugs surface loudly at the exact mutation.',
      'Fail-safe snapshots (`CopyOnWriteArrayList`) when readers must never block or fail mid-traversal.',
      'Weakly-consistent iterators (`ConcurrentHashMap`) for concurrent maps: live data, no CME, no lock-step sync.',
    ],
    avoid: [
      'Catching ConcurrentModificationException as control flow — it signals a bug, with no timing guarantees.',
      'CopyOnWrite iteration over huge, churning lists — every write copies the world; readers are cheap, writers pay.',
      'Assuming “fail-safe” means “sees everything”: snapshots miss later writes by design.',
    ],
  },
  sections: [
    {
      heading: 'Fail-fast: the modCount tripwire',
      body: 'Every `java.util` collection keeps a `modCount` bumped on each structural change; each iterator snapshots it as `expectedModCount` at creation and re-checks on every `next()`/`remove()`. Any out-of-band change desyncs the counts and the cursor throws `ConcurrentModificationException` — immediately, loudly, at the crime scene.\n\n- `Iterator.remove()` is the sanctioned mutation: it deletes *and* resyncs the expected count.\n- The check is best-effort, single-threaded detection — not a concurrency guarantee. Threads can still corrupt state between checks.',
    },
    {
      heading: 'Fail-safe: snapshots that shrug',
      body: '`CopyOnWriteArrayList`’s iterator reads the array reference taken at creation: later writes replace the array, leaving the cursor’s snapshot untouched. No exception, ever — but also no visibility into concurrent writes.\n\n- Cost model flipped: iteration is free, every write copies `O(n)`. Perfect for small, rarely-written, often-read lists (listener registries).\n- `ConcurrentHashMap` iterators are **weakly consistent**: they traverse live segments, never throw, reflect *some* (not necessarily all) concurrent updates, and support bulk ops (`forEach`, `search`, `reduce`) with parallelism thresholds.',
    },
    {
      heading: 'Mutating safely mid-loop: the menu',
      body: 'Pick by situation, not habit:\n\n| Situation | Safe approach |\n| --- | --- |\n| Filter a list in place | `removeIf` |\n| Delete via cursor | `Iterator.remove()` |\n| Replace while walking a list | `ListIterator.set` / `replaceAll` |\n| Build-then-swap | collect results, assign after the loop |\n| Concurrent readers + rare writes | `CopyOnWriteArrayList` snapshot iteration |\n| Concurrent map traversal | `ConcurrentHashMap` weakly-consistent iterator or `forEach` |\n\nCatching the exception and “retrying” is never on the menu — the corruption already happened.',
    },
  ],
  complexity: [
    { operation: 'Fail-fast check per next()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'CopyOnWrite write (snapshot copy)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'CopyOnWrite iteration', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'CHM weakly-consistent traversal', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Trip the wire, then do it right',
      description: 'The exception, the cursor fix, and the snapshot alternative.',
      code: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class FailFastDemo {
    public static void main(String[] args) {
        List<String> words = new ArrayList<>(List.of("a", "b", "c"));
        try {
            for (String w : words) {
                if (w.equals("b")) {
                    words.remove(w); // out-of-band: trips the wire
                }
            }
        } catch (java.util.ConcurrentModificationException e) {
            System.out.println("tripped: ConcurrentModificationException");
        }

        // Right way 1: mutate through the cursor.
        for (Iterator<String> it = words.iterator(); it.hasNext(); ) {
            if (it.next().equals("b")) {
                it.remove();
            }
        }

        // Right way 2: snapshot iteration never trips.
        List<String> shared = new CopyOnWriteArrayList<>(List.of("a", "b", "c"));
        for (String w : shared) {
            shared.add(w + "!"); // writers copy; this cursor keeps the old array
        }
        System.out.println(words + " " + shared.size());
    }
}
`,
    },
    {
      title: 'Weakly-consistent map traversal',
      description: 'ConcurrentHashMap: no CME, bulk ops, live-enough data.',
      code: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WeaklyConsistent {
    public static void main(String[] args) {
        Map<String, Integer> counts = new ConcurrentHashMap<>();
        counts.put("a", 1);
        counts.put("b", 2);

        // Never throws, even if another thread writes mid-walk.
        counts.forEach((k, v) -> System.out.print(k + v + " "));

        // Bulk search with a parallelism threshold.
        String found = ((ConcurrentHashMap<String, Integer>) counts)
            .search(1, (k, v) -> v > 1 ? k : null);
        System.out.println("\nfound=" + found); // b
    }
}
`,
    },
  ],
  mistakes: [
    'Catching CME as flow control: timing-dependent, never guaranteed — fix the mutation pattern instead.',
    'Assuming fail-fast protects threads: it detects single-threaded bugs; concurrent corruption slips between checks.',
    'Iterating CopyOnWrite giants: every write copies O(n) — fine for listeners, fatal for logs.',
    'Expecting snapshot freshness: fail-safe cursors miss concurrent writes by design — need live data? Use CHM.',
    'Removing via list.remove inside for-each: the #1 CME source — Iterator.remove/removeIf/collect-then-apply.',
    'Modifying map keys’ hash fields mid-iteration: entries strand AND the cursor trips — two bugs for one mutation.',
  ],
  vizId: 'failfast-modcount',
  problemIds: [],
  practiceNote: 'Mechanics topic: no verified drill exists — every CME you debug in real code is the practice; the menu above is the cheat sheet.',
  javaBuiltIn: ['java.util.ConcurrentModificationException', 'java.util.concurrent.CopyOnWriteArrayList'],
  related: ['iterable-iterator', 'copy-on-write', 'concurrent-hashmap'],
};
