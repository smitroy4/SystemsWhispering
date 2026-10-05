import type { Topic } from '../../types/content.ts';

/** Sqrt Decomposition: plain arrays, block summaries, and the √n sweet spot. */
export const sqrtDecompositionTopic: Topic = {
  slug: 'sqrt-decomposition',
  title: 'Sqrt Decomposition',
  category: 'data-structures',
  order: 34,
  summary: "Split the array into √n blocks: O(√n) range queries with plain arrays — Mo's algorithm's quiet cousin.",
  level: 'advanced',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'Blocks between brute force and trees',
      body: '**Sqrt decomposition** splits an array of n elements into blocks of ~√n, precomputing one summary (sum, min, max) per block. A range query then combines three parts: the partial left edge (scanned directly), the fully covered blocks (summaries, `O(1)` each), and the partial right edge.\n\nAt most two partial edges (`O(√n)` each) plus `O(√n)` whole blocks → `O(√n)` per query. Point updates touch one element and recompute its block summary in `O(√n)` (or `O(1)` for sums with a delta). No pointers, no rotations — two plain arrays.',
    },
    {
      heading: 'How it lives in memory',
      body: 'The array itself plus a `block[]` summary array of ~√n entries — `O(n)` total with a tiny constant. Block size `S ≈ √n` balances the two costs: smaller blocks mean more whole-block summaries per query; larger blocks mean longer edge scans. The optimum equalises them at √n.\n\n- Sums support `O(1)` updates via deltas (`block[b] += delta`); min/max recompute the block by scanning `S` elements.\n- **Lazy blocks** extend the idea to range adds: store a pending `add[b]` per block and apply it on touch — baby segment-tree laziness without the tree.\n- Everything is index arithmetic (`blockOf(i) = i / S`): the whole structure is ~30 lines with zero allocations after construction.',
    },
    {
      heading: 'Queries: edges plus summaries',
      body: 'Range sum `[l, r]`: if both ends share a block, scan directly. Otherwise scan `l` to its block end, add whole-block summaries between, and scan the last block’s start to `r`. Each step is a tight loop over contiguous memory — the constant factor embarrasses pointer-heavy trees on moderate n.\n\nThe animation queries `[2, 7]` over 9 elements in blocks of 3: partial scan of block 0’s tail, one whole-block summary, partial scan of block 2’s head — then a point update recomputing one summary.',
    },
    {
      heading: 'Real-world use',
      body: 'Mo’s algorithm (offline range queries) is sqrt decomposition over *queries*: reorder them into blocks for cache-friendly processing. Database page statistics, game-leaderboard shards, and analytics over append-mostly logs all pre-aggregate per block. Competitive programmers reach for it when a segment tree’s `O(log n)` is overkill to write — sqrt decomposition ships in minutes and passes moderate constraints.\n\nReach for blocks when `O(√n)` fits the limits and simplicity matters; reach for Fenwick/segment trees when `log n` is required or operations need lazy composition beyond simple adds.',
    },
  ],
  complexity: [
    { operation: 'Preprocessing (block summaries)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Range query (sum / min / max)', best: 'O(√n)', average: 'O(√n)', worst: 'O(√n)', space: 'O(n)' },
    { operation: 'Point update', best: 'O(1)*', average: 'O(√n)', worst: 'O(√n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'SqrtDecomposition from scratch',
      description: 'Block summaries over a plain array: edges scanned, middles skipped.',
      code: `public class SqrtDecomposition {
    private final int[] a;
    private final long[] block;
    private final int blockSize;

    public SqrtDecomposition(int[] data) {
        this.a = data.clone();
        this.blockSize = Math.max(1, (int) Math.sqrt(a.length));
        int blocks = (a.length + blockSize - 1) / blockSize;
        this.block = new long[blocks];
        for (int i = 0; i < a.length; i++) {
            block[i / blockSize] += a[i];
        }
    }

    /** Sum over inclusive [l, r]: partial edges scanned, whole blocks added. */
    public long rangeSum(int l, int r) {
        long sum = 0;
        int startBlock = l / blockSize;
        int endBlock = r / blockSize;
        if (startBlock == endBlock) {
            for (int i = l; i <= r; i++) {
                sum += a[i];
            }
            return sum;
        }
        int leftEnd = (startBlock + 1) * blockSize - 1;
        for (int i = l; i <= leftEnd; i++) {
            sum += a[i];
        }
        for (int b = startBlock + 1; b <= endBlock - 1; b++) {
            sum += block[b];
        }
        for (int i = endBlock * blockSize; i <= r; i++) {
            sum += a[i];
        }
        return sum;
    }

    public void pointUpdate(int i, int value) {
        block[i / blockSize] += (long) value - a[i];
        a[i] = value;
    }

    public static void main(String[] args) {
        SqrtDecomposition sd = new SqrtDecomposition(
            new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9});
        System.out.println("sum[2..7]=" + sd.rangeSum(2, 7)); // 33
        sd.pointUpdate(4, 10);
        System.out.println("sum[2..7]=" + sd.rangeSum(2, 7)); // 38
    }
}
`,
    },
    {
      title: 'Block minimum variant',
      description: 'Min needs block rescans on update — the sum/min asymmetry.',
      code: `import java.util.Arrays;

public class SqrtMin {
    private final int[] a;
    private final int[] blockMin;
    private final int blockSize;

    public SqrtMin(int[] data) {
        this.a = data.clone();
        this.blockSize = Math.max(1, (int) Math.sqrt(a.length));
        int blocks = (a.length + blockSize - 1) / blockSize;
        this.blockMin = new int[blocks];
        Arrays.fill(blockMin, Integer.MAX_VALUE);
        for (int i = 0; i < a.length; i++) {
            blockMin[i / blockSize] = Math.min(blockMin[i / blockSize], a[i]);
        }
    }

    public void pointUpdate(int i, int value) {
        a[i] = value;
        int b = i / blockSize; // min cannot delta-update: rescan the block
        int best = Integer.MAX_VALUE;
        int end = Math.min(a.length, (b + 1) * blockSize);
        for (int j = b * blockSize; j < end; j++) {
            best = Math.min(best, a[j]);
        }
        blockMin[b] = best;
    }

    public static void main(String[] args) {
        SqrtMin m = new SqrtMin(new int[]{5, 1, 4, 2, 8});
        m.pointUpdate(1, 7);
        System.out.println("block0 min=" + m.blockMin[0]); // 4
    }
}
`,
    },
  ],
  mistakes: [
    'Sizing blocks at n/2 or n/10 by guess: the optimum equalises edge scans and block count — start at √n, tune only with measurement.',
    'Delta-updating a min/max block: only invertible ops (sum, xor) support deltas — min/max must rescan the block.',
    'Off-by-one block ends: block b spans [b·S, min(n, (b+1)·S)) — clamp the last block or updates walk off the array.',
    'Scanning whole blocks element-wise: the summary array is the point — touching every element makes it brute force with extra steps.',
    'Using it where O(log n) is required: √n loses past ~10^6 queries — know the constraint crossover before committing.',
    'Rebuilding summaries per query: blocks are maintained on update — recomputing them per query turns O(√n) into O(n).',
  ],
  vizId: 'sqrt-decomp-ops',
  problemIds: ['range-sum-query-mutable', 'range-sum-query-immutable'],
  related: ['array', 'segment-tree', 'fenwick-tree'],
};
