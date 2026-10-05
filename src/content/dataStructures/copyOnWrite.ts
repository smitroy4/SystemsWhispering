import type { Topic } from '../../types/content.ts';

/** CopyOnWriteArrayList & Set: snapshot iteration for read-heavy sharing. */
export const copyOnWriteTopic: Topic = {
  slug: 'copy-on-write',
  title: 'CopyOnWriteArrayList & CopyOnWriteArraySet',
  category: 'data-structures',
  order: 57,
  summary: 'Snapshot-on-write lists for read-heavy workloads: listener registries and the cost of every mutation.',
  level: 'intermediate',
  group: 'concurrent',
  status: 'complete',
  prerequisites: ['arraylist-jcf', 'concurrent-overview'],
  choiceBox: {
    choose: [
      'Read-heavy, write-rare lists: listeners, observers, config snapshots, routing tables.',
      'Iteration that must never throw and never block — snapshot cursors shrug at concurrent writes.',
      'Small collections: copies stay cheap while n stays in the hundreds.',
    ],
    avoid: [
      'Write-heavy or large lists — every add/set copies O(n); throughput collapses past thousands of elements.',
      'Sorted or unique needs — no ordering help here (Set variant is uniqueness-only, still unordered).',
      'Memory-tight paths — each write briefly holds two full arrays.',
    ],
  },
  sections: [
    {
      heading: 'Mutate a copy, publish the reference',
      body: 'A `CopyOnWriteArrayList` holds a `volatile Object[]`. Every mutating op (`add`, `set`, `remove`) locks briefly, copies the array with the change applied, and publishes the new reference. Readers (including iterators) grab the current reference once and walk it — no locks, no checks, no exceptions, ever.\n\n- Iterators are **snapshots**: created with the array reference in hand, they see exactly the elements present at creation — later writes are invisible to them.\n- `CopyOnWriteArraySet` is the uniqueness face (backed by a COW list, `addIfAbsent` semantics) — same costs, plus `O(n)` membership scans.',
    },
    {
      heading: 'The cost model, honestly',
      body: 'Reads: `O(1)` indexed, `O(n)` traversal, zero synchronization. Writes: `O(n)` copy plus a brief exclusive lock — and writers serialize (one at a time). Memory spikes to 2n mid-write.\n\n- Sweet spot: hundreds of elements, writes per second, reads per millisecond — GUI listeners, feature-flag lists, service registries.\n- Anti-spot: logging buffers, queues, caches with churn — each write copying megabytes is a latency disaster and a GC storm.\n- `addIfAbsent` avoids duplicates without an external check — the one compound the structure offers natively.',
    },
    {
      heading: 'Snapshots vs live views',
      body: 'Snapshot iteration guarantees *stability* (no CME, no torn reads) at the price of *staleness* (misses concurrent writes). Contrast the alternatives:\n\n| Need | Pick |\n| --- | --- |\n| Stable + fresh, single thread | `ArrayList` + cursor discipline |\n| Stable under concurrency, small | `CopyOnWriteArrayList` |\n| Live under concurrency, map-shaped | `ConcurrentHashMap` (weakly consistent) |\n| Live under concurrency, list-shaped | external locking around `ArrayList` |\n\nThere is no concurrent list with live, locked, snapshot-cheap iteration — the tradeoff is fundamental, and COW picks its corner explicitly.',
    },
    {
      heading: 'Listener registries: the showcase',
      body: 'Event buses keep `CopyOnWriteArrayList<Listener>`: dispatches iterate lock-free at full speed while subscribe/unsubscribe (rare) pay the copy. No dispatcher ever blocks on registration, no registrant ever blocks dispatch — and a listener that unsubscribes mid-broadcast still receives the in-flight event (snapshot semantics, occasionally surprising, always safe).',
    },
  ],
  complexity: [
    { operation: 'get (volatile read)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'add / set / remove (copy)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Iteration (snapshot)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'CopyOnWriteArraySet add / contains', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Listener bus with ExecutorService',
      description: 'Lock-free dispatch, copy-on-subscribe — the canonical workload.',
      code: `import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ListenerBus {
    private final CopyOnWriteArrayList<String> listeners = new CopyOnWriteArrayList<>();

    public void subscribe(String id) {
        listeners.addIfAbsent(id); // COW native compound
    }

    /** Dispatch never blocks, never throws — iterates a snapshot. */
    public void broadcast(String event) {
        for (String id : listeners) {
            System.out.println(id + " <- " + event);
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ListenerBus bus = new ListenerBus();
        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int i = 0; i < 3; i++) {
            final String id = "ui-" + i;
            pool.submit(() -> bus.subscribe(id));
        }
        pool.submit(() -> bus.broadcast("refresh"));
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);
    }
}
`,
    },
    {
      title: 'Snapshot semantics demo',
      description: 'Writers copy, cursors keep the old array — staleness by design.',
      code: `import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class SnapshotDemo {
    public static void main(String[] args) {
        List<String> shared = new CopyOnWriteArrayList<>(List.of("a", "b"));
        Iterator<String> cursor = shared.iterator(); // pins [a, b]
        shared.add("c"); // writers get a fresh [a, b, c]
        StringBuilder seen = new StringBuilder();
        while (cursor.hasNext()) {
            seen.append(cursor.next());
        }
        System.out.println("cursor saw=" + seen); // ab — never c
        System.out.println("list now=" + shared); // [a, b, c]
    }
}
`,
    },
  ],
  mistakes: [
    'Using it as a general concurrent list: O(n) writes serialize — throughput dies on churn; size the workload first.',
    'Expecting fresh reads from snapshots: cursors miss concurrent writes by design — need live? Use CHM or locks.',
    'Huge lists: each write doubles memory briefly — megabyte arrays plus frequent writes equal GC storms.',
    'addIfAbsent as dedupe-at-scale: membership scans O(n) — uniqueness over thousands needs a concurrent Set.',
    'Mutating elements (not the list): COW guards structure, not contents — shared mutable elements still race.',
    'Iterating while assuming visibility of own writes: a cursor created before your write won’t see it — re-iterate.',
  ],
  vizId: 'cow-snapshot',
  problemIds: [],
  practiceNote: 'Mechanics topic: no verified drill isolates copy-on-write — it appears as the “which concurrent list” interview answer; the snapshot demo above is the payload.',
  javaBuiltIn: ['java.util.concurrent.CopyOnWriteArrayList', 'java.util.concurrent.CopyOnWriteArraySet'],
  related: ['arraylist-jcf', 'fail-fast-fail-safe', 'concurrent-overview'],
};
