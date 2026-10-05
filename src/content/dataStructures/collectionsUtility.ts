import type { Topic } from '../../types/content.ts';

/** Collections Utility Class: sort, search, views, and one-liners. */
export const collectionsUtilityTopic: Topic = {
  slug: 'collections-utility',
  title: 'Collections Utility Class',
  category: 'data-structures',
  order: 50,
  summary: 'java.util.Collections: sorting, binary search, unmodifiable views, singletons and frequency tricks.',
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['collections-framework'],
  choiceBox: {
    choose: [
      'Sorting any `List` in place: `sort` (or `list.sort`) with natural or custom order.',
      'Read-only exposure: `unmodifiableList`/`unmodifiableMap` wrappers for safe sharing.',
      'One-liners: `frequency`, `max`/`min`, `reverse`, `rotate`, `singletonList`.',
    ],
    avoid: [
      'Sorting streams or sets — sort lists; sets define their own order.',
      'binarySearch on unsorted lists — undefined results, same rule as arrays.',
      'synchronizedXxx as a concurrency strategy — see Synchronized Wrappers for the holes.',
    ],
  },
  sections: [
    {
      heading: 'Algorithms as static methods',
      body: '`java.util.Collections` is a toolbox, not a container: `sort`, `binarySearch`, `reverse`, `shuffle`, `rotate`, `swap`, `fill` operate on any `List` in place. `frequency`, `max`/`min` (with optional comparators), and `disjoint` answer questions without loops.\n\n- `sort(list)` delegates to `list.sort(null)` — TimSort, stable, `O(n log n)`.\n- `binarySearch(list, key)` needs the *same* ordering the list was sorted with — pass the comparator to both or neither.',
    },
    {
      heading: 'Views: unmodifiable and checked',
      body: '`unmodifiableList/Map/Set` wrap a collection in a read-only *view*: reads pass through, writes throw `UnsupportedOperationException`. Crucially the view is live — changes to the backing list show through, so wrap-then-drop-the-original (or copy first) for true snapshots.\n\n- `checkedList` (and siblings) add runtime type checks at the boundary — generics-erasure debugging for legacy interop.\n- Prefer `List.copyOf`/`Map.copyOf` for snapshots: compact, null-rejecting, iteration-ordered copies rather than live wrappers.',
    },
    {
      heading: 'Singletons, empties, and constants',
      body: '`emptyList()`/`emptySet()`/`emptyMap()` return shared immutable empties — return these instead of `null` or `new ArrayList<>()` for “no results”. `singletonList`/`singletonMap`/`singletonSet` hold exactly one element immutably.\n\n- `nCopies(n, obj)` makes an immutable list of n references to *the same* object — cheap, but aliasing bites on mutation.\n- `Collections.frequency` counts occurrences (linear scan); for repeated counting build a frequency map once instead.',
    },
  ],
  complexity: [
    { operation: 'sort (TimSort, stable)', best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'binarySearch (sorted, random-access)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'reverse / shuffle / rotate / fill', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'frequency / max / min', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Sort, search, and rotate idioms',
      description: 'The toolbox calls behind everyday list work.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CollectionsIdioms {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("cedar", "ash", "birch"));
        Collections.sort(names); // in place, natural order
        System.out.println(names); // [ash, birch, cedar]

        int at = Collections.binarySearch(names, "birch");
        System.out.println("birch at " + at); // 1 (same ordering!)

        Collections.rotate(names, 1); // last becomes first
        System.out.println(names); // [cedar, ash, birch]

        System.out.println(Collections.frequency(names, "ash")); // 1
        System.out.println(Collections.max(names, Comparator.comparingInt(String::length)));
    }
}
`,
    },
    {
      title: 'Safe exposure patterns',
      description: 'Empty/singleton constants plus unmodifiable views.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SafeExposure {
    private final List<String> tags = new ArrayList<>();

    /** Never null, never growable by callers. */
    public List<String> tags() {
        if (tags.isEmpty()) {
            return Collections.emptyList(); // shared immutable empty
        }
        return Collections.unmodifiableList(tags); // live read-only view
    }

    public static void main(String[] args) {
        SafeExposure ex = new SafeExposure();
        System.out.println(ex.tags()); // []
        ex.tags.add("x");
        System.out.println(ex.tags()); // [x]
        try {
            ex.tags().add("hack");
        } catch (UnsupportedOperationException expected) {
            System.out.println("blocked: read-only view");
        }
    }
}
`,
    },
  ],
  mistakes: [
    'binarySearch on unsorted lists: garbage indices — sort with the same comparator first, every time.',
    'Returning the live list directly: callers mutate internals — wrap with unmodifiableList (and drop the original for snapshots).',
    'Assuming unmodifiable means snapshot: views stay live — copyOf snapshots, unmodifiableXxx observes.',
    'binarySearch on LinkedList: O(n) hops per probe make it O(n log n)-ish — copy to ArrayList first for searching.',
    'nCopies aliasing: n references to ONE object — mutating “element 3” mutates all of them.',
    'synchronizedList as thread-safety: iteration still needs manual locking — see Synchronized Wrappers.',
  ],
  vizId: 'collections-sort-search',
  problemIds: ['sort-an-array', 'merge-intervals', 'sort-colors'],
  javaBuiltIn: ['java.util.Collections'],
  related: ['arrays-utility', 'arraylist-jcf', 'immutable-collections'],
};
