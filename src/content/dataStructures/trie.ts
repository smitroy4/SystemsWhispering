import type { Topic } from '../../types/content.ts';

/** Tries: prefix trees for autocomplete and word games. */
export const trieTopic: Topic = {
  slug: 'trie',
  title: 'Tries',
  category: 'data-structures',
  order: 13,
  summary: 'Prefix trees that share beginnings: insert and search a word in O(m), autocomplete with one subtree walk.',
  level: 'intermediate',
  group: 'non-linear',
  prerequisites: ['string', 'hash-table'],
  sections: [
    {
      heading: 'Words that share their beginnings',
      body: 'A **trie** (from "retrieval") stores strings by sharing prefixes: "cat" and "car" use the same `c → a` nodes and branch only at the end. Each node holds up to one child per character plus an **end-of-word flag** — "car" and "cart" can both exist because the flag, not the path, marks completeness.\n\nInsert and search both cost `O(m)` for word length `m`, independent of how many words are stored. That beats hashing when queries are prefix-shaped.',
    },
    {
      heading: 'How tries live in memory',
      body: 'Nodes fan out: each stores children in a small array (26 slots for lowercase English — fast, hungry) or a hash map (compact, slower). `HashMap<Character, TrieNode>` is the pragmatic default; arrays win in alphabet-tight contests.\n\n- Memory is the price: shared prefixes save nodes, but every distinct branching duplicates paths. A million random words cost roughly a node per character.\n- Nodes are tiny objects; cache locality is poor compared to sorted arrays — tries win on operation shape, not raw speed.',
    },
    {
      heading: 'Autocomplete falls out for free',
      body: 'To complete a prefix, walk to its node (`O(m)`) then enumerate its subtree — every end-flag below is a suggestion. Delete lazily where possible: unsetting the end flag is `O(m)`; pruning orphan nodes is optional cleanup.\n\nThe animation inserts "cat", then "car" (reusing `c → a`), then "dog" (a fresh branch).',
    },
    {
      heading: 'Sorted sets as the built-in equivalent',
      body: 'Java has no built-in trie, but prefix queries are expressible with `TreeSet`: `subSet(prefix, prefix + Character.MAX_VALUE)` returns every stored word in the prefix range, in order.\n\n- Use the trie when you build words character by character (games, routers, IP tables).\n- Use `TreeSet` ranges when the word list is static and simplicity beats pointer-chasing.',
    },
  ],
  complexity: [
    { operation: 'Insert / search a word', best: 'O(m)', average: 'O(m)', worst: 'O(m)', space: 'O(total chars)' },
    { operation: 'Autocomplete k suggestions', best: 'O(m + k)', average: 'O(m + k)', worst: 'O(m + k)', space: 'O(total chars)' },
    { operation: 'Delete (unflag)', best: 'O(m)', average: 'O(m)', worst: 'O(m)', space: 'O(total chars)' },
  ],
  javaCode: [
    {
      title: 'Trie from scratch',
      description: 'Map-based children with insert, search, and prefix check.',
      code: `import java.util.HashMap;
import java.util.Map;

public class Trie {
    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        boolean endOfWord;
    }

    private final Node root = new Node();

    public void insert(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            curr = curr.children.computeIfAbsent(c, k -> new Node());
        }
        curr.endOfWord = true;
    }

    public boolean search(String word) {
        Node node = walk(word);
        return node != null && node.endOfWord;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private Node walk(String s) {
        Node curr = root;
        for (char c : s.toCharArray()) {
            curr = curr.children.get(c);
            if (curr == null) {
                return null;
            }
        }
        return curr;
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        trie.insert("cat");
        trie.insert("car");
        trie.insert("dog");
        System.out.println(trie.search("car") + " " + trie.search("ca"));
        System.out.println(trie.startsWith("do") + " " + trie.startsWith("z"));
    }
}
`,
    },
    {
      title: 'TreeSet prefix range equivalent',
      description: 'Built-in equivalent: ordered set slices for static word lists.',
      code: `import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

public class PrefixSearch {
    static List<String> complete(SortedSet<String> words, String prefix) {
        String end = prefix + Character.MAX_VALUE;
        return List.copyOf(words.subSet(prefix, end));
    }

    public static void main(String[] args) {
        SortedSet<String> words = new TreeSet<>(
            List.of("cat", "car", "cart", "dog", "door"));
        System.out.println(complete(words, "ca"));
        System.out.println(complete(words, "do"));
    }
}
`,
    },
  ],
  mistakes: [
    'Forgetting the end flag: "car" is a prefix of "cart" — only the flag distinguishes a word from a path.',
    'Using == on Character children keys: autoboxed chars past 127 break identity comparison — maps use equals, hand-rolled arrays must too.',
    'Deleting by removing nodes eagerly: shared prefixes belong to other words — unflag first, prune only childless non-word nodes.',
    'Storing case inconsistently: "Cat" and "cat" diverge — normalize case on insert AND search.',
    'Array children for Unicode: 26 slots assume a–z; full char ranges need maps or compressed alphabets.',
    'Walking without null checks: a missing child means "no such prefix" — return early instead of throwing.',
  ],
  vizId: 'trie-ops',
  problemIds: ['implement-trie-prefix-tree', 'design-add-and-search-words-data-structure'],
};
