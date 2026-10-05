import type { Topic } from '../../types/content.ts';

/** LRU/LFU Cache Structures: O(1) eviction from humble parts. */
export const lruLfuCacheTopic: Topic = {
  slug: 'lru-lfu-cache',
  title: 'LRU/LFU Cache Structures',
  category: 'data-structures',
  order: 31,
  summary: 'HashMap plus doubly linked list for LRU, frequency buckets for LFU — O(1) caches from humble parts.',
  level: 'intermediate',
  group: 'non-linear',
  status: 'complete',
  prerequisites: ['hash-table', 'doubly-linked-list'],
  sections: [
    {
      heading: 'Two structures, one fast path',
      body: 'An **LRU cache** evicts the *least recently used* entry; an **LFU cache** evicts the *least frequently used*. Both need `get` and `put` in `O(1)` — and both get there by pairing a **HashMap** (find any key instantly) with a **doubly linked list** (reorder and evict at the ends instantly).\n\nLRU order *is* the list: every access moves the node to the front; the back is always the victim. LFU groups nodes into **frequency buckets** — one doubly linked list per hit-count — promoting entries bucket by bucket and evicting from the lowest non-empty bucket.',
    },
    {
      heading: 'How it lives in memory',
      body: 'LRU: `n` list nodes (key, value, prev, next) plus a map from key to node — `O(capacity)` with a constant of two structures per entry. Dummy head/tail sentinels remove every null check from the splice code.\n\n- **Hit** (`get`): map lookup, unlink node, insert at front. Pure pointer surgery — no allocation.\n- **Miss with room** (`put`): allocate one node, map it, front-insert.\n- **Miss when full**: reuse the *tail* node for the new entry (rewrite key/value, move to front) — steady-state zero allocation, which is why this design survives hot caches.\n- LFU adds a `freq` counter per node plus a map from frequency to its bucket list, and tracks `minFreq` for `O(1)` victim selection.',
    },
    {
      heading: 'LRU vs LFU: which forgets better?',
      body: 'LRU assumes **recency predicts reuse** (loops, session data, MRU editors) and adapts instantly to phase changes — but one full scan flushes the whole cache (scan pollution). LFU assumes **frequency predicts reuse** (popular videos, hot keys) and resists scans — but stale giants linger after phases change (cache pollution in reverse).\n\nProduction answers: **TinyLFU** sketches frequency in a counting Bloom filter with periodic halving (frequency that decays — both recency *and* frequency), and **ARC/W-TinyLFU** split recency and frequency segments adaptively. Know LRU cold, LFU warm, and the hybrids by name.',
    },
    {
      heading: 'LinkedHashMap: the five-line LRU',
      body: 'Java ships LRU semantics: `LinkedHashMap` in **access order** moves entries to the tail on every hit, and overriding `removeEldestEntry` evicts past capacity. It is single-threaded and allocation-happy compared to the hand-rolled version, but unbeatable for clarity — and the standard interview “implement LRU” answer is judged against exactly this shape.',
    },
    {
      heading: 'Real-world use',
      body: 'CPU caches (approximate LRU via tree-PLRU bits), database buffer pools, web caches and CDNs, image loaders on mobile (LRU bitmap pools bound memory), DNS resolvers, and ORM session caches. `LRU Cache` is the #1 “design a data structure” interview because it composes two basics into something greater — the composition *is* the lesson.\n\nReach for LRU when access locality is temporal and phases shift; reach for LFU/TinyLFU when popularity is skewed and scans threaten; reach for TTL expiry when freshness, not capacity, is the constraint.',
    },
  ],
  complexity: [
    { operation: 'LRU get / put', best: 'O(1)', average: 'O(1)', worst: 'O(1)*', space: 'O(capacity)' },
    { operation: 'LFU get / put', best: 'O(1)', average: 'O(1)', worst: 'O(1)*', space: 'O(capacity)' },
    { operation: 'Eviction scan (naive list)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(capacity)' },
  ],
  javaCode: [
    {
      title: 'LRUCache from scratch',
      description: 'HashMap plus doubly linked list — the canonical composition.',
      code: `import java.util.HashMap;
import java.util.Map;

public class LRUCache {
    private static class Node {
        int key, value;
        Node prev, next;
        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(-1, -1); // most-recent sentinel
    private final Node tail = new Node(-1, -1); // least-recent sentinel

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) {
            return -1;
        }
        moveToFront(node); // a hit is recent use
        return node.value;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;
            moveToFront(node);
            return;
        }
        if (map.size() == capacity) {
            Node victim = tail.prev; // least recently used
            unlink(victim);
            map.remove(victim.key);
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        insertFront(fresh);
    }

    private void unlink(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertFront(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void moveToFront(Node node) {
        unlink(node);
        insertFront(node);
    }

    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 10);
        cache.put(2, 20);
        System.out.println(cache.get(1)); // 10 — 1 is now most recent
        cache.put(3, 30); // evicts 2, not 1
        System.out.println(cache.get(2)); // -1
    }
}
`,
    },
    {
      title: 'LinkedHashMap built-in equivalent',
      description: 'Access order plus removeEldestEntry — LRU in five lines.',
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public class LruBuiltIn {
    /** Access-ordered map that drops the eldest past capacity. */
    static class Lru<K, V> extends LinkedHashMap<K, V> {
        private final int capacity;

        Lru(int capacity) {
            super(capacity, 0.75f, true); // true = access order
            this.capacity = capacity;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity;
        }
    }

    public static void main(String[] args) {
        Lru<Integer, String> cache = new Lru<>(2);
        cache.put(1, "one");
        cache.put(2, "two");
        cache.get(1); // 1 is now most recent
        cache.put(3, "three"); // evicts 2
        System.out.println(cache.keySet()); // [1, 3]
    }
}
`,
    },
  ],
  mistakes: [
    'Evicting on a hit: get() reorders but never evicts — only a missing-key put() past capacity removes anyone.',
    'Forgetting move-to-front on get: reads count as use — without the move, the cache degrades to FIFO.',
    'Unlinking without sentinels: every splice needs four null checks — dummy head/tail delete the edge cases.',
    'Storing values without keys in nodes: eviction must map.remove(victim.key) — keyless nodes leak map entries.',
    'LFU without minFreq tracking: scanning buckets for the lowest frequency turns O(1) eviction into O(n).',
    'Threading LinkedHashMap directly: it is not synchronized — concurrent caches need ConcurrentHashMap structure or explicit locking.',
  ],
  vizId: 'lru-cache-ops',
  problemIds: ['lru-cache'],
  practiceNote: 'Concept-level pairing: LRU Cache is the verified drill here — LFU Cache (same family, frequency buckets) has no bank entry yet, so master its structure from the sections above.',
  javaBuiltIn: ['java.util.LinkedHashMap'],
  related: ['hash-table', 'doubly-linked-list'],
};
