import type { JavaModule } from '../../types/java.ts';

export const module03: JavaModule = {
  slug: 'collections-and-streams',
  title: 'Collection',
  order: 3,
  summary: 'The data structures, comparison rules and lazy pipelines behind everyday Java code.',
  overview:
    'This module walks the Java Collection Framework from its interface hierarchy down to the memory layout of individual implementations: dynamic arrays, linked nodes, hash buckets, red-black trees and binary heaps. It then moves to the functional half of modern Java, where lambdas, method references and streams let you express data processing as a declarative pipeline. The goal is not memorising API signatures but knowing which structure and which operation to reach for, and why it costs what it costs.',
  topics: [
    {
      slug: 'collection-framework',
      title: 'The Java Collection Framework',
      order: 1,
      summary: 'Why Java ships a family of containers, how they relate, and how to pick one.',
      level: 'beginner',
      subtopics: [
        {
          id: 'why-a-framework',
          title: 'Why a framework instead of arrays',
          body: `An array is the cheapest container Java offers: contiguous memory, constant-time indexing and almost no per-element overhead. Its weakness is rigidity. The length is fixed at allocation, removing an element leaves a hole or forces a shift, and the language gives you no search, sort or uniqueness guarantee out of the box. Every real program therefore needs something more flexible, and every flexible structure is a compromise.

The Collection Framework is Java's packaged answer: a small set of interfaces (\`Collection\`, \`List\`, \`Set\`, \`Queue\`, \`Map\`) plus implementations that trade time, space and ordering against each other. Because the contracts are interfaces, a method written against \`Collection<E>\` keeps compiling when the caller switches from an \`ArrayList\` to a \`HashSet\`.

Every choice comes down to three axes:

- **Access pattern** — positional index, unique key, or only the ends.
- **Mutation pattern** — append at the tail, insert in the middle, delete by value.
- **Ordering and duplication** — insertion order, sorted order, or no order at all.

Naming those three axes before writing code is the whole skill.`,
        },
        {
          id: 'the-hierarchy',
          title: 'The hierarchy at a glance',
          body: `The framework has two roots, and this is the first fact interviewers probe. \`Iterable<E>\` sits at the top and contributes exactly one abstract method, \`iterator()\`. Below it, \`Collection<E>\` adds the element-group operations: \`add\`, \`remove\`, \`contains\`, \`size\`, \`clear\`, \`toArray\`.

\`Collection\` then branches three ways:

| Interface | Contract | Typical implementations |
| --- | --- | --- |
| \`List<E>\` | Indexed sequence, duplicates allowed, insertion order kept | \`ArrayList\`, \`LinkedList\`, \`Vector\`, \`Stack\` |
| \`Set<E>\` | No duplicates, equality defined by \`equals\` (or a comparator) | \`HashSet\`, \`LinkedHashSet\`, \`TreeSet\` |
| \`Queue<E>\` | Elements leave in a defined order; \`Deque<E>\` adds both ends | \`ArrayDeque\`, \`LinkedList\`, \`PriorityQueue\` |

\`Map<K, V>\` is deliberately **not** a \`Collection\`. A map stores key-value associations, not individual elements, so it cannot honestly implement \`add(E)\` or \`iterator()\` over \`E\`. It starts its own hierarchy: \`Map\` → \`SortedMap\` → \`NavigableMap\`, with \`HashMap\`, \`LinkedHashMap\`, \`TreeMap\` and the specialised variants below it. The bridge between the two worlds is \`map.entrySet()\`, a \`Set<Map.Entry<K, V>>\` that does extend \`Collection\`.`,
        },
        {
          id: 'interfaces-before-classes',
          title: 'Program to the interface',
          body: `The framework's real value is substitutability. Declaring \`List<String> names = new ArrayList<>();\` costs nothing today and buys you the ability to swap in a \`LinkedList\`, a \`CopyOnWriteArrayList\` or a test double tomorrow without touching a single call site. Declaring \`ArrayList<String> names = new ArrayList<>();\` leaks an implementation detail into every method signature that receives it.

The discipline extends to parameters. A method that only iterates should accept \`Iterable<? extends T>\`. One that only reads size and membership should accept \`Collection<?>\`. One that needs positional access needs \`List<?>\`. Widening the parameter type widens the set of callers that can use the method for free.

There is a counterweight: interfaces expose only the contract, so implementation-specific behaviour has to be requested explicitly. \`ArrayList\`'s \`ensureCapacity\`, \`LinkedHashMap\`'s access-order constructor and \`EnumMap\`'s ordinal indexing are invisible through the interface. Use the interface at API boundaries, and the concrete type only inside the small scope that genuinely needs the extra behaviour.`,
        },
        {
          id: 'choosing-a-container',
          title: 'Choosing a container',
          body: `Most selection questions collapse into a short decision table. Start from the operation you perform most often, not from the one that sounds most sophisticated.

| Need | Default choice | Reason |
| --- | --- | --- |
| Indexed access, append-heavy | \`ArrayList\` | Contiguous array, amortised O(1) append |
| Insert/remove at both ends | \`ArrayDeque\` | Ring buffer, no node allocation |
| Unique elements, fast membership | \`HashSet\` | Backed by \`HashMap\`, expected O(1) |
| Unique elements in insertion order | \`LinkedHashSet\` | Hash table plus a linked list |
| Unique elements in sorted order | \`TreeSet\` | Red-black tree, O(log n) |
| Key-value lookup | \`HashMap\` | Hash buckets, expected O(1) |
| Key-value in key order or range queries | \`TreeMap\` | Red-black tree, \`NavigableMap\` |
| Enum keys | \`EnumMap\` | Plain array indexed by ordinal |
| Last-in-first-out | \`ArrayDeque\`, not \`Stack\` | \`Stack\` is a synchronised legacy class |
| Priority order | \`PriorityQueue\` | Binary heap in an array |

Two rules of thumb cover the majority of cases: \`ArrayList\` beats \`LinkedList\` in practice because of cache locality, and \`HashMap\`/\`HashSet\` beat tree variants unless you actually need ordering or range queries.`,
        },
        {
          id: 'performance-mental-model',
          title: 'A performance mental model',
          body: `Big-O is the starting point, not the answer. Two structures can both be O(1) and differ by an order of magnitude because of constant factors, memory layout and allocation.

Three effects dominate in practice:

- **Locality.** Iterating an \`ArrayList\` walks a contiguous block, so the CPU prefetcher hides most memory latency. Iterating a \`LinkedList\` chases pointers to nodes scattered across the heap, and each hop is a potential cache miss. This is why \`LinkedList\` loses even for operations where its asymptotic cost looks better.
- **Allocation.** Every linked node is a separate object with a header, two references and the payload. A million-element \`LinkedList\` allocates a million objects; the equivalent \`ArrayList\` allocates a handful of arrays.
- **Hashing.** Hash-based structures are O(1) on average but degrade to O(log n) after treeification and O(n) if every key collides. Quality of \`hashCode\` is a performance decision, not a formality.

Measure before rewriting. A \`HashMap\` with a bad key type is slower than a sorted array with binary search, and a small \`ArrayList\` scanned linearly often beats a \`HashSet\` because it avoids hashing and pointer chasing entirely.`,
        },
        {
          id: 'what-the-framework-omits',
          title: 'What the framework does not give you',
          body: `Knowing the boundaries prevents misuse. The standard collections are **not thread-safe** by default: concurrent writes to a \`HashMap\` can corrupt internal state or spin forever during a resize. \`Collections.synchronizedMap\` wraps every method in a lock, which is correct but serialises all access; \`ConcurrentHashMap\` is the real answer for concurrent read/write workloads.

They are also **not persistent or immutable**. \`List.of(...)\` and \`Map.copyOf(...)\` produce unmodifiable snapshots, but there is no structural sharing, so "modifying" them means copying. A \`List.copyOf\` is a defensive copy, not a view.

Finally, they **do not store primitives**. A \`List<Integer>\` stores boxed \`Integer\` objects, so a million-element list costs roughly four bytes of reference plus sixteen bytes of object per value. The stream API's \`IntStream\`, \`LongStream\` and \`DoubleStream\` exist partly to avoid this boxing in numeric pipelines, and primitive arrays remain the right tool for dense numeric data.`,
        },
      ],
      javaCode: [
        {
          title: 'One method, many implementations',
          description:
            'Coding against Collection lets the same routine serve lists, sets and queues without a single instanceof check.',
          code: `import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;

public class PolymorphicCollections {

    static int totalLength(Collection<String> words) {
        int total = 0;
        for (String word : words) {
            total += word.length();
        }
        return total;
    }

    public static void main(String[] args) {
        Collection<String> asList = new ArrayList<>(List.of("core", "java"));
        Collection<String> asSet = new LinkedHashSet<>(List.of("core", "java", "core"));

        System.out.println(totalLength(asList)); // 8
        System.out.println(totalLength(asSet));  // 8, duplicate dropped
        System.out.println(asSet.size());        // 2
    }
}`,
        },
        {
          title: 'Walking the type hierarchy',
          description:
            'Reflection confirms the shape of the framework: ArrayList implements List, Collection and Iterable, but never Map.',
          code: `import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class HierarchyWalk {

    static void printSupertypes(Class<?> type, String indent) {
        System.out.println(indent + type.getSimpleName());
        for (Class<?> parent : type.getInterfaces()) {
            printSupertypes(parent, indent + "  ");
        }
    }

    public static void main(String[] args) {
        printSupertypes(ArrayList.class, "");
        System.out.println("Map is a Collection: " + Collection.class.isAssignableFrom(Map.class));
        System.out.println("List is a Collection: " + Collection.class.isAssignableFrom(List.class));
    }
}`,
        },
        {
          title: 'A map is not a collection',
          description:
            'Maps expose three collection views. Choose the view that matches the question you are asking.',
          code: `import java.util.HashMap;
import java.util.Map;

public class MapViews {

    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("keyboard", 12);
        stock.put("monitor", 4);
        stock.put("mouse", 30);

        System.out.println(stock.keySet());
        System.out.println(stock.values());
        System.out.println(stock.entrySet());

        int total = 0;
        for (Map.Entry<String, Integer> entry : stock.entrySet()) {
            total += entry.getValue();
        }
        System.out.println("units in stock: " + total);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Iterable is the root of traversal; Collection adds element-group operations; Map starts a separate hierarchy.',
        'List, Set and Queue each fix one policy about order and duplication, and every implementation is a trade-off inside that policy.',
        'Declare variables and parameters with the interface, and leak the concrete class only where its extra behaviour is required.',
        'ArrayList and HashMap are the correct defaults; move to ordered or sorted variants only when ordering is an actual requirement.',
        'Locality and allocation usually matter more than the difference between two O(1) operations.',
      ],
      interviewTips: [
        'Open with the hierarchy diagram and state explicitly that Map does not extend Collection, then explain the entrySet bridge.',
        'When asked "which collection", answer with the access pattern first and the big-O second, and mention the constant factors.',
        'Mention that the framework is neither thread-safe nor primitive-friendly to show you know where it stops.',
        'Naming java.util.concurrent equivalents (ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue) signals production experience.',
      ],
      pitfalls: [
        'Declaring fields as ArrayList or HashMap, which locks callers into one implementation for no benefit.',
        'Assuming HashSet or HashMap preserves any order that happens to appear during a test run.',
        'Using Stack because the name matches the concept; ArrayDeque is the modern replacement.',
        'Treating an unmodifiable view as immutable data: the underlying collection can still change underneath it.',
        'Forgetting that a Collection<Integer> stores boxed values, which matters in hot numeric loops.',
      ],
      quiz: [
        {
          question: 'Which interface is the direct supertype of Collection?',
          options: ['Iterator', 'Iterable', 'List', 'Map'],
          answerIndex: 1,
          explanation:
            'Collection extends Iterable, which supplies iterator(). Iterator is a separate cursor interface, and Map is not part of the Collection hierarchy at all.',
        },
        {
          question: 'A program needs unique elements and must iterate them in the order they were inserted. Which implementation fits best?',
          options: ['HashSet', 'TreeSet', 'LinkedHashSet', 'ArrayList'],
          answerIndex: 2,
          explanation:
            'LinkedHashSet combines a hash table for uniqueness with a doubly linked list that preserves insertion order. HashSet loses order, TreeSet sorts, and ArrayList allows duplicates.',
        },
      ],
    },
    {
      slug: 'iterable-and-iterator',
      title: 'Iterable, Iterator & Fail-Fast Behaviour',
      order: 2,
      summary: 'How the for-each loop really works, why modCount exists, and when iteration explodes.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'iterable-vs-iterator',
          title: 'Iterable versus Iterator',
          body: `\`Iterable<T>\` answers "can this object be traversed?" and declares a single method, \`Iterator<T> iterator()\`. \`Iterator<T>\` answers "where are we right now?" and holds the cursor state: \`hasNext()\`, \`next()\`, and optionally \`remove()\`.

The split is not cosmetic. If \`ArrayList\` implemented \`Iterator\` directly, the cursor would live on the list itself, and two nested loops over the same list would overwrite each other's position. Because \`iterator()\` returns a **fresh** iterator object on every call, any number of independent traversals can run simultaneously, and each sees its own snapshot of the cursor.

\`Iterable\` also earns its place as a parameter type. A method that accepts \`Iterable<? extends T>\` works with lists, sets, queues, \`Path\` from the file system, and any custom type you write, while a method accepting \`List<T>\` works with far fewer callers. Streaming frameworks and test helpers use this trick heavily, because traversal is the only capability they need.`,
        },
        {
          id: 'for-each-desugaring',
          title: 'What for-each compiles to',
          body: `The enhanced for loop is pure syntax sugar over \`Iterator\`. This code:

\`\`\`java
for (String name : names) {
    System.out.println(name);
}
\`\`\`

compiles to roughly the explicit form below, with the iterator variable hidden and \`hasNext()\` called once per iteration:

\`\`\`java
for (Iterator<String> it = names.iterator(); it.hasNext(); ) {
    String name = it.next();
    System.out.println(name);
}
\`\`\`

Two consequences follow. First, the loop works on any \`Iterable\`, which is why it accepts sets, deques and custom types with no index concept. Second, the iterator is invisible, so you cannot call \`it.remove()\` from inside a for-each loop. That is exactly why removing an element with \`names.remove(name)\` inside the loop throws \`ConcurrentModificationException\`: you changed the collection behind the iterator's back.

For arrays, the compiler emits a plain indexed loop instead, which is why for-each over an array does not create an iterator object at all.`,
        },
        {
          id: 'cursor-mechanics',
          title: 'Cursor mechanics in real collections',
          body: `Each implementation implements the same contract with completely different machinery, and knowing the shapes explains most performance surprises.

\`ArrayList.Itr\` is an inner class holding \`cursor\` (next index to read), \`lastRet\` (last index returned), and \`expectedModCount\`. \`next()\` reads \`elementData[cursor++]\` after a bounds check. Traversal is a linear scan of a contiguous array, which is as cache-friendly as Java gets.

\`LinkedList.ListItr\` holds a reference to the \`lastReturned\` node and the \`next\` node, and \`next()\` follows the \`next\` pointer. Traversal costs one pointer chase per element, and no indexing maths is involved.

\`HashMap.HashIterator\` holds the current bucket index and a \`next\` node inside the bucket chain, so iteration order depends entirely on bucket assignment. This is why \`HashMap\` iteration order is stable within one JVM run but unspecified across runs or after resizes.

\`TreeMap\`'s iterator walks the red-black tree in order using successor links, which yields sorted traversal without any extra sorting step.`,
        },
        {
          id: 'modcount-and-fail-fast',
          title: 'modCount and fail-fast behaviour',
          body: `Every non-concurrent collection carries a \`transient int modCount\` field that increments on each **structural** modification: an add, a remove, a clear, a resize that rehashes. Setting an existing value, as in \`list.set(i, value)\` or \`map.put(existingKey, value)\`, is not structural and leaves the counter alone.

When an iterator is created it snapshots \`expectedModCount = modCount\`. Every call to \`next()\` compares the two and throws \`ConcurrentModificationException\` on a mismatch. This is a **best-effort** diagnostic, not a concurrency guarantee: the check happens before reading, so a racing writer can still slip through, and a collection modified after the last \`next()\` may never report the problem. The Javadoc calls the behaviour "fail-fast" precisely because it fails early and loudly rather than returning nonsense.

The counter is also why removal through the collection fails while \`iterator.remove()\` succeeds. \`Iterator.remove()\` deletes the element and then resynchronises \`expectedModCount = modCount\`, keeping the cursor valid.`,
        },
        {
          id: 'writing-your-own-iterable',
          title: 'Writing your own Iterable',
          body: `Implementing \`Iterable\` is a small, self-contained exercise that makes the contract concrete. The type needs a stateful inner iterator, and each call to \`iterator()\` must return a new one.

The pattern is worth learning because it lets domain types participate in for-each and in the stream API for free: a class that implements \`Iterable\` also gets \`forEach\`, \`spliterator\` and \`stream()\` from default methods, as long as \`Spliterator\` can be derived from the iterator.

Two design points are easy to get wrong. First, do not return \`this\` from \`iterator()\`; that recreates the nested-loop bug the interface was designed to prevent. Second, if the underlying data can change, either snapshot it or track a modification count and throw \`ConcurrentModificationException\` yourself, so callers see consistent behaviour instead of silent corruption.

Records cannot easily hold the mutable cursor, so write a small final class with a private inner iterator.`,
        },
        {
          id: 'remove-and-listiterator',
          title: 'remove, forEachRemaining and ListIterator',
          body: `\`Iterator.remove()\` is optional and by default throws \`UnsupportedOperationException\`. When supported, it removes the element last returned by \`next()\`, and calling it before \`next()\` or twice in a row throws \`IllegalStateException\`. Immutable collections such as \`List.of\` return iterators that reject it.

\`forEachRemaining(Consumer)\` drains the rest of the iterator in one call. The default implementation loops over \`hasNext\` and \`next\`, but \`ArrayList\` overrides it with an indexed bulk loop and \`HashMap\` overrides it to walk buckets directly, so it is often faster than a hand-written loop.

\`ListIterator\` extends \`Iterator\` for lists and adds \`hasPrevious\`, \`previous\`, \`nextIndex\`, \`previousIndex\`, \`set\` and \`add\`. It is the only clean way to walk a list backwards or to replace elements during traversal via \`set\`. Note that \`add\` inserts before the cursor and does not invalidate the iterator, while mutating the list through any other route still breaks it.`,
        },
      ],
      javaCode: [
        {
          title: 'A custom Iterable',
          description:
            'A range type that yields its values through a fresh iterator on every call, so nested loops work correctly.',
          code: `import java.util.Iterator;
import java.util.NoSuchElementException;

public class Range implements Iterable<Integer> {

    private final int start;
    private final int end;

    public Range(int start, int end) {
        if (end < start) {
            throw new IllegalArgumentException("end must be >= start");
        }
        this.start = start;
        this.end = end;
    }

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            private int current = start;

            @Override
            public boolean hasNext() {
                return current < end;
            }

            @Override
            public Integer next() {
                if (!hasNext()) {
                    throw new NoSuchElementException();
                }
                return current++;
            }
        };
    }

    public static void main(String[] args) {
        Range range = new Range(1, 4);
        for (int outer : range) {
            for (int inner : range) {
                System.out.print(outer + "" + inner + " ");
            }
        }
        // 11 12 13 21 22 23 31 32 33
    }
}`,
        },
        {
          title: 'Removing during traversal',
          description:
            'The iterator is the only safe removal path during iteration; the collection method invalidates it.',
          code: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class SafeRemoval {

    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(4, 7, 10, 13, 16));

        for (Iterator<Integer> it = numbers.iterator(); it.hasNext(); ) {
            if (it.next() % 2 == 0) {
                it.remove();
            }
        }
        System.out.println(numbers); // [7, 13]

        try {
            for (Integer n : numbers) {
                if (n == 7) {
                    numbers.remove(n);
                }
            }
        } catch (java.util.ConcurrentModificationException ex) {
            System.out.println("fail-fast: " + ex.getClass().getSimpleName());
        }
    }
}`,
        },
        {
          title: 'Fail-fast is not thread safety',
          description:
            'modCount catches accidental structural changes, but concurrent access still needs a concurrent collection.',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class FailFastScope {

    public static void main(String[] args) {
        List<String> unsafe = new ArrayList<>(List.of("a", "b"));
        try {
            for (String value : unsafe) {
                unsafe.add(value.toUpperCase());
            }
        } catch (java.util.ConcurrentModificationException ex) {
            System.out.println("detected same-thread modification");
        }

        // A CopyOnWriteArrayList iterator works on an immutable snapshot.
        List<String> safe = new CopyOnWriteArrayList<>(List.of("a", "b"));
        for (String value : safe) {
            safe.add(value.toUpperCase());
        }
        System.out.println(safe); // [a, b, A, B]
    }
}`,
        },
      ],
      keyTakeaways: [
        'Iterable describes a source of traversal; Iterator holds one cursor and is created fresh per traversal.',
        'The enhanced for loop is sugar for an Iterator loop over Iterable, and an indexed loop over arrays.',
        'modCount plus expectedModCount gives Iterators their best-effort fail-fast check.',
        'Only iterator.remove() keeps the cursor valid; collection-level removal during traversal throws.',
        'Fail-fast detects bugs, it does not make a collection safe under concurrent access.',
      ],
      interviewTips: [
        'Explain why Iterable and Iterator are separate interfaces by describing the nested-loop corruption that a single cursor would cause.',
        'Walk through modCount and expectedModCount precisely; this is a favourite deep-dive question.',
        'Point out that ConcurrentModificationException can be thrown in single-threaded code, which surprises many candidates.',
        'Mention ListIterator for bidirectional traversal and in-place set().',
      ],
      pitfalls: [
        'Calling list.remove() inside a for-each loop and assuming only multi-threaded code can trigger the exception.',
        'Reusing the same iterator for two passes; iterators are single-use cursors.',
        'Calling Iterator.remove() twice without an intervening next(), which throws IllegalStateException.',
        'Believing fail-fast guarantees detection; modifications after the final next() pass silently.',
        'Depending on HashMap or HashSet iteration order across JVM runs.',
      ],
      quiz: [
        {
          question: 'What does the enhanced for loop compile to for a List?',
          options: [
            'An indexed loop using get(i)',
            'A loop over Iterator with hasNext() and next()',
            'A spliterator-based pipeline',
            'A recursive descent over the internal array',
          ],
          answerIndex: 1,
          explanation:
            'For any Iterable the compiler emits an iterator-based loop. Indexed loops are used only for arrays.',
        },
        {
          question: 'Which operation updates modCount?',
          options: [
            'list.set(2, "x") on an existing index',
            'map.put(existingKey, newValue)',
            'list.add("x")',
            'map.get(key)',
          ],
          answerIndex: 2,
          explanation:
            'modCount tracks structural changes such as add and remove. Replacing an existing element or value is not structural.',
        },
      ],
    },
    {
      slug: 'collection-interface',
      title: 'The Collection Interface',
      order: 3,
      summary: 'The universal method contract shared by lists, sets and queues, and what each method promises.',
      level: 'beginner',
      subtopics: [
        {
          id: 'the-core-contract',
          title: 'The core contract',
          body: `\`Collection<E>\` fixes a small vocabulary that every single-element container understands: \`size()\`, \`isEmpty()\`, \`contains(Object)\`, \`add(E)\`, \`remove(Object)\`, \`clear()\`, plus bulk and array operations. Implementations are free to add behaviour, but they may not weaken these promises.

The return types carry meaning. \`add\` returns \`boolean\` because a \`Set\` may decline a duplicate; a \`List\` always returns \`true\`. \`remove(Object)\` returns \`true\` only if something was actually removed, which makes "delete if present" a one-liner with no pre-check. \`contains\` is defined in terms of \`equals\`, so the element type's equality contract determines the answer.

\`isEmpty()\` deserves a note. It looks like sugar for \`size() == 0\`, and for most implementations it is, but some concurrent collections compute size by traversal while answering emptiness in constant time. Prefer \`isEmpty()\` everywhere: it states intent and never costs more.

\`clear()\` is optional in principle and throws \`UnsupportedOperationException\` on unmodifiable collections.`,
        },
        {
          id: 'why-contains-takes-object',
          title: 'Why contains takes Object',
          body: `The signature is \`boolean contains(Object o)\`, not \`contains(E e)\`, and the same is true of \`remove(Object)\`, \`containsAll(Collection<?>)\` and \`Map.get(Object)\`. Generics are erased at runtime, so the compiler cannot verify that a value is of type \`E\`; widening the parameter simply admits the truth.

The practical upside is that you can ask whether a \`Collection<Long>\` contains an \`Integer\` without an unchecked cast. The lookup compares with \`o.equals(element)\`, and \`Integer(1).equals(Long(1))\` is \`false\`, so the answer is a correct \`false\` rather than an exception.

The downside is that type errors move from compile time to "always false at runtime". A \`Set<String>\` queried with a \`StringBuilder\` compiles happily and silently returns \`false\`. IDE inspections and static analysis are the mitigation.

There is a subtlety in the direction of comparison: implementations call \`o.equals(element)\` in some paths and \`element.equals(o)\` in others. A non-symmetric \`equals\` therefore produces inconsistent results, which is one more reason to honour the equals contract strictly.`,
        },
        {
          id: 'bulk-operations',
          title: 'Bulk operations as set algebra',
          body: `The bulk methods turn a collection into a mutable set. Reading them as algebra avoids most confusion:

| Method | Meaning | Mutates receiver |
| --- | --- | --- |
| \`addAll(c)\` | union | yes |
| \`retainAll(c)\` | intersection | yes |
| \`removeAll(c)\` | difference | yes |
| \`containsAll(c)\` | subset test | no |

\`removeAll\` and \`retainAll\` return \`true\` if the receiver changed, which makes them easy to chain or assert on. Their complexity depends entirely on the receiver: on a \`HashSet\` each membership test is O(1), so the whole operation is O(n + m); on an \`ArrayList\`, each \`contains\` is a linear scan, so \`retainAll\` is O(n × m).

Parameter types are deliberately loose. \`addAll\` takes \`Collection<? extends E>\` because it only reads elements and produces \`E\`, while \`removeAll\` and \`retainAll\` take \`Collection<?>\` because they only compare. This is the PECS rule in action: producer extends, consumer super.

Bulk operations on an unmodifiable collection throw, but the failure may come after partial work, so do not rely on atomicity.`,
        },
        {
          id: 'array-interop',
          title: 'Array interoperability',
          body: `\`toArray()\` returns \`Object[]\`, which is rarely what you want. The generic overload \`<T> T[] toArray(T[] a)\` either fills the array you pass or allocates a new one of the same runtime type using reflection.

The idiom that survives every Java version is \`collection.toArray(new String[0])\`. Older code used \`new String[collection.size()]\` to avoid allocation; on modern JVMs the empty array is faster because the JIT recognises the pattern and the array is allocated only once, at the right size. Passing an array that is too small is still correct, just less efficient.

In the other direction, \`Arrays.asList(array)\` returns a fixed-size list **backed by the array**: \`set\` writes through, \`add\` and \`remove\` throw \`UnsupportedOperationException\`. \`List.of(array)\` copies instead, so it is truly immutable but costs an allocation. For a mutable copy, use \`new ArrayList<>(Arrays.asList(array))\` or \`Arrays.stream(array).collect(...)\`.`,
        },
        {
          id: 'default-methods',
          title: 'Default methods added in Java 8',
          body: `Java 8 added behaviour to \`Collection\` without breaking a single implementation, using default methods. The most important are:

- \`removeIf(Predicate)\` — removes every element matching the predicate and returns whether anything changed. It is implemented with \`iterator.remove()\`, so it is safe where a for-each loop is not.
- \`forEach(Consumer)\` — iterates in the collection's own order, if it has one.
- \`stream()\` and \`parallelStream()\` — adapt the collection into a pipeline.
- \`spliterator()\` — exposes the parallel traversal primitive that streams build on.
- \`retainAll\`, \`removeAll\` remain abstract, but \`removeIf\` covers most day-to-day filtering.

\`removeIf\` is not automatically faster than an explicit iterator loop, but it is shorter and removes the chance of forgetting to use the iterator. Note that \`removeIf\` on an immutable collection throws \`UnsupportedOperationException\` even when nothing matches, because the implementation attempts removal eagerly in some paths.

Default methods are also why \`Iterable\` gained \`forEach\` while every existing collection stayed source-compatible.`,
        },
      ],
      javaCode: [
        {
          title: 'Bulk operations as set algebra',
          description:
            'Union, intersection and difference expressed with addAll, retainAll and removeAll on mutable copies.',
          code: `import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class SetAlgebra {

    public static void main(String[] args) {
        Set<String> backend = new LinkedHashSet<>(List.of("java", "sql", "redis"));
        Set<String> frontend = new LinkedHashSet<>(List.of("java", "css", "react"));

        Set<String> union = new LinkedHashSet<>(backend);
        union.addAll(frontend);

        Set<String> intersection = new LinkedHashSet<>(backend);
        intersection.retainAll(frontend);

        Set<String> difference = new LinkedHashSet<>(backend);
        difference.removeAll(frontend);

        System.out.println("union        " + union);
        System.out.println("intersection " + intersection);
        System.out.println("difference   " + difference);
        System.out.println("subset       " + frontend.containsAll(List.of("java", "css")));

        Collection<String> mutable = new ArrayList<>(union);
        System.out.println("after retain " + mutable.retainAll(List.of("java", "react")));
    }
}`,
        },
        {
          title: 'Typed arrays and fixed-size views',
          description:
            'toArray with an empty array, plus the difference between a backed view and a copy.',
          code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArrayInterop {

    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("ada", "grace", "edsger"));
        String[] typed = names.toArray(new String[0]);
        System.out.println(Arrays.toString(typed));

        String[] backing = {"x", "y", "z"};
        List<String> view = Arrays.asList(backing);
        view.set(0, "X");
        System.out.println(backing[0]); // X, the view writes through

        try {
            view.add("w");
        } catch (UnsupportedOperationException ex) {
            System.out.println("fixed size: " + ex.getClass().getSimpleName());
        }

        List<String> copy = List.copyOf(view);
        backing[1] = "Y";
        System.out.println(copy); // [X, y, z], unaffected
    }
}`,
        },
        {
          title: 'removeIf and predicate-driven cleanup',
          description:
            'A single declarative call replaces an iterator loop, and works correctly on any mutable collection.',
          code: `import java.util.ArrayList;
import java.util.List;

record Session(String user, int minutes, boolean active) {}

public class RemoveIfDemo {

    public static void main(String[] args) {
        List<Session> sessions = new ArrayList<>(List.of(
                new Session("ada", 42, true),
                new Session("grace", 7, false),
                new Session("edsger", 65, true),
                new Session("barbara", 3, false)));

        boolean changed = sessions.removeIf(s -> !s.active() || s.minutes() < 5);
        System.out.println("removed something: " + changed);
        System.out.println(sessions);

        List<String> users = sessions.stream().map(Session::user).toList();
        System.out.println(users);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Collection defines the shared vocabulary of size, membership, mutation and bulk operations.',
        'add returns false only where duplicates are rejected; remove returns whether an element was found.',
        'contains and remove accept Object because of erasure, and compare with equals.',
        'addAll, retainAll and removeAll are union, intersection and difference, and their cost depends on the receiver.',
        'removeIf is the safe, readable way to delete matching elements without touching an iterator.',
      ],
      interviewTips: [
        'Explain PECS using addAll(Collection<? extends E>) versus removeAll(Collection<?>).',
        'Contrast Arrays.asList, which is a fixed-size view, with List.of, which is an immutable copy.',
        'Show that retainAll on an ArrayList is O(n × m), then note how converting to a HashSet fixes it.',
        'Mention that default methods let Collection grow in Java 8 without breaking binary compatibility.',
      ],
      pitfalls: [
        'Assuming Arrays.asList returns a resizable list; add and remove throw.',
        'Calling toArray() and casting Object[] to String[], which throws ClassCastException.',
        'Relying on removeAll or retainAll being atomic when an exception is thrown midway.',
        'Using contains on a collection of arrays or other types without a value-based equals.',
        'Forgetting that remove(Object) removes only the first match on a List.',
      ],
      quiz: [
        {
          question: 'What does list.removeAll(other) return?',
          options: [
            'The elements that were removed',
            'true if the list changed',
            'The number of elements removed',
            'A new list containing the difference',
          ],
          answerIndex: 1,
          explanation:
            'The bulk mutators return a boolean indicating whether the receiver was modified. The removed elements are not returned.',
        },
        {
          question: 'Which statement about Arrays.asList(array) is correct?',
          options: [
            'It returns an immutable copy of the array',
            'It returns a fixed-size list backed by the array',
            'It returns a resizable ArrayList',
            'It always copies the elements into a new array',
          ],
          answerIndex: 1,
          explanation:
            'The returned list writes through to the original array and supports set, but not add or remove.',
        },
      ],
    },
    {
      slug: 'list-implementations',
      title: 'List Implementations: ArrayList to Stack',
      order: 4,
      summary: 'Growth policy, memory layout and the real cost of ArrayList, LinkedList, Vector and Stack.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'the-list-contract',
          title: 'What List adds',
          body: `\`List<E>\` extends \`Collection<E>\` with positional access: \`get(int)\`, \`set(int, E)\`, \`add(int, E)\`, \`remove(int)\`, \`indexOf\`, \`lastIndexOf\`, \`subList\`, and the \`ListIterator\`. The contract promises an ordered sequence where duplicates are allowed and every element has a stable index.

Two aspects catch people out. First, \`remove\` is overloaded: \`remove(int)\` removes by position, \`remove(Object)\` removes by value. On a \`List<Integer>\`, \`list.remove(1)\` removes index 1, while \`list.remove(Integer.valueOf(1))\` removes the value 1. The compiler picks the most specific overload, and autoboxing does not save you.

Second, \`subList(from, to)\` returns a **view**, not a copy. It is backed by the parent, writes through, and reflects later structural changes. \`list.subList(0, 3).clear()\` removes the first three elements of the parent, which is the idiomatic way to delete a range. A view created before a structural modification generally throws \`ConcurrentModificationException\` on use.

\`List.equals\` is element-wise and order-sensitive, so \`ArrayList\` and \`LinkedList\` with the same contents are equal.`,
        },
        {
          id: 'arraylist-growth',
          title: 'ArrayList growth and amortised cost',
          body: `\`ArrayList\` wraps an \`Object[] elementData\` plus an \`int size\`. The default constructor starts with a shared empty array and lazily allocates capacity 10 on the first \`add\`. The capacity constructor lets you skip that growth entirely when the size is known.

When the array is full, \`grow()\` computes \`newCapacity = oldCapacity + (oldCapacity >> 1)\`, a 50% increase, then copies with \`Arrays.copyOf\`, which is a single \`System.arraycopy\` of the live elements. The copy is O(n), but it happens at sizes 10, 15, 22, 33, 49, and so on, so the total work for n appends is bounded by a geometric series. That gives amortised O(1) per append and O(n) worst case for the single append that triggers a resize.

Insertion or removal at index i shifts the tail with \`System.arraycopy\`, costing O(n - i). Appending at the end is cheap; inserting at the front is the worst case.

Two practical notes: \`ensureCapacity\` pre-sizes the array, and \`trimToSize\` releases slack after a bulk removal.`,
        },
        {
          id: 'linkedlist-anatomy',
          title: 'LinkedList anatomy and the locality problem',
          body: `\`LinkedList\` is a doubly linked list of \`Node<E>\` objects, each holding \`item\`, \`next\` and \`prev\`, plus \`first\` and \`last\` references on the list. It also implements \`Deque\`, so it doubles as a queue and stack.

Indexed access walks from whichever end is closer: \`node(index)\` compares the index against \`size >> 1\` and traverses forward or backward. That makes \`get(i)\` O(n), and a naive indexed for loop over a \`LinkedList\` is O(n²), which is the classic performance trap.

Iteration itself is O(n) and allocation-free, but every step follows a pointer to a node that may live anywhere in the heap. On modern hardware that is a likely cache miss per element, so even a straightforward traversal is several times slower than over an \`ArrayList\` of the same size.

Node insertion at a known position is O(1), which is the one case where the linked list wins: moving elements between lists via \`ListIterator\`, or an LRU cache built with \`LinkedHashMap\`. In almost every other benchmark, \`ArrayList\` is faster despite its O(n) middle inserts.`,
        },
        {
          id: 'vector-and-stack',
          title: 'Vector, Stack and the legacy trap',
          body: `\`Vector\` predates the framework and was retrofitted into it. Internally it is an array like \`ArrayList\`, but every public method is \`synchronized\` on the vector instance, and growth doubles the capacity instead of increasing it by half. The lock is held even for reads, so single-threaded use pays for a monitor it never needs, and compound operations such as check-then-act are still not atomic without external synchronisation.

\`Stack\` extends \`Vector\` and adds \`push\`, \`pop\`, \`peek\` and \`empty\`. Because it inherits the whole \`List\` API, you can insert at an arbitrary index and violate the LIFO invariant; the class cannot prevent it. Its synchronisation is also per-method, not per-operation.

The modern replacements are clear: \`ArrayDeque\` for a stack or queue in single-threaded code, \`ConcurrentLinkedDeque\` or a \`BlockingQueue\` when multiple threads are involved. \`Collections.synchronizedList(new ArrayList<>())\` is preferable to \`Vector\` when a locked list is genuinely required, because the intent is explicit and the implementation is not encumbered by legacy serialisation semantics.`,
        },
        {
          id: 'choosing-and-benchmarking',
          title: 'Choosing and benchmarking',
          body: `The default answer is \`ArrayList\`. It has the smallest per-element overhead, the best iteration behaviour, and O(1) random access. Choose something else only for a specific reason.

Reasons that hold up:

- **Thread safety** — \`CopyOnWriteArrayList\` for read-mostly listener lists, or a synchronised wrapper when writes are rare and iteration is external.
- **Immutability** — \`List.of\` for constants, \`List.copyOf\` for defensive copies. Both reject nulls and any mutation.
- **Deque behaviour** — \`ArrayDeque\`, even when the variable is typed as \`Deque\`.
- **Frequent splicing at a held cursor** — \`LinkedList\` genuinely helps, but only when the position is already known.

Benchmarks should use JMH, not \`System.currentTimeMillis\` in a loop, because the JIT eliminates dead code and warms up over thousands of iterations. Whatever the microbenchmark says, the memory-bound comparison usually favours the array: fewer objects, fewer pointers, better prefetching, and no per-node header.`,
        },
      ],
      javaCode: [
        {
          title: 'Growth is amortised, not free',
          description:
            'Pre-sizing with ensureCapacity removes the resize copies when the final size is known in advance.',
          code: `import java.util.ArrayList;
import java.util.List;

public class GrowthDemo {

    public static void main(String[] args) {
        List<Integer> lazy = new ArrayList<>();
        List<Integer> sized = new ArrayList<>(1_000_000);

        long start = System.nanoTime();
        for (int i = 0; i < 1_000_000; i++) {
            lazy.add(i);
        }
        long lazyTime = System.nanoTime() - start;

        start = System.nanoTime();
        for (int i = 0; i < 1_000_000; i++) {
            sized.add(i);
        }
        long sizedTime = System.nanoTime() - start;

        System.out.printf("lazy  %,d ns%n", lazyTime);
        System.out.printf("sized %,d ns%n", sizedTime);
        System.out.println("same contents: " + lazy.equals(sized));

        if (sized instanceof ArrayList<Integer> list) {
            list.trimToSize();
        }
    }
}`,
        },
        {
          title: 'subList is a view, not a copy',
          description:
            'Range deletion through a view mutates the parent; a copy would leave the original untouched.',
          code: `import java.util.ArrayList;
import java.util.List;

public class SubListDemo {

    public static void main(String[] args) {
        List<String> letters = new ArrayList<>(List.of("a", "b", "c", "d", "e", "f"));

        List<String> middle = letters.subList(1, 4);
        middle.set(0, "B");
        System.out.println(letters); // [a, B, c, d, e, f]

        middle.clear();
        System.out.println(letters); // [a, e, f]

        List<String> copy = new ArrayList<>(letters.subList(0, 2));
        copy.add("z");
        System.out.println(letters); // [a, e, f]
        System.out.println(copy);    // [a, e, z]
    }
}`,
        },
        {
          title: 'The indexed loop trap on LinkedList',
          description:
            'get(i) walks from the nearest end, so an indexed loop is quadratic while an enhanced for loop is linear.',
          code: `import java.util.LinkedList;
import java.util.List;

public class LinkedListTrap {

    static long indexedSum(List<Integer> values) {
        long sum = 0;
        for (int i = 0; i < values.size(); i++) {
            sum += values.get(i);
        }
        return sum;
    }

    static long iteratedSum(List<Integer> values) {
        long sum = 0;
        for (int value : values) {
            sum += value;
        }
        return sum;
    }

    public static void main(String[] args) {
        List<Integer> list = new LinkedList<>();
        for (int i = 0; i < 20_000; i++) {
            list.add(i);
        }

        long start = System.nanoTime();
        System.out.println(indexedSum(list));
        System.out.println("indexed  " + (System.nanoTime() - start) / 1_000_000 + " ms");

        start = System.nanoTime();
        System.out.println(iteratedSum(list));
        System.out.println("iterated " + (System.nanoTime() - start) / 1_000_000 + " ms");
    }
}`,
        },
      ],
      keyTakeaways: [
        'List adds positional access, order, duplicates and the subList view to Collection.',
        'ArrayList stores a contiguous Object[] and grows by 50%, which makes appends amortised O(1).',
        'LinkedList trades memory and locality for O(1) insertion when the node position is already known.',
        'Vector synchronises every method and doubles capacity; Stack extends Vector and is legacy.',
        'subList returns a backed view, and clearing it deletes the corresponding range of the parent.',
      ],
      interviewTips: [
        'State the exact growth formula oldCapacity + (oldCapacity >> 1) and explain why the total copy cost is linear.',
        'Explain why ArrayList beats LinkedList in practice: cache locality and per-node allocation overhead.',
        'Mention that remove(int) and remove(Object) are different overloads, a common source of bugs.',
        'Recommend ArrayDeque over Stack and explain that Stack inherits the entire List API.',
      ],
      pitfalls: [
        'Using an indexed for loop on a LinkedList, turning O(n) traversal into O(n²).',
        'Calling list.remove(1) on a List<Integer> expecting value removal instead of index removal.',
        'Storing a subList and then structurally modifying the parent, which invalidates the view.',
        'Assuming Vector is a safe concurrent choice; per-method locking does not make compound actions atomic.',
        'Forgetting that ArrayList allows null elements while List.of does not.',
      ],
      quiz: [
        {
          question: 'By how much does ArrayList grow its backing array when it fills?',
          options: ['It doubles', 'It grows by 50%', 'It adds 10 slots', 'It grows by 25%'],
          answerIndex: 1,
          explanation:
            'The implementation computes oldCapacity + (oldCapacity >> 1), a 1.5x increase. Vector is the class that doubles.',
        },
        {
          question: 'What does list.subList(1, 4).clear() do?',
          options: [
            'Nothing, the returned list is a copy',
            'Removes elements at indices 1, 2 and 3 from the parent list',
            'Removes elements 1 through 4 inclusive',
            'Throws UnsupportedOperationException',
          ],
          answerIndex: 1,
          explanation:
            'subList returns a backed view with an exclusive upper bound, so clearing it deletes those three elements from the parent.',
        },
      ],
    },
    {
      slug: 'map-and-set-internals',
      title: 'Map & Set Internals: HashMap, HashSet, TreeMap',
      order: 5,
      summary: 'Hashing, bucket collisions, treeification thresholds and red-black ordering under the hood.',
      level: 'advanced',
      subtopics: [
        {
          id: 'map-versus-collection',
          title: 'Why Map is separate',
          body: `A \`Map<K, V>\` maps each unique key to at most one value. It cannot extend \`Collection<V>\` without lying: \`add(V)\` has no key, \`iterator()\` would have to choose between keys, values and entries, and \`contains(Object)\` would be ambiguous.

The bridge is the entry view. \`entrySet()\` returns a \`Set<Map.Entry<K, V>>\`, and \`Map.Entry\` exposes \`getKey\`, \`getValue\`, \`setValue\` and the static \`comparingByKey\`/\`comparingByValue\` comparators. \`keySet()\` and \`values()\` are the other two views. All three are live: removing from a view removes from the map, and \`map.remove(key)\` is reflected in views already held.

The views also explain the iteration idiom. Iterating \`entrySet()\` performs one hash lookup per entry in total, whereas iterating \`keySet()\` and calling \`get(key)\` performs a lookup per entry, doubling the hashing work.

\`Map\` defines its own algebra: \`getOrDefault\`, \`putIfAbsent\`, \`computeIfAbsent\`, \`computeIfPresent\`, \`merge\`, \`replaceAll\`, all of which are atomic on concurrent maps.`,
        },
        {
          id: 'hashmap-storage',
          title: 'HashMap storage model',
          body: `A \`HashMap\` holds a \`Node<K, V>[] table\`, where each node carries \`final int hash\`, \`final K key\`, \`V value\` and \`Node<K, V> next\`. The table length is always a power of two and starts at 16 (lazily allocated on first put).

\`put\` does four things. First, it spreads the hash: \`h = key.hashCode(); hash = h ^ (h >>> 16)\`. XORing the high bits into the low bits matters because the index calculation discards everything above the table length. Without spreading, keys whose hashes differ only in the high 16 bits collide in small tables.

Second, it computes the bucket as \`(n - 1) & hash\`. Because n is a power of two, this mask is equivalent to \`hash % n\` but much cheaper, and it uses only the low bits, which is exactly why spreading is needed.

Third, it walks the bucket comparing hashes first and then \`equals\`, replacing the value if the key matches. Fourth, it inserts a new node at the tail, increments \`size\` and checks whether the map needs to grow or treeify. A null key is legal and always lands in bucket 0.`,
        },
        {
          id: 'collisions-and-treeification',
          title: 'Collisions and treeification',
          body: `Two different keys can share a bucket. Java resolves the collision with **separate chaining**: nodes in the same bucket form a singly linked list, and lookup scans it. With a decent hash distribution, buckets hold one or two entries and lookup is effectively O(1). With a bad \`hashCode\`, every key piles into one bucket and lookup degrades to O(n).

Java 8 added a defence. When a bucket's chain reaches \`TREEIFY_THRESHOLD = 8\` **and** the table has at least \`MIN_TREEIFY_CAPACITY = 64\` slots, the chain is converted into a red-black tree of \`TreeNode\` objects, and lookup becomes O(log n). If the table is smaller than 64, the map resizes instead of treeifying, because a bigger table is the cheaper fix.

On removal, a treeified bucket converts back to a list when it shrinks to \`UNTREEIFY_THRESHOLD = 6\`. The gap between 8 and 6 prevents thrashing at the boundary. Tree nodes also keep \`prev\` links so the tree can be traversed in insertion order and split across a resize.

The thresholds are probabilistic: with random hashes, a chain of 8 has vanishingly small probability, so treeification only triggers for genuinely poor hash functions or adversarial keys.`,
        },
        {
          id: 'resize-and-load-factor',
          title: 'Resize, load factor and rehashing',
          body: `The default load factor is \`0.75\`, and the resize threshold is \`capacity × loadFactor\`, so a 16-slot table resizes when the 13th entry arrives. The 0.75 value balances two costs: lower values waste memory but shorten chains, higher values fill the table but increase collisions. It is a statistical compromise, not a law.

\`resize()\` allocates a table of double the capacity and redistributes every node. Because capacity is a power of two, each key either stays at index \`i\` or moves to \`i + oldCap\`, depending on whether the bit at position \`log2(oldCap)\` is set. Java 8 exploits this: instead of recomputing hashes, it splits each bucket into a low list and a high list using \`(e.hash & oldCap) == 0\`, preserving relative order and avoiding a second hash pass.

A resize is O(n) and pauses the map. Pre-sizing with \`new HashMap<>(expectedSize)\` avoids several resizes; the constructor converts the requested capacity to the next power of two above \`expectedSize / 0.75\` so the threshold is not exceeded immediately.

Resizes also reorder iteration, so never rely on \`HashMap\` order.`,
        },
        {
          id: 'equals-hashcode-contract',
          title: 'The equals and hashCode contract',
          body: `Hash-based collections only work if the key type obeys the contract: if \`a.equals(b)\` then \`a.hashCode() == b.hashCode()\`. The converse is not required; equal hashes may belong to unequal keys, which is just a collision.

Break it in either direction and the map misbehaves. Override \`equals\` without \`hashCode\` and two "equal" keys land in different buckets: \`map.get(copy)\` returns null while \`map.containsKey(copy)\` is false, even though the entry is visibly there. Override \`hashCode\` without \`equals\` and unequal keys overwrite each other in the same bucket.

Mutability is the second trap. A key's hash is computed at insertion; if a field used in \`hashCode\` changes afterwards, the entry is stranded in a bucket the lookup will never visit. Keys should be immutable, which is why \`String\`, \`Integer\`, enums and records are ideal.

Records generate a correct \`equals\` and \`hashCode\` from their components, so they are the default choice for composite keys. For arrays, neither method is value-based; use \`List.of(...)\` or a record wrapper instead.`,
        },
        {
          id: 'hashset-and-treemap',
          title: 'HashSet, TreeSet and TreeMap',
          body: `\`HashSet\` has no storage engine of its own. It holds a private \`HashMap<E, Object>\` and a single shared sentinel:

\`\`\`java
private transient HashMap<E, Object> map;
private static final Object PRESENT = new Object();
\`\`\`

\`add(e)\` delegates to \`map.put(e, PRESENT)\` and returns whether the key was new, which is exactly the uniqueness guarantee. \`contains\` becomes \`containsKey\`, and iteration walks the map's key set. \`LinkedHashSet\` extends \`HashSet\` and switches the backing map to \`LinkedHashMap\`, which is why it preserves insertion order with no extra logic.

\`TreeSet\` is likewise a thin wrapper over \`TreeMap\`, which stores entries in a red-black tree: a self-balancing binary search tree where every path from root to leaf has comparable black height. Lookup, insert and delete are O(log n) worst case, and traversal is in sorted order.

The critical difference is uniqueness. \`HashSet\` uses \`equals\`; \`TreeSet\` uses \`compareTo\` (or the comparator). Returning 0 from \`compareTo\` for two objects that are not \`equals\` silently drops one of them.`,
        },
      ],
      javaCode: [
        {
          title: 'A correct composite key',
          description:
            'A record gives value equality and a consistent hash, which is exactly what a HashMap needs.',
          code: `import java.util.HashMap;
import java.util.Map;

record Coordinate(int row, int col) {}

public class CompositeKey {

    public static void main(String[] args) {
        Map<Coordinate, String> grid = new HashMap<>();
        grid.put(new Coordinate(0, 0), "start");
        grid.put(new Coordinate(2, 3), "treasure");

        System.out.println(grid.get(new Coordinate(2, 3)));   // treasure
        System.out.println(grid.containsKey(new Coordinate(0, 0))); // true

        // Arrays use identity equality, so this fails to find the entry.
        Map<int[], String> broken = new HashMap<>();
        broken.put(new int[]{1, 2}, "value");
        System.out.println(broken.get(new int[]{1, 2})); // null
        System.out.println(broken.get(broken.keySet().iterator().next())); // value
    }
}`,
        },
        {
          title: 'Map algebra with compute and merge',
          description:
            'computeIfAbsent, merge and getOrDefault replace the verbose containsKey plus get pattern.',
          code: `import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class MapAlgebra {

    public static void main(String[] args) {
        List<String> words = List.of("java", "map", "set", "java", "stream", "map", "java");

        Map<String, Integer> counts = new HashMap<>();
        for (String word : words) {
            counts.merge(word, 1, Integer::sum);
        }
        System.out.println(counts);

        Map<Integer, List<String>> byLength = new TreeMap<>();
        for (String word : words) {
            byLength.computeIfAbsent(word.length(), k -> new java.util.ArrayList<>()).add(word);
        }
        System.out.println(byLength);

        System.out.println(counts.getOrDefault("kotlin", 0));
        counts.computeIfPresent("set", (k, v) -> v + 10);
        System.out.println(counts.get("set"));
    }
}`,
        },
        {
          title: 'TreeMap ordering and range views',
          description:
            'NavigableMap exposes the tree structure as floor, ceiling and sub-range queries.',
          code: `import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

public class TreeNavigation {

    public static void main(String[] args) {
        NavigableMap<Integer, String> ranks = new TreeMap<>();
        ranks.put(10, "ten");
        ranks.put(20, "twenty");
        ranks.put(30, "thirty");
        ranks.put(40, "forty");

        System.out.println(ranks.firstKey());          // 10
        System.out.println(ranks.lastKey());           // 40
        System.out.println(ranks.floorKey(25));        // 20
        System.out.println(ranks.ceilingKey(25));      // 30
        System.out.println(ranks.headMap(30, false));  // {10=ten, 20=twenty}
        System.out.println(ranks.descendingMap());

        for (Map.Entry<Integer, String> entry : ranks.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'HashMap spreads the hash with h ^ (h >>> 16) so the low bits used by (n - 1) & hash still carry entropy.',
        'Chains treeify at 8 entries when capacity is at least 64, and untreeify at 6 to avoid thrashing.',
        'The 0.75 load factor triggers a doubling resize that splits buckets into low and high lists.',
        'HashSet is a HashMap with a shared PRESENT value; TreeSet is a TreeMap key view.',
        'TreeSet and TreeMap define uniqueness with compareTo, not equals, so an inconsistent comparator loses data.',
      ],
      interviewTips: [
        'Derive the index formula (n - 1) & hash and explain why the table size must be a power of two.',
        'Quote the thresholds precisely: 8 to treeify, 6 to untreeify, 64 minimum capacity, 0.75 load factor.',
        'Explain the resize split with (hash & oldCap) == 0 rather than recomputing hashes.',
        'Contrast equals-based and compareTo-based uniqueness when the interviewer asks about TreeSet.',
      ],
      pitfalls: [
        'Overriding equals without hashCode, so lookups miss entries that are present.',
        'Using a mutable object as a key and changing a hashed field after insertion.',
        'Returning 0 from compareTo for objects that are not equals, which silently merges TreeSet elements.',
        'Setting a tiny initial capacity and expecting no resizes.',
        'Using an array as a HashMap key, since arrays compare by identity.',
      ],
      quiz: [
        {
          question: 'A HashMap bucket chain is converted to a red-black tree when which conditions hold?',
          options: [
            'Chain length reaches 8 regardless of table size',
            'Chain length reaches 8 and table capacity is at least 64',
            'Chain length reaches 6 and load factor exceeds 0.75',
            'Table capacity reaches 16',
          ],
          answerIndex: 1,
          explanation:
            'Below 64 slots the map resizes instead, because a larger table is cheaper than a tree. The untreeify threshold is 6.',
        },
        {
          question: 'Why does HashMap XOR the hash with its own upper 16 bits?',
          options: [
            'To make hashes positive',
            'To reduce the chance that keys differing only in high bits collide in small tables',
            'To make hashCode deterministic across JVMs',
            'To speed up resizing',
          ],
          answerIndex: 1,
          explanation:
            'The bucket index uses only the low bits, so folding high bits downward distributes entropy into the bits that matter.',
        },
      ],
    },
    {
      slug: 'specialized-maps',
      title: 'Specialized Maps: EnumMap, IdentityHashMap & More',
      order: 6,
      summary: 'Order-aware, array-backed, identity-based and weakly referenced maps, plus when each one earns its place.',
      level: 'advanced',
      subtopics: [
        {
          id: 'linkedhashmap-order',
          title: 'LinkedHashMap and access order',
          body: `\`LinkedHashMap\` extends \`HashMap\` and threads a doubly linked list through all entries, using \`before\` and \`after\` fields on each node. The hash table still decides bucket placement, so lookup keeps its O(1) average; the list only fixes iteration order.

The constructor takes a third argument, \`accessOrder\`. With \`false\` (the default) iteration follows insertion order. With \`true\`, every \`get\` and \`put\` of an existing key moves that entry to the tail, producing least-recently-used order at the head. This is the entire basis of the classic LRU cache:

- override \`removeEldestEntry(eldest)\` to return \`size() > capacity\`;
- \`put\` then evicts the head automatically after insertion.

\`LinkedHashSet\` is the same structure for keys only. Iteration order is deterministic across runs, which makes both classes useful for reproducible output and serialisation, at the cost of two extra references per entry and slightly slower writes. Removal during iteration is still fail-fast.`,
        },
        {
          id: 'enummap',
          title: 'EnumMap: an array in disguise',
          body: `An enum constant has a fixed ordinal assigned at compile time, which means an enum type has a known, dense key space. \`EnumMap<K extends Enum<K>, V>\` exploits this directly: internally it holds a plain \`Object[] vals\` indexed by \`key.ordinal()\`, plus a \`Class<K> keyType\` for validation and a \`boolean[]\` to distinguish "mapped to null" from "absent".

Consequences follow immediately. \`get\` and \`put\` are a single array access, with no hashing, no bucket walk and no node allocation. Memory is one slot per constant regardless of how many are used, and iteration simply scans the array, so it is fast and ordinal-ordered.

Restrictions: null keys are rejected (with a \`NullPointerException\`), the key type must be a single enum, and the map cannot be created without the class token unless the first put reveals it. \`EnumMap\` also rejects keys of a different enum type at runtime with \`ClassCastException\`.

For configuration tables, state machines and per-category counters, \`EnumMap\` is strictly better than \`HashMap\`. Use \`EnumSet\` for the set equivalent: a bit vector over the ordinals, usually a single \`long\`.`,
        },
        {
          id: 'identityhashmap',
          title: 'IdentityHashMap and reference equality',
          body: `\`IdentityHashMap<K, V>\` deliberately violates the \`Map\` contract's equality clause: it compares keys with \`==\` and hashes them with \`System.identityHashCode\`, ignoring \`equals\` and \`hashCode\` entirely.

The implementation is a flat \`Object[] table\` storing alternating key and value slots, with linear probing on collision. That is a different layout from \`HashMap\`'s node chains: no per-entry objects, better locality, but probing degrades on a crowded table. The expected size should be passed to the constructor when known.

Typical uses are framework-level: tracking visited objects during graph serialisation or deep cloning, where two equal but distinct instances must remain distinct; and compiler or interpreter symbol tables keyed by node identity.

Because it ignores value equality, it is the wrong tool for domain keys. \`map.get("hello")\` only finds an entry if that exact \`String\` instance was inserted, which is fragile with string interning. Also note the iteration order is unspecified, and null keys are allowed.`,
        },
        {
          id: 'weakhashmap',
          title: 'WeakHashMap and collectable keys',
          body: `\`WeakHashMap\` wraps each key in a \`WeakReference\` registered with a \`ReferenceQueue\`. When no strong reference to a key remains, the garbage collector clears the reference and enqueues it; the next map operation drains the queue and removes the corresponding entry. The map therefore shrinks on its own without explicit cleanup.

The fine print is where it bites. Entries are only purged when the map is touched, so a \`WeakHashMap\` can hold cleared entries for a while and \`size()\` may be stale between operations. If the **value** strongly references its own key, the entry becomes a self-retaining cycle and is never collected. And if the key is a string literal, an interned string, or a boxed small integer, it is reachable from the constant pool or cache and will never be collected either.

Legitimate use: attaching metadata to objects you do not own, such as per-class caches keyed by \`Class\`, or listener registries where the listener's lifetime controls the entry. For bounded caches with eviction policy, a real cache library is clearer than relying on GC timing.`,
        },
        {
          id: 'immutable-and-factory-maps',
          title: 'Immutable maps and factory methods',
          body: `\`Map.of\`, \`Map.ofEntries\` and \`Map.copyOf\` produce unmodifiable maps with value-based equality and iteration order that is deliberately randomised per JVM run to discourage reliance on it. They reject null keys and values, and any mutator throws \`UnsupportedOperationException\`.

These are snapshots, not views. \`Map.copyOf(existing)\` allocates and copies, so later changes to the source are invisible, and the copy is safe to share across threads because nothing can mutate it. That makes them ideal for constants, configuration and return values of public methods.

\`Collections.unmodifiableMap(map)\` is different: it is a read-only **view** over a map that can still change. Callers see mutations made elsewhere, which is sometimes desirable for internal state and surprising when returned from an API.

For keys, prefer \`Map.Entry\`-free immutable types such as records; for sets and lists the same rules apply through \`Set.of\` and \`List.of\`. Note that immutable maps use a compact open-addressing layout, so their lookup performance is competitive with \`HashMap\` for small sizes.`,
        },
      ],
      javaCode: [
        {
          title: 'An LRU cache with LinkedHashMap',
          description:
            'Access order plus removeEldestEntry gives a bounded cache in a dozen lines, with no manual bookkeeping.',
          code: `import java.util.LinkedHashMap;
import java.util.Map;

public class LruCache<K, V> extends LinkedHashMap<K, V> {

    private final int capacity;

    public LruCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }

    public static void main(String[] args) {
        LruCache<String, Integer> cache = new LruCache<>(3);
        cache.put("a", 1);
        cache.put("b", 2);
        cache.put("c", 3);
        cache.get("a");          // a becomes most recently used
        cache.put("d", 4);       // evicts b
        System.out.println(cache);
        System.out.println(cache.containsKey("b")); // false
    }
}`,
        },
        {
          title: 'EnumMap and EnumSet',
          description:
            'Ordinal indexing removes hashing entirely, and EnumSet packs membership into a bit vector.',
          code: `import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

enum Status { NEW, ACTIVE, SUSPENDED, CLOSED }

public class EnumCollections {

    public static void main(String[] args) {
        Map<Status, Integer> counts = new EnumMap<>(Status.class);
        for (Status status : Status.values()) {
            counts.put(status, 0);
        }
        counts.merge(Status.ACTIVE, 3, Integer::sum);
        counts.merge(Status.NEW, 5, Integer::sum);

        System.out.println(counts);
        System.out.println(counts.get(Status.CLOSED));

        Set<Status> terminal = EnumSet.of(Status.CLOSED);
        Set<Status> open = EnumSet.complementOf(EnumSet.copyOf(terminal));
        System.out.println(terminal);
        System.out.println(open);
    }
}`,
        },
        {
          title: 'Identity vs equality',
          description:
            'IdentityHashMap distinguishes equal-but-distinct instances, which is the point of identity-based keys.',
          code: `import java.util.IdentityHashMap;
import java.util.HashMap;
import java.util.Map;

public class IdentityDifference {

    record Id(int value) {}

    public static void main(String[] args) {
        Id first = new Id(7);
        Id second = new Id(7);

        Map<Id, String> byValue = new HashMap<>();
        byValue.put(first, "first");
        System.out.println(byValue.get(second)); // first, records compare by value

        Map<Id, String> byIdentity = new IdentityHashMap<>();
        byIdentity.put(first, "first");
        System.out.println(byIdentity.get(first));  // first
        System.out.println(byIdentity.get(second)); // null, different instance
        System.out.println(byIdentity.size());

        Map<Object, Integer> labels = new IdentityHashMap<>();
        labels.put("interned", 1);
        labels.put(new String("interned"), 2);
        System.out.println(labels.size()); // 2
    }
}`,
        },
      ],
      keyTakeaways: [
        'LinkedHashMap adds a linked list over the hash table; accessOrder=true plus removeEldestEntry yields an LRU cache.',
        'EnumMap stores values in an Object[] indexed by ordinal, so it needs no hashing and rejects null keys.',
        'IdentityHashMap compares keys with == and System.identityHashCode, and uses a flat probing array.',
        'WeakHashMap purges entries whose keys are no longer strongly reachable, but only when the map is next touched.',
        'Map.of and Map.copyOf return immutable snapshots; Collections.unmodifiableMap returns a live read-only view.',
      ],
      interviewTips: [
        'Show the LRU cache implementation from memory; it is a very common coding prompt and demonstrates access order.',
        'Explain why EnumMap is faster than HashMap for enum keys by describing ordinal-indexed array access.',
        'Distinguish a weak key from a strong value that references the key, which prevents collection.',
        'Contrast unmodifiableMap (view) with copyOf (snapshot) with a concrete mutation example.',
      ],
      pitfalls: [
        'Using LinkedHashMap access order without overriding removeEldestEntry, so it grows without bound.',
        'Trying to insert a null key into EnumMap.',
        'Expecting IdentityHashMap to find an equal string instance that was not the one inserted.',
        'Assuming WeakHashMap cleans up immediately after the last strong reference disappears.',
        'Returning Collections.unmodifiableMap(internalMap) and leaking later internal mutations to callers.',
      ],
      quiz: [
        {
          question: 'Which map is best suited to keys that are enum constants?',
          options: ['HashMap', 'TreeMap', 'EnumMap', 'IdentityHashMap'],
          answerIndex: 2,
          explanation:
            'EnumMap indexes a plain array by ordinal, avoiding hashing and node allocation, and iterates in ordinal order.',
        },
        {
          question: 'What does LinkedHashMap with accessOrder=true do on get?',
          options: [
            'Returns the value without changing order',
            'Moves the accessed entry to the end of the iteration order',
            'Removes the entry after reading',
            'Rehashes the entry',
          ],
          answerIndex: 1,
          explanation:
            'Access order moves the touched entry to the tail, which makes the head the least recently used entry for LRU eviction.',
        },
      ],
    },
    {
      slug: 'queue-and-priorityqueue',
      title: 'Queue, Deque & PriorityQueue',
      order: 7,
      summary: 'FIFO and double-ended contracts, ring buffers, and the binary heap inside PriorityQueue.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'queue-contract',
          title: 'The Queue contract and its two method families',
          body: `\`Queue<E>\` models a pipeline: elements enter at the tail and leave at the head. It defines six operations in three pairs, each offered in a throwing form and a value-returning form.

| Purpose | Throws on failure | Returns sentinel |
| --- | --- | --- |
| Insert | \`add(e)\` | \`offer(e)\` |
| Remove head | \`remove()\` | \`poll()\` |
| Inspect head | \`element()\` | \`peek()\` |

\`add\` throws \`IllegalStateException\` when a bounded queue is full, whereas \`offer\` returns \`false\`. \`remove\` and \`element\` throw \`NoSuchElementException\` on an empty queue, while \`poll\` and \`peek\` return \`null\`. Because \`null\` signals emptiness, most implementations forbid null elements; \`LinkedList\` is the notorious exception, and a null stored there makes \`poll\` ambiguous.

In production code prefer \`offer\`, \`poll\` and \`peek\`: exceptions should signal bugs, not normal control flow such as "queue drained". The throwing forms are convenient in tests and in code where an empty queue genuinely is a programming error.

\`Queue\` does not require FIFO. \`PriorityQueue\` orders by priority, and \`Deque\` implementations can be used either way.`,
        },
        {
          id: 'deque-and-arraydeque',
          title: 'Deque and ArrayDeque',
          body: `\`Deque<E>\` extends \`Queue\` with operations at both ends: \`addFirst\`, \`addLast\`, \`offerFirst\`, \`offerLast\`, \`removeFirst\`, \`removeLast\`, \`pollFirst\`, \`pollLast\`, \`peekFirst\`, \`peekLast\`, plus \`push\`, \`pop\` and a descending iterator.

\`ArrayDeque\` implements it with a resizable circular array: a \`Object[] elements\` plus \`int head\` and \`int tail\`. Both ends are O(1) because the index arithmetic wraps with \`(head - 1) & (length - 1)\`. The capacity is always a power of two, doubling when full, and the array is allocated lazily at 16 on first insertion.

It is the fastest general-purpose stack and queue in the JDK: no node allocation, no pointer chasing, excellent locality. It forbids null elements, which is deliberate, since \`null\` is the empty signal for \`poll\` and \`peek\`.

Use \`ArrayDeque\` for DFS stacks, BFS queues and sliding-window problems. \`LinkedList\` also implements \`Deque\` but allocates a node per element; it is only preferable when you also need \`List\` operations at arbitrary positions.`,
        },
        {
          id: 'priorityqueue-heap',
          title: 'PriorityQueue as a binary heap',
          body: `\`PriorityQueue<E>\` stores elements in a binary **min-heap** laid out in a plain \`Object[] queue\`. The tree is implicit in the indices:

- parent of \`i\` is \`(i - 1) >>> 1\`
- left child of \`i\` is \`2 * i + 1\`
- right child of \`i\` is \`2 * i + 2\`

\`offer\` appends at the end and calls \`siftUp\`: while the new element is smaller than its parent, swap them. That is at most log n swaps. \`poll\` takes \`queue[0]\`, moves the last element to the root, and calls \`siftDown\`, repeatedly swapping with the smaller child until the heap property holds. \`peek\` is a single array read.

The ordering comes from \`compareTo\` for \`Comparable\` elements or from the supplied \`Comparator\`. For a max-heap either reverse the comparator with \`Comparator.reverseOrder()\` or compare in the opposite direction; never negate subtraction results, which overflows.

Construction from a collection uses \`heapify\` with sift-down from the middle backwards, which is O(n) rather than O(n log n) for n successive inserts.`,
        },
        {
          id: 'heap-limits-and-iteration',
          title: 'Heap limits: iteration, mutation and ties',
          body: `A heap only guarantees the root is extremal. The rest of the array is partially ordered, so iterating a \`PriorityQueue\` does **not** produce sorted output, and \`toString\` looks arbitrary. To consume elements in order, poll repeatedly, which is O(n log n) overall; to sort without destroying the queue, copy and sort.

Elements must not change in a way that affects comparison while they are in the queue. Mutating a field used by \`compareTo\` corrupts the heap silently, because no sift happens. This is why priority queues are usually filled with immutable records.

Ties are resolved arbitrarily, so equal-priority elements have no stable order. When stability matters, add a monotonically increasing sequence number to the comparator's secondary key.

\`PriorityQueue\` is not thread-safe; \`PriorityBlockingQueue\` adds blocking take operations but still offers no ordering guarantee for iteration. It also does not support null elements, and its iterator is fail-fast.`,
        },
        {
          id: 'concurrent-queues',
          title: 'Blocking and concurrent queues',
          body: `The \`java.util.concurrent\` package supplies queue implementations designed for hand-off between threads:

- \`ArrayBlockingQueue\` — bounded, array-backed, optional fairness for waiting producers and consumers.
- \`LinkedBlockingQueue\` — optionally bounded, node-based, higher throughput under contention because it uses separate locks for head and tail.
- \`SynchronousQueue\` — zero capacity; each \`put\` waits for a matching \`take\`, ideal for direct hand-off.
- \`PriorityBlockingQueue\` — unbounded, heap-ordered, blocking \`take\`.
- \`DelayQueue\` — elements become available only after their delay expires.
- \`ConcurrentLinkedQueue\` — unbounded, lock-free, no blocking; \`poll\` returns null when empty.

The \`BlockingQueue\` methods mirror \`Queue\`: \`put\` blocks when full, \`take\` blocks when empty, \`offer\` with a timeout gives bounded waiting. That vocabulary is the basis of producer-consumer pipelines and thread pools, where \`ThreadPoolExecutor\` consumes from a work queue.

Choosing between them is about bounds and back-pressure: unbounded queues never block producers but can exhaust memory, bounded queues apply back-pressure at the cost of blocking.`,
        },
      ],
      javaCode: [
        {
          title: 'A priority queue of tasks',
          description:
            'A record with an explicit Comparator keeps ordering stable and avoids mutating elements once queued.',
          code: `import java.util.Comparator;
import java.util.PriorityQueue;

record Task(String name, int priority, long sequence) {}

public class TaskQueue {

    public static void main(String[] args) {
        Comparator<Task> byPriority = Comparator
                .comparingInt(Task::priority)
                .thenComparingLong(Task::sequence);

        PriorityQueue<Task> queue = new PriorityQueue<>(byPriority);
        queue.offer(new Task("backup", 5, 1));
        queue.offer(new Task("deploy", 1, 2));
        queue.offer(new Task("metrics", 3, 3));
        queue.offer(new Task("alert", 1, 4));

        System.out.println(queue.peek().name()); // deploy, lower number runs first
        while (!queue.isEmpty()) {
            System.out.println(queue.poll());
        }
    }
}`,
        },
        {
          title: 'ArrayDeque as stack and queue',
          description:
            'One class covers LIFO and FIFO, and no nulls are allowed because null signals emptiness.',
          code: `import java.util.ArrayDeque;
import java.util.Deque;

public class DequeUsage {

    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1);
        stack.push(2);
        stack.push(3);
        System.out.println(stack.pop()); // 3
        System.out.println(stack.peek()); // 2

        Deque<String> queue = new ArrayDeque<>();
        queue.offerLast("first");
        queue.offerLast("second");
        queue.offerLast("third");
        System.out.println(queue.pollFirst()); // first
        System.out.println(queue.pollLast());  // third

        try {
            queue.push(null);
        } catch (NullPointerException ex) {
            System.out.println("nulls are rejected");
        }
    }
}`,
        },
        {
          title: 'Top-k with a bounded heap',
          description:
            'A min-heap of size k keeps the k largest values in O(n log k) time and O(k) space.',
          code: `import java.util.PriorityQueue;
import java.util.List;

public class TopK {

    static List<Integer> largest(int[] values, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(k);
        for (int value : values) {
            heap.offer(value);
            if (heap.size() > k) {
                heap.poll();
            }
        }
        return heap.stream().sorted().toList();
    }

    public static void main(String[] args) {
        int[] values = {5, 1, 9, 3, 7, 8, 2};
        System.out.println(largest(values, 3)); // [7, 8, 9]
    }
}`,
        },
      ],
      keyTakeaways: [
        'Queue offers throwing and sentinel method pairs; prefer offer, poll and peek for normal flow.',
        'Deque adds operations at both ends; ArrayDeque is a circular array and the best default stack or queue.',
        'PriorityQueue is an array-backed binary min-heap with O(log n) offer and poll and O(1) peek.',
        'Iterating a heap is not sorted; poll repeatedly for ordered consumption.',
        'BlockingQueue adds put and take with blocking, and bounded variants provide back-pressure.',
      ],
      interviewTips: [
        'Explain sift-up and sift-down using the parent and child index formulas; interviewers often ask you to derive them.',
        'Note that building a heap from a collection is O(n) via heapify, not O(n log n).',
        'Bring up the top-k pattern with a bounded heap, since it is the most common PriorityQueue coding question.',
        'Mention back-pressure when comparing bounded and unbounded blocking queues.',
      ],
      pitfalls: [
        'Iterating a PriorityQueue expecting sorted order.',
        'Modifying a queued element field that participates in comparison, which corrupts the heap.',
        'Using subtractive comparators that overflow for large int values.',
        'Storing null in a LinkedList used as a Queue, making poll ambiguous.',
        'Ignoring the difference between the throwing and sentinel method families.',
      ],
      quiz: [
        {
          question: 'What is the time complexity of poll() on a PriorityQueue of n elements?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          answerIndex: 1,
          explanation:
            'poll removes the root, moves the last element to index 0 and sifts it down, touching at most one path of height log n.',
        },
        {
          question: 'Why does ArrayDeque reject null elements?',
          options: [
            'To save memory',
            'Because null is used as the empty sentinel by poll and peek',
            'Because arrays cannot store null',
            'To make it thread-safe',
          ],
          answerIndex: 1,
          explanation:
            'poll and peek return null when empty, so allowing null elements would make the result ambiguous.',
        },
      ],
    },
    {
      slug: 'comparable-and-collections',
      title: 'Comparable, Comparator & the Collections Utility',
      order: 8,
      summary: 'Natural ordering, external comparators and the static algorithms that operate on them.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'comparable-contract',
          title: 'Comparable and natural ordering',
          body: `\`Comparable<T>\` declares one method, \`int compareTo(T other)\`, and defines the type's single **natural ordering**. The return value follows a strict convention: negative means \`this\` comes before \`other\`, zero means they are equal in ordering, positive means \`this\` comes after.

The contract has three requirements that are easy to violate:

- **Antisymmetry** — \`a.compareTo(b)\` and \`b.compareTo(a)\` must have opposite signs.
- **Transitivity** — if a < b and b < c then a < c.
- **Consistency with equals** — \`a.compareTo(b) == 0\` should imply \`a.equals(b)\`.

The third is strongly recommended rather than required, but sorted collections depend on it: \`TreeSet\` and \`TreeMap\` use \`compareTo\` to decide uniqueness, so an inconsistent implementation silently drops elements that are not actually equal.

Never implement \`compareTo\` by subtraction. \`this.value - other.value\` overflows for large integers and returns the wrong sign. Use \`Integer.compare(this.value, other.value)\`, \`Long.compare\`, or \`Comparator.comparingInt\`.`,
        },
        {
          id: 'comparator-alternatives',
          title: 'Comparator and its combinators',
          body: `\`Comparator<T>\` is the external, reusable ordering strategy. Because a class has only one natural order, comparators provide the rest: by name, by price, by date descending, with nulls first.

The static factories in \`Comparator\` remove nearly all boilerplate:

| Factory | Purpose |
| --- | --- |
| \`comparing(keyExtractor)\` | Sort by a \`Comparable\` key |
| \`comparingInt\` / \`comparingLong\` / \`comparingDouble\` | Avoid boxing in the key extractor |
| \`thenComparing(other)\` | Secondary ordering when the first is equal |
| \`reversed()\` | Invert an existing comparator |
| \`nullsFirst(c)\` / \`nullsLast(c)\` | Define null placement explicitly |
| \`naturalOrder()\` / \`reverseOrder()\` | Ordering by \`compareTo\` |
| \`comparingByKey\` / \`comparingByValue\` | Entry comparators for maps |

A comparator is a functional interface, so it can be a lambda, a method reference or a chain of factories. Chains are immutable: \`reversed()\` returns a new comparator rather than mutating the original, which matters when comparators are shared static constants.`,
        },
        {
          id: 'sorted-collections',
          title: 'Sorted collections and comparator precedence',
          body: `\`TreeSet\` and \`TreeMap\` keep their elements ordered by \`compareTo\` or by a supplied \`Comparator\`. When a comparator is provided, it **replaces** natural ordering entirely, including for uniqueness: \`new TreeSet<>(Comparator.comparing(String::length))\` treats "cat" and "dog" as the same element because both have length 3, and the second add returns \`false\`.

This produces one of the classic production bugs: a tree set keyed by one field silently losing records that differ only in other fields. Always make the comparator total, ending with a tie-breaker on a unique field or on \`System.identityHashCode\`.

\`NavigableSet\` and \`NavigableMap\` add range and neighbour queries: \`floor\`, \`ceiling\`, \`higher\`, \`lower\`, \`headSet\`, \`tailSet\`, \`subSet\`, \`descendingSet\`, and \`pollFirst\`/\`pollLast\` for priority-style access. These are O(log n) and impossible to express efficiently with a hash-based structure.

Note that \`HashSet\` and \`TreeSet\` are not equal even with identical contents, because \`AbstractSet.equals\` compares membership, which does work across implementations.`,
        },
        {
          id: 'collections-utility',
          title: 'The Collections utility class',
          body: `\`java.util.Collections\` is a static utility belt, not to be confused with the \`Collection\` interface. Its most used members:

- \`sort(list)\` and \`sort(list, comparator)\` — stable merge sort on the list's array, O(n log n).
- \`binarySearch(list, key)\` — O(log n), but only on a list sorted with the same ordering; otherwise the result is undefined.
- \`reverse\`, \`rotate\`, \`swap\`, \`shuffle\` — in-place order manipulation.
- \`max\`, \`min\`, \`frequency\`, \`disjoint\` — scans.
- \`unmodifiableList\`, \`unmodifiableMap\`, \`unmodifiableCollection\` — read-only views.
- \`synchronizedList\`, \`synchronizedMap\` — lock-per-method wrappers.
- \`emptyList\`, \`singletonList\`, \`nCopies\` — compact immutable instances.
- \`addAll\`, \`fill\`, \`copy\`, \`replaceAll\` — bulk helpers.

\`sort(null)\` means natural ordering. Since Java 8 the same operations exist as default methods on \`List\` (\`list.sort(...)\`), which is usually more readable.

\`unmodifiableList\` returns a view; the source list can still change. \`binarySearch\` on a list sorted descending returns garbage unless you pass a reversed comparator.`,
        },
        {
          id: 'sorting-algorithms',
          title: 'What sort is actually running',
          body: `\`Collections.sort\` and \`List.sort\` delegate to \`Arrays.sort\` on the backing array. For object arrays that is **TimSort**, a stable adaptive merge sort that detects existing runs and merges them. Stability matters: equal elements keep their relative order, which lets you sort by multiple keys in successive passes (least significant first).

For primitive arrays, \`Arrays.sort\` uses dual-pivot quicksort, which is faster but **not stable**, because there is no identity to preserve for primitives. \`Arrays.parallelSort\` uses a parallel merge sort and only pays off for large arrays.

The comparator contract becomes a hard requirement here. TimSort detects some violations and throws \`IllegalArgumentException: Comparison method violates its general contract!\`, but not all; a non-transitive comparator can silently produce a scrambled result or, in older JDKs, a runtime exception from deep inside the sort.

Sorting a \`LinkedList\` copies to an array, sorts, and writes back, so it is O(n log n) with extra allocation regardless of the list implementation.`,
        },
      ],
      javaCode: [
        {
          title: 'Natural order plus comparator chains',
          description:
            'A record with a total natural ordering, plus external strategies that never rely on subtraction.',
          code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

record Employee(String name, int salary, int age) implements Comparable<Employee> {

    @Override
    public int compareTo(Employee other) {
        int bySalary = Integer.compare(salary, other.salary);
        return bySalary != 0 ? bySalary : name.compareTo(other.name);
    }
}

public class OrderingDemo {

    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
                new Employee("ada", 120, 36),
                new Employee("grace", 120, 45),
                new Employee("edsger", 90, 52)));

        staff.sort(null);
        System.out.println(staff);

        staff.sort(Comparator.comparingInt(Employee::salary)
                .reversed()
                .thenComparing(Employee::name));
        System.out.println(staff);

        staff.sort(Comparator.comparing(Employee::name, Comparator.nullsLast(String::compareTo)));
        System.out.println(staff);
    }
}`,
        },
        {
          title: 'Binary search requires matching order',
          description:
            'The same list searched with a different comparator returns an undefined index, not an error.',
          code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SearchDemo {

    public static void main(String[] args) {
        List<Integer> values = new ArrayList<>(List.of(40, 10, 30, 20));
        Collections.sort(values);
        System.out.println(values); // [10, 20, 30, 40]

        System.out.println(Collections.binarySearch(values, 30)); // 2
        System.out.println(Collections.binarySearch(values, 25)); // -3, insertion point

        values.sort(Comparator.reverseOrder());
        System.out.println(values); // [40, 30, 20, 10]
        System.out.println(Collections.binarySearch(values, 30)); // undefined, often wrong

        int correct = Collections.binarySearch(values, 30, Comparator.reverseOrder());
        System.out.println("with comparator: " + correct); // 1
    }
}`,
        },
        {
          title: 'TreeSet uniqueness is comparator-driven',
          description:
            'A comparator on one field merges distinct objects, which is why every comparator needs a tie-breaker.',
          code: `import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

record Version(String name, int build) {}

public class TreeUniqueness {

    public static void main(String[] args) {
        Set<Version> byNameOnly = new TreeSet<>(Comparator.comparing(Version::name));
        byNameOnly.add(new Version("alpha", 1));
        byNameOnly.add(new Version("alpha", 2));
        System.out.println(byNameOnly.size()); // 1, second add rejected

        Set<Version> total = new TreeSet<>(Comparator
                .comparing(Version::name)
                .thenComparingInt(Version::build));
        total.add(new Version("alpha", 1));
        total.add(new Version("alpha", 2));
        System.out.println(total.size()); // 2
        System.out.println(total);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Comparable defines one natural order; Comparator supplies any number of external orders.',
        'compareTo must be antisymmetric and transitive, and should agree with equals for sorted collections.',
        'Comparator factories (comparing, thenComparing, reversed, nullsLast) replace hand-written comparison code.',
        'TreeSet and TreeMap use the comparator for uniqueness, so a partial comparator discards data.',
        'Collections.sort is stable TimSort for objects; binarySearch is only valid on a matching order.',
      ],
      interviewTips: [
        'State the three clauses of the compareTo contract and give a concrete violation for each.',
        'Explain why subtraction overflows and demonstrate Integer.compare as the fix.',
        'Show how to build a multi-key comparator with thenComparing.',
        'Mention that TimSort is stable while primitive quicksort is not, and why that matters for multi-pass sorting.',
      ],
      pitfalls: [
        'Implementing compareTo with subtraction, which overflows for large or negative values.',
        'Using a comparator that ignores a distinguishing field with TreeSet, silently losing elements.',
        'Calling binarySearch on a list sorted with a different comparator.',
        'Returning inconsistent results from a comparator, which can throw from inside TimSort.',
        'Assuming unmodifiableList prevents changes to the underlying list.',
      ],
      quiz: [
        {
          question: 'What does it mean when compareTo returns 0 but equals returns false?',
          options: [
            'It is a compile error',
            'It violates the recommended consistency rule and can merge distinct elements in TreeSet',
            'It is required for correct hashing',
            'It makes sorting unstable',
          ],
          answerIndex: 1,
          explanation:
            'Sorted collections use compareTo for uniqueness, so a zero result removes what equals considers a distinct element.',
        },
        {
          question: 'Which sorting algorithm does Collections.sort use for object lists?',
          options: ['Dual-pivot quicksort', 'TimSort', 'Heap sort', 'Insertion sort'],
          answerIndex: 1,
          explanation:
            'Objects are sorted with stable TimSort. Primitive arrays use dual-pivot quicksort, which is not stable.',
        },
      ],
    },
    {
      slug: 'lambdas-and-functional-interfaces',
      title: 'Lambdas & Functional Interfaces',
      order: 9,
      summary: 'Behaviour as a value: target typing, capture rules and the standard functional shapes.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'from-anonymous-classes',
          title: 'From anonymous classes to lambdas',
          body: `Before Java 8, passing behaviour meant an anonymous inner class:

\`\`\`java
Comparator<String> byLength = new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return Integer.compare(a.length(), b.length());
    }
};
\`\`\`

A lambda keeps the behaviour and discards the ceremony: \`(a, b) -> Integer.compare(a.length(), b.length())\`. What disappears is the class declaration, the method name and the parameter types, all of which the compiler can infer from the target type.

The implementation difference is more than cosmetic. An anonymous class compiles to a separate \`Outer$1.class\` file and creates a new instance at each evaluation. A lambda compiles to a private synthetic method plus an \`invokedynamic\` call site that links to a \`LambdaMetafactory\` bootstrap; the JVM may cache and reuse the resulting instance for non-capturing lambdas. This keeps the class count flat and lets the JIT inline the body like any other method.

That does **not** mean lambdas are always allocation-free. A lambda that captures values needs an object to hold them.`,
        },
        {
          id: 'target-typing',
          title: 'Target typing and the functional interface',
          body: `A lambda has no type of its own. Its type is the **target type** supplied by context: an assignment, a method argument, a return statement or a cast. That target must be a functional interface, meaning exactly one abstract method after inherited and default methods are considered.

The single abstract method fixes everything: arity, parameter types and return type. \`(a, b) -> a + b\` is valid for \`BiFunction<Integer, Integer, Integer>\`, \`IntBinaryOperator\` or \`Comparator<String>\` depending on where it appears, and the compiler checks the body against the chosen signature.

Two consequences follow. A lambda cannot be assigned to \`var\` without a cast, because \`var\` gives no target type. And overload resolution can become ambiguous when two overloads take different functional interfaces with the same shape, such as \`Runnable\` and a custom \`Task\` with \`void run()\`; the compiler reports an ambiguous method call and an explicit cast resolves it.

\`@FunctionalInterface\` is documentation plus a compiler check, not a requirement.`,
        },
        {
          id: 'capturing-variables',
          title: 'Capture and effectively final variables',
          body: `A lambda can read local variables from the enclosing scope, but only those that are final or **effectively final**, meaning never reassigned after initialisation. This is stricter than anonymous classes, which had the same rule, and it exists because the captured value is copied into the lambda object at creation time, not shared by reference.

\`this\` inside a lambda refers to the enclosing instance, unlike an anonymous class where \`this\` is the anonymous instance. That difference is a common source of confusion when converting between the two forms.

Mutating shared state from a lambda is legal only through a mutable container, for example an \`AtomicInteger\` or a single-element array, and it is usually a smell. In a parallel stream such mutation is a data race. Prefer returning a value, or use \`reduce\` and \`collect\`, which are designed for combining results.

Method parameters and \`for\` loop variables are also effectively final, so \`for (int i = 0; ...)\` cannot be captured unless you copy it into a local inside the body.`,
        },
        {
          id: 'built-in-interfaces',
          title: 'The standard functional interfaces',
          body: `\`java.util.function\` provides reusable shapes so you rarely need a custom interface:

| Interface | Method | Shape |
| --- | --- | --- |
| \`Function<T, R>\` | \`R apply(T t)\` | transform |
| \`BiFunction<T, U, R>\` | \`R apply(T t, U u)\` | transform two inputs |
| \`UnaryOperator<T>\` | \`T apply(T t)\` | transform, same type |
| \`BinaryOperator<T>\` | \`T apply(T a, T b)\` | combine two of the same type |
| \`Predicate<T>\` | \`boolean test(T t)\` | filter |
| \`Consumer<T>\` | \`void accept(T t)\` | side effect |
| \`Supplier<T>\` | \`T get()\` | lazy factory |
| \`Runnable\` / \`Callable<V>\` | \`void run()\` / \`V call()\` | task |

Primitive specialisations (\`IntFunction\`, \`ToIntFunction\`, \`IntPredicate\`, \`IntBinaryOperator\`, \`IntSupplier\`) avoid boxing in numeric code and are what the primitive streams expect. There are also \`BiPredicate\`, \`BiConsumer\` and the \`ObjIntConsumer\` family.

Choose by intent: if a method transforms, take a \`Function\`; if it validates, take a \`Predicate\`. Reusing the standard names makes APIs immediately understandable, and it avoids inventing an interface per method.`,
        },
        {
          id: 'composition',
          title: 'Composing behaviour',
          body: `Functional interfaces carry default methods that compose them without new syntax. \`Predicate\` offers \`and\`, \`or\` and \`negate\`, evaluated left to right with short-circuiting, plus \`Predicate.not(...)\` for method-reference negation. \`Function\` offers \`andThen\` and \`compose\`, and \`UnaryOperator\` inherits both.

A composed predicate is still just a lambda, so it can be passed anywhere a \`Predicate\` is expected and stored in a constant for reuse. This is the building block of rule engines built from small named predicates.

\`Function.identity()\` is a useful no-op extractor, especially for \`Collectors.toMap\` and \`groupingBy\`. \`Comparator.comparing\` is itself a function-to-comparator adapter, which shows how the shapes interlock.

Keep compositions shallow. A chain of six predicates is harder to debug than a named method with an \`if\`, and stack traces through composed lambdas are unhelpful. If a composed expression needs a comment to explain, extract it into a well-named method reference instead.`,
        },
      ],
      javaCode: [
        {
          title: 'A custom functional interface',
          description:
            'The annotation enforces the single-abstract-method rule, and the lambda supplies the behaviour at the call site.',
          code: `@FunctionalInterface
interface Validator<T> {
    String validate(T value);

    default Validator<T> andThen(Validator<T> next) {
        return value -> {
            String first = this.validate(value);
            return first != null ? first : next.validate(value);
        };
    }
}

public class ValidatorDemo {

    public static void main(String[] args) {
        Validator<String> notBlank = value ->
                value == null || value.isBlank() ? "must not be blank" : null;

        Validator<String> shortEnough = value ->
                value.length() > 10 ? "must be at most 10 characters" : null;

        Validator<String> combined = notBlank.andThen(shortEnough);

        System.out.println(combined.validate("ok"));
        System.out.println(combined.validate("   "));
        System.out.println(combined.validate("this string is long"));
    }
}`,
        },
        {
          title: 'Effectively final capture',
          description:
            'Captured locals are copied at creation, so reassignment is forbidden and mutation needs a mutable holder.',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class CaptureDemo {

    public static void main(String[] args) {
        int threshold = 10;                 // effectively final
        List<Integer> values = new ArrayList<>(List.of(4, 15, 8, 21));

        values.removeIf(v -> v < threshold);

        AtomicInteger calls = new AtomicInteger();
        values.forEach(v -> {
            calls.incrementAndGet();
            System.out.println(v);
        });
        System.out.println("visited " + calls.get());

        // int counter = 0;
        // values.forEach(v -> counter++); // does not compile: counter is not effectively final
    }
}`,
        },
        {
          title: 'Predicate and function composition',
          description:
            'Small named predicates and functions compose into readable, testable rules.',
          code: `import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

record Order(String customer, int total, boolean express) {}

public class CompositionDemo {

    public static void main(String[] args) {
        Predicate<Order> big = order -> order.total() >= 100;
        Predicate<Order> express = Order::express;
        Predicate<Order> needsReview = big.and(express).negate();

        List<Order> orders = List.of(
                new Order("ada", 250, true),
                new Order("grace", 40, false),
                new Order("edsger", 300, false));

        orders.stream().filter(needsReview).forEach(System.out::println);

        Function<String, String> trim = String::trim;
        Function<String, String> upper = String::toUpperCase;
        Function<String, Integer> length = String::length;

        System.out.println(trim.andThen(upper).andThen(length).apply("  java  "));
        System.out.println(trim.compose(upper).apply("  java  "));
    }
}`,
        },
      ],
      keyTakeaways: [
        'A lambda is a value whose type comes from its target functional interface, and it compiles to invokedynamic plus a synthetic method.',
        'Functional interfaces have exactly one abstract method; @FunctionalInterface makes that a compile-time check.',
        'Lambdas capture effectively final locals by value, and this inside a lambda means the enclosing instance.',
        'java.util.function provides Function, Predicate, Consumer, Supplier and their primitive variants.',
        'and, or, negate, andThen and compose build behaviour from small reusable pieces.',
      ],
      interviewTips: [
        'Explain target typing with a single lambda that could be a Comparator or a BiFunction.',
        'Describe the invokedynamic and LambdaMetafactory mechanism to show depth beyond syntax.',
        'State the effectively final rule and why capture-by-value makes it necessary.',
        'Give a concrete case where two overloads taking different functional interfaces become ambiguous.',
      ],
      pitfalls: [
        'Trying to mutate a captured local variable instead of using a mutable holder or a reduction.',
        'Assuming a lambda with no captures is guaranteed to allocate nothing; the spec permits caching, it does not promise it.',
        'Forgetting that this in a lambda refers to the enclosing class.',
        'Creating a functional interface with two abstract methods and expecting a lambda to fit.',
        'Overusing composed predicates until stack traces and debugging become opaque.',
      ],
      quiz: [
        {
          question: 'Why must a captured local variable be effectively final?',
          options: [
            'To allow the lambda to run on another thread',
            'Because the value is copied into the lambda object when it is created',
            'Because lambdas are compiled to inner classes',
            'To prevent recursion',
          ],
          answerIndex: 1,
          explanation:
            'Capture copies the current value into the lambda instance, so later reassignment in the enclosing method would be invisible and misleading.',
        },
        {
          question: 'Which interface matches void accept(T t)?',
          options: ['Function', 'Predicate', 'Consumer', 'Supplier'],
          answerIndex: 2,
          explanation:
            'Consumer<T> consumes a value and returns nothing. Supplier is the reverse: no input, one output.',
        },
      ],
    },
    {
      slug: 'method-references-and-composition',
      title: 'Method References & Function Composition',
      order: 10,
      summary: 'The four :: forms, what the compiler infers, and how andThen differs from compose.',
      level: 'advanced',
      subtopics: [
        {
          id: 'four-forms',
          title: 'The four forms of method reference',
          body: `A method reference is shorthand for a lambda that only calls an existing method. There are four syntactic shapes, and telling them apart is the whole skill:

| Form | Example | Equivalent lambda |
| --- | --- | --- |
| Static | \`Integer::parseInt\` | \`s -> Integer.parseInt(s)\` |
| Bound instance | \`System.out::println\` | \`x -> System.out.println(x)\` |
| Unbound instance | \`String::length\` | \`s -> s.length()\` |
| Constructor | \`ArrayList::new\` | \`() -> new ArrayList<>()\` |

The distinction between bound and unbound is the one candidates mix up. In \`System.out::println\`, the receiver is fixed at the point the reference is created, so the reference takes one argument: the value to print. In \`String::length\`, the receiver **is** the first argument, so the reference maps a \`String\` to an \`int\`.

An unbound reference with n arguments invokes a method with n-1 explicit parameters plus the receiver. A constructor reference with n arguments matches a constructor with n parameters, and \`String[]::new\` matches an array constructor of one int argument.`,
        },
        {
          id: 'inference-gotchas',
          title: 'Inference and overloading gotchas',
          body: `The compiler checks a method reference against the target type's single abstract method: arity, parameter types and return type. Because the reference has no argument list, overload selection often has to happen from the target alone, which is where ambiguity appears.

Three recurring problems:

- **Overloaded names.** \`Math::max\` is ambiguous until the target fixes whether it is \`(int, int)\` or \`(double, double)\`. Assigning to \`IntBinaryOperator\` resolves it; passing it to an overloaded method may not.
- **Varargs versus arrays.** \`String::format\` matches \`Function<String, String>\` even though \`format\` is varargs, which surprises people expecting an exact arity match.
- **Generic constructors and wildcards.** \`ArrayList::new\` in a \`Supplier<List<String>>\` context infers the type argument from the target, but a raw type in the chain can force an unchecked warning.

A cast is the standard escape hatch: \`(Function<String, Integer>) Integer::parseInt\`. Prefer restructuring over casting; an explicit lambda is often clearer than a cast-laden reference.

Constructors that throw checked exceptions cannot be used directly, since the functional interfaces in the JDK do not declare them.`,
        },
        {
          id: 'andthen-versus-compose',
          title: 'andThen versus compose',
          body: `\`Function<T, R>\` has two composition methods with outward-identical results and opposite reading order:

- \`f.andThen(g)\` produces \`x -> g.apply(f.apply(x))\`, so \`f\` runs first.
- \`f.compose(g)\` produces \`x -> f.apply(g.apply(x))\`, so \`g\` runs first.

The names describe the call chain, not the position in the source line. \`a.andThen(b).andThen(c)\` reads top-to-bottom in execution order and is usually easier to follow; \`compose\` is convenient when you have a pipeline and want to prepend a step.

Types restrict composition: \`andThen\` requires the input of the next function to be assignable from the output of the first, which is why long chains sometimes need an intermediate \`Function<Object, Object>\` or a widening cast. \`andThen\` on a \`Function<String, Integer>\` accepts \`Function<? super Integer, ? extends V>\`, using PECS to stay flexible.

\`Consumer\` has \`andThen\` only, because a consumer has no result to feed forward. \`Predicate\` has \`and\`, \`or\`, \`negate\` rather than function composition.`,
        },
        {
          id: 'currying-and-partial-application',
          title: 'Currying and partial application',
          body: `Java has no first-class currying syntax, but \`BiFunction\` plus a lambda produces it in one line:

\`\`\`java
static <T, U, R> Function<U, R> partial(BiFunction<T, U, R> fn, T fixed) {
    return u -> fn.apply(fixed, u);
}
\`\`\`

Calling \`partialRight(String::repeat, 3)\` yields a \`Function<String, String>\` that repeats each incoming word three times. The \`fixed\` value is captured, so it must be effectively final.

This pattern is useful for configuration: bind a repository, a formatter or a locale once, then pass the resulting single-argument function into a stream. It also lets you adapt a two-argument method to the \`Function\` shape that \`map\` expects.

The cost is indirection: every partial application creates a capturing lambda object. In a hot loop over millions of elements, prefer a direct method call or a stored constant. Currying aids readability and reuse; it is not a performance technique, and Java's type system makes deeply curried code verbose compared with functional-first languages.`,
        },
        {
          id: 'semantics-and-receivers',
          title: 'Semantics: receivers, identity and evaluation',
          body: `A bound method reference evaluates its receiver **immediately**, at the point the reference is created. \`obj::method\` captures the current value of \`obj\`, and a later reassignment of the variable does not change the reference. Passing \`this::handle\` inside a constructor therefore captures \`this\` before the object is fully initialised, which can leak a partially built instance.

Method references and equivalent lambdas compile to the same invokedynamic shape, so there is no meaningful performance difference. Choose by readability: a reference is shorter when a method already exists with exactly the right signature, and a lambda is clearer when you need to adapt arguments, reorder them or add a constant.

Non-capturing references may be cached by the JVM, but identity is not guaranteed. Never compare lambda instances with \`==\`, and never rely on a lambda's \`getClass()\` name.

\`Function.identity()\` is the canonical no-op, useful where an API demands a function but no transformation is needed. Avoid it in \`map\` calls that only exist to satisfy a type.`,
        },
      ],
      javaCode: [
        {
          title: 'All four reference forms',
          description:
            'Static, bound, unbound and constructor references side by side, each with the lambda it replaces.',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.IntBinaryOperator;
import java.util.function.Supplier;

public class ReferenceForms {

    public static void main(String[] args) {
        Function<String, Integer> parse = Integer::parseInt;            // static
        java.util.function.Consumer<String> print = System.out::println; // bound
        Function<String, Integer> length = String::length;                // unbound
        Supplier<List<String>> factory = ArrayList::new;                  // constructor

        System.out.println(parse.apply("42") + length.apply("java"));
        print.accept("printed through a bound reference");
        System.out.println(factory.get().isEmpty());

        IntBinaryOperator max = Math::max;
        System.out.println(max.applyAsInt(3, 9));

        BiFunction<String, Integer, String> repeat = String::repeat;
        System.out.println(repeat.apply("ab", 3));

        Function<Integer, String[]> arrayFactory = String[]::new;
        System.out.println(arrayFactory.apply(4).length);
    }
}`,
        },
        {
          title: 'andThen versus compose',
          description:
            'Both build a pipeline; only the execution order differs. Reading order is the reason to prefer one.',
          code: `import java.util.function.Function;

public class CompositionOrder {

    public static void main(String[] args) {
        Function<String, String> trim = String::trim;
        Function<String, String> upper = String::toUpperCase;
        Function<String, Integer> length = String::length;

        Function<String, Integer> forward = trim.andThen(upper).andThen(length);
        Function<String, Integer> backward = length.compose(upper).compose(trim);

        System.out.println(forward.apply("  java  "));  // 4
        System.out.println(backward.apply("  java  ")); // 4

        Function<String, String> shout = upper.compose(trim);
        System.out.println(shout.apply("  hello  ")); // HELLO

        Function<String, String> same = trim.andThen(Function.identity());
        System.out.println(same.apply("  identity  ")); // identity
    }
}`,
        },
        {
          title: 'Partial application with BiFunction',
          description:
            'Binding one argument of a two-argument function produces a reusable single-argument function.',
          code: `import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;

public class CurryingDemo {

    static <T, U, R> Function<U, R> partial(BiFunction<T, U, R> fn, T fixed) {
        return u -> fn.apply(fixed, u);
    }

    public static void main(String[] args) {
        Function<Integer, String> repeatThree = partial(String::repeat, 3);
        System.out.println(repeatThree.apply("ab")); // ababab

        List<Integer> widths = List.of(1, 2, 3);
        widths.stream().map(repeatThree).forEach(System.out::println);

        BiFunction<Integer, Integer, Integer> add = Integer::sum;
        Function<Integer, Integer> addTen = partial(add, 10);
        System.out.println(addTen.apply(5)); // 15
    }
}`,
        },
      ],
      keyTakeaways: [
        'The four reference forms differ by whether the receiver is fixed, an argument, or absent.',
        'Unbound references consume the first parameter as the receiver, which changes the effective arity.',
        'Overloaded method names often need a target type or cast to resolve.',
        'andThen runs the receiver first; compose runs its argument first.',
        'Bound references capture the receiver at creation, so later reassignment has no effect.',
      ],
      interviewTips: [
        'Convert a given lambda into a method reference and name the form you used.',
        'Explain why String::length is a Function<String, Integer> while System.out::println is a Consumer<String>.',
        'State the andThen/compose difference with an explicit x -> g(f(x)) expansion.',
        'Mention that method references and lambdas share the same invokedynamic mechanism.',
      ],
      pitfalls: [
        'Assuming obj::method observes later reassignment of obj.',
        'Using this::method in a constructor and leaking a partially initialised object.',
        'Expecting a method reference to work when the target method throws a checked exception.',
        'Mixing up andThen and compose when building a pipeline.',
        'Comparing lambda instances with == or depending on their generated class names.',
      ],
      quiz: [
        {
          question: 'Which method reference form is String::toUpperCase?',
          options: ['Static', 'Bound instance', 'Unbound instance', 'Constructor'],
          answerIndex: 2,
          explanation:
            'The receiver is the first argument, so the reference maps a String to a String. A bound reference would be someString::toUpperCase.',
        },
        {
          question: 'What is f.compose(g) equivalent to?',
          options: ['x -> f(g(x))', 'x -> g(f(x))', 'x -> f(x).g(x)', 'x -> g(x).f(x)'],
          answerIndex: 0,
          explanation:
            'compose applies its argument first, so g runs before f. andThen is the opposite order.',
        },
      ],
    },
    {
      slug: 'streams-creation-and-architecture',
      title: 'Streams: Creation & Architecture',
      order: 11,
      summary: 'What a stream really is, how pipelines stay lazy, and every practical way to create one.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'stream-versus-collection',
          title: 'A stream is not a collection',
          body: `A collection stores elements; a stream describes a computation over elements. That single difference explains every other property.

Streams hold no data. They wrap a **source** (a collection, an array, a file, a generator) and a chain of operations. They are **lazy**: intermediate operations only record what should happen, and nothing runs until a terminal operation requests a result. They are **single-use**: after a terminal operation the stream is consumed, and reusing it throws \`IllegalStateException: stream has already been operated upon or closed\`.

They are also **pull-based**, at least conceptually. The terminal operation pulls elements through the chain one at a time, so \`filter\` and \`map\` fuse into a single pass rather than materialising intermediate collections. A pipeline over a million elements with five stateless operations still allocates no per-stage list.

Collections are about storage and reuse; streams are about one-shot transformation. When you need the result twice, collect it.`,
        },
        {
          id: 'pipeline-anatomy',
          title: 'Pipeline anatomy',
          body: `Every pipeline has three parts:

1. **Source** — \`list.stream()\`, \`Arrays.stream(array)\`, \`Stream.of(...)\`, \`Files.lines(path)\`, \`IntStream.range(...)\`. The source supplies a \`Spliterator\` and a set of characteristics such as \`ORDERED\`, \`SIZED\` and \`DISTINCT\`.
2. **Intermediate operations** — \`filter\`, \`map\`, \`flatMap\`, \`sorted\`, \`distinct\`, \`limit\`, \`skip\`, \`peek\`. Each returns a new \`Stream\` and records a stage.
3. **Terminal operation** — \`collect\`, \`reduce\`, \`forEach\`, \`count\`, \`findFirst\`, \`anyMatch\`, \`toList\`. It triggers traversal and produces a value or side effect.

Internally, a stream is a linked chain of \`AbstractPipeline\` nodes. Evaluation builds a chain of \`Sink\` objects, one per stage, and the source pushes each element through them. Since Java 9, the implementation may also fuse stages or short-circuit with a \`Spliterator\` wrapper instead of a sink chain, but the observable contract is unchanged: one pass, left to right, per element.

A pipeline with no terminal operation is dead code.`,
        },
        {
          id: 'creating-streams',
          title: 'Creating streams',
          body: `The creation options cover almost every data source:

| Source | Call |
| --- | --- |
| Collection | \`collection.stream()\` |
| Array | \`Arrays.stream(array)\`, or \`Stream.of(array)\` |
| Explicit values | \`Stream.of("a", "b")\` |
| Empty | \`Stream.empty()\` |
| Builder | \`Stream.builder().add(x).build()\` |
| Infinite iteration | \`Stream.iterate(seed, next)\` |
| Infinite generation | \`Stream.generate(supplier)\` |
| Numeric range | \`IntStream.range(0, n)\`, \`rangeClosed\` |
| File lines | \`Files.lines(path)\` |
| Random | \`new Random().ints(10)\` |
| Regex | \`Pattern.compile(",").splitAsStream(line)\` |
| Optional | \`optional.stream()\` |

Two cautions. \`Stream.of(array)\` with a primitive array produces a stream of one element (the array), not a stream of its values; use \`Arrays.stream\` for primitives. And infinite streams must be bounded with \`limit\`, or the terminal operation never returns.

\`Files.lines\` holds an open file handle and must be closed, so use try-with-resources.`,
        },
        {
          id: 'laziness-in-practice',
          title: 'Laziness in practice',
          body: `Laziness is observable, and demonstrating it is the fastest way to prove you understand pipelines. Put a print or counter inside \`filter\` and \`map\`, build the pipeline, and note that nothing appears until the terminal operation runs. Then note the *interleaving*: each element travels the whole chain before the next one starts, not stage by stage over the entire input.

That interleaving is why short-circuiting works. In \`stream.filter(...).findFirst()\`, elements are pulled only until the first match, so an infinite source can still terminate. \`anyMatch\`, \`allMatch\`, \`noneMatch\`, \`findFirst\`, \`findAny\` and \`limit\` are all short-circuiting.

Stateful operations break the pattern. \`sorted\` must buffer everything before emitting, and \`distinct\` must remember seen elements. Placing \`sorted\` before \`filter\` sorts the whole input; placing it after sorts only the survivors. That reordering is often the single largest optimisation available in a pipeline.

\`peek\` exists for debugging exactly this flow; it is not a business-logic hook.`,
        },
        {
          id: 'stream-flags-and-fusion',
          title: 'Flags, fusion and why order matters',
          body: `A stream carries a bitmask of characteristics inherited from its source and adjusted by each stage. \`SIZED\` lets \`count()\` return without traversal. \`ORDERED\` guarantees encounter order and enables \`findFirst\` semantics. \`DISTINCT\` and \`SORTED\` let the implementation skip redundant \`distinct()\` or \`sorted()\` calls, because it can prove the data already satisfies them.

Operations also clear flags. \`map\` clears \`SORTED\` and \`DISTINCT\`, since a transformed value may not preserve either. \`filter\` clears \`SIZED\`. These flag updates explain why \`stream().map(f).sorted()\` must actually sort, while \`stream().sorted().map(f)\` also sorts — but a second \`sorted()\` after that is a no-op.

Stateless stages fuse into a single pass. Stateful stages introduce a barrier and a buffer, which is why a pipeline with \`sorted\` is O(n log n) in time and O(n) in memory even if the source is lazy.

Practical rule: filter as early as possible, map as late as needed, and avoid \`sorted\` on large data unless ordering is genuinely required downstream.`,
        },
      ],
      javaCode: [
        {
          title: 'Creation catalogue',
          description:
            'Collection, array, explicit values, range, iterate, generate and regex sources in one place.',
          code: `import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class StreamSources {

    public static void main(String[] args) {
        List<String> names = List.of("ada", "grace", "edsger");
        System.out.println(names.stream().count());

        int[] numbers = {3, 1, 4, 1, 5};
        System.out.println(Arrays.stream(numbers).sum());

        System.out.println(Stream.of("a", "b", "c").toList());
        System.out.println(IntStream.rangeClosed(1, 5).boxed().toList());

        System.out.println(Stream.iterate(1, n -> n * 2).limit(6).toList());
        System.out.println(Stream.generate(() -> "tick").limit(3).toList());

        Pattern comma = Pattern.compile(",");
        System.out.println(comma.splitAsStream("java,stream,api").toList());
    }
}`,
        },
        {
          title: 'Proving laziness',
          description:
            'Counters inside the stages stay at zero until the terminal operation, and then interleave per element.',
          code: `import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class LazinessDemo {

    public static void main(String[] args) {
        List<String> words = List.of("java", "stream", "lazy", "pipeline");
        AtomicInteger filtered = new AtomicInteger();
        AtomicInteger mapped = new AtomicInteger();

        var pipeline = words.stream()
                .filter(w -> {
                    filtered.incrementAndGet();
                    return w.length() > 4;
                })
                .map(w -> {
                    mapped.incrementAndGet();
                    return w.toUpperCase();
                });

        System.out.println("before terminal: " + filtered.get() + "/" + mapped.get());

        String first = pipeline.findFirst().orElseThrow();
        System.out.println(first);
        System.out.println("after terminal: " + filtered.get() + "/" + mapped.get());
    }
}`,
        },
        {
          title: 'An infinite stream with short-circuiting',
          description:
            'limit bounds the source, so the pipeline terminates even though the stream is infinite.',
          code: `import java.util.stream.Stream;

public class InfiniteStreams {

    record Pair(int index, long value) {}

    public static void main(String[] args) {
        Stream.iterate(new Pair(0, 1L), p -> new Pair(p.index() + 1, p.value() * 2))
                .limit(10)
                .forEach(System.out::println);

        long sum = Stream.iterate(1L, n -> n + 1)
                .mapToLong(Long::longValue)
                .limit(100)
                .sum();
        System.out.println("sum 1..100 = " + sum);

        boolean found = Stream.iterate(2, n -> n + 2)
                .anyMatch(n -> n > 10);
        System.out.println("found: " + found);
    }
}`,
        },
      ],
      keyTakeaways: [
        'A stream is a lazy, single-use description of a computation, not a container.',
        'Pipelines have a source, zero or more intermediate stages, and one terminal operation that triggers execution.',
        'Elements flow one at a time through fused stateless stages, which is what makes short-circuiting efficient.',
        'Stateful stages such as sorted and distinct buffer data and act as barriers.',
        'Stream flags such as SIZED, ORDERED and SORTED let the implementation skip redundant work.',
      ],
      interviewTips: [
        'Define a stream by contrast with a collection: no storage, lazy, single-use.',
        'Demonstrate laziness with peek and a counter, and explain the per-element interleaving.',
        'Explain why filter before sorted is cheaper than sorted before filter.',
        'Mention that a stream cannot be reused and name the exact exception it throws.',
      ],
      pitfalls: [
        'Storing a stream in a field or reusing it after a terminal operation.',
        'Building a pipeline and never calling a terminal operation, so nothing happens.',
        'Using Stream.of on a primitive array and getting a single-element stream.',
        'Forgetting to close streams backed by files.',
        'Creating an unbounded stream without limit, so the terminal operation never returns.',
      ],
      quiz: [
        {
          question: 'When does an intermediate stream operation execute?',
          options: [
            'Immediately when called',
            'When the stream is garbage collected',
            'When a terminal operation is invoked',
            'When the next intermediate operation is chained',
          ],
          answerIndex: 2,
          explanation:
            'Intermediate operations only record stages; the terminal operation drives traversal of the whole pipeline.',
        },
        {
          question: 'Which operation forces the entire input to be buffered before producing output?',
          options: ['filter', 'map', 'sorted', 'peek'],
          answerIndex: 2,
          explanation:
            'sorted must see every element before it can emit the smallest, making it a stateful barrier. filter, map and peek are stateless.',
        },
      ],
    },
    {
      slug: 'stream-operations',
      title: 'Intermediate & Terminal Stream Operations',
      order: 12,
      summary: 'The full operation catalogue, short-circuiting, and collectors that group, join and reduce.',
      level: 'advanced',
      subtopics: [
        {
          id: 'stateless-intermediate',
          title: 'Stateless intermediate operations',
          body: `Stateless stages process each element independently and fuse into a single pass:

- \`filter(Predicate)\` drops elements that fail the test.
- \`map(Function)\` transforms one element into one element.
- \`mapToInt\`, \`mapToLong\`, \`mapToDouble\` switch to a primitive stream, removing boxing for the rest of the pipeline.
- \`flatMap(Function<T, Stream<R>>)\` transforms one element into many, then concatenates. It is the operation for nested collections, optional values and split strings.
- \`peek(Consumer)\` observes elements as they pass; intended for debugging, not side effects.
- \`boxed()\` converts a primitive stream back to a stream of wrappers.

\`flatMap\` is the one people underuse. Flattening a \`List<List<String>>\` is \`lists.stream().flatMap(List::stream)\`, and flattening \`Optional\` values is \`optionals.stream().flatMap(Optional::stream)\`.

\`peek\` is frequently misused to mutate elements. That is undefined under parallelism and wrong even sequentially, because a stream should describe transformation, not side effects. Use \`map\` instead.`,
        },
        {
          id: 'stateful-intermediate',
          title: 'Stateful intermediate operations',
          body: `Stateful stages retain information across elements and therefore introduce a barrier:

- \`distinct()\` keeps a \`HashSet\` of seen elements, so it needs O(n) memory. It relies on \`equals\` and \`hashCode\`.
- \`sorted()\` and \`sorted(Comparator)\` buffer everything and sort; O(n log n) time and O(n) memory, and stable for ordered streams.
- \`limit(n)\` stops after n elements, but on an unordered parallel stream it may still process more than n internally before trimming.
- \`skip(n)\` discards the first n.
- \`takeWhile\` and \`dropWhile\` (Java 9) act on the ordered prefix and stop early, unlike \`filter\`.

\`distinct\` on an ordered stream keeps the first occurrence in encounter order; on an unordered stream, which occurrence survives is unspecified.

Combining stateful stages is where pipelines get expensive. \`sorted().distinct()\` sorts everything then deduplicates; \`distinct().sorted()\` deduplicates first and sorts a smaller set. Both are O(n log n) worst case, but the constant factors differ substantially on data with many duplicates.

\`limit\` after \`sorted\` still sorts the whole input; there is no top-k optimisation.`,
        },
        {
          id: 'terminal-reductions',
          title: 'Terminal operations and reductions',
          body: `Terminal operations fall into three groups.

**Aggregation:** \`count()\`, \`sum()\`, \`average()\`, \`min()\`, \`max()\`, \`summaryStatistics()\`. On primitive streams these return primitives or primitive optionals and avoid boxing.

**Searching:** \`findFirst()\`, \`findAny()\`, \`anyMatch()\`, \`allMatch()\`, \`noneMatch()\`. All short-circuit. \`findAny\` is deliberately non-deterministic so parallel implementations need not preserve order.

**Reduction and side effects:** \`reduce\`, \`collect\`, \`forEach\`, \`forEachOrdered\`, \`toArray\`.

\`reduce\` has three forms:

| Form | Behaviour |
| --- | --- |
| \`reduce(BinaryOperator)\` | Returns \`Optional<T>\` because empty input has no identity |
| \`reduce(identity, accumulator)\` | Returns \`T\`; identity must be a true neutral element |
| \`reduce(identity, accumulator, combiner)\` | Parallel form; combiner merges partial results |

The identity must satisfy \`identity op x == x\` for every x, and the accumulator must be associative, or parallel reduction produces wrong results. This is the single most important correctness rule in the stream API.`,
        },
        {
          id: 'collectors-core',
          title: 'Collectors: the core set',
          body: `\`collect(Collector)\` is the general-purpose terminal operation. \`Collectors\` supplies the implementations:

| Collector | Result |
| --- | --- |
| \`toList()\` | Unmodifiable list (Java 16+) |
| \`toUnmodifiableList()\` | Explicitly unmodifiable |
| \`toSet()\` | Unspecified set implementation |
| \`toCollection(TreeSet::new)\` | Caller-chosen container |
| \`joining()\`, \`joining(delimiter)\`, \`joining(d, prefix, suffix)\` | String concatenation |
| \`counting()\` | \`Long\` |
| \`summingInt\`, \`averagingInt\` | Numeric aggregates |
| \`mapping(fn, downstream)\` | Transform before collecting |
| \`filtering(pred, downstream)\` | Filter inside a grouping |
| \`toMap(keyFn, valueFn)\` | Map, throwing on duplicate keys |
| \`toMap(keyFn, valueFn, mergeFn)\` | Map with conflict resolution |

\`toMap\` without a merge function throws \`IllegalStateException\` on duplicate keys, which is a common production failure when the key extractor is not unique. Always supply a merge function or use \`groupingBy\`.

\`Collectors.toList()\` historically returned a mutable \`ArrayList\`; the contract never guaranteed it, and the modern \`Stream.toList()\` is explicitly unmodifiable.`,
        },
        {
          id: 'grouping-and-partitioning',
          title: 'Grouping and partitioning',
          body: `\`groupingBy\` builds a \`Map<K, List<T>>\` by default, and accepts a downstream collector to shape the values:

- \`groupingBy(classifier, counting())\` gives counts per key.
- \`groupingBy(classifier, mapping(fn, toList()))\` projects before collecting.
- \`groupingBy(classifier, TreeMap::new, toList())\` fixes the map implementation and ordering.
- \`groupingBy(classifier, summingInt(fn))\` gives numeric totals.

The classifier must not return null; the implementation calls \`Objects.requireNonNull\` on the key, unlike \`HashMap\` which permits one null key. Guard with a default group or filter first.

Nested grouping is a second \`groupingBy\` downstream: \`groupingBy(Order::customer, groupingBy(Order::status, counting()))\` produces a map of maps of counts.

\`partitioningBy(Predicate)\` always returns a map with exactly two keys, \`Boolean.TRUE\` and \`Boolean.FALSE\`, even when one side is empty. That predictability makes it preferable to \`groupingBy\` for binary splits, and it enables downstream collectors just like grouping.

Both preserve encounter order within each group for ordered streams.`,
        },
      ],
      javaCode: [
        {
          title: 'FlatMap and collector pipelines',
          description:
            'Nested collections flattened, then grouped, counted and joined in one readable pipeline.',
          code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

record Item(String name, String category, int price) {}

public class Catalog {

    public static void main(String[] args) {
        List<List<Item>> shipments = List.of(
                List.of(new Item("keyboard", "input", 80), new Item("mouse", "input", 40)),
                List.of(new Item("monitor", "display", 300)),
                List.of(new Item("dock", "accessory", 150)));

        List<Item> all = shipments.stream()
                .flatMap(List::stream)
                .toList();

        Map<String, List<String>> byCategory = all.stream()
                .collect(Collectors.groupingBy(Item::category,
                        Collectors.mapping(Item::name, Collectors.toList())));
        System.out.println(byCategory);

        Map<String, Integer> totals = all.stream()
                .collect(Collectors.groupingBy(Item::category, Collectors.summingInt(Item::price)));
        System.out.println(totals);

        String names = all.stream().map(Item::name).collect(Collectors.joining(", "));
        System.out.println(names);
    }
}`,
        },
        {
          title: 'toMap, merge functions and nulls',
          description:
            'A merge function resolves duplicate keys; without one the collector throws.',
          code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

record Reading(String sensor, int value) {}

public class ToMapDemo {

    public static void main(String[] args) {
        List<Reading> readings = List.of(
                new Reading("north", 12),
                new Reading("south", 9),
                new Reading("north", 15));

        try {
            readings.stream().collect(Collectors.toMap(Reading::sensor, Reading::value));
        } catch (IllegalStateException ex) {
            System.out.println("duplicate key: " + ex.getMessage());
        }

        Map<String, Integer> latest = readings.stream()
                .collect(Collectors.toMap(Reading::sensor, Reading::value, (a, b) -> b));
        System.out.println(latest);

        Map<String, Integer> max = readings.stream()
                .collect(Collectors.toMap(Reading::sensor, Reading::value, Math::max));
        System.out.println(max);
    }
}`,
        },
        {
          title: 'Partitioning and statistics',
          description:
            'partitioningBy always yields both keys, and summaryStatistics collapses four aggregations into one pass.',
          code: `import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

record Score(String student, int points) {}

public class PartitionDemo {

    public static void main(String[] args) {
        List<Score> scores = List.of(
                new Score("ada", 92), new Score("grace", 58),
                new Score("edsger", 74), new Score("barbara", 47));

        Map<Boolean, List<Score>> passed = scores.stream()
                .collect(Collectors.partitioningBy(s -> s.points() >= 60));
        System.out.println(passed.get(true));
        System.out.println(passed.get(false));

        Map<Boolean, Long> counts = scores.stream()
                .collect(Collectors.partitioningBy(s -> s.points() >= 60, Collectors.counting()));
        System.out.println(counts);

        IntSummaryStatistics stats = scores.stream()
                .mapToInt(Score::points)
                .summaryStatistics();
        System.out.println(stats);
        System.out.printf("avg %.2f%n", stats.getAverage());
    }
}`,
        },
      ],
      keyTakeaways: [
        'Stateless stages fuse into one pass; stateful stages such as sorted and distinct buffer elements.',
        'flatMap maps one element to many and concatenates, and is the standard way to flatten nested structures.',
        'reduce needs an associative accumulator and a true identity, or parallel results will be wrong.',
        'Collectors.toMap throws on duplicate keys unless a merge function is supplied.',
        'partitioningBy always returns both TRUE and FALSE keys; groupingBy omits empty groups.',
      ],
      interviewTips: [
        'Distinguish stateless from stateful operations and explain the barrier each stateful stage introduces.',
        'Show three reduce overloads and explain when Optional is returned.',
        'Compare Collectors.toList(), Stream.toList() and toUnmodifiableList() precisely.',
        'Demonstrate groupingBy with a downstream collector, since it is the most common real-world use.',
      ],
      pitfalls: [
        'Forgetting the merge function in toMap and hitting IllegalStateException on duplicates.',
        'Using peek to mutate elements or perform business logic.',
        'Assuming limit after sorted avoids sorting the whole input.',
        'Using a non-associative accumulator with parallel reduce.',
        'Returning null from a groupingBy classifier.',
      ],
      quiz: [
        {
          question: 'What happens when Collectors.toMap receives two equal keys and no merge function?',
          options: [
            'The later value overwrites the earlier one',
            'It throws IllegalStateException',
            'It keeps both in a list',
            'It throws ClassCastException',
          ],
          answerIndex: 1,
          explanation:
            'The two-argument toMap has no conflict policy, so the merge step throws. Supply a merge function or use groupingBy.',
        },
        {
          question: 'Which of these does NOT short-circuit?',
          options: ['findFirst', 'anyMatch', 'sorted', 'limit'],
          answerIndex: 2,
          explanation:
            'sorted must consume the entire input before emitting anything, so it can never short-circuit.',
        },
      ],
    },
    {
      slug: 'optional',
      title: 'Optional from Scratch',
      order: 13,
      summary: 'A container for maybe-absent values: how to build one, chain it, and where not to use it.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'why-optional',
          title: 'The problem Optional solves',
          body: `A null return is ambiguous. It can mean "not found", "not applicable", "an error occurred" or simply "someone forgot to assign a value". The type system says nothing, so callers either check defensively at every level or forget and get a \`NullPointerException\` far from the cause.

\`Optional<T>\` makes absence explicit in the type. A method returning \`Optional<User>\` tells the caller that no user is a normal outcome and must be handled, without exceptions for control flow and without a nullable reference that looks identical to a valid one.

The container is small and immutable. It either holds a non-null reference or is the shared \`Optional.empty()\` singleton. It has no public constructor; instances come from \`of\`, \`ofNullable\` and \`empty\`.

The design intent is narrow, and the JDK authors have said so repeatedly: \`Optional\` is a **return type** for methods that may legitimately produce nothing. It is not a general null replacement, and using it everywhere produces a different kind of noise rather than fewer bugs.`,
        },
        {
          id: 'creation-and-inspection',
          title: 'Creation and inspection',
          body: `Three factories cover creation:

- \`Optional.of(value)\` requires a non-null value and throws \`NullPointerException\` immediately otherwise. Use it when null is a bug.
- \`Optional.ofNullable(value)\` accepts null and returns \`empty()\` in that case. Use it at the boundary where a nullable value enters.
- \`Optional.empty()\` returns the shared empty instance.

Inspection has three useful methods and one dangerous one. \`isPresent()\` and \`isEmpty()\` answer the obvious question. \`ifPresent(Consumer)\` runs an action when a value exists. \`get()\` returns the value or throws \`NoSuchElementException\`, and it is effectively an unlabelled assertion that the optional is non-empty; using it after a check is no better than a null check with extra steps.

\`Optional.equals\` compares contained values, and \`hashCode\` is value-based, so optionals are safe inside collections. \`toString\` renders \`Optional[value]\` or \`Optional.empty\`, which helps in logs.

\`Optional.of(null)\` failing fast is deliberate: it separates "programmer error" from "expected absence".`,
        },
        {
          id: 'transformation',
          title: 'map, flatMap and filter',
          body: `The value-oriented methods let you describe a chain without unwrapping:

- \`map(Function<T, R>)\` applies the function if a value is present, wrapping the result. If the function returns null, the result is \`empty()\`, not \`Optional.of(null)\`.
- \`flatMap(Function<T, Optional<R>>)\` is for functions that already return an optional. Without it you would get \`Optional<Optional<R>>\`.
- \`filter(Predicate<T>)\` turns a present value into \`empty()\` when the predicate fails.
- \`or(Supplier<Optional<T>>)\` supplies a fallback optional lazily.

The map/flatMap distinction mirrors streams exactly, and the same mistake appears: calling \`map\` with a method that returns \`Optional\` produces nesting. The compiler will not stop you; the type just becomes awkward downstream.

A realistic chain reads top to bottom: \`user.map(User::address).map(Address::city).filter(s -> !s.isBlank())\`. Each step handles absence automatically, and no branch is written. That is the actual benefit: absence propagates without ceremony instead of nesting.`,
        },
        {
          id: 'or-else-family',
          title: 'The orElse family',
          body: `Extraction methods differ mainly in eagerness:

| Method | Behaviour |
| --- | --- |
| \`orElse(default)\` | Returns the value or the default; the default is **evaluated eagerly** |
| \`orElseGet(Supplier)\` | Invokes the supplier only when empty |
| \`orElseThrow()\` | Throws \`NoSuchElementException\` when empty |
| \`orElseThrow(Supplier<X>)\` | Throws the supplied exception |
| \`ifPresentOrElse(Consumer, Runnable)\` | Branch on presence without returning |
| \`or(Supplier<Optional<T>>)\` | Chains another optional lazily |
| \`stream()\` | Zero or one element, for pipeline integration |

The eager-versus-lazy distinction is the classic interview question and a real production issue. \`orElse(expensiveLookup())\` performs the lookup even when a value is present, because Java evaluates arguments before the call. \`orElseGet(() -> expensiveLookup())\` defers it.

Use \`orElse\` only for cheap constants, and \`orElseGet\` whenever the fallback allocates, queries or throws. \`orElseThrow\` with a domain exception is the idiomatic replacement for a null check that signals a contract violation.`,
        },
        {
          id: 'anti-patterns',
          title: 'Anti-patterns and boundaries',
          body: `\`Optional\` is easy to over-apply. The well-known anti-patterns:

- **Fields and constructor parameters.** \`Optional\` is not \`Serializable\`, adds an allocation, and makes every access awkward. Use a nullable field with a documented invariant, or a null-object pattern.
- **Collections of Optional.** Use an empty collection instead, or filter before collecting. \`Optional\` inside a \`List\` forces every consumer to unwrap.
- **\`isPresent()\` plus \`get()\`.** This is null checking with more characters; use \`map\`, \`ifPresent\` or \`orElse\`.
- **Returning \`Optional<List<T>>\`.** Return an empty list; emptiness is already representable.
- **\`Optional.ofNullable(x).orElse(y)\`** where a plain ternary on null is clearer and allocation-free.

The sensible boundaries are return types of lookup methods, and short-lived internal chains. Public API design should also consider that \`Optional\` is not a good choice for performance-critical code paths with millions of calls, because each non-empty optional is an object.

\`OptionalInt\`, \`OptionalLong\` and \`OptionalDouble\` exist to avoid boxing in numeric code.`,
        },
      ],
      javaCode: [
        {
          title: 'A null-safe navigation chain',
          description:
            'map and flatMap replace nested null checks, and each stage propagates absence automatically.',
          code: `import java.util.Optional;

record Address(String city, String country) {}

record User(String name, Address address) {}

public class OptionalChain {

    static Optional<String> cityOf(User user) {
        return Optional.ofNullable(user)
                .map(User::address)
                .map(Address::city)
                .filter(city -> !city.isBlank())
                .map(String::toUpperCase);
    }

    public static void main(String[] args) {
        User ada = new User("ada", new Address("london", "uk"));
        User anon = new User("anon", null);

        System.out.println(cityOf(ada).orElse("unknown"));
        System.out.println(cityOf(anon).orElse("unknown"));
        System.out.println(cityOf(null).isPresent());

        Optional<User> maybe = Optional.of(ada);
        Optional<Address> address = maybe.flatMap(u -> Optional.ofNullable(u.address()));
        System.out.println(address.map(Address::country));
    }
}`,
        },
        {
          title: 'orElse versus orElseGet',
          description:
            'The fallback argument is evaluated eagerly, so side effects and expensive calls belong in a supplier.',
          code: `import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

public class OrElseEagerness {

    private static final AtomicInteger LOOKUPS = new AtomicInteger();

    static String expensiveFallback() {
        LOOKUPS.incrementAndGet();
        return "fallback";
    }

    public static void main(String[] args) {
        Optional<String> present = Optional.of("value");

        System.out.println(present.orElse(expensiveFallback()));
        System.out.println("lookups after orElse: " + LOOKUPS.get()); // 1

        System.out.println(present.orElseGet(OrElseEagerness::expensiveFallback));
        System.out.println("lookups after orElseGet: " + LOOKUPS.get()); // still 1

        System.out.println(Optional.<String>empty().orElseGet(() -> "generated"));
        System.out.println(Optional.<String>empty().orElseThrow(
                () -> new IllegalStateException("missing")));
    }
}`,
        },
        {
          title: 'Optionals in a stream pipeline',
          description:
            'Optional::stream flattens present values and drops empty ones, avoiding nulls in collections.',
          code: `import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class OptionalStreams {

    record Product(String sku, Integer price) {}

    static Optional<Integer> priceOf(Product product) {
        return Optional.ofNullable(product).map(Product::price).filter(p -> p > 0);
    }

    public static void main(String[] args) {
        List<Product> catalog = List.of(
                new Product("a1", 120),
                new Product("b2", null),
                new Product("c3", 0),
                new Product("d4", 75));

        List<Integer> prices = catalog.stream()
                .map(OptionalStreams::priceOf)
                .flatMap(Optional::stream)
                .collect(Collectors.toList());
        System.out.println(prices); // [120, 75]

        int total = prices.stream().mapToInt(Integer::intValue).sum();
        System.out.println(total);

        Optional<Integer> first = catalog.stream()
                .map(OptionalStreams::priceOf)
                .flatMap(Optional::stream)
                .findFirst();
        System.out.println(first);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Optional encodes possible absence in the return type instead of relying on documentation.',
        'of rejects null, ofNullable converts null to empty, and empty is a shared singleton.',
        'map wraps, flatMap avoids nesting, and filter turns a present value into empty.',
        'orElse evaluates its argument eagerly; orElseGet defers the fallback to a supplier.',
        'Optional belongs in return types, not in fields, parameters or collections.',
      ],
      interviewTips: [
        'Explain the orElse versus orElseGet difference in terms of Java argument evaluation order.',
        'Show a nested null-check refactor into an Optional chain with map and flatMap.',
        'List the anti-patterns, especially isPresent plus get, and say what to use instead.',
        'Mention OptionalInt and OptionalDouble when boxing matters.',
      ],
      pitfalls: [
        'Calling get() without a presence check, which throws NoSuchElementException.',
        'Using orElse with an expensive or side-effecting expression.',
        'Returning Optional<Optional<T>> by using map instead of flatMap.',
        'Declaring Optional fields or parameters and complicating the API for no benefit.',
        'Assuming Optional is Serializable or free to allocate.',
      ],
      quiz: [
        {
          question: 'Which call avoids evaluating the fallback when a value is present?',
          options: ['orElse(fallback())', 'orElseGet(() -> fallback())', 'get()', 'of(fallback())'],
          answerIndex: 1,
          explanation:
            'orElseGet takes a Supplier, so the fallback expression runs only for an empty optional. orElse evaluates its argument eagerly.',
        },
        {
          question: 'What does Optional.of(null) do?',
          options: [
            'Returns Optional.empty()',
            'Throws NullPointerException',
            'Returns an Optional containing null',
            'Fails to compile',
          ],
          answerIndex: 1,
          explanation:
            'of requires a non-null value and fails fast. Use ofNullable when null is an expected input.',
        },
      ],
    },
    {
      slug: 'parallel-streams',
      title: 'Parallel Streams & Primitive Optionals',
      order: 14,
      summary: 'Spliterators, the common ForkJoinPool, parallel pitfalls, and boxing-free numeric streams.',
      level: 'advanced',
      subtopics: [
        {
          id: 'forkjoin-common-pool',
          title: 'The common ForkJoinPool',
          body: `A parallel stream runs on \`ForkJoinPool.commonPool()\`, a JVM-wide pool created lazily with \`Runtime.getRuntime().availableProcessors() - 1\` worker threads, since the calling thread participates. Work is distributed by work-stealing: idle workers take tasks from the tail of another worker's deque.

Because the pool is shared, a slow parallel stream can starve every other parallel stream in the JVM, including those inside libraries. Blocking operations such as I/O or \`synchronized\` waits on pool threads are especially damaging, since a blocked worker cannot steal work and the effective parallelism collapses.

Two escape hatches exist. The system property \`java.util.concurrent.ForkJoinPool.common.parallelism\` changes the pool size globally. Alternatively, submit the pipeline as a task to a custom \`ForkJoinPool\` and call it from there; the stream detects the current pool and uses it instead of the common one.

Parallelism is not free: splitting, task creation, result combination and memory barriers all cost. For small or cheap workloads, the overhead exceeds any gain.`,
        },
        {
          id: 'spliterator-mechanics',
          title: 'Spliterators and how splitting works',
          body: `A \`Spliterator\` is the parallel counterpart of an iterator. Instead of a single cursor it offers \`trySplit()\`, which partitions off a prefix for another thread, and \`forEachRemaining\` for bulk traversal.

Characteristics drive the strategy: \`SIZED\` allows exact splitting, \`SUBSIZED\` guarantees that children are also sized, \`ORDERED\` guarantees encounter order, \`DISTINCT\` and \`SORTED\` enable optimisations, and \`IMMUTABLE\` or \`CONCURRENT\` affect safety assumptions.

The source structure determines splitting quality:

- \`ArrayList\` and arrays split by index range, perfectly balanced, O(1) per split.
- \`HashMap\` and \`HashSet\` split by bucket ranges, well balanced.
- \`TreeMap\` splits by subtree.
- \`LinkedList\` splits poorly, because finding the midpoint is a traversal; parallelising it often loses to sequential.
- \`Stream.iterate\` is inherently sequential and reports itself as such; use \`Stream.iterate\` with three arguments or \`IntStream.range\` for parallel-friendly generation.

A spliterator can be traversed only once, like an iterator.`,
        },
        {
          id: 'when-parallel-helps',
          title: 'When parallel actually helps',
          body: `The classic rule of thumb is N × Q: the number of elements times the cost per element must be large. If N is 1,000 and Q is a few nanoseconds, coordination dominates and parallel is slower. If N is 10 million or Q is milliseconds, parallel can win.

The conditions that make it work:

- **Large data.** Typically hundreds of thousands of elements or more.
- **Expensive per-element work.** Real computation, not a field read.
- **Cheap, well-balanced splitting.** Arrays and array-backed collections.
- **Stateless, associative operations.** Order must not matter, and results must combine correctly.
- **No blocking.** No I/O, no locks, no shared mutable state.
- **A result that combines cheaply.** Summing longs is cheap; concatenating strings is not.

A parallel stream over a \`LinkedList\` of 100,000 small objects, doing a trivial map, is reliably slower than the sequential version. Measure with JMH; wall-clock timing in a loop is dominated by JIT warmup and dead-code elimination.`,
        },
        {
          id: 'parallel-pitfalls',
          title: 'Correctness pitfalls',
          body: `Parallel streams turn ordinary code into concurrent code, and most bugs are silent.

**Shared mutable state.** Accumulating into a shared \`ArrayList\` or incrementing a plain \`int\` from \`forEach\` is a data race. Use \`collect\`, or a concurrent collector, or \`reduce\`.

**Encounter order.** \`forEach\` on a parallel stream does not preserve order; \`forEachOrdered\` does, but it serialises the terminal action and kills the benefit. Use \`forEachOrdered\` only when order is genuinely required.

**findFirst versus findAny.** \`findFirst\` must respect encounter order and is expensive in parallel; \`findAny\` is free to return whichever thread finishes first.

**Non-associative reduction.** \`reduce\` with subtraction or string concatenation gives different results depending on how the input was split. Only associative operations are safe.

**Thread-local state.** \`ThreadLocal\` values set on the calling thread are invisible to pool workers, which is a frequent surprise with logging MDC and transaction contexts.

**Ordered stateful stages.** \`sorted\`, \`distinct\` and \`limit\` on an ordered parallel stream require coordination and buffers, often erasing the gain.`,
        },
        {
          id: 'primitive-streams',
          title: 'Primitive streams',
          body: `\`Stream<Integer>\` boxes every element. For a million values that is a million \`Integer\` objects, plus the indirection on every operation. \`IntStream\`, \`LongStream\` and \`DoubleStream\` store primitives and expose numeric terminal operations directly: \`sum()\`, \`average()\`, \`min()\`, \`max()\`, \`summaryStatistics()\`.

Bridge methods move between the two worlds: \`mapToInt\`, \`mapToLong\`, \`mapToDouble\` on an object stream; \`boxed()\` on a primitive stream; \`mapToObj\` to convert a primitive into an object.

Primitive streams are also the natural home for range generation: \`IntStream.range(0, n)\` and \`rangeClosed(0, n)\` produce a sized, splittable, boxing-free sequence, which makes them ideal for parallel index loops. \`IntStream.of(array)\` and \`Arrays.stream(int[])\` wrap existing arrays without copying.

\`summaryStatistics()\` is worth remembering: it computes count, sum, min, max and average in a single pass and returns an \`IntSummaryStatistics\` object with getters. Four separate stream passes become one.

\`chars()\` on a \`String\` returns an \`IntStream\` of code units, not code points.`,
        },
        {
          id: 'primitive-optionals',
          title: 'OptionalInt, OptionalLong and OptionalDouble',
          body: `Numeric terminal operations cannot return \`null\` or a boxed \`Optional<Integer>\` without losing the point of going primitive. The JDK supplies three dedicated containers: \`OptionalInt\`, \`OptionalLong\` and \`OptionalDouble\`.

They store a primitive plus a boolean presence flag, so they allocate no wrapper for the value itself. The API mirrors \`Optional\`: \`of\`, \`empty\`, \`isPresent\`, \`isEmpty\`, \`getAsInt\`, \`orElse\`, \`orElseThrow\`, \`ifPresent\`, \`ifPresentOrElse\`, \`stream\`, and \`map\`/\`flatMap\` variants that take primitive-friendly functions.

What they lack matters. There is no \`ofNullable\`, because a primitive cannot be null in the first place; use \`OptionalInt.of(value)\` or \`OptionalInt.empty()\`. They are value-based and not \`Serializable\`.

\`IntStream.max()\` returns \`OptionalInt\` because an empty stream has no maximum. Treating \`orElse(0)\` as a safe default is a subtle bug when 0 is a legitimate value; check presence instead when the distinction matters.`,
        },
      ],
      javaCode: [
        {
          title: 'A parallel pipeline done correctly',
          description:
            'A large array, a stateless map, and reduce for a combining-safe result instead of shared mutation.',
          code: `import java.util.stream.IntStream;

public class ParallelSum {

    static long sequentialSum(int n) {
        return IntStream.rangeClosed(1, n).asLongStream().sum();
    }

    static long parallelSum(int n) {
        return IntStream.rangeClosed(1, n).asLongStream().parallel().sum();
    }

    public static void main(String[] args) {
        int n = 10_000_000;
        System.out.println(sequentialSum(n));
        System.out.println(parallelSum(n));
        System.out.println(sequentialSum(n) == parallelSum(n));

        long evenSquares = IntStream.rangeClosed(1, 1_000_000)
                .parallel()
                .filter(i -> i % 2 == 0)
                .mapToLong(i -> (long) i * i)
                .reduce(0L, Long::sum);
        System.out.println(evenSquares);
    }
}`,
        },
        {
          title: 'The shared mutable state bug',
          description:
            'Appending to a shared ArrayList from a parallel forEach loses elements; collect is the safe alternative.',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class RaceDemo {

    public static void main(String[] args) {
        List<Integer> unsafe = new ArrayList<>();
        IntStream.range(0, 100_000).parallel().forEach(unsafe::add);
        System.out.println("unsafe size: " + unsafe.size());

        List<Integer> safe = IntStream.range(0, 100_000)
                .parallel()
                .boxed()
                .collect(Collectors.toList());
        System.out.println("safe size: " + safe.size());

        long ordered = IntStream.range(0, 5)
                .parallel()
                .asLongStream()
                .sum();
        System.out.println("order-independent sum: " + ordered);
    }
}`,
        },
        {
          title: 'Primitive statistics and OptionalInt',
          description:
            'One pass produces count, sum, min, max and average, while max returns an OptionalInt because the stream may be empty.',
          code: `import java.util.IntSummaryStatistics;
import java.util.OptionalInt;
import java.util.stream.IntStream;

public class PrimitiveStats {

    public static void main(String[] args) {
        int[] samples = {42, 7, 19, 88, 3, 56};

        IntSummaryStatistics stats = IntStream.of(samples).summaryStatistics();
        System.out.println("count   " + stats.getCount());
        System.out.println("sum     " + stats.getSum());
        System.out.println("min/max " + stats.getMin() + "/" + stats.getMax());
        System.out.printf("average %.2f%n", stats.getAverage());

        OptionalInt max = IntStream.of(samples).max();
        System.out.println(max.getAsInt());

        OptionalInt empty = IntStream.empty().max();
        System.out.println(empty.isEmpty());
        System.out.println(empty.orElse(-1));

        System.out.println(IntStream.range(0, 10).map(i -> i * i).sum());
    }
}`,
        },
      ],
      keyTakeaways: [
        'Parallel streams use the shared common ForkJoinPool, so blocking work starves unrelated pipelines.',
        'Splitting quality depends on the source; arrays split perfectly while LinkedList splits poorly.',
        'Parallelism only pays when N × Q is large, operations are stateless and associative, and nothing blocks.',
        'Shared mutable state, order dependence and non-associative reduction are the main correctness traps.',
        'Primitive streams avoid boxing and provide sum, average, summaryStatistics and OptionalInt.',
      ],
      interviewTips: [
        'State the N × Q rule and give a counterexample where parallel is slower.',
        'Explain trySplit, the spliterator characteristics, and why ArrayList parallelises better than LinkedList.',
        'Contrast findFirst with findAny and forEach with forEachOrdered under parallelism.',
        'Explain why OptionalInt has no ofNullable and when orElse(0) is a bug.',
      ],
      pitfalls: [
        'Mutating a shared collection from a parallel forEach.',
        'Using reduce with a non-associative operation such as subtraction.',
        'Assuming the common pool is dedicated to your stream.',
        'Doing blocking I/O inside a parallel stream and stalling other users of the pool.',
        'Treating OptionalInt.orElse(0) as a safe default when zero is a real value.',
      ],
      quiz: [
        {
          question: 'Which pool do parallel streams use by default?',
          options: [
            'A new thread per element',
            'ForkJoinPool.commonPool()',
            'A cached thread pool',
            'The caller thread only',
          ],
          answerIndex: 1,
          explanation:
            'Parallel streams execute on the JVM-wide common ForkJoinPool unless the terminal operation is invoked from a custom pool.',
        },
        {
          question: 'Why can parallel reduce give a different answer for subtraction?',
          options: [
            'Because integers overflow',
            'Because subtraction is not associative, so grouping changes the result',
            'Because parallel streams reorder the output list',
            'Because reduce always runs sequentially',
          ],
          answerIndex: 1,
          explanation:
            'Parallel reduction combines partial results in an arbitrary grouping, so only associative operations produce a deterministic result.',
        },
      ],
    },
  ],
};
