import type { Topic } from '../../types/content.ts';

/** B-Tree / B+ Tree: wide nodes for disk-speed ordered storage. */
export const bTreeTopic: Topic = {
  slug: 'b-tree',
  title: 'B-Tree / B+ Tree',
  category: 'data-structures',
  order: 28,
  summary: 'Wide, shallow trees built for disks and databases — hundreds of keys per node, range scans via linked leaves.',
  level: 'advanced',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['binary-search-tree'],
  sections: [
    {
      heading: 'One node per disk page',
      body: 'A **B-tree** generalises the BST: each node holds *many* keys (and one more child pointer than keys) and every leaf sits at the same depth. With minimum degree `t`, nodes carry `t−1` to `2t−1` keys — hundreds in practice, sized so one node fills one **disk page** (4–16 KB).\n\nThat width collapses height: a 3-level B-tree with 500 keys per node addresses 125M entries. Since each level can cost one disk seek (~10ms) versus nanoseconds in RAM, minimising *levels* beats minimising comparisons — the exact inverse of in-memory priorities.',
    },
    {
      heading: 'How it lives in memory (and on disk)',
      body: 'Nodes are fixed-size key arrays plus child pointers/page-ids — designed to be `read()` in one I/O. Keys stay sorted; child `i` holds everything between key `i−1` and key `i`.\n\n- **Split on the way down**: full nodes split *before* descent, so inserts never backtrack upward — one root-to-leaf pass, no recursion unwind.\n- A **B+ tree** (the database standard) stores values only in leaves and links leaves left-to-right: internal nodes are pure routing, and range scans walk the leaf chain without revisiting parents.\n- Node occupancy never drops below half (except the root): splits and merges preserve the fill guarantee that keeps height logarithmic.',
    },
    {
      heading: 'Search, insert, split',
      body: 'Search binary-searches within each node and follows the bracketing child — `O(log n)` node visits, each ideally one page read. Insert descends, splitting full nodes preemptively: the median key rises to the parent, the node halves into two. Delete mirrors with merges and key rotation between siblings.\n\nThe animation grows a degree-2 tree (1–3 keys per node): inserts 10, 20, 5, 6 fill the root, then key 6 forces a split — median 10 rises and the tree gains a level without ever unbalancing.',
    },
    {
      heading: 'B-tree vs B+ tree vs LSM',
      body: 'Classic **B-trees** keep values alongside keys in every node (good for point lookups, wasteful scans). **B+ trees** keep values in linked leaves (shorter internal keys → wider fan-out → fewer levels; scans never climb). **LSM trees** (Cassandra, RocksDB) skip in-place updates entirely: buffer writes in memory, flush sorted runs, merge in the background — better write throughput, costlier reads.\n\nRule: read-heavy with range scans → B+ tree; write-heavy ingest → LSM; in-memory ordered map → red-black/AVL.',
    },
    {
      heading: 'Real-world use',
      body: 'InnoDB/MySQL and PostgreSQL indexes, SQLite, filesystems (NTFS, HFS+, ext4 extents), MongoDB’s WiredTiger — the B+ tree is the most deployed tree on earth. Key-value stores pick LSM when writes dominate. Whatever database backs your code, its index chapter is this topic.\n\nReach for B-trees when data exceeds RAM and reads need order; reach for LSM when ingest outruns reads; reach for hash indexes when only point lookups matter.',
    },
  ],
  complexity: [
    { operation: 'Search (node visits)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Insert (with splits)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Delete (with merges)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    { operation: 'Range scan (k results, B+ leaves)', best: 'O(log n + k)', average: 'O(log n + k)', worst: 'O(log n + k)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'BTree from scratch (min degree 2)',
      description: 'Preemptive splits on the way down — one pass, no backtracking.',
      code: `import java.util.ArrayList;
import java.util.List;

public class BTree {
    private static class Node {
        final List<Integer> keys = new ArrayList<>();
        final List<Node> children = new ArrayList<>();
        boolean leaf = true;
    }

    private final int t = 2; // min degree: 1..3 keys per node
    private Node root = new Node();

    public boolean contains(int key) {
        return search(root, key);
    }

    private boolean search(Node n, int key) {
        int i = 0;
        while (i < n.keys.size() && key > n.keys.get(i)) {
            i++;
        }
        if (i < n.keys.size() && key == n.keys.get(i)) {
            return true;
        }
        return n.leaf ? false : search(n.children.get(i), key);
    }

    public void add(int key) {
        if (root.keys.size() == 2 * t - 1) {
            Node grown = new Node();
            grown.leaf = false;
            grown.children.add(root);
            split(grown, 0);
            root = grown;
        }
        insertNonFull(root, key);
    }

    /** Split full child c[i]: median rises, node halves. */
    private void split(Node parent, int i) {
        Node full = parent.children.get(i);
        Node right = new Node();
        right.leaf = full.leaf;
        int median = full.keys.get(t - 1);
        right.keys.addAll(full.keys.subList(t, full.keys.size()));
        full.keys.subList(t - 1, full.keys.size()).clear();
        if (!full.leaf) {
            right.children.addAll(full.children.subList(t, full.children.size()));
            full.children.subList(t, full.children.size()).clear();
        }
        parent.keys.add(i, median);
        parent.children.add(i + 1, right);
    }

    private void insertNonFull(Node n, int key) {
        int i = n.keys.size() - 1;
        if (n.leaf) {
            n.keys.add(0); // make room, then shift larger keys right
            while (i >= 0 && key < n.keys.get(i)) {
                n.keys.set(i + 1, n.keys.get(i));
                i--;
            }
            n.keys.set(i + 1, key);
            return;
        }
        while (i >= 0 && key < n.keys.get(i)) {
            i--;
        }
        i++;
        if (n.children.get(i).keys.size() == 2 * t - 1) {
            split(n, i); // split BEFORE descending: no way back up
            if (key > n.keys.get(i)) {
                i++;
            }
        }
        insertNonFull(n.children.get(i), key);
    }

    public static void main(String[] args) {
        BTree t = new BTree();
        for (int v : new int[]{10, 20, 5, 6, 12, 30, 7, 17}) {
            t.add(v);
        }
        System.out.println("has 6=" + t.contains(6));
        System.out.println("has 13=" + t.contains(13));
    }
}
`,
    },
    {
      title: 'Leaf-linked range scan sketch',
      description: 'The B+ idea: leaves chained for scans without climbing.',
      code: `import java.util.ArrayList;
import java.util.List;

public class LeafChain {
    /** B+ leaf: sorted keys plus a next-leaf link for range scans. */
    static class Leaf {
        final List<Integer> keys = new ArrayList<>();
        Leaf next;
    }

    /** Walk the chain from the first leaf covering lo. */
    static List<Integer> scan(Leaf first, int lo, int hi) {
        List<Integer> out = new ArrayList<>();
        for (Leaf leaf = first; leaf != null; leaf = leaf.next) {
            for (int key : leaf.keys) {
                if (key > hi) {
                    return out;
                }
                if (key >= lo) {
                    out.add(key);
                }
            }
        }
        return out;
    }

    public static void main(String[] args) {
        Leaf a = new Leaf();
        a.keys.addAll(List.of(5, 6, 7));
        Leaf b = new Leaf();
        b.keys.addAll(List.of(10, 12, 17));
        a.next = b;
        System.out.println(scan(a, 6, 12)); // [6, 7, 10, 12]
    }
}
`,
    },
  ],
  mistakes: [
    'Splitting after descent: full children need splitting BEFORE going down — post-hoc splits require backtracking the path.',
    'Rising the wrong median: the median key (index t−1) moves up — promoting a neighbour unbalances both halves.',
    'Forgetting child pointers on split: keys halve but children split t/t too — dropping the child move orphans subtrees.',
    'Allowing underfull nodes after delete: below t−1 keys, borrow from a sibling or merge — otherwise height guarantees rot.',
    'Sizing nodes by key count, not bytes: fan-out follows page size — count keys per 4–16 KB page, not by aesthetics.',
    'Using B-trees in RAM: pointer chasing wastes the design — in-memory ordered data wants AVL/red-black/skip lists.',
  ],
  vizId: 'btree-ops',
  problemIds: [],
  practiceNote: 'Concept-level topic: our verified bank holds no B-tree drill — this is systems-design knowledge (ask “why are database indexes shallow?”); practice tree reasoning under Binary Search Trees and AVL Trees.',
  related: ['binary-search-tree', 'avl-tree'],
};
