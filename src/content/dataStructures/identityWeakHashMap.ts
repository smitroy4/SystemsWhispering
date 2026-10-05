import type { Topic } from '../../types/content.ts';

/** IdentityHashMap & WeakHashMap: when equality — or lifetime — must differ. */
export const identityWeakHashMapTopic: Topic = {
  slug: 'identityhashmap-weakhashmap',
  title: 'IdentityHashMap & WeakHashMap',
  category: 'data-structures',
  order: 49,
  summary: 'Reference-equality keys and garbage-collected entries: canonicalizing maps, caches and listener tables.',
  level: 'advanced',
  group: 'collections',
  status: 'complete',
  prerequisites: ['hashmap-internals'],
  choiceBox: {
    choose: [
      '`IdentityHashMap`: topology-preserving graph walks, canonicalizing maps, per-instance metadata — identity IS the key.',
      '`WeakHashMap`: listener registries and caches whose entries must die with their keys.',
      'Serialization frameworks tracking already-seen objects (cycles need identity, not equality).',
    ],
    avoid: [
      'General-purpose maps — both violate the Map contract’s equals-based expectations somewhere.',
      '`IdentityHashMap` for value-like keys: equal-but-distinct objects map separately (usually a bug).',
      '`WeakHashMap` with string-literal/interned keys: strongly held elsewhere, they never clear — the “leak fix” silently doesn’t.',
    ],
  },
  sections: [
    {
      heading: 'Identity: == instead of equals',
      body: '`IdentityHashMap` compares keys by **reference** (`==`) and hashes by `System.identityHashCode`. Two equal-but-distinct objects (`new String("a")` twice) occupy *separate* entries — the opposite of every other map.\n\nImplementation is deliberately primitive: a flat `Object[]` alternating key/value (no `Node` objects, linear probing instead of chaining). It is fast and allocation-light, at the cost of unspecified iteration order and no `null`-key surprises (one null key allowed, compared by identity like everything else).',
    },
    {
      heading: 'Weakness: entries that die with keys',
      body: '`WeakHashMap` wraps keys in `WeakReference`s and polls a `ReferenceQueue` to expunge entries whose keys were garbage-collected. Values hold no strong path to keys (unless the value references the key — the classic self-inflicted leak), so dropping the last external key reference eventually removes the entry.\n\n- “Eventually”: expunging happens on map operations (and on `size()`), not instantly at GC time.\n- Iteration may encounter stale-but-queued entries mid-cleanup — sizes are approximate under churn.\n- Keys must still be immutable-ish: hash changes strand entries exactly like `HashMap`.',
    },
    {
      heading: 'The canonical uses (and abuses)',
      body: '`IdentityHashMap`: deep-equals/clone memo tables (visited-by-reference), canonicalizing maps (one representative per graph node), and metadata side-tables keyed by object rather than value.\n\n`WeakHashMap`: listener lists that must not pin publishers, per-classloader caches, and “associate data with objects you don’t own” (the value must not strongly reference the key, or nothing ever clears).\n\n- Weak keys + interned literals = silent no-op: literals live forever in the constant pool.\n- For weak *values* there is no JDK map — Guava `CacheBuilder.weakValues()` fills the gap.',
    },
  ],
  complexity: [
    { operation: 'IdentityHashMap get / put / remove', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'WeakHashMap get / put (plus queue poll)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Expunge stale entries (amortized)', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Identity vs equality, side by side',
      description: 'Equal strings, distinct references — watch the maps disagree.',
      code: `import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.Map;

public class IdentityDemo {
    public static void main(String[] args) {
        String a = new String("key");
        String b = new String("key"); // equal, but a != b

        Map<String, Integer> hash = new HashMap<>();
        hash.put(a, 1);
        System.out.println(hash.get(b)); // 1 — equals() matches

        Map<String, Integer> identity = new IdentityHashMap<>();
        identity.put(a, 1);
        System.out.println(identity.get(b)); // null — different reference
        System.out.println(identity.get(a)); // 1
    }
}
`,
    },
    {
      title: 'Weak listener registry',
      description: 'Listeners vanish when publishers die — no unregister calls.',
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.WeakHashMap;

public class WeakListeners {
    static class Publisher {
        final String name;
        Publisher(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        Map<Publisher, List<String>> listeners = new WeakHashMap<>();
        Publisher feed = new Publisher("feed");
        listeners.computeIfAbsent(feed, k -> new ArrayList<>()).add("ui-1");
        System.out.println("tracked=" + listeners.size()); // 1

        feed = null; // last strong reference dropped...
        System.gc(); // hint only — expunge happens on map access
        listeners.size(); // triggers stale-entry cleanup
        System.out.println("after gc, tracked=" + listeners.size()); // 0 (usually)
    }
}
`,
    },
  ],
  mistakes: [
    'Using IdentityHashMap with value keys: equal objects map separately — almost always a silent-duplication bug.',
    'Expecting Map-contract behavior: identity maps break the equals-based spirit — document the choice loudly.',
    'Weak values referencing keys: value → key strong refs pin everything — the cache never clears.',
    'Interned/string-literal weak keys: pooled for life — entries never expire and the “fix” is theater.',
    'Assuming prompt cleanup: expunge runs on map operations, not at GC — sizes lag under churn.',
    'Serializing identity maps: deserialized copies are distinct objects — identity restores nothing meaningful.',
  ],
  vizId: 'hash-collision',
  problemIds: [],
  practiceNote: 'Specialist topic: no verified drill exists — these maps appear in framework code and interviews as “which map and why” questions; the demos above are the whole payload.',
  javaBuiltIn: ['java.util.IdentityHashMap', 'java.util.WeakHashMap'],
  related: ['hashmap-internals', 'hash-table'],
};
