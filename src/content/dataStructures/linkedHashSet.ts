import type { Topic } from '../../types/content.ts';

/** LinkedHashSet: hash speed with first-seen order. */
export const linkedHashSetTopic: Topic = {
  slug: 'linkedhashset',
  title: 'LinkedHashSet',
  category: 'data-structures',
  order: 46,
  summary: 'HashSet with insertion order preserved — dedupe that remembers who came first.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['hashset-jcf'],
  choiceBox: {
    choose: [
      'Dedupe while keeping first-seen order: `new ArrayList<>(new LinkedHashSet<>(list))`.',
      'Deterministic output from set pipelines (tests, manifests, stable logs).',
      '“Seen” sets where replay order must match encounter order.',
    ],
    avoid: [
      'Sorting — arrival order is not sorted order; `TreeSet` sorts.',
      'LRU/access-order needs — that’s `LinkedHashMap`; sets have no access-order mode.',
      'Memory-tight huge sets — the order list costs two references per element.',
    ],
  },
  sections: [
    {
      heading: 'HashSet plus a running receipt',
      body: '`LinkedHashSet` is a `HashSet` backed by a `LinkedHashMap`: same buckets and `O(1)` membership, plus a doubly linked list threading every entry in **insertion order**. Iteration replays arrival — duplicates never displace the original position.\n\nThe mapping is exact: `LinkedHashSet` ↔ `LinkedHashMap`, `HashSet` ↔ `HashMap`, `TreeSet` ↔ `TreeMap`. Each set is its map’s key-set face with order (or disorder) inherited.',
    },
    {
      heading: 'Order-preserving dedupe: the one-liner',
      body: '`new ArrayList<>(new LinkedHashSet<>(items))` removes duplicates and keeps first-seen order — the most-used `LinkedHashSet` line in production Java. Streams match it: `items.stream().distinct()` preserves encounter order for ordered streams (and `Collectors.toSet()` does *not* promise which set — specify `toCollection(LinkedHashSet::new)` when order matters).\n\n- Re-adding an existing element changes nothing: no move, no new slot — position belongs to first arrival.\n- Removal unlinks from both structures; iteration stays dense (no tombstones to skip).',
    },
    {
      heading: 'Iteration that skips the table',
      body: 'Like its map twin, iteration walks the order list — `O(n)` over elements, never over empty buckets. A sparse `HashSet` (big table, few entries) iterates slower than an equally filled `LinkedHashSet`: the plain set scans every bucket, the linked one follows the thread.\n\n- One `null` allowed, first-null position kept like any element.\n- Fail-fast iterators with the same `modCount` rules as every other `java.util` collection.',
    },
  ],
  complexity: [
    { operation: 'add / remove / contains', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Iteration (insertion order)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Order-preserving dedupe of m', best: 'O(m)', average: 'O(m)', worst: 'O(m)', space: 'O(m)' },
  ],
  javaCode: [
    {
      title: 'Dedupe that remembers order',
      description: 'The one-liner plus the stream equivalent with explicit collection.',
      code: `import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class OrderedDedupe {
    public static void main(String[] args) {
        List<String> log = List.of("open", "read", "open", "write", "read", "close");

        // First-seen order kept: [open, read, write, close].
        List<String> unique = new ArrayList<>(new LinkedHashSet<>(log));
        System.out.println(unique);

        // Stream equivalent — toSet() promises nothing about order, so specify it.
        Set<String> ordered = log.stream().collect(Collectors.toCollection(LinkedHashSet::new));
        System.out.println(ordered);

        // Re-adding changes nothing: position belongs to first arrival.
        Set<String> s = new LinkedHashSet<>(List.of("a", "b"));
        s.add("a");
        System.out.println(s); // [a, b]
    }
}
`,
    },
    {
      title: 'Stable “seen” tracking',
      description: 'Replay encounters in order — deterministic test output.',
      code: `import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class StableSeen {
    public static void main(String[] args) {
        Set<Integer> seen = new LinkedHashSet<>();
        List<Integer> hits = new ArrayList<>();
        for (int id : new int[]{7, 3, 7, 1, 3, 9}) {
            if (seen.add(id)) {
                hits.add(id); // first sight only, encounter order
            }
        }
        System.out.println(hits); // [7, 3, 1, 9] — same order every run
    }
}
`,
    },
  ],
  mistakes: [
    'Expecting sorted output: arrival order only — TreeSet sorts, LinkedHashSet replays.',
    'Using Collectors.toSet() for ordered results: the contract promises no order — toCollection(LinkedHashSet::new) pins it.',
    'Assuming re-add moves position: first arrival owns the slot — updates never reorder.',
    'Paying the link tax unknowingly: two extra references per element — plain HashSet when order is ignored.',
    'Wanting access-order (LRU) sets: sets have no access mode — build LRU on LinkedHashMap instead.',
    'Mutating elements post-add: same ghost rules as HashSet — membership hashes at insertion time.',
  ],
  vizId: 'hash-set-ops',
  problemIds: ['contains-duplicate', 'intersection-of-two-arrays'],
  practiceNote: 'Two verified drills exercise the membership half — the ordering half (first-seen dedupe) is API fluency from the snippets above; no bank drill isolates it.',
  javaBuiltIn: ['java.util.LinkedHashSet'],
  related: ['hashset-jcf', 'linkedhashmap-lru', 'treeset-navigableset'],
};
