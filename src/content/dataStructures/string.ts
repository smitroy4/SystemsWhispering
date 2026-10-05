import type { Topic } from '../../types/content.ts';

/** Strings: immutability, char[] storage, and why builders exist. */
export const stringTopic: Topic = {
  slug: 'string',
  title: 'Strings & StringBuilder',
  category: 'data-structures',
  order: 3,
  summary: 'Strings are immutable char sequences: every "change" allocates a copy. Learn when that is fine and when StringBuilder saves the day.',
  level: 'beginner',
  group: 'linear',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'Strings are immutable values',
      body: 'In Java a `String` cannot change after creation. `s += "!"` does not touch the old object — it allocates a **new char array**, copies both halves in, and points `s` at the result.\n\nImmutability is a feature: strings are safe to share between threads, usable as `HashMap` keys, and interned into a pool so equal literals reuse one object. The cost is paid only when you *build* strings piece by piece.',
    },
    {
      heading: 'How strings live in memory',
      body: 'A `String` wraps a `byte[]` (compact strings: one byte per Latin character, two for others) plus a length and a hash cache. `charAt(i)` is `O(1)` array access; `length()` is a stored field.\n\nConcatenating in a loop of `n` appends copies roughly 1 + 2 + … + `n` characters — `O(n²)` total work. That hidden quadratic is one of the most common Java performance bugs.',
    },
    {
      heading: 'StringBuilder: a growable char buffer',
      body: 'When you assemble text, use a **`StringBuilder`**: a resizable `char[]` buffer (same doubling trick as `ArrayList`) with `O(1)` amortized `append`. Call `toString()` once at the end for a single final copy.\n\n- `StringBuilder` is unsynchronized and fast; `StringBuffer` is the legacy synchronized twin you almost never need.\n- The compiler already rewrites a *single expression* like `a + b + c` into builder code — the trap is only `+` **inside loops**.\n- For joining many pieces with a separator, `String.join(delimiter, parts)` is the idiomatic one-liner.',
    },
    {
      heading: 'Comparing and inspecting strings',
      body: 'Compare contents with `equals`, never `==` (`==` compares pooled references and works only by accident). Case-insensitive needs `equalsIgnoreCase`; ordering needs `compareTo`.\n\nUseful members: `substring`, `indexOf`, `startsWith`/`endsWith`, `split`, `toCharArray`, and `isEmpty`/`isBlank`. Remember `substring` copies in modern Java — slicing a huge string in a loop can pin memory.',
    },
  ],
  complexity: [
    { operation: 'charAt / length', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Concatenation (+)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'n appends in a loop (+)', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(n)' },
    { operation: 'StringBuilder append', best: 'O(1)', average: 'O(1) amortized', worst: 'O(n)', space: 'O(n)' },
    { operation: 'equals / compareTo', best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Manual building with char[]',
      description: 'From scratch: the buffer-and-copy pattern builders automate.',
      code: `import java.util.Arrays;

public class ManualRepeat {
    static String repeat(char c, int n) {
        char[] buf = new char[n];
        Arrays.fill(buf, c);
        return new String(buf);
    }

    static String concatAll(String[] parts) {
        int total = 0;
        for (String p : parts) {
            total += p.length();
        }
        char[] buf = new char[total];
        int pos = 0;
        for (String p : parts) {
            for (int i = 0; i < p.length(); i++) {
                buf[pos++] = p.charAt(i);
            }
        }
        return new String(buf);
    }

    public static void main(String[] args) {
        System.out.println(repeat('=', 10));
        System.out.println(concatAll(new String[]{"a", "b", "c"}));
    }
}
`,
    },
    {
      title: 'StringBuilder built-in equivalent',
      description: 'Idiomatic Java: builders, join, and safe comparison.',
      code: `import java.util.List;

public class BuilderDemo {
    static String shout(List<String> words) {
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(w.toUpperCase());
        }
        return sb.append('!').toString();
    }

    public static void main(String[] args) {
        System.out.println(shout(List.of("hello", "world")));
        System.out.println(String.join("-", "2026", "10", "04"));

        String a = new String("java");
        String b = "java";
        System.out.println(a == b); // false: identity, not content
        System.out.println(a.equals(b)); // true: the safe comparison
    }
}
`,
    },
  ],
  mistakes: [
    'Comparing strings with == instead of equals: works for literals (pooling) and breaks for everything else.',
    'Concatenating with + inside a loop: O(n²) copying — use StringBuilder or String.join.',
    'Reaching for StringBuffer by default: it synchronizes every call; prefer unsynchronized StringBuilder.',
    'Forgetting substring copies: holding a small slice of a giant string keeps the whole thing alive in old versions — and still copies today.',
    'Calling length() on a null or assuming isEmpty covers whitespace: use isBlank() when spaces count as empty.',
    'Splitting with regex surprises: split(".") splits on every character — escape it as split("\\\\.").',
  ],
  vizId: 'string-builder',
  problemIds: ['valid-anagram', 'valid-palindrome'],
};
