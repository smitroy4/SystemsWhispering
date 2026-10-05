import type { Topic } from '../../types/content.ts';

/** Streams with Collections: pipelines over data — laziness, collectors, and costs. */
export const streamsWithCollectionsTopic: Topic = {
  slug: 'streams-with-collections',
  title: 'Streams with Collections',
  category: 'data-structures',
  order: 53,
  summary: 'From loops to pipelines: filter/map/collect, groupingBy, and when streams cost more than they save.',
  level: 'intermediate',
  group: 'collections',
  status: 'complete',
  prerequisites: ['collections-framework'],
  choiceBox: {
    choose: [
      'Multi-stage transforms: filter → map → collect reads as the dataflow it is.',
      'Grouping/partitioning: `groupingBy`/`partitioningBy` replace nested-loop buckets.',
      'Parallelism over huge CPU-bound datasets: `parallelStream` with associative, stateless ops.',
    ],
    avoid: [
      'Hot tiny loops — pipeline setup dwarfs the work; indexed loops win under ~thousands of elements.',
      'Checked exceptions inside lambdas — wrap or extract; streams don’t declare them.',
      'Side-effectful forEach as “a loop” — ordering and parallelism make it a trap; prefer for-each or collectors.',
    ],
  },
  sections: [
    {
      heading: 'Source, pipeline, terminal',
      body: 'A stream is a **lazy pipeline**: a source (`list.stream()`), zero or more intermediate ops (`filter`, `map`, `sorted`, `distinct`, `limit` — all lazy, fused into as few passes as possible), and one terminal op (`collect`, `forEach`, `reduce`, `count`, `findFirst`) that fires execution.\n\n- Laziness means `filter` never builds an intermediate list — elements flow one at a time (short-circuiting terminals like `findFirst` may never touch the tail).\n- Streams are **single-use**: a terminal op closes the pipeline; reuse throws `IllegalStateException`.\n- Order follows the source for ordered collections (`ArrayList`, `LinkedHashSet`); `HashSet` streams arrive unordered.',
    },
    {
      heading: 'Collectors: the vocabulary of results',
      body: '`toList`/`toSet` gather; `toMap(keyFn, valueFn)` builds maps (with a merge function for key collisions); `groupingBy` buckets into `Map<K, List<V>>`; `partitioningBy` splits booleans; `joining` concatenates strings; `summarizingInt` computes count/sum/min/max in one pass.\n\n- `toMap` without a merge throws on duplicate keys — decide the collision policy up front.\n- `groupingBy` with a downstream collector (`counting()`, `mapping()`) aggregates per bucket without intermediate lists.',
    },
    {
      heading: 'When streams cost more than they save',
      body: 'Every pipeline allocates (spliterators, lambdas, nodes) — for small n an indexed loop is 2–5× faster and debuggable line-by-line. Parallel streams add fork/join splitting: speedups need large n, CPU-bound stateless work, and associative reductions; boxing, I/O, or tiny inputs make them *slower* than sequential.\n\n- Primitive streams (`IntStream`, `mapToInt`) dodge boxing — prefer them for numerics.\n- `sorted()` on a stream is a full barrier (buffers everything); sorting the list once and streaming after is usually cheaper.',
    },
    {
      heading: 'Streams and collection views',
      body: '`map.keySet().stream()` / `entrySet().stream()` pipeline over maps without copying. `subList` streams bound the range. But streams over *live views* inherit fail-fast: structural change mid-pipeline throws — snapshot (`copyOf`) or collect first when the source mutates during processing.',
    },
  ],
  complexity: [
    { operation: 'filter / map (per element)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'sorted() barrier', best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'collect toList / toSet', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'groupingBy (n elements)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Pipeline idioms: transform, group, join',
      description: 'The three shapes behind most stream code.',
      code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamIdioms {
    record City(String name, String region, int population) {
    }

    public static void main(String[] args) {
        List<City> cities = List.of(
            new City("Lyon", "east", 500_000),
            new City("Nice", "south", 340_000),
            new City("Brest", "west", 140_000),
            new City("Dijon", "east", 150_000));

        // Big eastern cities, names joined — filter → map → terminal.
        String big = cities.stream()
            .filter(c -> c.population() > 200_000)
            .map(City::name)
            .collect(Collectors.joining(", "));
        System.out.println(big); // Lyon, Nice

        // Group by region in one pass.
        Map<String, List<City>> byRegion = cities.stream()
            .collect(Collectors.groupingBy(City::region));
        System.out.println(byRegion.keySet()); // [east, south, west]
    }
}
`,
    },
    {
      title: 'toMap with merge + primitive sums',
      description: 'Collision policy up front; IntStream against boxing.',
      code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamMaps {
    public static void main(String[] args) {
        List<String> words = List.of("ash", "birch", "avocado", "cedar");

        // Duplicate keys need a merge function — here lengths must agree.
        Map<Character, String> byInitial = words.stream()
            .collect(Collectors.toMap(
                w -> w.charAt(0), w -> w, (a, b) -> a + "/" + b));
        System.out.println(byInitial); // {a=ash/avocado, b=birch, c=cedar}

        // Primitive stream: no boxing, one pass.
        int total = words.stream().mapToInt(String::length).sum();
        System.out.println("chars=" + total); // 3+5+7+5 = 20
    }
}
`,
    },
  ],
  mistakes: [
    'Reusing a stream: terminals close pipelines — second use throws IllegalStateException; rebuild from the source.',
    'toMap without merge on duplicate keys: IllegalStateException — supply the collision function always.',
    'Side effects in forEach with parallel streams: encounter order vanishes — collect, then act, or stay sequential.',
    'Streaming HashSet expecting order: unordered source, unordered results — order needs List/LinkedHashSet/TreeSet sources.',
    'Mutating the source mid-pipeline: fail-fast fires — snapshot with copyOf before streaming over changing data.',
    'parallelStream on small or boxing-heavy work: fork/join overhead plus boxing loses to a plain loop — measure first.',
  ],
  vizId: 'streams-pipeline',
  problemIds: [],
  practiceNote: 'Style topic: no verified drill isolates streams — rewrite any loop-based solution (Two Sum tallies, grouping anagrams) as a pipeline for practice.',
  javaBuiltIn: ['java.util.stream.Stream', 'java.util.stream.Collectors'],
  related: ['collections-framework', 'immutable-collections', 'iterable-iterator'],
};
