import type { Topic } from '../../types/content.ts';

/** Greedy: locally optimal choices with a proof they stay global. */
export const greedyTopic: Topic = {
  slug: 'greedy',
  title: 'Greedy Algorithms',
  category: 'algorithms',
  order: 17,
  summary: 'Take the best-looking step and never look back. Works only with optimal substructure + the greedy-choice property — Jump Game shows both.',
  level: 'intermediate',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'A **greedy** algorithm picks the locally best move at each step and never reconsiders. No backtracking, no memo table — just forward motion. Jump Game II is the canonical demo: from each position, track how far you *could* reach, and jump exactly when you exhaust the current leap.\n\nGreedy is a bet, not a method: it pays only when a **greedy-choice property** holds (some optimal solution starts with this move) plus **optimal substructure** (the rest is optimal for what remains).',
    },
    {
      heading: 'How it works: minimum jumps',
      body: 'Walk `i` from 0: maintain `farthest` (max reach seen) and `end` (edge of the current jump). When `i` passes `end`, you must jump: `jumps++`, `end = farthest`.\n\n- On `[2, 3, 1, 1, 4]`: reach stretches 2 → 4 at i = 1, forcing jump 1; landing covers the end — answer 2.\n- **Time O(n)**, **space O(1)** — one pass, three variables.\n- Classic siblings: activity selection (earliest finish first), fractional knapsack (best ratio first), coin change on canonical denominations.',
    },
    {
      heading: 'Java notes',
      body: 'Greedy loops are index arithmetic withrunning bests — `Math.max` chains and early termination. Sorting by the right key (finish time, ratio, start) *is* the algorithm in scheduling variants: `Arrays.sort` with `Comparator.comparingInt` first, then one sweep.\n\nProve before coding: exhibit the exchange argument (any optimal solution can take this step first). Skipping the proof is how greedy solutions fail hidden tests.',
    },
  ],
  complexity: [
    { operation: 'Jump Game II', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'Activity selection (sorted)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Jump Game II from scratch',
      description: 'Farthest-reach tracking with jump-on-exhaustion.',
      code: `public class JumpGame {
    static int minJumps(int[] nums) {
        int jumps = 0;
        int end = 0;
        int farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == end) {
                jumps++;
                end = farthest;
            }
        }
        return jumps;
    }

    public static void main(String[] args) {
        System.out.println(minJumps(new int[]{2, 3, 1, 1, 4})); // 2
        System.out.println(minJumps(new int[]{2, 3, 0, 1, 4})); // 2
    }
}
`,
    },
    {
      title: 'Activity selection variant',
      description: 'Same greed, different key: earliest finish first.',
      code: `import java.util.Arrays;
import java.util.Comparator;

public class ActivitySelection {
    static int maxActivities(int[][] meetings) {
        Arrays.sort(meetings, Comparator.comparingInt(m -> m[1]));
        int count = 0;
        int lastEnd = Integer.MIN_VALUE;
        for (int[] m : meetings) {
            if (m[0] >= lastEnd) {
                count++;
                lastEnd = m[1];
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[][] meetings = {{1, 3}, {2, 4}, {3, 5}, {0, 6}};
        System.out.println(maxActivities(meetings)); // 2
    }
}
`,
    },
  ],
  mistakes: [
    'Assuming greed works: without the exchange argument it is a guess — test against brute force on small inputs.',
    'Updating `end` before counting the jump: exhaust first (`i == end`), then extend — order matters.',
    'Looping to the last index: the final position needs no jump — stop at `n - 1`.',
    'Sorting activities by start time: earliest *finish* is the key that frees the room soonest.',
    'Using `int` reach on huge jumps: `i + nums[i]` can overflow — promote to long when constraints allow.',
  ],
  vizId: 'greedy-steps',
  problemIds: ['jump-game', 'jump-game-ii', 'assign-cookies'],
};
