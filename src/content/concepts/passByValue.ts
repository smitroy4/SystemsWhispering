import type { Topic } from '../../types/content.ts';

/** Pass-by-value in Java: copies of values, copies of references — never aliases. */
export const passByValueTopic: Topic = {
  slug: 'pass-by-value-java',
  title: 'Pass-by-Value in Java',
  category: 'concepts',
  order: 5,
  summary: 'Java always copies the argument: primitives copy the value, objects copy the reference. Methods can mutate objects, never rebind callers.',
  level: 'beginner',
  prerequisites: ['memory-stack-vs-heap'],
  sections: [
    {
      heading: 'Always a copy, two flavors',
      body: 'Java is **strictly pass-by-value**: every argument is copied into the parameter. For primitives the copy is the value itself — mutating the parameter is invisible outside. For objects the copy is the **reference** — the method gets its own remote pointing at the *same* heap object.\n\nConsequence: `swap(a, b)` on ints can never work, but `list.add(x)` inside a method persists. One rule, both behaviors.',
    },
    {
      heading: 'Mutate vs rebind',
      body: 'Inside a method you may **mutate** the shared object (`sb.append(...)`, `p.x = 1`) — the caller sees it. But **rebinding** the parameter (`sb = new StringBuilder()`, `p = null`) only redirects your local copy; the caller’s remote still points where it did.\n\n`final` parameters guard against accidental rebinding, and returning new objects instead of mutating inputs keeps APIs predictable.',
    },
    {
      heading: 'Defensive habits',
      body: 'Copy inputs you must keep (`new ArrayList<>(in)`), return copies or unmodifiable views (`List.copyOf`, `Collections.unmodifiableList`), and document whether a method mutates. Records help: compact immutable carriers whose state cannot drift after construction.',
    },
  ],
  complexity: [
    { operation: 'Primitive argument copy', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Reference argument copy', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Defensive list copy', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Copy semantics, demonstrated',
      description: 'Primitives stay, mutations persist, rebinds do not.',
      code: `import java.util.ArrayList;
import java.util.List;

public class PassByValue {
    static void tweak(int n, List<String> items, List<String> rebound) {
        n = 99; // local copy only
        items.add("mutated"); // shared object: caller sees this
        rebound = new ArrayList<>(); // rebinds only the local copy
    }

    public static void main(String[] args) {
        int n = 1;
        List<String> items = new ArrayList<>(List.of("a"));
        List<String> rebound = new ArrayList<>(List.of("keep"));
        tweak(n, items, rebound);
        System.out.println(n); // 1
        System.out.println(items); // [a, mutated]
        System.out.println(rebound); // [keep]
    }
}
`,
    },
    {
      title: 'Defensive copies in APIs',
      description: 'Copy in, copy out — or expose unmodifiable views.',
      code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Roster {
    private final List<String> members;

    public Roster(List<String> members) {
        this.members = new ArrayList<>(members); // copy in
    }

    public List<String> members() {
        return Collections.unmodifiableList(members); // safe view out
    }

    public static void main(String[] args) {
        List<String> input = new ArrayList<>(List.of("ada", "bob"));
        Roster roster = new Roster(input);
        input.add("mallory");
        System.out.println(roster.members()); // [ada, bob]: smuggling failed
    }
}
`,
    },
  ],
  mistakes: [
    'Writing swap(a, b) for primitives: parameters are copies — swap inside an array or return both values.',
    'Expecting rebinding to propagate: assigning the parameter never affects the caller’s variable.',
    'Storing caller-owned lists directly: later caller mutations corrupt your state — copy on entry.',
    'Returning internal mutable lists: callers mutate your guts — return copies or unmodifiable views.',
    'Calling it "pass by reference": Java has no reference parameters — say "reference copied by value".',
  ],
  problemIds: ['reverse-string', 'copy-list-with-random-pointer'],
};
