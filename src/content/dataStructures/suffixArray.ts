import type { Topic } from '../../types/content.ts';

/** Suffix Array & Suffix Tree: sorted suffixes for substring power. */
export const suffixArrayTopic: Topic = {
  slug: 'suffix-array',
  title: 'Suffix Array & Suffix Tree',
  category: 'data-structures',
  order: 30,
  summary: "Sorted suffixes and compressed tries for substring search and pattern matching — the string indexer's toolkit.",
  level: 'advanced',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['string', 'trie'],
  sections: [
    {
      heading: 'Every suffix, sorted',
      body: 'The **suffix array** of `"banana"` lists all six suffixes in sorted order — `a, ana, anana, banana, na, nana` — stored as starting indices: `[5, 3, 1, 0, 4, 2]`. That sorted order is the whole data structure: binary search over suffixes finds any pattern in `O(m log n)`, counts occurrences as a contiguous range, and enumerates completions like an autocomplete index.\n\nConstruction is the hard part. Naive sorting costs `O(n² log n)` (comparing long strings); the **prefix-doubling** method sorts by the first 1, 2, 4, 8, … characters with counting sort, reaching `O(n log n)` — and linear-time SA-IS exists for the library shelf. Interviews test the *idea* (sorted suffixes + binary search), not the construction.',
    },
    {
      heading: 'LCP: the array’s memory',
      body: 'The **LCP array** stores longest-common-prefix lengths between *adjacent* suffixes (`[1, 3, 0, 0, 2, 0]`-style): it tells how much neighbouring suffixes share. With LCP plus a range-minimum structure, any pattern search tightens to `O(m + log n)`, longest repeated substrings pop out as LCP maxima, and Kasai’s algorithm builds LCP itself in `O(n)`.\n\nRule of thumb: suffix array finds *where*, LCP explains *how much they share*. Together they answer “longest repeated substring”, “longest common substring of two texts” (search across a joined string), and “how many distinct substrings” (`total − ΣLCP`).',
    },
    {
      heading: 'Suffix trees and automata: the compressed cousins',
      body: 'A **suffix trie** holds every suffix character by character (quadratic size — concept only). Compressing single-child chains yields the **suffix tree**: still every substring, now in `O(n)` space, with `O(m)` pattern search. Ukkonen’s algorithm builds it online in linear time — famously intricate, fairly tested as “describe, don’t implement”.\n\nA **suffix automaton (SAM)** flips the compression: minimal DFA accepting all substrings, `O(n)` states, brilliant for counting distinct substrings and longest-common-substring. Know the three by tradeoff: array (simple, binary search), tree (fast search, complex build), automaton (substring counting specialist).',
    },
    {
      heading: 'How they live in memory',
      body: 'Suffix array: one `int[]` of n indices (plus rank/LCP arrays — three integer arrays, all cache-friendly). Suffix tree: edge-labelled nodes with child maps — pointer-heavy, large constants despite `O(n)` theory. Suffix automaton: states with transition maps, compact in practice.\n\n- Constant factors decide: for texts under ~10⁵ characters the array’s simplicity beats the tree’s asymptotics in wall-clock time.\n- All three assume an **immutable text**: edits rebuild the index — dynamic texts need suffix * automata variants or rope hybrids.',
    },
    {
      heading: 'Real-world use',
      body: 'Genome assemblers index billions of bases with compressed suffix arrays (FM-index in Bowtie/BWA). Plagiarism detectors find longest shared passages. `git` similarity detection, diff algorithms, and code-search engines (Livegrep-style trigram indexes are the pragmatic cousin) all descend from this family. Autocomplete over static dictionaries is a sorted-suffix binary search.\n\nReach for suffix structures when one text is queried by many patterns; reach for KMP/Z-alg when one pattern scans one text; reach for Aho-Corasick when many patterns scan one stream.',
    },
  ],
  complexity: [
    { operation: 'Naive construction (sort suffixes)', best: 'O(n² log n)', average: 'O(n² log n)', worst: 'O(n² log n)', space: 'O(n)' },
    { operation: 'Prefix-doubling construction', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'Pattern search (binary search)', best: 'O(m log n)', average: 'O(m log n)', worst: 'O(m log n)', space: 'O(n)' },
    { operation: 'Pattern search (suffix tree)', best: 'O(m)', average: 'O(m)', worst: 'O(m)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'SuffixArray from scratch',
      description: 'Naive but honest: sort indices by suffix, binary-search patterns.',
      code: `import java.util.Arrays;

public class SuffixArray {
    private final String text;
    private final int[] sa; // sorted suffix start indices

    public SuffixArray(String text) {
        this.text = text;
        Integer[] order = new Integer[text.length()];
        for (int i = 0; i < order.length; i++) {
            order[i] = i;
        }
        // Naive O(n^2 log n): fine for teaching, never for genomes.
        Arrays.sort(order, (a, b) -> text.substring(a).compareTo(text.substring(b)));
        sa = new int[order.length];
        for (int i = 0; i < order.length; i++) {
            sa[i] = order[i];
        }
    }

    /** First suffix >= pattern (lower bound over suffix order). */
    public int lowerBound(String pattern) {
        int lo = 0, hi = sa.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            String suffix = text.substring(sa[mid]);
            if (suffix.compareTo(pattern) < 0) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    public boolean contains(String pattern) {
        int at = lowerBound(pattern);
        return at < sa.length && text.startsWith(pattern, sa[at]);
    }

    public static void main(String[] args) {
        SuffixArray sa = new SuffixArray("banana");
        System.out.println("sa=" + Arrays.toString(sa.sa)); // [5, 3, 1, 0, 4, 2]
        System.out.println("has ana=" + sa.contains("ana")); // true
        System.out.println("has nan=" + sa.contains("nan")); // true
        System.out.println("has xyz=" + sa.contains("xyz")); // false
    }
}
`,
    },
    {
      title: 'LCP via Kasai + longest repeat',
      description: 'Linear LCP from ranks; the maximum is the longest repeated substring.',
      code: `import java.util.Arrays;

public class LongestRepeat {
    /** Kasai: LCP between adjacent suffixes in O(n). */
    static int[] lcp(String s, int[] sa) {
        int n = s.length();
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) {
            rank[sa[i]] = i;
        }
        int[] lcp = new int[n];
        int h = 0;
        for (int i = 0; i < n; i++) {
            int r = rank[i];
            if (r == 0) {
                continue;
            }
            int j = sa[r - 1];
            while (i + h < n && j + h < n && s.charAt(i + h) == s.charAt(j + h)) {
                h++;
            }
            lcp[r] = h;
            if (h > 0) {
                h--;
            }
        }
        return lcp;
    }

    public static void main(String[] args) {
        String s = "banana";
        SuffixArray sa = new SuffixArray(s);
        int[] lcp = lcp(s, sa.sa);
        System.out.println("lcp=" + Arrays.toString(lcp));
        int best = 0;
        for (int v : lcp) {
            best = Math.max(best, v);
        }
        System.out.println("longest repeat length=" + best); // 3 ("ana")
    }
}
`,
    },
  ],
  mistakes: [
    'Comparing suffixes by substring(): each compare copies O(n) — naive construction is O(n² log n), never ship it past toy sizes.',
    'Binary-searching with == instead of lower bound: occurrences form a range — find its start, then count forward while prefixes match.',
    'Forgetting the LCP array: raw binary search re-compares shared prefixes — LCP is what makes repeated queries fast.',
    'Using suffix structures for single scans: one pattern over one text is KMP/Z territory — indexes pay off across many queries.',
    'Assuming suffix trees are “just tries”: compression changes everything — edges carry strings, and naive tries blow up quadratically.',
    'Mutating the indexed text: every structure here assumes a frozen string — edits mean rebuilds, not updates.',
  ],
  vizId: 'suffix-array-ops',
  problemIds: [],
  practiceNote: 'Concept-level topic: our verified bank holds no suffix-array drill — the binary-search and trie sections above carry the idea; practice adjacent string searching under Tries and Strings.',
  related: ['string', 'trie'],
};
