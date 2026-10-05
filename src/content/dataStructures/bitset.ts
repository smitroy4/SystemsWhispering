import type { Topic } from '../../types/content.ts';

/** Bitset & BitSet: whole sets in a handful of machine words. */
export const bitsetTopic: Topic = {
  slug: 'bitset',
  title: 'Bitset & BitSet',
  category: 'data-structures',
  order: 25,
  summary: 'A set of bits packed into words — membership, sieves and flags in n/64 words of memory.',
  level: 'beginner',
  group: 'linear',
  status: 'complete',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'A set that is just bits',
      body: 'A **bitset** represents the set `{3, 10, 15}` as sixteen switches with three flipped on: bit `i` is 1 exactly when `i` is a member. Membership, insertion, and deletion collapse to single bit operations — `set`, `clear`, `get` — each `O(1)`.\n\nThe payoff is density: 1,000,000 flags fit in ~125 KB instead of megabytes of `boolean[]` (one byte each) or `HashSet` nodes. Set algebra goes word-parallel too: union, intersection, and difference process 64 members per CPU instruction via `OR`, `AND`, `AND-NOT`.',
    },
    {
      heading: 'How it lives in memory',
      body: 'One `long[]` of `ceil(n / 64)` words. Bit `i` lives in word `i / 64` (shift right by 6) at offset `i % 64` (mask with 63): `words[i >>> 6] |= (1L << i)` sets it.\n\n- `java.util.BitSet` grows automatically and tracks its logical size; a hand-rolled `long[]` stays fixed — size the words up front.\n- Iteration runs over *set* bits (`nextSetBit`), skipping zeros without scanning them — sparse sets stay fast.\n- Bits beyond the logical size must read 0: mask the tail word after bulk ops, or `length()` and `equals` lie.',
    },
    {
      heading: 'Bit tricks that matter',
      body: 'Three idioms cover most bit work. **Test**: `(words[w] & (1L << b)) != 0`. **Popcount**: `Long.bitCount` sums a word in hardware — counting set bits across the array beats any loop. **Lowest set bit**: `x & -x` isolates it, the engine behind Fenwick trees and power-of-two checks.\n\n`Single Number` (XOR cancels pairs), `Number of 1 Bits`, and `Counting Bits` are the canonical drills: each is one insight about what bits remember when values cancel out.',
    },
    {
      heading: 'Real-world use',
      body: 'Prime sieves mark composites in bit arrays. Databases and search engines store posting lists and Bloom-filter backing bits. Graphics and game engines pack entity flags, permissions, and chess boards (bitboards evaluate moves 64 squares at a time) into words. Feature flags, visited sets in BFS over small graphs, and `EnumSet` — a bit-vector `Set` — all ride the same idea.\n\nReach for bits when the universe is small integers and memory or speed dominates; reach for `HashSet` when members are arbitrary objects or the range is unbounded.',
    },
  ],
  complexity: [
    { operation: 'set / clear / get (one bit)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n/64 words)' },
    { operation: 'Union / intersect / xor (all words)', best: 'O(n/64)', average: 'O(n/64)', worst: 'O(n/64)', space: 'O(n/64 words)' },
    { operation: 'Popcount / nextSetBit scan', best: 'O(1)', average: 'O(n/64)', worst: 'O(n/64)', space: 'O(n/64 words)' },
  ],
  javaCode: [
    {
      title: 'BitSet from scratch',
      description: 'Word array, shifts and masks — set, clear, get, union.',
      code: `public class MyBitSet {
    private final long[] words;
    private final int nbits;

    public MyBitSet(int nbits) {
        this.nbits = nbits;
        this.words = new long[(nbits + 63) / 64];
    }

    public void set(int i) {
        check(i);
        words[i >>> 6] |= (1L << i);
    }

    public void clear(int i) {
        check(i);
        words[i >>> 6] &= ~(1L << i);
    }

    public boolean get(int i) {
        check(i);
        return (words[i >>> 6] & (1L << i)) != 0;
    }

    /** Union in words/64 steps — 64 members per instruction. */
    public void or(MyBitSet other) {
        for (int w = 0; w < words.length; w++) {
            words[w] |= other.words[w];
        }
    }

    public int cardinality() {
        int count = 0;
        for (long w : words) {
            count += Long.bitCount(w);
        }
        return count;
    }

    private void check(int i) {
        if (i < 0 || i >= nbits) {
            throw new IndexOutOfBoundsException("bit " + i);
        }
    }

    public static void main(String[] args) {
        MyBitSet s = new MyBitSet(16);
        s.set(3);
        s.set(10);
        System.out.println("has 3=" + s.get(3) + " has 4=" + s.get(4));
        System.out.println("size=" + s.cardinality());
    }
}
`,
    },
    {
      title: 'java.util.BitSet built-in equivalent',
      description: 'Idiomatic Java: growing bits, set algebra, and streams of set bits.',
      code: `import java.util.BitSet;

public class BitSetDemo {
    public static void main(String[] args) {
        BitSet primes = new BitSet(20);
        primes.set(2, 20); // assume prime, sieve below
        for (int p = 2; p * p < 20; p = primes.nextSetBit(p + 1)) {
            for (int m = p * p; m < 20; m += p) {
                primes.clear(m);
            }
        }
        System.out.println("primes<20=" + primes);

        BitSet a = new BitSet();
        a.set(1);
        a.set(3);
        BitSet b = new BitSet();
        b.set(3);
        b.set(5);
        a.and(b); // intersection in place
        System.out.println("a & b=" + a); // {3}
    }
}
`,
    },
  ],
  mistakes: [
    'Shifting int 1 by 32+: 1 << 32 wraps to 1 — always shift the long literal 1L for bit positions.',
    'Forgetting word_index = i / 64: bit i is not array slot i — divide by the word size first.',
    'Leaving tail bits set: bulk ops pollute bits past nbits — mask the last word or length/equals misbehave.',
    'Using boolean[] for flags: 8x the memory of bits with none of the word-parallel speed — size the long[] instead.',
    'Assuming BitSet length() is capacity: it returns the highest set bit + 1 — an all-clear set reports length 0.',
    'Mutating shared BitSets: and/or/xor act in place — clone() before combining sets you must keep.',
  ],
  vizId: 'bitset-ops',
  problemIds: ['single-number', 'number-of-1-bits', 'counting-bits'],
  javaBuiltIn: ['java.util.BitSet', 'java.util.EnumSet'],
  related: ['array', 'fenwick-tree'],
};
