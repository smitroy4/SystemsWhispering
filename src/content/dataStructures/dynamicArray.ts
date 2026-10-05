import type { Topic } from '../../types/content.ts';

/** Dynamic arrays: growth strategy, amortized cost, ArrayList internals. */
export const dynamicArrayTopic: Topic = {
  slug: 'dynamic-array',
  title: 'Dynamic Arrays',
  category: 'data-structures',
  order: 2,
  summary: 'Arrays that grow themselves: how ArrayList doubles its capacity, why appends are amortized O(1), and what resize really costs.',
  section: 'core',
  level: 'beginner',
  group: 'linear',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The fixed-size problem',
      body: 'A plain array cannot grow: once `new int[4]` is full, the fifth element has nowhere to go. A **dynamic array** solves this by keeping a spare-capacity buffer — it allocates more room than needed, tracks a separate `size`, and **resizes** (allocate bigger, copy over) only when the buffer fills up.\n\nJava developers meet this structure daily: it is exactly what `java.util.ArrayList` is.',
    },
    {
      heading: 'How growth works in memory',
      body: 'A dynamic array stores three things: a reference to a plain backing array, a `size` count, and an implicit `capacity` (the backing array length).\n\n- Appending while `size < capacity` is one write: `O(1)`.\n- When `size == capacity`, it allocates a new array of (usually) **double the capacity**, copies all `n` elements over, then appends: `O(n)` for that one operation.\n- Doubling matters: after a resize to `2n`, the next `n` appends are all cheap, so the copy cost **amortizes** to `O(1)` per append. Growing by a constant (+10 each time) would make appends `O(n)` amortized instead.',
    },
    {
      heading: 'Amortized O(1), explained',
      body: 'Push `n` elements starting from capacity 1 with doubling. Resizes happen at sizes 1, 2, 4, 8, … and copy 1 + 2 + 4 + 8 + … < `2n` elements total. So `n` appends cost under `3n` elementary steps — a constant per append on average. One unlucky append pays `O(n)`, but the **average over a sequence** is `O(1)`. That average-over-sequence guarantee is what *amortized* means.',
    },
    {
      heading: 'ArrayList in practice',
      body: 'Prefer the interface type: `List<String> names = new ArrayList<>()`. Useful members:\n\n- `add(x)`, `add(i, x)`, `get(i)`, `set(i, x)`, `remove(i)` — indexed access like arrays.\n- `size()` (not `length`), `isEmpty()`, `ensureCapacity(n)` to pre-size before bulk inserts, `trimToSize()` to release spare capacity.\n- Iteration is fastest with an enhanced for-loop or `forEach`; `get(i)` in a loop is fine too since it is `O(1)`.',
    },
  ],
  complexity: [
    { operation: 'Access / set by index', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' },
    { operation: 'Append at end', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Insert / delete at index', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Search (unsorted)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'MyArrayList from scratch',
      description: 'Backing array, size, and doubling resize — the ArrayList core.',
      code: `import java.util.Arrays;

public class MyArrayList<E> {
    private Object[] data = new Object[4];
    private int size = 0;

    public void add(E value) {
        if (size == data.length) {
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[size++] = value;
    }

    @SuppressWarnings("unchecked")
    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException(index);
        }
        return (E) data[index];
    }

    public E removeAt(int index) {
        E removed = get(index);
        int moved = size - index - 1;
        if (moved > 0) {
            System.arraycopy(data, index + 1, data, index, moved);
        }
        data[--size] = null; // avoid loitering
        return removed;
    }

    public int size() {
        return size;
    }

    public int capacity() {
        return data.length;
    }

    public static void main(String[] args) {
        MyArrayList<String> list = new MyArrayList<>();
        for (String s : new String[]{"a", "b", "c", "d", "e"}) {
            list.add(s);
        }
        System.out.println(list.size() + "/" + list.capacity());
        System.out.println(list.removeAt(1) + " now " + list.get(1));
    }
}
`,
    },
    {
      title: 'ArrayList built-in equivalent',
      description: 'Idiomatic Java: interface types, bulk ops, pre-sizing.',
      code: `import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(100);
        for (int i = 0; i < 5; i++) {
            nums.add(i * 10);
        }
        nums.add(2, 15);
        nums.remove(Integer.valueOf(30));

        int sum = 0;
        for (int n : nums) {
            sum += n;
        }
        System.out.println(nums + " sum=" + sum);
        ((ArrayList<Integer>) nums).trimToSize();
    }
}
`,
    },
  ],
  mistakes: [
    'Using int[] when the size is unknown: reach for ArrayList instead of manual copyOf chains.',
    'Removing inside an enhanced for-loop: it throws ConcurrentModificationException — use removeIf or an explicit Iterator.',
    'Calling remove(3) on List<Integer> removes index 3, not the value 3 — use remove(Integer.valueOf(3)) for values.',
    'Forgetting generics (raw ArrayList): you lose type safety and invite ClassCastException — always parameterize.',
    'Inserting at index 0 repeatedly: each insert shifts everything, turning a loop into O(n²) — consider LinkedList or ArrayDeque.',
    'Holding removed references: from-scratch lists must null out slots or the garbage collector cannot reclaim them.',
  ],
  vizId: 'dynamic-array-growth',
  problemIds: ['merge-sorted-array', 'move-zeroes'],
};
