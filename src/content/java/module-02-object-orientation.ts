import type { JavaModule } from '../../types/java.ts';

export const module02: JavaModule = {
  slug: 'object-orientation',
  title: 'Object Orientation',
  order: 2,
  summary: 'Java’s object model from allocation to interfaces: classes, memory, contracts, and the rules that keep them honest.',
  overview:
    'This module moves from the mechanics of creating an object to the contracts that make objects safe to share. You will trace references through stack frames and heap layouts, unpack construction and initialization order, then build up encapsulation, inheritance, and dynamic dispatch. The second half turns those fundamentals into engineering discipline: immutability, equals/hashCode, enums, interfaces, strings, and generics.',
  topics: [
    {
      slug: 'classes-and-objects',
      title: 'Classes, Objects & the new Keyword',
      order: 1,
      summary: 'Blueprints versus runtime instances: how new allocates an object, how references reach it, and why identity is not equality.',
      level: 'beginner',
      subtopics: [
        {
          id: 'class-as-blueprint',
          title: 'A class is a type, not storage',
          body: `A **class** declares a reference type: the fields each instance carries and the methods that operate on them. Writing \`class Student { String name; int roll; }\` creates no student data at all. It creates a compile-time type plus class metadata that the JVM loads into metaspace.\n\nInstance fields describe a *shape*. The compiler computes field offsets, and the JVM uses the class metadata to know how large an instance must be and which method bodies belong to it. Only \`new\` turns that shape into memory.\n\nStatic members are the exception: they belong to the class itself and are allocated once when the class is initialized, not once per object. Keeping that distinction clear prevents the common beginner error of expecting two instances to share a field that was never marked \`static\`.`,
        },
        {
          id: 'object-creation-and-new',
          title: 'What new actually does',
          body: `\`Student s = new Student("Aditya", 12);\` executes in a strict order. First the JVM resolves and initializes the \`Student\` class if needed. Then it allocates heap memory for one instance, zeroes every field (\`null\`, \`0\`, \`0.0\`, \`false\`), and writes the object header. Only after that does it invoke the matching constructor.\n\nThe constructor initializes fields and may call \`this(...)\` or \`super(...)\`, but allocation already happened. That is why a constructor cannot "return" an object and why a field read before its initializer runs still sees the zero value.\n\nThe result of \`new\` is a reference value, which is assigned to \`s\`. If allocation fails, the JVM throws \`OutOfMemoryError\`; the reference is never assigned. The expression type is \`Student\`, not the constructor's declaring class, which matters later for inheritance.`,
        },
        {
          id: 'stack-vs-heap-references',
          title: 'Stack references, heap objects',
          body: `Local variables live in stack frames; objects live on the heap. In \`Student s = new Student(...)\`, the frame holds a fixed-width reference (typically 4 bytes with compressed oops, 8 without), while the object holds the actual fields. Passing \`s\` to a method copies the reference, not the object.\n\nArrays follow the same rule: \`int[] scores = new int[10]\` puts the array object on the heap and the reference in the frame. The array header additionally stores its length.\n\nJIT escape analysis may scalar-replace a non-escaping object and keep its fields in registers, but that is an optimization, not a language guarantee. Observable semantics — aliasing, identity, mutation — remain exactly as if the object were on the heap, so reason with the heap model first.`,
        },
        {
          id: 'fields-methods-and-this',
          title: 'Fields, methods, and implicit this',
          body: `Access uses the dot operator: \`s.name\`, \`s.introduce()\`. Inside an instance method, the receiver is available as \`this\`, so \`name\` means \`this.name\` unless a local or parameter shadows it.\n\nMethods execute against the object they were invoked on. Calling \`first.introduce()\` and \`second.introduce()\` runs the same bytecode with different receivers, which is why the same method prints different state. The receiver is an implicit first argument; the JVM passes it in local variable slot 0.\n\nA null reference has no object to receive the call. Invoking a method or reading a field through \`null\` throws \`NullPointerException\` at the point of dereference. Constructors are the one place where \`this\` exists before the object is fully initialized, so leaking \`this\` from a constructor is dangerous.`,
        },
        {
          id: 'identity-vs-equality',
          title: 'Identity versus equality',
          body: `\`==\` on references compares the reference values: two variables are \`==\` only when they point at the same object. Calling \`new Student(...)\` twice produces two distinct objects even if every field matches, so \`==\` is \`false\`. \`equals\` defaults to the same identity comparison until a class overrides it.\n\nThis distinction drives collection behavior. A \`HashSet\` uses \`hashCode\` and \`equals\`, not \`==\`, so value-equal objects can be found only if the class implements both correctly. Conversely, identity is what synchronization and caches often need: \`==\` answers "is this the very same object?"\n\nUse \`==\` for primitives, enum constants, and deliberate identity checks. Use \`equals\` for value types such as \`String\`, boxed numbers, and your own domain classes that define logical equality.`,
        },
        {
          id: 'reachability-and-gc',
          title: 'Lifetime is reachability, not scope',
          body: `When a method returns, its frame disappears and its local references disappear with it. An object becomes eligible for garbage collection when no live reference chain from a GC root can reach it. Scope ending is a common way to lose the last reference, but it is not required: setting \`s = null\` can make an object unreachable while the frame is still active.\n\nGarbage collection is automatic and non-deterministic. You cannot force it with \`System.gc()\`, and \`finalize\` is deprecated for removal because it is unpredictable. Use \`try-with-resources\` or explicit \`close()\` for files, sockets, and other native resources; the GC manages memory, not those handles.\n\nA subtle leak source is a long-lived collection holding objects that are logically finished. Reachability, not intent, keeps them alive.`,
        },
      ],
      javaCode: [
        {
          title: 'One class, two independent objects',
          description: 'Each new expression allocates separate state; the class supplies the shared behavior.',
          code: `public class Student {
    String name;
    int rollNumber;
    double cgpa;

    Student(String name, int rollNumber, double cgpa) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.cgpa = cgpa;
    }

    void introduce() {
        System.out.printf("%s (%d) has CGPA %.2f%n", name, rollNumber, cgpa);
    }

    public static void main(String[] args) {
        Student first = new Student("Aditya", 12, 8.7);
        Student second = new Student("Meera", 13, 9.1);

        first.introduce();
        second.introduce();

        first.cgpa = 9.0;                 // mutates only the first object
        System.out.println(second.cgpa);  // 9.1
    }
}`,
        },
        {
          title: 'Aliasing, identity, and pass-by-value',
          description: 'Two references can reach one object; reassigning a parameter never rewires the caller.',
          code: `class Learner {
    String name;
    Learner(String name) { this.name = name; }
}

public class ReferenceIdentity {
    static void rename(Learner learner) {
        learner.name = "Renamed";            // mutates the shared object
    }

    static void replace(Learner learner) {
        learner = new Learner("Ghost");      // local copy of the reference only
    }

    public static void main(String[] args) {
        Learner a = new Learner("Aditya");
        Learner b = a;                        // alias, not a copy

        rename(b);
        System.out.println(a.name);           // Renamed

        replace(a);
        System.out.println(a.name);           // Renamed
        System.out.println(a == b);           // true: same object
    }
}`,
        },
        {
          title: 'Null is the absence of an object',
          description: 'A null reference has no receiver, so any member access fails immediately.',
          code: `public class NullReceiver {
    static int lengthOf(String text) {
        return text.length(); // NPE if text is null
    }

    public static void main(String[] args) {
        try {
            lengthOf(null);
        } catch (NullPointerException e) {
            System.out.println("No object to receive length()");
        }

        String safe = "hello";
        if (safe != null) {
            System.out.println(lengthOf(safe));
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'A class is a type and a metadata blueprint; new allocates the instance on the heap.',
        'Local variables hold references, and those references are copied on assignment and method calls.',
        '== compares references (or primitive values); equals is identity until a class defines value equality.',
        'An object stays alive while it is reachable from a GC root, not merely while a variable is in scope.',
        'Dereferencing null has no receiver and therefore throws NullPointerException.',
      ],
      interviewTips: [
        'When asked "what does new do?", mention class initialization, heap allocation, zeroing, header installation, then constructor execution — in that order.',
        'Draw stack and heap boxes side by side for aliasing questions; it makes the pass-by-value answer obvious.',
        'Distinguish identity from equality with an example: two equal Students versus two references to one Student.',
      ],
      pitfalls: [
        'Assuming a class declaration allocates instance fields.',
        'Expecting == to compare object contents after two separate new calls.',
        'Believing a constructor runs before memory is allocated and fields are zeroed.',
        'Confusing a variable going out of scope with an object becoming unreachable.',
        'Leaking this from a constructor before the object is fully initialized.',
      ],
      quiz: [
        {
          question: 'After `Student b = a; b.name = "Meera";`, what does `a.name` show?',
          options: ['The old name, because objects are copied on assignment', '"Meera", because both references point at one object', 'A compiler error', 'null, because b replaced a'],
          answerIndex: 1,
          explanation: 'Assignment copies the reference value, so a and b alias the same heap object; a mutation through either is visible through both.',
        },
        {
          question: 'Which statement about `new` is correct?',
          options: ['The constructor allocates the object', 'Fields are zeroed after the constructor body runs', 'Allocation happens before the constructor is invoked', 'new only creates a reference, never memory'],
          answerIndex: 2,
          explanation: 'The JVM allocates and zeroes the instance, installs the header, and only then invokes the constructor.',
        },
      ],
    },
    {
      slug: 'constructors',
      title: 'Constructors, Chaining & this',
      order: 2,
      summary: 'How objects get initialized: constructor rules, overloading, this(...) and super(...) chaining, and the exact initialization order.',
      level: 'beginner',
      subtopics: [
        {
          id: 'constructor-rules',
          title: 'Constructor rules',
          body: `A constructor has the exact name of its class and **no return type** — not even \`void\`. Adding a return type turns it into an ordinary method, so \`void Student()\` will not be called by \`new\`.\n\nConstructors are invoked by \`new\`, by \`this(...)\` in another constructor of the same class, or by \`super(...)\` from a subclass. They are not inherited: \`class GradStudent extends Student\` does not inherit \`Student(String, int)\`, so the subclass must declare constructors and delegate explicitly.\n\nA constructor may be \`private\` (singletons, factories, utility classes), \`protected\` (subclass construction), or public. It cannot be \`static\`, \`final\`, \`abstract\`, or \`synchronized\`. Constructors are never part of the override mechanism, so \`@Override\` on one is a compile error.`,
        },
        {
          id: 'default-vs-no-arg',
          title: 'Default constructor versus no-arg constructor',
          body: `If a class declares **no constructor at all**, the compiler inserts a default constructor with the same access as the class. It takes no arguments and simply calls \`super()\`. Declaring any constructor — even a parameterized one — removes that implicit constructor.\n\n"The default constructor initializes fields" is imprecise. The JVM zeroes fields during allocation before any constructor runs; the default constructor contributes no field assignments. Explicit initializers such as \`int count = 5;\` are compiled into every constructor, after the superclass call.\n\nIf a superclass lacks an accessible no-arg constructor, a subclass with no explicit constructor fails to compile because the implicit \`super()\` cannot resolve. Always provide a no-arg constructor when a class is meant to be extended or instantiated reflectively.`,
        },
        {
          id: 'constructor-overloading',
          title: 'Overloading and ambiguity',
          body: `Overloaded constructors differ in parameter count, types, or order. \`Account()\`, \`Account(String owner)\`, and \`Account(String owner, long balance)\` are distinct signatures. Return type is irrelevant because constructors have none.\n\nResolution happens at compile time using the static argument types. Passing \`null\` can be ambiguous when two constructors accept unrelated reference types; passing an \`int\` may widen to \`long\` or box to \`Integer\`, and the compiler prefers widening primitive conversion over boxing. A \`varargs\` overload is considered last, which reduces surprise.\n\nKeep overloads semantically consistent. Two constructors that interpret the same numeric argument in different units are a maintenance trap; use named factories instead when the meaning is not obvious from the type.`,
        },
        {
          id: 'this-chaining',
          title: 'this(...) chaining',
          body: `\`this(...)\` calls another constructor of the same class. It must be the **first statement** in the constructor body, because the JVM must establish a fully initialized object exactly once. A chain eventually reaches a constructor that calls \`super(...)\`.\n\nChaining centralizes validation: a no-arg constructor can delegate to the full constructor with defaults, so invariants are checked in one place. It also avoids duplicating field assignments.\n\nRules matter: you cannot have both \`this(...)\` and \`super(...)\` in the same constructor, and a cycle such as \`A() { this(1); } A(int x) { this(); }\` is a compile-time error. \`this(...)\` is not the same as the \`this\` reference; it is a constructor invocation and has no value.`,
        },
        {
          id: 'initialization-order',
          title: 'The full initialization order',
          body: `Creating a \`new Child()\` runs, in order: static initialization of the superclass hierarchy (once per class), then static initialization of the child; allocation and zeroing of the child; the superclass's instance field initializers and instance blocks; the superclass constructor body; the child's instance field initializers and instance blocks; the child constructor body.\n\nStatic initialization happens on first active use, not on every object creation. Instance initializers are copied into every constructor after the super call, which is why they run before the constructor body but after the parent constructor.\n\nA dangerous consequence: a superclass constructor that calls an overridable method dispatches to the subclass before the subclass fields have been initialized. The subclass override may see \`0\` or \`null\`. Avoid calling overridable methods from constructors.`,
        },
        {
          id: 'copy-constructors-and-factories',
          title: 'Copy constructors and static factories',
          body: `A copy constructor takes an instance of the same type: \`Account(Account other)\`. It is ordinary Java, not a language feature, but it gives you control that \`clone()\` lacks: deep copies, validation, and no checked exception. For mutable nested objects, copy them explicitly rather than sharing references.\n\nStatic factories (\`Account.of(...)\`, \`List.of(...)\`) separate object creation from the constructor name and can cache, return subtypes, or validate before allocation. They also allow a class to expose creation without exposing a public constructor.\n\nRecords generate a canonical constructor and accessors but no copy constructor; add a compact constructor for validation and pass mutable components through defensive copies. Choose one creation style per type so callers are not guessing.`,
        },
      ],
      javaCode: [
        {
          title: 'Overloading with this(...) chaining',
          description: 'One validating constructor, two convenience entry points, no duplicated assignment logic.',
          code: `public class Account {
    private final String owner;
    private long balanceInPaise;

    public Account(String owner, long openingBalanceInPaise) {
        if (owner == null || owner.isBlank()) {
            throw new IllegalArgumentException("Owner is required");
        }
        if (openingBalanceInPaise < 0) {
            throw new IllegalArgumentException("Opening balance cannot be negative");
        }
        this.owner = owner;
        this.balanceInPaise = openingBalanceInPaise;
    }

    public Account(String owner) {
        this(owner, 0L); // must be the first statement
    }

    public Account() {
        this("anonymous");
    }

    public void deposit(long amountInPaise) {
        if (amountInPaise <= 0) throw new IllegalArgumentException("Positive amount required");
        balanceInPaise += amountInPaise;
    }

    public static void main(String[] args) {
        Account a = new Account("Asha", 5000);
        Account b = new Account("Ravi");
        a.deposit(250);
        System.out.println(a.balanceInPaise + " " + b.balanceInPaise);
    }
}`,
        },
        {
          title: 'Initialization order across a hierarchy',
          description: 'Static blocks run once, then parent instance initialization, then child initialization.',
          code: `class Parent {
    static { System.out.println("1 parent static"); }
    { System.out.println("3 parent instance block"); }
    Parent() { System.out.println("4 parent constructor"); }
}

class Child extends Parent {
    static { System.out.println("2 child static"); }
    { System.out.println("5 child instance block"); }
    Child() {
        super(); // implicit if omitted
        System.out.println("6 child constructor");
    }
}

public class InitOrder {
    public static void main(String[] args) {
        System.out.println("creating first");
        new Child();
        System.out.println("creating second");
        new Child(); // static output does not repeat
    }
}`,
        },
        {
          title: 'Copy constructor with defensive copying',
          description: 'A copy constructor can go deeper than Object.clone and never shares mutable tags.',
          code: `import java.util.ArrayList;
import java.util.List;

public class Playlist {
    private final String name;
    private final List<String> tracks;

    public Playlist(String name, List<String> tracks) {
        this.name = name;
        this.tracks = new ArrayList<>(tracks);
    }

    public Playlist(Playlist other) {
        this(other.name, other.tracks); // ArrayList copy inside the main constructor
    }

    public List<String> tracks() {
        return List.copyOf(tracks);
    }

    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("A", "B"));
        Playlist original = new Playlist("Mix", source);
        source.add("C"); // does not affect original

        Playlist copy = new Playlist(original);
        copy.tracks(); // immutable snapshot
        System.out.println(original.tracks()); // [A, B]
    }
}`,
        },
      ],
      keyTakeaways: [
        'Constructors share the class name, have no return type, and are never inherited or overridden.',
        'The implicit default constructor exists only when no constructor is declared.',
        'this(...) must be the first statement and eventually reaches super(...).',
        'Static initialization runs once; instance initialization runs per object after the parent constructor.',
        'Calling an overridable method from a constructor can expose not-yet-initialized subclass state.',
      ],
      interviewTips: [
        'Recite initialization order with a concrete parent/child example; interviewers use it to test JVM knowledge.',
        'Explain why constructors cannot be inherited: they initialize a specific class, and the subclass may need different invariants.',
        'Mention copy constructors and static factories as safer alternatives to clone().',
      ],
      pitfalls: [
        'Writing void before a constructor name and accidentally declaring a method.',
        'Believing the default constructor assigns non-zero defaults.',
        'Forgetting that adding any constructor removes the implicit no-arg one.',
        'Putting this(...) after another statement, which fails to compile.',
        'Publishing this from a constructor, letting other code observe a partially built object.',
      ],
      quiz: [
        {
          question: 'Which is legal in a constructor body?',
          options: ['this(...) anywhere in the body', 'Both this(...) and super(...) in one constructor', 'this(...) as the first statement', 'return this;'],
          answerIndex: 2,
          explanation: 'Constructor chaining must be the first statement, and a constructor may delegate with either this(...) or super(...), never both.',
        },
        {
          question: 'When is the implicit default constructor generated?',
          options: ['Always', 'Only when the class declares no constructor', 'Only for public classes', 'Only when all fields are private'],
          answerIndex: 1,
          explanation: 'Declaring any constructor suppresses the default constructor; the compiler adds one only for a class with no declared constructor.',
        },
      ],
    },
    {
      slug: 'object-memory-and-copy-semantics',
      title: 'Object Memory, Call by Value & Copy Semantics',
      order: 3,
      summary: 'Inside an object: header, fields, padding, reference passing, and the difference between shallow and deep copies.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'object-header-layout',
          title: 'Object header and layout',
          body: `Every heap object starts with a **header**. The first word is the mark word: identity hash, GC age, and lock state. The second is a pointer to the class metadata (\`klass\`). With compressed class pointers the header is usually 12 bytes; without them it is 16. Arrays add a 4-byte length field, making a typical array header 16 bytes.\n\nInstance fields follow, ordered by the JVM to satisfy alignment (often grouped by size). The JVM inserts **padding** so the total size is a multiple of 8 bytes. A class with one \`int\` may occupy 16 bytes: 12 header + 4 data, already aligned. A class with one \`long\` needs 12 + 4 padding + 8, or 24 bytes depending on field packing.\n\nThe layout is not specified by the Java Language Specification and can change with JVM flags, compressed oops, and field reordering. Do not compute sizes by hand for correctness; use them only to reason about memory pressure.`,
        },
        {
          id: 'references-are-values',
          title: 'A reference is a value',
          body: `A reference variable stores an address-like value that lets the JVM reach an object. It is not the object, and it is not an alias in the C++ sense. Assigning \`b = a\` copies that value, so both variables independently point at the same heap object.\n\nReference width is typically 4 bytes with compressed oops (heap below 32 GB) or 8 bytes otherwise. This is why large heaps can suddenly increase memory use when compressed oops are disabled. The reference lives in a stack frame, an object field, a static field, or an array element.\n\nReassigning a reference changes only that storage location. The old object remains untouched and may still be reachable elsewhere. Reference copying is cheap and constant-time; copying the object is a separate, usually explicit operation.`,
        },
        {
          id: 'call-by-value',
          title: 'Java is call by value, always',
          body: `Java passes every argument by value. For a primitive, the value is the number or boolean. For an object, the value is a copy of the reference. There is no call-by-reference in Java, despite the common phrase "objects are passed by reference."\n\nInside the method, mutating the referenced object is visible to the caller because both references reach the same heap object. Reassigning the parameter to a new object is not visible, because the parameter is a separate local slot.\n\nThis distinction explains many APIs: a method can fill a caller-provided array or collection, but it cannot replace the caller's variable with a different array. If you need to return a new object, return it explicitly. If a method must not mutate its argument, document that and defensively copy.`,
        },
        {
          id: 'shallow-copy',
          title: 'Shallow copy',
          body: `A **shallow copy** duplicates the outer object but copies reference fields verbatim. The copy points at the same nested objects as the original. \`Object.clone()\` is shallow by default, and so is a copy constructor that assigns \`this.address = other.address\`.\n\nShallow copying is correct when nested objects are immutable (for example \`String\`, boxed primitives, or immutable value objects). It is wrong when callers can mutate the shared nested state, because a change through one copy appears in the other.\n\nShallow copies are cheap and often sufficient. The design question is ownership: if both objects are allowed to observe the same immutable dependency, sharing is fine. If either can mutate it independently, you need a deep copy or a redesign that makes the nested value immutable.`,
        },
        {
          id: 'deep-copy',
          title: 'Deep copy',
          body: `A **deep copy** recursively duplicates the object graph: nested mutable objects, arrays, and collections are copied too. A copy constructor can implement it explicitly, which keeps the logic readable and type-safe.\n\nDeep copying has sharp edges. Cycles require an identity map from original to copy or you recurse forever. Shared substructure is duplicated unless you preserve it deliberately. Very deep graphs can overflow the stack. And some objects (sockets, file handles, locks) cannot or should not be cloned at all.\n\nPrefer immutability to deep copying: if nested values cannot change, a shallow copy is safe and much cheaper. When deep copying is necessary, centralize it in one copy constructor or factory so every field is handled consistently.`,
        },
        {
          id: 'clone-and-copy-strategies',
          title: 'clone() and better copy strategies',
          body: `\`Object.clone()\` performs a field-by-field shallow copy, but only if the class implements the marker interface \`Cloneable\`; otherwise it throws \`CloneNotSupportedException\`. It returns \`Object\`, requires a cast, bypasses constructors, and is easy to get wrong with final fields and inheritance.\n\nCopy constructors are the clearest alternative: \`new Order(other)\` states the type, can deep-copy selected fields, validates invariants, and works with \`final\` fields. Static copy factories (\`Order.copyOf(other)\`) read well and can return an existing instance for immutable types.\n\nFor serialization-based deep copies, remember the cost, the requirement that every class be \`Serializable\`, and the security concerns around deserializing untrusted data. Use it as a last resort, not a default.`,
        },
      ],
      javaCode: [
        {
          title: 'Pass-by-value in four experiments',
          description: 'Primitives, fields, arrays, and reassignment show exactly what is copied.',
          code: `class Box {
    int value;
    Box(int value) { this.value = value; }
}

public class PassByValue {
    static void changePrimitive(int x) { x = 99; }

    static void changeField(Box box) { box.value = 99; }

    static void reassign(Box box) { box = new Box(99); }

    static void changeArray(int[] data) { data[0] = 99; }

    public static void main(String[] args) {
        int number = 1;
        changePrimitive(number);
        System.out.println(number); // 1

        Box box = new Box(1);
        changeField(box);
        System.out.println(box.value); // 99

        reassign(box);
        System.out.println(box.value); // 99, caller reference unchanged

        int[] values = {1, 2};
        changeArray(values);
        System.out.println(values[0]); // 99
    }
}`,
        },
        {
          title: 'Shallow versus deep copy',
          description: 'The same copy constructor can share or duplicate a mutable Address; only the deep path is independent.',
          code: `import java.util.ArrayList;
import java.util.List;

class Address {
    private String city;
    Address(String city) { this.city = city; }
    void setCity(String city) { this.city = city; }
    String city() { return city; }
}

final class Customer {
    private final String name;
    private final Address address;
    private final List<String> tags;

    Customer(String name, Address address, List<String> tags) {
        this.name = name;
        this.address = address;
        this.tags = new ArrayList<>(tags); // always copy the list
    }

    Customer(Customer other, boolean deep) {
        this.name = other.name;
        this.address = deep ? new Address(other.address.city()) : other.address;
        this.tags = new ArrayList<>(other.tags);
    }

    Address address() { return address; } // leaks a mutable reference on purpose
    List<String> tags() { return List.copyOf(tags); }
}

public class CopySemantics {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("vip"));
        Customer original = new Customer("Asha", new Address("Pune"), source);
        source.add("fraud"); // original is unaffected

        Customer shallow = new Customer(original, false);
        Customer deep = new Customer(original, true);

        original.address().setCity("Mumbai");
        System.out.println(shallow.address().city()); // Mumbai
        System.out.println(deep.address().city());    // Pune
    }
}`,
        },
        {
          title: 'A copy constructor instead of clone()',
          description: 'Explicit copying handles final fields, mutable components, and validation without Cloneable.',
          code: `import java.util.ArrayList;
import java.util.List;

public final class Invoice {
    private final String number;
    private final List<Long> lineItems;

    public Invoice(String number, List<Long> lineItems) {
        if (number == null || number.isBlank()) {
            throw new IllegalArgumentException("Invoice number required");
        }
        this.number = number;
        this.lineItems = new ArrayList<>(lineItems);
    }

    public Invoice(Invoice other) {
        this(other.number, other.lineItems);
    }

    public Invoice withLineItem(long amountInPaise) {
        List<Long> next = new ArrayList<>(lineItems);
        next.add(amountInPaise);
        return new Invoice(number, next); // copy-on-write style
    }

    public List<Long> lineItems() {
        return List.copyOf(lineItems);
    }

    public static void main(String[] args) {
        Invoice first = new Invoice("INV-1", List.of(100L, 250L));
        Invoice second = first.withLineItem(400L);
        System.out.println(first.lineItems());  // [100, 250]
        System.out.println(second.lineItems()); // [100, 250, 400]
    }
}`,
        },
      ],
      keyTakeaways: [
        'An object header holds mark word and class pointer; fields follow and padding aligns the total to 8 bytes.',
        'Reference variables store values that point at heap objects; assignment copies the reference.',
        'Java is always pass-by-value, including when the value is a reference.',
        'A shallow copy shares nested mutable objects; a deep copy duplicates the reachable graph.',
        'Copy constructors are usually clearer and safer than Cloneable and clone().',
      ],
      interviewTips: [
        'For pass-by-value questions, draw two stack slots pointing at one heap box, then erase one arrow on reassignment.',
        'State the object layout caveat: header sizes are implementation details, not language guarantees.',
        'Contrast shallow and deep copies using an immutable nested value — it justifies shallow copying.',
      ],
      pitfalls: [
        'Saying Java passes objects by reference; it passes a copy of the reference.',
        'Using clone() without implementing Cloneable and expecting it to work.',
        'Writing a deep copy that ignores cycles and overflows the stack.',
        'Forgetting to copy collection fields, then leaking internal state through accessors.',
        'Assuming total object size equals the sum of field sizes.',
      ],
      quiz: [
        {
          question: 'A method reassigns its `List<String>` parameter to a new list. What does the caller see?',
          options: ['The new list', 'The original list, unchanged', 'A compile error', 'Null'],
          answerIndex: 1,
          explanation: 'The parameter is a copy of the reference. Reassigning it only changes the local slot, not the caller’s variable.',
        },
        {
          question: 'Which copy lets you mutate a nested Address through one Customer without affecting the other?',
          options: ['A shallow copy', 'A deep copy', 'An alias', 'A static reference'],
          answerIndex: 1,
          explanation: 'Only a deep copy creates an independent Address; a shallow copy shares the nested object.',
        },
      ],
    },
    {
      slug: 'static-and-final',
      title: 'static & final Deep Dive',
      order: 4,
      summary: 'Class-level state, initialization order, and the many meanings of final — from blank finals to non-extensible classes.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'static-fields',
          title: 'Static fields belong to the class',
          body: `A \`static\` field is allocated once per class, not once per instance. Every object shares the same storage, so \`Counter.created++\` in a constructor updates one class-level counter. Instance fields describe per-object state; static fields describe class-wide state.\n\nStatic storage is associated with the loaded class rather than with any instance. In HotSpot, class metadata lives in metaspace while the \`Class\` mirror and its static field storage are managed by the JVM; the important semantic point is that no object owns the field.\n\nShared mutable statics are global state. They create hidden coupling and race conditions, and they survive far longer than any single request. Prefer constants, immutable statics, or explicitly scoped objects. When a mutable static is unavoidable, guard it with synchronization or use an atomic type and document the lifetime.`,
        },
        {
          id: 'static-methods',
          title: 'Static methods and what they cannot see',
          body: `A static method is invoked on the class: \`Math.max(1, 2)\`. It has no receiver, so it cannot use \`this\` or \`super\`, and it cannot directly read or write instance fields or call instance methods. It can access static members and its own parameters.\n\nStatic methods are **hidden**, not overridden. If a subclass declares a method with the same signature, the version chosen depends on the compile-time reference type, not the runtime object. That is why static methods do not participate in polymorphism.\n\nThey are appropriate for pure utilities, factories, and operations that need no object state. They are a poor fit for behavior that belongs to an instance and needs to be replaced in a subclass. \`main\` is static only because the JVM must call it before any object exists.`,
        },
        {
          id: 'static-blocks-and-init-order',
          title: 'Static blocks and class initialization',
          body: `A static initialization block runs exactly once, when the class is initialized. The JVM triggers initialization on first active use: \`new\`, reading or writing a non-constant static field, invoking a static method, or reflective access. Initializing a subclass first initializes its superclass.\n\nWithin a class, static field initializers and static blocks execute in **textual order**, top to bottom. A forward reference in an initializer can therefore observe a default value; \`static int a = b; static int b = 2;\` leaves \`a\` as \`0\`. A static block that throws propagates \`ExceptionInInitializerError\`, and the class is left erroneous.\n\nConstant variables (\`static final\` primitives or Strings with constant initializers) are compile-time constants and may not trigger initialization when read, because their values are inlined.`,
        },
        {
          id: 'final-variables',
          title: 'final variables and definite assignment',
          body: `A \`final\` variable can be assigned **exactly once**. For fields, assignment may happen in a field initializer, an instance initializer, or every constructor — a *blank final*. For locals and parameters, it must be assigned before use and never reassigned.\n\n\`final\` on a reference freezes the reference, not the object. \`final List<String> names = new ArrayList<>();\` still allows \`names.add("A")\`; only \`names = anotherList\` is forbidden. Immutability requires final fields plus no mutation paths plus defensive copying.\n\nFinal fields have a safe-publication guarantee: a correctly constructed object's final fields are visible to other threads even without synchronization. Non-final fields are not. This is one reason immutable value objects are easier to share than mutable ones.`,
        },
        {
          id: 'final-methods-and-classes',
          title: 'final methods and final classes',
          body: `A \`final\` method cannot be overridden; a \`final\` class cannot be extended. \`String\`, \`Integer\`, and other value classes are final so their invariants cannot be broken by a subclass. A final method protects a specific behavior while still allowing the class to be extended.\n\nPrivate, static, and (implicitly) final methods do not participate in overriding anyway. Marking a method final documents intent and can help the JIT devirtualize calls, though modern JITs often devirtualize based on profiling regardless.\n\nUse final classes for value types and security-sensitive types. Use final methods for template-method hooks that must not change. Avoid making everything final by reflex: it can limit testing seams and legitimate extension. Prefer composition when extension is not designed for.`,
        },
        {
          id: 'constants',
          title: 'Constants and compile-time inlining',
          body: `A **constant variable** is a \`static final\` field of primitive or \`String\` type initialized with a constant expression. The compiler inlines its value at every use site; the consuming class does not need to load the declaring class at runtime for that value.\n\nInlining creates a classic build hazard. If \`Limits.MAX\` changes from 10 to 20 and only the declaring class is recompiled, classes compiled against the old value still contain 10. Rebuild all dependents, or avoid public compile-time constants for values that may evolve.\n\n\`static final\` references to objects are **not** constant variables. \`static final List<String> CODES = List.of(...)\` is a single shared reference to an immutable list; it is inlined only as a field reference, not as the list contents. Interfaces should not be used as constant buckets; a final class with a private constructor is clearer.`,
        },
      ],
      javaCode: [
        {
          title: 'Static state, static methods, and initialization order',
          description: 'One shared counter, a static factory, and a static block that runs before any constructor.',
          code: `public class Counter {
    private static final int START;
    private static int created;

    static {
        START = 100;
        System.out.println("class initialized");
    }

    private final int id;

    public Counter() {
        id = START + created;
        created++;
    }

    public int id() { return id; }

    public static int createdCount() { return created; }

    public static void main(String[] args) {
        System.out.println(Counter.createdCount()); // 0, triggers initialization
        Counter a = new Counter();
        Counter b = new Counter();
        System.out.println(a.id() + " " + b.id());  // 100 101
        System.out.println(Counter.createdCount()); // 2
    }
}`,
        },
        {
          title: 'Final references versus immutable objects',
          description: 'A final reference cannot be rebound, but the referenced list remains mutable.',
          code: `import java.util.ArrayList;
import java.util.List;

public class FinalReference {
    private final List<String> names = new ArrayList<>();
    private final String label;

    public FinalReference(String label) {
        this.label = label; // blank final assigned once
    }

    public void addName(String name) {
        names.add(name);    // legal: the object is mutable
        // names = new ArrayList<>(); // compile error: cannot reassign final
    }

    public List<String> names() {
        return List.copyOf(names); // protect the internal list
    }

    public static void main(String[] args) {
        FinalReference ref = new FinalReference("team");
        ref.addName("Asha");
        System.out.println(ref.names()); // [Asha]
        System.out.println(ref.label);
    }
}`,
        },
        {
          title: 'A final class with a constant and a guarded invariant',
          description: 'Preventing subclassing keeps the temperature invariant intact for every instance.',
          code: `public final class Temperature {
    public static final double ABSOLUTE_ZERO_C = -273.15;

    private final double celsius;

    public Temperature(double celsius) {
        if (celsius < ABSOLUTE_ZERO_C) {
            throw new IllegalArgumentException("Below absolute zero");
        }
        this.celsius = celsius;
    }

    public double celsius() { return celsius; }

    public Temperature warmerBy(double delta) {
        return new Temperature(celsius + delta);
    }

    public static void main(String[] args) {
        Temperature t = new Temperature(20);
        System.out.println(t.warmerBy(5).celsius()); // 25.0
        System.out.println(Temperature.ABSOLUTE_ZERO_C);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Static fields are class-level storage shared by all instances; static methods have no this or super.',
        'Class initialization happens once, in textual order, on first active use.',
        'final freezes a variable’s assignment, not the object it references.',
        'Final methods cannot be overridden; final classes cannot be extended.',
        'Constant variables are inlined at compile time, which can cause stale values without a full rebuild.',
      ],
      interviewTips: [
        'Explain static hiding versus instance overriding with a reference-type example.',
        'Mention safe publication of final fields when discussing thread safety.',
        'Bring up the compile-time constant inlining trap when asked about static final.',
      ],
      pitfalls: [
        'Assuming a static method can be overridden polymorphically.',
        'Reading a static field through an instance reference and thinking it is per-instance.',
        'Believing final on a list makes the list immutable.',
        'Relying on a forward static reference that is still at its default value.',
        'Forgetting that a thrown static initializer leaves the class unusable.',
      ],
      quiz: [
        {
          question: 'What does `final int[] data = {1, 2};` prevent?',
          options: ['Changing data[0]', 'Reassigning data to another array', 'Passing data to a method', 'Reading data.length'],
          answerIndex: 1,
          explanation: 'final freezes the reference; the array contents remain mutable.',
        },
        {
          question: 'Which call triggers class initialization?',
          options: ['Reading a compile-time constant', 'Creating the first instance with new', 'Declaring a reference variable', 'Importing the class'],
          answerIndex: 1,
          explanation: 'new is an active use. Reading an inlined constant variable may not initialize the class at all.',
        },
      ],
    },
    {
      slug: 'encapsulation-inheritance-packages',
      title: 'Encapsulation, Inheritance & Packages',
      order: 5,
      summary: 'Protecting invariants with access control, organizing types into packages, and extending classes without inheriting their problems.',
      level: 'beginner',
      subtopics: [
        {
          id: 'encapsulation',
          title: 'Encapsulation protects invariants',
          body: `**Encapsulation** means bundling state with the behavior that guards it and hiding the state behind a controlled interface. A \`BankAccount\` keeps \`balance\` private and exposes \`deposit\` and \`withdraw\`, so every mutation passes through validation.\n\nThe goal is not getters and setters for every field. A setter that assigns any value re-exposes the field with extra steps. Expose operations that preserve invariants: \`withdraw(amount)\` can reject overdrafts, while \`setBalance(amount)\` cannot know the business rule.\n\nEncapsulation also limits the blast radius of change. If callers cannot touch internals, you can replace a data structure or add caching without breaking them. Package boundaries extend the same idea to groups of classes, and module boundaries extend it further.`,
        },
        {
          id: 'access-modifiers',
          title: 'Access modifiers',
          body: `Java has four access levels. \`private\` is class-only. Package-private (no modifier) is visible to the whole package. \`protected\` adds subclass access. \`public\` is visible everywhere.\n\nThe table is easy; \`protected\` is subtle. In another package, a subclass can access a protected member only through a reference whose type is that subclass (or a subtype), not through an arbitrary superclass reference. This rule stops a subclass from reaching protected state of unrelated sibling objects.\n\n| Modifier | Same class | Same package | Subclass elsewhere | Everywhere |\n| --- | --- | --- | --- | --- |\n| private | yes | no | no | no |\n| package-private | yes | yes | no | no |\n| protected | yes | yes | yes, with subtype reference | no |\n| public | yes | yes | yes | yes |\n\nStart with the narrowest access that works and widen only when a real caller needs it.`,
        },
        {
          id: 'packages',
          title: 'Packages and namespaces',
          body: `A package groups related types and creates a namespace, so \`com.acme.billing.Invoice\` and \`com.acme.shipping.Invoice\` can coexist. The package declaration must match the directory structure for conventional builds, and the fully qualified name is what the compiler and JVM use.\n\nPackages also define the package-private boundary: classes in the same package can collaborate closely without exposing those details publicly. Organize by feature or domain, not by technical layer alone; a package should have a coherent reason to change.\n\nAvoid cyclic package dependencies, which make builds and reasoning harder. Prefer importing specific types over wildcard imports in production code. On the module path, \`module-info.java\` can export only selected packages, giving a stronger boundary than the classpath.`,
        },
        {
          id: 'inheritance-is-a',
          title: 'Inheritance models an is-a relationship',
          body: `\`class SavingsAccount extends Account\` declares that a savings account **is an** account. It inherits accessible fields and methods, and it can add members or override behavior. Java permits single class inheritance; a class has exactly one direct superclass, and every class ultimately extends \`Object\`.\n\nConstructors are not inherited. The subclass must call an accessible superclass constructor, implicitly via \`super()\` or explicitly with arguments. Private members exist in the superclass part of the object but are not directly accessible; they still occupy memory and are initialized.\n\nInheritance is not a code-sharing default. If the relationship is really has-a, composition is usually safer. Inheritance couples the subclass to the superclass implementation and exposes it to the fragile base class problem: a change in the parent can break children even when the public contract seems unchanged.`,
        },
        {
          id: 'super-and-overriding',
          title: 'super, overriding, and visibility',
          body: `\`super.method()\` invokes the superclass implementation from an override; \`super(...)\` invokes a superclass constructor and must be the first statement. \`super\` is not a reference you can store; it is a way to select the parent's version of a member.\n\nAn override must have a compatible signature, cannot reduce visibility, cannot throw broader checked exceptions, and may return a covariant subtype. \`@Override\` asks the compiler to verify that an override actually exists, catching signature typos.\n\nFields are hidden, not overridden. Accessing \`parent.field\` vs \`child.field\` depends on the reference type, while an overridden method depends on the runtime object. This asymmetry surprises people; keep fields private and use methods to expose behavior.`,
        },
        {
          id: 'composition-over-inheritance',
          title: 'Composition over inheritance',
          body: `Composition builds a class from collaborators: \`Car\` has an \`Engine\`, rather than extending one. The wrapper delegates explicitly, so it controls which operations are exposed and can change the implementation without affecting its own type hierarchy.\n\nInheritance is appropriate when the subtype genuinely satisfies the supertype contract and the superclass was designed for extension. It is a poor fit for reusing a few methods from an unrelated class, or when the parent's internals may change.\n\nA practical test: if you cannot substitute the subclass anywhere the parent is expected without surprising behavior, the is-a claim is false. Prefer composition for behavior reuse, and use interfaces to keep the type flexible. This also avoids deep hierarchies where a method's behavior is spread across five levels.`,
        },
      ],
      javaCode: [
        {
          title: 'Encapsulation with guarded operations',
          description: 'Private state, one invariant, and no setBalance escape hatch.',
          code: `public class BankAccount {
    private final String number;
    private long balanceInPaise;

    public BankAccount(String number, long openingBalanceInPaise) {
        if (openingBalanceInPaise < 0) throw new IllegalArgumentException("negative opening balance");
        this.number = number;
        this.balanceInPaise = openingBalanceInPaise;
    }

    public void deposit(long amountInPaise) {
        if (amountInPaise <= 0) throw new IllegalArgumentException("deposit must be positive");
        balanceInPaise += amountInPaise;
    }

    public void withdraw(long amountInPaise) {
        if (amountInPaise <= 0) throw new IllegalArgumentException("withdrawal must be positive");
        if (amountInPaise > balanceInPaise) throw new IllegalStateException("insufficient funds");
        balanceInPaise -= amountInPaise;
    }

    public long balanceInPaise() { return balanceInPaise; }

    public static void main(String[] args) {
        BankAccount account = new BankAccount("A-1", 10_000);
        account.withdraw(2_500);
        account.deposit(500);
        System.out.println(account.balanceInPaise()); // 8000
    }
}`,
        },
        {
          title: 'Inheritance with super and a covariant override',
          description: 'A subclass reuses state, delegates construction, and specializes behavior without breaking the contract.',
          code: `class Shape {
    protected final String name;

    Shape(String name) { this.name = name; }

    public double area() { return 0.0; }

    public String describe() {
        return name + " with area " + area();
    }
}

class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        super("circle");
        if (radius <= 0) throw new IllegalArgumentException("radius must be positive");
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class ShapeDemo {
    public static void main(String[] args) {
        Shape shape = new Circle(2);
        System.out.println(shape.describe()); // dynamic dispatch to Circle.area()
    }
}`,
        },
        {
          title: 'Composition instead of an is-a stretch',
          description: 'A car delegates to an engine; it does not become an engine to reuse start().',
          code: `final class Engine {
    void start() { System.out.println("engine started"); }
}

final class Car {
    private final Engine engine = new Engine();
    private final String model;

    Car(String model) { this.model = model; }

    void start() {
        engine.start(); // delegation, not inheritance
        System.out.println(model + " ready");
    }
}

public class CompositionDemo {
    public static void main(String[] args) {
        new Car("Model S").start();
    }
}`,
        },
      ],
      keyTakeaways: [
        'Encapsulation hides state and exposes operations that preserve invariants — not automatic getters and setters.',
        'Access levels run from private to package-private to protected to public; protected is package plus subclass access.',
        'A package provides a namespace and a package-private collaboration boundary.',
        'Java supports single class inheritance; constructors are not inherited.',
        'Prefer composition unless the subtype truly satisfies the supertype contract.',
      ],
      interviewTips: [
        'Define encapsulation by invariant protection, then give an example of a setter that defeats it.',
        'Explain the protected access rule for subclasses in another package.',
        'Use the fragile base class problem to justify composition over inheritance.',
      ],
      pitfalls: [
        'Generating public setters for every field and calling it encapsulation.',
        'Assuming protected means accessible through any superclass reference from a subclass.',
        'Thinking a subclass inherits constructors.',
        'Overriding a method and reducing its visibility, which fails to compile.',
        'Building deep inheritance trees for incidental code reuse.',
      ],
      quiz: [
        {
          question: 'Which modifier allows access from a subclass in a different package but not from unrelated classes there?',
          options: ['private', 'package-private', 'protected', 'public'],
          answerIndex: 2,
          explanation: 'protected grants package access plus subclass access, subject to the subtype-reference rule.',
        },
        {
          question: 'Why is composition often safer than inheritance?',
          options: ['It uses less memory', 'It avoids coupling to the superclass implementation', 'It allows multiple class inheritance', 'It makes methods final'],
          answerIndex: 1,
          explanation: 'Delegation hides the collaborator’s implementation and avoids fragile-base-class coupling.',
        },
      ],
    },
    {
      slug: 'abstraction-and-polymorphism',
      title: 'Abstraction & Polymorphism',
      order: 6,
      summary: 'Abstract classes, interface contracts, overloading versus overriding, and how the JVM chooses a method at runtime.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'abstraction',
          title: 'Abstraction exposes the what',
          body: `**Abstraction** presents the essential operations of a type while hiding how they are implemented. A \`PaymentProcessor\` exposes \`charge(amount)\`; callers do not need to know whether the implementation talks to a card network, a wallet, or an in-memory fake.\n\nGood abstraction reduces the number of things a caller must understand and the number of ways it can break. Leaky abstractions expose implementation details through their types or exceptions, forcing callers to depend on internals.\n\nAbstraction is not the same as using an interface. A concrete class with a small, coherent public API is also abstracted. The question is what the caller is allowed to know and depend on, not how many types are in the hierarchy.`,
        },
        {
          id: 'abstract-classes',
          title: 'Abstract classes',
          body: `An \`abstract\` class cannot be instantiated. It may declare abstract methods (no body) that subclasses must implement, and it may also contain fields, constructors, and concrete methods. It is a partial implementation and a type.\n\nBecause it can hold state and constructors, an abstract class is a good fit for a family of types sharing invariants and initialization. A \`Template\` class can define the algorithm skeleton in a final method and delegate variable steps to protected abstract hooks.\n\nA subclass must implement all abstract methods or itself be abstract. An abstract class can have a constructor, which runs when a concrete subclass is instantiated. It can also have no abstract methods at all, which prevents instantiation but is usually a weaker design signal.`,
        },
        {
          id: 'interfaces-as-contracts',
          title: 'Interfaces as capability contracts',
          body: `An interface declares a contract that unrelated classes can implement. A class can implement many interfaces, so interfaces model capabilities (\`Comparable\`, \`Runnable\`, \`AutoCloseable\`) without consuming the single superclass slot.\n\nInterface methods are implicitly public and abstract unless marked \`default\`, \`static\`, or \`private\`. Fields are implicitly \`public static final\`. Interfaces cannot hold instance state, so they cannot enforce invariants that require fields; they describe behavior.\n\nChoose an abstract class when subclasses must share state or a partial implementation. Choose an interface when multiple unrelated types need to satisfy the same contract, or when the type must remain flexible. Modern Java often combines both: an interface for the contract and a skeletal abstract class for convenience.`,
        },
        {
          id: 'overloading-vs-overriding',
          title: 'Overloading is compile-time, overriding is runtime',
          body: `**Overloading** uses the same method name with different parameter lists in one class or hierarchy. The compiler selects the most specific applicable signature based on static argument types. Return type alone cannot distinguish overloads.\n\n**Overriding** replaces a superclass method with the same signature in a subclass. The JVM selects the implementation from the runtime class of the receiver. Overriding requires compatible return types, no visibility reduction, and no broader checked exceptions.\n\nA classic trap: \`parent.process(shape)\` where the variable is declared \`Shape\` but holds a \`Circle\`. If \`process\` is overloaded for \`Shape\` and \`Circle\`, the \`Shape\` version runs because overload resolution happens at compile time. Overridden instance methods, by contrast, follow the object.`,
        },
        {
          id: 'dynamic-dispatch',
          title: 'Dynamic dispatch and vtables',
          body: `A call such as \`shape.area()\` compiles to an \`invokevirtual\` instruction with a symbolic reference. At runtime the JVM looks up the actual class of the receiver and selects the override. HotSpot implements this with per-class virtual method tables (vtables) and interface method tables (itables), plus inline caches that make repeated calls fast.\n\nThe lookup starts at the runtime class and walks up until it finds an implementation. Constructors run from the superclass down, but dispatch during construction already sees the subclass override — even before subclass fields are initialized. That is why constructors should not call overridable methods.\n\nStatic, private, and final methods are not dynamically dispatched. Static methods are hidden; private methods are not inherited; final methods cannot be overridden. These calls can be resolved more directly.`,
        },
        {
          id: 'binding-rules',
          title: 'What is and is not polymorphic',
          body: `Instance methods are polymorphic. Instance fields, static methods, and static fields are not: they are selected by the compile-time reference type. Given \`Parent p = new Child()\`, \`p.field\` reads the parent field, while \`p.overridden()\` runs the child method.\n\nThis asymmetry is why exposing mutable fields is risky. Two objects can report different values for the "same" field depending on how they are referenced. Keep fields private and expose methods, which restore consistent dynamic behavior.\n\nCasts do not change the object; they only change the static type the compiler sees. A cast to a class the object does not actually instantiate throws \`ClassCastException\` at runtime. Use \`instanceof\` pattern matching when the runtime type matters, rather than guessing.`,
        },
      ],
      javaCode: [
        {
          title: 'Abstract class with a template method',
          description: 'The base class fixes the algorithm; subclasses supply only the variable steps.',
          code: `abstract class Report {
    public final String render() {
        return header() + "\\n" + body() + "\\n" + footer();
    }

    protected abstract String header();
    protected abstract String body();

    protected String footer() {
        return "-- end --";
    }
}

final class SalesReport extends Report {
    @Override protected String header() { return "SALES"; }
    @Override protected String body() { return "total=4200"; }
}

public class TemplateDemo {
    public static void main(String[] args) {
        Report report = new SalesReport();
        System.out.println(report.render());
    }
}`,
        },
        {
          title: 'Dynamic dispatch through an interface',
          description: 'The reference type is the contract; the runtime object selects the implementation.',
          code: `interface PaymentProcessor {
    void charge(long amountInPaise);
}

final class CardProcessor implements PaymentProcessor {
    @Override public void charge(long amountInPaise) {
        System.out.println("card charged " + amountInPaise);
    }
}

final class WalletProcessor implements PaymentProcessor {
    @Override public void charge(long amountInPaise) {
        System.out.println("wallet charged " + amountInPaise);
    }
}

public class DispatchDemo {
    static void checkout(PaymentProcessor processor) {
        processor.charge(2500); // selected by the runtime object
    }

    public static void main(String[] args) {
        checkout(new CardProcessor());
        checkout(new WalletProcessor());
    }
}`,
        },
        {
          title: 'Overload selection versus override dispatch',
          description: 'The overload is chosen from the static type; the override is chosen from the runtime type.',
          code: `class Animal {
    void speak() { System.out.println("animal sound"); }
}

class Dog extends Animal {
    @Override void speak() { System.out.println("woof"); }
}

public class BindingDemo {
    static void handle(Animal animal) { System.out.println("animal overload"); }
    static void handle(Dog dog) { System.out.println("dog overload"); }

    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.speak();   // woof: override uses runtime type
        handle(animal);   // animal overload: chosen at compile time
        handle((Dog) animal); // dog overload after an explicit cast
    }
}`,
        },
      ],
      keyTakeaways: [
        'Abstraction is about exposing a stable contract and hiding implementation detail.',
        'Abstract classes can hold state and partial implementation; interfaces define capabilities.',
        'Overloading is resolved at compile time from static types; overriding is resolved at runtime.',
        'Dynamic dispatch uses the receiver’s actual class via vtables and inline caches.',
        'Fields and static methods are not polymorphic and bind to the reference type.',
      ],
      interviewTips: [
        'Explain why `Animal a = new Dog(); a.speak()` prints woof but an overloaded handle(Animal) is chosen for a.',
        'Compare abstract classes and interfaces on state, constructors, multiple inheritance of type, and evolution.',
        'Mention that constructors calling overridable methods expose uninitialized subclass state.',
      ],
      pitfalls: [
        'Expecting overload resolution to follow the runtime type of an argument.',
        'Trying to instantiate an abstract class.',
        'Reducing visibility or throwing broader checked exceptions in an override.',
        'Believing fields are overridden like methods.',
        'Using an interface with no coherent contract just to look polymorphic.',
      ],
      quiz: [
        {
          question: 'Which mechanism chooses an overridden method’s implementation?',
          options: ['The compile-time reference type', 'The runtime class of the receiver', 'The declared return type', 'The method’s access modifier'],
          answerIndex: 1,
          explanation: 'Overrides are dispatched dynamically based on the actual object; overloading uses static types.',
        },
        {
          question: 'Why can an abstract class have a constructor?',
          options: ['To instantiate itself directly', 'To initialize state for concrete subclasses', 'To make all methods final', 'Because interfaces require it'],
          answerIndex: 1,
          explanation: 'Abstract classes cannot be instantiated, but their constructors run as part of subclass construction.',
        },
      ],
    },
    {
      slug: 'autoboxing-pojos-and-public-classes',
      title: 'Autoboxing, POJOs & Public Classes',
      order: 7,
      summary: 'Wrapper caches, boxing costs, the rules for public source files, and how POJOs and records model data.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'wrapper-classes',
          title: 'Wrapper classes',
          body: `Every primitive has a wrapper: \`Integer\`, \`Long\`, \`Double\`, \`Character\`, \`Boolean\`, and so on. Wrappers are immutable reference types that let primitives participate in generics, collections, and APIs that require objects.\n\nWrappers also provide parsing and conversion: \`Integer.parseInt("42")\`, \`Integer.valueOf(42)\`, \`intValue()\`, and constants such as \`Integer.MAX_VALUE\`. They implement \`Comparable\` and define value-based \`equals\`, so two boxed \`42\`s compare equal even when they are distinct objects.\n\nWrappers add an object header and a reference indirection. An \`Integer\` is not an \`int\` with methods; it is a separate heap object (or a cached instance). Avoid wrappers in tight numeric loops and in hot data structures unless nullability or generics require them.`,
        },
        {
          id: 'autoboxing-and-unboxing',
          title: 'Autoboxing and unboxing',
          body: `**Autoboxing** is the compiler inserting \`Integer.valueOf(x)\` where an \`int\` is assigned to an \`Integer\`. **Unboxing** inserts \`integer.intValue()\` where an \`Integer\` is used as an \`int\`. This happens in assignments, method calls, returns, and arithmetic.\n\nUnboxing a \`null\` wrapper throws \`NullPointerException\`. A method returning \`Integer\` that returns \`null\` can blow up at the call site when the result is assigned to an \`int\`. Ternary expressions and compound assignments can introduce hidden unboxing that is easy to miss.\n\nBoxing also costs allocation and indirection. In a loop, \`Long sum = 0L; sum += i;\` boxes on every iteration. Use primitives for computation and box only at API boundaries or when nullability is meaningful.`,
        },
        {
          id: 'integer-cache',
          title: 'Integer cache and identity traps',
          body: `\`Integer.valueOf(int)\` returns cached instances for \`-128\` through \`127\` by default. \`Boolean\`, \`Byte\`, and \`Short\` cache their whole range; \`Character\` caches \`0\` through \`127\`. The upper \`Integer\` bound can be raised with \`-XX:AutoBoxCacheMax\`.\n\nAs a result, \`Integer a = 100; Integer b = 100; a == b\` is usually \`true\`, while \`Integer c = 1000; Integer d = 1000; c == d\` is usually \`false\`. Both comparisons are identity checks; only \`equals\` compares values. This is a classic interview trap and a real bug source.\n\nNever rely on cached identity. Use \`equals\` for wrapper values, or unbox to primitives. Autoboxing in a conditional can also mix reference identity with primitive comparison in surprising ways.`,
        },
        {
          id: 'pojo-rules',
          title: 'POJO rules',
          body: `A **POJO** (Plain Old Java Object) is a class with no framework-specific superclass or annotations required for its basic operation. The common shape is private fields, a public no-arg constructor, and getters/setters, which lets frameworks instantiate and populate it reflectively.\n\nA POJO is not automatically a good domain model. Exposing every field through setters produces an anemic object whose invariants live elsewhere. Use POJOs at boundaries (JSON, persistence) and richer behavior inside the domain when rules matter.\n\nJavaBeans conventions add naming rules (\`getX\`, \`isX\` for booleans), serialization, and event support. If you need value semantics, records are often a better fit than a mutable POJO because they generate the constructor, accessors, \`equals\`, \`hashCode\`, and \`toString\`.`,
        },
        {
          id: 'public-class-file-rule',
          title: 'One public top-level class per file',
          body: `A source file may contain many top-level classes, but at most one may be \`public\`, and its name must match the filename. \`public class Student\` must live in \`Student.java\`. Package-private classes can share the file.\n\nThe rule gives the compiler and class loader a predictable mapping from a public type to a file and a bytecode unit. It also keeps the public API of a compilation unit obvious. Nested classes are different: they are compiled to \`Outer$Inner.class\` and do not each need a source file.\n\nA file with no public class can have any name, but tooling and convention still favor a meaningful one. One public top-level type per file is the norm in real codebases, even though the language permits helper types alongside it.`,
        },
        {
          id: 'records-and-pojos',
          title: 'Records versus mutable POJOs',
          body: `A \`record\` is a concise carrier for immutable data. The compiler generates a canonical constructor, accessors named after the components, and value-based \`equals\`, \`hashCode\`, and \`toString\`. Records are implicitly final and cannot declare additional instance fields.\n\nA compact constructor lets you validate or normalize without repeating parameter assignments. A record with a mutable component (an array or list) is only shallowly immutable; copy mutable components in the constructor and on access.\n\nUse records for DTOs, events, query results, and small value objects. Use a class when you need mutable state, inheritance, or a JavaBeans-style no-arg constructor. Records are not a drop-in replacement for framework entities that require proxies or setters.`,
        },
      ],
      javaCode: [
        {
          title: 'Autoboxing, unboxing, and the cache',
          description: 'Small values share cached instances; large values do not; equals always compares values.',
          code: `public class BoxingDemo {
    public static void main(String[] args) {
        Integer smallA = 100;
        Integer smallB = 100;
        Integer largeA = 1000;
        Integer largeB = 1000;

        System.out.println(smallA == smallB);       // true (cache)
        System.out.println(largeA == largeB);       // false (distinct objects)
        System.out.println(largeA.equals(largeB));  // true (value equality)

        Integer missing = null;
        try {
            int value = missing; // unboxing null
            System.out.println(value);
        } catch (NullPointerException e) {
            System.out.println("unboxed null");
        }

        Long sum = 0L;
        for (int i = 0; i < 3; i++) {
            sum += i; // boxes on every compound assignment
        }
        System.out.println(sum);
    }
}`,
        },
        {
          title: 'A POJO with a guarded invariant',
          description: 'JavaBeans shape for frameworks, but the setter still enforces a rule.',
          code: `public class Product {
    private String name;
    private long priceInPaise;

    public Product() { } // required by many frameworks

    public Product(String name, long priceInPaise) {
        setName(name);
        setPriceInPaise(priceInPaise);
    }

    public String getName() { return name; }

    public void setName(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        this.name = name;
    }

    public long getPriceInPaise() { return priceInPaise; }

    public void setPriceInPaise(long priceInPaise) {
        if (priceInPaise < 0) throw new IllegalArgumentException("price cannot be negative");
        this.priceInPaise = priceInPaise;
    }

    public static void main(String[] args) {
        Product p = new Product("Keyboard", 249_900);
        System.out.println(p.getName() + " " + p.getPriceInPaise());
    }
}`,
        },
        {
          title: 'A record with validation and a defensive copy',
          description: 'Compact constructor enforces the invariant; the list is copied on the way in and out.',
          code: `import java.util.List;

public record Order(String id, List<String> items) {
    public Order {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("id required");
        items = List.copyOf(items);
    }
}

class RecordDemo {
    public static void main(String[] args) {
        Order order = new Order("O-1", List.of("book", "pen"));
        System.out.println(order.id());
        System.out.println(order.items());
        System.out.println(order.equals(new Order("O-1", List.of("book", "pen"))));
    }
}`,
        },
      ],
      keyTakeaways: [
        'Wrappers make primitives usable as objects and provide parsing, constants, and value equality.',
        'Autoboxing inserts valueOf; unboxing inserts intValue and can throw NPE on null.',
        'Integer caches -128..127 by default, so == on boxed values is unreliable.',
        'A public top-level class must match its filename; at most one per file.',
        'Records are concise immutable carriers; POJOs are mutable JavaBeans-style classes.',
      ],
      interviewTips: [
        'Explain the Integer cache with both a small and a large value, then say why equals is mandatory.',
        'Describe the file-name rule as a mapping between public type and bytecode unit.',
        'Compare records and POJOs on mutability, generated methods, framework compatibility, and inheritance.',
      ],
      pitfalls: [
        'Comparing boxed values with == and assuming value equality.',
        'Unboxing a null wrapper returned from an API.',
        'Putting a public class in a file with a different name.',
        'Assuming a record with a List component is deeply immutable.',
        'Using a mutable POJO as a HashMap key and then changing its fields.',
      ],
      quiz: [
        {
          question: 'Why is `Integer a = 100, b = 100; a == b` often true?',
          options: ['== compares values for wrappers', 'valueOf returns a cached instance in the default range', 'The compiler folds both into one variable', 'Integers are primitives'],
          answerIndex: 1,
          explanation: 'Integer.valueOf caches -128..127 by default, so both autoboxed values reference the same instance.',
        },
        {
          question: 'Which is required for a public top-level class?',
          options: ['A no-arg constructor', 'A matching source filename', 'At least one static method', 'Implementation of Serializable'],
          answerIndex: 1,
          explanation: 'A public top-level class name must match the .java filename.',
        },
      ],
    },
    {
      slug: 'nested-classes',
      title: 'Nested Classes: Static, Inner, Local & Anonymous',
      order: 8,
      summary: 'Four ways to declare a class inside another, the hidden outer reference, and the effectively-final capture rule.',
      level: 'advanced',
      subtopics: [
        {
          id: 'static-nested-classes',
          title: 'Static nested classes',
          body: `A \`static\` nested class is a top-level class scoped inside another class for naming and packaging. It has **no implicit reference** to an outer instance, so it is instantiated as \`new Outer.Inner()\` and behaves like a normal class.\n\nIt can access private static members of the outer class, including private ones, because access control is class-based, not instance-based. It cannot directly touch outer instance fields unless you pass an outer instance explicitly.\n\nPrefer static nested classes for helpers that do not need the enclosing object: builders, keys, value types, and implementations returned by factories. They avoid the hidden outer reference and its lifetime implications. Java's \`Map.Entry\` is a familiar static nested interface.`,
        },
        {
          id: 'inner-classes',
          title: 'Inner (non-static) classes',
          body: `An inner class is tied to an enclosing instance. The compiler adds a synthetic field (often named \`this$0\`) pointing at the outer object, and construction uses \`outer.new Inner()\`. From inside, \`Outer.this\` names the enclosing instance when a name is shadowed.\n\nThe inner class can read and write the outer object's private fields, because it is a member of the same top-level class. Each inner instance has exactly one associated outer instance; a static context cannot create one without an outer object.\n\nBefore Java 16, inner classes could not declare most static members; modern Java relaxes this, but the outer reference remains. Use an inner class when the object genuinely belongs to one enclosing instance, such as a \`Map\` view or an iterator over a specific collection.`,
        },
        {
          id: 'local-classes',
          title: 'Local classes',
          body: `A local class is declared inside a method, constructor, or block. Its scope is that block, and it can access the enclosing instance's members plus local variables that are **effectively final**.\n\nLocal classes cannot have access modifiers, and they cannot be static. They can extend a class or implement an interface, and they may be used to factor out logic that is meaningless outside one method. They compile to \`Outer$1Local.class\`-style names.\n\nCaptured locals are copied into synthetic fields at construction time. That is why they must not change afterward: the class would see a stale snapshot. If you need mutable shared state, use a field of an enclosing object or an array/box explicitly, and document the aliasing.`,
        },
        {
          id: 'anonymous-classes',
          title: 'Anonymous classes',
          body: `An anonymous class is declared and instantiated in one expression: \`new Runnable() { public void run() { ... } }\`. It extends a class or implements an interface, has no name, and produces exactly one object per evaluation.\n\nIt cannot declare a constructor, but it can use an instance initializer and can capture constructor arguments. It can add fields and methods, though methods not in the supertype are not callable through the expression's type. Inside, \`this\` refers to the anonymous instance; qualify \`Outer.this\` for the enclosing object.\n\nAnonymous classes are useful for small one-off implementations and for cases where a lambda cannot express the behavior (multiple methods, state, or overriding a class). Prefer lambdas for single-abstract-method interfaces: they are shorter and do not create a new \`this\` scope.`,
        },
        {
          id: 'capture-rules',
          title: 'Capture and effectively final',
          body: `Local and anonymous classes capture local variables by copying their values into synthetic fields. To keep the copy consistent, the variable must be final or effectively final — assigned once and never changed afterward. Parameters follow the same rule.\n\nCapturing an instance field does not copy the field value; the class captures the enclosing instance and reads the field through it. That is why a mutable field remains visible to the nested class while a local variable cannot be reassigned.\n\nA common workaround is a single-element array (\`int[] counter = {0}\`), which keeps the reference final while mutating the element. It works, but it is usually a design smell. Prefer an \`AtomicInteger\`, a field, or restructuring the code so the captured value is genuinely immutable.`,
        },
        {
          id: 'nested-class-lifetimes',
          title: 'Lifetimes, leaks, and design choices',
          body: `Every non-static inner instance keeps its outer instance alive. If an inner object escapes — stored in a static list, registered as a listener, returned from a factory — the entire outer object stays reachable. This is a classic memory leak in long-lived caches and UI listeners.\n\nStatic nested classes do not have this link and are usually the right default. Make an inner class only when the outer relationship is essential and short-lived. For listeners, prefer a static nested class with an explicit weak reference or a lambda that does not capture the outer instance.\n\nNested classes also affect serialization: synthetic outer references and compiler-generated fields can make serialized forms fragile. Keep serializable types simple, and revisit the nesting choice if the object graph starts carrying hidden edges.`,
        },
      ],
      javaCode: [
        {
          title: 'Static nested versus inner',
          description: 'The static nested class needs no outer object; the inner class reaches private outer state.',
          code: `public class Outer {
    private int value = 7;
    private static String label = "outer";

    static class Nested {
        String describe() { return "nested sees " + label; }
    }

    class Inner {
        String describe() {
            value++; // implicit Outer.this
            return "inner sees " + value;
        }
    }

    public static void main(String[] args) {
        Outer.Nested nested = new Outer.Nested();
        System.out.println(nested.describe());

        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();
        System.out.println(inner.describe());
        System.out.println(outer.value); // 8
    }
}`,
        },
        {
          title: 'Local and anonymous classes with capture',
          description: 'Effectively final locals are copied into the class; anonymous classes can hold their own state.',
          code: `public class CaptureDemo {
    interface Greeter { String greet(); }

    static Greeter greeterFor(String name) {
        String prefix = "Hello, "; // effectively final
        final int version = 2;

        class LocalGreeter implements Greeter {
            @Override public String greet() {
                return prefix + name + " (v" + version + ")";
            }
        }

        return new LocalGreeter();
    }

    public static void main(String[] args) {
        System.out.println(greeterFor("Asha").greet());

        int base = 10;
        Greeter anonymous = new Greeter() {
            private int calls = 0;

            @Override public String greet() {
                calls++;
                return "call " + calls + " base " + base; // captures base
            }
        };

        System.out.println(anonymous.greet());
        System.out.println(anonymous.greet());
    }
}`,
        },
        {
          title: 'An inner iterator that reads outer state',
          description: 'A non-static inner class is appropriate when iteration is bound to one specific collection instance.',
          code: `import java.util.NoSuchElementException;

public class IntRange {
    private final int start;
    private final int end;

    IntRange(int start, int end) {
        if (start > end) throw new IllegalArgumentException("start > end");
        this.start = start;
        this.end = end;
    }

    class Iterator {
        private int current = start;

        boolean hasNext() { return current <= end; }

        int next() {
            if (!hasNext()) throw new NoSuchElementException();
            return current++;
        }
    }

    public static void main(String[] args) {
        IntRange range = new IntRange(3, 5);
        IntRange.Iterator it = range.new Iterator();
        while (it.hasNext()) System.out.print(it.next() + " ");
    }
}`,
        },
      ],
      keyTakeaways: [
        'Static nested classes have no outer instance and are the safe default for helpers.',
        'Inner classes carry a hidden outer reference and are created with outer.new Inner().',
        'Local and anonymous classes can capture only final or effectively final locals.',
        'Anonymous classes are one-off expressions; lambdas are shorter for functional interfaces.',
        'Non-static nested instances can keep large outer objects alive and cause leaks.',
      ],
      interviewTips: [
        'Explain why a local variable captured by an anonymous class must be effectively final.',
        'Contrast lambda this and anonymous-class this; they refer to different scopes.',
        'Connect the inner-class outer reference to memory leaks in listeners.',
      ],
      pitfalls: [
        'Trying to create an inner class without an enclosing instance.',
        'Mutating a captured local after the class was created.',
        'Using a non-static inner class for a long-lived listener and leaking the outer object.',
        'Expecting anonymous-class methods outside the supertype to be callable.',
        'Forgetting Outer.this when a name is shadowed.',
      ],
      quiz: [
        {
          question: 'Which nested class has no implicit reference to an outer instance?',
          options: ['Inner class', 'Local class', 'Anonymous class', 'Static nested class'],
          answerIndex: 3,
          explanation: 'Static nested classes are scoped by the outer class name but hold no outer instance reference.',
        },
        {
          question: 'Why must a captured local be effectively final?',
          options: ['The compiler copies its value into the class', 'Java forbids all local variables in classes', 'Because the heap is immutable', 'To allow garbage collection'],
          answerIndex: 0,
          explanation: 'The generated class stores a copy; allowing later changes would make the copy and the original diverge.',
        },
      ],
    },
    {
      slug: 'io-streams-scanner-vs-bufferedreader',
      title: 'Java I/O: InputStreams, Scanner & BufferedReader',
      order: 9,
      summary: 'Byte streams, character streams, decoding, buffering, and why BufferedReader usually beats Scanner for bulk input.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'stream-model',
          title: 'The stream model',
          body: `A Java stream is an ordered sequence of data with a direction. Input streams read from a source; output streams write to a sink. Streams are generally **blocking**: a read returns when data is available, the end is reached, or an exception occurs.\n\nStreams are typically one-shot. Once a stream is closed or exhausted, you do not rewind it; open a new one. They also do not know about record boundaries. A file is bytes; \`readLine()\` is a convenience layered on top that scans for a line terminator.\n\nJava separates byte streams (\`InputStream\`, \`OutputStream\`) from character streams (\`Reader\`, \`Writer\`). The former move raw 8-bit data; the latter move 16-bit \`char\` values after a charset decodes or encodes bytes. Choosing the wrong layer causes mojibake or corrupt binary files.`,
        },
        {
          id: 'byte-vs-char-streams',
          title: 'Byte streams versus character streams',
          body: `Use byte streams for binary data: images, zip files, serialized objects, network protocols. Use character streams for text, where a charset maps bytes to Unicode characters. \`InputStreamReader\` and \`OutputStreamWriter\` are the bridges between the two.\n\nAlways specify a charset for text I/O. The no-argument \`new InputStreamReader(in)\` uses the platform default, which varies by machine and can silently corrupt non-ASCII text. \`StandardCharsets.UTF_8\` is a safe, explicit default for most modern systems.\n\nA byte stream does not interpret newlines, quotes, or numbers. Those are text concerns handled by readers and parsers. Wrapping a byte stream in a reader and then a parser is the normal layering: raw bytes at the bottom, decoding in the middle, semantics at the top.`,
        },
        {
          id: 'system-in-and-scanner',
          title: 'System.in and Scanner',
          body: `\`System.in\` is a \`InputStream\` connected to standard input. \`Scanner\` wraps it (or any readable source) and parses tokens using delimiters, with methods such as \`nextInt()\`, \`nextLine()\`, and \`hasNext()\`. It is convenient for interactive input and small inputs.\n\nScanner does a lot of work per token: delimiter matching, regex-based parsing, and locale-aware number conversion. For millions of tokens, that overhead is significant. It also buffers ahead, which can surprise you when mixing \`nextInt()\` with \`nextLine()\`: the newline after the number remains and \`nextLine()\` returns an empty string.\n\nScanner can read from strings, files, and streams. It is not thread-safe. Close it when it owns the underlying stream; closing a Scanner around \`System.in\` closes standard input.`,
        },
        {
          id: 'buffered-reader',
          title: 'BufferedReader and readLine',
          body: `\`BufferedReader\` wraps a \`Reader\` and adds an internal character buffer, typically 8 KB. Reading a line usually becomes a scan through an in-memory array rather than a syscall per character, which makes it much faster for bulk text.\n\nConstruct it with an explicit charset: \`new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8))\`. Then \`readLine()\` returns text without the line terminator, or \`null\` at end of stream. \`lines()\` exposes a lazy \`Stream<String>\`.\n\nBufferedReader is not a parser. Convert fields yourself with \`Integer.parseInt\` or \`split\`, and handle malformed input explicitly. Its speed comes from buffering, not from magic; avoid creating a new BufferedReader per line, which defeats the buffer.`,
        },
        {
          id: 'decorator-wrapping',
          title: 'The decorator pattern in I/O',
          body: `Java I/O composes behavior by wrapping streams: \`new DataInputStream(new BufferedInputStream(new FileInputStream(path)))\`. Each layer adds a capability — buffering, primitive decoding, compression, or character conversion — while implementing the same core interface.\n\nOrder matters. Buffering should sit close to the raw source so expensive reads are batched. A \`DataInputStream\` on top of a \`BufferedInputStream\` reads primitives efficiently; the reverse can still work but may perform poorly. For text, put \`InputStreamReader\` below \`BufferedReader\`.\n\nThis is the decorator design pattern in the JDK. It keeps the class count manageable and lets you assemble exactly the pipeline you need. The cost is more objects and a stack trace that reflects the whole chain.`,
        },
        {
          id: 'closing-and-resources',
          title: 'Closing, flushing, and try-with-resources',
          body: `Closing an outer stream generally closes the streams it wraps. \`try-with-resources\` closes resources in reverse order and suppresses secondary exceptions, which is why it should be the default for files, sockets, and readers.\n\nOutput streams buffer. \`flush()\` pushes buffered bytes to the destination without closing; \`close()\` normally flushes first. Forgetting to flush can leave the tail of a file unwritten. For \`System.out\`, avoid closing the stream: it is shared process-wide and closing it silences later output.\n\nDo not close \`System.in\` casually either. If a method receives a stream it does not own, the caller should decide its lifetime. Document ownership, and use try-with-resources only where the method is the clear owner.`,
        },
      ],
      javaCode: [
        {
          title: 'Fast line input with BufferedReader',
          description: 'Explicit UTF-8 decoding, buffered reads, and resource ownership in one pipeline.',
          code: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class SumLines {
    public static void main(String[] args) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(System.in, StandardCharsets.UTF_8))) {

            String line;
            long sum = 0;
            while ((line = reader.readLine()) != null) {
                line = line.strip();
                if (line.isEmpty()) continue;
                sum += Long.parseLong(line);
            }
            System.out.println("sum=" + sum);
        }
    }
}`,
        },
        {
          title: 'Token parsing with Scanner',
          description: 'Convenient for small inputs; note the newline left behind by nextInt().',
          code: `import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        String input = "3 10 20 30\\nAlice\\n";
        try (Scanner scanner = new Scanner(input)) {
            int count = scanner.nextInt();
            int total = 0;
            for (int i = 0; i < count; i++) {
                total += scanner.nextInt();
            }
            scanner.nextLine();          // consume the rest of the numeric line
            String name = scanner.nextLine();

            System.out.println(total);   // 60
            System.out.println(name);    // Alice
        }
    }
}`,
        },
        {
          title: 'Copying bytes with a buffer',
          description: 'Binary data stays in byte streams; the buffer amortizes read and write calls.',
          code: `import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class CopyBytes {
    public static void main(String[] args) throws IOException {
        try (var in = new BufferedInputStream(new FileInputStream("input.bin"));
             var out = new BufferedOutputStream(new FileOutputStream("output.bin"))) {

            byte[] buffer = new byte[8192];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Byte streams handle binary data; character streams decode bytes using a charset.',
        'Always specify UTF-8 (or the required charset) instead of relying on the platform default.',
        'Scanner is convenient but slower than BufferedReader for large text input.',
        'BufferedReader adds an in-memory buffer so readLine does not hit the OS per character.',
        'Use try-with-resources and close only streams you own.',
      ],
      interviewTips: [
        'Explain the Scanner nextInt/nextLine newline bug with the leftover terminator.',
        'Describe the decorator chain for reading UTF-8 text from System.in.',
        'Compare Scanner and BufferedReader on parsing, buffering, regex, and throughput.',
      ],
      pitfalls: [
        'Reading binary data through a Reader and corrupting it.',
        'Using the platform default charset and getting different results on another machine.',
        'Closing System.in or System.out and breaking later input or output.',
        'Forgetting to flush a buffered output stream before exiting.',
        'Creating a new BufferedReader inside a loop and losing the buffer benefit.',
      ],
      quiz: [
        {
          question: 'Which class bridges bytes from System.in to characters?',
          options: ['BufferedReader', 'InputStreamReader', 'Scanner', 'DataOutputStream'],
          answerIndex: 1,
          explanation: 'InputStreamReader decodes bytes into chars; BufferedReader then adds buffering.',
        },
        {
          question: 'Why is BufferedReader usually faster than Scanner for bulk input?',
          options: ['It compresses the input', 'It buffers characters and avoids regex parsing per token', 'It runs on a separate thread', 'It uses the platform charset'],
          answerIndex: 1,
          explanation: 'Buffering reduces I/O calls, and readLine avoids Scanner’s regex and locale-aware parsing overhead.',
        },
      ],
    },
    {
      slug: 'immutable-classes',
      title: 'Immutable Classes',
      order: 10,
      summary: 'A repeatable recipe for objects that never change, including defensive copies and the shallow immutability of records.',
      level: 'advanced',
      subtopics: [
        {
          id: 'what-immutability-means',
          title: 'What immutability really means',
          body: `An immutable object's observable state cannot change after construction. Every field is set once, no method mutates it, and no reference to mutable internals escapes. \`String\`, \`Integer\`, and the \`java.time\` types are immutable; \`Date\` and \`ArrayList\` are not.\n\n"All fields are final" is necessary but not sufficient. A final reference to an \`ArrayList\` still allows \`add\`. Immutability is a property of the whole API: constructors must not retain mutable inputs, accessors must not leak mutable internals, and subclasses must not add mutation.\n\nImmutable is not the same as unmodifiable. \`Collections.unmodifiableList(list)\` is a read-only view; the underlying list can still change through another reference. A truly immutable list owns its data and exposes no mutator.`,
        },
        {
          id: 'immutability-recipe',
          title: 'The immutable class recipe',
          body: `1. Declare the class \`final\` so a subclass cannot add mutable state or override methods. 2. Make every field \`private final\`. 3. Initialize all fields in the constructor. 4. Provide no setters or mutating methods. 5. Defensively copy every mutable input and output.\n\nValidation belongs in the constructor, before the object becomes visible. Once constructed, the invariant must hold forever. If a value can fail validation, reject it at creation rather than leaving a half-valid object.\n\nPure functions that return a new instance (\`plusDays\`, \`withBalance\`) preserve immutability while still supporting change. This "copy on write" style is more allocation-heavy but far easier to reason about, especially across threads.`,
        },
        {
          id: 'defensive-copying',
          title: 'Defensive copying',
          body: `If a constructor accepts a mutable object and stores the reference, the caller can mutate the object's state afterward. Copy on the way in: \`this.tags = new ArrayList<>(tags)\` or \`List.copyOf(tags)\`. If an accessor returns a mutable internal object, copy on the way out, or return an immutable view that cannot expose mutation.\n\n\`List.copyOf\` rejects null elements and returns an unmodifiable copy; \`new ArrayList<>(list)\` allows nulls and remains mutable internally. Choose based on the invariant. For arrays, use \`Arrays.copyOf\` in both directions; arrays are always mutable.\n\nDeep immutability requires copying nested mutable objects too. A list of immutable values can be copied shallowly. A list of mutable \`Address\` objects needs each address copied, or \`Address\` must itself become immutable.`,
        },
        {
          id: 'benefits',
          title: 'Why immutability pays off',
          body: `Immutable objects are inherently thread-safe: no synchronization is needed to read them, and they can be shared freely. Their state cannot change between validation and use, which eliminates a class of time-of-check/time-of-use bugs.\n\nThey are safe \`HashMap\` keys because their hash code cannot change after insertion. They are easy to cache and reuse, and they make failure atomicity simple: an operation either returns a new valid object or throws, never leaving a half-mutated one.\n\nValue objects such as money, coordinates, date ranges, and identifiers are natural fits. The cost is allocation and copying. That cost is often negligible compared with the debugging and concurrency cost of mutable shared state.`,
        },
        {
          id: 'records-and-immutability',
          title: 'Records are shallowly immutable',
          body: `A record's fields are final and its accessors cannot reassign them, but a record with a mutable component is only shallowly immutable. \`record Bag(List<String> items)\` still shares the caller's list unless the compact constructor copies it.\n\nWrite a compact constructor that validates and normalizes: \`items = List.copyOf(items);\`. The accessor returns the same immutable list, which is safe. For an array component, copy in the constructor and override the accessor to return a copy.\n\nRecords cannot extend another class and cannot declare extra instance fields, which limits accidental mutation but does not guarantee deep immutability. If a component type is mutable, the record is only as immutable as that component.`,
        },
        {
          id: 'immutability-pitfalls',
          title: 'Leaks and false immutability',
          body: `The most common bug is leaking \`this\` from a constructor: registering a listener or starting a thread before construction finishes lets another thread observe default field values. Avoid publishing \`this\` until the constructor returns.\n\nAnother leak is a mutable static field or a shared cache inside an otherwise immutable class. Static mutable state is global state; it breaks the value semantics of every instance. Keep statics constant or encapsulated.\n\nSubclassing is a third risk: a subclass can override an accessor and return changing values, so the class must be final or its constructors private with factories. Finally, note that immutable objects can still hold mutable resources (a file handle); immutability is about state, not about external side effects.`,
        },
      ],
      javaCode: [
        {
          title: 'An immutable value class with defensive copies',
          description: 'Final class, final fields, validation, and no way to reach the mutable list.',
          code: `import java.util.ArrayList;
import java.util.List;

public final class Employee {
    private final String id;
    private final List<String> skills;

    public Employee(String id, List<String> skills) {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("id required");
        this.id = id;
        this.skills = new ArrayList<>(skills); // copy in
    }

    public String id() { return id; }

    public List<String> skills() {
        return List.copyOf(skills); // copy out (immutable snapshot)
    }

    public Employee withSkill(String skill) {
        List<String> next = new ArrayList<>(skills);
        next.add(skill);
        return new Employee(id, next); // new object, original untouched
    }

    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("Java"));
        Employee first = new Employee("E-1", source);
        source.add("Python"); // does not affect first
        Employee second = first.withSkill("SQL");

        System.out.println(first.skills());  // [Java]
        System.out.println(second.skills()); // [Java, SQL]
    }
}`,
        },
        {
          title: 'A record that closes the mutable-component hole',
          description: 'The compact constructor copies and validates; the array accessor returns a copy.',
          code: `import java.util.Arrays;

public record Polygon(String name, int[] xs, int[] ys) {
    public Polygon {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        if (xs.length != ys.length) throw new IllegalArgumentException("coordinate mismatch");
        xs = Arrays.copyOf(xs, xs.length);
        ys = Arrays.copyOf(ys, ys.length);
    }

    @Override
    public int[] xs() { return Arrays.copyOf(xs, xs.length); }

    @Override
    public int[] ys() { return Arrays.copyOf(ys, ys.length); }

    public static void main(String[] args) {
        int[] xs = {0, 1, 1};
        Polygon p = new Polygon("triangle", xs, new int[]{0, 0, 1});
        xs[0] = 99; // does not affect p
        System.out.println(Arrays.toString(p.xs()));
    }
}`,
        },
        {
          title: 'The leak that breaks immutability',
          description: 'Storing and returning the caller’s list lets outside code mutate supposedly immutable state.',
          code: `import java.util.ArrayList;
import java.util.List;

final class BrokenRange {
    private final List<Integer> values;

    BrokenRange(List<Integer> values) {
        this.values = values; // BUG: caller retains a reference
    }

    List<Integer> values() {
        return values;        // BUG: caller can mutate internals
    }
}

public class LeakDemo {
    public static void main(String[] args) {
        List<Integer> input = new ArrayList<>(List.of(1, 2));
        BrokenRange range = new BrokenRange(input);

        input.add(3);          // mutates the range from outside
        range.values().clear();
        System.out.println(range.values()); // []
    }
}`,
        },
      ],
      keyTakeaways: [
        'Immutability requires final fields, no mutators, and no leaked mutable references.',
        'Defensively copy mutable inputs and outputs; arrays always need copying.',
        'Immutable objects are thread-safe, safe map keys, and easy to cache.',
        'Records are only shallowly immutable when components are mutable.',
        'Avoid leaking this from constructors and avoid mutable static state.',
      ],
      interviewTips: [
        'Recite the recipe as a checklist, then explain why final fields alone are insufficient.',
        'Give a concrete leak: constructor stores a List, getter returns it, caller mutates it.',
        'Explain why immutable keys are required for reliable HashMap behavior.',
      ],
      pitfalls: [
        'Making the class final but leaving a mutable static field.',
        'Returning an internal collection directly from an accessor.',
        'Assuming a record with a List is deeply immutable.',
        'Publishing this from a constructor before initialization finishes.',
        'Confusing an unmodifiable view with a truly immutable object.',
      ],
      quiz: [
        {
          question: 'Which change is required to make a class with a `List` field immutable?',
          options: ['Mark the list field volatile', 'Copy the list on input and output', 'Make the list public', 'Use a synchronized list'],
          answerIndex: 1,
          explanation: 'Defensive copies prevent callers from mutating the internal list or retaining a mutable alias.',
        },
        {
          question: 'Why is a record with an `int[]` component not automatically immutable?',
          options: ['Records cannot have arrays', 'Arrays are mutable and the accessor would expose them', 'Records are abstract', 'Arrays are always cloned by the compiler'],
          answerIndex: 1,
          explanation: 'Records freeze the reference, not the array contents; copy in the constructor and in the accessor.',
        },
      ],
    },
    {
      slug: 'object-class-contract',
      title: 'The Object Class Contract',
      order: 11,
      summary: 'toString, equals, hashCode, and clone: the methods every class inherits and the contracts that keep collections correct.',
      level: 'advanced',
      subtopics: [
        {
          id: 'object-root',
          title: 'Object is the root',
          body: `Every class extends \`java.lang.Object\`, directly or indirectly. It supplies \`toString\`, \`equals\`, \`hashCode\`, \`getClass\`, \`clone\`, \`finalize\`, and the \`wait\`/\`notify\` family used for intrinsic locking.\n\n\`getClass()\` is final and returns the runtime \`Class\` object. \`wait\`, \`notify\`, and \`notifyAll\` are final and must be called while holding the object's monitor. \`clone()\` is protected and native; \`finalize()\` is deprecated for removal and should not be used for resource cleanup.\n\nThe default implementations of \`equals\` and \`hashCode\` are identity-based. Overriding one without the other breaks hash-based collections. Everything else is inherited unless a class chooses to customize it.\n\nBecause \`Object\` is the root, an \`Object\` variable can refer to any instance, and every class carries these methods whether it uses them or not. That universality is why framework code can call \`toString\` or \`equals\` on arbitrary values, and why a bad override can break code far from the class that declared it.`,
        },
        {
          id: 'tostring',
          title: 'toString and readable diagnostics',
          body: `The default \`toString\` returns \`ClassName@hexHashCode\`, where the hash is typically the identity hash code. That is useless in logs and debuggers. Override it to include the fields that identify the object, without leaking secrets or dumping huge graphs.\n\nA good \`toString\` is stable, readable, and safe to call: no lazy database loads, no exceptions, no recursion into cycles. For sensitive fields, redact. For collections, cap the size if they can be large.\n\n\`toString\` is not a serialization format. Do not parse it, depend on its exact punctuation, or use it for persistence. If you need machine-readable output, define an explicit format such as JSON and keep \`toString\` for humans.`,
        },
        {
          id: 'equals-contract',
          title: 'The equals contract',
          body: `\`equals\` must be **reflexive** (\`x.equals(x)\`), **symmetric** (\`x.equals(y)\` iff \`y.equals(x)\`), **transitive**, **consistent** while state is unchanged, and must return \`false\` for \`null\`. These are not style preferences; collections rely on them.\n\nStart with identity (\`this == o\`), then null and type checks, then compare significant fields. \`getClass()\` gives strict type equality and preserves symmetry with subclasses. \`instanceof\` allows a subclass to equal a superclass, which is only safe if equality is designed across the hierarchy and usually requires the superclass to define it carefully.\n\nDo not include mutable fields that are not part of the object's identity, and do not make equality depend on derived values that can drift. Records generate a correct equals based on all components; for classes, write it deliberately.`,
        },
        {
          id: 'hashcode-contract',
          title: 'The hashCode contract',
          body: `If \`a.equals(b)\`, then \`a.hashCode() == b.hashCode()\`. The converse is not required: unequal objects may share a hash. Equal objects must hash equally, or hash-based collections will look in the wrong bucket and fail to find them.\n\nUse the same fields in \`hashCode\` as in \`equals\`. \`Objects.hash(...)\` is convenient but boxes primitives and allocates an array; a manual \`31 * result + field\` is faster in hot paths. Overflow is fine because the result is just an \`int\`.\n\nHash codes must be **consistent** for the object's lifetime as a key. If a field used in \`hashCode\` changes after insertion into a \`HashMap\`, the entry becomes unreachable by normal lookup. This is why mutable objects make poor keys.`,
        },
        {
          id: 'hashmap-consequences',
          title: 'What breaks in a HashMap',
          body: `\`HashMap\` computes a spread hash, selects a bucket, then scans for a node whose stored hash matches and whose key \`equals\` the lookup key. The node caches the hash from insertion time. If a key's fields change, the lookup computes a different hash and never reaches the original bucket.\n\nTwo failures follow. If \`equals\` is overridden without \`hashCode\`, two equal keys can land in different buckets and both be stored. If \`hashCode\` changes after insertion, even the original key cannot be found. \`HashSet\` has the same dependency.\n\nUse immutable keys, or at least never mutate fields involved in equality while the object is in a hash collection. Remove the key before mutation and reinsert it if you must change it.`,
        },
        {
          id: 'clone-and-finalize',
          title: 'clone() and finalize()',
          body: `\`clone()\` creates a new object without calling a constructor, then copies fields. It is shallow unless overridden, requires \`Cloneable\` to avoid \`CloneNotSupportedException\`, and returns \`Object\`. Final fields and subclass state make correct cloning difficult.\n\nPrefer copy constructors or static factories. They are explicit, type-safe, and can deep-copy selected fields. If you must implement \`clone\`, call \`super.clone()\`, fix mutable fields, and document the depth.\n\n\`finalize()\` is deprecated for removal. It runs on an unpredictable thread at an unpredictable time, can resurrect objects, and can delay reclamation. Use \`try-with-resources\`, \`Cleaner\`, or explicit close methods for native resources. The garbage collector manages memory; it should not be your cleanup scheduler.`,
        },
      ],
      javaCode: [
        {
          title: 'A correct equals, hashCode, and toString',
          description: 'Identity shortcut, class check, matching fields, and a human-readable representation.',
          code: `import java.util.Objects;

public final class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (other == null || getClass() != other.getClass()) return false;
        Point point = (Point) other;
        return x == point.x && y == point.y;
    }

    @Override
    public int hashCode() {
        return 31 * x + y;
    }

    @Override
    public String toString() {
        return "Point(" + x + ", " + y + ")";
    }

    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point b = new Point(1, 2);
        System.out.println(a.equals(b));     // true
        System.out.println(a.hashCode() == b.hashCode()); // true
        System.out.println(a);               // Point(1, 2)
        System.out.println(Objects.equals(a, null)); // false
    }
}`,
        },
        {
          title: 'A mutable key disappears from a HashMap',
          description: 'Changing a field used by hashCode changes the bucket, so the entry cannot be found.',
          code: `import java.util.HashMap;
import java.util.Map;

class MutableKey {
    String code;

    MutableKey(String code) { this.code = code; }

    @Override public boolean equals(Object o) {
        return o instanceof MutableKey k && code.equals(k.code);
    }

    @Override public int hashCode() { return code.hashCode(); }
}

public class MutableKeyDemo {
    public static void main(String[] args) {
        Map<MutableKey, String> map = new HashMap<>();
        MutableKey key = new MutableKey("A");
        map.put(key, "value");

        key.code = "B"; // mutates a field used by hashCode
        System.out.println(map.get(key));        // null
        System.out.println(map.get(new MutableKey("B"))); // null as well
        System.out.println(map.size());          // 1: the entry is stranded
    }
}`,
        },
        {
          title: 'Records give you the contract for free',
          description: 'A record’s generated equals and hashCode use all components and match each other.',
          code: `import java.util.HashMap;
import java.util.Map;

public record Coordinate(int row, int col) { }

class RecordContract {
    public static void main(String[] args) {
        Map<Coordinate, String> grid = new HashMap<>();
        grid.put(new Coordinate(2, 3), "treasure");

        System.out.println(grid.get(new Coordinate(2, 3))); // treasure
        System.out.println(new Coordinate(2, 3).equals(new Coordinate(2, 3))); // true
        System.out.println(new Coordinate(2, 3)); // Coordinate[row=2, col=3]
    }
}`,
        },
      ],
      keyTakeaways: [
        'equals must be reflexive, symmetric, transitive, consistent, and false for null.',
        'Equal objects must have equal hash codes; unequal objects may collide.',
        'HashMap caches a key’s hash, so mutating key fields can strand the entry.',
        'getClass-based equality preserves symmetry across subclasses; instanceof requires a hierarchy-wide design.',
        'Avoid clone() complexity and do not use finalize() for cleanup.',
      ],
      interviewTips: [
        'State the equals and hashCode contracts precisely, then give the HashMap failure mode.',
        'Explain the trade-off between getClass and instanceof in equals.',
        'Mention that mutable keys break hash collections even if equals and hashCode are individually correct.',
      ],
      pitfalls: [
        'Overriding equals without hashCode.',
        'Using mutable fields in hashCode and then mutating them.',
        'Making equals non-symmetric by mixing instanceof and subclass state.',
        'Parsing toString output as if it were a stable serialization format.',
        'Relying on finalize for closing files or sockets.',
      ],
      quiz: [
        {
          question: 'If two objects are equal by `equals`, what must be true of their hash codes?',
          options: ['They must be different', 'They must be equal', 'They must be prime', 'Nothing; hashCode is unrelated'],
          answerIndex: 1,
          explanation: 'Equal objects must produce the same hash code so hash-based collections find them in the same bucket.',
        },
        {
          question: 'Why can a mutable HashMap key become unreachable after mutation?',
          options: ['The map deletes it automatically', 'Its hash changes, so lookup targets a different bucket', 'HashMap rehashes on every get', 'equals stops working for all objects'],
          answerIndex: 1,
          explanation: 'HashMap stores the insertion hash and uses the current hash on lookup; a changed hash sends the lookup elsewhere.',
        },
      ],
    },
    {
      slug: 'enums',
      title: 'Enums: Type-Safe Constants',
      order: 12,
      summary: 'Why enum beats int constants, how enum constants are compiled, and the collections built specifically for them.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'why-enums',
          title: 'Why not int or String constants?',
          body: `\`static final int RED = 1\` is just an \`int\`. The compiler cannot stop you from passing \`GREEN\` where \`RED\` is expected, comparing unrelated constants, or storing an invalid number. String constants add typos and case sensitivity to the problem.\n\nAn enum creates a distinct type with a fixed set of instances. \`Color.RED\` has type \`Color\`, method signatures can require \`Color\`, and \`switch\` can be checked for exhaustiveness. Invalid values become impossible to represent without reflection or unsafe deserialization.\n\nEnums also carry behavior: fields, methods, and constant-specific implementations. That turns a loose set of flags into a small, well-defined domain type. The trade-off is that the set is fixed at compile time; if values are truly open-ended (user-defined tags), an enum is the wrong model.`,
        },
        {
          id: 'enum-anatomy',
          title: 'How an enum is compiled',
          body: `An enum compiles to a \`final\` class that extends \`java.lang.Enum\`. Each constant is a \`public static final\` instance of that class, created during class initialization in declaration order. The constructor is implicitly private, so no other code can create instances.\n\nEvery enum inherits \`name()\`, \`ordinal()\`, \`compareTo\`, \`values()\`, and \`valueOf(String)\`. \`values()\` returns a fresh array of all constants in declaration order; \`ordinal()\` is the zero-based position. Neither should be persisted as a stable identifier: reordering constants changes ordinals, and renaming changes names.\n\nThe class is final, so enums cannot be extended. They can implement interfaces, which makes them usable as strategy objects. They cannot extend another class because they already extend \`Enum\`.`,
        },
        {
          id: 'enum-constructors-and-fields',
          title: 'Constructors, fields, and methods',
          body: `Enum constants can pass arguments to a private constructor: \`MERCURY(3.303e+23, 2.4397e6)\`. Fields are usually \`private final\`, set once during class initialization, and exposed through methods.\n\nThe constructor runs once per constant, in declaration order, before the constants are published. It cannot access non-constant static fields that are declared later, because those fields have not been initialized yet. Keep constructor logic simple and side-effect free.\n\nEnums can have static fields, static initializers, and ordinary methods. A static map from name to constant can speed up lookups, but \`valueOf\` already does a name lookup. For numeric codes from a database, add a \`fromCode(int)\` factory that validates and throws \`IllegalArgumentException\` for unknown values.`,
        },
        {
          id: 'constant-specific-bodies',
          title: 'Constant-specific class bodies',
          body: `An enum constant can override a method with its own class body: \`PLUS { public int apply(int a, int b) { return a + b; } }\`. The compiler creates an anonymous subclass for that constant, and the constant's runtime class differs from the enum's declared class.\n\nThis is a clean replacement for a switch over an operation code. Declare an abstract method on the enum, implement it per constant, and callers get dynamic dispatch without a switch. Adding a new constant forces you to provide an implementation, which the compiler enforces.\n\nDo not combine constant-specific bodies with a \`switch\` that assumes all constants share one class. Also remember that \`getClass()\` differs per constant body, which matters for reflection and equality checks.`,
        },
        {
          id: 'enummap-and-enumset',
          title: 'EnumMap and EnumSet',
          body: `\`EnumMap<K extends Enum<K>, V>\` is backed by an array indexed by ordinal, so lookups are O(1) with no hashing. It requires the enum class in its constructor (\`new EnumMap<>(Priority.class)\`), rejects null keys, and iterates in ordinal order.\n\n\`EnumSet\` is a specialized bit-vector set. \`EnumSet.of(HIGH, MEDIUM)\` is compact and fast, and iteration follows ordinal order. It is not thread-safe; use \`Collections.synchronizedSet\` or a concurrent alternative if needed.\n\nBoth are preferable to \`HashMap\`/\`HashSet\` keyed by enum when the key space is an enum. They use less memory and avoid boxing of the ordinal internally. Use \`EnumSet.allOf(...)\`, \`noneOf(...)\`, \`range(...)\`, and \`complementOf(...)\` for set algebra.`,
        },
        {
          id: 'switch-and-serialization',
          title: 'Switch, persistence, and identity',
          body: `Enums work in both statement and expression switches. A switch expression over an enum can be exhaustive without a default when all constants are covered, and the compiler reports a missing case when a new constant is added. That is a major maintenance advantage over int codes.\n\nEnum serialization is special: only the constant name is written, and deserialization resolves it through \`valueOf\`, so the singleton identity is preserved. Renaming a constant breaks persisted data unless you provide a stable code and a custom factory.\n\nBecause constants are singletons, \`==\` is correct and preferred for enums. \`equals\` behaves the same but adds no value. Never reconstruct an enum via reflection or serialization tricks; use the declared constants.`,
        },
      ],
      javaCode: [
        {
          title: 'An enum with state and behavior',
          description: 'Each constant carries immutable data and exposes a computed property through a method.',
          code: `public enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    EARTH(5.976e+24, 6.37814e6),
    MARS(6.421e+23, 3.3972e6);

    private final double massKg;
    private final double radiusM;

    Planet(double massKg, double radiusM) {
        this.massKg = massKg;
        this.radiusM = radiusM;
    }

    public double surfaceGravity() {
        return 6.67430e-11 * massKg / (radiusM * radiusM);
    }

    public static void main(String[] args) {
        for (Planet planet : Planet.values()) {
            System.out.printf("%s %.2f%n", planet, planet.surfaceGravity());
        }
        System.out.println(Planet.valueOf("EARTH").ordinal()); // 1
    }
}`,
        },
        {
          title: 'Constant-specific implementations replace a switch',
          description: 'Every operation owns its behavior; adding a constant forces an implementation.',
          code: `public enum Operation {
    PLUS {
        @Override public int apply(int a, int b) { return a + b; }
    },
    MINUS {
        @Override public int apply(int a, int b) { return a - b; }
    },
    TIMES {
        @Override public int apply(int a, int b) { return a * b; }
    };

    public abstract int apply(int a, int b);

    public static void main(String[] args) {
        int result = Operation.PLUS.apply(7, 5);
        System.out.println(result); // 12

        for (Operation op : Operation.values()) {
            System.out.println(op + " -> " + op.apply(8, 2));
        }
    }
}`,
        },
        {
          title: 'EnumMap and EnumSet in practice',
          description: 'Array-backed enum collections avoid hashing and keep natural ordinal order.',
          code: `import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public class PriorityDemo {
    enum Priority { LOW, MEDIUM, HIGH }

    public static void main(String[] args) {
        Map<Priority, Integer> counts = new EnumMap<>(Priority.class);
        for (Priority p : Priority.values()) counts.put(p, 0);

        counts.merge(Priority.HIGH, 2, Integer::sum);
        counts.merge(Priority.LOW, 1, Integer::sum);

        Set<Priority> urgent = EnumSet.of(Priority.HIGH, Priority.MEDIUM);
        System.out.println(counts);            // ordinal order
        System.out.println(urgent.contains(Priority.HIGH)); // true
        System.out.println(EnumSet.complementOf(EnumSet.of(Priority.HIGH))); // [LOW, MEDIUM]
    }
}`,
        },
      ],
      keyTakeaways: [
        'Enums create a fixed, type-safe set of singleton instances with behavior.',
        'Each constant is a static final instance of a final class extending java.lang.Enum.',
        'Constant-specific class bodies implement per-constant behavior without a switch.',
        'EnumMap and EnumSet are array or bit-vector backed and faster than hash collections for enum keys.',
        'Persist a stable business code, not name() or ordinal(), unless you accept rename and reorder breakage.',
      ],
      interviewTips: [
        'Explain why enum constants are singletons and why == is safe for them.',
        'Contrast enum switch exhaustiveness with int constants.',
        'Describe EnumMap’s ordinal-indexed array and EnumSet’s bit vector.',
      ],
      pitfalls: [
        'Persisting ordinal() and then reordering constants.',
        'Assuming enum constructors can be public.',
        'Adding a constant without updating every non-exhaustive switch.',
        'Using an enum for an open-ended set of values that changes at runtime.',
        'Trying to extend an enum class.',
      ],
      quiz: [
        {
          question: 'What does each enum constant become at the bytecode level?',
          options: ['An int constant', 'A public static final instance of the enum class', 'A String literal', 'An interface implementation only'],
          answerIndex: 1,
          explanation: 'Constants are static final instances created during enum class initialization; the constructor is private.',
        },
        {
          question: 'Why is EnumMap faster than HashMap for enum keys?',
          options: ['It uses a sorted tree', 'It indexes an array by ordinal', 'It compresses the keys', 'It synchronizes lookups'],
          answerIndex: 1,
          explanation: 'EnumMap uses the constant’s ordinal as an array index, avoiding hashing and collisions.',
        },
      ],
    },
    {
      slug: 'interfaces-deep-dive',
      title: 'Interfaces: Default, Functional & Marker',
      order: 13,
      summary: 'Interface evolution with default methods, diamond resolution, functional targets, and the meaning of a marker.',
      level: 'advanced',
      subtopics: [
        {
          id: 'interface-basics',
          title: 'The interface contract',
          body: `An interface declares a set of members that implementing classes must honor. Abstract methods are implicitly \`public\`; fields are implicitly \`public static final\`. A class can implement many interfaces, which is Java's form of multiple inheritance of type.\n\nInterfaces describe capability, not identity. \`Comparable<T>\`, \`Runnable\`, and \`AutoCloseable\` can be implemented by unrelated classes. They cannot hold instance state, so they cannot enforce invariants that require fields; that is the job of the implementing class or an abstract base.\n\nAn interface can extend multiple interfaces. A class that implements an interface inherits its abstract methods and any default methods. Interface references participate in dynamic dispatch exactly like superclass references.`,
        },
        {
          id: 'default-methods',
          title: 'Default methods and evolution',
          body: `A \`default\` method provides an implementation in the interface. It was added in Java 8 primarily so libraries could add methods (such as \`Collection.stream()\`) without breaking every existing implementation.\n\nDefault methods are dynamically dispatched. A class can override them, and an implementing class inherits the default if it does not. They can call other interface methods, which makes them useful for composing behavior. They cannot override \`Object\` methods such as \`equals\` or \`toString\`, and they cannot access instance fields because interfaces have none.\n\nUse defaults for genuinely optional behavior or for backwards-compatible evolution. A default that depends on subtle state assumptions is a trap: implementers may not know the contract. Document it as carefully as an abstract method.`,
        },
        {
          id: 'diamond-resolution',
          title: 'Diamond conflicts',
          body: `If two interfaces declare the same default method and a class implements both, the compiler reports a conflict. The class must override the method and explicitly choose or combine the implementations using \`InterfaceName.super.method()\`.\n\nResolution rules: a superclass method wins over an interface default ("class wins"); a more specific interface (one that extends the other) wins over its superinterface; otherwise the class must resolve the ambiguity. An abstract declaration can also re-abstract a default, forcing subclasses to implement it.\n\nThese rules prevent accidental ambiguity while still allowing multiple inheritance of behavior. They are also why adding a default method to a widely implemented interface can still break classes that already inherit a conflicting method from another interface.`,
        },
        {
          id: 'static-and-private-methods',
          title: 'Static and private interface methods',
          body: `Static interface methods belong to the interface, not to implementing classes. They are not inherited, so you call them as \`InterfaceName.helper(...)\`. They are useful for factories and utility functions tied to the contract, such as \`Comparator.comparing(...)\`.\n\nJava 9 added private interface methods, which let default and static methods share code without exposing a public helper. A private method is not part of the contract and cannot be called by implementers.\n\nStatic methods in interfaces cannot be abstract, and they do not participate in overriding. A class can declare a static method with the same signature without conflict; it simply hides the interface's static method for calls through the class name.`,
        },
        {
          id: 'functional-interfaces',
          title: 'Functional interfaces',
          body: `A functional interface has exactly one abstract method (SAM). \`@FunctionalInterface\` asks the compiler to enforce that shape; it does not create the property. Default, static, and \`Object\` methods do not count toward the single abstract method.\n\nLambdas and method references target functional interfaces. \`Function<T,R>\`, \`Predicate<T>\`, \`Supplier<T>\`, \`Consumer<T>\`, and \`Runnable\` are the standard building blocks. A lambda captures effectively final locals and does not introduce a new \`this\` scope, unlike an anonymous class.\n\nKeep functional interfaces small and intention-revealing. A custom \`@FunctionalInterface\` with a domain name is often clearer than a generic \`Function\`. Avoid checked exceptions in the abstract method unless callers can handle them; standard functional interfaces do not declare any.`,
        },
        {
          id: 'marker-interfaces',
          title: 'Marker interfaces',
          body: `A marker interface declares no methods. \`Serializable\` and \`Cloneable\` are the classic examples: they signal that a class permits some JVM or library behavior. \`Cloneable\` changes \`Object.clone()\` from throwing to performing a field copy; \`Serializable\` enables the serialization mechanism.\n\nMarkers are a form of type-based metadata. They can be tested with \`instanceof\` and used in generic bounds. Their weakness is that they carry no compiler-enforced contract: implementing \`Serializable\` does not guarantee a safe serial form.\n\nAnnotations are often a better fit for metadata that tooling or frameworks consume. Use a marker interface when you need a real type for \`instanceof\`, generic bounds, or API signatures. Avoid creating empty markers that nothing checks.`,
        },
      ],
      javaCode: [
        {
          title: 'Resolving a default-method diamond',
          description: 'Two conflicting defaults force an explicit override and qualified super calls.',
          code: `interface Greeter {
    default String greet() { return "hello"; }
}

interface Polite {
    default String greet() { return "good day"; }
}

class Butler implements Greeter, Polite {
    @Override
    public String greet() {
        return Polite.super.greet() + ", " + Greeter.super.greet();
    }
}

public class DiamondDemo {
    public static void main(String[] args) {
        System.out.println(new Butler().greet()); // good day, hello
    }
}`,
        },
        {
          title: 'A functional interface with composition',
          description: 'One abstract method, a static factory, and a default combinator — all lambda-friendly.',
          code: `@FunctionalInterface
interface Validator<T> {
    boolean test(T value);

    static <T> Validator<T> notNull() {
        return value -> value != null;
    }

    default Validator<T> and(Validator<T> other) {
        return value -> this.test(value) && other.test(value);
    }
}

public class ValidatorDemo {
    public static void main(String[] args) {
        Validator<String> present = value -> !value.isBlank();
        Validator<String> notNull = Validator.notNull();
        Validator<String> valid = notNull.and(present);

        System.out.println(valid.test("Asha")); // true
        System.out.println(valid.test("  "));   // false
        System.out.println(valid.test(null));   // false, short-circuits safely
    }
}`,
        },
        {
          title: 'A marker interface used as a capability check',
          description: 'The empty interface carries type-level intent that instanceof can test.',
          code: `interface Cacheable { }

final class Country implements Cacheable {
    private final String code;
    Country(String code) { this.code = code; }
    String code() { return code; }
}

final class Session {
    private final String id;
    Session(String id) { this.id = id; }
}

public class MarkerDemo {
    static boolean shouldCache(Object value) {
        return value instanceof Cacheable;
    }

    public static void main(String[] args) {
        System.out.println(shouldCache(new Country("IN"))); // true
        System.out.println(shouldCache(new Session("s-1"))); // false
    }
}`,
        },
      ],
      keyTakeaways: [
        'Interfaces define capability contracts and allow multiple inheritance of type.',
        'Default methods enable interface evolution and are dispatched dynamically.',
        'Diamond conflicts require an explicit override; a superclass method wins over a default.',
        'Functional interfaces have one abstract method and are lambda targets.',
        'Marker interfaces provide type-level metadata but no enforced behavior.',
      ],
      interviewTips: [
        'Walk through the diamond resolution rules in order: class, most specific interface, explicit override.',
        'Explain why default methods were added and what breakage they prevent.',
        'Distinguish a functional interface from a marker interface by abstract-method count and purpose.',
      ],
      pitfalls: [
        'Adding a default method that conflicts with an existing implementation.',
        'Trying to give an interface instance fields.',
        'Assuming default methods can override Object methods like equals.',
        'Using a marker interface when an annotation expresses the metadata better.',
        'Forgetting that static interface methods are not inherited.',
      ],
      quiz: [
        {
          question: 'A class implements two interfaces with the same default method. What must it do?',
          options: ['Nothing; the first interface wins', 'Override the method and optionally use Interface.super', 'Become abstract automatically', 'Drop one interface at runtime'],
          answerIndex: 1,
          explanation: 'A default conflict must be resolved by an explicit override, using qualified super calls if needed.',
        },
        {
          question: 'How many abstract methods does a functional interface have?',
          options: ['Zero', 'Exactly one', 'At least two', 'One per default method'],
          answerIndex: 1,
          explanation: 'A SAM interface has a single abstract method; defaults and static methods do not count.',
        },
      ],
    },
    {
      slug: 'strings-and-the-string-pool',
      title: 'Strings & the String Pool',
      order: 14,
      summary: 'Immutability, literal interning, heap versus pool identity, and how compact strings changed the representation.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'string-immutability',
          title: 'String is immutable',
          body: `\`String\` is a final class with no mutating methods. Every "modification" returns a new string: \`substring\`, \`replace\`, \`toUpperCase\`, and concatenation all allocate. This makes strings safe to share, safe as map keys, and safe to pass across threads without synchronization.\n\nImmutability also underpins the string pool: two variables can share one literal because neither can change it. The hash code is computed lazily and cached in the string object, which makes repeated hash-based lookups fast.\n\nBecause a string cannot change, APIs can retain references without defensive copying. The cost is allocation: building a large string by repeated concatenation creates many intermediate objects. Use \`StringBuilder\` for mutation-heavy construction.`,
        },
        {
          id: 'string-pool',
          title: 'The string constant pool',
          body: `String literals are interned in the **string constant pool**, a table managed by the JVM. Since Java 7 the pool lives in the heap rather than the permanent generation. When a class is loaded, its literal strings are resolved to canonical pool entries.\n\nTwo identical literals therefore reference the same object: \`"hello" == "hello"\` is true. The compiler also folds compile-time constants, so \`"hel" + "lo"\` is the literal \`"hello"\` and participates in the pool.\n\nThe pool is an implementation optimization, not a guarantee you should build identity logic on. Use \`equals\` for string content. Identity comparisons are appropriate only when you deliberately interned a value and need canonical-instance semantics.`,
        },
        {
          id: 'literal-versus-new',
          title: 'Literals versus new String',
          body: `\`String a = "hello"\` uses the pool. \`String b = new String("hello")\` explicitly allocates a new heap object; the literal argument is still resolved in the pool, but the constructor copies it into a fresh string. So \`a == b\` is false while \`a.equals(b)\` is true.\n\nThis is why \`new String(...)\` is almost always unnecessary. It doubles memory for no semantic benefit. The same applies to \`new String(char[])\` when a literal would do; use the constructor only when you actually need a distinct object or are converting from bytes/chars.\n\nCompile-time concatenation of literals is folded, but runtime concatenation with a variable produces a new string. \`"hello " + name\` is not a pool entry unless the result is explicitly interned.`,
        },
        {
          id: 'interning',
          title: 'intern() and canonical references',
          body: `\`intern()\` returns the canonical pool instance for a string's contents. If the pool already contains an equal string, that reference is returned; otherwise the string is added and its reference returned. It lets you convert a runtime-built string into a shared, canonical one.\n\nInterning is useful when many equal strings are retained for a long time, such as enum-like keys or symbol tables. It is not free: the pool lookup costs time, and interned strings are strongly referenced for the life of the pool entry. Interning untrusted or unbounded input can create a denial-of-service memory leak.\n\nDo not intern everything. Use it deliberately for a bounded set of repeated values, and measure. For ordinary comparisons, \`equals\` is cheaper and safer than forcing canonicalization.`,
        },
        {
          id: 'compact-strings',
          title: 'Compact strings',
          body: `Since Java 9, \`String\` stores its content in a \`byte[]\` plus a \`byte coder\` instead of a \`char[]\`. If every character fits in Latin-1, each character uses one byte; otherwise the string uses UTF-16 and two bytes per character. This "compact strings" layout reduces memory for typical ASCII-heavy text.\n\nThe public API still exposes \`char\` values; \`charAt\` decodes from the internal representation. The change is an implementation detail, not something to depend on, but it explains why a string's memory use depends on its content.\n\nStrings are UTF-16 semantically. A supplementary character occupies two \`char\` values (a surrogate pair), so \`length()\` counts code units, not code points. Use \`codePointCount\` and related methods when Unicode correctness matters.`,
        },
        {
          id: 'concatenation-cost',
          title: 'Concatenation and performance',
          body: `The \`+\` operator on strings is convenient, and the compiler turns runtime concatenation into an \`invokedynamic\` call to \`StringConcatFactory\` (Java 9+), which builds the result efficiently for a single expression. A loop is different: each iteration creates a new string and copies the accumulated content, leading to quadratic work.\n\nUse \`StringBuilder\` for loops and incremental construction. Use \`String.join\` for a delimiter-separated sequence, and \`String.format\` or \`formatted\` for readable templates when performance is not critical.\n\nConcatenating \`null\` produces the literal \`"null"\`, which can hide bugs. Concatenation also evaluates both operands; there is no short-circuit behavior as with \`&&\`. If a value's \`toString\` is expensive or side-effecting, build the string only when needed.`,
        },
      ],
      javaCode: [
        {
          title: 'Pool identity versus value equality',
          description: 'Literals share pool entries; new String and runtime concatenation create distinct objects.',
          code: `public class StringPoolDemo {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";
        String c = new String("hello");
        String d = "hel" + "lo"; // compile-time constant folding

        System.out.println(a == b);      // true, same pool entry
        System.out.println(a == c);      // false, new object
        System.out.println(a == d);      // true, folded literal
        System.out.println(a.equals(c)); // true, same content

        String name = "world";
        String e = "hello " + name;      // runtime concatenation
        String f = "hello " + name;
        System.out.println(e == f);      // false, new string each time
        System.out.println(e.equals(f)); // true
    }
}`,
        },
        {
          title: 'Interning a runtime-built string',
          description: 'intern() canonicalizes content; == becomes true only after interning.',
          code: `public class InternDemo {
    public static void main(String[] args) {
        String built = new StringBuilder("he").append("llo").toString();
        String literal = "hello";

        System.out.println(built == literal);        // false
        System.out.println(built.equals(literal));   // true

        String canonical = built.intern();
        System.out.println(canonical == literal);    // true
        System.out.println(canonical == built);      // false, built remains a distinct object
    }
}`,
        },
        {
          title: 'Why loops need StringBuilder',
          description: 'Each + in a loop creates a new string; the builder mutates one buffer.',
          code: `public class ConcatCost {
    static String withPlus(int n) {
        String result = "";
        for (int i = 0; i < n; i++) {
            result += i; // O(n^2) copying
        }
        return result;
    }

    static String withBuilder(int n) {
        StringBuilder builder = new StringBuilder(n * 2);
        for (int i = 0; i < n; i++) {
            builder.append(i); // amortized O(1) per append
        }
        return builder.toString();
    }

    public static void main(String[] args) {
        System.out.println(withPlus(5));    // 01234
        System.out.println(withBuilder(5)); // 01234
    }
}`,
        },
      ],
      keyTakeaways: [
        'String is immutable, so every modification allocates a new object and strings are safely shareable.',
        'Literals are interned in the string pool; identical literals share one object.',
        'new String("x") creates a distinct heap object even though "x" is pooled.',
        'intern() canonicalizes content but costs a lookup and retains the entry.',
        'Compact strings store Latin-1 content in one byte per character; length counts UTF-16 code units.',
      ],
      interviewTips: [
        'Explain pool identity with literals, new String, and a runtime concatenation — all three cases.',
        'Mention that the pool moved to the heap and that interning can be a memory hazard.',
        'Describe the loop concatenation problem and the StringBuilder fix.',
      ],
      pitfalls: [
        'Using == to compare string contents.',
        'Believing new String("x") returns the pooled instance.',
        'Interning unbounded user input and growing the pool forever.',
        'Assuming length() equals the number of Unicode code points.',
        'Building large strings with + in a loop.',
      ],
      quiz: [
        {
          question: 'What is `new String("hello") == "hello"`?',
          options: ['true, because the content matches', 'false, because new allocates a distinct object', 'A compile error', 'true only with -XX:+UseStringDeduplication'],
          answerIndex: 1,
          explanation: 'The literal is pooled, but the constructor creates a separate heap string, so the references differ.',
        },
        {
          question: 'Why is repeated + concatenation in a loop slow?',
          options: ['It locks the string', 'Each iteration allocates and copies the accumulated result', 'It uses the network', 'It triggers garbage collection every time'],
          answerIndex: 1,
          explanation: 'Strings are immutable, so every concatenation creates a new object and copies prior content.',
        },
      ],
    },
    {
      slug: 'string-methods-and-builders',
      title: 'String Methods, StringBuilder & StringBuffer',
      order: 15,
      summary: 'The methods you actually use, the equality and comparison rules, and how mutable character buffers differ.',
      level: 'intermediate',
      subtopics: [
        {
          id: 'core-string-methods',
          title: 'Core inspection and transformation',
          body: `\`length()\` returns UTF-16 code units. \`charAt(i)\` returns one code unit; \`substring(begin, end)\` returns a new string for the half-open range. \`indexOf\` and \`lastIndexOf\` return \`-1\` when absent, a detail that causes many off-by-one bugs.\n\n\`strip()\` removes Unicode whitespace, while \`trim()\` removes only characters at or below U+0020; prefer \`strip\` for modern text. \`replace\` replaces literal sequences, and \`replaceAll\` uses a regex, which means metacharacters must be escaped.\n\n\`split(regex)\` also uses a regex and discards trailing empty strings by default; use the two-argument form with a negative limit to keep them. \`String.join(delimiter, parts)\` is the clean way to assemble a delimited string. Methods return new strings; the receiver never changes.`,
        },
        {
          id: 'comparison-and-equality',
          title: 'Equality and ordering',
          body: `\`equals\` compares content exactly; \`equalsIgnoreCase\` compares case-insensitively using Unicode case rules, though locale-sensitive comparisons need \`Collator\`. \`compareTo\` orders lexicographically by UTF-16 code unit and returns a negative, zero, or positive integer, not a boolean.\n\n\`compareTo\` is consistent with \`equals\` only when case and normalization match. \`"A".compareTo("a")\` is negative because uppercase letters precede lowercase in UTF-16. For human-facing sorting, use \`Collator\` with a locale.\n\nNever use \`==\` for content. It compares references and is unpredictable across pooled literals, runtime strings, and interning. Also avoid \`String.format\` for comparison logic; it is for presentation, not equality.`,
        },
        {
          id: 'conversion-and-formatting',
          title: 'Conversion and formatting',
          body: `\`String.valueOf(x)\` safely converts any value, including \`null\` to \`"null"\`. Primitive parsing goes the other way: \`Integer.parseInt\`, \`Double.parseDouble\`, and their \`valueOf\` variants. Parsing throws \`NumberFormatException\` on malformed input, so validate or catch at the boundary.\n\n\`toCharArray()\` copies the characters into a mutable array; changes to the array do not affect the string. \`chars()\` returns an \`IntStream\` of code units, useful for filtering or counting. \`getBytes(StandardCharsets.UTF_8)\` encodes to bytes; always pass a charset.\n\n\`format\` and \`formatted\` support placeholders such as \`%s\`, \`%d\`, and \`%.2f\`, with locale-sensitive formatting for numbers and dates. For logs, prefer parameterized logging APIs to avoid building strings that may never be used.`,
        },
        {
          id: 'stringbuilder',
          title: 'StringBuilder',
          body: `\`StringBuilder\` is a mutable sequence backed by a resizable byte array (compact-string era) or char array. \`append\`, \`insert\`, \`delete\`, \`replace\`, \`reverse\`, and \`setLength\` mutate the buffer in place. \`toString()\` produces an immutable snapshot.\n\nIt is not thread-safe. That is deliberate: removing synchronization makes it the right choice for local, single-threaded construction. Its methods return \`this\`, enabling fluent chains such as \`new StringBuilder().append("a").append(1).reverse()\`.\n\nPre-size the builder when you know the approximate output length (\`new StringBuilder(1024)\`). The default capacity is 16, and growth copies the buffer, so avoiding repeated growth helps in hot paths. Do not retain a builder as a value object; call \`toString()\` at the boundary.`,
        },
        {
          id: 'stringbuffer',
          title: 'StringBuffer',
          body: `\`StringBuffer\` has the same API shape as \`StringBuilder\`, but its mutating methods are \`synchronized\`. It is the legacy thread-safe option from before \`StringBuilder\` existed. Each call acquires the buffer's monitor, so it is slower under contention.\n\nThread safety at the method level is not the same as atomic compound operations. Two threads doing \`buffer.append(a); buffer.append(b);\` can interleave unless the whole sequence is externally synchronized. If you need compound atomicity, guard the block or use a different design.\n\nIn modern code, prefer \`StringBuilder\` for local construction and avoid sharing a mutable buffer across threads. If you truly need concurrent text assembly, a synchronized block around a \`StringBuilder\` or a higher-level abstraction is usually clearer than relying on \`StringBuffer\`.`,
        },
        {
          id: 'capacity-and-performance',
          title: 'Capacity, growth, and costs',
          body: `A builder starts with a capacity (16 by default). When an append exceeds it, the buffer grows, typically to roughly twice the old capacity plus two, and copies the existing content. Growth is amortized O(1) per append, but repeated large copies still cost.\n\nThe same logic applies to collections and arrays: pre-sizing avoids reallocation. Estimate output size from the number of elements and average field length, then add a small margin. \`ensureCapacity\` can reserve space explicitly.\n\nDo not micro-optimize trivial concatenations; the compiler's invokedynamic concat is already good for single expressions. Optimize loops, large reports, and serializers where the builder is reused many times. Measure before and after rather than guessing.`,
        },
      ],
      javaCode: [
        {
          title: 'A tour of the everyday String API',
          description: 'Inspection, transformation, splitting, joining, and comparison without accidental regexes.',
          code: `import java.util.Arrays;

public class StringTour {
    public static void main(String[] args) {
        String raw = "  Java,Collections,Streams  ";
        String text = raw.strip();

        System.out.println(text.length());              // 24
        System.out.println(text.charAt(0));             // J
        System.out.println(text.indexOf("Collections")); // 5
        System.out.println(text.substring(5));          // Collections,Streams
        System.out.println(text.replace("Streams", "Generics"));
        System.out.println(text.equalsIgnoreCase("java,collections,streams")); // true

        String[] parts = text.split(",");
        System.out.println(Arrays.toString(parts));
        System.out.println(String.join(" | ", parts));
        System.out.println("ab".repeat(3));             // ababab
        System.out.println("%s has %d parts".formatted("text", parts.length));
    }
}`,
        },
        {
          title: 'Building a report with StringBuilder',
          description: 'Fluent appends, a pre-sized buffer, and one immutable snapshot at the end.',
          code: `public class ReportBuilder {
    static String render(String[] names, int[] scores) {
        StringBuilder out = new StringBuilder(64 + names.length * 16);
        out.append("SCORES").append('\\n');

        for (int i = 0; i < names.length; i++) {
            out.append(i + 1)
               .append(". ")
               .append(names[i])
               .append(" = ")
               .append(scores[i])
               .append('\\n');
        }

        return out.toString();
    }

    public static void main(String[] args) {
        String report = render(
                new String[]{"Asha", "Ravi"},
                new int[]{91, 84});
        System.out.print(report);
    }
}`,
        },
        {
          title: 'StringBuffer and compound operations',
          description: 'Synchronized methods protect each call, but a multi-call invariant still needs external locking.',
          code: `public class BufferDemo {
    public static void main(String[] args) {
        StringBuffer buffer = new StringBuffer("abc");
        buffer.append('-').append(123).reverse();
        System.out.println(buffer); // 321-cba

        StringBuffer shared = new StringBuffer();
        Runnable task = () -> {
            synchronized (shared) {       // make the pair atomic
                shared.append("x");
                shared.append("y");
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println(shared.length()); // 4
    }
}`,
        },
      ],
      keyTakeaways: [
        'String methods return new strings; indexOf returns -1 when absent.',
        'strip handles Unicode whitespace, trim only low ASCII whitespace.',
        'equals compares content, compareTo orders lexicographically, and == compares references.',
        'StringBuilder is mutable and fast but not thread-safe; StringBuffer synchronizes each method.',
        'Pre-size buffers to avoid repeated growth and copying.',
      ],
      interviewTips: [
        'Contrast StringBuilder and StringBuffer on synchronization, performance, and compound atomicity.',
        'Point out that split and replaceAll take regexes, while replace takes a literal.',
        'Explain why compareTo is not a substitute for equals in sorted collections.',
      ],
      pitfalls: [
        'Using == instead of equals for string content.',
        'Treating indexOf’s -1 as a valid index.',
        'Forgetting to escape regex metacharacters in split or replaceAll.',
        'Sharing a StringBuilder across threads without synchronization.',
        'Calling substring in a loop and creating many intermediate strings.',
      ],
      quiz: [
        {
          question: 'Which buffer is safe for concurrent appends without external synchronization?',
          options: ['StringBuilder', 'StringBuffer', 'String', 'CharBuffer only'],
          answerIndex: 1,
          explanation: 'StringBuffer’s mutating methods are synchronized, so individual appends are thread-safe.',
        },
        {
          question: 'What does `" a ".strip()` return?',
          options: ['" a "', '"a"', '" a"', 'null'],
          answerIndex: 1,
          explanation: 'strip removes leading and trailing Unicode whitespace, returning a new string.',
        },
      ],
    },
    {
      slug: 'generics',
      title: 'Generics & Bounded Types',
      order: 16,
      summary: 'Type parameters, compile-time safety, bounds that unlock behavior, and the erasure that makes generics a compile-time illusion.',
      level: 'advanced',
      subtopics: [
        {
          id: 'why-generics',
          title: 'Why generics exist',
          body: `Before generics, collections stored \`Object\`. Retrieving an element required a cast, and the cast could fail at runtime with \`ClassCastException\` far from the bug that inserted the wrong type. Generics move that check to the compiler.\n\n\`List<String> names\` promises that only strings are added and that \`get\` returns a \`String\` without a cast. The compiler inserts the necessary casts for you and rejects invalid additions. The result is type safety without runtime overhead beyond those casts.\n\nGenerics also document intent in the type. A \`Map<UserId, Order>\` communicates more than a raw \`Map\`. The cost is complexity in generic APIs, especially wildcards, which is why bounded types and PECS deserve deliberate study.`,
        },
        {
          id: 'generic-classes',
          title: 'Generic classes',
          body: `A generic class declares type parameters: \`class Box<T> { private T value; ... }\`. \`T\` is a compile-time placeholder replaced by a concrete type argument at use sites, such as \`Box<String>\`.\n\nInside the class, \`T\` is a reference type, so primitives must be boxed. Static members cannot use the class's type parameter because they are shared across all parameterizations; a static generic method must declare its own \`<U>\`. You cannot instantiate \`new T()\` or create a generic array \`new T[n]\` directly, because erasure removes the type at runtime.\n\nMultiple type parameters are allowed: \`class Pair<K, V>\`. Keep parameter names meaningful (\`K\`, \`V\`, \`T\`, \`E\`) and avoid classes with many parameters that make call sites unreadable.`,
        },
        {
          id: 'generic-methods',
          title: 'Generic methods and inference',
          body: `A generic method declares its own type parameters before the return type: \`static <T> T first(List<T> values)\`. The compiler infers \`T\` from the arguments, or you can specify it explicitly with \`Util.<String>first(list)\`.\n\nInference uses the target type and argument types. It can fail in surprising ways with nested generics, which is why explicit type witnesses sometimes improve readability. Generic methods can be static or instance methods and can appear in ordinary or generic classes.\n\nVarargs plus generics produce **heap pollution**: a \`T...\` parameter is erased to \`Object[]\`, and the compiler cannot guarantee the array's element type. \`@SafeVarargs\` suppresses the warning only when the method never stores or exposes the array. Avoid generic array creation when possible.`,
        },
        {
          id: 'bounded-types',
          title: 'Bounded type parameters',
          body: `A bound restricts the type argument: \`<T extends Number>\` accepts \`Integer\`, \`Double\`, and other numeric wrappers. Inside the generic code, you can call \`Number\` methods such as \`doubleValue()\` because the compiler knows the bound.\n\nMultiple bounds are allowed with an ampersand: \`<T extends Comparable<T> & Serializable>\`. At most one bound may be a class, and it must come first; the rest are interfaces. The erasure of \`T\` becomes the first bound.\n\nBounds express requirements, not inheritance of the generic class. \`<T extends Comparable<T>>\` is the standard way to require natural ordering, enabling \`compareTo\` inside a sort or max method. Prefer the narrowest bound that supports the operations you need.`,
        },
        {
          id: 'type-erasure',
          title: 'Type erasure',
          body: `The compiler erases type parameters, replacing them with their bounds (or \`Object\`) and inserting casts at use sites. \`List<String>\` and \`List<Integer>\` both become \`List\` at runtime. This preserves binary compatibility with pre-generics code, but it means the JVM does not know the element type.\n\nConsequences: you cannot use \`instanceof List<String>\` (only \`instanceof List\`), cannot create \`new T()\`, cannot have two overloads that differ only in type arguments, and cannot catch a generic exception type. Static members cannot reference the class's type parameter.\n\nWhen a subclass narrows a generic supertype, the compiler may generate **bridge methods** to preserve polymorphism after erasure. They are synthetic and usually invisible, but they appear in stack traces and reflection.`,
        },
        {
          id: 'invariance',
          title: 'Generics are invariant',
          body: `\`List<Integer>\` is **not** a subtype of \`List<Number>\`, even though \`Integer\` extends \`Number\`. If it were, you could add a \`Double\` through the \`List<Number>\` reference and corrupt the original list. Invariance is what makes generic collections type-safe.\n\nArrays are different: \`Integer[]\` is a subtype of \`Number[]\` because arrays are covariant. That historical design allows \`Object[] objects = new Integer[1]; objects[0] = "x";\`, which compiles but throws \`ArrayStoreException\` at runtime. Generics chose compile-time safety over covariance.\n\nWildcards restore flexibility for read-only or write-only use cases. They are the subject of the next topic: \`? extends\` for producers, \`? super\` for consumers.`,
        },
      ],
      javaCode: [
        {
          title: 'A generic container with a static factory',
          description: 'The class parameter is per-instance; the static factory declares its own type parameter.',
          code: `public class Box<T> {
    private T value;

    public Box(T value) { this.value = value; }

    public T get() { return value; }

    public void set(T value) { this.value = value; }

    public static <U> Box<U> of(U value) {
        return new Box<>(value);
    }

    public static void main(String[] args) {
        Box<String> text = Box.of("hello");
        Box<Integer> number = Box.of(42);

        text.set("world");
        number.set(7);

        String s = text.get();       // no cast needed
        int n = number.get();        // auto-unboxing
        System.out.println(s + " " + n);
    }
}`,
        },
        {
          title: 'A bounded generic method',
          description: 'The Comparable bound lets the method call compareTo while accepting any naturally ordered type.',
          code: `import java.util.List;

public class MaxDemo {
    static <T extends Comparable<T>> T max(List<T> values) {
        if (values.isEmpty()) throw new IllegalArgumentException("empty list");
        T best = values.get(0);
        for (T value : values) {
            if (value.compareTo(best) > 0) best = value;
        }
        return best;
    }

    public static void main(String[] args) {
        System.out.println(max(List.of(3, 9, 4)));       // 9
        System.out.println(max(List.of("pear", "apple"))); // pear

        // max(List.of(new Object())); // does not compile: Object is not Comparable
    }
}`,
        },
        {
          title: 'Erasure makes type arguments disappear',
          description: 'Both lists share the same runtime class; the compiler supplies casts and rejects unsafe adds.',
          code: `import java.util.ArrayList;
import java.util.List;

public class ErasureDemo {
    static void inspect(List<?> list) {
        System.out.println(list.getClass().getName()); // java.util.ArrayList
    }

    public static void main(String[] args) {
        List<String> strings = new ArrayList<>();
        List<Integer> numbers = new ArrayList<>();

        System.out.println(strings.getClass() == numbers.getClass()); // true

        strings.add("hello");
        // strings.add(42); // compile error
        String value = strings.get(0); // compiler inserts a cast
        System.out.println(value);

        inspect(strings);
        inspect(numbers);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Generics catch type errors at compile time and remove manual casts.',
        'Type parameters are reference types; primitives are boxed.',
        'Generic methods declare their own type parameters and rely on inference.',
        'Bounds restrict type arguments and expose bound methods inside generic code.',
        'Erasure removes type arguments at runtime, so generic type checks and instantiation are limited.',
        'Generic types are invariant, unlike covariant arrays.',
      ],
      interviewTips: [
        'Define type erasure and list three restrictions it causes.',
        'Explain why List<Integer> cannot be assigned to List<Number>, using the unsafe-add argument.',
        'Show a bounded method such as <T extends Comparable<T>> T max(...) and why the bound is needed.',
      ],
      pitfalls: [
        'Trying to instantiate a type parameter with new T().',
        'Using instanceof with a parameterized type.',
        'Assuming generics prevent all runtime type errors in raw or legacy code.',
        'Declaring overloads that differ only by type arguments.',
        'Using @SafeVarargs on a method that exposes its varargs array.',
      ],
      quiz: [
        {
          question: 'What is the runtime type of `List<String>` after erasure?',
          options: ['List<String>', 'List', 'String[]', 'Object'],
          answerIndex: 1,
          explanation: 'Type arguments are erased; both List<String> and List<Integer> are just List at runtime.',
        },
        {
          question: 'Why is `List<Integer>` not a `List<Number>`?',
          options: ['Integer is not a Number', 'It would allow adding a Double through the Number view', 'Generics are always immutable', 'Because of primitive boxing'],
          answerIndex: 1,
          explanation: 'Covariance would break type safety: a Double added via List<Number> would corrupt the List<Integer>.',
        },
      ],
    },
    {
      slug: 'wildcards',
      title: 'Wildcards: ?, extends & super',
      order: 17,
      summary: 'Reading with extends, writing with super, and using PECS to make generic APIs flexible without sacrificing safety.',
      level: 'advanced',
      subtopics: [
        {
          id: 'invariance-problem',
          title: 'The invariance problem',
          body: `A method that sums numbers naturally wants to accept \`List<Integer>\`, \`List<Double>\`, and \`List<Long>\`. But \`List<Integer>\` is not a \`List<Number>\`, so \`sum(List<Number>)\` rejects it. Generics are invariant for safety.\n\nWildcards relax the element type while preserving the list's identity. \`List<? extends Number>\` means "a list of some specific subtype of Number, unknown to the caller." The method can read elements as \`Number\`, but it cannot add, because the unknown subtype might be \`Integer\` and a \`Double\` would be invalid.\n\nThis is the core trade-off: wildcards trade write access for read flexibility. Choosing the right bound is about what the method does with the collection, not about what looks most permissive.`,
        },
        {
          id: 'unbounded-wildcard',
          title: 'The unbounded wildcard',
          body: `\`List<?>\` means a list of some unknown type. You can read elements only as \`Object\`, check \`size()\`, iterate, and clear the list. You cannot add anything except \`null\`, because the compiler cannot verify the element type.\n\nIt is useful for methods that only need structural operations: printing, counting, or passing the collection to another API that accepts \`List<?>\`. It is not a license to treat the list as \`List<Object>\`; that would be unsafe.\n\nUse \`? extends Object>\` only when you need to express a bound explicitly; \`?\` is the idiomatic form. Prefer a type parameter when the method needs to name the type and relate multiple arguments.`,
        },
        {
          id: 'upper-bounded-wildcard',
          title: 'Upper bounds: ? extends',
          body: `\`List<? extends Number>\` accepts \`List<Number>\`, \`List<Integer>\`, and \`List<Double>\`. Reading returns \`Number\`; writing is prohibited (except \`null\`) because the actual element type is unknown.\n\nThis is the **producer** shape: the collection produces values that the method consumes. A sum, a printer, or a mapper that only reads fits perfectly. The upper bound also lets you call methods of the bound, such as \`doubleValue()\`.\n\nDo not use \`? extends\` for a parameter you need to fill. If the method adds elements, the wildcard makes the code uncompilable, and you will be tempted to cast unsafely. Switch to a type parameter or \`? super\`.`,
        },
        {
          id: 'lower-bounded-wildcard',
          title: 'Lower bounds: ? super',
          body: `\`List<? super Integer>\` accepts \`List<Integer>\`, \`List<Number>\`, and \`List<Object>\`. You can add an \`Integer\` safely, because every accepted list can hold one. Reading returns \`Object\`, since the compiler only knows the element type is a supertype of Integer.\n\nThis is the **consumer** shape: the collection consumes values the method produces. Filling a destination list, accumulating results, or accepting a comparator that can compare supertypes fits here.\n\nThe JDK uses this in \`List.addAll(Collection<? extends E>)\` for the source and \`Collections.sort(List<T>, Comparator<? super T>)\` for the comparator. The comparator only needs to handle T or a supertype; it does not need to be specific to T.`,
        },
        {
          id: 'pecs',
          title: 'PECS: producer extends, consumer super',
          body: `**PECS** — Producer Extends, Consumer Super — is the decision rule. If a parameter produces values your method reads, use \`? extends T\`. If it consumes values your method writes, use \`? super T\`. If it does both, use an exact type parameter \`T\`.\n\nThe classic \`copy\` signature is \`static <T> void copy(List<? super T> dest, List<? extends T> src)\`. The source produces T, the destination consumes T, and T is inferred from the arguments. This accepts more call sites than either exact \`List<T>\` or a wildcard on both sides.\n\nPECS is a heuristic, not a law. It assumes the method only reads or only writes. A method that reads and writes needs a named type parameter so the compiler can guarantee consistency.`,
        },
        {
          id: 'wildcard-capture',
          title: 'Capture conversion',
          body: `Each use of \`?\` introduces a fresh, unnamed type variable called a **capture**. \`List<?>\` is not \`List<Object>\`; it is \`List<CAP#1>\` where \`CAP#1\` is some unknown type. The compiler tracks that identity within the expression.\n\nCaptures explain why \`list.set(0, list.get(1))\` fails for \`List<?>\`: the get returns \`CAP#1\` and the set expects \`CAP#1\`, which the compiler cannot prove are the same. A generic helper method captures the type once and restores the relationship.\n\nYou rarely name captures explicitly. When you hit a wildcard error, write a private generic helper and pass the wildcard list to it; the helper's type parameter captures the unknown type safely. This is the standard "capture helper" idiom.`,
        },
      ],
      javaCode: [
        {
          title: 'Reading with ? extends',
          description: 'The method accepts any numeric list, reads as Number, and cannot add to it.',
          code: `import java.util.List;

public class NumberSum {
    static double sum(List<? extends Number> values) {
        double total = 0;
        for (Number value : values) {
            total += value.doubleValue();
        }
        // values.add(1); // compile error: unknown subtype of Number
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sum(List.of(1, 2, 3)));       // 6.0
        System.out.println(sum(List.of(1.5, 2.5)));      // 4.0
        System.out.println(sum(List.of(1L, 2L, 3L)));    // 6.0
    }
}`,
        },
        {
          title: 'PECS in a copy method',
          description: 'Source extends, destination super, and T is inferred to connect them safely.',
          code: `import java.util.ArrayList;
import java.util.List;

public class PecsDemo {
    static <T> void copy(List<? super T> destination, List<? extends T> source) {
        for (T item : source) {
            destination.add(item);
        }
    }

    public static void main(String[] args) {
        List<Integer> source = List.of(1, 2, 3);
        List<Number> destination = new ArrayList<>();

        copy(destination, source); // T inferred as Integer
        System.out.println(destination); // [1, 2, 3]

        List<Object> objects = new ArrayList<>();
        copy(objects, source);
        System.out.println(objects); // [1, 2, 3]
    }
}`,
        },
        {
          title: 'A capture helper for swap',
          description: 'The wildcard API delegates to a generic method that captures the element type once.',
          code: `import java.util.List;

public class CaptureDemo {
    static void swap(List<?> list, int i, int j) {
        swapHelper(list, i, j); // capture conversion happens here
    }

    private static <T> void swapHelper(List<T> list, int i, int j) {
        T temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }

    public static void main(String[] args) {
        List<String> words = new java.util.ArrayList<>(List.of("a", "b", "c"));
        swap(words, 0, 2);
        System.out.println(words); // [c, b, a]
    }
}`,
        },
      ],
      keyTakeaways: [
        'Wildcards relax generic invariance for read or write flexibility.',
        '? extends T is for producers: read as T, do not add.',
        '? super T is for consumers: add T, read as Object.',
        'PECS — producer extends, consumer super — guides API signatures.',
        'A wildcard introduces an unknown captured type; a generic helper can restore relationships.',
      ],
      interviewTips: [
        'Explain PECS with the copy(dest, src) signature and what T is inferred to.',
        'Describe why List<? extends Number> cannot accept add(1).',
        'Use the swap capture-helper example when asked about wildcard capture errors.',
      ],
      pitfalls: [
        'Trying to add to a ? extends collection.',
        'Treating List<?> as List<Object> and attempting adds.',
        'Using wildcards when an exact type parameter is needed for both reads and writes.',
        'Assuming ? super T lets you read T rather than Object.',
        'Forgetting that PECS is about the method’s role, not the collection’s declaration.',
      ],
      quiz: [
        {
          question: 'Which parameter type lets a method add Integers to any accepted list?',
          options: ['List<? extends Integer>', 'List<? super Integer>', 'List<?>', 'List<Integer> only'],
          answerIndex: 1,
          explanation: 'A lower bound guarantees the list can hold Integer values; the upper bound would forbid adds.',
        },
        {
          question: 'In `copy(List<? super T> dest, List<? extends T> src)`, which side is the producer?',
          options: ['dest', 'src', 'Both', 'Neither'],
          answerIndex: 1,
          explanation: 'src produces T values (extends); dest consumes them (super).',
        },
      ],
    },
  ],
};
