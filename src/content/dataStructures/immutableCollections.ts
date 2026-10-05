import type { Topic } from '../../types/content.ts';

/** Immutable Collections: snapshots that cannot be corrupted. */
export const immutableCollectionsTopic: Topic = {
  slug: 'immutable-collections',
  title: 'Immutable Collections',
  category: 'data-structures',
  order: 52,
  summary: 'List.of, Set.of, Map.of and copyOf: compact, thread-safe snapshots — and the nulls they refuse.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['collections-framework'],
  choiceBox: {
    choose: [
      'Fixed data: fixtures, constants, lookup tables — `List.of`/`Map.of` in one expression.',
      'Safe sharing: snapshots cross threads and APIs with zero defensive copying.',
      'Return values that callers must not mutate — the type system enforces it.',
    ],
    avoid: [
      'Null elements or keys — all immutable factories throw NullPointerException on null.',
      'Growing later — immutable means immutable; build a mutable copy to extend.',
      'Huge maps via Map.of — overloads stop at 10 pairs; Map.ofEntries scales further.',
    ],
  },
  sections: [
    {
      heading: 'Factories: of, ofEntries, copyOf',
      body: '`List.of(a, b, c)`, `Set.of(...)`, `Map.of(k1, v1, …)` (up to 10 pairs) and `Map.ofEntries(Map.entry(k, v), …)` build compact, iteration-ordered snapshots. `List.copyOf`/`Set.copyOf`/`Map.copyOf` snapshot existing collections — already-immutable inputs may be returned as-is.\n\nAll three families reject `null` (elements, keys, values) immediately — fail-fast at creation, never a surprise `NullPointerException` three calls later. Duplicate `Set.of` elements (or `Map.of` keys) throw `IllegalArgumentException` on the spot.',
    },
    {
      heading: 'Immutable vs unmodifiable: the crucial split',
      body: 'Immutable (`List.of`, `copyOf`): no backing collection exists to change — true snapshots, safe to share across threads. Unmodifiable (`Collections.unmodifiableList`): a *live view* — writes throw, but edits to the backing list show through.\n\n- Share across threads? Immutable. Expose internals read-only but keep evolving them? Unmodifiable view.\n- `copyOf` on an already-immutable collection returns it directly (no copy); on a mutable one it snapshots.',
    },
    {
      heading: 'Nulls, duplicates, and the fine print',
      body: 'The factories’ strictness is the feature: nulls throw at creation (localising the bug), duplicates throw for sets/maps (catching key collisions early), and iteration order is stable (list order; map/set in an unspecified-but-fixed encounter order).\n\n- `Map.of` past 10 pairs doesn’t exist — switch to `ofEntries`.\n- Serialization works and stays compact; the implementations are specialized (0, 1, 2, N) rather than array-backed.\n- `Arrays.asList` is neither: fixed-size but *writable* — the trap between mutable lists and immutable ones.',
    },
  ],
  complexity: [
    { operation: 'of / ofEntries creation (n)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'copyOf snapshot (n)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'get by index / contains scan', best: 'O(1)', average: 'O(1) / O(n)', worst: 'O(1) / O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Factories and snapshots',
      description: 'of/ofEntries/copyOf plus the strictness that catches bugs early.',
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ImmutableIdioms {
    // Fixed lookup data: one expression, safely shareable everywhere.
    static final Map<String, Integer> POINTS = Map.of("a", 1, "b", 3, "c", 3);

    public static void main(String[] args) {
        List<String> fixed = List.of("ash", "birch", "cedar");
        System.out.println(fixed); // [ash, birch, cedar]

        List<String> draft = new ArrayList<>(List.of("x", "y"));
        draft.add("z");
        List<String> snapshot = List.copyOf(draft); // freezes [x, y, z]
        draft.add("w");
        System.out.println(snapshot); // [x, y, z] — unaffected

        Set<String> tags = Set.of("red", "green");
        System.out.println(tags.contains("red")); // true
    }
}
`,
    },
    {
      title: 'Strictness demos: nulls, dupes, writes',
      description: 'Each rule throws immediately — see them once, remember forever.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ImmutableStrict {
    public static void main(String[] args) {
        show(() -> List.of("a", null)); // NullPointerException
        show(() -> Map.of("k", 1, "k", 2)); // IllegalArgumentException: duplicate key
        show(() -> List.of("a").add("b")); // UnsupportedOperationException

        // Contrast: unmodifiable views stay LIVE on the backing list.
        List<String> backing = new ArrayList<>(List.of("a"));
        List<String> view = Collections.unmodifiableList(backing);
        backing.add("b");
        System.out.println("live view sees: " + view); // [a, b]
    }

    static void show(Runnable r) {
        try {
            r.run();
        } catch (RuntimeException e) {
            System.out.println("threw " + e.getClass().getSimpleName());
        }
    }
}
`,
    },
  ],
  mistakes: [
    'Passing nulls to factories: immediate NullPointerException — sanitize inputs before of()/copyOf().',
    'Map.of past 10 pairs: no such overload — switch to Map.ofEntries for larger maps.',
    'Duplicate Set.of/Map.of keys: IllegalArgumentException at creation — dedupe or merge before building.',
    'Adding to List.of results: UnsupportedOperationException — build mutable (ArrayList) when growth follows.',
    'Trusting unmodifiable as snapshot: views stay live — copyOf freezes, unmodifiableXxx observes.',
    'Using Arrays.asList as immutable: it is fixed-size but WRITABLE — set() mutates the shared array.',
  ],
  vizId: 'immutable-snapshot',
  problemIds: [],
  practiceNote: 'API-fluency topic: no verified drill isolates immutability — every practice problem that returns fixed data is a chance to use these factories.',
  javaBuiltIn: ['java.util.List', 'java.util.Map', 'java.util.Set'],
  related: ['collections-utility', 'collections-framework', 'streams-with-collections'],
};
