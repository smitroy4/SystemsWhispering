import type { Topic } from '../../types/content.ts';

/** Matrix / 2D Arrays: grids, traversal orders, and in-place patterns. */
export const matrix2dArraysTopic: Topic = {
  slug: 'matrix-2d-arrays',
  title: 'Matrix / 2D Arrays',
  category: 'data-structures',
  order: 24,
  summary: 'Arrays of arrays: grids, boards and tables — row-major layout, traversal orders and in-place patterns.',
  level: 'beginner',
  group: 'linear',
  status: 'complete',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'Arrays of arrays — and ragged reality',
      body: 'Java has no true 2D array: `int[][] m = new int[3][4]` builds an array of 3 references, each pointing at its own 4-int row. Rows are independent objects — they can even differ in length (**ragged** arrays like `{{1, 2}, {3}}`).\n\n- `m.length` counts **rows**; `m[i].length` counts columns **of row i**. Mixing them up is the #1 matrix bug.\n- A row can be `null` or shorter than its siblings: always guard with the row’s own length, never assume rectangular.\n- `Arrays.deepToString(m)` prints grids; plain `toString` prints hash codes — the 2D version of the `Arrays.toString` lesson.',
    },
    {
      heading: 'Row-major layout and address math',
      body: 'Each row is one contiguous block (row-major order), but rows need not sit together. Element `m[i][j]` in an R×C grid lives at conceptual offset `i * C + j` from the grid start — which is why indexed access stays `O(1)`.\n\n- Walking a **row** (`m[i][0], m[i][1], …`) strides by 1: every step lands on the next cached element — the fastest possible scan.\n- Walking a **column** (`m[0][j], m[1][j], …`) jumps C elements per step, touching a new cache line almost every time. On large grids column scans run several times slower.\n- Rule of thumb: organise loops so the **last index varies fastest** (`for i, for j`), and transpose the data rather than the loop when you cannot.',
    },
    {
      heading: 'In-place patterns: transpose, rotate, spiral',
      body: 'Three patterns cover most matrix interviews. **Transpose** swaps `m[i][j]` with `m[j][i]` above the diagonal (square only, `O(1)` extra space). **Rotate 90° clockwise** = transpose + reverse each row — the composition trick behind `Rotate Image`. **Spiral order** peels the grid with four shrinking boundaries (top, bottom, left, right); after each wall, check the loop condition again so single rows/columns are not revisited.\n\n`Set Matrix Zeroes` adds the marker-row trick: borrow row 0 and column 0 as `O(1)` flags instead of allocating marker arrays.',
    },
    {
      heading: 'Real-world use',
      body: 'Images are pixel grids; game boards, spreadsheets, and seating charts are matrices. Dynamic programming tables (`edit distance`, `knapsack`) are 2D arrays where cell `[i][j]` answers a subproblem. Graphs store dense connections in adjacency matrices with `O(1)` edge lookup. Machine-learning weights, convolution kernels, and screen buffers are all row-major grids.\n\nReach for a matrix when data has two natural axes and neighbours matter; flatten to 1D with index math (`i * C + j`) when you need cache-tight interop with native code.',
    },
  ],
  complexity: [
    { operation: 'Access m[i][j]', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(R·C)' },
    { operation: 'Row scan / full traversal', best: 'O(R·C)', average: 'O(R·C)', worst: 'O(R·C)', space: 'O(R·C)' },
    { operation: 'Transpose (square, in place)', best: 'O(R·C)', average: 'O(R·C)', worst: 'O(R·C)', space: 'O(1)' },
    { operation: 'Rotate 90° / spiral order', best: 'O(R·C)', average: 'O(R·C)', worst: 'O(R·C)', space: 'O(1)*' },
  ],
  javaCode: [
    {
      title: 'Matrix patterns from scratch',
      description: 'Transpose, rotate-90 via transpose+reverse, and spiral order.',
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MatrixPatterns {
    static void transpose(int[][] m) {
        int n = m.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int tmp = m[i][j];
                m[i][j] = m[j][i];
                m[j][i] = tmp;
            }
        }
    }

    static void reverseRow(int[] row) {
        for (int l = 0, r = row.length - 1; l < r; l++, r--) {
            int tmp = row[l];
            row[l] = row[r];
            row[r] = tmp;
        }
    }

    /** Rotate square matrix 90° clockwise: transpose, then reverse each row. */
    static void rotate90(int[][] m) {
        transpose(m);
        for (int[] row : m) {
            reverseRow(row);
        }
    }

    /** Spiral order with four shrinking walls; re-check bounds after each wall. */
    static List<Integer> spiral(int[][] m) {
        List<Integer> out = new ArrayList<>();
        int top = 0, bottom = m.length - 1;
        int left = 0, right = m[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) out.add(m[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) out.add(m[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) out.add(m[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) out.add(m[i][left]);
                left++;
            }
        }
        return out;
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        System.out.println("spiral=" + spiral(m));
        rotate90(m);
        System.out.println("rotated=" + Arrays.deepToString(m));
    }
}
`,
    },
    {
      title: 'Ragged arrays and deep printing',
      description: 'Rows are independent: mind the lengths, print with deepToString.',
      code: `import java.util.Arrays;

public class RaggedDemo {
    public static void main(String[] args) {
        int[][] ragged = {{1, 2, 3}, {4, 5}, {6}};
        System.out.println(Arrays.deepToString(ragged));

        // Always use the row's own length — never assume rectangular.
        int total = 0;
        for (int i = 0; i < ragged.length; i++) {
            for (int j = 0; j < ragged[i].length; j++) {
                total += ragged[i][j];
            }
        }
        System.out.println("total=" + total);
    }
}
`,
    },
  ],
  mistakes: [
    'Using m.length for columns: m.length counts rows — column count is m[i].length, per row.',
    'Assuming rectangular grids: Java rows can differ in length or be null — guard with the row’s own length.',
    'Printing with toString: grids need Arrays.deepToString(m); plain toString prints reference hashes.',
    'Cloning with m.clone(): it copies the row references, not the rows — mutating the clone mutates the original.',
    'Rotating non-square matrices in place: transpose+reverse only works on squares — use an R×C → C×R output otherwise.',
    'Double-counting spiral corners: re-check top <= bottom and left <= right after every wall, or single rows print twice.',
  ],
  vizId: 'matrix-ops',
  problemIds: ['spiral-matrix', 'rotate-image', 'set-matrix-zeroes'],
  javaBuiltIn: ['java.util.Arrays'],
  related: ['array', 'dynamic-array'],
};
