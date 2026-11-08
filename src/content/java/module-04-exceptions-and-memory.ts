import type { JavaModule } from '../../types/java.ts';

export const module04: JavaModule = {
  slug: 'exceptions-and-memory',
  title: 'Exceptions & Memory',
  order: 4,
  summary:
    "How Java reports failure and manages memory: exception flow, the JVM's runtime areas, and garbage collection.",
  overview:
    'Two halves of the same story: what a program does when something goes wrong, and where its data actually lives. ' +
    'You will trace an exception from the failing instruction to the handler, design exception hierarchies that carry real context, ' +
    'then walk through the JVM runtime data areas and the generational heap so that stack overflows, memory leaks and GC pauses stop being mysteries.',

  topics: [
    // ---------------------------------------------------------------------
    // 1. Exception Handling from Scratch
    // ---------------------------------------------------------------------
    {
      slug: 'exception-handling-basics',
      vizId: 'exceptions-and-memory',
      title: 'Exception Handling from Scratch',
      order: 1,
      summary:
        'Follow an exception from the failing instruction to the handler, and master try/catch/finally and try-with-resources.',
      level: 'beginner',
      sections: [
        { heading: 'Why exception handling exists', body: `Every non-trivial program has a happy path and a long list of ways that path can break. A user types letters into an age field, a file that existed at startup has been deleted, a socket times out, a database rejects a duplicate key. None of these are programming errors in the narrow sense, yet all of them must be anticipated.

Without a language-level mechanism, error handling would be expressed as return codes and boolean flags threaded through every method signature. Each call site would need to check a status value, and the real logic would drown in \\\`if (result != OK)\\\` noise. Java separates the normal flow from the failure flow instead: a method either returns a value or throws an object that describes what went wrong. Callers may handle that object, translate it, or let it travel further up the call stack.

Java splits throwable conditions into two families, both rooted at \\\`Throwable\\\`:

| Family | Meaning | Typical examples |
| --- | --- | --- |
| \\\`Exception\\\` | An abnormal but usually recoverable condition caused by the program or its environment | \\\`IOException\`, \`NullPointerException\` |
| \`Error\` | A serious JVM or platform failure that application code is not expected to repair | \`OutOfMemoryError\`, \`StackOverflowError\` |

Exceptions are part of a method's contract, so they belong in its documentation and its signature. Errors mean the process is in a state where continuing is unsafe, which is why you rarely catch them.`,
        },
        { heading: 'Throwing, unwinding and stack propagation', body: `When an illegal operation occurs, the JVM constructs an exception object that records the message and a snapshot of the current call stack, then throws it. A \\\`throw\\\` statement in your own code does exactly the same thing: \\\`throw new IllegalArgumentException("age must be >= 0")\\\`. From that instant, normal sequential execution in the current method stops.

The JVM then unwinds the stack. Each frame it leaves is discarded, along with that frame's local variables, and any \\\`finally\\\` block belonging to a frame runs during unwinding. The search continues outward until a frame contains a \\\`catch\\\` clause whose type matches the thrown object (a match means "is an instance of", so a handler for \\\`Exception\\\` accepts an \\\`IOException\\\`). The first matching handler wins; the frames below it are gone forever.

| Frame | Handler present? | Outcome |
| --- | --- | --- |
| \\\`repository.find()\\\` | no | frame discarded, exception rethrown outward |
| \\\`service.load()\\\` | \\\`catch (SQLException)\\\` | no match for \\\`IOException\`, discarded |
| \`main()\` | \`catch (Exception)\` | match, execution resumes inside the catch block |
| none | — | default handler prints the stack trace and ends the thread |

This is why exceptions are cheap to propagate but expensive to create: filling in the stack trace walks the stack once at construction time. Throwing inside a tight loop is a design smell, not just a performance one.`,
        },
        { heading: 'The default handler and reading stack traces', body: `If no frame handles the exception, the thread's uncaught exception handler takes over. For an ordinary thread that is the thread group, which delegates to the default handler and prints something like:

\\\`Exception in thread "main" java.lang.ArithmeticException: / by zero\\\` followed by \\\`at com.example.Demo.divide(Demo.java:12)\\\` and the rest of the frames.

Read that output bottom-up for context and top-down for cause. The first line names the thread, the exact runtime class of the throwable and its message. The first \\\`at\\\` line is where the exception was created, not where it was necessarily detected, because the trace is captured at construction. Frames below show the callers, and \\\`... 12 more\\\` means the remainder was elided because it repeats a suffix of a \\\`Caused by\\\` trace.

Two more details matter in practice. \\\`Caused by:\\\` sections reveal the exception chain, so the deepest cause is usually the true root. And since Java 15, helpful NullPointerException messages name the exact expression that was null, for example \\\`Cannot invoke "String.length()" because "name" is null\`, which often removes the need to reproduce the bug.

In production, configure a logging framework to record the full trace with the thread name and request context. Printing to \`System.err\` bypasses your log pipeline and loses the correlation ID that makes an incident debuggable.`,
        },
        { heading: 'try/catch/finally and the exact execution order', body: `The \\\`try\\\` block marks code that may fail, \\\`catch\\\` clauses intercept matching throwables, and \\\`finally\\\` runs no matter how control leaves the block. The subtle part is "how control leaves", because \\\`return\`, \`break\`, \`continue\` and exceptions all count.

| Scenario | Order of execution |
| --- | --- |
| No exception | \`try\` body, then \`finally\` |
| Exception caught | \`try\` up to the failure, matching \`catch\`, then \`finally\` |
| Exception not caught | \`try\` up to the failure, then \`finally\`, then propagation |
| \`return\` inside \`try\` | \`try\` computes the value, \`finally\` runs, then the method returns |
| \`return\` inside \`finally\` | that return wins, discarding the pending return or exception |

The last row is the trap. A \`return\` in \`finally\` silently swallows exceptions, breaks \`try-with-resources\` semantics and hides bugs from every caller. The same is true of a \`finally\` block that throws: the new exception replaces the original one, which is why cleanup code should be defensive.

Three more facts worth memorising. A \`return\` in \`try\` evaluates its expression before \`finally\` runs, so mutating a local in \`finally\` does not change the already-computed value. \`System.exit\` terminates the JVM without running \`finally\`. And a \`catch\` block that itself throws still triggers the \`finally\` block on the way out.`,
        },
        { heading: 'Multi-catch and precise rethrow', body: `When several unrelated exceptions deserve the same recovery logic, Java 7's multi-catch avoids copy-pasted blocks: \\\`catch (IOException | SQLException e)\\\`. The alternatives must be disjoint types; writing two types where one is a subclass of the other is a compile error because the second is unreachable. The parameter \\\`e\\\` is implicitly final, so you cannot reassign it, and its static type is the least upper bound of the alternatives — often \\\`Exception\`, which limits which methods you can call on it.

Multi-catch also improves rethrow analysis. Consider a method that catches \`Exception\`, inspects it, and rethrows. Before Java 7 the compiler widened the declared type to \`throws Exception\`, forcing every caller to handle everything. Since Java 7 the compiler performs precise rethrow analysis: if the try block can only throw \`IOException\` and \`SQLException\`, a rethrown \`e\` is analysed as those types, and the method may declare exactly \`throws IOException, SQLException\`.

Use multi-catch when the handling is genuinely identical, such as logging and mapping to a single error response. If two exceptions need different messages or different recovery steps, keep separate blocks — merging them usually produces a vague handler that treats a missing file the same as a corrupt one, which is exactly the kind of imprecision that makes incidents hard to diagnose.`,
        },
        { heading: 'try-with-resources and close order', body: `Anything that holds an OS handle — files, sockets, JDBC connections, locks implemented as resources — must be released deterministically. The classic \\\`try/finally\\\` pattern works but is verbose and easy to get wrong when there are several resources. \\\`try-with-resources\\\` declares resources in the header and guarantees that each \\\`close()\\\` runs before control leaves the block.

\\\`try (var in = Files.newInputStream(src); var out = Files.newOutputStream(dst))\\\` requires each resource to implement \\\`AutoCloseable\`, whose single method is \`void close() throws Exception\`. \`Closeable\` is the narrower \`java.io\` variant that throws only \`IOException\`.

The rules that matter:

- Resources are closed in the **reverse order of declaration**, so the last opened is the first closed.
- Each resource is closed even if the try body throws, and even if an earlier \`close()\` throws.
- If the body throws and a \`close()\` also throws, the body's exception stays primary and the close exception is attached as suppressed.
- Since Java 9 you may name an existing effectively final variable: \`try (in)\`.
- Resources declared in the header are implicitly final and scoped to the block.

Never call \`close()\` manually inside the block as well. Double closing is at best redundant and at worst throws, and any exception it raises can mask the real failure you were trying to diagnose.`,
        },
        { heading: 'Suppressed exceptions and debugging discipline', body: `Older cleanup code had a well-known flaw: if the body threw \\\`IllegalArgumentException\\\` and the \\\`finally\\\` block's \\\`close()\\\` threw \\\`IOException\`, the original failure vanished. Java 7 solved this with suppressed exceptions. When \`try-with-resources\` closes resources after a primary failure, any exception from \`close()\` is attached to the primary throwable via \`addSuppressed\` rather than replacing it.

You can read them with \`e.getSuppressed()\`, and log frameworks print them under a \`Suppressed:\` heading. The primary exception remains what \`catch\` sees, which is the right default: the work failed, and cleanup also failed.

You can use the same mechanism manually when translating exceptions without losing a secondary failure: catch the cleanup exception, call \`primary.addSuppressed(cleanup)\`, then rethrow \`primary\`. Guard against self-suppression, because \`addSuppressed(e)\` with the same object throws \`IllegalArgumentException\`.

Debugging discipline follows from all of this:

- Log **or** rethrow, never both at the same level, or one failure produces five identical stack traces.
- Always pass the original exception as the cause when wrapping; \`new ServiceException(msg, e)\` preserves the chain.
- Never write \`catch (Exception e) { }\`. An empty handler converts a crash into silent corruption.
- Include the values that explain the failure — the path, the id, the size — not just "operation failed".
- Prefer specific catch types so a new failure mode is not accidentally swallowed by an over-broad handler.`,
        },
      ],
      javaCode: [
        {
          title: 'try, catch, finally in order',
          description:
            'The finally block runs after the catch block and before the method actually returns, even when the try block returns a value.',
          code: `public class TryCatchFinallyDemo {

    public static void main(String[] args) {
        System.out.println(divide(10, 2));
        System.out.println(divide(10, 0));
    }

    static int divide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            System.out.println("caught: " + e.getMessage());
            return -1;
        } finally {
            System.out.println("finally runs for " + a + "/" + b);
        }
    }
}`,
        },
        {
          title: 'Why a return in finally is dangerous',
          description:
            'The return in the try block computes its value before finally runs, and a return inside finally overrides both a pending return and a pending exception.',
          code: `public class FinallyReturnDemo {

    static int computedBeforeFinally() {
        int result = 10;
        try {
            return result;          // value 10 is fixed here
        } finally {
            result = 20;            // too late to change the return value
        }
    }

    static int swallowsTheException() {
        try {
            throw new IllegalStateException("boom");
        } finally {
            return 42;              // discards the exception - never do this
        }
    }

    public static void main(String[] args) {
        System.out.println(computedBeforeFinally());   // 10
        System.out.println(swallowsTheException());    // 42
    }
}`,
        },
        {
          title: 'Multi-catch for unrelated failures',
          description:
            'Multi-catch merges handling for disjoint types. The parameter is effectively final and typed as the least upper bound of the alternatives.',
          code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class MultiCatchDemo {

    static String readFirstLine(Path path) {
        try {
            return Files.readAllLines(path).get(0);
        } catch (IOException | IndexOutOfBoundsException e) {
            System.out.println("could not read: " + e.getClass().getSimpleName());
            return "";
        }
    }

    public static void main(String[] args) {
        System.out.println("[" + readFirstLine(Path.of("missing.txt")) + "]");
    }
}`,
        },
        {
          title: 'try-with-resources: reverse close order and suppression',
          description:
            'Resources close in reverse declaration order. When the body fails, a failing close() is attached as a suppressed exception instead of replacing the original.',
          code: `public class TryWithResourcesDemo {

    static final class Resource implements AutoCloseable {
        private final String name;
        private final boolean failOnClose;

        Resource(String name, boolean failOnClose) {
            this.name = name;
            this.failOnClose = failOnClose;
            System.out.println("open " + name);
        }

        @Override
        public void close() {
            System.out.println("close " + name);
            if (failOnClose) {
                throw new IllegalStateException("close failed: " + name);
            }
        }
    }

    public static void main(String[] args) {
        try (Resource outer = new Resource("outer", false);
             Resource inner = new Resource("inner", true)) {
            throw new IllegalArgumentException("work failed");
        } catch (RuntimeException e) {
            System.out.println("primary: " + e.getMessage());
            for (Throwable suppressed : e.getSuppressed()) {
                System.out.println("suppressed: " + suppressed.getMessage());
            }
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Exceptions separate the happy path from failure handling; Error signals an unrecoverable JVM or platform failure.',
        'Throwing captures a stack trace, unwinds frames, runs their finally blocks, and stops at the first matching catch.',
        'The first `at` line of a trace is where the exception was constructed, so read the trace top-down for the site and bottom-up for the chain.',
        'finally always runs after the try or catch completes, and a return inside finally overrides a pending return or exception.',
        'try-with-resources closes in reverse declaration order and records close failures as suppressed exceptions.',
      ],
      interviewTips: [
        'When asked "does finally always execute?", answer yes but name the exceptions: `System.exit`, a JVM crash, an infinite loop, or a `return` that pre-empts it.',
        'Be ready to state the exact order for `try { return } finally { }`: the return expression is evaluated first, then finally, then the return.',
        'Explain that a `catch` parameter matches by `instanceof`, so `catch (Exception e)` also catches subclasses you never intended to handle.',
        'Mention suppressed exceptions when discussing try-with-resources; it shows you know how Java 7 avoided losing the original failure.',
      ],
      pitfalls: [
        'Writing `catch (Exception e) {}` and turning a crash into silent data corruption.',
        'Returning from `finally`, which discards the in-flight exception and any earlier return value.',
        'Catching an exception only to log it and rethrow a new one without passing the cause, destroying the chain.',
        'Closing a resource manually inside a try-with-resources block, causing a double close that can mask the real error.',
        'Assuming `finally` runs on `System.exit(0)` or after the JVM is killed.',
      ],
      quiz: [
        {
          question: 'What does this method print?\n\nstatic int f() {\n  try { return 1; } finally { return 2; }\n}',
          options: ['It fails to compile', '1', '2', 'It throws an exception'],
          answerIndex: 2,
          explanation:
            'A return inside finally overrides the pending return from the try block, so the method returns 2. This is legal but strongly discouraged.',
        },
        {
          question:
            'A try-with-resources block declares resources A then B. The body throws, and B.close() also throws. What does the caller observe?',
          options: [
            'B.close() exception replaces the body exception',
            'The body exception is primary and B.close() is available via getSuppressed()',
            'Both exceptions are merged into one message',
            'The body exception is discarded and only B.close() surfaces',
          ],
          answerIndex: 1,
          explanation:
            'Resources close in reverse order (B then A). A failure during close is attached to the primary body exception as a suppressed exception, so the original cause is never lost.',
        },
      ],
    },

    // ---------------------------------------------------------------------
    // 2. Exception Hierarchy, throw/throws & Custom Exceptions
    // ---------------------------------------------------------------------
    {
      slug: 'exception-hierarchy-and-custom-exceptions',
      vizId: 'exception-hierarchy-and-custom-exceptions',
      title: 'Exception Hierarchy, throw/throws & Custom Exceptions',
      order: 2,
      summary:
        'Map the Throwable tree, choose checked or unchecked, and design custom exceptions that preserve context and cause.',
      level: 'intermediate',
      sections: [
        { heading: 'The Throwable hierarchy', body: `Everything that can be thrown descends from \\\`java.lang.Throwable\`, an ordinary class with two direct subclasses: \`Error\` and \`Exception\`. \`Throwable\` supplies the behaviour every failure object needs: \`getMessage()\`, \`getCause()\`, \`getStackTrace()\`, \`printStackTrace()\`, \`addSuppressed()\` and \`fillInStackTrace()\`.

Under \`Exception\` sits \`RuntimeException\`, and this single branch is what separates checked from unchecked. Everything else under \`Exception\` is checked: \`IOException\` (with \`FileNotFoundException\`, \`NoSuchFileException\`, \`EOFException\`), \`SQLException\`, \`ClassNotFoundException\`, \`InterruptedException\`, \`ParseException\`. Under \`RuntimeException\` are the programming-error family: \`NullPointerException\`, \`IllegalArgumentException\`, \`IllegalStateException\`, \`IndexOutOfBoundsException\`, \`ClassCastException\`, \`UnsupportedOperationException\`, \`ConcurrentModificationException\`, \`ArithmeticException\`.

Under \`Error\`: \`OutOfMemoryError\`, \`StackOverflowError\`, \`NoClassDefFoundError\`, \`ExceptionInInitializerError\`, \`AssertionError\`.

| Depth | Class | Meaning |
| --- | --- | --- |
| root | \`Throwable\` | anything throwable |
| 1 | \`Error\` | JVM-level failure, do not catch |
| 1 | \`Exception\` | application-level failure |
| 2 | \`RuntimeException\` | unchecked, usually a bug |
| 3 | \`IOException\` etc. | checked, usually environmental |

Interviewers often ask where \`InterruptedException\` sits: it is checked, and catching it obliges you to restore the interrupt flag with \`Thread.currentThread().interrupt()\` rather than swallowing it.`,
        },
        { heading: 'Checked, unchecked and Error: when to use which', body: `The compiler rule is simple: a checked exception must be either handled by a enclosing \\\`catch\\\` or declared in the method's \\\`throws\\\` clause. Unchecked exceptions and errors are exempt. This is not a runtime property — bytecode carries no such flag; it is purely a compile-time contract enforced by \\\`javac\\\`.

The design question is what the exception communicates. A checked exception says "this can fail for reasons outside your control, and you must make a decision". A missing file, a dropped connection, a failed transaction: the caller can retry, fall back or report. An unchecked exception says "you broke the contract" — a null where an object was required, an index outside the array, an argument failing a precondition. Recovery by catching it is usually wrong; the fix belongs in the code.

| Aspect | Checked | Unchecked | Error |
| --- | --- | --- | --- |
| Base type | \\\`Exception\\\` minus \\\`RuntimeException\\\` | \\\`RuntimeException\\\` | \\\`Error\\\` |
| Compiler enforces handling | yes | no | no |
| Typical cause | environment, I/O, network | programming bug | JVM exhaustion |
| Reasonable recovery | retry, fallback, user prompt | fix the code | restart the process |
| Examples | \\\`IOException\`, \`SQLException\` | \`NPE\`, \`IllegalArgumentException\` | \`OutOfMemoryError\` |

Modern practice, visible in the JDK and in most libraries, leans towards fewer checked exceptions: they push noise into signatures, encourage \`throws Exception\`, and break lambdas. Use checked exceptions at genuine I/O boundaries and unchecked ones for API misuse.`,
        },
        { heading: 'Catch ordering and unreachable blocks', body: `Java checks \\\`catch\\\` clauses in source order and picks the first whose type matches. Because matching is an \\\`instanceof\\\` test, a broad clause placed before a narrow one makes the narrow clause impossible to reach, and \\\`javac\\\` rejects it with "exception X has already been caught".

The rule is therefore: **most specific first, most general last**. Catch \\\`FileNotFoundException\`, then \`IOException\`, then — rarely — \`Exception\`. A related compile-time rule applies to checked exceptions that the try body can never throw: \`catch (FileNotFoundException e)\` around code that only throws \`NoSuchFileException\` is an error, because \`FileNotFoundException\` is not a supertype of anything thrown. Unchecked exceptions are exempt from that check, which is why \`catch (NullPointerException e)\` always compiles.

Multi-catch does not change the ordering rule; the merged clause must still precede any supertype of its alternatives. And a subclass cannot appear both inside a multi-catch and in a later separate clause.

In practice, order your handlers by recovery strategy rather than by taxonomy. Transient failures (timeouts) get a retry, permanent ones (validation) get a client error response, and unknown ones should surface rather than be flattened into a generic failure. Catching \`Exception\` at the outermost boundary — one place, with logging and a stable error response — is reasonable; doing it in every method is not.`,
        },
        { heading: 'throw vs throws', body: `The two keywords look alike and do different jobs. \\\`throw\\\` is a statement inside a method body; it takes a single throwable object and transfers control immediately. \\\`throws\\\` is part of a method or constructor declaration; it lists the checked exception types that may escape, delegating the decision to callers.

\\\`throw new IllegalArgumentException("quantity must be positive");\\\` can appear anywhere, including inside a lambda. \\\`public void save(Order order) throws IOException\\\` appears exactly once, in the signature, and documents part of the contract. Declaring unchecked exceptions in \\\`throws\\\` is legal but adds no compiler enforcement; it is useful only as documentation, and many style guides discourage it.

Three details interviewers like. First, \\\`throw\\\` requires a \\\`Throwable\\\` instance, so \\\`throw\\\` cannot take a \\\`Class\\\` or a string. Second, you can rethrow an existing object: \\\`throw e;\\\` preserves the original stack trace, whereas \\\`throw new RuntimeException(e)\\\` starts a new trace and nests the old one as the cause. Third, a method that declares \\\`throws IOException\\\` may still throw nothing; the declaration is a permission, not an obligation.

Overriding methods may narrow the declared type (throw fewer or more specific checked exceptions) but never widen it. That rule keeps polymorphism safe: code written against the parent type cannot be surprised by a new checked failure.`,
        },
        { heading: 'Designing custom exceptions', body: `A custom exception exists to give callers something they can act on: a distinct type to catch, and fields that carry the context a generic message cannot. Extend \\\`RuntimeException\\\` when the failure is a contract violation or a configuration error; extend \\\`Exception\\\` when callers are expected to handle it deliberately.

A well-designed exception class is small and immutable:

- A constructor taking only a message.
- A constructor taking a message and a cause.
- A constructor taking only a cause, for wrapping.
- Optional extra fields, \\\`final\`, with accessor methods named after the field.
- \`serialVersionUID\` if the class may ever be serialised.
- No business logic, no formatting beyond the message.

Name the class after the condition, not the thrower: \`InsufficientFundsException\`, not \`BankServiceException\`. Keep the message specific and safe: include identifiers and limits, never passwords, tokens or full payloads, because messages end up in logs and error responses.

Avoid a deep hierarchy of near-duplicate types; two or three per bounded context is usually enough, plus one base type so callers can catch the family. And always document the exception with \`@throws\` in the Javadoc of the method that raises it, so the contract is visible without reading the implementation.`,
        },
        { heading: 'Exception chaining and the cause', body: `Layered applications translate failures: a \\\`SQLException\\\` from the driver becomes an \\\`OrderRepositoryException\`, which becomes a \`CheckoutFailedException\`. Translation is good — it stops implementation details leaking into the API — but only if the original failure is preserved. That is what the cause is for.

\`throw new CheckoutFailedException("could not reserve stock for order " + id, e);\` keeps the whole chain, and the printed trace shows \`Caused by: java.sql.SQLException: ...\` underneath. Without the second argument the trace stops at your wrapper, and the actual root cause is gone.

Four rules keep chains healthy. Never wrap and drop: if you cannot pass the cause through a constructor, call \`initCause(e)\` once. Never wrap an exception in itself or in a cycle, which makes \`printStackTrace\` loop. Translate once, at the boundary of the layer that owns the abstraction, not in every method. And when logging, log the outermost exception with its cause, not each layer separately.

Resist the urge to flatten everything into \`RuntimeException\` at the boundary. A caller that can distinguish "invalid input" from "database down" will produce a far better response, and the distinction costs only a class and a constructor.`,
        },
        { heading: 'Exception handling best practices', body: `Good exception handling is mostly about deciding where responsibility lives. The following rules cover nearly every review comment you will encounter.

- **Fail fast at the boundary.** Validate arguments at the top of a public method with \\\`Objects.requireNonNull\\\` and explicit range checks. \\\`IllegalArgumentException\\\` thrown early is cheaper than a \\\`NullPointerException\\\` ten frames later.
- **Catch only what you can handle.** If the handler cannot retry, compensate or translate, let the exception travel.
- **Never swallow.** An empty catch block, or one that only logs and continues, hides corruption.
- **Do not use exceptions for control flow.** A \\\`for\\\` loop that throws to break out is slower and harder to read than a condition.
- **Preserve the cause** whenever you wrap, and never lose the interrupt status of \\\`InterruptedException\\\`.
- **Do not catch \\\`Throwable\\\`** in ordinary code; it includes \\\`OutOfMemoryError\\\` and \\\`ThreadDeath\\\`.
- **Clean up in \\\`finally\\\` or, better, with try-with-resources.**
- **Document checked exceptions** with \\\`@throws\`, and keep the set small.
- **Log once**, at the layer that decides the outcome, with context and the full trace.

A useful test: for every catch block, ask what the program does differently because of it. If the answer is "nothing", the block should not exist.`,
        },
      ],
      javaCode: [
        {
          title: 'Catch order: specific before general',
          description:
            'FileNotFoundException is a subclass of IOException, so it must be caught first. Reversing the two clauses is a compile-time error.',
          code: `import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class CatchOrderDemo {

    static String open(String file) {
        try (FileInputStream in = new FileInputStream(file)) {
            return "opened, bytes available: " + in.available();
        } catch (FileNotFoundException e) {      // most specific first
            return "not found: " + file;
        } catch (IOException e) {                // then the supertype
            return "io failure: " + e.getMessage();
        }
    }

    public static void main(String[] args) {
        System.out.println(open("absent.txt"));
    }
}`,
        },
        {
          title: 'throw inside a body, throws in a signature',
          description:
            'A checked exception is declared and handled by the caller; an unchecked one is thrown for a contract violation and needs no declaration.',
          code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ThrowVsThrowsDemo {

    /** Declares the checked failure instead of handling it here. */
    static String load(Path path) throws IOException {
        return Files.readString(path);
    }

    static int parseAge(String raw) {
        int age = Integer.parseInt(raw);
        if (age < 0) {
            throw new IllegalArgumentException("age must be >= 0, was " + age);
        }
        return age;
    }

    public static void main(String[] args) {
        try {
            System.out.println(load(Path.of("profile.txt")));
        } catch (IOException e) {
            System.out.println("handled checked failure: " + e.getMessage());
        }

        try {
            parseAge("-3");
        } catch (IllegalArgumentException e) {
            System.out.println("rejected input: " + e.getMessage());
        }
    }
}`,
        },
        {
          title: 'A custom checked exception with context',
          description:
            'Immutable fields, the three standard constructors and a serialVersionUID. Callers can catch the type and inspect the shortfall.',
          code: `public class InsufficientFundsException extends Exception {

    private static final long serialVersionUID = 1L;

    private final String accountId;
    private final long shortfall;

    public InsufficientFundsException(String message) {
        super(message);
        this.accountId = null;
        this.shortfall = 0L;
    }

    public InsufficientFundsException(String message, Throwable cause) {
        super(message, cause);
        this.accountId = null;
        this.shortfall = 0L;
    }

    public InsufficientFundsException(String accountId, long requested, long available) {
        super("account " + accountId + " requested " + requested
                + " but only " + available + " is available");
        this.accountId = accountId;
        this.shortfall = requested - available;
    }

    public String accountId() {
        return accountId;
    }

    public long shortfall() {
        return shortfall;
    }

    public static void main(String[] args) {
        try {
            throw new InsufficientFundsException("ACC-42", 500, 120);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage() + " (short by " + e.shortfall() + ")");
        }
    }
}`,
        },
        {
          title: 'Wrapping with a cause and walking the chain',
          description:
            'The repository-level IOException is translated into a domain exception while the original failure stays attached as the cause.',
          code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ExceptionChainingDemo {

    static final class ConfigException extends RuntimeException {
        ConfigException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    static String loadConfig(Path path) {
        try {
            return Files.readString(path);
        } catch (IOException e) {
            throw new ConfigException("cannot load config from " + path, e);
        }
    }

    public static void main(String[] args) {
        try {
            loadConfig(Path.of("config.properties"));
        } catch (ConfigException e) {
            System.out.println(e.getMessage());
            Throwable root = e;
            while (root.getCause() != null) {
                root = root.getCause();
            }
            System.out.println("root cause: " + root.getClass().getSimpleName()
                    + ": " + root.getMessage());
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'All throwables descend from `Throwable`; `Error` is for JVM failures, `Exception` for application failures, `RuntimeException` for unchecked bugs.',
        'Checked exceptions are enforced by the compiler only; they must be caught or declared, while unchecked ones need no declaration.',
        'Catch clauses match by `instanceof`, so they must be ordered from most specific to most general.',
        '`throw` raises an object inside a body; `throws` advertises checked failures in a signature and may be narrowed by overrides.',
        'Custom exceptions should be small, immutable, named after the condition, and always preserve the cause when wrapping.',
      ],
      interviewTips: [
        'If asked "checked or unchecked for a new API?", justify the choice with recoverability and caller action, not with "checked is safer".',
        'Explain that `throws` is a compile-time contract with no runtime enforcement, which is why reflection and old bytecode can bypass it.',
        'Mention that overrides may narrow but never widen the `throws` clause, and connect it to the Liskov substitution principle.',
        'For custom exceptions, list the three constructors and the reason for `serialVersionUID`; that detail signals real production experience.',
      ],
      pitfalls: [
        'Placing `catch (Exception e)` before a specific handler, which fails to compile as an unreachable catch block.',
        'Catching `Throwable` in application code and accidentally absorbing `OutOfMemoryError`.',
        'Wrapping an exception without passing the cause, so the root failure disappears from logs.',
        'Creating one exception class per method, producing an unusable taxonomy nobody can catch precisely.',
        'Putting passwords, tokens or full request bodies into exception messages that end up in logs.',
      ],
      quiz: [
        {
          question: 'Which declaration is legal for a subclass overriding `void run() throws IOException`?',
          options: [
            '`void run() throws Exception`',
            '`void run() throws IOException` or `void run()`',
            '`void run() throws SQLException`',
            '`void run() throws Throwable`',
          ],
          answerIndex: 1,
          explanation:
            'An override may narrow or remove the declared checked exceptions but never widen them. `Exception`, `SQLException` (unrelated to IOException) and `Throwable` are all wider and would break callers using the parent type.',
        },
        {
          question: 'Why is `catch (Exception e)` before `catch (IOException e)` rejected by the compiler?',
          options: [
            'Because IOException is unchecked',
            'Because the second clause is unreachable, as Exception already matches every IOException',
            'Because multi-catch is required for sibling types',
            'Because catch parameters must be ordered alphabetically',
          ],
          answerIndex: 1,
          explanation:
            'Handlers are tested in source order and match by subtype. Once `Exception` is caught, the later `IOException` clause can never execute, so javac reports an unreachable catch block.',
        },
      ],
    },

    // ---------------------------------------------------------------------
    // 3. JVM Memory Areas
    // ---------------------------------------------------------------------
    {
      slug: 'jvm-memory-areas',
      vizId: 'jvm-memory-areas',
      title: 'JVM Memory Areas: Stack, Heap, Metaspace & PC',
      order: 3,
      summary:
        'See where the JVM keeps objects, frames, class metadata and direct buffers, and why each area fails differently.',
      level: 'advanced',
      sections: [
        { heading: 'Runtime data areas at a glance', body: `The JVM specification defines a handful of runtime data areas, and the most useful distinction is whether an area is shared by all threads or private to one. Shared state needs concurrency control and garbage collection; thread-private state is reclaimed automatically when a frame or thread ends.

| Area | Scope | Holds | Failure mode |
| --- | --- | --- | --- |
| Heap | shared | every object and array | \\\`OutOfMemoryError: Java heap space\\\` |
| Method area / Metaspace | shared | class metadata, constant pools, method code | \\\`OutOfMemoryError: Metaspace\\\` |
| Run-time constant pool | shared, part of method area | literals, symbolic references | Metaspace exhaustion |
| Java stack | per thread | frames: locals, operand stack, return info | \\\`StackOverflowError\\\` |
| Native method stack | per thread | frames for native (JNI) calls | native thread creation failure |
| PC register | per thread | address of the current instruction | not applicable |
| Direct / native memory | process | NIO buffers, JNI allocations, thread stacks | \\\`OutOfMemoryError: Direct buffer memory\\\` |

The heap is where your objects live; the stack is where execution lives; Metaspace is where the shape of your classes lives. HotSpot implements the method area as Metaspace, allocated in native memory since Java 8, and typically merges native frames onto the same per-thread stack rather than reserving a separate area.

Two practical consequences follow. A thread is expensive because it reserves stack space, so thousands of threads can exhaust native memory long before the heap is full. And "memory" in a container includes heap, Metaspace, code cache, direct buffers and thread stacks, which is why \\\`-Xmx\\\` alone does not bound a process.`,
        },
        { heading: 'PC register and the native method stack', body: `Each thread has its own program counter, a small register holding the address of the bytecode instruction currently being executed. When a thread is switched out and later resumed, the PC is what allows it to continue at the right instruction. If the thread is executing a native method, the PC is undefined, because the JVM is no longer interpreting bytecode.

The native method stack holds frames for methods written in other languages and invoked through JNI. Its size and layout are implementation-defined; on HotSpot, native frames share the thread's stack with Java frames, so the \\\`-Xss\\\` setting bounds both. Deep recursion in Java and deep native call chains therefore compete for the same resource, and a JNI library with a large stack appetite can cause a crash rather than a clean Java exception.

Thread creation itself consumes memory. Each \\\`new Thread()\\\` reserves a stack (1 MB by default on 64-bit HotSpot, tunable with \\\`-Xss\\\`), plus OS bookkeeping. Creating tens of thousands of platform threads can fail with \\\`OutOfMemoryError: unable to create native thread\\\` even when the heap is almost empty. Virtual threads, finalised in Java 21, exist partly to fix this: they are mounted on a small pool of carrier threads, so their stacks grow on the heap as needed instead of reserving a megabyte each.`,
        },
        { heading: 'Stack frames: locals, operand stack, return address', body: `Every method invocation pushes a frame onto the calling thread's stack. A frame is created with a size computed at class-load time and contains three logical parts.

The **local variable array** holds parameters and local variables in fixed slots. A \\\`long\\\` or \\\`double\\\` occupies two slots; references occupy one. Slot 0 is \\\`this\\\` for instance methods, which is why a static method has one fewer parameter slot than its instance twin.

The **operand stack** is the workspace for bytecode evaluation. \\\`iload_1\`, \`iload_2\`, \`iadd\`, \`istore_3\` push, combine and pop values. This is a stack machine, not a register machine, which keeps bytecode compact and easy to verify.

**Frame data** holds the return address and the reference to the current class's run-time constant pool, used to resolve symbolic references at first execution and to restore the caller's frame on return.

Because frames are strictly LIFO, popping a frame needs no garbage collector: the whole frame disappears when the method returns. Objects those locals referenced become unreachable only if no other reference remains.

Two optimisations matter in practice. Escape analysis can prove an object never leaves a method and replace its allocation with scalars on the stack, eliminating the allocation entirely. And inlining lets the JIT merge frames, so a Java-level stack trace may show fewer frames than the interpreter would.`,
        },
        { heading: 'The heap and object layout', body: `The heap is the shared area where every object and array lives. It is created at JVM start, sized between \\\`-Xms\\\` (initial) and \\\`-Xmx\\\` (maximum), and managed by the garbage collector. Allocation is extremely cheap: a thread bumps a pointer inside its thread-local allocation buffer (TLAB), a private slice of Eden, and only synchronises when the buffer is exhausted.

A HotSpot object in memory has three parts, padded to a multiple of 8 bytes:

- **Mark word** (8 bytes): identity hash code, GC age, lock state, biased-lock bits in older releases.
- **Klass pointer** (4 bytes with compressed class pointers, otherwise 8): points to the class metadata in Metaspace.
- **Instance fields**: primitives inline, references as pointers, laid out by the JVM (often reordered to minimise padding). Arrays add a 4-byte length.

Compressed oops let references stay 4 bytes for heaps below roughly 32 GB, which is why "keep the heap under 32 GB" is a common sizing heuristic — crossing that boundary inflates every reference and can cost more memory than the extra heap provides.

Heap sizing is a trade-off. A large heap delays collection but lengthens each pause; a small heap collects often with short pauses. \\\`-Xms\\\` equal to \\\`-Xmx\\\` is standard for servers: it avoids repeated resizing and makes pause behaviour predictable.`,
        },
        { heading: 'Method area, Metaspace and the string pool', body: `The method area stores per-class structures: the run-time constant pool, field and method descriptors, bytecode, access flags, and the class's static state. Before Java 8 HotSpot implemented it as PermGen inside the heap, with a fixed maximum that produced the infamous \\\`OutOfMemoryError: PermGen space\\\` when an application loaded many classes.

Java 8 replaced PermGen with **Metaspace**, allocated in native memory and bounded by \\\`-XX:MaxMetaspaceSize\\\` (unbounded by default). Class metadata can now grow until the machine runs out of memory, which trades one failure mode for another: a classloader leak becomes a slow native-memory climb rather than a fast, obvious PermGen error. Always set a maximum in production.

Metaspace is reclaimed only when the classloader that defined the classes becomes unreachable, which is why application server redeploys and dynamically generated classes (proxies, script engines, lambdas in some frameworks) are classic leak sources.

The **string pool** is different. Interned strings — literals and the result of \\\`String.intern()\\\` — live in the heap (since Java 7) and are ordinary objects, so they are collected normally when unreachable. \\\`new String("x")\\\` creates a separate object; only \\\`intern()\\\` or a literal refers to the pooled instance. Interning is useful for deduplicating many repeated values, but interning unbounded user input is a leak.`,
        },
        { heading: 'Direct memory and off-heap allocation', body: `Not all memory an application uses is heap. \\\`ByteBuffer.allocateDirect(n)\\\` reserves a buffer in native memory outside the Java heap. The JVM can pass its address straight to the operating system, so file and socket I/O avoids copying bytes between heap and native buffers. That is why NIO channels, Netty and most high-performance I/O libraries use direct buffers for their working memory.

The cost is that the JVM does not see this memory during heap sizing. Direct buffers are bounded by \\\`-XX:MaxDirectMemorySize\`, which defaults to the maximum heap size, and exceeding it produces \`OutOfMemoryError: Direct buffer memory\`. A container memory limit counts them, so a process with \`-Xmx2g\` and 2 GB of direct buffers can be killed by the OS while the heap looks healthy.

Direct buffers are freed when the \`ByteBuffer\` becomes unreachable: a \`Cleaner\` registered at allocation time releases the native block during garbage collection. Because the heap thinks the buffer is tiny (just an object header and an address), it does not create memory pressure, so the GC may run late. Long-lived direct buffers therefore need explicit lifecycle management.

Similar off-heap areas include memory-mapped files, JNI allocations, and the JIT code cache, each with its own limit and diagnostics.`,
        },
        { heading: 'StackOverflowError vs OutOfMemoryError', body: `Both are \\\`Error\\\`s, both terminate work, but they mean opposite things and need opposite fixes.

\\\`StackOverflowError\\\` means a thread's stack ran out of space, almost always because of unbounded or excessively deep recursion. The heap is irrelevant. Diagnose by reading the top frames of the trace: a repeating pattern of the same method is the signature. Fixes are to convert the recursion to iteration, add a depth guard, or increase \\\`-Xss\\\` (which increases memory per thread and lowers the maximum thread count).

\\\`OutOfMemoryError: Java heap space\\\` means the collector could not free enough room for an allocation after a full collection. Either the live set genuinely exceeds \\\`-Xmx\\\` — a leak, or a batch job that needs a bigger heap — or a single allocation is huge. Related messages point elsewhere:

| Message | Meaning |
| --- | --- |
| \\\`Java heap space\\\` | live objects exceed the heap |
| \\\`GC overhead limit exceeded\\\` | the collector spends most of its time reclaiming almost nothing |
| \\\`Metaspace\\\` | too many classes, usually a classloader leak |
| \\\`Direct buffer memory\\\` | NIO buffers exceed the direct limit |
| \\\`unable to create native thread\\\` | thread stacks or OS limits exhausted |

The standard move for any heap OOM is \\\`-XX:+HeapDumpOnOutOfMemoryError\\\` plus \\\`-XX:HeapDumpPath\`, then analyse dominator trees in a tool such as Eclipse MAT to find what retains the memory.`,
        },
      ],
      javaCode: [
        {
          title: 'Heap growth measured from inside the JVM',
          description:
            'Runtime exposes total, free and maximum memory. The difference between total and free approximates what the heap currently considers used.',
          code: `import java.util.ArrayList;
import java.util.List;

public class HeapGrowthDemo {

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long before = used(runtime);

        List<int[]> blocks = new ArrayList<>();
        for (int i = 0; i < 1_000; i++) {
            blocks.add(new int[256]);      // about 1 KiB of payload per array
        }

        long after = used(runtime);
        System.out.printf("retained roughly %d KiB%n", (after - before) / 1024);
        System.out.println("arrays alive: " + blocks.size());
        System.out.println("max heap: " + runtime.maxMemory() / (1024 * 1024) + " MiB");
    }

    static long used(Runtime runtime) {
        return runtime.totalMemory() - runtime.freeMemory();
    }
}`,
        },
        {
          title: 'StackOverflowError from unbounded recursion',
          description:
            'Each call consumes a frame on the current thread stack. Catching the error lets the process print the depth instead of dying, which is useful for diagnosis only.',
          code: `public class StackOverflowDemo {

    private static int depth;

    static void recurse() {
        depth++;
        recurse();
    }

    public static void main(String[] args) {
        try {
            recurse();
        } catch (StackOverflowError e) {
            System.out.println("stack exhausted at depth " + depth);
            System.out.println("raise the limit with -Xss, but fix the recursion first");
        }
    }
}`,
        },
        {
          title: 'Heap buffers versus direct buffers',
          description:
            'Both support the same API, but allocateDirect reserves native memory outside the heap and is reported by isDirect().',
          code: `import java.nio.ByteBuffer;

public class DirectMemoryDemo {

    public static void main(String[] args) {
        ByteBuffer heapBuffer = ByteBuffer.allocate(1024);
        ByteBuffer directBuffer = ByteBuffer.allocateDirect(1024);

        directBuffer.putInt(42).flip();

        System.out.println("heap buffer direct?   " + heapBuffer.isDirect());
        System.out.println("direct buffer direct? " + directBuffer.isDirect());
        System.out.println("value read back:      " + directBuffer.getInt());
        System.out.println("capacity:             " + directBuffer.capacity());
        System.out.println("bounded by -XX:MaxDirectMemorySize, not -Xmx");
    }
}`,
        },
        {
          title: 'Literals, new String and intern()',
          description:
            'Literals come from the string pool in the heap. A new String is a distinct object until intern() returns the pooled instance.',
          code: `public class StringPoolDemo {

    public static void main(String[] args) {
        String literal = "whisper";
        String constructed = new String("whisper");
        String interned = constructed.intern();

        System.out.println("literal == constructed: " + (literal == constructed)); // false
        System.out.println("literal == interned:    " + (literal == interned));    // true
        System.out.println("equals:                 " + literal.equals(constructed)); // true

        String built = "whis" + "per";   // folded at compile time, same pool entry
        System.out.println("literal == built:       " + (literal == built));       // true
    }
}`,
        },
      ],
      keyTakeaways: [
        'The heap, Metaspace and constant pools are shared; PC registers and stacks are per thread.',
        'A frame holds a local variable array, an operand stack and frame data; frames are popped LIFO and need no GC.',
        'Metaspace replaced PermGen in Java 8, lives in native memory, and is reclaimed only with its classloader.',
        'Direct buffers live outside the heap, are bounded by `-XX:MaxDirectMemorySize`, and are freed by a Cleaner after the buffer becomes unreachable.',
        'StackOverflowError means a thread stack is exhausted; heap OOM means the live set no longer fits, and each OOM message names a different area.',
      ],
      interviewTips: [
        'Draw the shared-versus-per-thread split first; almost every follow-up question becomes easier once that diagram is on the board.',
        'Explain string pooling precisely: literals are interned, `new String` is not, and the pool has lived in the heap since Java 7.',
        'Know two diagnostics for a heap OOM — a heap dump analysed with MAT, and GC logs showing the live set after full collections.',
        'Mention that `-Xmx` does not cap total process memory, because Metaspace, code cache, direct buffers and thread stacks sit outside it.',
      ],
      pitfalls: [
        'Assuming `Runtime.freeMemory()` reflects what the OS sees; it only describes the Java heap.',
        'Leaving Metaspace unbounded and discovering the leak only when the container is killed.',
        'Creating thousands of platform threads and blaming the heap when `unable to create native thread` appears.',
        'Interning arbitrary user input, which pins strings for the life of the process.',
        'Catching `StackOverflowError` and continuing to run, leaving the thread in an inconsistent state.',
      ],
      quiz: [
        {
          question: 'Where does HotSpot store class metadata in Java 17?',
          options: [
            'In the young generation of the heap',
            'In Metaspace, allocated in native memory',
            'In PermGen, inside the heap',
            'On each thread stack',
          ],
          answerIndex: 1,
          explanation:
            'PermGen was removed in Java 8. Class metadata now lives in Metaspace, which uses native memory and is bounded by -XX:MaxMetaspaceSize rather than -Xmx.',
        },
        {
          question: 'A service has a 2 GB heap and copies large payloads into direct ByteBuffers. The OS kills the container although the heap looks fine. Why?',
          options: [
            'Direct buffers are stored in Metaspace',
            'Direct buffers count towards process memory but not towards the heap limit',
            'ByteBuffer.allocateDirect always leaks',
            'The heap dump was not enabled',
          ],
          answerIndex: 1,
          explanation:
            'Direct buffers are native memory. The JVM sizes the heap independently, so a container limit includes heap plus Metaspace, code cache, direct buffers and thread stacks. Bound them with -XX:MaxDirectMemorySize.',
        },
      ],
    },

    // ---------------------------------------------------------------------
    // 4. Heap Generations & Garbage Collection
    // ---------------------------------------------------------------------
    {
      slug: 'heap-and-garbage-collection',
      vizId: 'heap-and-garbage-collection',
      title: 'Heap Generations & Garbage Collection',
      order: 4,
      summary:
        'Understand generational heaps, reachability, reference types and how modern collectors keep pauses short.',
      level: 'advanced',
      sections: [
        { heading: 'Heap layout: young and old generations', body: `The heap is partitioned because of the **weak generational hypothesis**: most objects die young, and the few that survive tend to live a long time. Collecting a small young region frequently is far cheaper than scanning the whole heap, and it matches how allocation actually behaves in request-scoped code.

In the classic layout the young generation is one third of the heap by default (\\\`-XX:NewRatio=2\\\`) and is split into **Eden** and two equal **survivor** spaces, \\\`S0\\\` and \\\`S1\\\` (\\\`-XX:SurvivorRatio=8\\\` means Eden is eight times one survivor). All new objects — except very large ones — are allocated in Eden. The old generation, also called tenured, holds objects that have survived several collections.

HotSpot's G1 collector, the default since Java 9, abandons contiguous generations in favour of a grid of equal regions, each dynamically labelled Eden, Survivor, Old or Humongous. The generational idea survives, but regions let G1 collect the most garbage-heavy areas first, which is the "garbage first" in its name. ZGC and Shenandoah also use regions, with different concurrent algorithms.

Sizing consequences: a young generation that is too small causes frequent minor collections and premature promotion; one that is too large lengthens each young pause. \\\`-Xmn\\\` sets the young size directly, while \\\`-XX:NewRatio\\\` sets the ratio and leaves the JVM room to adapt.`,
        },
        { heading: 'Allocation, aging and promotion', body: `Allocation in Eden is a pointer bump inside a TLAB. When Eden fills, a minor collection traces live objects from the roots, copies them into the active survivor space, and clears Eden wholesale. The copy is cheap relative to the region size because most objects are already dead and cost nothing.

Each surviving object's age, stored in the mark word, increments by one per young collection. When the age reaches the tenuring threshold (\\\`-XX:MaxTenuringThreshold\`, 15 by default in G1), the object is promoted to the old generation. Survivors ping-pong between \`S0\` and \`S1\`: the source survivor is emptied, the destination becomes the new "from" space next cycle.

Two dynamic behaviours override the fixed threshold. If survivors fill beyond a target occupancy (\`-XX:TargetSurvivorRatio\`, default 50 percent), the JVM lowers the effective threshold and promotes early to avoid overflow. And a \`Full GC\` can promote everything at once.

Very large objects are special. In G1, an object larger than half a region is **humongous** and is allocated directly in a run of contiguous regions, bypassing Eden. Allocating many short-lived humongous objects — a common accident with multi-megabyte arrays — creates expensive region churn, which is why streaming parsers and chunked buffers beat "read it all into a byte array".`,
        },
        { heading: 'Minor, major, mixed and full GC', body: `The names describe scope, not a single algorithm.

A **minor** (young) collection runs when Eden fills. It stops the application briefly, traces roots, copies survivors, promotes the old enough, and clears Eden. Pauses are typically a few milliseconds because the region is small and most objects are dead.

A **major** collection concerns the old generation. In collectors that support concurrency it is not a single event but a cycle: initial mark (stop-the-world, short), concurrent marking, remark (short stop), concurrent cleanup, and then evacuation of selected old regions. G1 calls the evacuation phase a **mixed** collection because it collects both young regions and old regions with the most garbage.

A **full** collection compacts the entire heap, including young and old, and may also unload classes and clear soft references. It is the fallback when the collector cannot keep up: promotion failure, humongous allocation failure, metaspace pressure or an explicit \\\`System.gc()\\\`. Full collections are long and should be rare; a heap that needs them regularly is either undersized or leaking.

| Collection | Scope | Frequency | Typical cost |
| --- | --- | --- | --- |
| Minor / young | Eden + survivors | seconds to minutes | sub-10 ms |
| Mixed | young + selected old regions | minutes | tens of ms |
| Full | entire heap, compacting | rare, ideally never | hundreds of ms to seconds |

Watch the ratio, not just the counts: healthy services show many minor collections and almost no full ones.`,
        },
        { heading: 'Reachability and GC roots', body: `Garbage collection is reachability analysis, not reference counting. The collector starts from a set of roots, walks every reference transitively, marks what it reaches, and treats everything else as garbage. Cycles are therefore collected without any special handling, which reference counting cannot do.

The roots are:

- local variables and parameters in the stacks of live threads;
- static fields of loaded classes;
- JNI references held by native code;
- active threads and their thread objects;
- synchronised monitors currently held;
- classes and classloaders that are still live;
- objects referenced by the JVM itself, such as system classloaders and interned strings.

HotSpot uses **tri-colour marking**: white for unvisited, grey for discovered but not yet scanned, black for scanned. Concurrent collectors must handle mutations while marking. G1 and Shenandoah use snapshot-at-the-beginning (SATB) write barriers, recording overwritten references so nothing reachable at the start of the cycle is missed. Cards and remembered sets track old-to-young references so a young collection does not need to scan the whole old generation.

Understanding roots explains most "leaks": an object is not leaked because nobody uses it, but because something rooted still points at it — a static map, a live thread's local, a listener list, a \\\`ThreadLocal\\\`. Remove the root and the memory returns.`,
        },
        { heading: 'Reference types and ReferenceQueue', body: `Java distinguishes how strongly a reference prevents collection, and the distinction is part of the language, not a collector detail.

| Reference | Collected when | Typical use |
| --- | --- | --- |
| Strong (\\\`new\`, plain field) | never, while reachable | ordinary object graphs |
| Soft (\`SoftReference\`) | when the JVM needs memory | memory-sensitive caches |
| Weak (\`WeakReference\`) | at the next collection that observes it | canonicalising maps, \`WeakHashMap\` keys, listener registries |
| Phantom (\`PhantomReference\`) | after finalisation, before memory release | post-mortem cleanup, \`Cleaner\` |

A \`Reference\` object can be registered with a \`ReferenceQueue\`. When the referent becomes reachable only through that reference, the collector clears it (making \`get()\` return null) and enqueues the \`Reference\` itself. A cleanup thread polls the queue and releases the associated native resource. This is exactly how direct \`ByteBuffer\`s and \`Cleaner\`-based resources are freed, and it is the supported replacement for \`finalize()\`, which is deprecated for removal.

Two practical warnings. \`WeakHashMap\` is only weak about its **keys**; a value that strongly references its own key keeps the entry alive forever. And soft references are a poor cache policy under memory pressure: the JVM may clear all of them at once, producing a sudden cache miss storm rather than graceful eviction. A bounded cache with an explicit eviction policy is usually better.`,
        },
        { heading: 'Collectors and stop-the-world pauses', body: `Every collector must at some point freeze the mutator threads to get a consistent view of the object graph. That freeze is **stop-the-world**. The engineering goal is not to eliminate it but to make each pause short and predictable.

| Collector | Algorithm | Best for |
| --- | --- | --- |
| Serial | single-threaded copying, compacting | tiny heaps, containers with one CPU |
| Parallel | multi-threaded throughput collector | batch jobs that care about total time |
| G1 | region-based, concurrent marking, evacuation pauses | default for most server workloads |
| ZGC | coloured pointers, load barriers, concurrent relocation | very large heaps with sub-millisecond pauses |
| Shenandoah | Brooks/forwarding pointers, concurrent compaction | large heaps, low pause, OpenJDK builds |
| Epsilon | allocates and never collects | benchmarks and short-lived jobs |

G1 is the default since Java 9 and aims at \\\`-XX:MaxGCPauseMillis\\\` (200 ms by default), choosing how many regions to evacuate per cycle to meet that target. ZGC, production since Java 15 and generational since Java 21, keeps pause times in the sub-millisecond range even on terabyte heaps by doing marking and relocation concurrently; the price is higher CPU and memory overhead. CMS was removed in Java 14.

Pause behaviour is workload-dependent, so the only reliable method is measurement: enable unified logging with \\\`-Xlog:gc*:file=gc.log:time,uptime,level,tags\`, then look at pause distribution rather than averages. A 99th-percentile pause of two seconds will hurt far more than an extra 5 percent of CPU.`,
        },
        { heading: 'Leaks, tuning and diagnostics', body: `Java has no manual free, but it has leaks: objects that are no longer needed yet still reachable from a root. The recurring patterns are well known.

- **Static collections** that grow without bound — an in-memory registry, a metrics map keyed by request id.
- **Unbounded caches** with strong keys, which are leaks by design until something evicts.
- **\\\`ThreadLocal\\\`** values on pooled threads that are never \\\`remove()\\\`d.
- **Listeners and callbacks** registered but never deregistered, keeping whole object graphs alive.
- **Classloader leaks** in containers, where a redeployed application's classes cannot be unloaded because a thread, JDBC driver or \\\`ThreadLocal\\\` still references them.
- **Unclosed resources** whose native memory or buffers outlive their usefulness.

Diagnosis follows a fixed order. Confirm the leak from GC logs: a live set after full collections that climbs monotonically. Take a heap dump with \\\`jcmd <pid> GC.heap_dump\\\` or automatically via \\\`-XX:+HeapDumpOnOutOfMemoryError\\\`. Compare two dumps in Eclipse MAT and look at the dominator tree for the largest retained sizes, then trace the path to a GC root.

Tuning flags worth knowing, roughly in order of usefulness:

| Flag | Effect |
| --- | --- |
| \\\`-Xms\`, \`-Xmx\` | initial and maximum heap; set equal on servers |
| \`-Xlog:gc*\` | unified GC logging, the primary diagnostic |
| \`-XX:+HeapDumpOnOutOfMemoryError\` | dump the heap when it fails |
| \`-XX:MaxGCPauseMillis\` | G1 pause target, a hint not a guarantee |
| \`-Xmn\` / \`-XX:NewRatio\` | young generation sizing |
| \`-XX:MaxMetaspaceSize\` | cap class metadata in native memory |

Tune from evidence: fix the leak first, size the heap second, choose a collector third, and adjust ratios last. Most "GC tuning" is really allocation reduction.`,
        },
      ],
      javaCode: [
        {
          title: 'Weak references and the effect of dropping the last strong one',
          description:
            'A weak reference does not keep its referent alive. After the strong reference is cleared, a collection usually clears the weak reference too.',
          code: `import java.lang.ref.WeakReference;

public class WeakReferenceDemo {

    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder("cached value");
        WeakReference<StringBuilder> weak = new WeakReference<>(builder);

        System.out.println("before: " + weak.get());
        builder = null;                 // drop the only strong reference

        System.gc();                    // a request, not a guarantee
        System.out.println("after:  " + weak.get());
        System.out.println("cleared: " + (weak.get() == null));
    }
}`,
        },
        {
          title: 'A soft-reference cache',
          description:
            'Soft references are cleared only under memory pressure, which makes them suitable for caches that can be rebuilt. The map itself still grows, so bound it in production.',
          code: `import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class SoftCache<K, V> {

    private final Map<K, SoftReference<V>> cache = new HashMap<>();

    public V get(K key, Function<K, V> loader) {
        SoftReference<V> reference = cache.get(key);
        V value = reference == null ? null : reference.get();
        if (value == null) {
            value = loader.apply(key);
            cache.put(key, new SoftReference<>(value));
        }
        return value;
    }

    public int size() {
        return cache.size();
    }

    public static void main(String[] args) {
        SoftCache<String, String> cache = new SoftCache<>();
        System.out.println(cache.get("greeting", key -> "hello " + key));
        System.out.println(cache.get("greeting", key -> "recomputed, should not appear"));
        System.out.println("entries: " + cache.size());
    }
}`,
        },
        {
          title: 'Phantom references and a ReferenceQueue',
          description:
            'PhantomReference.get() always returns null. The reference is enqueued after the referent is cleared, which is the hook a Cleaner uses to release native memory.',
          code: `import java.lang.ref.PhantomReference;
import java.lang.ref.ReferenceQueue;

public class PhantomQueueDemo {

    static final class Payload {
        private final byte[] bytes = new byte[1024];
    }

    public static void main(String[] args) throws InterruptedException {
        ReferenceQueue<Payload> queue = new ReferenceQueue<>();
        Payload payload = new Payload();
        PhantomReference<Payload> phantom = new PhantomReference<>(payload, queue);

        System.out.println("phantom.get() is always " + phantom.get());
        payload = null;

        for (int i = 0; i < 20 && queue.poll() == null; i++) {
            System.gc();
            Thread.sleep(50);
        }
        System.out.println("enqueued: " + (phantom.isEnqueued() || queue.poll() != null));
    }
}`,
        },
        {
          title: 'A leak caused by an unbounded static map',
          description:
            'Every entry stays reachable from a static field, so the collector can never reclaim it. A bounded cache or weak keys fix the pattern.',
          code: `import java.util.LinkedHashMap;
import java.util.Map;

public class LeakDemo {

    /** Growing forever: a classic production leak. */
    private static final Map<String, byte[]> LEAKY_CACHE = new LinkedHashMap<>();

    /** Bounded alternative: evicts the eldest entry once the limit is reached. */
    private static final Map<String, byte[]> BOUNDED_CACHE =
            new LinkedHashMap<>(16, 0.75f, true) {
                private static final long serialVersionUID = 1L;

                @Override
                protected boolean removeEldestEntry(Map.Entry<String, byte[]> eldest) {
                    return size() > 100;
                }
            };

    static void handle(String userId) {
        LEAKY_CACHE.put(userId, new byte[1024 * 1024]);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            handle("user-" + i);
        }
        System.out.println("leaky entries:   " + LEAKY_CACHE.size());
        System.out.println("bounded entries: " + BOUNDED_CACHE.size() + " (max 100)");
        System.out.println("fix: bound the cache, or use weak keys when entries are optional");
    }
}`,
        },
      ],
      keyTakeaways: [
        'The weak generational hypothesis justifies the young/old split: most objects die young, so cheap frequent young collections reclaim most memory.',
        'Objects are born in Eden, copied between survivor spaces with an age counter, and promoted once they reach the tenuring threshold.',
        'GC is reachability analysis from roots, so cycles are collected and a "leak" always means a live path from a root.',
        'Soft, weak and phantom references differ in when they allow collection; ReferenceQueue plus Cleaner is the supported cleanup mechanism.',
        'G1 is the default collector; ZGC and Shenandoah trade throughput for sub-millisecond pauses, and every collector still has some stop-the-world phase.',
      ],
      interviewTips: [
        'Explain heap layout by tracing one object through Eden, S0, S1 and the old generation; that narrative covers most follow-ups.',
        'Distinguish minor, mixed and full collections by scope and trigger, and note that a full GC in a healthy service is a red flag.',
        'Name the GC roots concretely — thread stacks, static fields, JNI references, live monitors — rather than saying "references".',
        'When asked to reduce pauses, start with allocation reduction and correct heap sizing, then collector choice, then flags.',
      ],
      pitfalls: [
        'Assuming `System.gc()` guarantees a collection; it is only a hint unless `-XX:+DisableExplicitGC` removes it entirely.',
        'Believing soft references make a safe cache; they can all be cleared at once under pressure.',
        'Using a `WeakHashMap` whose values strongly reference their keys, which defeats the weak key.',
        'Promoting objects prematurely with an undersized young generation, then suffering long old-generation collections.',
        'Adding `-Xmx` blindly when the live-set growth is actually a leak.',
      ],
      quiz: [
        {
          question: 'An object has survived several minor collections but has not reached the tenuring threshold. Where does it live?',
          options: [
            'In Eden',
            'In one of the survivor spaces',
            'In the old generation',
            'In Metaspace',
          ],
          answerIndex: 1,
          explanation:
            'Surviving objects are copied between S0 and S1 and their age increments each cycle. Only when the age reaches the tenuring threshold is the object promoted to the old generation.',
        },
        {
          question: 'Why can a `static final Map<String, Object>` be the cause of an OutOfMemoryError even though no code reads the entries?',
          options: [
            'Static fields are stored on the stack and never collected',
            'The map is a GC root through its class, so every entry stays reachable',
            'HashMap uses direct memory for its values',
            'The collector cannot scan static fields',
          ],
          answerIndex: 1,
          explanation:
            'Static fields of a loaded class are GC roots. As long as the class is loaded, every entry in the map is reachable and therefore cannot be collected, which is a leak in the practical sense.',
        },
      ],
    },
  ],
};

