import type { JavaModule } from '../../types/java.ts';

export const module01: JavaModule = {
  slug: 'fundamentals',
  title: 'Fundamentals',
  order: 1,
  summary: 'The Java platform, memory-level data representation, operators, control flow, arrays and methods.',
  overview:
    'Start at the bottom of the stack: how source code becomes bytecode, how the JVM loads and executes it, and how primitives are laid out bit by bit in memory. From there the module builds upward through conversion rules, every operator family, control flow, arrays and methods, always connecting syntax to the machine underneath it.',
  topics: [
    {
      slug: 'introduction-to-java',
      vizId: 'introduction-to-java',
      youtubeUrls: [
        'https://www.youtube.com/watch?v=CqLiWuT4a0c',
      ],
      title: 'Introduction to Java',
      order: 1,
      level: 'beginner',
      summary: 'Why Java was created, its three goals of portability, simplicity and security, and how bytecode with the JVM enables Write Once, Run Anywhere.',
      sections: [
        {
          heading: 'Why Java was created: portability, simplicity, security',
          body: 'Before Java, C and C++ compiled programs directly into native machine code for a specific processor architecture and operating system. A binary built for Windows on Intel would not run on a Mac or Linux system. This created a massive portability problem requiring recompilation, retesting and often rewriting low-level assumptions for every new platform.\n\nJava was engineered to solve three fundamental challenges:\n\n1. **Portability (Platform Independence)** — Java compiles source code to bytecode instead of native machine code, and a platform-specific JVM translates bytecode into local OS instructions.\n2. **Simplicity** — Java strips out complex, error-prone C++ features such as direct pointer manipulation, multiple inheritance for classes and manual memory management.\n3. **Security** — Java runs bytecode within a restricted JVM sandbox model, preventing untrusted code from unauthorized system memory access.',
        },
        {
          heading: 'Bytecode and the JVM execution model',
          body: 'Instead of compiling `.java` source directly into machine code, Java performs a two-stage process:\n\n1. `javac` compiles source code into `.class` files containing **bytecode** — an intermediate representation.\n2. The **JVM** loads the bytecode, verifies it through the bytecode verifier, and executes it using a hybrid engine combining an interpreter and a Just-In-Time (JIT) compiler.\n\nModern JVMs identify execution hot spots — frequently executed loops or methods — and compile those bytecode sequences directly into native machine code at runtime, caching the result for subsequent invocations.',
        },
        {
          heading: 'Write Once, Run Anywhere (WORA)',
          body: 'The JVM is a platform-specific abstraction that sits between bytecode and the underlying operating system and processor. Because every supported platform ships its own JVM implementation, one `.class` artifact runs on any machine with a JVM without recompilation. This is the realization of **Write Once, Run Anywhere**.\n\nJava also achieves simplicity through automatic garbage collection instead of manual `malloc`/`free`, encapsulated object references instead of explicit pointer arithmetic, and interfaces instead of multiple inheritance for classes (avoiding the Diamond Problem).',
        },
      ],
      javaCode: [
        {
          title: 'Your first Java program',
          description: 'A minimal Hello World program showing the classic main method signature.',
          code: `public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
        },
        {
          title: 'Inspecting bytecode with javap',
          description: 'Compile and disassemble to see the bytecode the JVM will execute.',
          code: `// Save as HelloJava.java, then run:
// javac HelloJava.java
// javap -c HelloJava   // disassemble to view bytecode instructions`,
        },
      ],
      complexity: [],
      mistakes: [
        'Thinking Java compiles directly to machine code like C/C++; it compiles to bytecode for the JVM.',
        'Forgetting that the class name (not the file name) is what you pass to the `java` launcher.',
        'Assuming `javac` and `java` are the same tool; `javac` compiles, `java` launches the JVM.',
      ],
      quiz: [
        {
          question: 'What does Java compile source code into, instead of native machine code?',
          options: ['Executable binary', 'Bytecode', 'Assembly', 'Machine code'],
          answerIndex: 1,
          explanation: 'javac compiles .java source into .class files containing JVM bytecode, an intermediate representation.',
        },
        {
          question: 'Which component translates bytecode into local OS instructions?',
          options: ['javac compiler', 'JVM (Java Virtual Machine)', 'JDK compiler', 'Garbage collector'],
          answerIndex: 1,
          explanation: 'The JVM loads and executes bytecode, translating it to native instructions for the host platform.',
        },
      ],
    },
    {
      slug: 'java-platform-and-execution',
      vizId: 'fundamentals',
      youtubeUrls: [
        'https://www.youtube.com/watch?v=rNoEkRNoZug',
      ],
      title: 'The Java Platform: JDK, JRE & JVM',
      order: 2,
      level: 'beginner',
      summary: 'How Java source becomes bytecode and how the JVM, JRE and JDK fit together to run it anywhere.',
      sections: [
        { heading: 'Why Java exists: portability, simplicity, safety', body: 'In C and C++ a compiler emits machine code for one specific instruction set and operating system. A binary built for Windows on x86 does not run on macOS on ARM, and moving to a new platform means recompiling, retesting and often rewriting low-level assumptions. Java was designed around three goals that attack this problem directly.\n\n**Portability.** Java compiles to an intermediate instruction set called bytecode rather than to native machine code. Every supported platform ships its own implementation of the machine that understands that bytecode, so one build artifact runs everywhere. This is the idea behind **Write Once, Run Anywhere**.\n\n**Simplicity.** The language omits raw pointers, pointer arithmetic, multiple inheritance for classes and manual memory management. References are typed and checked, and the garbage collector reclaims unreachable objects, removing an entire class of use-after-free and double-free bugs.\n\n**Safety.** Untrusted bytecode executes inside a restricted runtime. The class loader enforces namespaces, the bytecode verifier rejects malformed or type-unsafe code before it runs, and the security model mediates access to files, sockets and system properties.',
        },
        { heading: 'From .java to .class: what the compiler actually emits', body: 'Running `javac Hello.java` performs four conceptual stages: lexical analysis, parsing into an abstract syntax tree, semantic analysis with type checking, then code generation. The output is `Hello.class`, a binary container whose format is defined by the JVM specification and whose contents are **JVM instructions**, not x86 or ARM instructions.\n\nA class file holds more than instructions. It contains a constant pool (interned strings, class and method references, numeric constants), field and method descriptors, access flags, exception tables, and a `StackMapTable` describing the type state at every branch target so the verifier can check control flow cheaply.\n\nThe compiler also rewrites convenient syntax into simpler bytecode. A `switch` on `String` becomes a hash lookup plus `equals` calls; an enhanced `for` loop over an array becomes an index loop; a lambda becomes an invokedynamic call site; `finally` blocks are duplicated into the normal and exceptional paths. Use `javap -c -p Hello.class` to read the disassembly and see exactly what the JVM will execute.',
        },
        { heading: 'Inside the JVM: loader, runtime areas, execution engine', body: 'The JVM is an abstract machine with three cooperating subsystems.\n\n**Class loader subsystem.** Loading finds the bytes, linking verifies, prepares and optionally resolves symbolic references, and initialization runs static initializers in a strict order. Loaders form a delegation hierarchy: bootstrap, platform, then application, each preferring its parent first.\n\n**Runtime data areas.** Each thread owns a private **stack** of frames plus a program counter. Shared across threads are the **heap** for objects and arrays, and **metaspace** for class metadata (native memory since Java 8, replacing the old permanent generation). The method area lives inside metaspace.\n\n**Execution engine.** The interpreter walks bytecode one instruction at a time. The JIT compiler promotes frequently executed methods to native code. The garbage collector reclaims heap memory using generational collectors such as G1 or ZGC. Native method access goes through JNI.\n\nStack frames are cheap (a few hundred bytes each) but bounded: deep recursion raises `StackOverflowError`, not an ordinary exception you can easily recover from.',
        },
        { heading: 'The JDK, JRE and JVM hierarchy', body: 'The three acronyms describe nested layers of the same product.\n\n| Layer | Contains | Used by |\n| :--- | :--- | :--- |\n| JVM | Interpreter, JIT, GC, class loader, runtime areas | Runtime only |\n| JRE | JVM plus the core class libraries | End users running applications |\n| JDK | JRE plus development tools (`javac`, `jar`, `javadoc`, `jdb`, `jlink`, `jpackage`, `javap`) | Developers building applications |\n\nHistorically the JRE was a separately downloadable package. Since Java 11 there is no standalone JRE distribution: you install a JDK and, if you need a slim runtime, produce one with `jlink` or bundle one with `jpackage`. The class libraries themselves were modularized in Java 9 into the `java.base` module plus optional modules such as `java.sql`, `java.desktop` and `java.net.http`.\n\nPractical consequence: if a machine can run `java Hello` it has a JVM and the core libraries. If it can run `javac` it has a JDK. A common production error, `javac is not recognized`, simply means a JRE-only or misconfigured `PATH`.',
        },
        { heading: 'The full execution pipeline and the main method', body: 'The lifecycle of a typical program looks like this:\n\n- `javac -d out src/Hello.java` writes `out/Hello.class`, recording the source file name and line numbers for stack traces.\n- `java -cp out Hello` starts a JVM, creates the bootstrap loader, then asks the application loader for `Hello`.\n- The class is loaded, verified, prepared (static fields zeroed), and initialized (static blocks and field initializers run top to bottom).\n- The launcher looks for `public static void main(String[] args)`, wraps the arguments into a fresh `String[]`, and invokes it on a new thread called `main`.\n- When `main` returns and all non-daemon threads finish, the JVM shuts down and runs shutdown hooks.\n\nSignature details matter. `main` must be `public`, `static`, return `void`, and take exactly one `String[]` parameter (varargs `String...` is equivalent). `static void main()` compiles but is rejected at launch. Since Java 21 a `void main()` instance method in a class with no constructor is also accepted as a preview convenience, but the classic signature remains the portable choice.',
        },
        { heading: 'Interpreter, JIT and tiered compilation', body: 'Pure interpretation is portable but slow, so HotSpot combines it with dynamic compilation. Every method starts interpreted; counters record invocations and backward branches. When a threshold is crossed the method is queued for compilation by the C1 compiler, which optimizes quickly with modest gains. Very hot methods are recompiled by C2 with aggressive optimizations: inlining, escape analysis, loop unrolling, dead code elimination and constant folding.\n\nThis is **tiered compilation** and it is why Java performance grows during a run: a benchmark measured in the first second is measuring the interpreter. JVM warm-up is therefore a real production concern, and microbenchmarks need a harness such as JMH to reach a steady state.\n\nSpeculative optimizations must stay correct. If a class is loaded that invalidates a guard, or a branch profile turns out wrong, the JVM performs **deoptimization**: it discards the compiled frame and resumes in the interpreter with the same logical state. Options such as `-XX:+PrintCompilation` and `-XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining` show these decisions. Ahead-of-time compilation and class data sharing reduce startup cost for short-lived processes.',
        },
      ],
      javaCode: [
        {
          title: 'Inspecting the runtime you are on',
          description: 'Prints the JVM implementation, specification version and processor count that the current process is using.',
          code: `public class PlatformInfo {
    public static void main(String[] args) {
        System.out.println("JVM vendor     : " + System.getProperty("java.vm.vendor"));
        System.out.println("JVM name       : " + System.getProperty("java.vm.name"));
        System.out.println("Java version   : " + System.getProperty("java.version"));
        System.out.println("Runtime version: " + Runtime.version());
        System.out.println("Spec version   : " + System.getProperty("java.specification.version"));
        System.out.println("Class version  : " + System.getProperty("java.class.version"));
        System.out.println("CPUs           : " + Runtime.getRuntime().availableProcessors());
        System.out.println("Max heap bytes : " + Runtime.getRuntime().maxMemory());
    }
}`,
        },
        {
          title: 'From source file to running class',
          description: 'A minimal program showing that the launcher needs a class name, not a file name, and that args is a real array.',
          code: `public class HelloPlatform {
    public static void main(String[] args) {
        // Compiled with: javac HelloPlatform.java
        // Executed with: java HelloPlatform one two
        System.out.println("Received " + args.length + " argument(s)");
        for (int i = 0; i < args.length; i++) {
            System.out.printf("args[%d] = %s%n", i, args[i]);
        }
        // The class name is what the launcher resolves; the .class suffix is implied.
        System.out.println("Loaded by: " + HelloPlatform.class.getClassLoader());
    }
}`,
        },
        {
          title: 'What the compiler does to a loop',
          description: 'Two loops that read identically at the source level but compile to different bytecode shapes.',
          code: `import java.util.List;

public class CompilerRewrites {
    public static int sumArray(int[] values) {
        int sum = 0;
        // Enhanced for over an array: javac emits an index loop with arraylength.
        for (int value : values) {
            sum += value;
        }
        return sum;
    }

    public static int sumList(List<Integer> values) {
        int sum = 0;
        // Enhanced for over an Iterable: javac emits an Iterator with hasNext/next.
        for (int value : values) {
            sum += value;
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(sumArray(new int[] {1, 2, 3, 4}));      // 10
        System.out.println(sumList(List.of(1, 2, 3, 4)));          // 10
        // Run: javap -c CompilerRewrites   to compare the two loop bodies.
    }
}`,
        },
      ],
      keyTakeaways: [
        'Java compiles to bytecode for an abstract machine, so one artifact runs on any platform with a JVM.',
        'The JDK contains the JRE, and the JRE contains the JVM; the JVM alone cannot compile anything.',
        'The JVM verifies bytecode before execution, which is why loading a class is a multi-step process.',
        'HotSpot starts interpreted and promotes hot methods through C1 and C2 in tiered compilation.',
        'StackOverflowError comes from the per-thread stack, not from heap exhaustion.',
      ],
      interviewTips: [
        'Draw the JDK to JRE to JVM nesting and name one tool that lives only in the JDK.',
        'Explain that bytecode is portable while the JVM implementation is platform specific.',
        'Mention deoptimization when asked whether JIT optimizations can ever be wrong.',
      ],
      pitfalls: [
        'Saying the JVM compiles source code; javac does that, the JVM compiles bytecode.',
        'Forgetting that metaspace replaced the permanent generation in Java 8.',
        'Assuming Java is purely interpreted, or purely compiled. It is both, adaptively.',
        'Believing a standalone JRE download still exists for modern JDKs.',
      ],
      quiz: [
        {
          question: 'Which component turns a .java file into a .class file?',
          options: ['The JVM interpreter', 'The JIT compiler', 'javac, the Java compiler in the JDK', 'The garbage collector'],
          answerIndex: 2,
          explanation: 'javac performs parsing, type checking and code generation to bytecode. The JVM only consumes the resulting class file.',
        },
        {
          question: 'What does the JIT compiler optimize?',
          options: ['Source files before compilation', 'Frequently executed bytecode, by compiling it to native machine code at runtime', 'The class path ordering', 'Garbage collection pauses only'],
          answerIndex: 1,
          explanation: 'HotSpot profiles running code and compiles hot methods to native code with C1 and C2, deoptimizing if assumptions break.',
        },
      ],
    },
    {
      slug: 'variables-and-data-types',
      vizId: 'variables-and-data-types',
      youtubeUrls: [
        'https://www.youtube.com/watch?v=ooi48YHtrc8',
      ],
      title: 'Variables, Literals & Primitive Types',
      order: 3,
      level: 'beginner',
      summary: 'Declaring variables, the eight primitive types with exact ranges and defaults, and every literal form.',
      sections: [
        { heading: 'Variables, declaration and scope', body: 'A variable is a named storage location with a declared type. Java is statically typed: the compiler must know the type of every expression before the program runs, and that type never changes for a given variable.\n\nThere are three kinds of variables, distinguished by where they live and how long they survive.\n\n- **Local variables** are declared inside a method, constructor or block. They live on the stack frame of the invocation and disappear when it returns. They have no default value; reading one before assignment is a compile error.\n- **Instance fields** belong to each object and live on the heap inside that object. They get default values automatically.\n- **Static fields** belong to the class itself, are stored once in metaspace-adjacent class data, and are initialized when the class is initialized.\n\nScope is block-structured. A variable declared in a block is visible only inside it, and Java forbids shadowing a local variable with another local of the same name in an overlapping scope. Shadowing a field with a local or parameter is legal, which is why `this.value = value` is a common idiom.\n\nDeclaration, initialization and assignment are distinct: `int x;` declares, `int x = 5;` initializes, `x = 7;` assigns. A `final` variable may be assigned exactly once.',
        },
        { heading: 'Identifiers, keywords and naming conventions', body: 'An identifier names a class, method, variable, package or type parameter. The rules are enforced by the compiler:\n\n- The first character must be a letter, `_`, or `$`. Digits are allowed only after the first character.\n- Subsequent characters may be letters, digits, `_`, `$`, or any Unicode letter or combining mark.\n- Identifiers are case sensitive and have no practical length limit.\n- Reserved words cannot be used. `class`, `int`, `if`, `return`, `null`, `true` and `false` are all reserved.\n\nJava reserves around fifty keywords. `const` and `goto` are reserved but unused, kept only to produce clear errors for C programmers. A second group is **contextual**: `var`, `record`, `sealed`, `permits`, `yield`, `module` and `open` are only special in specific syntactic positions, so old code using them as identifiers still compiles.\n\nConventions are not enforced but are universal: `camelCase` for variables and methods, `PascalCase` for classes and records, `SCREAMING_SNAKE_CASE` for constants, lowercase package names. A name like `int totalCount` costs nothing and removes the need for a comment. Single letters are acceptable only as loop indices or coordinates.',
        },
        { heading: 'The eight primitive types and their widths', body: 'Java has exactly eight primitive types. Their widths are fixed by the language specification, unlike C where `int` depends on the platform. This is a portability guarantee.\n\n| Type | Bits | Bytes | Range or precision | Default |\n| :--- | :--- | :--- | :--- | :--- |\n| `byte` | 8 | 1 | -128 to 127 | `0` |\n| `short` | 16 | 2 | -32,768 to 32,767 | `0` |\n| `int` | 32 | 4 | -2,147,483,648 to 2,147,483,647 | `0` |\n| `long` | 64 | 8 | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | `0L` |\n| `float` | 32 | 4 | about 7 significant decimal digits | `0.0f` |\n| `double` | 64 | 8 | about 15 to 16 significant decimal digits | `0.0d` |\n| `char` | 16 | 2 | `\\u0000` to `\\uffff`, unsigned | `\\u0000` |\n| `boolean` | not specified | not specified | `true` or `false` | `false` |\n\nNote the asymmetry: `char` is the only unsigned integral type, and `boolean` has no defined size because the JVM uses `int` in arrays and bytecode but may pack bits in fields.\n\nThe `float` type is 32-bit IEEE 754 and is rarely the right choice. Use `double` by default, `int` or `long` for counters, `char` for single code units, and `boolean` for flags. Reach for `BigInteger` and `BigDecimal` when range or decimal exactness exceeds primitives.',
        },
        { heading: 'Default values and the initialization gap', body: 'Fields receive defaults; locals do not. This asymmetry exists so the JVM never has to zero stack slots and so the compiler can catch sloppy code.\n\n| Field type | Default |\n| :--- | :--- |\n| `byte`, `short`, `int`, `long` | `0` |\n| `float`, `double` | `0.0` |\n| `char` | `\\u0000`, which prints as an invisible character |\n| `boolean` | `false` |\n| any reference type | `null` |\n\nReading an uninitialized local is a compile-time error, not a runtime error. Reading an uninitialized field gives a silent zero or `null`, which is more dangerous because it hides bugs. A missing `null` check on a field often surfaces far from its cause.\n\nTwo subtleties are worth remembering. First, array elements are always initialized to defaults, even for `new int[1000]`, which is why allocating an array is not free. Second, `final` fields must be definitely assigned by the end of every constructor, otherwise compilation fails.\n\nBecause `char` defaults to `\\u0000`, printing an uninitialized `char[]` element can look like missing output. Use `Arrays.toString` or an explicit cast to `int` to see the numeric value.',
        },
        { heading: 'Literals: every way to write a constant', body: 'Integer literals are `int` by default. `42` is decimal, `0x2A` hexadecimal, `052` octal, `0b101010` binary. Underscores improve readability and are ignored by the compiler: `1_000_000` equals `1000000`. A trailing `L` makes a `long`; `0xFFFFFFFF` is a valid negative `int`, while `0xFFFFFFFFL` is a positive `long`.\n\nFloating-point literals are `double` by default. Add `f` for `float` (`3.14f`), `d` is optional for `double`. Scientific notation is allowed (`6.02e23`, `1.5e-9`). Hex float literals exist (`0x1.8p1` equals 3.0). There is no `float` literal without a suffix when the value has a decimal point: `float f = 1.5;` fails and needs `1.5f`.\n\nA `char` literal uses single quotation marks around exactly one code unit, for example the letter `a`, the newline escape written as backslash-n, or the Unicode escape `\\\\u0041` which denotes `A`. A `String` uses double quotation marks and is interned in the string pool. Text blocks (Java 15+) use triple quotes for multi-line strings, strip incidental indentation and process escapes.\n\nSpecial literals: `null` for references, `true` and `false` for booleans. There is no `null` literal for primitives, and no suffix tricks will make `boolean` numeric.',
        },
        { heading: 'Primitives versus reference types', body: 'A primitive variable holds the value itself. An `int` variable occupies four bytes on the stack or inside an object and contains the number. Copying it copies the number. There is no identity to compare, only value.\n\nA reference variable holds an address-like handle to an object on the heap. Copying it copies the handle, so both variables point at the same object. This is why `==` on two `String` variables compares addresses, not text, and why `equals` exists.\n\nEach primitive has a wrapper class (`Integer`, `Long`, `Character`, `Boolean`, `Double`, and so on) for use in generics, which cannot hold primitives. Autoboxing converts automatically, but the conversion allocates, caches small values (-128 to 127 for `Integer`), and can throw `NullPointerException` when unboxing a `null`. Prefer primitives in hot loops and use wrappers only where the API demands objects.\n\nSince Java 10, `var` infers the static type of a local from its initializer. It is not dynamic typing: `var count = 0;` is exactly an `int`, and `var x;` without an initializer does not compile.',
        },
      ],
      javaCode: [
        {
          title: 'Every primitive with its range',
          description: 'Uses the wrapper constants to print the exact bounds instead of relying on memory.',
          code: `public class PrimitiveRanges {
    public static void main(String[] args) {
        System.out.printf("byte   %d .. %d%n", Byte.MIN_VALUE, Byte.MAX_VALUE);
        System.out.printf("short  %d .. %d%n", Short.MIN_VALUE, Short.MAX_VALUE);
        System.out.printf("int    %d .. %d%n", Integer.MIN_VALUE, Integer.MAX_VALUE);
        System.out.printf("long   %d .. %d%n", Long.MIN_VALUE, Long.MAX_VALUE);
        System.out.printf("char   %d .. %d%n", (int) Character.MIN_VALUE, (int) Character.MAX_VALUE);
        System.out.printf("float  %e .. %e%n", Float.MIN_VALUE, Float.MAX_VALUE);
        System.out.printf("double %e .. %e%n", Double.MIN_VALUE, Double.MAX_VALUE);
        System.out.println("int bytes    : " + Integer.BYTES);
        System.out.println("double bytes : " + Double.BYTES);
    }
}`,
        },
        {
          title: 'Default values of fields',
          description: 'Shows that instance fields are zero-initialized while locals must be assigned before use.',
          code: `public class Defaults {
    private int count;
    private long total;
    private double ratio;
    private char letter;
    private boolean flag;
    private String name;
    private int[] data;

    public static void main(String[] args) {
        Defaults d = new Defaults();
        System.out.println("count  = " + d.count);
        System.out.println("total  = " + d.total);
        System.out.println("ratio  = " + d.ratio);
        System.out.println("letter = " + (int) d.letter); // 0
        System.out.println("flag   = " + d.flag);
        System.out.println("name   = " + d.name);
        System.out.println("data   = " + d.data);

        int local;
        // System.out.println(local); // compile error: variable not initialized
        local = 10;
        System.out.println("local  = " + local);
    }
}`,
        },
        {
          title: 'Literal forms in one place',
          description: 'Demonstrates decimal, hex, octal, binary, underscore grouping, char escapes and text blocks.',
          code: `public class Literals {
    public static void main(String[] args) {
        int decimal = 1_000_000;
        int hex = 0x2A;          // 42
        int octal = 052;         // 42
        int binary = 0b101010;   // 42
        long big = 9_000_000_000L;
        float f = 3.14f;
        double d = 6.022e23;
        char newline = '\\n';
        char a = '\\u0041';       // 'A'

        String block = """
                line one
                  line two
                """;

        System.out.println(decimal + " " + hex + " " + octal + " " + binary);
        System.out.println(big + " " + f + " " + d);
        System.out.println("escaped:[" + newline + "] code=" + (int) newline);
        System.out.println("a=" + a + " code=" + (int) a);
        System.out.print(block);
    }
}`,
        },
      ],
      keyTakeaways: [
        'Java primitives have fixed widths on every platform, which is what makes bytecode portable.',
        'Fields get default values, locals do not; reading an uninitialized local fails at compile time.',
        'char is an unsigned 16-bit UTF-16 code unit, not a byte, and not an int.',
        'Hex, octal, binary, underscores and text blocks all exist to keep literals readable.',
        'Reference variables store handles, so copying a reference does not copy the object.',
      ],
      interviewTips: [
        'Quote byte and int ranges from memory rather than saying roughly.',
        'Explain why `float f = 1.5;` fails: the literal is a double and narrowing needs a cast or suffix.',
        'Describe the stack versus heap split for a local primitive and a local array reference.',
      ],
      pitfalls: [
        'Assume booleans are 1 bit or convertible to int; neither is true in Java.',
        'Forget the L suffix and overflow a long literal silently.',
        'Expect a local variable to start at zero.',
        'Compare strings with `==` and wonder why equal text is sometimes false.',
      ],
      quiz: [
        {
          question: 'What is the value of an uninitialized boolean field and an uninitialized boolean local?',
          options: ['false and false', 'false and a compile error', 'null and false', '0 and 0'],
          answerIndex: 1,
          explanation: 'Fields are zero-initialized to false. A local without an assignment cannot be read; the compiler rejects it.',
        },
        {
          question: 'Which literal correctly represents a float value of 2.5?',
          options: ['2.5', '2.5d', '2.5f', '0x2.5'],
          answerIndex: 2,
          explanation: 'A decimal literal is a double unless suffixed. Assigning to float needs `2.5f` or a cast.',
        },
      ],
    },
    {
      slug: 'number-representation',
      vizId: 'number-representation',
      youtubeUrls: [
        'https://www.youtube.com/watch?v=yzKcCLtU4JM',
      ],
      title: 'How Java Stores Negative & Floating-Point Numbers',
      order: 4,
      level: 'intermediate',
      summary: 'Two\u2019s complement integers and IEEE 754 floats, worked out bit by bit, with the overflow and precision traps they create.',
      sections: [
        { heading: 'Bits, bytes and the meaning of the sign bit', body: "Memory is a sequence of bits grouped into bytes. A `byte` is eight bits, so it can distinguish 256 patterns. How those patterns map to numbers is a convention, not a law of physics, and the convention determines everything about overflow and comparison.\n\nIn unsigned reading, `11111111` is 255. In signed reading the leftmost bit, the **most significant bit**, carries a negative weight instead of a positive one. For eight bits the weights are -128, 64, 32, 16, 8, 4, 2, 1. So `11111111` becomes -128 + 127 = -1. This single rule produces the entire signed range -128 to 127 with no special cases for zero.\n\nJava has no unsigned integral primitives at the language level. `byte`, `short`, `int` and `long` are all signed. Java 8 added static helpers such as `Integer.divideUnsigned` and `Integer.toUnsignedString` for treating the bits as unsigned, and `Byte.toUnsignedInt` for widening a byte to 0..255, which is exactly what you need when parsing binary file formats.\n\n`char` is the exception: sixteen bits, unsigned, range 0 to 65535, used for UTF-16 code units.",
        },
        { heading: 'Why sign-magnitude and ones\u2019 complement lost', body: "Before two\u2019s complement, two other encodings were common.\n\n**Sign-magnitude** reserves the top bit for the sign and stores the magnitude in the rest. For eight bits, `00000101` is +5 and `10000101` is -5. It is easy for humans and terrible for hardware: there are two zeros (`00000000` and `10000000`), addition and subtraction need separate circuits that first compare signs and magnitudes, and the representable range shrinks to -127 to 127.\n\n**Ones\u2019 complement** stores a negative number by inverting every bit of its positive form: +5 is `00000101`, so -5 is `11111010`. Addition almost works with ordinary binary adders, but a carry out of the top bit must be wrapped around and added back, a step called end-around carry. There are still two zeros, `00000000` and `11111111`.\n\nTwo\u2019s complement fixes both problems by adding one to the inverted form. There is exactly one zero, subtraction is addition of a negation, and the sign bit falls out of the arithmetic naturally. The cost is an asymmetric range: one more negative value than positive, because the pattern that would have been negative zero is reused for the most negative number.",
        },
        { heading: 'Two\u2019s complement, worked end to end', body: "The algorithm for the negative of a value in n bits is: invert every bit, then add one. To store -42 in a `byte`:\n\n- Magnitude: 42 is `00101010`.\n- Invert: `11010101`.\n- Add one: `11010110`, which is -42.\n\nVerify by decoding with weights: -128 + 64 + 16 + 4 + 2 = -42. Verification also works by adding the positive form: `00101010` + `11010110` = `1_00000000`, and the carry out of eight bits is discarded, leaving zero. That discard is not a hack; it is the definition of arithmetic modulo 2^8.\n\nTwo identities follow immediately and are worth memorizing. Negation equals bitwise complement plus one, so `-x == ~x + 1` for every `int` except `Integer.MIN_VALUE`, where negation overflows back to itself. And `~x == -x - 1`, so `~0` is -1 and `~-1` is 0.\n\nThe asymmetry appears at the boundary: in eight bits, `-(-128)` is still -128 because +128 is not representable. The same holds for `Integer.MIN_VALUE`, which is why `Math.abs(Integer.MIN_VALUE)` returns a negative number.",
        },
        { heading: 'Overflow: wraparound, silent bugs and exact arithmetic', body: "Java integer arithmetic wraps on overflow. No exception, no warning, no flag. `byte b = 127; b++;` yields -128 because 127 is `01111111` and adding one gives `10000000`. In `int`, `Integer.MAX_VALUE + 1` is `Integer.MIN_VALUE`.\n\nThis is defined behavior, not undefined behavior as in C. The Java Language Specification states that integer operators are evaluated modulo 2^width, so the result is portable and deterministic. That determinism is useful for hashing, checksums, PRNGs and bit manipulation, and dangerous for money, counters and array sizes.\n\nCommon overflow traps:\n\n- `int mid = (low + high) / 2;` overflows for large indices. Use `low + (high - low) / 2`.\n- `int product = a * b;` overflows before you assign it to a `long`. Cast first: `(long) a * b`.\n- `long micros = days * 24 * 60 * 60 * 1_000_000;` computes in `int` if `days` is an `int`, then widens the wrong answer. Make one factor a `long` literal.\n\nWhen overflow must be detected, use `Math.addExact`, `Math.subtractExact`, `Math.multiplyExact` and `Math.toIntExact`, which throw `ArithmeticException`. `BigInteger` removes the limit entirely at the cost of allocation and slower arithmetic.",
        },
        { heading: 'IEEE 754: sign, exponent, mantissa', body: "A `float` is 32 bits laid out as 1 sign bit, 8 exponent bits and 23 fraction bits. A `double` is 64 bits: 1 sign, 11 exponent, 52 fraction. The encoded value, for normal numbers, is:\n\n`value = (-1)^S * (1 + M) * 2^(E - bias)`\n\nFor `float` the bias is 127; for `double` it is 1023. The `1 +` is the **implicit leading bit**: the mantissa is normalized so the integer part is always one, so it need not be stored, giving 24 bits of precision from 23 stored bits.\n\nWorked example, 5.5 as a `float`. In binary, 5.5 is `101.1`, normalized to `1.011 * 2^2`. So S = 0, M = `011`, and E = 2 + 127 = 129 = `10000001`. The word is `0 10000001 01100000000000000000000`, or `0x40B00000`.\n\nThree regions break the formula. Exponent all zeros with a nonzero mantissa means a **subnormal**, value `M * 2^-126`, used for numbers smaller than about 1.18e-38. Exponent all ones with zero mantissa is infinity; with nonzero mantissa it is NaN. That is why `Double.MIN_VALUE` is a tiny positive number, not the most negative one.",
        },
        { heading: 'Why 0.1 + 0.2 is not 0.3, and what to do about it', body: "Fractions such as 0.5 and 0.25 are exact in binary because they are sums of negative powers of two. Fractions such as 0.1, 0.2 and 0.7 are not: their binary expansions repeat forever, exactly as 1/3 repeats in decimal. Storing them in 23 or 52 bits truncates, leaving the nearest representable neighbor. `0.1` as a double is 0.1000000000000000055511151231257827.\n\nThe consequences are concrete. `0.1 + 0.2 == 0.3` is false. Accumulating a million `0.01` increments drifts. Formatting with `System.out.println` hides the error because `Double.toString` prints the shortest string that round-trips, which is why the bug surprises people.\n\nRules of thumb:\n\n- Never use `==` on floating-point results. Compare with an epsilon: `Math.abs(a - b) < 1e-9`.\n- Never use `float` or `double` for money. Use `BigDecimal` with an explicit scale and `RoundingMode`, or a `long` count of the smallest currency unit.\n- Use `BigDecimal.valueOf(0.1)` rather than `new BigDecimal(0.1)`; the constructor takes the exact binary value, the factory uses the printed decimal.\n- Remember that `BigDecimal.equals` compares scale, so `1.0` and `1.00` are not equal; `compareTo` returns zero.\n\nFor scientific ranges, floating point is the correct tool, and its relative error of about 1e-16 per operation is acceptable.",
        },
      ],
      javaCode: [
        {
          title: 'Two\u2019s complement by hand',
          description: 'Computes the negative of a byte with inversion plus one and verifies it by decoding the bits.',
          code: `public class TwosComplement {
    static String bits(int value, int width) {
        StringBuilder sb = new StringBuilder();
        for (int i = width - 1; i >= 0; i--) {
            sb.append((value >> i) & 1);
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        int value = 42;
        int inverted = ~value;
        int negative = inverted + 1;

        System.out.println("  42 = " + bits(value, 8));
        System.out.println(" ~42 = " + bits(inverted, 8));
        System.out.println(" -42 = " + bits(negative, 8));

        byte b = (byte) negative;
        System.out.println("byte value = " + b);
        System.out.println("42 + (-42) = " + (value + b));

        // The boundary case: negation of the most negative value.
        System.out.println("-(-128) as byte = " + (byte) -(-128));
        System.out.println("Math.abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE));
    }
}`,
        },
        {
          title: 'Overflow in action and the exact alternatives',
          description: 'Shows silent wraparound next to Math.addExact and BigInteger so the difference is visible.',
          code: `import java.math.BigInteger;

public class Overflow {
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;
        System.out.println("max + 1 = " + (max + 1)); // Integer.MIN_VALUE

        byte b = 127;
        b++;
        System.out.println("byte 127++ = " + b);

        int a = 100_000, c = 100_000;
        System.out.println("int product = " + (a * c));          // wrong on purpose
        System.out.println("long product = " + ((long) a * c));

        try {
            System.out.println(Math.addExact(max, 1));
        } catch (ArithmeticException e) {
            System.out.println("addExact threw: " + e.getMessage());
        }

        BigInteger huge = BigInteger.valueOf(max).add(BigInteger.ONE);
        System.out.println("BigInteger = " + huge);
    }
}`,
        },
        {
          title: 'Decoding a float with Float.floatToIntBits',
          description: 'Extracts the sign, exponent and mantissa fields and shows the precision loss of 0.1.',
          code: `public class FloatBits {
    static void describe(float value) {
        int raw = Float.floatToIntBits(value);
        int sign = (raw >>> 31) & 1;
        int exponent = (raw >>> 23) & 0xFF;
        int mantissa = raw & 0x7FFFFF;
        System.out.printf("value=%s raw=0x%08X sign=%d exp=%d (unbiased %d) mantissa=0x%06X%n",
                value, raw, sign, exponent, exponent - 127, mantissa);
    }

    public static void main(String[] args) {
        describe(5.5f);
        describe(0.1f);
        describe(-2.0f);
        describe(Float.NaN);

        System.out.println(0.1 + 0.2);
        System.out.println(0.1 + 0.2 == 0.3);
        System.out.println(Math.abs((0.1 + 0.2) - 0.3) < 1e-9);
        System.out.println(new java.math.BigDecimal("0.1").add(new java.math.BigDecimal("0.2")));
    }
}`,
        },
      ],
      keyTakeaways: [
        'Two\u2019s complement stores negatives as invert plus one, giving one zero and hardware-friendly subtraction.',
        'Signed ranges are asymmetric: one more negative value than positive, so MIN_VALUE cannot be negated.',
        'Java integer overflow wraps silently by specification; use Math.*Exact or BigInteger when it matters.',
        'IEEE 754 floats store sign, biased exponent and a fraction with an implicit leading one.',
        'Most decimal fractions cannot be represented exactly in binary, so money belongs in BigDecimal.',
      ],
      interviewTips: [
        'Be ready to convert a negative number to two\u2019s complement on a whiteboard in under thirty seconds.',
        'State the float layout with bit counts and the bias values 127 and 1023.',
        'Explain the classic binary-search midpoint overflow and its fix.',
      ],
      pitfalls: [
        'Assuming `Math.abs` always returns a non-negative number.',
        'Multiplying two ints and assigning the result to a long after the overflow already happened.',
        'Comparing floats with `==`, including inside unit-test assertions without a delta.',
        'Confusing `Double.MIN_VALUE`, the smallest positive value, with the most negative double.',
      ],
      quiz: [
        {
          question: 'What is the eight-bit two\u2019s complement representation of -42?',
          options: ['10101010', '11010101', '11010110', '00101010'],
          answerIndex: 2,
          explanation: '42 is 00101010; inverting gives 11010101; adding one gives 11010110, which decodes to -128+64+16+4+2 = -42.',
        },
        {
          question: 'Why is 0.1 + 0.2 not exactly 0.3 in double arithmetic?',
          options: ['Java rounds all decimals to seven digits', '0.1 and 0.2 have infinite repeating binary expansions and are truncated to 53 bits', 'The + operator is lossy for doubles', 'Because 0.3 is not representable in decimal'],
          answerIndex: 1,
          explanation: 'Binary cannot represent these fractions finitely, so each is stored as the nearest double and their sum differs from the nearest double to 0.3 by a tiny amount.',
        },
      ],
    },
    {
      slug: 'type-conversion-and-casting',
      vizId: 'type-conversion-and-casting',
      title: 'Type Conversion, Promotion & Casting',
      order: 5,
      level: 'intermediate',
      summary: 'The exact widening, narrowing and promotion rules, plus reference casts and the traps around constants and boxing.',
      sections: [
        { heading: 'Widening conversion and why int to float is not lossless', body: "A widening conversion goes from a type whose range fits inside another. Java performs it automatically in assignment, method invocation and return statements. The chain is:\n\n`byte -> short -> int -> long -> float -> double`\n\nAdditional legal widenings exist from `char` to `int`, `long`, `float` and `double`, and from `short` to `int` and beyond. `char` never widens to `short`, because its range 0 to 65535 does not fit in -32768 to 32767. `boolean` participates in no numeric conversion at all.\n\nThe chain is not strictly about precision. `int` to `float` widens in range but can **lose precision**, because a float has only 24 bits of significand while an int needs 31. The assignment `int big = 16_777_217; float f = big;` yields 16_777_216, the nearest representable value. The same happens for `long` to `float` and `long` to `double`, which is why `long` values above 2^53 lose low bits in a double.\n\nSo widening means the conversion is always allowed without a cast, not that it preserves every value. For identifiers use `Integer.toUnsignedLong` style helpers when you actually want to reinterpret bytes.",
        },
        { heading: 'Narrowing casts: truncation, not rounding', body: "A narrowing conversion may lose magnitude or precision, so the compiler demands an explicit cast: `(byte)`, `(short)`, `(char)`, `(int)`, `(long)`, `(float)`, `(double)`. The cast is a promise that you know what you are doing, and the compiler stops checking.\n\nFor integral types the result is the low n bits of the source, reinterpreted as a signed value. `int i = 300; byte b = (byte) i;` keeps `300 & 0xFF = 44`. `int i = -1; byte b = (byte) i;` gives -1, because all the low bits are ones. This is modular reduction, not saturation: values wrap, they do not clamp.\n\nFor floating point to integral, the value is truncated toward zero, then clamped to the target range if it is out of bounds. `(int) 3.99` is 3, `(int) -3.99` is -3, `(int) Float.NaN` is 0, and `(int) 1e20` is `Integer.MAX_VALUE`. `double` to `float` rounds to the nearest representable float and can produce infinity instead of throwing.\n\n`char` casts are a frequent source of confusion. `(char) 65` is `A`, and `(char) (letter + 1)` rotates within the 16-bit range instead of overflowing into negative numbers.",
        },
        { heading: 'Binary numeric promotion in expressions', body: "When two operands of different numeric types meet an arithmetic or comparison operator, Java promotes both to a common type before operating. The rules, applied in order:\n\n- If either operand is `double`, both become `double`.\n- Otherwise, if either is `float`, both become `float`.\n- Otherwise, if either is `long`, both become `long`.\n- Otherwise, both become `int`.\n\nThat last rule is the one beginners miss. `byte a = 10, b = 20; byte c = a + b;` does not compile, because the addition is performed as `int` and assigning an `int` to a `byte` needs a cast. The same applies to `short`, `char`, and to expressions like `char next = ch + 1`. Unary promotion also applies: `byte b = -b;` needs a cast, because unary minus promotes to `int`.\n\nThe result type is the promoted type, so `1 / 2` is 0 while `1 / 2.0` is 0.5, and `1 + 2 + \"x\"` is `3x` while `\"x\" + 1 + 2` is `x12`. Mixed comparisons follow the same rules, so `1 == 1.0` is true after promotion. There is no promotion from `boolean`.",
        },
        { heading: 'Constant narrowing and implicit casts in compound assignment', body: "There are two places where the compiler relaxes the cast requirement.\n\n**Constant expressions.** A compile-time constant that fits the target range may be assigned without a cast. `byte b = 100;` compiles because 100 is a constant expression within -128 to 127. `final int x = 10; byte b = x;` also compiles, because `x` is a constant variable. Remove `final` and the same code fails. `char c = 65;` is legal for the same reason. This is why `switch` case labels can be constant `char` values.\n\n**Compound assignment.** `a += b` is defined as `a = (type of a)(a + b)`, so the cast is implicit. `byte b = 10; b += 5;` compiles, and `b += 300` silently wraps instead of failing. The same applies to `-=`, `*=`, `/=`, `%=` and the bitwise variants. This is convenient and a genuine footgun in loops where accumulation silently wraps.\n\nNote the difference between `b = b + 1` and `b += 1` for a byte: the first does not compile, the second does and may overflow without warning.",
        },
        { heading: 'Reference casting, polymorphism and ClassCastException', body: "Casting also applies to reference types, where it changes the static type of an expression without touching the object. An upcast, from a subclass to a superclass or interface, is implicit and always safe. A downcast, from a supertype to a subtype, requires an explicit cast and is checked at runtime.\n\n`Object o = \"hello\"; String s = (String) o;` succeeds. `Object o = Integer.valueOf(1); String s = (String) o;` throws `ClassCastException` at the cast, not at the later use. The compiler permits the cast whenever the types are potentially compatible; it rejects provably impossible casts such as casting a `String` to `Integer` directly.\n\nSince Java 16, pattern matching removes most casts: `if (o instanceof String s) { ... }` declares `s` already typed and scoped to the branch. Java 21 extends this to `switch` patterns with guards.\n\nArrays are covariant, which creates a related trap: `Object[] objects = new String[1]; objects[0] = 42;` compiles but throws `ArrayStoreException` at runtime, because the JVM checks the runtime component type on every store. Generic collections avoid this by being invariant, which is why `List<Object>` cannot be assigned a `List<String>`.",
        },
        { heading: 'String conversion, parsing and boxing conversions', body: "Converting between text and numbers is a conversion problem with its own traps.\n\n`Integer.parseInt(\"42\")` returns an `int` and throws `NumberFormatException` on bad input. `Integer.valueOf(\"42\")` returns an `Integer` and uses the cache for -128 to 127, so `valueOf(\"127\") == valueOf(\"127\")` is true while `valueOf(\"128\") == valueOf(\"128\")` is false. `Double.parseDouble` accepts `NaN`, `Infinity` and exponent notation, and `Integer.decode` accepts `0x` and leading-zero forms.\n\nFor numbers to text, `String.valueOf(x)` and `Integer.toString(x)` avoid surprises. Avoid `\"\" + x` in loops: it compiles to a `StringBuilder` chain per iteration in older code and confuses overload resolution. Use `String.format` or `%d`/`%f` when formatting matters.\n\nBoxing conversions are implicit since Java 5. `Integer boxed = 5;` boxes, `int n = boxed;` unboxes. Three rules follow: unboxing `null` throws `NullPointerException`; `==` between two boxed values compares references, so use `equals`; and overload resolution prefers widening a primitive over boxing, so `f(long)` wins over `f(Integer)` for an `int` argument.",
        },
      ],
      javaCode: [
        {
          title: 'Widening and narrowing in one run',
          description: 'Shows automatic widening, modular truncation on narrowing, and truncation toward zero for floating point.',
          code: `public class Conversions {
    public static void main(String[] args) {
        byte b = 25;
        int i = b;              // widening, implicit
        long l = i;
        double d = l;
        System.out.println(b + " " + i + " " + l + " " + d);

        int threeHundred = 300;
        byte narrowed = (byte) threeHundred;   // 300 % 256 = 44
        System.out.println("300 as byte = " + narrowed);

        System.out.println("(int) 3.99  = " + (int) 3.99);
        System.out.println("(int) -3.99 = " + (int) -3.99);
        System.out.println("(int) NaN   = " + (int) Double.NaN);
        System.out.println("(int) 1e20  = " + (int) 1e20);

        char letter = 'A';
        char next = (char) (letter + 1);       // promotion to int requires a cast back
        System.out.println(next + " code=" + (int) next);

        int big = 16_777_217;
        float lossy = big;
        System.out.println("int to float loses precision: " + (int) lossy);
    }
}`,
        },
        {
          title: 'Promotion rules and the byte trap',
          description: 'Proves that byte arithmetic happens in int and that compound assignment hides the cast.',
          code: `public class Promotion {
    public static void main(String[] args) {
        byte a = 10, b = 20;
        // byte sum = a + b;      // compile error: int cannot be converted to byte
        byte sum = (byte) (a + b);

        byte acc = 100;
        acc += 100;               // implicit cast, silently wraps
        System.out.println("sum=" + sum + " acc=" + acc);

        System.out.println("1 / 2     = " + (1 / 2));
        System.out.println("1 / 2.0   = " + (1 / 2.0));
        System.out.println("1 + 2 + x = " + (1 + 2 + "x"));
        System.out.println("x + 1 + 2 = " + ("x" + 1 + 2));
        System.out.println("1 == 1.0  = " + (1 == 1.0));

        final int constant = 10;
        byte fromConstant = constant;   // allowed: constant expression in range
        System.out.println("fromConstant = " + fromConstant);
    }
}`,
        },
        {
          title: 'Reference casts and pattern matching',
          description: 'Contrasts an implicit upcast, a checked downcast and the modern instanceof pattern.',
          code: `public class ReferenceCasts {
    sealed interface Shape permits Circle, Square {}
    record Circle(double radius) implements Shape {}
    record Square(double side) implements Shape {}

    static double area(Shape shape) {
        if (shape instanceof Circle c) {
            return Math.PI * c.radius() * c.radius();
        } else if (shape instanceof Square s) {
            return s.side() * s.side();
        }
        throw new IllegalArgumentException("unknown shape");
    }

    public static void main(String[] args) {
        Shape shape = new Circle(2.0);
        Circle c = (Circle) shape;          // downcast, checked at runtime
        System.out.println(c.radius());

        Object value = 42;
        if (value instanceof String s) {
            System.out.println(s.length());
        } else {
            System.out.println("not a string: " + value.getClass().getSimpleName());
        }

        System.out.println("area = " + area(new Square(3)));
        try {
            Object o = Integer.valueOf(1);
            String bad = (String) o;
        } catch (ClassCastException e) {
            System.out.println("cast failed at runtime");
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Widening is implicit but not always lossless: int to float can drop low bits.',
        'Narrowing requires a cast and behaves as modular truncation for integers, truncation toward zero for floats.',
        'All byte, short and char arithmetic is promoted to int, which is why casts back appear everywhere.',
        'Compound assignment performs an implicit narrowing cast that can hide overflow.',
        'Reference downcasts are runtime-checked; arrays are covariant and can throw ArrayStoreException.',
      ],
      interviewTips: [
        'Recite the promotion order and give the `byte sum = a + b` compile error as proof of int promotion.',
        'Explain the difference between `(int) 3.9` and `Math.round(3.9)`.',
        'Mention that `Integer.valueOf` caches -128 to 127, which makes `==` unreliable on boxed values.',
      ],
      pitfalls: [
        'Assuming a cast rounds; it truncates toward zero for floating point.',
        'Forgetting that casting a negative int to byte keeps the low bits, so -1 stays -1.',
        'Relying on constant narrowing after removing `final` from a variable.',
        'Casting an Object without an instanceof check and risking ClassCastException.',
      ],
      quiz: [
        {
          question: 'What does `(byte) 300` evaluate to?',
          options: ['300', '44', '-44', 'It throws ArithmeticException'],
          answerIndex: 1,
          explanation: 'The cast keeps the low eight bits of 300, which is 44. Integer narrowing wraps modulo 256 instead of clamping.',
        },
        {
          question: 'Why does `byte a = 10, b = 20; byte c = a + b;` fail to compile?',
          options: ['byte addition is not supported', 'a + b is promoted to int, and int does not fit in byte without a cast', 'The variables must be final', 'Because 30 exceeds the byte range'],
          answerIndex: 1,
          explanation: 'Binary numeric promotion widens both operands to int, and the result is an int. The assignment needs an explicit narrowing cast.',
        },
      ],
    },
    {
      slug: 'operators',
      vizId: 'operators',
      title: 'Operators: Arithmetic to Bitwise',
      order: 6,
      level: 'beginner',
      summary: 'Every operator family in Java, with precedence, short-circuit rules, shift semantics and the classic trick questions.',
      sections: [
        { heading: 'Arithmetic: division, remainder and integer truncation', body: "The five arithmetic operators are `+`, `-`, `*`, `/` and `%`. Their result type follows binary numeric promotion, so `1 / 2` is `0` and `1 / 2.0` is `0.5`. Integer division truncates toward zero, so `-7 / 2` is `-3`, not `-4`.\n\nThe remainder operator is defined by `a == (a / b) * b + (a % b)`, which means `%` keeps the sign of the dividend. `-7 % 2` is `-1` and `7 % -2` is `1`. This differs from a true mathematical modulus, so for a wrap-around index use `Math.floorMod(i, n)`, which always returns a non-negative result for a positive modulus.\n\nDivision by zero depends on the type. For `int`, `1 / 0` throws `ArithmeticException: / by zero`. For `double`, `1.0 / 0.0` is `Infinity`, `-1.0 / 0.0` is `-Infinity` and `0.0 / 0.0` is `NaN`. `NaN` is not equal to itself, so use `Double.isNaN` rather than `==`.\n\nUnary `+` exists only for promotion and readability; unary `-` negates and overflows for `Integer.MIN_VALUE`. `Math.abs` has the same edge. Use `Math.floorDiv`, `Math.floorMod` and `Math.multiplyExact` when the defaults are not what you want.",
        },
        { heading: 'Increment, decrement and evaluation order', body: "`++` and `--` come in two forms. In prefix position the variable is modified first and the new value is the result of the expression. In postfix position the current value is the result and the variable is modified afterwards.\n\n`int i = 5; int a = i++;` leaves `i == 6` and `a == 5`. `int b = ++i;` leaves `i == 7` and `b == 7`. The distinction only matters when the expression result is used; as a standalone statement `i++;` and `++i;` are identical, and the common advice to prefer the prefix form for style is not a performance issue in Java.\n\nThe famous trap is `i = i++;`. Java evaluates the right-hand side fully, remembers the old value of `i`, increments `i`, then assigns the remembered old value back. The net result is no change. The same reasoning explains why `arr[i++] = i` and `arr[i] = i++` behave differently.\n\nDo not write expressions that read and modify the same variable more than once. The Java Language Specification defines the behavior precisely, but reviewers will not thank you. Split it into two statements and the question disappears.",
        },
        { heading: 'Relational and logical operators, short-circuit included', body: "Relational operators are `==`, `!=`, `<`, `>`, `<=` and `>=`, and they always produce a `boolean`. On primitives they compare values, with promotion applied. On references, `==` compares identity, that is, whether both point to the same object. Comparing strings or boxes with `==` is a frequent bug.\n\nThe logical operators are `&&`, `||`, `!`, plus the non-short-circuit forms `&` and `|`. The difference is evaluation of the right operand:\n\n- `a && b` evaluates `b` only when `a` is true.\n- `a || b` evaluates `b` only when `a` is false.\n- `a & b` and `a | b` always evaluate both sides.\n\nShort-circuiting is not an optimization detail; it is a semantic tool. `if (list != null && !list.isEmpty())` is safe precisely because the second operand is skipped when the first is false. The non-short-circuit forms are useful when both operands must run, for example when aggregating boolean flags returned by two validations.\n\nXOR `^` on booleans is true when the operands differ. It never short-circuits and is handy for exactly-one-of conditions. Avoid clever `a = a && b;` idioms; they obscure intent.",
        },
        { heading: 'Bitwise AND, OR, XOR and complement', body: "Bitwise operators work on the binary representation of integral types. They are defined for `int` and `long` after unary promotion, so a `byte` operand is widened first.\n\n| Operator | Name | Rule per bit |\n| :--- | :--- | :--- |\n| `&` | AND | 1 only when both bits are 1 |\n| `\\|` | OR | 1 when either bit is 1 |\n| `^` | XOR | 1 when the bits differ |\n| `~` | complement | flips every bit |\n\nConcrete uses. To test a bit: `(flags & MASK) != 0`. To set it: `flags |= MASK`. To clear it: `flags &= ~MASK`. To toggle it: `flags ^= MASK`. Each of these is a single machine instruction and appears constantly in parsers, compression, graphics and permission models.\n\nXOR has two properties worth memorizing: `x ^ x == 0` and `x ^ 0 == x`. Together they allow the in-place swap `a ^= b; b ^= a; a ^= b;` and the find-the-single-number trick where every duplicate cancels out. Both are elegant and both hurt readability, so prefer a temporary variable or a `HashSet` in production code.\n\n`~x` equals `-x - 1` for all integers, which is why `~0` is -1 and `Arrays.binarySearch` returns `-(insertionPoint) - 1`.",
        },
        { heading: 'Shifts: <<, >> and >>> with their distance rules', body: "A left shift `x << n` multiplies by 2^n, filling the low bits with zeros. An arithmetic right shift `x >> n` divides by 2^n and sign-extends, so a negative number stays negative. A logical right shift `x >>> n` fills the high bits with zeros regardless of sign.\n\nThe shift distance is taken modulo the width of the promoted left operand: 32 for `int`, 64 for `long`. So `1 << 32` is `1`, not 0, and `1 << 33` is `2`. Negative distances behave the same way: `1 << -1` equals `1 << 31`, which is `Integer.MIN_VALUE`. This modulo rule trips up people porting code from languages that define shifts differently.\n\nBecause `>>>` produces a non-negative `int` for a 32-bit value, assigning the result back to a narrower or signed type can surprise. `byte b = -1; int u = b >>> 8;` is `0`, because the byte was sign-extended to `0xFFFFFFFF` before the shift. To treat a byte as unsigned, mask first: `(b & 0xFF) >>> 4`.\n\nShifting is not a general optimization in Java. The JIT already turns multiplication by powers of two into shifts. Write `x * 8` for intent and use shifts when you mean bit manipulation.",
        },
        { heading: 'Assignment, ternary and precedence', body: "Assignment operators are right-associative, so `a = b = c = 0` assigns zero to all three. Compound forms (`+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`, `>>>=`) combine an operation with an implicit narrowing cast, which is why `byte b = 10; b += 5;` compiles.\n\nThe ternary conditional `cond ? a : b` is the only three-operand operator. Its type is determined by applying binary numeric promotion when both branches are numeric, and by reference rules otherwise. A common trap: if one branch is a primitive and the other is its wrapper, the whole expression is unboxed, so a `null` wrapper throws `NullPointerException` even when that branch is not chosen.\n\nPrecedence, highest to lowest, roughly: postfix, unary, multiplicative, additive, shift, relational, equality, bitwise AND, XOR, OR, logical AND, logical OR, ternary, assignment. Do not memorize the tail; parenthesize mixed bitwise and comparison expressions. `(flags & MASK) == MASK` needs the parentheses, because `==` binds tighter than `&`.\n\n`instanceof` and `->` (in lambdas and switch) are also operators; cast has higher precedence than most arithmetic except postfix.",
        },
      ],
      javaCode: [
        {
          title: 'Arithmetic and remainder corner cases',
          description: 'Contrasts integer and floating-point division and shows why Math.floorMod exists.',
          code: `public class Arithmetic {
    public static void main(String[] args) {
        System.out.println("7 / 2    = " + (7 / 2));
        System.out.println("7 / 2.0  = " + (7 / 2.0));
        System.out.println("-7 / 2   = " + (-7 / 2));
        System.out.println("-7 % 2   = " + (-7 % 2));
        System.out.println("floorMod = " + Math.floorMod(-7, 2));

        System.out.println("1.0 / 0  = " + (1.0 / 0));
        System.out.println("0.0 / 0  = " + (0.0 / 0));
        System.out.println("NaN == NaN -> " + (Double.NaN == Double.NaN));

        try {
            System.out.println(1 / 0);
        } catch (ArithmeticException e) {
            System.out.println("int division by zero: " + e.getMessage());
        }
    }
}`,
        },
        {
          title: 'Short-circuit evaluation with side effects',
          description: 'Uses counter increments to prove which operands are actually evaluated.',
          code: `public class ShortCircuit {
    static int calls = 0;

    static boolean check(String name, boolean result) {
        calls++;
        System.out.println("evaluating " + name);
        return result;
    }

    public static void main(String[] args) {
        boolean a = check("left-1", false) && check("right-1", true);
        System.out.println("&& result=" + a + " calls=" + calls);

        calls = 0;
        boolean b = check("left-2", true) || check("right-2", false);
        System.out.println("|| result=" + b + " calls=" + calls);

        calls = 0;
        boolean c = check("left-3", false) & check("right-3", true);
        System.out.println("&  result=" + c + " calls=" + calls);

        String s = null;
        System.out.println("safe: " + (s != null && s.length() > 0));
    }
}`,
        },
        {
          title: 'Bit tricks and shift distances',
          description: 'Sets, clears, toggles and tests bits, then demonstrates the modulo rule for shift distance.',
          code: `public class BitOps {
    public static void main(String[] args) {
        int flags = 0;
        int READ = 1, WRITE = 1 << 1, EXEC = 1 << 2;

        flags |= READ;              // set
        flags |= EXEC;
        flags &= ~EXEC;             // clear
        flags ^= WRITE;             // toggle
        System.out.println("read=" + ((flags & READ) != 0));
        System.out.println("write=" + ((flags & WRITE) != 0));
        System.out.println("bits=" + Integer.toBinaryString(flags));

        System.out.println("~0 = " + ~0);
        System.out.println("-8 >> 1 = " + (-8 >> 1));
        System.out.println("-8 >>> 1 = " + (-8 >>> 1));
        System.out.println("1 << 32 = " + (1 << 32));
        System.out.println("1 << 33 = " + (1 << 33));
        System.out.println("1 << -1 = " + (1 << -1));

        byte neg = -1;
        System.out.println("neg >>> 8 = " + (neg >>> 8));
        System.out.println("masked      = " + ((neg & 0xFF) >>> 4));
    }
}`,
        },
      ],
      keyTakeaways: [
        'Integer division truncates toward zero and remainder keeps the sign of the dividend.',
        'Short-circuit operators skip the right operand, which is a correctness tool, not just a speedup.',
        'Shift distances are taken modulo 32 or 64, so shifting by 32 is a no-op on an int.',
        '`>>>` fills with zeros while `>>` sign-extends; mask a byte to 0xFF before treating it as unsigned.',
        'Compound assignment hides a narrowing cast and can silently overflow.',
      ],
      interviewTips: [
        'Explain why `(flags & MASK) == MASK` needs parentheses, in terms of operator precedence.',
        'Show the XOR swap and then say why you would still use a temporary variable in production.',
        'Be precise about `-7 % 2`: Java gives -1, while Math.floorMod gives 1.',
      ],
      pitfalls: [
        'Writing `1 << 32` expecting zero.',
        'Using `==` on wrapper objects or strings instead of `equals`.',
        'Mixing `&` and `==` without parentheses.',
        'Treating `%` as a mathematical modulus for negative numbers.',
      ],
      quiz: [
        {
          question: 'What is `-8 >>> 1` for an int?',
          options: ['-4', '4', '2147483644', '-16'],
          answerIndex: 2,
          explanation: 'The logical shift fills the sign bit with zero, turning the two\u2019s complement pattern into a large positive number, 2147483644.',
        },
        {
          question: 'What does `1 << 33` evaluate to?',
          options: ['0', '1', '2', 'It is a compile error'],
          answerIndex: 2,
          explanation: 'The shift distance is reduced modulo 32 for an int, so 33 becomes 1 and the result is 2.',
        },
      ],
    },
    {
      slug: 'conditional-statements',
      vizId: 'conditional-statements',
      title: 'Conditional Statements',
      order: 7,
      level: 'beginner',
      summary: 'if, else-if ladders, classic and arrow switch, pattern matching, and how the JVM compiles branches.',
      sections: [
        { heading: 'if, if-else and the boolean requirement', body: "An `if` statement evaluates a `boolean` expression and runs a block when it is true. Java will not accept a number, a reference or an assignment of a non-boolean as the condition. `if (1)` and `if (x = 5)` do not compile, which removes a whole class of C bugs.\n\nThe optional `else` runs when the condition is false, and exactly one of the two blocks executes. Both forms accept either a single statement or a block. Always use braces. The dangling-else problem, where an `else` binds to the nearest unmatched `if`, has caused real outages, and braces make the intent unambiguous.\n\nStyle that pays off: keep the condition positive where possible (`if (isValid)` rather than `if (!isInvalid)`), return early for guard conditions instead of nesting, and extract a well-named boolean method when a condition spans multiple `&&` terms. A condition like `if (user != null && user.isActive() && !user.isLocked())` reads better as `if (canSignIn(user))`.\n\nNote that the condition is evaluated once. If it has side effects, such as a method that pops from a queue, the block and the else branch see the same result.",
        },
        { heading: 'else-if ladders: order, ranges and guard clauses', body: "An else-if ladder tests conditions top to bottom and stops at the first true one. Everything after it is skipped, even if it would also be true. Ordering is therefore part of the logic, not a formatting choice.\n\nWith overlapping ranges, put the narrowest condition first. Testing `score > 60` before `score > 90` makes the second test unreachable. A correct ladder moves from the strictest to the loosest, or partitions the domain explicitly with boundaries on both sides.\n\nLong ladders are a smell when they all inspect the same value. If every branch is `if (type == A) ... else if (type == B) ...`, a `switch` documents the intent better, and a polymorphic method or an enum with behavior is better still. Ladders that mix unrelated conditions are usually several separate checks wearing a disguise.\n\nGuard clauses are the opposite pattern: instead of nesting the happy path inside three `if` blocks, reject invalid states at the top and return. The main logic then sits at one indentation level. This reduces nesting depth, which is the single strongest predictor of hard-to-read methods.",
        },
        { heading: 'Classic switch: fall-through and jump tables', body: "A `switch` selects one of several branches based on an expression. Classic syntax supports `byte`, `short`, `char`, `int`, their wrappers, `String` (since Java 7) and `enum`. It does **not** support `long`, `float`, `double` or `boolean`.\n\nThe body is a sequence of labels, not separate blocks. Execution jumps to the matching label and then continues straight down through every following label until it hits `break` or the end. This is fall-through, and it is intentional for grouping: three labels can share one body. It is a bug when accidental, and it is why every `case` in classic code ends with `break` or `return`.\n\n`default` may appear anywhere but runs only when no label matches. `case` labels must be compile-time constants, so `final` variables and enum constants are fine but method calls are not. Duplicate labels are a compile error.\n\nUnder the hood, `javac` chooses between two instructions. With dense integer labels, `tableswitch` builds a jump table indexed directly by the value, giving constant-time dispatch. With sparse or non-integer labels such as strings, `lookupswitch` performs a binary search over sorted key and offset pairs. A string switch is compiled to a hash code switch plus `equals` verification.",
        },
        { heading: 'Arrow switch, yield and exhaustive switch expressions', body: "Java 14 finalized the arrow form, which removes fall-through entirely. Each label has exactly one body, executed alone.\n\n`switch (day) { case MON, TUE -> System.out.println(\"work\"); default -> System.out.println(\"rest\"); }`\n\nA switch can also be an **expression** that produces a value. Single-expression bodies use `->` directly; block bodies use `yield` to return a value. Assignment, return and argument positions all accept switch expressions, which replaces the old pattern of declaring a variable before the switch and assigning in every branch.\n\nExhaustiveness matters. A switch expression over an enum must cover every constant or provide `default`. Over a sealed hierarchy, Java 21 can prove exhaustiveness from the permitted subclasses, and adding a new subclass then becomes a compile error instead of a silent runtime gap. That is the main reason to prefer switch expressions in new code.\n\nArrow cases can list multiple comma-separated labels, including constants of the same type. They cannot fall through, so they cannot accidentally leak into the next case, and they work with `default` in any position. Mixed arrow and colon syntax in one switch is a compile error.",
        },
        { heading: 'Ternary expressions and pattern matching', body: "The ternary operator is an expression, so it can be used where a value is required: assignments, arguments and returns. Use it when both branches are short and the whole thing fits on one line. Nested ternaries are technically legal and almost always less readable than a small method or a switch expression.\n\nWatch the typing rules. `cond ? 1 : 2.0` is a `double`, because binary numeric promotion applies. `cond ? 1 : null` unboxes when the other branch is a primitive, which can throw `NullPointerException` at runtime. If both branches are references with a common supertype, the result takes that type.\n\nPattern matching modernizes type dispatch. `if (obj instanceof String s && s.length() > 3)` declares `s` in the same expression with flow scoping, so the variable exists exactly where it is definitely assigned. Java 21 adds record deconstruction patterns in switch, type patterns with guards using `when`, and `case null` for switch, replacing chains of casts.\n\nRule of thumb for choosing: two outcomes and a simple condition means `if`; three or more branches on one value means `switch`; two candidate values inside an expression means the ternary.",
        },
      ],
      javaCode: [
        {
          title: 'An if-else ladder for ranges',
          description: 'Orders the boundaries from strictest to loosest and prints the resulting grade.',
          code: `public class Grading {
    static char grade(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("score out of range: " + score);
        }
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    public static void main(String[] args) {
        for (int score : new int[] {95, 85, 72, 61, 12}) {
            System.out.printf("%3d -> %c%n", score, grade(score));
        }
    }
}`,
        },
        {
          title: 'Switch expression with arrow labels and yield',
          description: 'Returns a value from a block body with yield and covers enums exhaustively.',
          code: `public class SwitchExpression {
    enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

    static String typeOf(Day day) {
        return switch (day) {
            case SAT, SUN -> "weekend";
            case MON, TUE, WED, THU, FRI -> "weekday";
        };
    }

    static int daysUntilFriday(Day day) {
        return switch (day) {
            case MON -> 4;
            case TUE -> 3;
            case WED -> 2;
            case THU -> 1;
            case FRI, SAT, SUN -> {
                int result = day == Day.FRI ? 0 : 7 - day.ordinal() + 4;
                yield result;
            }
        };
    }

    public static void main(String[] args) {
        for (Day d : Day.values()) {
            System.out.println(d + " " + typeOf(d) + " fridayIn=" + daysUntilFriday(d));
        }
    }
}`,
        },
        {
          title: 'Pattern matching in a switch',
          description: 'Dispatches on sealed types with guarded patterns instead of a chain of instanceof casts.',
          code: `public class PatternSwitch {
    sealed interface Shape permits Circle, Square, Rect {}
    record Circle(double r) implements Shape {}
    record Square(double side) implements Shape {}
    record Rect(double w, double h) implements Shape {}

    static String describe(Shape shape) {
        return switch (shape) {
            case Circle c when c.r() > 10 -> "large circle";
            case Circle c -> "circle r=" + c.r();
            case Square s -> "square side=" + s.side();
            case Rect r -> "rect " + r.w() + "x" + r.h();
        };
    }

    public static void main(String[] args) {
        System.out.println(describe(new Circle(2)));
        System.out.println(describe(new Circle(20)));
        System.out.println(describe(new Square(3)));
        System.out.println(describe(new Rect(2, 5)));
    }
}`,
        },
      ],
      keyTakeaways: [
        'Java conditions must be boolean; numeric truthiness does not exist.',
        'In a classic switch, execution falls through subsequent labels until break or return.',
        'tableswitch is O(1) for dense int labels; lookupswitch is O(log n) for sparse or string labels.',
        'Arrow labels never fall through, and switch expressions must be exhaustive.',
        'Flow-scoped pattern variables remove most explicit casts.',
      ],
      interviewTips: [
        'Explain fall-through with an example where two labels intentionally share a body.',
        'Contrast if-else chains with switch and mention when polymorphism beats both.',
        'Show that a switch expression over a sealed interface is checked for exhaustiveness at compile time.',
      ],
      pitfalls: [
        'Forgetting break in classic switch and running several cases.',
        'Using switch on a long or double, which does not compile.',
        'Letting a switch expression miss an enum constant without a default.',
        'Nesting ternaries until nobody can tell which branch binds where.',
      ],
      quiz: [
        {
          question: 'What happens in a classic switch when a case has no break?',
          options: ['It throws an exception', 'Execution falls through into the next case body', 'The switch exits immediately', 'Only the default case runs'],
          answerIndex: 1,
          explanation: 'Classic switch labels are entry points, not isolated blocks, so execution continues into following labels until break or the end.',
        },
        {
          question: 'Which types are valid in a classic switch selector?',
          options: ['Any primitive', 'byte, short, char, int, their boxes, String and enum', 'Only int and String', 'Any Object'],
          answerIndex: 1,
          explanation: 'long, float, double and boolean are excluded. String and enum were added later and are compiled to hash and ordinal lookups.',
        },
      ],
    },
    {
      slug: 'loops-and-jump-statements',
      vizId: 'loops-and-jump-statements',
      title: 'Loops & Jump Statements',
      order: 8,
      level: 'beginner',
      summary: 'while, do-while, for and enhanced for, plus labeled break and continue and the bugs each one prevents.',
      sections: [
        { heading: 'while: entry-controlled repetition', body: "A `while` loop checks its condition before every iteration, so the body may run zero times. That makes it the right tool when the number of iterations is unknown and depends on data, such as reading until a sentinel value or shrinking a search range.\n\nThree parts must line up: something initializes the state, the condition reads that state, and the body changes it. Missing the third produces an infinite loop, the most common runtime hang in beginner code. If the loop is intentionally infinite, write `while (true)` and make the exit an explicit `break` or `return`; that signals intent better than a condition that is never false.\n\nThe loop condition is re-evaluated before each pass, so it can be expensive. Calling `scanner.hasNext()` or `list.size()` every iteration is fine for small data and wasteful when the body is large; hoist the invariant part into a local variable if profiling shows it matters. Modern JVMs optimize simple cases, so prefer clarity first.\n\nA loop invariant, a statement that is true before and after every iteration, is the cleanest way to reason about correctness. For binary search the invariant is that the target, if present, lies within the current bounds.",
        },
        { heading: 'do-while: guaranteed first execution', body: "A `do-while` loop runs its body once, then checks the condition, so it always executes at least one iteration. The syntax needs a semicolon after the closing `while (condition);`, which is easy to forget.\n\nUse it when the first action must happen before there is anything to test. A menu that must render before the user can choose an option, a retry loop that must attempt a connection at least once, or input validation that must read a value before deciding whether it is acceptable are all natural fits.\n\nThe equivalent `while` form requires duplicating the body or pre-seeding variables with fake values, both of which are worse. Recognizing that pattern is the real skill: whenever you find yourself writing initialization code that exists only to make a `while` condition legal, a `do-while` probably expresses the intent.\n\nWith `continue` inside a `do-while`, control jumps to the condition check, not to the top of the body. That is a subtle difference from `while`, where `continue` also jumps to the condition. Both then re-enter the body only if the condition still holds.",
        },
        { heading: 'for and enhanced for', body: "The basic `for` loop packs initialization, condition and update into one header: `for (int i = 0; i < n; i++)`. All three parts are optional; `for (;;)` is a valid infinite loop. Variables declared in the initialization are scoped to the loop, including the body, which prevents accidental reuse after it ends.\n\nThe comma operator does not exist in Java, but the initialization and update sections accept comma-separated expressions of the same kind: `for (int i = 0, j = n - 1; i < j; i++, j--)`. This is the idiomatic two-pointer loop.\n\nThe enhanced `for` (`for (int value : array)`) hides the index and works on arrays and anything implementing `Iterable`. It is shorter and less error-prone when you do not need the index. It cannot be used when you need to modify elements, traverse in reverse, skip elements, or compare two positions, because it exposes values, not positions. For arrays it compiles to an index loop; for collections it allocates an `Iterator`, and removing through the collection during iteration throws `ConcurrentModificationException`.\n\nOff-by-one errors concentrate here. For an array of length n, valid indices are 0 to n-1; the condition must be `i < n`, never `i <= n`.",
        },
        { heading: 'break, continue and labels', body: "`break` exits the innermost enclosing loop or `switch` immediately. `continue` abandons the rest of the current iteration and jumps to the next one: for a `for` loop, to the update expression; for `while` and `do-while`, to the condition.\n\nNested loops need more. Java allows a label before any statement, and `break label;` or `continue label;` targets that labeled loop specifically. `break outer;` exits both loops at once; `continue outer;` skips the rest of the inner loop and starts the next outer iteration.\n\n`return` is stronger than `break`: it leaves the whole method. Inside a loop that is searching, an early return often reads better than a boolean flag plus a break.\n\nGuidelines that keep loops readable: use `break` for a genuine early exit rather than to patch a wrong condition, avoid `continue` at the top of a long body because it forces the reader to track two exit paths, and prefer extracting the inner loop into a method over deep label gymnastics. Labels are perfectly legal and occasionally the clearest solution, but if a labeled break needs a comment to explain it, the method probably wants splitting.",
        },
        { heading: 'Loop patterns, complexity and common defects', body: "Most array and string algorithms are loops in disguise, and the shape of the loop determines the complexity.\n\nA single loop over n elements is O(n). Two nested loops over the same range are O(n^2), which is fine for n of a few thousand and fatal for n of a million. Two pointers moving inward also look like nesting but each pointer advances monotonically, so the total work is O(n). Recognizing this difference is a core interview skill.\n\nAccumulation patterns are everywhere: sum, product, count, minimum, maximum. Initialize deliberately. A sum starts at 0, a product at 1, a minimum at the first element or at the type maximum, never at 0 unless all values are known non-negative. An empty input must be handled before the loop, because a minimum of an empty collection is undefined.\n\nLoop defects to check for:\n\n- The update never runs on some path, usually because of a `continue` before it.\n- The condition uses `<=` on a length.\n- The index is modified inside the body as well as in the update clause.\n- A `double` is used as a loop counter, accumulating rounding error.\n- The loop body recomputes something invariant, such as `list.size()` inside a nested loop.",
        },
      ],
      javaCode: [
        {
          title: 'All four loop forms side by side',
          description: 'Demonstrates entry-controlled, exit-controlled, counted and enhanced iteration over the same data.',
          code: `public class LoopForms {
    public static void main(String[] args) {
        int[] values = {3, 8, 15, 20};

        int i = 0;
        while (i < values.length) {
            System.out.print(values[i] + " ");
            i++;
        }
        System.out.println();

        int attempts = 0;
        do {
            attempts++;
        } while (attempts < 3);
        System.out.println("attempts = " + attempts);

        for (int left = 0, right = values.length - 1; left < right; left++, right--) {
            int tmp = values[left];
            values[left] = values[right];
            values[right] = tmp;
        }
        System.out.println(java.util.Arrays.toString(values));

        int sum = 0;
        for (int value : values) {
            sum += value;
        }
        System.out.println("sum = " + sum);
    }
}`,
        },
        {
          title: 'Labeled break and continue',
          description: 'Searches a grid for a value and exits both loops at once, then skips rows with continue.',
          code: `public class LabeledLoops {
    public static void main(String[] args) {
        int[][] grid = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        int target = 6;

        int foundRow = -1, foundCol = -1;
        outer:
        for (int row = 0; row < grid.length; row++) {
            for (int col = 0; col < grid[row].length; col++) {
                if (grid[row][col] == target) {
                    foundRow = row;
                    foundCol = col;
                    break outer;
                }
            }
        }
        System.out.println("found at " + foundRow + "," + foundCol);

        rowLoop:
        for (int row = 0; row < grid.length; row++) {
            int rowSum = 0;
            for (int col = 0; col < grid[row].length; col++) {
                if (grid[row][col] % 2 == 0) {
                    continue rowLoop;   // abandon this row entirely
                }
                rowSum += grid[row][col];
            }
            System.out.println("odd-only sum row " + row + " = " + rowSum);
        }
    }
}`,
        },
        {
          title: 'A loop invariant in binary search',
          description: 'Finds a target while keeping the searched range explicit and overflow-safe.',
          code: `public class BinarySearchLoop {
    static int search(int[] sorted, int target) {
        int low = 0;
        int high = sorted.length - 1;

        // Invariant: if target exists, its index is within [low, high].
        while (low <= high) {
            int mid = low + (high - low) / 2;   // avoids overflow
            if (sorted[mid] == target) {
                return mid;
            } else if (sorted[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] data = {1, 3, 5, 7, 9, 11, 13};
        System.out.println(search(data, 9));
        System.out.println(search(data, 4));
    }
}`,
        },
      ],
      keyTakeaways: [
        'while may run zero times; do-while always runs at least once.',
        'The three parts of a for header are optional, and comma lists work in initialization and update.',
        'break and continue affect only the innermost loop unless a label is used.',
        'Enhanced for is shorter but hides the index and cannot remove elements safely.',
        'Two pointers is O(n) even though it looks nested; genuinely nested loops are O(n^2).',
      ],
      interviewTips: [
        'Describe the loop invariant before writing a binary search or sliding window.',
        'Explain when do-while removes duplicated initialization code.',
        'Mention that modifying a collection while iterating with enhanced for throws ConcurrentModificationException.',
      ],
      pitfalls: [
        'Using `i <= array.length` and throwing ArrayIndexOutOfBoundsException.',
        'Forgetting the semicolon after do-while and getting a confusing compile error.',
        'Putting the update expression before a continue path so it is skipped.',
        'Using floating-point counters and accumulating drift.',
      ],
      quiz: [
        {
          question: 'How many times does the body of `do { ... } while (false);` execute?',
          options: ['Zero', 'Once', 'Forever', 'It does not compile'],
          answerIndex: 1,
          explanation: 'A do-while is exit-controlled, so the body runs before the condition is evaluated, guaranteeing one execution.',
        },
        {
          question: 'What does `break outer;` do when outer labels an enclosing for loop?',
          options: ['Restarts the outer loop', 'Exits only the inner loop', 'Exits the labeled outer loop entirely', 'Skips the current outer iteration'],
          answerIndex: 2,
          explanation: 'A labeled break transfers control past the end of the labeled statement, exiting every loop nested inside it.',
        },
      ],
    },
    {
      slug: 'arrays-and-memory',
      vizId: 'arrays-and-memory',
      title: 'Arrays: Layout, Memory & Access',
      order: 9,
      level: 'intermediate',
      summary: 'How arrays are declared, laid out on the heap and indexed in constant time, including jagged 2D arrays and Arrays utilities.',
      sections: [
        { heading: 'Declaration, creation and initialization', body: "An array is a fixed-size, ordered sequence of elements of one type. Unlike a collection, its length is decided at creation and can never change. Resizing means allocating a new array and copying.\n\nThree syntax families exist. `int[] a;` declares a reference and is the preferred form because the type reads as an int array. `int a[];` is legal and inherited from C; keep it out of modern code. `int[] a = new int[5];` allocates. `int[] a = {1, 2, 3};` may only be used in a declaration. Elsewhere use `new int[] {1, 2, 3}`, for example when passing directly to a method.\n\n`new int[5]` zero-fills the block, so every element is immediately readable. For reference elements the default is `null`, which is why a fresh `String[3]` prints as `[null, null, null]` with `Arrays.toString`.\n\nThe size expression is evaluated once. A negative size throws `NegativeArraySizeException`, and a size above roughly `Integer.MAX_VALUE - 8` throws `OutOfMemoryError` before any elements exist. The field `length` is a `final` field on the array object, not a method, so `a.length()` does not compile.",
        },
        { heading: 'Object layout on the heap', body: "Every array is an object. A local variable holds only a reference; the elements live in a contiguous block on the heap.\n\nA typical HotSpot layout for `int[]` is: a **mark word** (8 bytes: identity hash, lock state, GC age), a **klass pointer** (4 bytes with compressed class pointers, 8 without), an **int length** (4 bytes), then the elements, then padding to a multiple of 8 bytes. That is a 16-byte header, so `new int[5]` consumes 16 + 20 = 36 bytes, rounded up to 40. A `long[]` or an object array has the same header but 8-byte or reference-sized elements, which can leave padding holes.\n\nThe class of an array is synthesized at runtime, named like `[I` for int arrays and `[Ljava.lang.String;` for String arrays. This is what `getClass().getName()` reports and what `instanceof` checks against.\n\nBecause the length is stored in the header, `a.length` is a field read, effectively free. Because elements are contiguous, the JVM can compute any address arithmetically and the CPU can prefetch neighboring elements into cache lines. Both properties follow from the same design decision and explain why arrays are the fastest general-purpose container in Java.",
        },
        { heading: 'Constant-time access and cache behavior', body: "Indexing is O(1) because the address is arithmetic: `address(i) = base + headerSize + i * elementSize`. For an `int[]` whose data starts at 1000, index 0 is 1000, index 1 is 1004, index 2 is 1008. No traversal, no comparison, no dependence on i.\n\nThe JVM inserts a bounds check before every access. If `i < 0 || i >= length` it throws `ArrayIndexOutOfBoundsException`. Modern CPUs speculate past the check, so its cost is usually negligible, and the check is what makes Java memory-safe.\n\nContiguity also wins on the memory hierarchy. A cache line is typically 64 bytes, so one fetch brings 16 consecutive ints. Iterating in index order reuses those lines; iterating in random order pays the full latency of a miss each time, which can be a hundred times slower.\n\nThis is why row-major traversal matters for 2D arrays: `for row { for col }` walks memory forward, while `for col { for row }` jumps between rows and defeats prefetching. The algorithmic complexity is identical and the wall-clock time is not. Measure before optimizing, but choose the natural order when it is free.",
        },
        { heading: 'Default values, bounds and reference arrays', body: "Element defaults match field defaults: numeric types are zero, `char` is `\\u0000`, `boolean` is false, references are `null`. This guarantee is what allows allocation without initialization code, but it also means a partially filled array is indistinguishable from a deliberately zero-filled one. Track the logical size separately when the array is used as a buffer.\n\nBounds are checked at both ends. `a[-1]` and `a[a.length]` both throw. The exception message includes the offending index, which is worth reading before assuming a logic error.\n\nFor reference arrays the danger is different: the array slot is non-null but the object may not be. `String[] names = new String[3]; names[0].length();` compiles and throws `NullPointerException` at runtime. Populate before use, or check.\n\nArrays are covariant in Java: `Object[] objects = new String[2];` is legal. Storing a non-String throws `ArrayStoreException` because the JVM checks the runtime component type on each store. This is a rare case where generics are safer, since `List<Object>` cannot be assigned from `List<String>`. Copying with `Arrays.copyOf`, `System.arraycopy` or `clone` produces a shallow copy: a new array with the same element references.",
        },
        { heading: 'Multidimensional and jagged arrays', body: "Java has no true multidimensional arrays. `int[][]` is an array whose elements are references to `int[]` objects. `new int[3][4]` allocates one outer array of length 3 and three inner arrays of length 4, in four separate heap objects.\n\nThis design gives jagged arrays for free. Each row can have a different length, which is useful for adjacency lists, triangular structures and ragged input:\n\n`int[][] triangle = new int[4][];` then `triangle[i] = new int[i + 1];`\n\nAccess is two bounds checks and two dereferences, and the rows need not be near each other in memory. A rectangular `int[][]` therefore costs more and performs worse than a flat `int[]` of size rows * cols indexed as `row * cols + col`. For numeric kernels, image buffers and competitive programming, the flat layout is measurably faster and worth the lost expressiveness.\n\n`length` gives the number of rows; `grid[row].length` gives the length of that row. `Arrays.toString` on a 2D array prints identities, not contents, so use `Arrays.deepToString`. Copying a 2D array with `clone` copies only the outer array and shares the rows.",
        },
        { heading: 'The Arrays utility class', body: "`java.util.Arrays` covers almost everything you would otherwise hand-write.\n\n| Method | Purpose |\n| :--- | :--- |\n| `toString` / `deepToString` | readable output for 1D and nested arrays |\n| `sort` | dual-pivot quicksort for primitives, TimSort for objects |\n| `binarySearch` | O(log n) search on a sorted array |\n| `fill` | set every element, or a range, to one value |\n| `copyOf` / `copyOfRange` | allocate a resized or sliced copy |\n| `equals` / `deepEquals` | content comparison |\n| `asList` | fixed-size list view backed by the array |\n| `stream` | bridge to the Stream API |\n| `mismatch` | first differing index between two arrays |\n\nDetails that matter: `sort` on primitives is not stable, on objects it is. `binarySearch` returns a negative value encoding the insertion point as `-(point) - 1`, so a miss still tells you where the value belongs. `asList` returns a fixed-size list, so `add` throws `UnsupportedOperationException`, and changes to the array are visible through the list. `Arrays.sort` on an object array uses a comparator when supplied. `System.arraycopy` is the fastest bulk copy and handles overlapping ranges correctly.",
        },
      ],
      javaCode: [
        {
          title: 'Declaration, defaults and iteration',
          description: 'Shows the syntax variants, default values and the two idiomatic traversal styles.',
          code: `import java.util.Arrays;

public class ArrayBasics {
    public static void main(String[] args) {
        int[] declared = new int[4];          // zero-filled
        int[] literal = {10, 20, 30, 40};
        String[] names = new String[2];       // null-filled

        System.out.println(Arrays.toString(declared));
        System.out.println(Arrays.toString(names));
        System.out.println("length = " + literal.length);

        int sum = 0;
        for (int i = 0; i < literal.length; i++) {
            sum += literal[i];
        }
        System.out.println("sum = " + sum);

        for (int value : literal) {
            System.out.println("value = " + value);
        }

        try {
            System.out.println(literal[literal.length]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("caught: " + e.getMessage());
        }
    }
}`,
        },
        {
          title: 'Jagged and rectangular 2D arrays',
          description: 'Builds a triangular array, prints it with deepToString and flattens a grid for comparison.',
          code: `import java.util.Arrays;

public class JaggedArrays {
    public static void main(String[] args) {
        int[][] triangle = new int[4][];
        for (int row = 0; row < triangle.length; row++) {
            triangle[row] = new int[row + 1];
            for (int col = 0; col < triangle[row].length; col++) {
                triangle[row][col] = row + col;
            }
        }
        System.out.println(Arrays.deepToString(triangle));
        System.out.println("rows = " + triangle.length);
        System.out.println("row 2 length = " + triangle[2].length);

        int rows = 3, cols = 4;
        int[][] grid = new int[rows][cols];
        int[] flat = new int[rows * cols];
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                int value = row * cols + col;
                grid[row][col] = value;
                flat[row * cols + col] = value;
            }
        }
        System.out.println(Arrays.deepToString(grid));
        System.out.println(Arrays.toString(flat));
    }
}`,
        },
        {
          title: 'Arrays utility methods in practice',
          description: 'Sorts, searches with insertion-point decoding, copies, fills and compares arrays.',
          code: `import java.util.Arrays;

public class ArraysUtility {
    public static void main(String[] args) {
        int[] data = {42, 7, 19, 3, 88, 15};
        Arrays.sort(data);
        System.out.println(Arrays.toString(data));

        int index = Arrays.binarySearch(data, 19);
        System.out.println("found 19 at " + index);

        int missing = Arrays.binarySearch(data, 20);
        int insertionPoint = -missing - 1;
        System.out.println("20 would be inserted at " + insertionPoint);

        int[] grown = Arrays.copyOf(data, data.length + 2);
        int[] slice = Arrays.copyOfRange(data, 1, 4);
        System.out.println(Arrays.toString(grown));
        System.out.println(Arrays.toString(slice));

        int[] filled = new int[5];
        Arrays.fill(filled, 9);
        System.out.println(Arrays.toString(filled));
        System.out.println(Arrays.equals(data, filled));

        int[] copy = data.clone();
        System.out.println(Arrays.equals(data, copy));
        System.out.println(Arrays.mismatch(data, slice));
    }
}`,
        },
      ],
      keyTakeaways: [
        'An array is a heap object with a 16-byte header holding a mark word, class pointer and length.',
        'Indexing is O(1) via base plus index times element size, with a bounds check on every access.',
        'Elements are default-initialized, so a new array is always safe to read but may be meaningless.',
        'int[][] is an array of row references, which is what makes jagged arrays possible.',
        'Arrays.sort plus Arrays.binarySearch is the standard pair, and binarySearch encodes misses as negative insertion points.',
      ],
      interviewTips: [
        'Derive the address formula and explain why it makes access constant time.',
        'Explain why row-major traversal beats column-major even with identical Big-O.',
        'Describe how a flat array can replace a rectangular 2D array and when that trade is worth it.',
      ],
      pitfalls: [
        'Using a.length() instead of a.length; length is a field on arrays.',
        'Assuming clone or copyOf deep-copies nested arrays.',
        'Forgetting that arrays.asList is fixed-size and backed by the original array.',
        'Traversing a 2D array with a shared column count when rows are jagged.',
      ],
      quiz: [
        {
          question: 'Why is array access O(1)?',
          options: ['Because arrays are sorted', 'Because the address is computed as base plus index times element size', 'Because the JVM caches every index', 'Because arrays store a hash table internally'],
          answerIndex: 1,
          explanation: 'Contiguous storage plus fixed element size lets the JVM compute the exact address arithmetically without searching.',
        },
        {
          question: 'What does Arrays.binarySearch return when the key is absent?',
          options: ['-1 always', 'null', 'A negative value encoding the insertion point as -(point) - 1', 'It throws NoSuchElementException'],
          answerIndex: 2,
          explanation: 'The encoded form distinguishes a miss at position 0 from other misses, since a plain -1 would be ambiguous with index 0.',
        },
      ],
    },
    {
      slug: 'methods-recursion-overloading',
      vizId: 'methods-recursion-overloading',
      title: 'Methods, Recursion & Overloading',
      order: 10,
      level: 'intermediate',
      summary: 'Method signatures, the call stack, pass-by-value semantics, overload resolution, recursion and varargs.',
      sections: [
        { heading: 'Anatomy of a method and its signature', body: "A method declaration combines modifiers, a return type, a name, a parameter list, an optional throws clause and a body. `public static int add(int a, int b) { return a + b; }` has every part worth naming.\n\nThe **signature** is the name plus the parameter types, in order. Return type, parameter names, modifiers, `throws` clauses and type parameters are not part of it. That definition drives overloading, overriding and what the compiler considers a duplicate declaration. Two methods differing only in return type are a compile error.\n\n`static` methods belong to the class and have no `this`. Instance methods receive an implicit first argument, the receiver, which is how they access fields. Constructors share the class name and have no return type. A method returning `void` can still use a bare `return;` for early exit.\n\nParameters are formal; arguments are the values at the call site. Java passes arguments by value in all cases, which is covered separately but worth stating here because the parameter list is where the confusion starts. `final` on a parameter prevents reassignment inside the body and is occasionally useful for documenting intent. Accessibility modifiers control who can call the method: `private`, package-private, `protected`, `public`.",
        },
        { heading: 'The call stack and stack frames', body: "Each thread has its own stack, sized by `-Xss`, typically around 512 KB to 1 MB. Every invocation pushes a **frame** containing the return address, saved registers, the method's local variables and the operand stack used for intermediate expression values. Popping the frame restores the caller.\n\nFrames are allocated contiguously downward from the top of the stack. Allocation is a pointer bump, which is why method calls are cheap, and why recursion depth rather than total call count is what exhausts the stack. A million sequential calls in a loop push and pop one frame at a time and are fine; ten thousand recursive calls without returning overflow.\n\n`StackOverflowError` is an `Error`, not an `Exception`, and it can leave the stack in a state where further calls fail. Catching it is rarely productive; the right response is to reduce depth or convert to iteration.\n\nA stack trace is a snapshot of the frames at throw time, read bottom-up: the bottom is the entry point, the top is where the exception occurred. `Thread.getStackTrace()` and `StackWalker` (Java 9+) expose the same information programmatically. Deep stacks also cost memory per thread, which is one reason virtual threads in Java 21 matter: they grow their stacks on the heap.",
        },
        { heading: 'Pass-by-value, references and mutation', body: "Java is strictly pass-by-value. The value copied is either a primitive or a reference. There is no pass-by-reference, and no way for a method to rebind a caller's variable.\n\nFor a primitive, the method receives a copy. `void bump(int x) { x++; }` leaves the caller's variable unchanged. For a reference, the method receives a copy of the handle, which points at the same object. Mutating through the handle is visible to the caller: `void fill(int[] a) { a[0] = 99; }` changes the caller's array. Reassigning the handle is not: `void replace(int[] a) { a = new int[3]; }` has no effect outside.\n\nThe classic demonstration is a `StringBuilder` parameter: calling `append` mutates the shared object, while assigning a new `StringBuilder` to the parameter does nothing. `String` is immutable, so no method can change its contents at all, only return a new string.\n\nThis is why mutable objects need care at API boundaries. If a method stores a caller's array or list, the caller can mutate it later. Defensive copying on both input and output is the standard fix when immutability is a requirement. Records with mutable components have the same hazard.",
        },
        { heading: 'Overloading and how the compiler chooses', body: "Overloading means several methods with the same name but different parameter lists in one class. The compiler selects one at compile time based on the **static types** of the arguments, which is why overloading is called compile-time polymorphism.\n\nResolution happens in phases. First, applicable methods are found without boxing or varargs, allowing only widening. If exactly one matches, it wins. If none, the next phase allows boxing and unboxing. If still none, varargs are considered. If several remain applicable after a phase, the most specific one wins; if neither is more specific, the call is ambiguous and fails to compile.\n\nConsequences worth knowing:\n\n- `f(long)` is chosen over `f(Integer)` for an `int` argument, because widening beats boxing.\n- `f(Object)` accepts a `String` and is preferred over `f(String...)` in the early phases.\n- Passing `null` is ambiguous when two overloads take unrelated reference types.\n- Return type does not participate, so `int get()` and `String get()` cannot coexist.\n- An overload is chosen from the declared type, so `Object o = \"x\"; f(o)` picks `f(Object)` even though the runtime type is String.\n\nOverloading improves readability when the methods do the same conceptual job. When behavior differs by type, overriding plus dynamic dispatch is usually the better design.",
        },
        { heading: 'Recursion: base cases and the shape of the call tree', body: "A recursive method calls itself on a smaller input. Two parts are mandatory: a **base case** that returns without recursing, and a recursive case that provably moves toward it. Missing or unreachable base cases produce `StackOverflowError` after a few thousand frames.\n\n`factorial(n) = n <= 1 ? 1 : n * factorial(n - 1)` recurses once per call, a linear chain of depth n. `fib(n) = fib(n-1) + fib(n-2)` recurses twice per call, producing an exponential tree of about 2^n nodes, most of them recomputing the same values. The fix is memoization, caching results in an array or map, which collapses the tree to O(n) states.\n\nRecursion depth is bounded by stack size. With a 1 MB stack and frames of roughly 100 bytes, expect tens of thousands of frames, not millions. Java does not perform tail-call optimization, so a tail-recursive method still grows the stack; convert it to a loop when depth is data-dependent.\n\nRecursion is the natural expression for trees, divide and conquer, backtracking and grammars. For simple linear loops it is usually slower and less clear. When writing one, state the base case first and describe the recursive case in terms of a smaller problem that is already solved.",
        },
        { heading: 'Varargs and method design', body: "A varargs parameter `String... parts` accepts zero or more arguments and is compiled into an array. It must be the last parameter, and there can be only one. Inside the method it behaves exactly like `String[]`.\n\nAt the call site the compiler wraps the arguments into a new array, so `log(\"a\", \"b\")` allocates. Calling with an existing array passes it directly without copying, which means the method can mutate the caller's array. That aliasing is a subtle source of bugs; copy inside the method if you plan to modify or store it.\n\nOverload resolution treats varargs as the last resort, which prevents most surprises but also means adding an overload can silently change which method existing calls bind to. `Arrays.asList`, `List.of`, `String.format` and `printf` all rely on varargs.\n\nWith generics, a varargs parameter of a generic type produces an unchecked warning because the compiler cannot guarantee the array's runtime type. `@SafeVarargs` on a `static`, `final` or constructor method suppresses it when the body only reads the elements. That annotation is a promise, not a check.\n\nMethod design rules that pay off: keep parameter lists under four items, prefer a small parameter object beyond that, avoid boolean flag parameters that make call sites unreadable, and never return `null` when an empty collection or `Optional` expresses the same thing.",
        },
      ],
      javaCode: [
        {
          title: 'Pass-by-value in three experiments',
          description: 'Proves that primitives and reference reassignment cannot escape a method, while in-place mutation can.',
          code: `import java.util.Arrays;

public class PassByValue {
    static void bump(int x) {
        x = x + 1;
    }

    static void reassign(int[] data) {
        data = new int[] {9, 9, 9};
    }

    static void mutate(int[] data) {
        data[0] = 99;
    }

    static void append(StringBuilder sb) {
        sb.append(" world");
        sb = new StringBuilder("lost");
        sb.append(" forever");
    }

    public static void main(String[] args) {
        int n = 5;
        bump(n);
        System.out.println("n = " + n);

        int[] values = {1, 2, 3};
        reassign(values);
        System.out.println(Arrays.toString(values));

        mutate(values);
        System.out.println(Arrays.toString(values));

        StringBuilder sb = new StringBuilder("hello");
        append(sb);
        System.out.println(sb);
    }
}`,
        },
        {
          title: 'Overload resolution in action',
          description: 'Shows widening beating boxing, static type selection and an ambiguity that fails to compile.',
          code: `public class Overloading {
    static String pick(long value) {
        return "long";
    }

    static String pick(Integer value) {
        return "Integer";
    }

    static String describe(Object value) {
        return "Object";
    }

    static String describe(String value) {
        return "String";
    }

    static int sum(int... values) {
        int total = 0;
        for (int value : values) {
            total += value;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(pick(10));            // widening beats boxing

        Object boxed = "text";
        System.out.println(describe(boxed));     // static type wins
        System.out.println(describe("text"));

        System.out.println(sum());
        System.out.println(sum(1, 2, 3));
        System.out.println(sum(new int[] {4, 5}));
    }
}`,
        },
        {
          title: 'Recursion with memoization',
          description: 'Contrasts naive exponential Fibonacci with a memoized linear version and a depth guard.',
          code: `import java.util.Arrays;

public class Recursion {
    static long naiveFib(int n) {
        if (n < 2) {
            return n;
        }
        return naiveFib(n - 1) + naiveFib(n - 2);
    }

    static long memoFib(int n, long[] memo) {
        if (n < 2) {
            return n;
        }
        if (memo[n] != -1) {
            return memo[n];
        }
        memo[n] = memoFib(n - 1, memo) + memoFib(n - 2, memo);
        return memo[n];
    }

    static int depth(int n) {
        if (n == 0) {
            return 0;
        }
        return 1 + depth(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("naive fib(30) = " + naiveFib(30));

        long[] memo = new long[91];
        Arrays.fill(memo, -1);
        System.out.println("memo fib(90)  = " + memoFib(90, memo));
        System.out.println("depth 10000   = " + depth(10_000));

        long frames = StackWalker.getInstance().walk(stream -> stream.count());
        System.out.println("frames on stack = " + frames);
    }
}`,
        },
      ],
      keyTakeaways: [
        'The signature is name plus parameter types; return type and modifiers are not part of it.',
        'Each call pushes a frame, so recursion depth, not call count, is what overflows the stack.',
        'Java is always pass-by-value: primitives copy values, objects copy references.',
        'Overload resolution prefers widening over boxing and uses static types, not runtime types.',
        'Varargs is an array at runtime, allocated at the call site unless an array is passed directly.',
      ],
      interviewTips: [
        'Settle pass-by-value with the reassign-versus-mutate experiment rather than repeating slogans.',
        'Walk through overload resolution phases: no boxing, then boxing, then varargs.',
        'Explain why naive Fibonacci is exponential and what memoization changes.',
      ],
      pitfalls: [
        'Claiming Java is pass-by-reference for objects.',
        'Writing a recursive method with an unreachable base case.',
        'Trying to overload by return type.',
        'Mutating a varargs array that the caller still holds.',
      ],
      quiz: [
        {
          question: 'What does `void replace(int[] a) { a = new int[3]; }` do to the caller\'s array?',
          options: ['It replaces the contents with zeros', 'It resizes the caller\'s array', 'Nothing, because only the local reference copy is reassigned', 'It throws NullPointerException'],
          answerIndex: 2,
          explanation: 'The reference is passed by value. Reassigning the parameter changes only the local copy, while mutating through it would have been visible.',
        },
        {
          question: 'Given overloads f(long) and f(Integer), which is called for an int argument?',
          options: ['f(Integer), because boxing is preferred', 'f(long), because widening is preferred over boxing', 'Both, in order', 'Neither, the call is ambiguous'],
          answerIndex: 1,
          explanation: 'Phase one allows widening without boxing, so f(long) is applicable and is chosen before boxing is ever considered.',
        },
      ],
    },
  ],
};
