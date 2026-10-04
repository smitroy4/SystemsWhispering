import type { Topic } from '../../types/content.ts';

/** Big-O notation: naming growth so algorithms can be compared honestly. */
export const bigOTopic: Topic = {
  slug: 'big-o-notation',
  title: 'Big-O & Complexity Analysis',
  category: 'concepts',
  order: 1,
  summary: 'Big-O names how runtime grows with input size. Learn the hierarchy, the drop-the-constants rules, and how to analyze loops and recursion.',
  level: 'beginner',
  prerequisites: [],
  sections: [
    {
      heading: 'What Big-O actually says',
      body: 'Big-O describes **growth**, not speed: how runtime scales as `n` grows. `O(n)` means doubling the input roughly doubles the work; `O(n²)` quadruples it. Constants and slower-growing terms are dropped because at scale the fastest-growing term dominates — an `O(n²)` algorithm with tiny constants still loses to `O(n log n)` once `n` is large.\n\nThe hierarchy to memorize: `O(1)` < `O(log n)` < `O(n)` < `O(n log n)` < `O(n²)` < `O(2ⁿ)` < `O(n!)`. Each step up is a cliff, not a slope.',
    },
    {
      heading: 'Reading code like an analyst',
      body: 'Count how many times the inner work runs as a function of `n`: a single loop is `O(n)`, two nested loops over `n` are `O(n²)`, and halving a range each step (binary search) is `O(log n)`.\n\nSequential blocks add (`O(n) + O(n)` stays `O(n)`), nested blocks multiply. For recursion, draw the call tree: branching factor × depth gives the shape — binary recursion to depth `n` is `O(2ⁿ)`, halving each call is `O(log n)` frames.',
    },
    {
      heading: 'Best, average, worst — and space',
      body: 'Unless stated, Big-O means the **worst case**. Best case flatters (linear search finds index 0 in `O(1)`), average case needs a distribution assumption. Interviews want worst-case time plus **auxiliary space**: the extra memory beyond the input — an `O(n)` time / `O(1)` space scan versus an `O(n)` space hash map is a real tradeoff to discuss out loud.',
    },
  ],
  complexity: [
    { operation: 'Array access / hash lookup', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Binary search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    { operation: 'Sorting (comparison)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(log n)' },
    { operation: 'Nested pair loops', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Timing growth empirically',
      description: 'Measure doubling to feel O(n) vs O(n²) before analyzing.',
      code: `public class GrowthCheck {
    static long scan(int[] a, int target) {
        long steps = 0;
        for (int x : a) {
            steps++;
            if (x == target) {
                break;
            }
        }
        return steps;
    }

    public static void main(String[] args) {
        for (int n = 1000; n <= 8000; n *= 2) {
            int[] a = new int[n];
            a[n - 1] = 1; // worst case: target last
            long t0 = System.nanoTime();
            long steps = scan(a, 1);
            long dt = System.nanoTime() - t0;
            System.out.println("n=" + n + " steps=" + steps + " ns=" + dt);
        }
    }
}
`,
    },
    {
      title: 'Logarithmic halving in code',
      description: 'The shape of every O(log n) loop.',
      code: `public class Halving {
    static int steps(int n) {
        int count = 0;
        while (n > 1) {
            n /= 2;
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(steps(8)); // 3
        System.out.println(steps(1024)); // 10
        System.out.println(steps(1048576)); // 20
    }
}
`,
    },
  ],
  mistakes: [
    'Quoting best case as the answer: interviews mean worst case unless they say otherwise.',
    'Adding nested loops instead of multiplying: sequential O(n) + O(n) is O(n); nested is O(n²).',
    'Ignoring space complexity: an O(n) hash map trades real memory for its O(1) lookups — say so.',
    'Treating constants as decisive: 100n vs n² still loses at n = 101; growth beats tuning.',
    'Calling O(2n) or O(n + 5) a thing: drop constants and slower terms — it is just O(n).',
  ],
  vizId: 'big-o-curves',
  problemIds: ['binary-search', 'two-sum'],
};
