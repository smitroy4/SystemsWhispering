import type { Topic } from '../../types/content.ts';

/** Recursion trees: seeing every call before trusting the recurrence. */
export const recursionTreeTopic: Topic = {
  slug: 'recursion-tree',
  title: 'Recursion Trees',
  category: 'algorithms',
  order: 14,
  summary: 'Draw every call as a node: count them for time, measure depth for space, and spot the repeated work memoization removes.',
  level: 'intermediate',
  prerequisites: ['stack', 'binary-tree'],
  sections: [
    {
      heading: 'The idea',
      body: 'A **recursion tree** draws each call as a node with its children below. `fib(4)` fans out to 9 nodes — you can literally **count time** (nodes) and **read space** (deepest path = call-stack depth).\n\nThe tree also exposes overlap: `fib(2)` appears twice, `fib(1)` three times. Repeated subtrees are the signature that **memoization** will help — cache each distinct call once and the tree collapses to a line.',
    },
    {
      heading: 'How it works',
      body: 'Trace calls depth-first: expand a node into its children, resolve leaves (`fib(0) = 0`, `fib(1) = 1`), then combine upward (`fib(n) = fib(n-1) + fib(n-2)`).\n\n- **Nodes** ≈ time: naive fib grows ~φⁿ (exponential).\n- **Depth** ≈ stack space: O(n) here, O(log n) for halving recurrences.\n- **Distinct nodes** ≈ memoized cost: fib drops to O(n) time with a cache.',
    },
    {
      heading: 'Java notes',
      body: 'Recursion depth is stack depth: default JVM stacks survive thousands of frames, not millions — deep linear recursion (n = 10⁵) overflows, so prefer loops or explicit `ArrayDeque` stacks there.\n\nMemoization in Java is a `HashMap` (or array) checked before recursing and filled after. `Map.computeIfAbsent` expresses it, but beware: recursive `computeIfAbsent` on a `HashMap` throws `ConcurrentModificationException` — check-then-put manually.',
    },
  ],
  complexity: [
    { operation: 'Naive fib(n) time', best: 'O(φⁿ)', average: 'O(φⁿ)', worst: 'O(2ⁿ)', space: 'O(n)' },
    { operation: 'Memoized fib(n)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Fibonacci from scratch',
      description: 'Naive recursion next to its memoized twin.',
      code: `import java.util.HashMap;
import java.util.Map;

public class Fibonacci {
    static long naive(int n) {
        if (n <= 1) {
            return n;
        }
        return naive(n - 1) + naive(n - 2);
    }

    static long memo(int n, Map<Integer, Long> cache) {
        if (n <= 1) {
            return n;
        }
        Long hit = cache.get(n);
        if (hit != null) {
            return hit;
        }
        long value = memo(n - 1, cache) + memo(n - 2, cache);
        cache.put(n, value);
        return value;
    }

    public static void main(String[] args) {
        System.out.println(naive(10)); // 55, ~177 calls
        System.out.println(memo(10, new HashMap<>())); // 55, 19 calls
    }
}
`,
    },
    {
      title: 'Built-in equivalent',
      description: 'Streams iterate; memo caches go in a Map.',
      code: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;

public class FibonacciBuiltIn {
    private static final Map<Integer, Long> CACHE = new ConcurrentHashMap<>();

    static long fib(int n) {
        if (n <= 1) {
            return n;
        }
        Long hit = CACHE.get(n);
        if (hit != null) {
            return hit;
        }
        long value = fib(n - 1) + fib(n - 2);
        CACHE.put(n, value);
        return value;
    }

    public static void main(String[] args) {
        System.out.println(fib(10)); // 55
        long sum = Stream.iterate(new long[]{0, 1}, p -> new long[]{p[1], p[0] + p[1]})
            .limit(10)
            .mapToLong(p -> p[0])
            .sum();
        System.out.println(sum); // 88: iterative stream form
    }
}
`,
    },
  ],
  mistakes: [
    'No base case (or a wrong one): infinite recursion ends in StackOverflowError, not a wrong answer.',
    'Recomputing shared subtrees: exponential blowup hides behind innocent-looking two-branch recursion — memoize.',
    'Recursive `computeIfAbsent`: HashMap forbids reentrant computation — use get/put manually.',
    'Deep linear recursion: depth n = 10⁵ overflows — convert to iteration for line-shaped call trees.',
    'Counting depth as nodes: stack space follows edges (depth), and fib(4) needs 4 frames, not 9.',
  ],
  vizId: 'recursion-tree-steps',
  problemIds: ['fibonacci-number', 'climbing-stairs', 'powx-n'],
};
