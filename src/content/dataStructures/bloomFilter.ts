import type { Topic } from '../../types/content.ts';

/** Bloom Filter: a set that can say "maybe", never "wrongly no". */
export const bloomFilterTopic: Topic = {
  slug: 'bloom-filter',
  title: 'Bloom Filter',
  category: 'data-structures',
  order: 32,
  summary: 'A probabilistic set that never forgets wrong: k hashes, m bits, tunable false positives — membership on a budget.',
  level: 'expert',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['hash-table', 'bitset'],
  sections: [
    {
      heading: 'Maybe yes, never wrongly no',
      body: 'A **Bloom filter** answers set membership with a one-sided promise: “definitely absent” is always right; “probably present” is right *most* of the time. Adding `x` sets `k` hashed bit positions; querying checks them — all set means present (maybe), any clear means absent (certainly).\n\nThere are no false *negatives* because bits are only ever turned on. False *positives* happen when other members’ hashes coincidentally cover all of `x`’s positions — the price of the structure’s tiny footprint.',
    },
    {
      heading: 'How it lives in memory',
      body: 'One bit array of `m` bits plus `k` hash functions — typically ~10 bits per expected element for a 1% false-positive rate. That is ~10× smaller than storing the keys themselves, and the filter never holds keys at all (a privacy bonus).\n\n- Optimal sizing: `m = −n·ln(p) / (ln 2)²` bits, `k = (m/n)·ln 2` hashes. For p = 1%: m ≈ 9.6 bits/element, k = 7.\n- Hashes need not be independent: double-hashing (`h1 + i·h2`) simulates k functions from two — the standard implementation trick.\n- **No deletion**: clearing bits could erase other members. Counting Bloom filters (4-bit counters per slot) allow deletes at 4× memory.',
    },
    {
      heading: 'The false-positive math (intuition)',
      body: 'After inserting n elements with k hashes into m bits, one bit stays 0 with probability ≈ e^(−kn/m). A non-member falsely matches when all k of its positions are 1: `p ≈ (1 − e^(−kn/m))^k`. The animation shows exactly this: “cherry” was never added, yet its three positions are all covered — a live false positive.\n\nTuning is the whole game: more bits → fewer collisions; more hashes → each query checks more positions (but sets more bits). The optimum balances both via the formulas above.',
    },
    {
      heading: 'Where “probably” is enough',
      body: 'Bloom filters guard expensive lookups: databases (RocksDB SSTables) skip disk reads on definite-no; Chrome’s Safe Browsing checks URLs locally before phoning home; CDNs avoid origin fetches for uncached keys; Bitcoin SPV clients filter transactions; usernameregistrations reject taken names without a DB round-trip.\n\nThe pattern is always *filter-then-verify*: Bloom says no → done; Bloom says maybe → check the source of truth. Never use one where a false positive corrupts correctness — use it where a false positive merely costs a lookup.',
    },
    {
      heading: 'Real-world use',
      body: 'Cassandra and RocksDB ship Bloom filters per SSTable. Guava’s `BloomFilter` is the JVM standard. Medium-scale crawlers dedupe URLs; distributed caches (Memcached wrappers) cut backend load; bioinformatics (BIGSI) indexes petabases of genomes in Bloom matrices.\n\nReach for Bloom when sets are huge, memory is tight, and “maybe” plus verification beats certainty; reach for exact sets (HashSet, Cuckoo filters for deletion support) when false positives are unacceptable.',
    },
  ],
  complexity: [
    { operation: 'Add', best: 'O(k)', average: 'O(k)', worst: 'O(k)', space: '~10 bits/element @1%' },
    { operation: 'Query (maybe / definitely-not)', best: 'O(k)', average: 'O(k)', worst: 'O(k)', space: '~10 bits/element @1%' },
    { operation: 'Delete', best: '—', average: '—', worst: 'unsupported', space: 'use counting variant' },
  ],
  javaCode: [
    {
      title: 'BloomFilter from scratch',
      description: 'Bit array plus double-hashing — add, query, and the one-sided promise.',
      code: `import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.BitSet;

public class BloomFilter {
    private final BitSet bits;
    private final int m;
    private final int k;

    public BloomFilter(int expectedElements, double falsePositiveRate) {
        this.m = (int) Math.ceil(
            -expectedElements * Math.log(falsePositiveRate) / (Math.pow(Math.log(2), 2)));
        this.k = Math.max(1, (int) Math.round((double) m / expectedElements * Math.log(2)));
        this.bits = new BitSet(m);
    }

    /** Double hashing: k positions from two digests. */
    private int[] positions(String item) {
        byte[] digest = sha256(item);
        int h1 = toInt(digest, 0);
        int h2 = toInt(digest, 4) | 1; // odd step keeps probes spread
        int[] pos = new int[k];
        for (int i = 0; i < k; i++) {
            pos[i] = Math.floorMod(h1 + i * h2, m);
        }
        return pos;
    }

    public void add(String item) {
        for (int p : positions(item)) {
            bits.set(p);
        }
    }

    /** True = maybe present; false = definitely absent. */
    public boolean mightContain(String item) {
        for (int p : positions(item)) {
            if (!bits.get(p)) {
                return false;
            }
        }
        return true;
    }

    private static byte[] sha256(String s) {
        try {
            return MessageDigest.getInstance("SHA-256")
                .digest(s.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private static int toInt(byte[] d, int off) {
        return ((d[off] & 0xFF) << 24) | ((d[off + 1] & 0xFF) << 16)
            | ((d[off + 2] & 0xFF) << 8) | (d[off + 3] & 0xFF);
    }

    public static void main(String[] args) {
        BloomFilter filter = new BloomFilter(100, 0.01);
        filter.add("apple");
        filter.add("mango");
        System.out.println("apple? " + filter.mightContain("apple")); // true
        System.out.println("fig? " + filter.mightContain("fig")); // false (almost surely)
    }
}
`,
    },
    {
      title: 'Sizing the filter',
      description: 'Optimal m and k from n and target error rate.',
      code: `public class BloomSizing {
    /** Bits needed for n elements at false-positive rate p. */
    static int bits(int n, double p) {
        return (int) Math.ceil(-n * Math.log(p) / (Math.pow(Math.log(2), 2)));
    }

    /** Hash count that minimises the rate for given m/n. */
    static int hashes(int m, int n) {
        return Math.max(1, (int) Math.round((double) m / n * Math.log(2)));
    }

    public static void main(String[] args) {
        int m = bits(1000, 0.01);
        System.out.println("m=" + m + " bits (" + m / 8 + " bytes)");
        System.out.println("k=" + hashes(m, 1000)); // 7
    }
}
`,
    },
  ],
  mistakes: [
    'Deleting by clearing bits: shared positions erase other members — use a counting variant or rebuild instead.',
    'Treating “maybe” as “yes”: false positives are normal — always verify hits against the source of truth.',
    'Undersizing m: bits per element set the error floor — compute m from n and p, never guess a round number.',
    'Using k = 1 to save time: one hash spikes collisions — the optimal k (≈7 at 1%) hashes cheaply via double-hashing.',
    'Hashing with hashCode() alone: poor avalanche breaks uniformity — use real digests (or splitmix-style mixing) for positions.',
    'Filtering tiny exact-fit sets: below ~thousands of elements a HashSet is clearer and barely larger — Bloom pays off at scale.',
  ],
  vizId: 'bloom-filter-ops',
  problemIds: [],
  practiceNote: 'Concept-level topic: our verified bank holds no Bloom filter drill — it is systems-design knowledge (caches, databases); the hash + bitset mechanics above are the interview payload.',
  related: ['hash-table', 'bitset'],
};
