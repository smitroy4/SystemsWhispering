import type { Topic } from '../../types/content.ts';

/** Comparable vs Comparator: natural order against custom orders. */
export const comparableTopic: Topic = {
  slug: 'comparable-vs-comparator',
  title: 'Comparable vs Comparator',
  category: 'concepts',
  order: 7,
  summary: 'Comparable is the one natural order baked into a class; Comparator is any order you pass in. Sorting, TreeMap, and PriorityQueue all run on them.',
  level: 'intermediate',
  prerequisites: ['equals-hashcode-contract'],
  sections: [
    {
      heading: 'One natural order, many custom ones',
      body: '**`Comparable<T>`** is implemented *by* the class: `compareTo` defines its single natural order (`String`, `Integer`, `LocalDate` all have one). **`Comparator<T>`** is a separate object passed *to* a sort — you can have as many as you like: by age, by name, by salary descending.\n\n`TreeSet`, `TreeMap`, and `PriorityQueue` need one of the two; give neither and you get `ClassCastException` at runtime, not compile time.',
    },
    {
      heading: 'Writing consistent comparisons',
      body: 'Return negative / zero / positive — never subtract (`a - b` overflows near `Integer` extremes; use `Integer.compare`). Keep `compareTo` **consistent with equals**: `compare(a, b) == 0` should imply `a.equals(b)`, or sorted sets will silently drop "duplicates" that aren’t equal.\n\nChain with `Comparator.comparing(...).thenComparing(...)`, flip with `.reversed()`, and null-proof with `nullsFirst`/`nullsLast`. Transitivity is mandatory: inconsistent comparators corrupt TimSort with `IllegalArgumentException`.',
    },
    {
      heading: 'Where each lives',
      body: 'Use `Comparable` for the obvious default (timestamps, IDs, names). Use `Comparator` for everything else: alternate views, descending orders, multi-field sorts, and lambdas at call sites. `Arrays.sort`/`Collections.sort` take either; streams take comparators via `.sorted(cmp)` and `.min(cmp)`/`.max(cmp)`.',
    },
  ],
  complexity: [
    { operation: 'compareTo / compare', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Sort with comparator', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Natural order with Comparable',
      description: 'One canonical ordering inside the class.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Player implements Comparable<Player> {
    final String name;
    final int score;

    Player(String name, int score) {
        this.name = name;
        this.score = score;
    }

    @Override
    public int compareTo(Player other) {
        return Integer.compare(score, other.score); // ascending
    }

    @Override
    public String toString() {
        return name + ":" + score;
    }

    public static void main(String[] args) {
        List<Player> team = new ArrayList<>(List.of(
            new Player("bob", 30),
            new Player("ada", 50),
            new Player("cid", 40)));
        Collections.sort(team); // uses compareTo
        System.out.println(team); // [bob:30, cid:40, ada:50]
    }
}
`,
    },
    {
      title: 'Custom orders with Comparator',
      description: 'Chained, reversed, and null-safe comparators.',
      code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class CustomOrders {
    record Player(String name, int score) {}

    public static void main(String[] args) {
        List<Player> team = new ArrayList<>(List.of(
            new Player("bob", 30),
            new Player("ada", 50),
            new Player("cid", 40)));

        team.sort(Comparator.comparingInt(Player::score).reversed());
        System.out.println(team); // score descending

        team.sort(Comparator.comparing(Player::name));
        System.out.println(team); // name ascending
    }
}
`,
    },
  ],
  mistakes: [
    'Subtracting in compareTo: a - b overflows — use Integer.compare / Double.compare.',
    'Inconsistency with equals: TreeSet drops "equal-by-comparator" elements that .equals calls different.',
    'Forgetting comparators must be transitive: TimSort throws on contradictory orderings.',
    'Sorting with nulls unguarded: NullPointerException — wrap with nullsFirst/nullsLast.',
    'Implementing Comparable for multiple orders: one natural order only — the rest are Comparators.',
  ],
  pythonCode: [
    {
      title: 'Natural order with __lt__',
      description: 'One canonical ordering inside the class.',
      code: `from functools import total_ordering


@total_ordering
class Player:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __eq__(self, other):
        if not isinstance(other, Player):
            return NotImplemented
        return self.score == other.score

    def __lt__(self, other):
        if not isinstance(other, Player):
            return NotImplemented
        return self.score < other.score

    def __repr__(self):
        return f"{self.name}:{self.score}"


# Demo
team = [Player("bob", 30), Player("ada", 50), Player("cid", 40)]
team.sort()  # uses __lt__ (ascending by score)
print(team)  # [bob:30, cid:40, ada:50]
`,
    },
    {
      title: 'Custom orders with key functions',
      description: 'Sorted key, reverse, and multi-field sorting.',
      code: `team = [
    ("bob", 30),
    ("ada", 50),
    ("cid", 40),
]

# Score descending
print(sorted(team, key=lambda p: p[1], reverse=True))
# [('ada', 50), ('cid', 40), ('bob', 30)]

# Name ascending
print(sorted(team, key=lambda p: p[0]))
# [('ada', 50), ('bob', 30), ('cid', 40)]

# Multi-field: score desc, then name asc
print(sorted(team, key=lambda p: (-p[1], p[0])))
# [('ada', 50), ('cid', 40), ('bob', 30)]
`,
    },
  ],
  problemIds: ['sort-an-array', 'merge-intervals', 'sort-colors'],
};
