import type { Topic } from '../../types/content.ts';

/** Sparse Table: O(1) range queries on static arrays via power-of-two jumps. */
export const sparseTableTopic: Topic = {
  slug: 'sparse-table',
  title: 'Sparse Table',
  category: 'data-structures',
  order: 23,
  summary: 'Precomputed power-of-two intervals for O(1) range queries on static arrays — RMQ without a tree.',
  level: 'intermediate',
  group: 'linear',
  status: 'complete',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'Answers precomputed, queries instant',
      body: 'A **sparse table** preprocesses a *static* array so range queries answer in `O(1)`. Cell `st[k][i]` stores the answer (min, max, gcd, …) over the length-`2^k` interval starting at `i`. Build it bottom-up: `st[0][i]` is the array itself, and `st[k][i] = combine(st[k-1][i], st[k-1][i + 2^(k-1)])` — each row halves the work by merging two half-intervals.\n\nQueries exploit **overlap**: for range length `len`, take `k = floor(log2(len))` and combine the two length-`2^k` blocks `st[k][l]` and `st[k][r - 2^k + 1]`. They cover `[l, r]` completely (overlapping in the middle), so any **idempotent** operation — min, max, gcd, AND, OR — returns the exact answer with two lookups.',
    },
    {
      heading: 'How it lives in memory',
      body: 'A dense 2D array of `K × n` cells where `K = floor(log2(n)) + 1` — about `n log n` integers, all contiguous per row. No pointers, no tree overhead, extremely cache-friendly.\n\n- Precompute integer `log2` values once (`lg[i] = lg[i/2] + 1`) so queries avoid floating-point `Math.log` entirely.\n- Memory is the tradeoff: ~17 rows for n = 100,000. When memory is tight or the array changes, Fenwick/Segment trees win.\n- The table is **write-once**: any point update invalidates `O(log n)` rows per affected column — rebuilding costs `O(n log n)`, which is why the structure demands static data.',
    },
    {
      heading: 'Idempotent only: the overlap contract',
      body: 'Overlap is free *only* when combining a range with itself changes nothing: `min(a, a) = a`, `gcd(a, a) = a`. Sum is **not** idempotent (`sum + sum` double-counts the overlap), so sparse tables cannot answer range sums — use prefix sums for static sums, Fenwick/segment trees for dynamic ones.\n\nInterview framing: static array + many range-min/max queries → sparse table; point updates appear → segment tree or Fenwick; sums on static data → prefix sums. Naming the right tool from the constraints is the skill being tested.',
    },
    {
      heading: 'Real-world use',
      body: 'Range-minimum queries power LCA algorithms (Euler tour + RMQ), Cartesian trees, and suffix-array LCP queries. Genomics pipelines query GC-content minima over static sequences. Game engines precompute visibility/heightfield minima over static terrain. Anywhere data is frozen and queries are hot, `O(n log n)` preprocessing buys `O(1)` answers.\n\nReach for sparse tables when data never changes and queries number in the millions; reach for segment trees the moment a single update is possible.',
    },
  ],
  complexity: [
    { operation: 'Preprocessing (build)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n log n)' },
    { operation: 'Range query (idempotent op)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n log n)' },
    { operation: 'Point update', best: 'O(n log n)*', average: 'O(n log n)*', worst: 'O(n log n)*', space: 'O(n log n)' },
  ],
  javaCode: [
    {
      title: 'SparseTable from scratch',
      description: 'Power-of-two rows, precomputed logs, overlapping O(1) RMQ.',
      code: `public class SparseTable {
    private final int[][] st; // st[k][i] = min over [i, i + 2^k)
    private final int[] log;  // floor(log2) for every length

    public SparseTable(int[] a) {
        int n = a.length;
        int levels = 32 - Integer.numberOfLeadingZeros(n); // floor(log2(n)) + 1
        st = new int[levels][n];
        System.arraycopy(a, 0, st[0], 0, n);
        for (int k = 1; k < levels; k++) {
            for (int i = 0; i + (1 << k) <= n; i++) {
                st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
            }
        }
        log = new int[n + 1];
        for (int i = 2; i <= n; i++) {
            log[i] = log[i / 2] + 1;
        }
    }

    /** Minimum over inclusive [l, r] via two overlapping blocks. */
    public int rangeMin(int l, int r) {
        int k = log[r - l + 1];
        return Math.min(st[k][l], st[k][r - (1 << k) + 1]);
    }

    public static void main(String[] args) {
        SparseTable t = new SparseTable(new int[]{3, 1, 4, 1, 5, 9, 2, 6});
        System.out.println("min[2..6]=" + t.rangeMin(2, 6)); // 1
        System.out.println("min[0..7]=" + t.rangeMin(0, 7)); // 1
        System.out.println("min[4..5]=" + t.rangeMin(4, 5)); // 5
    }
}
`,
    },
    {
      title: 'Static prefix sums contrast',
      description: 'Sums are not idempotent — static range sums belong to prefix sums.',
      code: `public class PrefixContrast {
    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6};
        int[] pref = new int[a.length + 1];
        for (int i = 0; i < a.length; i++) {
            pref[i + 1] = pref[i] + a[i];
        }
        int l = 2, r = 6;
        System.out.println("sum[2..6]=" + (pref[r + 1] - pref[l])); // 21
        // Overlap trick would double-count here: sum is NOT idempotent.
    }
}
`,
    },
  ],
  mistakes: [
    'Using it for range sums: overlap double-counts — sums need prefix sums (static) or Fenwick/segment trees (dynamic).',
    'Calling Math.log per query: floating point is slow and inexact — precompute integer logs once in O(n).',
    'Off-by-one in row bounds: row k is only valid for i + 2^k <= n — filling past that reads garbage.',
    'Forgetting the data is frozen: a single point update costs a rebuild — updates mean segment/Fenwick territory.',
    'Sizing rows with floating logs: use 32 - numberOfLeadingZeros(n) for exact level counts, never (int)(log/ln2).',
    'Querying empty ranges: r < l makes log[r - l + 1] index garbage — validate l <= r before the lookup.',
  ],
  vizId: 'sparse-table-ops',
  problemIds: [],
  practiceNote: 'Concept-level topic: our verified bank holds no static range-minimum drill — Range Sum Query - Immutable (under Arrays) practices the same preprocess-once spirit via prefix sums.',
  related: ['array', 'segment-tree', 'fenwick-tree'],
};
