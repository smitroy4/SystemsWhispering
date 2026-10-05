import type { Topic } from '../../types/content.ts';

/** ArrayList: the default list — growth policy, indexed idioms, and traps. */
export const arrayListTopic: Topic = {
  slug: 'arraylist-jcf',
  title: 'ArrayList',
  category: 'data-structures',
  order: 37,
  summary: "Java's resizable array: amortized O(1) appends, indexed access, and the growth policy that makes it tick.",
  level: 'beginner',
  group: 'collections',
  status: 'complete',
  prerequisites: ['dynamic-array', 'collections-framework'],
  choiceBox: {
    choose: [
      'Default list for almost everything: indexed access, iteration, sorting, stream sources.',
      'Sizes known up front → pass the capacity to the constructor and skip every resize.',
      'Frequent contains/indexOf on a stable list → sort once and `Collections.binarySearch`, or switch to a `HashSet`.',
    ],
    avoid: [
      'Front inserts/removals in a loop — each is O(n); `ArrayDeque` or `LinkedList` serve ends cheaply.',
      'Huge lists of primitives — boxed `Integer` costs 4× the memory; fastutil/Trove or plain arrays for hot numerics.',
      'Sharing one list across threads — wrap or copy; `ArrayList` has no internal synchronization at all.',
    ],
  },
  sections: [
    {
      heading: 'A dynamic array with a growth policy',
      body: 'Internally `ArrayList` is `Object[] elementData` plus `size`. Appends write at `elementData[size++]` until full, then **grow**: `newCapacity = oldCapacity + (oldCapacity >> 1)` — 1.5× — and `Arrays.copyOf` moves the references. That 50% slack is the amortized-`O(1)` deal: n appends cost `O(n)` total because copies halve in relative frequency as the array grows.\n\n- Default capacity is 10 (lazy: the array allocates on first add). `new ArrayList<>(1_000_000)` pre-sizes when the count is known.\n- `ensureCapacity` pre-grows before bulk adds; `trimToSize` releases slack after.\n- `subList` returns a *view*: writes through it hit the original, and structural changes to the original invalidate it.',
    },
    {
      heading: 'Indexed idioms that read well',
      body: '`get`/`set` are pointer arithmetic — the reason lists beat sets for indexed work. `Collections.sort(list)` (TimSort) sorts in place; `list.sort(comparator)` is the direct method. `removeIf` filters in one pass without iterator ceremony; `replaceAll` transforms in place.\n\n- Build-then-share: fill a list, wrap with `List.copyOf`/`Collections.unmodifiableList`, hand out the view.\n- Return positions, not sentinels: `indexOf` returns −1 when absent — check it before `get`.',
    },
    {
      heading: 'The remove overload trap',
      body: '`List<Integer>` has two removes: `remove(int index)` and `remove(Object o)`. `list.remove(1)` deletes **index 1**, not the value 1 — autoboxing picks the `int` overload. To delete by value, write `list.remove(Integer.valueOf(1))`. This is the single most-asked ArrayList interview trap, and it compiles silently either way.\n\nRelated: `contains`/`indexOf` use `equals` (value equality for `Integer`, `String`), while `==` on the elements compares references — the list is innocent, the comparison is guilty.',
    },
    {
      heading: 'Memory and boxing reality',
      body: 'Each element is a 4-byte reference (plus the object: `Integer` ~16 bytes). A million ints as `Integer` costs ~20 MB vs 4 MB as `int[]`. Iteration is cache-friendly (contiguous references, often contiguous young-gen objects) but not as tight as primitives.\n\n- Prefer `int[]` for hot numeric loops; prefer `ArrayList` the moment the size is dynamic or generics are needed.\n- `null` elements are allowed (and counted by `size`): `contains(null)` works, unboxing a null throws — validate before arithmetic.',
    },
  ],
  complexity: [
    { operation: 'get / set', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'add (append, amortized)', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'add / remove at index', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'contains / indexOf', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'sort (TimSort)', best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'MyArrayList from scratch',
      description: 'elementData + size + 1.5× growth — the whole trick in 40 lines.',
      code: `import java.util.Arrays;

public class MyArrayList<E> {
    private Object[] elementData = new Object[0];
    private int size;

    public MyArrayList() {
    }

    public MyArrayList(int capacity) {
        elementData = new Object[capacity];
    }

    public void add(E value) {
        if (size == elementData.length) {
            int grown = Math.max(10, elementData.length + (elementData.length >> 1));
            elementData = Arrays.copyOf(elementData, grown);
        }
        elementData[size++] = value;
    }

    @SuppressWarnings("unchecked")
    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("index " + index);
        }
        return (E) elementData[index];
    }

    public int size() {
        return size;
    }

    public static void main(String[] args) {
        MyArrayList<String> list = new MyArrayList<>();
        for (int i = 0; i < 25; i++) {
            list.add("s" + i); // grows 0 → 10 → 15 → 22 → 33
        }
        System.out.println("size=" + list.size() + " get(24)=" + list.get(24));
    }
}
`,
    },
    {
      title: 'Idiomatic usage and interview snippets',
      description: 'Capacity, sorting, removeIf, and the remove-by-value fix.',
      code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ArrayListIdioms {
    public static void main(String[] args) {
        // Pre-size when the count is known: zero resizes.
        List<Integer> scores = new ArrayList<>(1000);
        scores.addAll(List.of(88, 42, 95, 42, 71));

        scores.sort(Comparator.reverseOrder());
        System.out.println(scores); // [95, 88, 71, 42, 42]

        // remove(int) deletes by INDEX — wrap to delete by value.
        scores.remove(Integer.valueOf(42));
        System.out.println(scores); // [95, 88, 71, 42]

        // One-pass filter, no iterator ceremony.
        scores.removeIf(s -> s < 70);
        System.out.println(scores); // [95, 88, 71]
    }
}
`,
    },
  ],
  mistakes: [
    'Calling remove(1) to delete value 1: the int overload deletes index 1 — wrap with Integer.valueOf for by-value removal.',
    'Growing inside a loop without capacity: a million blind appends resize ~28 times — pass the size to the constructor.',
    'Holding a subList while modifying the original: the view invalidates (ConcurrentModificationException) — copy it with new ArrayList<>(sub).',
    'Comparing elements with ==: contains/indexOf use equals — reference comparison misses equal-valued boxed integers past caching.',
    'Unboxing nulls from the list: get(i) + 1 throws if the slot is null — nulls are storable but not arithmetic-safe.',
    'Returning the internal list directly: callers mutate your state — hand out List.copyOf snapshots or unmodifiable views.',
  ],
  vizId: 'arraylist-growth',
  problemIds: ['generate-parentheses', 'letter-combinations-of-a-phone-number', 'spiral-matrix'],
  javaBuiltIn: ['java.util.ArrayList'],
  related: ['dynamic-array', 'linkedlist-jcf', 'vector-stack-legacy'],
};
