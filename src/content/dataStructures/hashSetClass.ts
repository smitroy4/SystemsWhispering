import type { Topic } from '../../types/content.ts';

/** HashSet: unique membership at hash speed — the Set face of HashMap. */
export const hashSetClassTopic: Topic = {
  slug: 'hashset-jcf',
  title: 'HashSet',
  category: 'data-structures',
  order: 45,
  summary: 'The Set face of HashMap: unique elements, O(1) membership, and iteration order you must not trust.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['hash-set', 'collections-framework'],
  choiceBox: {
    choose: [
      '“Have I seen this?” — dedupe, visited sets, membership guards before expensive work.',
      'Set algebra: `retainAll` (intersect), `addAll` (union), `removeAll` (difference) in place.',
      'Backing any “unique items” requirement where order doesn’t matter.',
    ],
    avoid: [
      'Ordered output — iteration order is unspecified; `LinkedHashSet`/`TreeSet` order things.',
      'Indexed access — sets have no get(i); iterate or convert to a list.',
      'Keys that mutate hash fields — same stranding rules as HashMap keys.',
    ],
  },
  sections: [
    {
      heading: 'A HashMap wearing a Set costume',
      body: '`HashSet<E>` is literally a `HashMap<E, Object>` with a shared dummy value (`PRESENT`): `add` maps to `put(e, PRESENT)`, `contains` to `containsKey`. Every mechanic — spreading, buckets, treeification at 8, resize at 0.75 — is inherited wholesale.\n\nThat sharing is why the contracts match: one `null` allowed, iteration order unspecified, `O(1)` average ops, fail-fast iterators. Learn `HashMap` deeply and `HashSet` comes free.',
    },
    {
      heading: 'Set algebra in place',
      body: '`addAll` unions, `retainAll` intersects, `removeAll` subtracts — all mutating the receiver, all bulk-optimized internally. `containsAll` tests subset without touching either set.\n\n- New-set variants: copy first (`new HashSet<>(a)`), then operate — the originals stay intact.\n- `retainAll` on a huge set with a tiny argument iterates efficiently; reversed (tiny.retainAll(huge)) still walks the tiny one — argument order rarely matters, sizes do.',
    },
    {
      heading: 'Membership patterns',
      body: 'Dedupe a list: `new HashSet<>(list)` (order lost — `LinkedHashSet` keeps it). Visited tracking in DFS/BFS: `if (!seen.add(node)) continue` — add-returns-false *is* the visited check in one call. Pair-sum complements, duplicate detection (`Contains Duplicate`), happy-number cycle guards — all “seen before?” in `O(1)`.\n\n- `Longest Consecutive Sequence` builds the set once, then only starts streaks at numbers with no predecessor — `O(n)` total via membership, not sorting.',
    },
    {
      heading: 'Equals, hashCode, and the element contract',
      body: 'Same rules as map keys: `equals`/`hashCode` consistent, fields effectively immutable after adding. Mutable elements (mutable list added to a set, then mutated) become ghosts — `contains` misses, `remove` fails, `size` lies.\n\n- Custom classes need both overrides; records give them free.\n- `String`/`Integer` are ideal; arrays are not (identity hashing — wrap in `List.of(...)`).',
    },
  ],
  complexity: [
    { operation: 'add / remove / contains', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Bulk addAll / retainAll / removeAll', best: 'O(m)', average: 'O(m)', worst: 'O(m·n)', space: 'O(n)' },
    { operation: 'Iteration (n elements)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Membership and set algebra',
      description: 'add-returns-false visited checks, dedupe, and in-place algebra.',
      code: `import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class SetIdioms {
    /** Dedupe, order lost. Swap in LinkedHashSet to keep first-seen order. */
    static <T> List<T> dedupe(List<T> items) {
        return new ArrayList<>(new HashSet<>(items));
    }

    public static void main(String[] args) {
        Set<String> seen = new HashSet<>();
        for (String w : List.of("a", "b", "a", "c")) {
            if (!seen.add(w)) {
                System.out.println("dup: " + w); // dup: a
            }
        }
        System.out.println(dedupe(List.of(3, 1, 3, 2, 1)));

        Set<Integer> a = new HashSet<>(Set.of(1, 2, 3));
        Set<Integer> b = new HashSet<>(Set.of(2, 3, 4));
        Set<Integer> both = new HashSet<>(a);
        both.retainAll(b); // intersection in place
        System.out.println("both=" + both);
    }
}
`,
    },
    {
      title: 'Longest streak via membership',
      description: 'Only start streaks with no predecessor — O(n) without sorting.',
      code: `import java.util.HashSet;
import java.util.Set;

public class Streaks {
    static int longestRun(int[] nums) {
        Set<Integer> have = new HashSet<>();
        for (int n : nums) {
            have.add(n);
        }
        int best = 0;
        for (int n : have) {
            if (have.contains(n - 1)) {
                continue; // not a streak start — skip
            }
            int run = 1;
            while (have.contains(n + run)) {
                run++;
            }
            best = Math.max(best, run);
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(longestRun(new int[]{100, 4, 200, 1, 3, 2})); // 4
    }
}
`,
    },
  ],
  mistakes: [
    'Depending on iteration order: unspecified and resize-unstable — order needs LinkedHashSet or TreeSet.',
    'Indexing a set: no get(i) exists — iterate, stream, or convert with new ArrayList<>(set).',
    'Adding mutable elements then mutating them: ghosts that contains/remove cannot find — keep elements immutable.',
    'Forgetting add() returns boolean: the return IS the “already seen” check — no separate contains call needed.',
    'Using arrays as elements: identity hashing treats equal contents as distinct — wrap contents in List.',
    'retainAll on the original by accident: algebra mutates the receiver — copy first when the original must survive.',
  ],
  vizId: 'hash-set-ops',
  problemIds: ['longest-consecutive-sequence', 'contains-duplicate', 'happy-number'],
  javaBuiltIn: ['java.util.HashSet', 'java.util.Set'],
  related: ['hash-set', 'hashmap-internals', 'linkedhashset'],
};
