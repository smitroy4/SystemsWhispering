import type { Topic } from '../../types/content.ts';

/** EnumMap & EnumSet: bit-vector speed for enum-keyed data. */
export const enumMapEnumSetTopic: Topic = {
  slug: 'enummap-enumset',
  title: 'EnumMap & EnumSet',
  category: 'data-structures',
  order: 48,
  summary: 'Bit-vector sets and array-backed maps for enums — the fastest collections you are not using yet.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['collections-framework'],
  choiceBox: {
    choose: [
      'Keys or members are an **enum**: state machines, flags, per-type registries and handlers.',
      'Flag sets: `EnumSet` bit ops (`or`/`and`) beat boolean fields and `HashSet` alike.',
      'Switch-adjacent tables: `EnumMap<State, Handler>` replaces fragile switch statements.',
    ],
    avoid: [
      'Non-enum keys — the classes are final on the enum type; anything else needs HashMap/TreeMap.',
      'Null keys — forbidden (unlike HashMap); null values are allowed in EnumMap.',
      'Huge dynamic universes — enums are closed sets; open-ended data needs hash structures.',
    ],
  },
  sections: [
    {
      heading: 'Enums are array indices in disguise',
      body: 'Every enum constant has an `ordinal()` — a dense 0-based id. `EnumMap` exploits it: values live in a plain `Object[]` indexed by ordinal — `O(1)` lookup with *zero* hashing, zero collisions, and iteration in declaration order.\n\n`EnumSet` exploits it harder: ≤64 constants fit in a single `long` (bit `i` = constant `i`); bigger enums use a `long[]`. Add/remove/contains are bit ops; bulk `or`/`and` process 64 members per instruction — the bitset mechanics from Bitset & BitSet, handed to you finished.',
    },
    {
      heading: 'State machines without switches',
      body: 'The canonical `EnumMap` use: `Map<State, Runnable>` (or `Function`) dispatch tables. States gain transitions by `put`, not by editing a switch — open/closed principle for free, and missing transitions surface as `null` (or `getOrDefault`) instead of fall-through bugs.\n\n- `EnumSet.range(FROM, TO)` and `EnumSet.of(A, B)` build flag sets declaratively.\n- `complementOf` inverts a set in one word-op — “everything except” without enumerating.',
    },
    {
      heading: 'Performance and memory reality',
      body: '`EnumSet` of ≤64 constants: one object, one `long` — smaller and faster than any `HashSet` by orders of magnitude. `EnumMap`: one array of enum-count references — no buckets, no nodes, no resize policy.\n\n- Both are **not synchronized** and fail-fast like the rest of `java.util`.\n- `EnumMap` forbids null keys (ordinal of nothing); `EnumSet` forbids null elements entirely.\n- Serialization is safe and compact — another reason frameworks prefer them for config flags.',
    },
  ],
  complexity: [
    { operation: 'EnumMap get / put / remove', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(E)' },
    { operation: 'EnumSet add / remove / contains', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1) words' },
    { operation: 'EnumSet or / and / complement', best: 'O(1)', average: 'O(1)', worst: 'O(E/64)', space: 'O(1) words' },
    { operation: 'Iteration (declaration order)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(E)' },
  ],
  javaCode: [
    {
      title: 'Dispatch table and flag sets',
      description: 'EnumMap replaces switches; EnumSet replaces boolean fields.',
      code: `import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public class EnumPower {
    enum State { IDLE, RUNNING, PAUSED, DONE }

    public static void main(String[] args) {
        // Dispatch table: transitions by put, not by switch edits.
        Map<State, Runnable> onEnter = new EnumMap<>(State.class);
        onEnter.put(State.RUNNING, () -> System.out.println("go"));
        onEnter.put(State.DONE, () -> System.out.println("stop"));
        onEnter.getOrDefault(State.RUNNING, () -> {
        }).run();

        // Flag sets: bit ops, declaration-order iteration.
        Set<State> active = EnumSet.of(State.IDLE, State.RUNNING);
        active.add(State.PAUSED);
        Set<State> rest = EnumSet.complementOf(EnumSet.of(State.DONE));
        System.out.println(active); // [IDLE, RUNNING, PAUSED]
        System.out.println(rest.contains(State.IDLE)); // true
    }
}
`,
    },
    {
      title: 'Range flags and bulk ops',
      description: 'Ranges, unions, and membership at word speed.',
      code: `import java.util.EnumSet;
import java.util.Set;

public class EnumRanges {
    enum Perm { READ, WRITE, EXECUTE, DELETE, SHARE, ADMIN }

    public static void main(String[] args) {
        Set<Perm> basic = EnumSet.range(Perm.READ, Perm.EXECUTE);
        Set<Perm> extra = EnumSet.of(Perm.DELETE, Perm.SHARE);
        basic.addAll(extra); // union in place — one word-op here
        System.out.println(basic); // [READ, WRITE, EXECUTE, DELETE, SHARE]
        System.out.println(basic.contains(Perm.ADMIN)); // false, one bit test
    }
}
`,
    },
  ],
  mistakes: [
    'Using HashMap<Enum, …> by habit: EnumMap skips hashing entirely — faster, ordered, smaller.',
    'Boolean-field flag sprawl: five booleans beg for an EnumSet — bulk ops and iteration come free.',
    'Putting null keys in EnumMap: forbidden (no ordinal) — restructure to allow absence instead.',
    'Depending on ordinals directly: adding a constant mid-enum renumbers followers — persist names, never ordinals.',
    'Assuming thread safety: neither class synchronizes — guard shared flag sets explicitly.',
    'Switching on enums with fall-through: dispatch tables (EnumMap) make missing cases visible instead of silent.',
  ],
  vizId: 'bitset-ops',
  problemIds: [],
  practiceNote: 'Mechanics topic: no enum drill exists in the verified bank — the bit-vector intuition transfers from Bitset & BitSet; reach for these classes whenever keys are enums.',
  javaBuiltIn: ['java.util.EnumMap', 'java.util.EnumSet'],
  related: ['hashmap-internals', 'bitset', 'collections-framework'],
};
