import type { Topic } from '../../types/content.ts';

/** Fenwick trees: prefix sums with O(log n) updates in half the code. */
export const fenwickTreeTopic: Topic = {
  slug: 'fenwick-tree',
  title: 'Fenwick Trees (BIT)',
  category: 'data-structures',
  order: 15,
  summary: 'Binary Indexed Trees: prefix sums and point updates in O(log n) with one array and bit tricks.',
  level: 'advanced',
  group: 'non-linear',
  prerequisites: ['array', 'segment-tree'],
  sections: [
    {
      heading: 'Prefix sums that survive updates',
      body: 'Plain **prefix sums** answer range sums in `O(1)` but pay `O(n)` per update. A **Fenwick tree** (Binary Indexed Tree) keeps both operations at `O(log n)` using a single array and one insight: every index is responsible for a block of size **lowbit(i)** — the lowest set bit of `i`.\n\n`bit[i]` stores the sum of `lowbit(i)` elements ending at `i`. Index 4 (100₂) covers 4 elements; index 6 (110₂) covers 2; odd indices cover just themselves.',
    },
    {
      heading: 'Climbing with lowbit jumps',
      body: 'Both operations walk by adding or stripping the lowest set bit:\n\n- **add(i, delta)**: touch `bit[i]`, then `i += i & -i` — jump to the next index whose block includes `i`. Larger blocks, bigger jumps.\n- **prefixSum(i)**: accumulate `bit[i]`, then `i -= i & -i` — strip the covered block and continue below.\n\nEach walk visits `O(log n)` indices. The animation adds +2 at index 3 (touching 3 → 4) then sums the prefix of 5 (touching 5 → 4).',
    },
    {
      heading: 'Half the structure, same power',
      body: 'Compared to segment trees, Fenwick trees use one array of size `n + 1`, need ~15 lines of code, and run faster by constant factors. The price: they only combine **invertible** operations (sums, products, XOR) — range *minimum* needs a segment tree, because min has no inverse for the overlapping-block trick.\n\nRange sum `[l, r]` is just `prefixSum(r) − prefixSum(l − 1)`: two walks, still `O(log n)`.',
    },
    {
      heading: 'Prefix sums: the static contrast',
      body: 'With zero updates, plain prefix sums beat everything: `O(1)` queries, `O(n)` memory, five lines. Fenwick earns its keep the moment updates appear — and unlike segment trees it asks almost nothing in return.',
    },
  ],
  complexity: [
    { operation: 'Prefix sum query', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Point update', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Range sum [l, r]', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Build (n updates)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'FenwickTree from scratch',
      description: 'One array, lowbit walks for add and prefix sum.',
      code: `public class FenwickTree {
    private final int[] bit; // 1-indexed; bit[0] unused

    public FenwickTree(int[] data) {
        bit = new int[data.length + 1];
        for (int i = 0; i < data.length; i++) {
            add(i + 1, data[i]);
        }
    }

    public void add(int index, int delta) {
        for (int i = index; i < bit.length; i += i & -i) {
            bit[i] += delta;
        }
    }

    public int prefixSum(int index) {
        int sum = 0;
        for (int i = index; i > 0; i -= i & -i) {
            sum += bit[i];
        }
        return sum;
    }

    public int rangeSum(int left, int right) {
        return prefixSum(right) - prefixSum(left - 1);
    }

    public static void main(String[] args) {
        FenwickTree ft = new FenwickTree(new int[]{3, 1, 4, 1, 5, 9, 2});
        System.out.println(ft.prefixSum(5)); // 3+1+4+1+5 = 14
        ft.add(3, 2);
        System.out.println(ft.prefixSum(5)); // 16
        System.out.println(ft.rangeSum(2, 4)); // 1+6+1 = 8
    }
}
`,
    },
    {
      title: 'Static prefix sums contrast',
      description: 'Built-in-style equivalent when updates never happen.',
      code: `public class StaticPrefix {
    private final int[] prefix;

    public StaticPrefix(int[] data) {
        prefix = new int[data.length + 1];
        for (int i = 0; i < data.length; i++) {
            prefix[i + 1] = prefix[i] + data[i];
        }
    }

    public int rangeSum(int left, int right) {
        return prefix[right] - prefix[left - 1];
    }

    public static void main(String[] args) {
        StaticPrefix sp = new StaticPrefix(new int[]{3, 1, 4, 1, 5});
        System.out.println(sp.rangeSum(1, 5)); // 14, O(1)
        // But updating index 3 costs O(n) here — that is the BIT use case.
    }
}
`,
    },
  ],
  mistakes: [
    'Using index 0: BIT arrays are 1-indexed — element i lives at bit position i + 1, and bit[0] stays unused.',
    'Writing i & -i wrong: lowbit needs two’s-complement negation — (i & -i) in Java ints, not Math.abs tricks.',
    'Off-by-one range sums: rangeSum(l, r) = prefix(r) − prefix(l − 1) in 1-indexed coordinates.',
    'Expecting range minimum: min is not invertible, so overlapping blocks cannot answer it — use a segment tree.',
    'Sizing bit at exactly n: allocate n + 1 (plus the unused slot 0) or the last update walks off the end.',
    'Updating the raw array instead of add(): every mutation must flow through the tree or queries go stale.',
  ],
  vizId: 'fenwick-ops',
  problemIds: ['range-sum-query-mutable', 'count-of-smaller-numbers-after-self'],
};
