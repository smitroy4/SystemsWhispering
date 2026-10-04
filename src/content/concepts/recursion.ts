import type { Topic } from '../../types/content.ts';

/** Recursion and the call stack: base cases, frames, and depth limits. */
export const recursionTopic: Topic = {
  slug: 'recursion-call-stack',
  title: 'Recursion & the Call Stack',
  category: 'concepts',
  order: 3,
  summary: 'Functions that call themselves: base cases stop the descent, stack frames remember the way back, depth is space.',
  level: 'beginner',
  prerequisites: ['stack'],
  sections: [
    {
      heading: 'Functions calling themselves',
      body: 'A **recursive** function solves a smaller copy of its own problem: `fact(n) = n × fact(n − 1)`. Every recursion needs a **base case** (`fact(0) = 1`) that answers directly — without one the calls never stop.\n\nThink in two promises: the base case is trivially right, and each step correctly combines a *correct* smaller answer. If both hold, induction does the rest.',
    },
    {
      heading: 'Frames pile up, then unwind',
      body: 'Each call pushes a **stack frame** (arguments, locals, return address). `fact(4)` stacks five frames before any multiplication happens; results then unwind upward: 1, 1, 2, 6, 24.\n\nSo recursion depth *is* auxiliary space: `O(n)` here, `O(log n)` for halving recursion like binary search. Java has no tail-call optimization — depth ~10⁴ overflows the default stack, and deep recursion must become a loop.',
    },
    {
      heading: 'When recursion fits',
      body: 'Reach for recursion on **self-similar** structures: trees, backtracking decisions, divide-and-conquer splits. Prefer iteration for linear counting, huge depths, or hot loops where call overhead matters.\n\nDebugging tip: print indentation by depth — the call tree becomes visible and missing base cases scream.',
    },
  ],
  complexity: [
    { operation: 'factorial(n) time', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Naive fib(n) time', best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)', space: 'O(n)' },
    { operation: 'Binary search recursion', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(log n)' },
  ],
  javaCode: [
    {
      title: 'Factorial, recursive and iterative',
      description: 'Same answer, different space: O(n) frames vs O(1).',
      code: `public class Factorial {
    static long recursive(int n) {
        if (n <= 1) {
            return 1; // base case: answer directly
        }
        return n * recursive(n - 1); // smaller copy
    }

    static long iterative(int n) {
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(recursive(5)); // 120
        System.out.println(iterative(5)); // 120
    }
}
`,
    },
    {
      title: 'Depth guard in practice',
      description: 'Convert deep recursion to an explicit stack.',
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public class DepthGuard {
    static long sumTo(long n) {
        // Recursion depth n would overflow for large n: loop instead.
        long total = 0;
        Deque<Long> stack = new ArrayDeque<>();
        stack.push(n);
        while (!stack.isEmpty()) {
            long k = stack.pop();
            if (k <= 0) {
                continue;
            }
            total += k;
            stack.push(k - 1);
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sumTo(1_000_000)); // 500000500000, no overflow
    }
}
`,
    },
  ],
  mistakes: [
    'Missing or unreachable base case: infinite descent ends in StackOverflowError, not a wrong answer.',
    'Recursing on the same input: `fib(n)` calling `fib(n)` loops forever — shrink the argument every call.',
    'Assuming Java optimizes tail calls: it does not — deep tail recursion still overflows.',
    'Exponential re-computation: naive fib repeats subtrees — memoize or go bottom-up.',
    'Mutating shared state across branches: backtracking needs undo, or siblings inherit garbage.',
  ],
  vizId: 'recursion-call-stack',
  problemIds: ['fibonacci-number', 'climbing-stairs', 'powx-n'],
};
