import type { Topic } from '../../types/content.ts';

/** Bit manipulation: AND/OR/XOR/NOT, shifts, and the classic bit tricks. */
export const bitTopic: Topic = {
  slug: 'bit-manipulation',
  title: 'Bit Manipulation',
  category: 'concepts',
  order: 9,
  summary: 'Operate on individual bits: masks, shifts, XOR cancellation, and tricks like x & (x−1) that answer in O(1).',
  level: 'intermediate',
  prerequisites: ['big-o-notation'],
  sections: [
    {
      heading: 'Bits as data',
      body: 'Every `int` is 32 bits, and the bitwise operators work on all of them at once: `&` keeps 1s present in **both**, `|` keeps 1s present in **either**, `^` keeps positions that **differ**, `~` flips everything.\n\nShifts move the pattern: `<<` multiplies by 2 per step, `>>` divides (sign-extended), `>>>` divides filling zeros. Checking, setting, and clearing single bits is masking: `x & (1 << k)` tests, `x | (1 << k)` sets, `x & ~(1 << k)` clears.',
    },
    {
      heading: 'The tricks worth memorizing',
      body: '`x & (x − 1)` clears the **lowest set bit** — repeat to count 1s in O(popcount), or test powers of two (`x > 0 && (x & (x − 1)) == 0`). `x & -x` isolates that lowest bit directly.\n\nXOR cancels: `a ^ a = 0` and `a ^ 0 = a`, so XOR-ing an array where every element appears twice leaves the single loner. `a ^ b` has a 1 exactly where the numbers differ — the engine behind Hamming-distance and bit-difference counting.',
    },
    {
      heading: 'Java specifics',
      body: '`int` is signed two’s-complement: `~0 == -1`, and `>>` on negatives fills 1s (use `>>>` for logical shift). `Integer.bitCount`, `numberOfTrailingZeros`, and `highestOneBit` are JVM intrinsics — single CPU instructions, always prefer them to loops.\n\nBytes promote to `int` before shifting (`(byte)(b << 2)` needs the cast), and `1 << 31` is `Integer.MIN_VALUE`, not an error — shift counts mask to the low 5 bits (`<< 33` ≡ `<< 1`).',
    },
  ],
  complexity: [
    { operation: 'Single AND/OR/XOR/shift', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Popcount via x & (x−1)', best: 'O(1)', average: 'O(set bits)', worst: 'O(32)', space: 'O(1)' },
    { operation: 'Integer.bitCount (intrinsic)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Masks and tests from scratch',
      description: 'Test, set, clear, and toggle single bits.',
      code: `public class BitMasks {
    static boolean test(int x, int k) {
        return (x & (1 << k)) != 0;
    }

    static int set(int x, int k) {
        return x | (1 << k);
    }

    static int clear(int x, int k) {
        return x & ~(1 << k);
    }

    static int toggle(int x, int k) {
        return x ^ (1 << k);
    }

    public static void main(String[] args) {
        int x = 12; // 1100
        System.out.println(test(x, 3)); // true
        System.out.println(Integer.toBinaryString(set(x, 0))); // 1101
        System.out.println(Integer.toBinaryString(clear(x, 3))); // 100
        System.out.println(Integer.toBinaryString(toggle(x, 2))); // 1000
    }
}
`,
    },
    {
      title: 'Classic tricks, compiled',
      description: 'Loner XOR, power-of-two test, intrinsic popcount.',
      code: `public class BitTricks {
    static int single(int[] a) {
        int xor = 0;
        for (int x : a) {
            xor ^= x; // pairs cancel: a ^ a = 0
        }
        return xor;
    }

    static boolean isPowerOfTwo(int x) {
        return x > 0 && (x & (x - 1)) == 0;
    }

    public static void main(String[] args) {
        System.out.println(single(new int[]{4, 1, 2, 1, 2})); // 4
        System.out.println(isPowerOfTwo(16)); // true
        System.out.println(isPowerOfTwo(18)); // false
        System.out.println(Integer.bitCount(12)); // 2
        System.out.println(Integer.numberOfTrailingZeros(12)); // 2
    }
}
`,
    },
  ],
  mistakes: [
    'Using >> on negatives expecting zeros: sign extension fills 1s — use >>> for logical shift.',
    'Forgetting byte promotion: bytes become ints before shifting — cast the result back explicitly.',
    'Testing power-of-two without x > 0: 0 passes the bit test — guard it.',
    'Shifting by ≥ 32: counts mask to 5 bits, so << 33 is << 1, silently.',
    'Hand-rolling popcount loops: Integer.bitCount is one instruction — use the intrinsic.',
  ],
  vizId: 'bit-operations',
  problemIds: ['single-number', 'number-of-1-bits', 'counting-bits', 'missing-number'],
};
