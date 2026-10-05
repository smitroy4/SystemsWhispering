import type { Topic } from '../../types/content.ts';

/** Segment trees: range queries and point updates in O(log n). */
export const segmentTreeTopic: Topic = {
  slug: 'segment-tree',
  title: 'Segment Trees',
  category: 'data-structures',
  order: 14,
  summary: 'A binary tree over array intervals: range sums, minimums, and point updates — all in O(log n).',
  level: 'advanced',
  group: 'non-linear',
  prerequisites: ['binary-tree', 'array'],
  sections: [
    {
      heading: 'A tree over intervals',
      body: 'A **segment tree** stores an array so that any interval question — sum, minimum, maximum over `[l, r]` — answers in `O(log n)`. The root covers the whole array; each node splits its interval in half until leaves hold single elements.\n\nInternal nodes cache the **combination** of their children (sums here, but min/max/gcd work the same). A query visits at most ~4 nodes per level, touching `O(log n)` of them.',
    },
    {
      heading: 'How segment trees live in memory',
      body: 'The classic build is a flat array of size `4n` (safe for any `n`): node 1 is the root, children of `i` at `2i` and `2i + 1`. Building takes `O(n)` bottom-up.\n\n- **Query** `[l, r]`: recurse — skip nodes outside the range, take nodes fully inside, split partial overlaps. At most `O(log n)` taken nodes.\n- **Point update**: walk to the leaf and recompute every ancestor on the way back up — one path, `O(log n)`.\n- Memory is the tax: up to 4× the array for the 1-indexed layout (2× with power-of-two iterative builds).',
    },
    {
      heading: 'When to choose (and skip) segment trees',
      body: 'Reach for segment trees when you need **both** range queries and point updates. If the array never changes, a `O(n)` **prefix-sum** array answers each query in `O(1)` with a tenth of the code. If updates only add values, a **Fenwick tree** does the same job in half the memory.\n\nThe animation queries sum(1, 3) on [2, 5, 1, 8, 3]: partial nodes split, full nodes are taken, outside nodes are skipped.',
    },
    {
      heading: 'Prefix sums: the static built-in-style equivalent',
      body: 'Without updates, `prefix[i + 1] = prefix[i] + a[i]` turns every range sum into `prefix[r + 1] - prefix[l]` — `O(1)` per query after `O(n)` setup. It is the first tool to try; segment trees earn their complexity only once updates enter the picture.',
    },
  ],
  complexity: [
    { operation: 'Build', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Range query', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Point update', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'SegmentTree from scratch',
      description: 'Recursive build, range-sum query, and point update.',
      code: `public class SegmentTree {
    private final int[] tree;
    private final int n;

    public SegmentTree(int[] data) {
        n = data.length;
        tree = new int[4 * n];
        build(1, 0, n - 1, data);
    }

    private void build(int node, int lo, int hi, int[] data) {
        if (lo == hi) {
            tree[node] = data[lo];
            return;
        }
        int mid = (lo + hi) / 2;
        build(2 * node, lo, mid, data);
        build(2 * node + 1, mid + 1, hi, data);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public int query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }

    private int query(int node, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) {
            return 0; // outside: identity for sum
        }
        if (l <= lo && hi <= r) {
            return tree[node]; // fully inside: take it
        }
        int mid = (lo + hi) / 2;
        return query(2 * node, lo, mid, l, r)
             + query(2 * node + 1, mid + 1, hi, l, r);
    }

    public void update(int index, int value) {
        update(1, 0, n - 1, index, value);
    }

    private void update(int node, int lo, int hi, int index, int value) {
        if (lo == hi) {
            tree[node] = value;
            return;
        }
        int mid = (lo + hi) / 2;
        if (index <= mid) {
            update(2 * node, lo, mid, index, value);
        } else {
            update(2 * node + 1, mid + 1, hi, index, value);
        }
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public static void main(String[] args) {
        SegmentTree st = new SegmentTree(new int[]{2, 5, 1, 8, 3});
        System.out.println(st.query(1, 3)); // 5 + 1 + 8 = 14
        st.update(2, 10);
        System.out.println(st.query(1, 3)); // 5 + 10 + 8 = 23
    }
}
`,
    },
    {
      title: 'Prefix sums for static arrays',
      description: 'Built-in-style equivalent when no updates are needed.',
      code: `public class RangeSumStatic {
    private final int[] prefix;

    public RangeSumStatic(int[] data) {
        prefix = new int[data.length + 1];
        for (int i = 0; i < data.length; i++) {
            prefix[i + 1] = prefix[i] + data[i];
        }
    }

    public int query(int l, int r) {
        return prefix[r + 1] - prefix[l];
    }

    public static void main(String[] args) {
        RangeSumStatic rs = new RangeSumStatic(new int[]{2, 5, 1, 8, 3});
        System.out.println(rs.query(1, 3)); // 14
    }
}
`,
    },
  ],
  mistakes: [
    'Wrong identity for out-of-range: sum uses 0, min uses +∞, max uses −∞ — mixing them up poisons every query.',
    'Sizing the tree at 2n for arbitrary n: the 1-indexed recursive layout needs up to 4n — undersizing corrupts silently.',
    'Forgetting to recompute on the way up after update: ancestors keep stale aggregates forever.',
    'Inclusive/exclusive confusion: this layout uses closed [lo, hi] everywhere — one half-open call breaks splits.',
    'Recursing into both children unconditionally: the outside-check must come first or queries degrade to O(n).',
    'Using segment trees for static data: prefix sums are shorter, faster, and bug-resistant — upgrade only for updates.',
  ],
  vizId: 'segment-tree-query',
  problemIds: ['range-sum-query-mutable', 'range-sum-query-immutable'],
};
