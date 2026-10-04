import type { Topic } from '../../types/content.ts';

/** The equals/hashCode contract: equal objects must hash equally. */
export const equalsTopic: Topic = {
  slug: 'equals-hashcode-contract',
  title: 'equals/hashCode Contract',
  category: 'concepts',
  order: 6,
  summary: 'Override both or neither: equal objects must share hash codes, or HashMap/HashSet silently lose your keys.',
  level: 'intermediate',
  prerequisites: ['memory-stack-vs-heap', 'hash-table'],
  sections: [
    {
      heading: 'The contract in three lines',
      body: 'If `a.equals(b)`, then `a.hashCode() == b.hashCode()`. That is the entire law — and violating it breaks every hash-based collection: `HashMap` files your key in bucket 5, but lookup hashes to bucket 9 and reports "absent".\n\nThe reverse is *not* required: unequal objects may share a hash (collisions are legal, just slower). Reflexivity, symmetry, and transitivity round out `equals` itself.',
    },
    {
      heading: 'Writing both correctly',
      body: 'Compare with `Objects.equals` field-by-field (null-safe), hash with `Objects.hash` over the *same* fields. Include exactly the fields that define identity — a mutable "cached" field in `hashCode` corrupts lookups the moment it changes.\n\n`instanceof` pattern matching (`o instanceof Point(var x, var y)`) keeps `equals` readable; records generate both methods correctly for free, which is reason enough to prefer them for value types.',
    },
    {
      heading: 'Keys must stay still',
      body: 'Mutating a key’s hashed fields after insertion strands the entry in the wrong bucket: `containsKey` returns false for a key that is *right there*. Keep keys immutable (records, `List.copyOf`, defensive copies), or remove → mutate → re-insert.',
    },
  ],
  complexity: [
    { operation: 'Well-distributed hashCode', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Degenerate hashCode (all equal)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'A correct value type',
      description: 'equals and hashCode over the same fields.',
      code: `import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Point other)) {
            return false;
        }
        return x == other.x && y == other.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }

    public static void main(String[] args) {
        Map<Point, String> grid = new HashMap<>();
        grid.put(new Point(1, 2), "start");
        System.out.println(grid.get(new Point(1, 2))); // start
    }
}
`,
    },
    {
      title: 'Record: contract for free',
      description: 'Records generate both methods from components.',
      code: `import java.util.HashSet;
import java.util.Set;

public class PointRecord {
    record Point(int x, int y) {}

    public static void main(String[] args) {
        Set<Point> seen = new HashSet<>();
        seen.add(new Point(1, 2));
        System.out.println(seen.contains(new Point(1, 2))); // true
    }
}
`,
    },
  ],
  mistakes: [
    'Overriding equals without hashCode: equal keys land in different buckets — lookups fail silently.',
    'Hashing different fields than equals compares: same violation, harder to spot.',
    'Using getClass() vs instanceof inconsistently: breaks symmetry across subclasses — pick one rule deliberately.',
    'Mutating hashed fields of live keys: entries strand in wrong buckets; keep keys immutable.',
    'Returning constant hashCodes "to be safe": legal but degrades every map to a linked list.',
  ],
  problemIds: ['contains-duplicate', 'valid-anagram', 'group-anagrams'],
};
