import type { Topic } from '../../types/content.ts';

/** TreeSet & NavigableSet: the sorted set — ranges, neighbours, and views. */
export const treeSetTopic: Topic = {
  slug: 'treeset-navigableset',
  title: 'TreeSet & NavigableSet',
  category: 'data-structures',
  order: 47,
  summary: 'Sorted sets with range views: headSet, tailSet, and the comparator contract that keeps them honest.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['binary-search-tree', 'collections-framework'],
  choiceBox: {
    choose: [
      'Sorted unique elements with neighbour queries: `lower`, `higher`, `floor`, `ceiling`.',
      'Range scans over members: `subSet`/`headSet`/`tailSet` views without copying.',
      'Deterministic sorted output and order-statistic-style “k-th” walks.',
    ],
    avoid: [
      'Plain membership — `HashSet` is O(1); TreeSet pays O(log n) per op.',
      'Inconsistent compareTo: compare==0 merges distinct elements — the set “loses” members.',
      'Nulls with custom comparators — same rule as TreeMap: avoid.',
    ],
  },
  sections: [
    {
      heading: 'A TreeMap with no values',
      body: '`TreeSet<E>` is a `TreeMap<E, Object>` holding only keys: same red-black tree, same `O(log n)` ops, iteration in sorted order. `NavigableSet` mirrors `NavigableMap` — `lower`/`floor`/`ceiling`/`higher`, `first`/`last`, `pollFirst`/`pollLast`, plus `subSet`/`headSet`/`tailSet` range views and `descendingSet`.\n\nEverything about comparator consistency from TreeMap applies verbatim: `compare(a,b)==0` *is* equality here, and distinct elements comparing 0 collapse into one slot.',
    },
    {
      heading: 'Neighbour and range patterns',
      body: 'Closest-value queries: `ceiling(x)` finds the next booked slot ≥ x (calendar checks); `lower(x)` the strict predecessor. Sliding distinct windows keep a `TreeSet` of the window and query neighbours in `O(log n)`.\n\n- `subSet(from, to)` views are live and half-open by default — same inclusivity-flag overloads as `subMap`.\n- `pollFirst` repeatedly drains in sorted order — a simple sorted-work-queue (priority queues are faster for pure extremes, but lack ranges and neighbours).',
    },
    {
      heading: 'Sorted output without sorting',
      body: 'Collect-then-iterate beats sort-then-iterate when input arrives incrementally: feed a `TreeSet` as data arrives and iteration is always sorted — no `O(n log n)` pass at the end. Dedupe-plus-sort collapses to one structure: `new TreeSet<>(items)`.\n\n- `descendingSet()` reverses without copying — leaderboard “top-down” views for free.\n- Streams: `set.stream().sorted()` re-sorts pointlessly on a `TreeSet` — iterate directly.',
    },
  ],
  complexity: [
    { operation: 'add / remove / contains', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'lower / floor / ceiling / higher', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'first / last / pollFirst / pollLast', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'subSet view / scan k', best: 'O(1) / O(k)', average: 'O(1) / O(k)', worst: 'O(log n) / O(k)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Neighbour queries and windows',
      description: 'ceiling/floor for calendars; live subSet windows.',
      code: `import java.util.NavigableSet;
import java.util.TreeSet;

public class NavigableSetIdioms {
    public static void main(String[] args) {
        NavigableSet<Integer> booked = new TreeSet<>();
        booked.add(9);
        booked.add(14);
        booked.add(16);

        // Is [10, 12) free? Neighbours decide: floor(10)=9, ceiling(10)=14.
        System.out.println("prev=" + booked.floor(10) + " next=" + booked.ceiling(10));

        // Live afternoon window: writes here land in the original set.
        NavigableSet<Integer> afternoon = booked.subSet(12, true, 18, false);
        afternoon.add(15);
        System.out.println(booked); // [9, 14, 15, 16]

        System.out.println("top-down=" + booked.descendingSet()); // [16, 15, 14, 9]
    }
}
`,
    },
    {
      title: 'Dedupe-plus-sort in one structure',
      description: 'Feed incrementally; iteration is always sorted.',
      code: `import java.util.List;
import java.util.TreeSet;

public class SortedDedupe {
    public static void main(String[] args) {
        TreeSet<String> tags = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        tags.addAll(List.of("Banana", "apple", "APPLE", "cherry"));
        System.out.println(tags); // [apple, Banana, cherry] — "APPLE" merged
    }
}
`,
    },
  ],
  mistakes: [
    'Merging distinct elements: CASE_INSENSITIVE_ORDER unites “apple”/“APPLE” — intended here, data loss elsewhere.',
    'Mutating compared fields post-add: tree position freezes — members become unreachable ghosts.',
    'Sorting a TreeSet via streams: set.stream().sorted() re-sorts pointlessly — iterate the set directly.',
    'Using it for plain contains: O(log n) plus tree overhead — HashSet answers membership in O(1).',
    'Assuming subSet copies: views are live — structural edits to the backing set reflect (and can fail fast).',
    'Null elements with comparators: natural ordering tolerates one null; custom comparators throw — avoid nulls.',
  ],
  vizId: 'bst-ops',
  problemIds: ['hand-of-straights', 'time-based-key-value-store'],
  practiceNote: 'Same two verified drills as TreeMap (ordered counts, neighbour history) — the set API mirrors the map one key-for-key.',
  javaBuiltIn: ['java.util.TreeSet', 'java.util.NavigableSet'],
  related: ['treemap-navigablemap', 'hashset-jcf', 'binary-search-tree'],
};
