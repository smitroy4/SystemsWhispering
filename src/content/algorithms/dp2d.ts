import type { Topic } from '../../types/content.ts';

/** 2D dynamic programming: grids where each cell combines top and left. */
export const dp2dTopic: Topic = {
  slug: 'dynamic-programming-2d',
  title: '2D Dynamic Programming',
  category: 'algorithms',
  order: 27,
  summary: 'Tables with two dimensions: unique paths, edit distance, and LCS share one fill order — row by row, top and left first.',
  level: 'intermediate',
  prerequisites: ['dynamic-programming-1d', 'array'],
  sections: [
    {
      heading: 'The idea',
      body: 'When state needs two coordinates — grid position, two string indices — the table becomes 2D. Unique Paths: `dp[r][c] = dp[r-1][c] + dp[r][c-1]` (arrive from above or left). First row and column are all 1s: only one route hugs an edge.\n\nThe animation fills a 3×3 grid row by row; `dp[2][2] = 6` drops out with zero thought about paths themselves.',
    },
    {
      heading: 'How it works',
      body: 'Seed the borders, then iterate rows outer / columns inner so top and left are always ready. That fill order *is* the topological order of the dependency DAG.\n\n- **Time O(rows · cols)**, **space O(rows · cols)** — compressible to O(cols) by keeping one row (plus care for in-place overwrites).\n- LCS/edit-distance share the skeleton with different combines: match → diagonal + 1, else max of top/left (LCS) or 1 + min of three neighbors (edit distance).',
    },
    {
      heading: 'Java notes',
      body: 'Tables are `int[][]`/`long[][]`; initialize borders in dedicated loops before the double loop — mixing seeding into the recurrence breeds off-by-ones. For counting paths in huge grids, take modulo 1_000_000_007 per cell.\n\n`Arrays.fill(row, 1)` seeds rows fast; `Arrays.stream(dp).mapToInt(...)` sums for debugging. Obstacle variants just zero blocked cells before combining.',
    },
  ],
  complexity: [
    { operation: 'Fill R×C table', best: 'O(R·C)', average: 'O(R·C)', worst: 'O(R·C)', space: 'O(R·C)' },
    { operation: 'Space-optimized row', best: 'O(R·C)', average: 'O(R·C)', worst: 'O(R·C)', space: 'O(C)' },
  ],
  javaCode: [
    {
      title: 'Unique paths from scratch',
      description: 'Border seeding plus top+left combine.',
      code: `public class UniquePaths {
    static int count(int rows, int cols) {
        int[][] dp = new int[rows][cols];
        for (int r = 0; r < rows; r++) {
            dp[r][0] = 1;
        }
        for (int c = 0; c < cols; c++) {
            dp[0][c] = 1;
        }
        for (int r = 1; r < rows; r++) {
            for (int c = 1; c < cols; c++) {
                dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
            }
        }
        return dp[rows - 1][cols - 1];
    }

    public static void main(String[] args) {
        System.out.println(count(3, 3)); // 6
        System.out.println(count(3, 7)); // 28
    }
}
`,
    },
    {
      title: 'LCS variant',
      description: 'Same skeleton, diagonal-match combine.',
      code: `public class Lcs {
    static int length(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[a.length()][b.length()];
    }

    public static void main(String[] args) {
        System.out.println(length("abcde", "ace")); // 3
    }
}
`,
    },
  ],
  mistakes: [
    'Filling before seeding borders: the recurrence reads unseeded neighbors — seed edges first, always.',
    'Swapping row/column loop order carelessly: fine for full tables, fatal for space-optimized rows (overwrite direction matters).',
    'Off-by-one string tables: dp has an extra zero-row/column — index text with `i - 1`, table with `i`.',
    'int overflow on path counts: grids explode combinatorially — use long or modulo.',
    'Recomputing instead of tabulating: recursion without memo on grids re-solves exponentially many overlaps.',
  ],
  vizId: 'dp-2d-steps',
  problemIds: ['unique-paths', 'longest-common-subsequence', 'edit-distance', 'minimum-path-sum'],
};
