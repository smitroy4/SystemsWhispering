import type { JavaModule } from '../../types/java.ts';

export const module05: JavaModule = {
  slug: 'multithreading',
  title: 'Multithreading',
  order: 5,
  summary: 'How Java runs code concurrently: threads, memory visibility, locks, atomics, executors, and virtual threads.',
  overview:
    'Concurrency is where Java stops being a language about syntax and becomes a language about the machine underneath it. This module starts with the process/thread split and the JVM\'s thread lifecycle, then moves through the failures concurrency produces: lost updates, stale reads, reordered writes, deadlocks, and lost wakeups. From there it builds the toolbox in the order a working engineer needs it — monitor locks, wait/notify, explicit locks, atomics and CAS, the executor framework, and finally CompletableFuture, ForkJoin, ThreadLocal, and virtual threads. Each topic pairs a mental model with runnable Java you can paste into a single file.',
  topics: [
    {
      slug: 'processes-vs-threads',
      title: 'Processes vs Threads',
      order: 1,
      level: 'beginner',
      summary: 'A process owns isolated memory; threads inside it share the heap but keep private stacks and program counters.',
      subtopics: [
        {
          id: 'process-address-space',
          title: 'A process is an isolated address space',
          body: `A **process** is the operating system's unit of isolation: one running program plus everything it owns. That includes a virtual address space, a page table, open file descriptors, a security context, environment variables, and at least one thread of execution. When you type \`java Demo\`, the OS creates a process, maps the JVM shared library into it, and the JVM takes over from there.

Isolation is the defining property. Each process believes it has the whole machine's address space to itself, and the memory-management unit plus the kernel enforce that belief. A wild pointer in one process cannot scribble over another process's heap; the worst it can do is crash itself with a segmentation fault. The price of that safety is that processes cannot simply pass objects to each other. They must communicate through the kernel: pipes, sockets, files, memory-mapped regions, or serialized messages.

For a Java developer this matters because every JVM instance is one process. Two Spring Boot applications on the same host are two processes and share nothing. Their caches, static fields, and counters are separate islands, which is why "just use a static map" stops working the moment you scale beyond one node.`,
        },
        {
          id: 'thread-anatomy',
          title: 'What a thread actually owns',
          body: `A **thread** is the smallest sequence of instructions the operating system scheduler will dispatch onto a CPU core. It is not a program; it is a cursor inside a program. Each thread owns exactly four things: a **program counter** (which bytecode or native instruction comes next), a **stack** (frames with local variables, operands, and return addresses), a set of **saved CPU registers**, and a **native thread identifier** the kernel uses to schedule it.

In HotSpot, a Java thread usually has a Java stack for interpreted and JIT-compiled Java frames plus a native stack used while executing C++ runtime code or JNI. The stack is private. Nothing another thread does can corrupt your local variables, and this is the single most useful concurrency guarantee you get for free.

The practical consequence is that local variables are **thread-confined** by construction. A local \`int i\` inside a method cannot suffer a data race, because no other thread can even name it. Only data that escapes — objects on the heap, fields, statics, array elements — can be shared, and only shared mutable data can be raced on. Every concurrency bug you will ever debug starts with an escape.`,
        },
        {
          id: 'shared-heap-and-metaspace',
          title: 'What threads share inside a process',
          body: `Threads in one JVM share the **heap**, the **metaspace** (class metadata), the **code cache** (JIT-compiled machine code), static fields, the string pool, loaded classes, and the process's open files and sockets. The heap is the important one: every object created with \`new\` lands in a region all threads can reach, and any field of that object is therefore reachable by any thread holding a reference.

Picture two counters. A local variable declared inside \`run()\` lives on that thread's stack — two threads running the same \`Runnable\` get two independent copies. A \`static int\` lives once in the class's metadata and is aliased by every thread, so \`sharedCounter++\` performed by two threads is two threads writing the same memory cell.

That single distinction explains most beginner confusion: the *code* is shared, the *stack* is not, and the *heap* is shared but only for objects that were actually published. Publishing happens through a field, a static, a collection, a lambda capture of an object, or a callback registered somewhere. If you can draw a reference path from a static or a shared object to your data, another thread can reach it.`,
        },
        {
          id: 'context-switching',
          title: 'Concurrency, parallelism, and context switching',
          body: `On a single-core machine, multithreading gives you **concurrency** but not parallelism. The scheduler hands the core to one thread for a few milliseconds, then preempts it and runs another. This interleaving is invisible in the source code, which is exactly why concurrency bugs are hard: the program text suggests sequential order, the hardware delivers an arbitrary shuffle.

On a multi-core machine you get **parallelism**: two threads can genuinely execute the same instant on different cores. \`Runtime.getRuntime().availableProcessors()\` reports how many hardware threads the JVM may use, and the common ForkJoin pool sizes itself from that number.

Switching costs real time. A context switch saves registers, swaps stacks, may flush or reload TLB entries, and typically pollutes L1/L2 caches so the next thread starts cold. A voluntary switch happens when a thread blocks on I/O, a lock, or \`sleep\`; an involuntary one happens when its time slice expires or a higher-priority thread becomes runnable. One switch is microseconds — irrelevant. A thousand threads fighting over eight cores is a *context-switch storm*, and throughput collapses. That is precisely the problem thread pools and virtual threads exist to solve.`,
        },
        {
          id: 'jvm-thread-mapping',
          title: 'How JVM threads map to OS threads',
          body: `A classic Java **platform thread** is a thin wrapper over a native OS thread: a strict 1:1 mapping. \`new Thread(...).start()\` ultimately asks the OS to create a kernel-scheduled thread, and every blocking operation, priority hint, and park/unpark goes down to the kernel.

The cost is memory and scheduling. Each platform thread reserves a stack sized by \`-Xss\` (commonly 512 KB to 1 MB) plus kernel bookkeeping. Ten thousand platform threads therefore reserve several gigabytes of address space and put ten thousand entries in the scheduler's run queue. This is why "one thread per request" servers fall over around a few thousand concurrent connections and why blocking I/O dominates capacity planning.

The JVM also runs its own threads you never wrote: GC workers, JIT compiler threads, \`Reference Handler\`, \`Finalizer\`, \`Signal Dispatcher\`, \`Common-Cleaner\`, and the \`main\` thread. Enumerating them shows the process is busy before your first line executes. Java 21's virtual threads break the 1:1 rule with an M:N mapping, which the final topic covers.`,
        },
      ],
      javaCode: [
        {
          title: 'Shared heap vs private stack',
          description:
            'Two threads run the same task: the local counter is copied per thread, while the static counter is a single shared cell that loses updates.',
          code: `public class SharingDemo {
    private static int sharedCounter = 0; // heap/metaspace: one copy for all threads

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            int localCounter = 0;              // stack: one copy per thread
            for (int i = 0; i < 100_000; i++) {
                localCounter++;
                sharedCounter++;               // read-modify-write on shared memory
            }
            System.out.printf("%s finished, local=%d%n",
                    Thread.currentThread().getName(), localCounter);
        };

        Thread t1 = new Thread(task, "worker-1");
        Thread t2 = new Thread(task, "worker-2");
        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("expected shared = 200000, actual = " + sharedCounter);
    }
}`,
        },
        {
          title: 'Inspecting the threads a JVM starts for you',
          description:
            'A fresh JVM already runs GC, JIT, and reference-handling threads. Enumerating them makes the process/thread split concrete.',
          code: `import java.util.Map;

public class ThreadInventory {
    public static void main(String[] args) {
        System.out.println("PID = " + ProcessHandle.current().pid());
        System.out.println("available processors = "
                + Runtime.getRuntime().availableProcessors());

        Map<Thread, StackTraceElement[]> all = Thread.getAllStackTraces();
        System.out.println("live threads = " + all.size());
        for (Map.Entry<Thread, StackTraceElement[]> entry : all.entrySet()) {
            Thread t = entry.getKey();
            System.out.printf("%-24s daemon=%-5b priority=%d state=%s%n",
                    t.getName(), t.isDaemon(), t.getPriority(), t.getState());
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'A process is the isolation unit; a thread is the scheduling unit inside it.',
        'Threads share heap, metaspace, and open files, but each owns a private stack, program counter, and registers.',
        'Local variables are thread-confined; only escaped, shared, mutable state can be raced on.',
        'Context switching is not free: cache pollution and scheduler overhead punish oversized thread counts.',
        'Platform threads map 1:1 to OS threads, so their memory and scheduling cost scales linearly.',
      ],
      interviewTips: [
        'Lead with the memory model: "shared heap, private stack" answers most process-vs-thread questions in one line.',
        'Mention that concurrency on one core is interleaving, while parallelism requires multiple cores.',
        'Quantify thread cost (-Xss stack reservation, kernel thread per platform thread) to show production awareness.',
        'Use the JVM\'s own GC and JIT threads as an example that every Java process is multi-threaded from startup.',
      ],
      pitfalls: [
        'Claiming threads have their own heap — they do not; only their stacks are private.',
        'Assuming a single-core CPU runs threads one at a time "in order" — the interleaving is arbitrary.',
        'Spawning a thread per request and expecting it to scale to tens of thousands of connections.',
        'Forgetting that two JVMs on one machine are separate processes and share no static state.',
        'Treating "the code ran in this order" as evidence, when the scheduler can interleave anywhere.',
      ],
      quiz: [
        {
          question: 'Which of the following is private to a single thread?',
          options: ['The heap', 'The method area / metaspace', 'The stack', 'Static fields'],
          answerIndex: 2,
          explanation: 'Each thread owns its stack and program counter. The heap, metaspace, and static fields belong to the process and are shared by all its threads.',
        },
        {
          question: 'On a 4-core machine running 8 CPU-bound threads, what is true?',
          options: [
            'All 8 threads execute simultaneously with no switching',
            'At most 4 execute at any instant; the rest wait for a core',
            'Only 1 thread runs because Java serializes threads',
            'The JVM refuses to start more than 4 threads',
          ],
          answerIndex: 1,
          explanation: 'Parallelism is bounded by hardware threads. With 8 runnable threads on 4 cores the scheduler time-slices, so four run at a time.',
        },
      ],
    },
    {
      slug: 'thread-creation-and-lifecycle',
      title: 'Thread Creation & Lifecycle',
      order: 2,
      level: 'beginner',
      summary: 'Creating work with Thread, Runnable, or Callable, and the six states a thread moves through from NEW to TERMINATED.',
      subtopics: [
        {
          id: 'thread-vs-runnable',
          title: 'Thread vs Runnable: separate the task from the runner',
          body: `Java offers two classic ways to start work: extend \`Thread\` and override \`run()\`, or implement \`Runnable\` and hand it to a \`Thread\`. Both work; only one is a good design.

Extending \`Thread\` fuses two responsibilities into one class. The class becomes both *the task* and *the execution mechanism*, and it burns your single inheritance slot — a \`ReportJob extends Thread\` can never also extend \`AbstractJob\`. It also cannot be reused meaningfully: a \`Thread\` object runs once, then it is dead.

Implementing \`Runnable\` keeps the task as plain data plus a \`run()\` method. You can submit the same instance to five threads, to an \`ExecutorService\`, or to a scheduler; you can instantiate it in a test without starting anything; and because \`Runnable\` is a functional interface, \`new Thread(() -> doWork())\` works. This is **separation of concerns**: \`Runnable\` says *what* to run, \`Thread\` says *how* to run it.

In modern code you rarely create raw threads at all — you submit \`Runnable\` tasks to a pool. The interface choice you make now is what makes that migration a one-line change.`,
        },
        {
          id: 'callable-and-future',
          title: 'Callable: tasks that return a value',
          body: `\`Runnable.run()\` returns \`void\` and cannot throw checked exceptions. That is fine for fire-and-forget work and useless for anything you need an answer from. \`Callable<V>\` solves both problems: \`V call() throws Exception\` returns a result and may propagate checked exceptions.

Because a \`Callable\` produces a value *later*, the caller needs a handle to that future value — \`Future<V>\`. Submitting a \`Callable\` to an \`ExecutorService\` returns a \`Future\` immediately; \`get()\` blocks until the result is ready, \`get(timeout, unit)\` gives up after a deadline, and \`isDone()\` / \`cancel()\` support non-blocking checks.

The trade-off is that \`get()\` reintroduces blocking, so chaining three dependent calls with \`Future\` gives you no better throughput than sequential code. \`CompletableFuture\` exists to fix that. Also note an exception inside a \`Callable\` is not printed: it is captured and rethrown from \`get()\` wrapped in an \`ExecutionException\`, so always unwrap \`getCause()\` when logging.`,
        },
        {
          id: 'lifecycle-states',
          title: 'The six lifecycle states',
          body: `\`Thread.getState()\` exposes exactly six values from \`Thread.State\`:

| State | Meaning | Entered by |
| --- | --- | --- |
| NEW | Object constructed, not started | \`new Thread(...)\` |
| RUNNABLE | Eligible for CPU, running or in the OS run queue | \`start()\` |
| BLOCKED | Waiting to acquire a monitor lock | Contended \`synchronized\` |
| WAITING | Waiting indefinitely for another thread | \`wait()\`, \`join()\`, \`park()\` |
| TIMED_WAITING | Waiting with a deadline | \`sleep(ms)\`, \`join(ms)\`, \`wait(ms)\` |
| TERMINATED | \`run()\` returned or threw | End of execution |

Two subtleties trip people up. First, \`RUNNABLE\` covers both "executing on a core" and "ready and queued" — Java does not distinguish, because the OS may run the thread at any nanosecond. Second, blocking I/O such as a socket read also shows \`RUNNABLE\`, because the JVM cannot see that the native call is parked. The state is a diagnostic hint, not a precise truth.

States are one-way in practice: you cannot move a thread from \`TERMINATED\` back to \`NEW\`. Once \`run()\` ends, the object is a corpse you can only inspect.`,
        },
        {
          id: 'start-vs-run',
          title: 'start() vs run()',
          body: `\`t.start()\` is the only correct way to launch a thread. It asks the JVM to create the native thread, allocate its stack, register it with the scheduler, and only then invoke \`run()\` on that *new* thread. \`start()\` returns immediately, so the caller continues in parallel.

\`t.run()\` is an ordinary method call. It executes the body synchronously on the **current** thread, with the current thread's stack and name. The program still works — the output may even look right — but it is completely sequential, and every concurrency bug you thought you were testing is invisible. This is the most common silent mistake in beginner multithreaded code.

Calling \`start()\` twice throws \`IllegalThreadStateException\`. A thread object is a one-shot execution handle; there is no way to restart it. To run the same logic again, create a new \`Thread\` around the same \`Runnable\`, which is safe because the \`Runnable\` holds the task, not the execution.

A related trap: an uncaught exception in \`run()\` kills only that thread, prints a stack trace to \`System.err\`, and leaves the rest of the JVM running.`,
        },
        {
          id: 'naming-and-handlers',
          title: 'Naming threads and handling failures',
          body: `Thread names are not cosmetic. Thread dumps, profiler flame graphs, and log lines all key off the name, and \`Thread-0\`, \`Thread-1\` tells you nothing at 3 a.m. Always name workers meaningfully: \`new Thread(task, "order-expiry-sweeper-3")\` or, in a pool, a custom \`ThreadFactory\` that stamps a prefix and a sequence number.

Uncaught exceptions deserve the same care. By default, an exception escaping \`run()\` prints to \`System.err\` and the thread dies silently from the application's point of view. You can install a \`Thread.UncaughtExceptionHandler\` per thread or JVM-wide via \`Thread.setDefaultUncaughtExceptionHandler\`, which is where you would push the failure into your logging or alerting pipeline.

Finally, mark background infrastructure as **daemon** with \`setDaemon(true)\` *before* \`start()\`. Daemon threads do not keep the JVM alive: when the last non-daemon thread finishes, the JVM halts and daemons are killed mid-instruction. That is appropriate for housekeeping loops and dangerous for anything that must flush data on the way out.`,
        },
      ],
      javaCode: [
        {
          title: 'Three ways to define work',
          description:
            'Extending Thread, implementing Runnable, and using a lambda — plus why the Runnable versions compose better.',
          code: `public class CreationDemo {

    static class CounterThread extends Thread {
        CounterThread() { super("counter-thread"); }
        @Override
        public void run() {
            System.out.println("extends Thread on " + getName());
        }
    }

    static class PrintTask implements Runnable {
        private final String message;
        PrintTask(String message) { this.message = message; }
        @Override
        public void run() {
            System.out.println(message + " on " + Thread.currentThread().getName());
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Thread a = new CounterThread();
        Thread b = new Thread(new PrintTask("runnable task"), "runnable-thread");
        Thread c = new Thread(() -> System.out.println(
                "lambda task on " + Thread.currentThread().getName()), "lambda-thread");

        a.start();
        b.start();
        c.start();

        a.join();
        b.join();
        c.join();
    }
}`,
        },
        {
          title: 'start() vs run() and the state machine',
          description:
            'run() executes on the caller thread; start() spawns one. The lifecycle observer prints every state a thread passes through.',
          code: `public class StartVsRunDemo {
    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> System.out.println(
                "running on " + Thread.currentThread().getName());

        System.out.println("-- calling run() directly --");
        new Thread(task, "worker").run();     // main thread executes it

        Thread t = new Thread(() -> {
            try {
                Thread.sleep(120);            // TIMED_WAITING
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "worker");

        System.out.println("after construction: " + t.getState()); // NEW
        t.start();
        System.out.println("after start():      " + t.getState()); // RUNNABLE
        Thread.sleep(30);
        System.out.println("during sleep:       " + t.getState()); // TIMED_WAITING
        t.join();
        System.out.println("after join():       " + t.getState()); // TERMINATED

        try {
            t.start();                        // one-shot handle
        } catch (IllegalThreadStateException e) {
            System.out.println("restart rejected: " + e.getClass().getSimpleName());
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Prefer Runnable or Callable over extending Thread: it keeps inheritance free and lets tasks be reused by pools.',
        'start() creates a new thread and returns; run() executes the body on the calling thread.',
        'A thread object runs exactly once — a second start() throws IllegalThreadStateException.',
        'Six states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED; RUNNABLE includes "queued for CPU".',
        'Name your threads and install an uncaught exception handler; unnamed dying threads are invisible failures.',
      ],
      interviewTips: [
        'When asked "why Runnable over Thread?", answer with separation of concerns, inheritance, and reuse by executors.',
        'Explain that start() involves a native thread creation call while run() is just virtual dispatch.',
        'Mention Thread.State values in order and note that BLOCKED is specifically monitor-lock contention.',
        'Bring up Callable/Future as the answer when the task must return a value or throw checked exceptions.',
      ],
      pitfalls: [
        'Calling run() instead of start() and believing the code is multi-threaded.',
        'Calling start() twice, or calling start() from a constructor before fields are initialized.',
        'Expecting Thread.State to distinguish "on CPU" from "ready" — both report RUNNABLE.',
        'Setting daemon status after start(), which throws IllegalThreadStateException.',
        'Swallowing exceptions inside run() so the thread dies without any log.',
      ],
      quiz: [
        {
          question: 'What happens if you call run() directly on a Thread instance?',
          options: [
            'A new thread is created and started',
            'The body executes synchronously on the calling thread',
            'It throws IllegalThreadStateException',
            'It starts the thread in NEW state and returns',
          ],
          answerIndex: 1,
          explanation: 'run() is an ordinary method. Only start() asks the JVM to create a native thread; calling run() keeps execution on the caller.',
        },
        {
          question: 'A thread is waiting to enter a synchronized block held by another thread. Which state does it report?',
          options: ['WAITING', 'TIMED_WAITING', 'BLOCKED', 'RUNNABLE'],
          answerIndex: 2,
          explanation: 'Monitor-lock contention is the only thing that reports BLOCKED. wait() and join() report WAITING; sleep() reports TIMED_WAITING.',
        },
      ],
    },
    {
      slug: 'thread-methods',
      title: 'Thread Methods: sleep, join, yield & interrupt',
      order: 3,
      level: 'intermediate',
      summary: 'The control surface of a thread: timing, waiting for completion, scheduler hints, interruption, and daemon status.',
      subtopics: [
        {
          id: 'sleep-and-timed-waiting',
          title: 'sleep() and the TIMED_WAITING state',
          body: `\`Thread.sleep(millis)\` parks the *current* thread for at least the requested duration and moves it to \`TIMED_WAITING\`. It is a static method on purpose: you can only put yourself to sleep, never another thread. There is no \`otherThread.sleep()\`.

Two properties matter. First, **sleep does not release locks**. If the thread holds a monitor and calls \`sleep(10_000)\`, every other thread that needs that monitor waits ten seconds. Sleeping inside a \`synchronized\` block is a classic way to serialize an entire subsystem by accident.

Second, the sleep is a *minimum*, not a promise. The thread becomes eligible after the duration, but the scheduler may run it later. Never use \`sleep\` for ordering or synchronization — "sleep 100 ms so the other thread finishes" is a race condition with extra steps. Use \`join\`, a \`CountDownLatch\`, or a \`Future\` for that.

\`TimeUnit.SECONDS.sleep(2)\` is the idiomatic alternative: it reads better and handles unit conversion. For sub-millisecond pauses, \`Thread.onSpinWait()\` or \`LockSupport.parkNanos\` is more appropriate than \`sleep(0)\`, which merely yields.`,
        },
        {
          id: 'join-and-ordering',
          title: 'join(): waiting for another thread to finish',
          body: `\`t.join()\` makes the *calling* thread wait until \`t\` reaches \`TERMINATED\`. It is the standard way to express "this computation depends on that one finishing", and it is how a \`main\` method keeps the JVM alive long enough for workers to complete.

The overload \`t.join(millis)\` waits at most that long and then returns control regardless, so the caller must re-check \`t.isAlive()\` or a result flag afterwards. That pattern — bounded wait plus verification — is what prevents a hung worker from hanging the whole application. \`join\` does not report whether the thread finished; only \`isAlive()\` does.

\`join\` is implemented on top of \`wait\`/notification on the thread object and throws \`InterruptedException\`, because waiting is interruptible. If interrupted, the caller stops waiting but \`t\` keeps running.

Beware the deadlock shape: if thread A calls \`b.join()\` while thread B calls \`a.join()\`, neither can finish and both wait forever. The same hazard appears when a pool task waits on another task in the same single-threaded pool — the queue can never drain.`,
        },
        {
          id: 'yield-and-hints',
          title: 'yield() is advice, not a command',
          body: `\`Thread.yield()\` tells the scheduler "I am willing to give up my remaining time slice". The thread goes from running to \`RUNNABLE\` and the OS may pick another thread of equal priority — or may immediately pick the same one again.

That "may" is the entire story. \`yield\` has no defined semantics in the Java specification; on some platforms it maps to \`sched_yield\`, on others it is close to a no-op. Code whose correctness depends on \`yield\` is broken on at least one platform. It also cannot be relied on for fairness, since a greedy thread can be rescheduled instantly.

Where is it legitimate? In hand-rolled spin loops as a politeness hint, and in micro-benchmarks. Even there, \`Thread.onSpinWait()\` (Java 9+) is better: it emits a CPU pause instruction that reduces contention on the cache line being polled, without surrendering the core.

For real fairness use a fair \`ReentrantLock\`, a \`Semaphore(true)\`, or a \`BlockingQueue\` that parks threads. If you find yourself writing \`yield\` to "let the other thread go first", you have found a missing synchronization primitive, not a scheduling tweak.`,
        },
        {
          id: 'interruption-contract',
          title: 'Interruption: a cooperative shutdown signal',
          body: `Java has no safe way to forcibly stop a thread (\`Thread.stop\` was removed because it could corrupt state). Instead it offers **interruption**: \`t.interrupt()\` sets a boolean flag on \`t\`. Nothing else happens immediately — the target decides how to react. That is the whole contract, and it only works if every layer cooperates.

If the target is inside \`sleep\`, \`wait\`, \`join\`, or an interruptible channel operation, the call throws \`InterruptedException\` and **clears the flag** as it throws. If the target is running ordinary code, the flag stays set and the code must poll \`Thread.currentThread().isInterrupted()\`.

Three API details people mix up: \`isInterrupted()\` reads the flag and leaves it; the static \`Thread.interrupted()\` reads **and clears** it; the \`interrupted\` status is not inherited by a newly created thread.

The rule for library code is simple: either propagate \`InterruptedException\` (add it to your \`throws\` clause), or restore the flag with \`Thread.currentThread().interrupt()\` and return. Swallowing it — an empty catch block — breaks every caller's ability to shut down cleanly.`,
        },
        {
          id: 'daemon-and-priority',
          title: 'Daemon threads and priorities',
          body: `A **daemon thread** is a background helper that does not keep the JVM alive. When the last non-daemon thread terminates, the JVM begins shutdown, runs shutdown hooks, and kills daemons wherever they are — even mid-write. Set the flag before \`start()\`; afterwards it throws \`IllegalThreadStateException\`. A thread created by a daemon is daemon by default, which is how a helper can silently inherit the wrong lifecycle.

Daemons are right for cache eviction, metrics flushing, and heartbeat pings where losing the last iteration is harmless. They are wrong for anything that must persist data, because there is no guarantee the final block runs. Use \`try/finally\` plus a shutdown hook or a lifecycled \`ExecutorService\` instead.

**Priorities** (\`MIN_PRIORITY\` 1 … \`MAX_PRIORITY\` 10, default 5) are also only hints. HotSpot maps them onto OS priorities where the platform allows, and on Linux the mapping is largely advisory. Threads that never yield can starve lower-priority ones regardless of the numbers, so priority is not a scheduling guarantee and must never carry correctness. If a task must run before another, encode that with ordering primitives, not \`setPriority\`.`,
        },
      ],
      javaCode: [
        {
          title: 'join() with a deadline',
          description:
            'Bounded waiting: join for at most the timeout, then verify with isAlive() instead of trusting that the worker finished.',
          code: `public class JoinDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            try {
                Thread.sleep(1_500);
                System.out.println("worker finished its work");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("worker cancelled");
            }
        }, "slow-worker");

        long start = System.nanoTime();
        worker.start();
        worker.join(500);                       // wait at most 500 ms

        if (worker.isAlive()) {
            System.out.println("still running after 500 ms; not blocking forever");
        }

        worker.join();                          // now wait for completion
        System.out.printf("total wait = %d ms, alive = %b%n",
                (System.nanoTime() - start) / 1_000_000, worker.isAlive());
    }
}`,
        },
        {
          title: 'The interruption contract',
          description:
            'A cancellable worker cooperates: blocking calls throw, the catch block restores the flag, and the loop exits on request.',
          code: `public class InterruptDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    System.out.println("working...");
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    // restore the flag so outer code can still observe cancellation
                    Thread.currentThread().interrupt();
                }
            }
            System.out.println("worker exiting cleanly, flag = "
                    + Thread.currentThread().isInterrupted());
        }, "cancellable-worker");

        worker.start();
        Thread.sleep(1_000);
        worker.interrupt();                     // request, do not force
        worker.join();
        System.out.println("main done");
    }
}`,
        },
        {
          title: 'Daemon threads and thread factories',
          description:
            'A daemon housekeeping thread dies with the JVM, unlike a user thread that keeps the process alive.',
          code: `public class DaemonDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread heartbeat = new Thread(() -> {
            while (true) {
                System.out.println("heartbeat @" + System.currentTimeMillis());
                try {
                    Thread.sleep(400);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }, "heartbeat");

        heartbeat.setDaemon(true);   // must be set before start()
        heartbeat.setPriority(Thread.MIN_PRIORITY);
        heartbeat.start();

        Thread.sleep(1_000);
        System.out.println("main returning: JVM will not wait for the daemon");
    }
}`,
        },
      ],
      keyTakeaways: [
        'sleep() pauses only the current thread, keeps all locks held, and guarantees a minimum delay, not an exact one.',
        'join() waits for termination; the timed overload needs an isAlive() check afterwards.',
        'yield() is an unenforceable hint — never use it for correctness or fairness.',
        'interrupt() sets a flag; blocking calls throw InterruptedException and clear it, so restore it when you cannot propagate.',
        'Daemon threads do not keep the JVM alive, and priority is advisory on most platforms.',
      ],
      interviewTips: [
        'State clearly that sleep() does not release the monitor — a favourite follow-up question.',
        'Describe interruption as cooperative cancellation and show the restore-the-flag idiom.',
        'Contrast isInterrupted() with the static interrupted(), which clears the flag.',
        'Explain that Thread.stop() was removed because it can leave objects in an inconsistent state.',
      ],
      pitfalls: [
        'Using sleep() instead of join/latch to "wait for" another thread.',
        'Catching InterruptedException and doing nothing, which silently disables shutdown.',
        'Calling sleep() while holding a lock and blocking every other thread.',
        'Setting daemon or priority after start(), which throws IllegalThreadStateException.',
        'Relying on thread priority to enforce execution order.',
      ],
      quiz: [
        {
          question: 'A thread holding a monitor calls Thread.sleep(5000). What do other threads contend on that monitor experience?',
          options: [
            'They proceed immediately because sleep releases locks',
            'They block for about 5 seconds until the sleeper wakes and exits the block',
            'They get an IllegalMonitorStateException',
            'They are interrupted automatically',
          ],
          answerIndex: 1,
          explanation: 'sleep() does not release monitor locks, so the critical section stays occupied for the whole nap.',
        },
        {
          question: 'What does Thread.interrupted() do that isInterrupted() does not?',
          options: [
            'It throws InterruptedException',
            'It clears the interrupt flag after reading it',
            'It interrupts the current thread',
            'It returns the thread state',
          ],
          answerIndex: 1,
          explanation: 'The static Thread.interrupted() reads and resets the flag; the instance isInterrupted() only reads it.',
        },
      ],
    },
    {
      slug: 'concurrency-problems',
      title: 'Race Conditions, Visibility & Ordering',
      order: 4,
      level: 'advanced',
      summary: 'The three ways concurrent code breaks: interleaved updates, stale cached reads, and reordered instructions.',
      subtopics: [
        {
          id: 'race-conditions',
          title: 'Race conditions and critical sections',
          body: `A **race condition** exists when the correctness of a program depends on the relative timing of threads. The output is not random — it is determined by scheduling, which is why the bug appears once in ten thousand runs and never on your laptop.

The dangerous region is the **critical section**: code that reads and writes state another thread can also touch. In \`balance = balance - amount\`, the read and the write must be indivisible with respect to other updates, or two withdrawals can both observe the pre-debit balance and both succeed.

Note that a race is about *invariants*, not just about single variables. A transfer that debits one account and credits another has a critical section spanning both fields; protecting each field separately keeps each number consistent but breaks the sum. The critical section must cover every piece of state that the invariant relates.

Detection is hard by inspection because the interleaving is invisible. Techniques that work: keep shared mutable state small and clearly owned, document the lock that guards each field, and let tools like ThreadSanitizer-style race detectors or stress tests with \`CountDownLatch\` starting gates shake the bug loose.`,
        },
        {
          id: 'non-atomic-updates',
          title: 'Why count++ is three operations',
          body: `\`count++\` looks like one statement but compiles to roughly three: load the field into a register, add one, store it back. On x86 the JIT may emit a single \`lock inc\` for some cases, but the Java memory model gives you **no atomicity guarantee** for compound operations. You must assume read-modify-write is interruptible between any two steps.

Two threads each executing 100,000 increments on the same field routinely produce 150,000 or 187,412 instead of 200,000. The lost updates happen when both threads load the same value before either stores: thread A loads 41, thread B loads 41, both compute 42, both store 42. One increment vanished.

This is the canonical lost-update pattern, and it generalises to any check-then-act sequence: \`if (map.get(k) == null) map.put(k, v)\` and \`if (stack.size() > 0) stack.pop()\` are equally broken on unsynchronized collections. The fix is either mutual exclusion (\`synchronized\`, a lock) or a single atomic operation (\`AtomicInteger.incrementAndGet()\`, \`map.computeIfAbsent\`, \`ConcurrentHashMap\`).

Also note that making the field \`volatile\` fixes visibility but not atomicity: a volatile \`count++\` still loses updates, just with fresher values.`,
        },
        {
          id: 'visibility-and-caches',
          title: 'Visibility: why a thread never sees your write',
          body: `Each CPU core has local L1/L2 caches and store buffers. When thread A writes \`running = false\`, the new value may sit in core A's store buffer or cache line for a while. Thread B, polling \`running\` on another core, keeps reading its own cached copy and stays in the loop forever. The write did happen; the reader simply had no reason to look again.

The JIT makes this worse by hoisting the read out of the loop. It is allowed to transform \`while (!running) {}\` into an infinite loop that reads \`running\` once, because in a single-threaded interpretation nothing else can modify it. This is the notorious "it works with \`System.out.println\` inside the loop" phenomenon: the print call is a synchronization point that forces a reload.

The fix is a **happens-before** edge. Declaring the field \`volatile\` tells the compiler and CPU that every read must observe the latest write, forbidding the hoist and inserting the necessary memory barrier. \`synchronized\` blocks, \`Atomic*\` operations, and \`Lock\` acquisition/release create the same edges. Without one of these, a data race lets the JVM do essentially anything.`,
        },
        {
          id: 'java-memory-model',
          title: 'The Java Memory Model and happens-before',
          body: `The **Java Memory Model (JMM)** is the specification that answers: when is a write by thread A guaranteed visible to a read by thread B? Its central relation is **happens-before** (\`hb\`). If action X happens-before action Y, then X's effects — including plain field writes — are visible to Y and X is ordered before Y.

The rules you actually use:

- **Program order**: within one thread, earlier statements happen-before later ones.
- **Monitor lock**: an unlock of a monitor happens-before every subsequent lock of the same monitor.
- **Volatile**: a write to a volatile field happens-before every subsequent read of that field.
- **Thread start**: everything before \`t.start()\` happens-before the first action in \`t\`.
- **Thread termination**: everything in \`t\` happens-before another thread returns from \`t.join()\`.
- **Transitivity**: if X hb Y and Y hb Z, then X hb Z.
- **Final fields**: correctly constructed objects are safe to publish, because \`final\` fields freeze at the end of the constructor.

Everything else is a **data race**, and a data-racy program may observe values that no sequential execution could produce. The practical method: for every shared mutable field, name the happens-before edge that guards it, or make it immutable.`,
        },
        {
          id: 'reordering',
          title: 'Reordering and safe publication',
          body: `Compilers, the JIT, and the CPU all reorder independent instructions to keep pipelines full. On a single thread this is undetectable: the result is as if the code ran in order. Across threads it is very detectable.

The classic broken singleton is \`if (instance == null) instance = new Singleton();\`. Object construction is not a single step: allocate memory, run the constructor, assign the reference to the field. Without a barrier, the assignment can become visible *before* the constructor's writes, so another thread reads a non-null reference whose fields are still defaults. That is why double-checked locking requires \`private static volatile Singleton instance\`.

The same reasoning explains why publishing an object through a plain field is unsafe: a reader may see the reference but not the object's state. Safe publication channels are: a \`static\` initializer, a \`final\` field, a \`volatile\` field, a field written then read through a lock, or a \`java.util.concurrent\` collection's \`put\`/\`take\`.

Idiomatic fix: make objects **immutable** — all fields \`final\`, no setters, no leaking \`this\` in the constructor. Immutable objects are safe to share with no synchronization at all.`,
        },
        {
          id: 'volatile-scope',
          title: 'What volatile does and does not buy you',
          body: `\`volatile\` is the cheapest synchronization tool in Java, and the most over-trusted. It guarantees exactly two things: **visibility** (a read always sees the most recent write) and **ordering** (no reordering across the access, plus a happens-before edge from each write to subsequent reads).

It does not guarantee **atomicity** for compound actions. \`volatile int count; count++\` is still a three-step race. It does not make check-then-act safe: \`if (map.isEmpty()) map.put(...)\` remains broken. It does not give mutual exclusion, so two threads can still interleave inside a critical section. And it cannot make a reference's *contents* safe: a volatile array field makes the reference fresh, not the elements.

It shines for one-writer-many-readers flags — a shutdown flag, a configuration reference swapped atomically, a state enum guarded by a single writer. In those patterns you get a happens-before edge for pennies, without any lock, blocking, or deadlock risk.

Rule of thumb: use \`volatile\` when the variable's value is written by one thread and read by others and no invariant spans multiple fields. Otherwise use \`Atomic*\` for a single counter or a lock for multi-field invariants.`,
        },
      ],
      javaCode: [
        {
          title: 'The lost update, reproduced',
          description:
            'A latch releases both threads at the same instant so the race window is wide enough to see lost increments reliably.',
          code: `import java.util.concurrent.CountDownLatch;

public class RaceConditionDemo {
    private static int count = 0;                 // plain field, no visibility or atomicity

    public static void main(String[] args) throws InterruptedException {
        int threads = 4;
        int incrementsPerThread = 250_000;
        CountDownLatch startGate = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            new Thread(() -> {
                try {
                    startGate.await();            // maximise overlap
                    for (int j = 0; j < incrementsPerThread; j++) {
                        count++;                  // read, add, write
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            }, "racer-" + i).start();
        }

        startGate.countDown();
        done.await();

        int expected = threads * incrementsPerThread;
        System.out.println("expected " + expected + " but got " + count
                + " (lost " + (expected - count) + " updates)");
    }
}`,
        },
        {
          title: 'Fixing visibility with volatile, then atomicity with AtomicInteger',
          description:
            'The flag example shows the visibility bug and its fix; the counter shows why volatile is not enough for compound updates.',
          code: `import java.util.concurrent.atomic.AtomicInteger;

public class VolatileVsAtomic {
    private static volatile boolean running = true;      // visibility only
    private static final AtomicInteger safeCount = new AtomicInteger();
    private static volatile int unsafeCount = 0;         // still racy

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            long iterations = 0;
            while (running) {                            // guaranteed to see the update
                iterations++;
            }
            for (int i = 0; i < 100_000; i++) {
                safeCount.incrementAndGet();             // atomic read-modify-write
                unsafeCount++;                           // lost updates
            }
            System.out.println("spins = " + iterations);
        }, "worker");

        worker.start();
        Thread.sleep(50);
        running = false;                                 // becomes visible immediately
        worker.join();

        System.out.println("atomic  = " + safeCount.get());
        System.out.println("volatile = " + unsafeCount);
    }
}`,
        },
        {
          title: 'Happens-before through a lock',
          description:
            'A non-volatile field is still safely published because the unlock/lock pair on the same monitor establishes a happens-before edge.',
          code: `public class HappensBeforeDemo {
    private int value;                     // plain field, guarded by lock
    private boolean ready;
    private final Object lock = new Object();

    void publish() {
        synchronized (lock) {
            value = 42;                    // (1) inside critical section
            ready = true;                  // (2)
        }                                  // unlock happens-before next lock
    }

    int consume() {
        synchronized (lock) {
            return ready ? value : -1;     // sees 42, guaranteed
        }
    }

    public static void main(String[] args) throws InterruptedException {
        HappensBeforeDemo demo = new HappensBeforeDemo();
        Thread writer = new Thread(demo::publish);
        Thread reader = new Thread(() -> System.out.println("read = " + demo.consume()));

        writer.start();
        writer.join();                     // join is itself a happens-before edge
        reader.start();
        reader.join();
    }
}`,
        },
      ],
      keyTakeaways: [
        'A race condition makes correctness depend on scheduling; the fix is exclusivity or a single atomic operation.',
        'count++ is load, add, store — never atomic unless guarded by a lock or an atomic class.',
        'Without a happens-before edge, a reader may never observe another thread\'s write.',
        'The JMM defines happens-before via program order, monitor locks, volatile, start, join, and final fields.',
        'volatile buys visibility and ordering, never atomicity of compound actions.',
      ],
      interviewTips: [
        'Answer "what does volatile do?" with visibility plus ordering, then immediately say it does not give atomicity.',
        'List the happens-before rules by name — interviewers use that as a depth signal.',
        'Use double-checked locking to explain reordering and why the field must be volatile.',
        'Mention that immutable objects sidestep the whole problem rather than only proposing locks.',
      ],
      pitfalls: [
        'Believing a volatile counter is thread-safe.',
        'Guarding each field of an invariant separately, which keeps fields consistent but breaks the invariant.',
        'Publishing an object through a plain field and reading partially constructed state.',
        'Assuming the loop in a "stop flag" test terminates without volatile or a barrier.',
        'Relying on println or logging to "fix" a visibility bug, which hides it in production.',
      ],
      quiz: [
        {
          question: 'Which guarantee does volatile NOT provide?',
          options: [
            'A read sees the latest write to that field',
            'Instructions are not reordered across the access',
            'Compound operations such as count++ become atomic',
            'A happens-before edge from each write to later reads',
          ],
          answerIndex: 2,
          explanation: 'volatile gives visibility and ordering only. Read-modify-write sequences still need a lock or an Atomic class.',
        },
        {
          question: 'Thread A writes a plain field inside synchronized(lock) and exits the block. Thread B then enters synchronized(lock). What is guaranteed?',
          options: [
            'Nothing, because the field is not volatile',
            'B sees every write A made before releasing the same monitor',
            'B sees the write only if B sleeps briefly',
            'A race condition remains unless the field is final',
          ],
          answerIndex: 1,
          explanation: 'Monitor unlock happens-before the next lock of the same monitor, so all of A\'s prior writes are visible to B.',
        },
      ],
    },
    {
      slug: 'synchronized-and-monitor-locks',
      title: 'synchronized & Monitor Locks',
      order: 5,
      level: 'intermediate',
      summary: 'Every object carries a monitor: how mutual exclusion, visibility, and reentrancy work, and how deadlocks form.',
      subtopics: [
        {
          id: 'intrinsic-locks',
          title: 'Every object is a monitor',
          body: `Each Java object has an associated **intrinsic lock** (also called a monitor) that the JVM manages for you. The lock has an owner, and the runtime keeps three logical sets: the **owner** (the single thread currently inside), the **entry set** (threads blocked trying to get in, reported as \`BLOCKED\`), and the **wait set** (threads parked by \`wait()\`, reported as \`WAITING\`).

Entering a \`synchronized\` region is \`monitorenter\`; leaving it — normally or via an exception — is \`monitorexit\`. The JVM guarantees the exit even on throw, which is why you never need a \`finally\` to release an intrinsic lock. That is one advantage over explicit locks, where a missing \`unlock()\` leaks the lock forever.

Acquiring a monitor provides three things at once: **mutual exclusion** (one thread in the critical section), **visibility** (an unlock flushes writes and a lock re-reads, giving a happens-before edge), and **ordering** (no reordering across the boundary). A single keyword therefore solves all three concurrency problems from the previous topic.

Monitors are also **non-fair** by default. An unlucky thread can wait a long time while others barge ahead, which matters for latency-sensitive queues.`,
        },
        {
          id: 'methods-vs-blocks',
          title: 'synchronized methods vs synchronized blocks',
          body: `A \`synchronized\` **instance method** locks \`this\`. A \`synchronized\` **block** locks whatever object you name. The method form is shorter and impossible to forget to release; the block form lets you choose a smaller scope and a dedicated lock object.

Scope is the reason to prefer blocks. Locking the whole method serializes argument validation, logging, and result formatting that never touch shared state. \`synchronized (lock) { balance -= amount; }\` keeps the critical section to the invariant and nothing else, which shortens hold time and improves throughput.

Choosing the lock object matters just as much. Locking on \`this\` exposes your lock to the outside world: any caller can do \`synchronized (yourObject) { ... }\` and interfere with your internals. Locking on \`SomeClass.class\` creates contention with every other code path that locks the same class object. The defensive pattern is a \`private final Object lock = new Object();\` — no external code can reach it, so no external code can deadlock against you.

Never lock on a \`String\` literal, a boxed primitive, or a mutable field whose reference changes. The first two are shared and interned globally; the third silently locks a different object after every reassignment.`,
        },
        {
          id: 'static-synchronization',
          title: 'Static synchronization locks the Class object',
          body: `A \`static synchronized\` method has no \`this\`, so it locks the \`Class\` object for that type — \`Counter.class\`. There is exactly one such object per class per class loader, so static synchronization excludes *all* instances of the class, not just one.

The consequence is that instance and static synchronization are independent. A thread in \`synchronized void increment()\` and a thread in \`static synchronized void reset()\` can run at the same time on the same class, because they hold different monitors. If both touch the same static field, that is a bug hiding behind a keyword that looks correct.

The idiomatic fix is to make the relationship explicit: have both methods lock the same \`private static final Object LOCK = new Object();\`. Then the synchronization policy is one line of code, greppable, and immune to someone adding a \`synchronized\` method that "should" have been excluded.

Also remember that a class initializer (\`static { ... }\`) is executed under the class-initialization lock, so blocking work inside a static block can stall every thread that touches the class — a deadlock shape that is genuinely hard to diagnose.`,
        },
        {
          id: 'reentrancy',
          title: 'Reentrancy and hold counts',
          body: `Intrinsic locks are **reentrant**: a thread that already owns a monitor can enter any other block guarded by the same monitor. The JVM keeps a hold count and increments it on each entry, decrementing on each exit; the lock is released only when the count reaches zero.

Without reentrancy, ordinary object-oriented code would deadlock constantly. A \`synchronized\` method calling another \`synchronized\` method on \`this\` would self-block. A \`synchronized\` subclass method calling a \`synchronized\` superclass method would deadlock too, because both lock the same instance.

Reentrancy also has a cost in design terms: it makes it easy to hold a lock much longer than intended, because a call chain can wander through half the object while the monitor stays held. A deep call tree under one lock is a latency multiplier and a deadlock magnet.

One subtlety: if you override a \`synchronized\` method without the keyword, the override is **not** synchronized, even when invoked through a subclass reference. Synchronization is not inherited — it is a property of the method declaration, not the signature.`,
        },
        {
          id: 'lock-granularity',
          title: 'Lock granularity and custom lock objects',
          body: `One lock per object is the default, and it is often too coarse. If \`deposit()\` and \`withdraw()\` both synchronize on \`this\`, they serialize against each other even though they touch different fields. Splitting them onto two lock objects lets the operations run in parallel while each stays individually correct.

The trade-off is that more locks mean more chances to deadlock. The discipline is to define a **lock ordering** globally: every thread that needs both locks acquires them in the same order, so a cycle cannot form. Without an ordering, split locks turn a slow program into a hung one.

Granularity also has a lower bound. Locking a single \`int\` field is usually a job for \`AtomicInteger\`, not a monitor. Locking per element of a large array is possible in principle but rarely worth it; the bookkeeping overwhelms the contention saved.

Measure before splitting. Contention shows up in thread dumps as many threads in \`BLOCKED\` on the same monitor, and in profilers as time in \`monitorenter\`. If the critical section is a few arithmetic operations, the lock is not your bottleneck — I/O or allocation usually is.`,
        },
        {
          id: 'deadlock',
          title: 'Deadlock: the four conditions',
          body: `A deadlock is a cycle of threads each waiting for a resource another holds. It requires four conditions simultaneously — mutual exclusion, hold-and-wait, no preemption, and circular wait — and breaking any one of them prevents it.

The practical technique is to break **circular wait**: assign every lock a total order and always acquire in ascending order. \`transfer(a, b)\` should lock the account with the smaller id first, regardless of direction. It sounds trivial; it eliminates the classic transfer deadlock completely.

Three more tools are worth knowing. \`tryLock(timeout)\` lets a thread back off instead of waiting forever, which converts a deadlock into a retry. A single global lock removes the cycle at the cost of throughput. And \`jstack\` or a thread dump will print "Found one Java-level deadlock" with the exact lock chain — the fastest way from symptom to cause.

Do not confuse deadlock with **livelock** (threads keep retrying and never progress) or **starvation** (one thread never gets scheduled). Only deadlock shows as a stable cycle of \`BLOCKED\` or \`WAITING\` threads that never changes.`,
        },
      ],
      javaCode: [
        {
          title: 'Guarding an invariant with synchronized',
          description:
            'Instance methods lock this, a static method locks the Class object, and a custom lock object guards a field with a tighter scope.',
          code: `public class BankAccount {
    private final Object balanceLock = new Object();
    private long balance;

    public void deposit(long amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        synchronized (balanceLock) {          // tight critical section
            balance += amount;
        }
    }

    public boolean withdraw(long amount) {
        synchronized (balanceLock) {
            if (balance < amount) return false;
            balance -= amount;
            return true;
        }
    }

    public synchronized long balance() {     // locks this, not balanceLock
        synchronized (balanceLock) {
            return balance;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        BankAccount account = new BankAccount();
        Thread depositor = new Thread(() -> {
            for (int i = 0; i < 10_000; i++) account.deposit(1);
        });
        Thread withdrawer = new Thread(() -> {
            for (int i = 0; i < 5_000; i++) account.withdraw(1);
        });

        depositor.start();
        withdrawer.start();
        depositor.join();
        withdrawer.join();
        System.out.println("final balance = " + account.balance());
    }
}`,
        },
        {
          title: 'A reproducible deadlock, and the ordering fix',
          description:
            'Two threads lock A then B and B then A. The second half of the class shows the same transfer with a deterministic lock order.',
          code: `public class DeadlockDemo {
    private static final Object LOCK_A = new Object();
    private static final Object LOCK_B = new Object();

    static void deadlocking() throws InterruptedException {
        Thread t1 = new Thread(() -> {
            synchronized (LOCK_A) {
                sleep(50);
                synchronized (LOCK_B) { System.out.println("t1 done"); }
            }
        });
        Thread t2 = new Thread(() -> {
            synchronized (LOCK_B) {
                sleep(50);
                synchronized (LOCK_A) { System.out.println("t2 done"); }
            }
        });
        t1.start(); t2.start();
        t1.join(1_000); t2.join(1_000);
        System.out.println("t1 alive=" + t1.isAlive() + ", t2 alive=" + t2.isAlive());
    }

    static void ordered() throws InterruptedException {
        Object first = System.identityHashCode(LOCK_A) < System.identityHashCode(LOCK_B) ? LOCK_A : LOCK_B;
        Object second = first == LOCK_A ? LOCK_B : LOCK_A;

        Thread t1 = new Thread(() -> { synchronized (first) { sleep(50); synchronized (second) {} } });
        Thread t2 = new Thread(() -> { synchronized (first) { sleep(50); synchronized (second) {} } });
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println("no deadlock: both threads finished");
    }

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    public static void main(String[] args) throws InterruptedException {
        deadlocking();
        ordered();
    }
}`,
        },
        {
          title: 'Static synchronization and its blind spot',
          description:
            'Static and instance synchronization use different monitors, so both must lock the same class-level object when they share a field.',
          code: `public class StaticSyncDemo {
    private static long globalCount = 0;
    private static final Object GLOBAL_LOCK = new Object(); // explicit shared monitor

    // locks Counter.class — excludes other static synchronized methods only
    public static synchronized void incrementUnsafe() {
        globalCount++;
    }

    // both static and instance paths use GLOBAL_LOCK, so they exclude each other
    public static void incrementSafe() {
        synchronized (GLOBAL_LOCK) { globalCount++; }
    }

    public void instanceIncrementSafe() {
        synchronized (GLOBAL_LOCK) { globalCount++; }
    }

    public static void main(String[] args) throws InterruptedException {
        StaticSyncDemo instance = new StaticSyncDemo();
        Thread a = new Thread(() -> { for (int i = 0; i < 50_000; i++) incrementSafe(); });
        Thread b = new Thread(() -> { for (int i = 0; i < 50_000; i++) instance.instanceIncrementSafe(); });

        a.start(); b.start();
        a.join(); b.join();

        synchronized (GLOBAL_LOCK) {
            System.out.println("count = " + globalCount); // 100000
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Every object has one monitor with an owner, an entry set (BLOCKED) and a wait set (WAITING).',
        'synchronized provides mutual exclusion, visibility, and ordering in a single keyword, and releases on exception.',
        'Instance methods lock this; static methods lock the Class object; blocks lock the object you name.',
        'Prefer private final lock objects to avoid exposing your lock to external code.',
        'Break deadlock by imposing a global lock order or by using tryLock with a timeout.',
      ],
      interviewTips: [
        'Describe the monitor as owner + entry set + wait set; that vocabulary signals real understanding.',
        'Explain why static and instance synchronized methods do not exclude each other.',
        'Say "synchronized is reentrant because the JVM tracks a hold count per monitor".',
        'For deadlock questions, propose lock ordering first, then timed tryLock, then a single lock.',
      ],
      pitfalls: [
        'Locking on this, on a String literal, or on a field that changes reference.',
        'Assuming a synchronized instance method protects static state.',
        'Holding a monitor across I/O, callbacks, or sleeps, which serialises the system.',
        'Splitting into multiple locks without a global ordering, creating a deadlock.',
        'Believing an overridden method stays synchronized — the keyword does not inherit.',
      ],
      quiz: [
        {
          question: 'Which monitor does a static synchronized method acquire?',
          options: ['this', 'The instance of the first caller', 'The Class object of the declaring class', 'A private lock created by the JVM'],
          answerIndex: 2,
          explanation: 'Static methods have no this, so they synchronize on the Class object, one per class per class loader.',
        },
        {
          question: 'A thread already holding a monitor enters another synchronized block on the same object. What happens?',
          options: [
            'It deadlocks against itself',
            'It enters immediately and the hold count increases',
            'It throws IllegalMonitorStateException',
            'It releases and immediately reacquires the lock',
          ],
          answerIndex: 1,
          explanation: 'Intrinsic locks are reentrant; the JVM increments a per-thread hold count and only releases at zero.',
        },
      ],
    },
    {
      slug: 'inter-thread-communication',
      title: 'wait(), notify() & notifyAll()',
      order: 6,
      level: 'advanced',
      summary: 'Coordinating threads through an object\'s wait set: the guarded-block contract, lost wakeups, and producer-consumer.',
      subtopics: [
        {
          id: 'why-wait-exists',
          title: 'From busy waiting to the wait set',
          body: `A consumer that polls an empty buffer in a loop burns a core to learn nothing. That is **busy waiting**: correct but wasteful, and it starves real work on a loaded machine. The alternative is to park the thread until someone who can make progress says so.

\`wait()\`, \`notify()\`, and \`notifyAll()\` are declared on \`java.lang.Object\`, not on \`Thread\`, because the waiting area belongs to the object whose state is being awaited. Every object has a **wait set** in addition to its monitor. Calling \`obj.wait()\` atomically releases \`obj\`'s monitor, moves the current thread into \`obj\`'s wait set, and parks it in \`WAITING\`.

The atomicity of "release and park" is what makes the primitive usable: if the release and the park were separate, a notification arriving between them would be lost. The JVM does both as one step with respect to the monitor.

\`wait\` throws \`InterruptedException\` and \`IllegalMonitorStateException\` (if you do not own the monitor). Every wait is therefore a place where cancellation can arrive, and must be handled by the interruption contract rather than swallowed.`,
        },
        {
          id: 'wait-notify-contract',
          title: 'The wait/notify contract',
          body: `All three methods require that the calling thread **owns the object's monitor**, which in practice means calling them inside \`synchronized (obj)\`. Calling \`wait()\` without the lock throws \`IllegalMonitorStateException\` immediately — the runtime cannot safely release a lock you do not hold.

\`notify()\` picks **one arbitrary** thread from the wait set and moves it to the entry set, where it becomes \`BLOCKED\` until the notifier releases the monitor. Which thread is picked is unspecified; the JVM may choose the most recent waiter, and you must not depend on it. \`notifyAll()\` moves every waiter to the entry set, and they then compete for the lock one at a time.

A crucial detail: the awakened thread does not continue at the statement after \`wait()\` until it **reacquires** the monitor. So the notifier still holds the lock while it finishes its critical section, and the woken thread's view of the state is whatever the notifier left behind.

\`wait(long millis)\` gives up after a deadline and reacquires the lock, so a timeout does not mean the condition became true — the loop must re-check.`,
        },
        {
          id: 'guarded-blocks',
          title: 'Always wait in a while loop',
          body: `The canonical form is \`while (!condition) { obj.wait(); }\` — never \`if\`. The loop is not defensive style; it is required for correctness.

Three reasons. First, **spurious wakeups**: the JVM and the OS may wake a waiter without any notification; the spec permits it. Second, **barging**: after \`notifyAll\`, several threads wake and compete for the lock, and an unrelated thread may consume the condition before yours runs. Third, **multiple conditions on one monitor**: a single object's wait set may contain producers and consumers, so a consumer can be woken by a "buffer is no longer full" signal it does not care about.

The pattern is called a **guarded block**: the condition is the guard, the loop re-tests the guard, and \`wait\` is the yield point. The predicate must be read under the lock, which it is, because you can only call \`wait\` while holding it.

Corollary: never expose the guard as a plain unsynchronized field read from outside the lock. The condition and the wait must share one monitor, or the re-check is itself a data race.`,
        },
        {
          id: 'lost-wakeups',
          title: 'Lost wakeups, missed signals, and notifyAll',
          body: `A **lost wakeup** happens when a notification is delivered before the waiter is waiting, or to the wrong waiter, so a thread sleeps while the condition it needs is already true. With \`notify()\` this is common: the signal wakes a producer when the consumers needed it, or wakes a consumer whose guard is still false, which immediately re-waits while another consumer sleeps forever.

That is why the default should be \`notifyAll()\`, with \`notify()\` reserved for single-waiter designs you can prove. The cost of \`notifyAll\` is a thundering herd — every waiter wakes, competes for the lock, and most go back to sleep. For a small number of waiters this is cheap; for thousands it is a stampede, and that is a signal to move to \`Condition\` objects (one wait set per condition) or a \`BlockingQueue\`.

A second classic bug is signalling outside the lock. Calling \`notifyAll()\` after releasing the monitor opens a window where a thread checks the guard, sees false, and parks — and the signal has already been sent. The check and the signal must both happen while holding the same monitor.

Finally, \`notify()\` on an object with no waiters is a silent no-op. Nothing is remembered.`,
        },
        {
          id: 'producer-consumer',
          title: 'Producer-consumer with wait and notifyAll',
          body: `The bounded buffer is the reference problem: producers block when full, consumers block when empty, and both share one circular array. With intrinsic monitors, one lock and one wait set serve both conditions.

The structure is: acquire the lock, \`while (count == capacity) wait();\` then insert, increment, and \`notifyAll()\`. The consumer mirrors it: \`while (count == 0) wait();\` then remove, decrement, and \`notifyAll()\`. Using one wait set means a producer may wake another producer, which is wasteful but correct because the loop re-checks.

\`java.util.concurrent.BlockingQueue\` implements exactly this with two separate conditions, so \`put\` blocks producers and \`take\` blocks consumers without cross-waking. In production, use \`ArrayBlockingQueue\` and never hand-roll this — but you must be able to write it, because it is a standard interview exercise and it demonstrates whether you understand the wait/notify contract.

Watch for the classic mistakes: forgetting to notify after every state change, using \`if\` instead of \`while\`, and notifying while holding a different lock than the one guarding the buffer.`,
        },
      ],
      javaCode: [
        {
          title: 'Bounded buffer with wait/notifyAll',
          description:
            'One monitor guards both the array and the count; the while loops re-check the guard, and every state change notifies all waiters.',
          code: `public class BoundedBuffer<T> {
    private final Object[] items;
    private int head, tail, count;

    public BoundedBuffer(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
        this.items = new Object[capacity];
    }

    public synchronized void put(T item) throws InterruptedException {
        while (count == items.length) {
            wait();                          // buffer full: release lock and park
        }
        items[tail] = item;
        tail = (tail + 1) % items.length;
        count++;
        notifyAll();                         // state changed for consumers
    }

    @SuppressWarnings("unchecked")
    public synchronized T take() throws InterruptedException {
        while (count == 0) {
            wait();                          // buffer empty
        }
        T item = (T) items[head];
        items[head] = null;
        head = (head + 1) % items.length;
        count--;
        notifyAll();                         // state changed for producers
        return item;
    }

    public static void main(String[] args) throws InterruptedException {
        BoundedBuffer<Integer> buffer = new BoundedBuffer<>(4);

        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 20; i++) {
                    buffer.put(i);
                    System.out.println("produced " + i);
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }, "producer");

        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 20; i++) {
                    System.out.println("consumed " + buffer.take());
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }, "consumer");

        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}`,
        },
        {
          title: 'A one-shot handoff with wait/notify',
          description:
            'The minimal cooperation primitive: a worker waits for a value, the main thread publishes it and signals, and interruption is respected.',
          code: `public class Handoff<T> {
    private T value;
    private boolean available;

    public synchronized void publish(T v) {
        value = v;
        available = true;
        notifyAll();                          // inside the lock, always
    }

    public synchronized T await() throws InterruptedException {
        while (!available) {                  // guard, not an if
            wait();
        }
        return value;
    }

    public static void main(String[] args) throws InterruptedException {
        Handoff<String> handoff = new Handoff<>();

        Thread worker = new Thread(() -> {
            try {
                System.out.println("worker received: " + handoff.await());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("worker cancelled while waiting");
            }
        }, "waiter");

        worker.start();
        Thread.sleep(300);                    // simulate setup work
        handoff.publish("payload");
        worker.join();
    }
}`,
        },
        {
          title: 'Why notify() can hang: two waiters, one signal',
          description:
            'Two consumers waiting on one monitor; a single notify may wake the wrong one. notifyAll plus a guard makes it deterministic.',
          code: `public class NotifyTrap {
    private static final Object LOCK = new Object();
    private static boolean firstReady;
    private static boolean secondReady;

    public static void main(String[] args) throws InterruptedException {
        Thread first = new Thread(() -> {
            synchronized (LOCK) {
                while (!firstReady) {
                    try { LOCK.wait(); } catch (InterruptedException e) {
                        Thread.currentThread().interrupt(); return;
                    }
                }
                System.out.println("first condition met");
            }
        }, "first");

        Thread second = new Thread(() -> {
            synchronized (LOCK) {
                while (!secondReady) {
                    try { LOCK.wait(); } catch (InterruptedException e) {
                        Thread.currentThread().interrupt(); return;
                    }
                }
                System.out.println("second condition met");
            }
        }, "second");

        first.start();
        second.start();
        Thread.sleep(200);

        synchronized (LOCK) {
            firstReady = true;
            secondReady = true;
            LOCK.notifyAll();      // notify() would wake only one and starve the other
        }

        first.join();
        second.join();
    }
}`,
        },
      ],
      keyTakeaways: [
        'wait/notify live on Object because the wait set and monitor belong to the object being shared.',
        'wait() atomically releases the monitor and parks; notify() moves one arbitrary waiter to BLOCKED.',
        'Always re-check the condition in a while loop to survive spurious wakeups and barging.',
        'Signal inside the lock, and prefer notifyAll() unless you can prove there is a single waiter.',
        'BlockingQueue provides two conditions and should replace hand-written wait/notify in production.',
      ],
      interviewTips: [
        'Say "while, never if" immediately when asked about wait(); explain spurious wakeups and barging.',
        'Explain why these methods are on Object rather than Thread.',
        'Contrast notify() with notifyAll() in terms of lost wakeups versus thundering herd.',
        'Mention IllegalMonitorStateException as proof that wait requires ownership of the monitor.',
      ],
      pitfalls: [
        'Using if instead of while around wait().',
        'Calling notifyAll() outside the synchronized block, losing the signal.',
        'Using notify() with several waiters and stranding the others.',
        'Forgetting to notify after a state change, so waiters sleep forever.',
        'Swallowing InterruptedException inside the wait loop.',
      ],
      quiz: [
        {
          question: 'What happens when a thread calls wait() on an object?',
          options: [
            'It keeps the monitor and sleeps',
            'It releases the monitor, enters the wait set, and parks until notified or interrupted',
            'It releases the monitor immediately and returns from synchronized',
            'It throws InterruptedException only if interrupted before entering',
          ],
          answerIndex: 1,
          explanation: 'wait() atomically releases the monitor and parks the thread in the object\'s wait set.',
        },
        {
          question: 'Why must wait() be called inside a while loop?',
          options: [
            'To make the code slower and safer',
            'To handle spurious wakeups and re-check the condition after reacquiring the lock',
            'Because the compiler requires it',
            'To avoid IllegalMonitorStateException',
          ],
          answerIndex: 1,
          explanation: 'Spurious wakeups and competing waiters mean the condition may still be false on wakeup, so it must be re-tested.',
        },
      ],
    },
    {
      slug: 'explicit-locks',
      title: 'ReentrantLock, ReadWriteLock & Semaphore',
      order: 7,
      level: 'advanced',
      summary: 'The locks toolkit: timed and interruptible acquisition, multiple conditions, reader/writer separation, and permits.',
      subtopics: [
        {
          id: 'limits-of-synchronized',
          title: 'What synchronized cannot do',
          body: `\`synchronized\` is compact, exception-safe, and JIT-friendly, but it is also rigid. Four capabilities are simply missing, and each maps to a real production need.

First, there is no **timeout**: a thread blocked on a monitor waits forever unless another thread releases it. Second, there is no **non-blocking attempt**, so you cannot probe a lock and take an alternative path. Third, there is no way to **abandon** a wait — you cannot interrupt a thread blocked entering \`synchronized\`; interruption only works inside \`wait\`. Fourth, there is no **fairness** control, so a hot lock can starve a thread indefinitely.

Explicit locks in \`java.util.concurrent.locks\` add those four, plus multiple wait sets per lock (\`Condition\`) and the ability to acquire in one method and release in another — powerful and dangerous, because the JVM no longer guarantees release. You must write \`lock(); try { ... } finally { unlock(); }\` every time.

The rule of thumb: use \`synchronized\` by default, and reach for \`ReentrantLock\` when you need a timeout, an interruptible or attempted acquisition, fairness, or several conditions on one lock.`,
        },
        {
          id: 'reentrantlock',
          title: 'ReentrantLock: control in exchange for discipline',
          body: `\`ReentrantLock\` implements \`Lock\` and behaves like an intrinsic monitor with extra switches. It is reentrant (the hold count lives in an \`AbstractQueuedSynchronizer\` state field), it provides \`lock()\`, \`unlock()\`, \`tryLock()\`, \`tryLock(timeout, unit)\`, and \`lockInterruptibly()\`, and it can be constructed as \`new ReentrantLock(true)\` for a fair, FIFO queue.

Fairness costs throughput. A fair lock hands off to the longest waiter, which means more context switches and less batching; an unfair lock lets a running thread re-acquire immediately, exploiting warm caches. Use fair locks for latency-sensitive queues, not for hot counters.

\`lockInterruptibly()\` is the feature most people forget: it lets a blocked acquirer be cancelled, which is essential for shutdown paths. \`tryLock()\` supports deadlock avoidance — if the second lock is unavailable, release the first and retry later instead of blocking forever.

The mandatory discipline is the \`try/finally\` shape: acquire before \`try\`, release in \`finally\`. If \`unlock()\` is skipped on an exception, every future caller hangs, and the thread dump shows a lock nobody is making progress on. Also never unlock a lock you do not own — it throws \`IllegalMonitorStateException\`.`,
        },
        {
          id: 'conditions',
          title: 'Condition: multiple wait sets per lock',
          body: `\`lock.newCondition()\` returns a \`Condition\` with \`await()\`, \`signal()\`, and \`signalAll()\` — the explicit-lock analogue of \`wait\`/\`notify\`/\`notifyAll\`. The advantage is that one lock can host **several independent wait sets**, so producers and consumers no longer cross-wake each other.

A bounded buffer with \`notFull\` and \`notEmpty\` conditions signals only the side that can make progress. Compare that with a single monitor and \`notifyAll()\`, where every wakeup storms the lock and most threads immediately re-park.

The contract mirrors the monitor one: hold the lock when calling \`await\` or \`signal\`, re-check the predicate in a \`while\` loop, and handle \`InterruptedException\`. \`await\` releases the lock and reacquires it on return, exactly like \`wait\`. There are also \`awaitUninterruptibly()\`, \`awaitNanos\`, \`awaitUntil\`, and \`await(timeout, unit)\`, which returns \`false\` on timeout.

One important difference: a signal is **not** remembered. If no thread is awaiting when \`signal()\` is called, the signal is lost — the same as \`notify()\`. That is why the predicate, not the signal, must carry the state.`,
        },
        {
          id: 'readwrite-lock',
          title: 'ReadWriteLock: shared readers, exclusive writers',
          body: `\`ReentrantReadWriteLock\` maintains two locks over one state: the **read lock**, held simultaneously by any number of readers, and the **write lock**, held exclusively by one writer with no readers present. It pays off when reads vastly outnumber writes and the read sections are long enough for the extra bookkeeping to be negligible.

The failure mode is subtle: a naive implementation can starve writers, because a steady stream of readers keeps the read count above zero. The JDK's non-fair mode lets a queued writer block new readers to prevent that; fair mode is strictly FIFO but slower.

Two rules are non-negotiable. **Lock downgrading** is allowed (acquire write, then read, then release write, then release read); **upgrading** is not — taking the read lock and then trying to take the write lock deadlocks, because the read lock you hold prevents the write lock from being granted. And the read lock is not a way to protect a "read" that actually mutates (a lazy cache fill, a counter increment); that is a write.

For a cache where misses are rare, \`ConcurrentHashMap\` usually beats \`ReentrantReadWriteLock\`; for a large structure read in bulk, the read/write split can be a genuine win.`,
        },
        {
          id: 'stampedlock',
          title: 'StampedLock and optimistic reads',
          body: `\`StampedLock\` (Java 8) adds a third mode: **optimistic reading**. \`tryOptimisticRead()\` returns a stamp without acquiring anything, you read the fields as plain reads, then \`validate(stamp)\` tells you whether a writer intervened. If validation fails, you fall back to a real read lock.

This is attractive because an optimistic read costs no CAS on the lock state — it is a volatile read of the stamp plus a validation. For read-mostly structures, throughput can beat \`ReentrantReadWriteLock\` substantially.

Three constraints come with it. \`StampedLock\` is **not reentrant** — a second acquisition blocks forever. It is **not ownership-based**: there is no thread identity, so you must pass the same stamp to \`unlockRead\`/\`unlockWrite\`, and an invalid stamp is rejected. And optimistic reads are only safe if the fields you read are not torn across a write; copy them into locals and validate before use.

Also note that optimistic reads do not block writers at all, so long optimistic sections increase the chance of validation failure. Keep them short: read the fields, validate, then compute outside the guarded region.`,
        },
        {
          id: 'semaphore-and-latches',
          title: 'Semaphore, CountDownLatch, and CyclicBarrier',
          body: `A \`Semaphore\` holds a number of **permits**. \`acquire()\` takes one (blocking when none are left), \`release()\` returns one, and \`tryAcquire(timeout)\` gives up after a deadline. Nothing is owned by a thread, so a permit may be released by a different thread than the one that acquired it — useful for handoff protocols and dangerous when it hides a leak.

Semaphores model **resource pools**: at most N database connections, at most N concurrent downloads from a rate-limited API. \`new Semaphore(n, true)\` gives FIFO fairness. A binary semaphore (one permit) is a mutex that any thread may release, unlike a lock.

A \`CountDownLatch\` is a one-shot gate: \`new CountDownLatch(n)\`, workers call \`countDown()\`, and waiters call \`await()\` or \`await(timeout)\`. It cannot be reset, which makes it perfect for "start all threads at once" gates and "wait for N services to be ready" startup checks.

A \`CyclicBarrier\` is the reusable sibling: N parties meet at \`await()\`, then all proceed and the barrier resets. Use it for iterative parallel algorithms where each round must finish before the next begins. Neither primitive holds a lock; both park threads efficiently.`,
        },
      ],
      javaCode: [
        {
          title: 'ReentrantLock with timeout and fair acquisition',
          description:
            'tryLock returns false instead of blocking forever, and unlock always sits in a finally block.',
          code: `import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class LockedCounter {
    private final ReentrantLock lock = new ReentrantLock(true); // fair
    private long value;

    public boolean incrementWithin(long timeoutMs) throws InterruptedException {
        if (!lock.tryLock(timeoutMs, TimeUnit.MILLISECONDS)) {
            return false;                       // give up instead of hanging
        }
        try {
            value++;
            return true;
        } finally {
            lock.unlock();                      // mandatory
        }
    }

    public long value() {
        lock.lock();                            // reentrant: safe to nest
        try {
            return value;
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        LockedCounter counter = new LockedCounter();
        Thread[] workers = new Thread[4];
        for (int i = 0; i < workers.length; i++) {
            workers[i] = new Thread(() -> {
                try {
                    for (int j = 0; j < 10_000; j++) {
                        if (!counter.incrementWithin(100)) {
                            System.out.println("lock timed out");
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }, "worker-" + i);
            workers[i].start();
        }
        for (Thread t : workers) t.join();
        System.out.println("value = " + counter.value());
    }
}`,
        },
        {
          title: 'Two Conditions on one lock',
          description:
            'A bounded buffer with separate notFull and notEmpty conditions, so producers and consumers wake only the side that can progress.',
          code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionBuffer<T> {
    private final Deque<T> items = new ArrayDeque<>();
    private final int capacity;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public ConditionBuffer(int capacity) { this.capacity = capacity; }

    public void put(T item) throws InterruptedException {
        lock.lock();
        try {
            while (items.size() == capacity) notFull.await();
            items.addLast(item);
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }

    public T take() throws InterruptedException {
        lock.lock();
        try {
            while (items.isEmpty()) notEmpty.await();
            T item = items.removeFirst();
            notFull.signal();
            return item;
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        ConditionBuffer<Integer> buffer = new ConditionBuffer<>(2);
        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    buffer.put(i);
                    System.out.println("put " + i);
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) System.out.println("took " + buffer.take());
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}`,
        },
        {
          title: 'ReadWriteLock, StampedLock and a Semaphore pool',
          description:
            'A read-heavy cache with the read/write split, an optimistic StampedLock read of two fields, and permits limiting concurrent access.',
          code: `import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.concurrent.locks.StampedLock;

public class CacheAndPool {
    private final ReentrantReadWriteLock rw = new ReentrantReadWriteLock();
    private final StampedLock stamped = new StampedLock();
    private double x, y;
    private String cached;

    public String read() {
        rw.readLock().lock();                    // many readers in parallel
        try {
            return cached == null ? "miss" : cached;
        } finally {
            rw.readLock().unlock();
        }
    }

    public void write(String value) {
        rw.writeLock().lock();                   // exclusive
        try {
            cached = value;
        } finally {
            rw.writeLock().unlock();
        }
    }

    public double distanceFromOrigin() {
        long stamp = stamped.tryOptimisticRead(); // no lock acquired
        double cx = x, cy = y;                    // plain reads
        if (!stamped.validate(stamp)) {           // a writer intervened
            stamp = stamped.readLock();
            try {
                cx = x;
                cy = y;
            } finally {
                stamped.unlockRead(stamp);
            }
        }
        return Math.hypot(cx, cy);
    }

    public static void main(String[] args) throws InterruptedException {
        CacheAndPool demo = new CacheAndPool();
        demo.write("loaded");
        System.out.println(demo.read() + " / " + demo.distanceFromOrigin());

        Semaphore connections = new Semaphore(2, true);   // at most 2 concurrent users
        for (int i = 0; i < 4; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    connections.acquire();
                    try {
                        System.out.println("task " + id + " using a connection");
                        Thread.sleep(200);
                    } finally {
                        connections.release();         // always release
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }, "task-" + i).start();
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Explicit locks add timeouts, attempted and interruptible acquisition, fairness, and multiple conditions.',
        'Always use try/finally: the JVM will not release a Lock for you on exception.',
        'Condition objects give one lock several independent wait sets, avoiding cross-waking.',
        'ReadWriteLock allows concurrent readers and an exclusive writer; upgrading is illegal, downgrading is allowed.',
        'StampedLock optimistic reads are fast but non-reentrant and must be validated before use.',
      ],
      interviewTips: [
        'Open with the four limitations of synchronized, then map each to a Lock API.',
        'Explain fair versus non-fair acquisition in terms of throughput versus starvation.',
        'Describe Condition as "wait/notify with multiple wait sets attached to one lock".',
        'Mention that StampedLock is not reentrant and has no thread ownership.',
      ],
      pitfalls: [
        'Forgetting unlock() in a finally block, permanently leaking the lock.',
        'Unlocking a lock you never acquired, or unlocking twice.',
        'Trying to upgrade a read lock to a write lock, which deadlocks.',
        'Releasing a Semaphore permit twice, silently inflating the pool.',
        'Assuming StampedLock can replace synchronized everywhere; it is not reentrant.',
      ],
      quiz: [
        {
          question: 'Which capability does ReentrantLock provide that synchronized does not?',
          options: [
            'Mutual exclusion between threads',
            'Memory visibility for guarded fields',
            'A non-blocking tryLock() attempt',
            'Reentrancy for the owning thread',
          ],
          answerIndex: 2,
          explanation: 'Both are reentrant, exclusive, and provide visibility. Only Lock adds timed, interruptible, and attempted acquisition.',
        },
        {
          question: 'Why is a StampedLock optimistic read validated?',
          options: [
            'To check the thread still holds the lock',
            'To detect whether a writer modified the data between the stamp and the read',
            'To make the read reentrant',
            'To avoid IllegalMonitorStateException',
          ],
          answerIndex: 1,
          explanation: 'An optimistic read acquires nothing, so validate(stamp) is the only way to know the data was not changed concurrently.',
        },
      ],
    },
    {
      slug: 'atomics-and-cas',
      title: 'Atomic Variables & Compare-and-Swap',
      order: 8,
      level: 'advanced',
      summary: 'Lock-free counters and references built on the CPU compare-and-swap instruction, plus where they stop helping.',
      subtopics: [
        {
          id: 'atomic-classes',
          title: 'The java.util.concurrent.atomic family',
          body: `The \`atomic\` package provides \`AtomicInteger\`, \`AtomicLong\`, \`AtomicBoolean\`, \`AtomicReference<V>\`, and the array and field variants. Each wraps a single value and exposes compound operations as one indivisible step: \`incrementAndGet()\`, \`getAndAdd(delta)\`, \`compareAndSet(expect, update)\`, \`updateAndGet(fn)\`, \`accumulateAndGet(x, fn)\`.

They are the right tool for a **single hot variable** — a request counter, a sequence generator, a state flag, a lazily initialized reference. They are the wrong tool for an invariant spanning several fields: two atomics are two independent updates, and a reader can observe one updated and the other stale. That requires a lock or a single immutable object swapped atomically through \`AtomicReference\`.

All atomic reads and writes are \`volatile\`-grade: they establish happens-before edges, so surrounding plain writes are published correctly when read through the atomic.

The cost profile matters. An uncontended CAS is one locked instruction, comparable to a volatile write. Under heavy contention, CAS failures cause retries and cache-line ping-pong, so throughput can fall below a lock's. Measure before assuming "lock-free" means "faster".`,
        },
        {
          id: 'cas-contract',
          title: 'The compare-and-swap contract',
          body: `**Compare-and-swap** is a hardware primitive, exposed in Java as \`compareAndSet(expected, newValue)\`. Semantics: atomically inspect the memory location; if it still holds \`expected\`, replace it with \`newValue\` and report success; otherwise leave memory untouched and report failure. Nothing else can interleave inside that check-and-write.

That is the foundation of lock-free programming. An increment becomes a loop: read the current value, compute the new one, and CAS using the read value as the expectation. If someone else changed the value in between, the CAS fails and the loop re-reads — no lock, no blocking, no lost update.

On x86 the primitive is \`LOCK CMPXCHG\`; on ARM it is a load-linked/store-conditional pair. The JDK wraps these in \`VarHandle\` and \`Unsafe\`, and the \`Atomic\` classes are thin layers on top.

Two practical notes. First, CAS is only as good as the reference you compare: for objects, identity matters, so an equal-but-different instance fails the swap. Second, \`compareAndSet\` on \`AtomicInteger\` uses primitive \`int\` semantics with no boxing, while \`AtomicReference<Integer>\` compares references and does not behave as expected for values outside the cache range.`,
        },
        {
          id: 'references-and-updaters',
          title: 'AtomicReference and field updaters',
          body: `\`AtomicReference<V>\` applies CAS to object references, which enables a powerful idiom: represent state as an **immutable object** and swap the whole thing atomically. Instead of mutating three fields under a lock, build a new record with the changed field and CAS it in. Readers always see a consistent snapshot, and the code is naturally lock-free.

For performance, \`AtomicReferenceFieldUpdater\`, \`AtomicIntegerFieldUpdater\`, and \`AtomicLongFieldUpdater\` apply CAS to a \`volatile\` field of an existing object without wrapping every instance in an atomic object. This saves an allocation per node in large structures. The field must be \`volatile\` and accessible to the caller; violations fail at runtime.

Java 9 added \`VarHandle\`, which generalises the same idea to any field or array element with explicit memory-ordering modes: \`getAcquire\`, \`setRelease\`, \`compareAndExchange\`, \`getAndAdd\`, plus plain, opaque, and volatile variants. It is the modern replacement for \`Unsafe\` and the mechanism inside most of \`java.util.concurrent\`.

Reach for \`VarHandle\` only in library-grade code where you need an ordering weaker than full volatile. Application code should stay with \`Atomic\` classes, which are clearer and just as fast in practice.`,
        },
        {
          id: 'longadder',
          title: 'LongAdder: when one hot counter is the bottleneck',
          body: `A single \`AtomicLong\` incremented by many threads serialises on one cache line. Every successful CAS invalidates that line in every other core's cache, so throughput falls as cores increase — the counter becomes a contention point rather than a scalability aid.

\`LongAdder\` and \`DoubleAdder\` solve this by striping: a base value plus a \`Cell\` array, where each thread updates a different cell, padded to avoid false sharing. \`sum()\` walks the cells and adds them. Writes scale nearly linearly with cores; reads are slightly more expensive and are **not atomic** with respect to concurrent updates — \`sum()\` is a snapshot, not a linearizable read.

That trade-off defines the use case: metrics, statistics, event counts — high write rate, approximate or eventually consistent reads. It is not suitable for a sequence generator or anything requiring a precise \`getAndIncrement\` result.

\`LongAccumulator\` generalises it with an arbitrary associative function, for example \`new LongAccumulator(Long::max, Long.MIN_VALUE)\` for a lock-free running maximum.

Both live in \`java.util.concurrent.atomic\` and are the right default for counting across threads in modern Java.`,
        },
        {
          id: 'limits-of-lock-free',
          title: 'What atomics do not solve',
          body: `Lock-free is not a synonym for correct or fast. Atomics guarantee that **one** variable changes atomically; they say nothing about relationships between variables, and nothing about the order in which a thread's other writes become visible.

A multi-field invariant needs a different design: either one lock, or a single immutable state object swapped by CAS (a functional update), or a hybrid where the atomic is only a fast path and the lock handles the slow path.

Performance is also non-monotonic. Under low contention a CAS is cheaper than a lock, because it avoids the kernel and any park/unpark. Under high contention, CAS retries multiply: ten threads hammering one \`AtomicInteger\` may execute dozens of failed attempts per success, and the cache-line traffic can make the lock-based version faster. \`LongAdder\` exists precisely because of this curve.

Finally, atomics cannot block, so they cannot implement a wait. Building a queue or a latch on top of CAS requires parking (\`LockSupport.park\`) and careful handoff, which is exactly why \`java.util.concurrent\` collections exist and why you should not write your own.

Use atomics for single-variable state transitions; keep locks where the invariant spans fields.`,
        },
      ],
      javaCode: [
        {
          title: 'Atomic counter vs synchronized counter',
          description:
            'The same workload under a lock and under AtomicInteger. Both are correct; the atomic version never parks a thread.',
          code: `import java.util.concurrent.atomic.AtomicInteger;

public class CounterComparison {
    private static final AtomicInteger atomic = new AtomicInteger();
    private static int locked = 0;
    private static final Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable atomicTask = () -> {
            for (int i = 0; i < 200_000; i++) atomic.incrementAndGet();
        };
        Runnable lockedTask = () -> {
            for (int i = 0; i < 200_000; i++) {
                synchronized (LOCK) { locked++; }
            }
        };

        run(4, atomicTask);
        System.out.println("atomic = " + atomic.get());

        run(4, lockedTask);
        synchronized (LOCK) { System.out.println("locked = " + locked); }

        // compound operations that are genuinely atomic, no loop needed
        AtomicInteger seq = new AtomicInteger(10);
        System.out.println(seq.getAndIncrement() + " then " + seq.get());
        System.out.println(seq.updateAndGet(v -> v * 2));
    }

    private static void run(int threads, Runnable task) throws InterruptedException {
        Thread[] pool = new Thread[threads];
        for (int i = 0; i < threads; i++) {
            pool[i] = new Thread(task);
            pool[i].start();
        }
        for (Thread t : pool) t.join();
    }
}`,
        },
        {
          title: 'Immutable state swapped with AtomicReference',
          description:
            'A multi-field invariant held in a record, updated by CAS so readers never observe a half-applied change.',
          code: `import java.util.concurrent.atomic.AtomicReference;

public class AtomicStateMachine {
    record Connection(String host, int retries, boolean open) {}

    private final AtomicReference<Connection> state =
            new AtomicReference<>(new Connection("db.internal", 0, false));

    boolean open() {
        while (true) {
            Connection current = state.get();
            if (current.open()) return true;
            Connection next = new Connection(current.host(), current.retries() + 1, true);
            if (state.compareAndSet(current, next)) {      // identity comparison
                System.out.println("opened after " + next.retries() + " attempt(s)");
                return true;
            }
            // lost the race: re-read and retry
        }
    }

    Connection snapshot() { return state.get(); }

    public static void main(String[] args) throws InterruptedException {
        AtomicStateMachine machine = new AtomicStateMachine();
        Thread a = new Thread(machine::open, "connector-a");
        Thread b = new Thread(machine::open, "connector-b");
        a.start();
        b.start();
        a.join();
        b.join();
        System.out.println(machine.snapshot());
    }
}`,
        },
        {
          title: 'LongAdder for a contended metric',
          description:
            'Striped cells remove the hot cache line: writes scale across cores while sum() remains a non-atomic snapshot.',
          code: `import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.LongAdder;

public class MetricsDemo {
    private static final LongAdder requests = new LongAdder();
    private static final LongAdder bytes = new LongAdder();

    public static void main(String[] args) throws InterruptedException {
        int threads = 8;
        CountDownLatch ready = new CountDownLatch(threads);
        CountDownLatch go = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            new Thread(() -> {
                ready.countDown();
                try {
                    go.await();
                    for (int j = 0; j < 500_000; j++) {
                        requests.increment();
                        bytes.add(512);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            }, "metric-" + i).start();
        }

        ready.await();
        go.countDown();
        done.await();

        System.out.println("requests = " + requests.sum());
        System.out.println("bytes    = " + bytes.sum());
        requests.reset();                 // only safe when no writers are active
        System.out.println("after reset = " + requests.sum());
    }
}`,
        },
      ],
      keyTakeaways: [
        'Atomics make one variable\'s compound operations indivisible without locks or parking.',
        'CAS compares the current value with an expected value and swaps only on a match, atomically in hardware.',
        'Use AtomicReference with immutable state objects for multi-field invariants, not several independent atomics.',
        'LongAdder trades precise reads for scalable striped writes — ideal for metrics.',
        'Lock-free is not automatically faster: contention causes CAS retries and cache-line ping-pong.',
      ],
      interviewTips: [
        'Describe CAS with its three operands (address, expected, new) and note it returns success or failure.',
        'Explain incrementAndGet as a CAS retry loop, not as magic.',
        'Recommend AtomicReference plus an immutable state object for multi-field updates.',
        'Bring up LongAdder when asked how to scale a hot counter.',
      ],
      pitfalls: [
        'Using two atomics to guard a single invariant, allowing readers to see a half-update.',
        'Assuming AtomicReference<Integer> compares values rather than references.',
        'Using an AtomicInteger for a pure metric where a LongAdder would scale better.',
        'Calling reset() on an adder while writers are still active and expecting an exact count.',
        'Believing lock-free code cannot livelock or starve.',
      ],
      quiz: [
        {
          question: 'What does compareAndSet(expected, update) return when the field no longer equals expected?',
          options: [
            'It sets the field to update and returns true',
            'It leaves the field unchanged and returns false',
            'It throws IllegalStateException',
            'It retries internally until it succeeds',
          ],
          answerIndex: 1,
          explanation: 'CAS is a single attempt: on mismatch nothing is written and the caller gets false, which is why retry loops exist.',
        },
        {
          question: 'Why is LongAdder faster than AtomicLong under heavy write contention?',
          options: [
            'It uses a lock internally',
            'It spreads updates across cells so threads do not fight over one cache line',
            'It caches the result and skips writes',
            'It uses 128-bit arithmetic',
          ],
          answerIndex: 1,
          explanation: 'Striping reduces contention on a single memory location; sum() then aggregates cells, which is why reads are not atomic.',
        },
      ],
    },
    {
      slug: 'cas-retry-and-aba',
      title: 'CAS Retry Loops & the ABA Problem',
      order: 9,
      level: 'expert',
      summary: 'Writing correct lock-free loops, building a Treiber stack, and why a value returning to its old state can corrupt a CAS.',
      subtopics: [
        {
          id: 'retry-loop',
          title: 'The CAS retry loop',
          body: `Every lock-free update follows the same skeleton: **read**, **compute**, **attempt**, **retry on failure**. The read must capture the exact value you will pass as the expectation; the compute must be a pure function of that snapshot; the CAS must use the snapshot, not a fresh re-read.

The pseudocode is short but every line matters:

\`\`\`
while (true) {
    V current = ref.get();
    V next = compute(current);
    if (ref.compareAndSet(current, next)) return next;
}
\`\`\`

The correctness argument is worth internalising: if the CAS succeeds, the state at the moment of the swap is exactly \`current\`, so \`next\` is a valid successor of the value you based your computation on. If it fails, someone else's update landed and you must recompute from the new state — never retry with the old \`next\` and a stale expectation.

The loop is **optimistic**: no lock, no blocking, and progress as long as some thread succeeds. Under contention it can spin, burn CPU, and thrash cache lines. Production code adds a backoff (\`Thread.onSpinWait()\`, or a bounded retry followed by a lock fallback) to prevent a livelock-shaped meltdown.

Never put externally visible side effects inside the loop — they may execute multiple times. Logging in a retry loop is a classic way to produce duplicate audit records.`,
        },
        {
          id: 'treiber-stack',
          title: 'A lock-free stack (Treiber)',
          body: `The Treiber stack is the smallest useful lock-free structure: a single \`AtomicReference\` to the head node, where each node holds a value and a \`next\` pointer. \`push\` CASes a new node in; \`pop\` CASes the head to \`head.next\`.

\`push\` is straightforward: read head, build \`new Node(v, head)\`, CAS head from \`head\` to the new node, retry if someone else pushed first. \`pop\` reads head, reads \`head.next\`, and CASes head from \`head\` to \`next\`. The ABA hazard is concentrated in \`pop\`, because the \`next\` pointer may refer to a node that has been popped and reused by another thread.

The structure is genuinely lock-free: a stalled thread cannot prevent others from completing. But it is not **wait-free**, and it is not safe for arbitrary reuse without hazard pointers or a versioned reference, because a reclaimed node can be resurrected by an old CAS.

Practical guidance: use \`ConcurrentLinkedDeque\` or \`ConcurrentLinkedQueue\` rather than writing your own. Study Treiber to understand the mechanics and the ABA problem; ship a JDK collection.`,
        },
        {
          id: 'aba',
          title: 'The ABA problem',
          body: `CAS asks "is the value still what I read?" — not "has anything happened since I read it?". That gap is the **ABA problem**.

Thread 1 reads the head pointer, which points at node A, and is preempted. Thread 2 pops A, pops B, then pushes A back (or a recycled node at the same address). The head points at A again, but \`A.next\` is different. Thread 1 resumes, sees the expected reference A, and its CAS succeeds — installing a stale \`next\` and corrupting the stack, or resurrecting a freed node.

The pattern is not exotic: it appears in stacks, queues, and any structure that recycles nodes. A monotonic counter is immune, but a "decrement then increment" sequence is not.

Two conditions are required: the value must return to a previously observed state, and the algorithm must depend on more than the value itself (a pointer, a version, a set of fields). If both hold, ABA is possible and you need versioning or reclamation control.

Note that ABA is not always harmful — a push/pop/push where nothing else changed may be benign — which is why detecting it requires reasoning about the structure, not about the value.`,
        },
        {
          id: 'stamped-reference',
          title: 'AtomicStampedReference and AtomicMarkableReference',
          body: `The JDK's standard answer to ABA is \`AtomicStampedReference<V>\`: it pairs the reference with an \`int\` **stamp** and CASes both together. \`compareAndSet(expectedRef, newRef, expectedStamp, newStamp)\` fails if the stamp moved, so a value that cycles back to A still fails because its stamp advanced.

\`AtomicMarkableReference<V>\` uses a boolean instead of an int — for "has this node been logically deleted?" flags rather than version counting.

Both wrap the pair in an immutable holder and CAS the holder, because Java cannot atomically update two independent fields. That indirection is the cost: an allocation per update plus slightly more memory traffic.

The stamp must be advanced on **every** mutation, including ones that do not change the reference. Forgetting to bump the stamp when the reference is reinstalled is the classic way to leave ABA unsolved while believing it is fixed.

For high-performance structures the alternative is **hazard pointers** or epoch-based reclamation, which prevent memory from being reused while a thread might still hold it. Java has no first-class hazard pointers, so immutable snapshots and versioned references are the practical workaround.`,
        },
        {
          id: 'lock-free-progress',
          title: 'Progress guarantees and when to stop',
          body: `Three levels of progress matter when evaluating a concurrent algorithm. **Blocking**: a stalled thread can halt everyone. **Lock-free**: at least one thread always makes progress, though an individual thread can starve. **Wait-free**: every thread completes in a bounded number of steps.

CAS loops are lock-free, not wait-free. A scheduler that always lets the same thread win can starve the others indefinitely; that is a liveness bug no amount of correctness reasoning fixes.

Practical ceilings: if the critical section is one arithmetic operation, atomics win. If it involves multiple fields, I/O, allocation, or a callback, a lock is simpler and often faster because it parks rather than spins. If contention is high and the operation is a counter, stripe it with \`LongAdder\`. If the structure is a queue or map, use the JDK's, which is the product of years of tuning.

The professional heuristic: choose the simplest primitive that satisfies the invariant, measure under realistic contention, and only drop to lock-free when profiling proves the lock is the bottleneck. Most "we went lock-free for performance" stories end with a subtler bug and no measurable gain.`,
        },
      ],
      javaCode: [
        {
          title: 'A hand-written CAS retry loop',
          description:
            'Read, compute, attempt, retry — with a bounded attempt count so a pathological contention spike cannot spin forever.',
          code: `import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicLong;

public class CasLoop {
    private static final AtomicLong highWaterMark = new AtomicLong(Long.MIN_VALUE);

    static boolean raiseTo(long candidate) {
        for (int attempt = 0; attempt < 1_000; attempt++) {
            long current = highWaterMark.get();
            if (candidate <= current) return true;          // nothing to do
            if (highWaterMark.compareAndSet(current, candidate)) {
                return true;                                // won the race
            }
            Thread.onSpinWait();                            // politeness hint
        }
        return false;                                       // caller may fall back to a lock
    }

    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[4];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 100_000; j++) {
                    raiseTo(ThreadLocalRandom.current().nextLong(1_000_000));
                }
            }, "cas-" + i);
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        System.out.println("max observed = " + highWaterMark.get());
    }
}`,
        },
        {
          title: 'Treiber stack: push and pop with CAS',
          description:
            'Head-pointer CAS makes push and pop lock-free. Read pop carefully: versioning is what protects it against ABA.',
          code: `import java.util.concurrent.atomic.AtomicReference;

public class TreiberStack<T> {
    private static final class Node<T> {
        final T value;
        final Node<T> next;
        Node(T value, Node<T> next) { this.value = value; this.next = next; }
    }

    private final AtomicReference<Node<T>> head = new AtomicReference<>();

    public void push(T value) {
        Node<T> current;
        Node<T> newNode;
        do {
            current = head.get();
            newNode = new Node<>(value, current);
        } while (!head.compareAndSet(current, newNode));
    }

    public T pop() {
        Node<T> current;
        Node<T> next;
        do {
            current = head.get();
            if (current == null) return null;
            next = current.next;
        } while (!head.compareAndSet(current, next));
        return current.value;
    }

    public static void main(String[] args) throws InterruptedException {
        TreiberStack<Integer> stack = new TreiberStack<>();
        Thread producer = new Thread(() -> {
            for (int i = 0; i < 1_000; i++) stack.push(i);
        });
        producer.start();
        producer.join();

        int popped = 0;
        while (stack.pop() != null) popped++;
        System.out.println("popped " + popped + " items");
    }
}`,
        },
        {
          title: 'Defeating ABA with AtomicStampedReference',
          description:
            'The stamp advances on every swap, so a value that cycles back to its old reference still fails the CAS.',
          code: `import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.atomic.AtomicStampedReference;

public class AbaDemo {
    public static void main(String[] args) throws InterruptedException {
        // ---------- plain reference: ABA goes unnoticed ----------
        AtomicReference<String> plain = new AtomicReference<>("A");
        plain.compareAndSet("A", "B");
        plain.compareAndSet("B", "A");
        System.out.println("plain CAS A->C: " + plain.compareAndSet("A", "C")
                + " (the value cycled A->B->A behind our back)");

        // ---------- stamped reference: the version catches it ----------
        AtomicStampedReference<String> ref = new AtomicStampedReference<>("A", 0);

        Thread t1 = new Thread(() -> {
            int[] stampHolder = new int[1];
            String observed = ref.get(stampHolder);      // reads "A" and stamp 0
            int observedStamp = stampHolder[0];
            sleep(300);                                  // pause while t2 mutates

            boolean ok = ref.compareAndSet(observed, "C", observedStamp, observedStamp + 1);
            System.out.println("t1 CAS succeeded = " + ok
                    + ", current = " + ref.getReference());
        }, "t1");

        Thread t2 = new Thread(() -> {
            sleep(100);
            int stamp = ref.getStamp();
            ref.compareAndSet("A", "B", stamp, stamp + 1); // A -> B
            stamp = ref.getStamp();
            ref.compareAndSet("B", "A", stamp, stamp + 1); // B -> A, stamp is now 2
            System.out.println("t2 cycled the value back to A");
        }, "t2");

        t1.start();
        t2.start();
        t1.join();
        t2.join();
    }

    private static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'A CAS loop must reuse the value it read as the expectation, and recompute after every failure.',
        'Keep externally visible side effects out of retry loops — they may run more than once.',
        'The Treiber stack shows the shape of lock-free structures and where ABA bites.',
        'ABA means the value returned to its old state while the structure changed underneath.',
        'AtomicStampedReference adds a version so any intervening mutation fails the swap.',
      ],
      interviewTips: [
        'Write the read-compute-CAS loop from memory; it is the expected answer to "implement a lock-free counter".',
        'Explain ABA with a concrete sequence: read A, someone does A to B to A, the CAS falsely succeeds.',
        'Mention that lock-free is not wait-free, and that starvation remains possible.',
        'Say hazard pointers or epoch reclamation when asked about memory reuse, not just stamps.',
      ],
      pitfalls: [
        'Re-reading the value inside the CAS argument, which defeats the retry loop.',
        'Performing logging or remote calls inside the loop and duplicating them on retries.',
        'Forgetting to bump the stamp when reinstalling the same reference.',
        'Unbounded spinning under contention with no backoff or fallback.',
        'Assuming a lock-free structure is safe when a node is freed and reused.',
      ],
      quiz: [
        {
          question: 'In a CAS retry loop, what should happen after compareAndSet returns false?',
          options: [
            'Return the previously computed value',
            'Re-read the current value and recompute from it',
            'Throw an exception',
            'Sleep for one second and retry with the same value',
          ],
          answerIndex: 1,
          explanation: 'A failure means the state moved; retrying with the stale expectation would fail forever, so you must re-read and recompute.',
        },
        {
          question: 'Thread 1 reads pointer A, thread 2 pops A and B then pushes A back, then thread 1 CASes. What is the risk?',
          options: [
            'The CAS always fails, so nothing happens',
            'The CAS succeeds and installs a stale next pointer, corrupting the structure',
            'The JVM throws ConcurrentModificationException',
            'Thread 1 blocks until thread 2 finishes',
          ],
          answerIndex: 1,
          explanation: 'The reference matches again, so CAS succeeds even though the structure changed — that is ABA, fixed by version stamps.',
        },
      ],
    },
    {
      slug: 'executor-framework',
      title: 'Executor Framework, Thread Pools & Future',
      order: 10,
      level: 'advanced',
      summary: 'Decoupling task submission from thread management: pool sizing, bounded queues, rejection policies, and Future results.',
      subtopics: [
        {
          id: 'why-pools',
          title: 'Why "new Thread" does not scale',
          body: `Creating a thread is expensive. The JVM must ask the OS for a native thread, reserve a stack (often 1 MB of address space), allocate JVM bookkeeping, and register it with the scheduler. Teardown costs the reverse. For a request that lives 20 ms, that overhead can dominate the work.

Unbounded creation is worse than slow: it is a denial-of-service on yourself. A traffic spike spawns thousands of threads, each reserving a stack, until you hit the native thread limit and get \`OutOfMemoryError: unable to create native thread\`. Long before that, context switching eats the CPU and latency collapses for every request.

A **thread pool** fixes both by reusing a fixed set of workers. Workers take tasks from a queue, run them, and return for the next one. Thread count becomes a capacity decision you make deliberately rather than a side effect of load.

The sizing rule of thumb: for CPU-bound work, threads ≈ cores (or cores + 1). For I/O-bound work, threads ≈ cores × (1 + wait time / compute time), which is why a database-heavy service may want dozens of threads per core — or, in Java 21, virtual threads instead of a bigger pool.`,
        },
        {
          id: 'executor-hierarchy',
          title: 'Executor, ExecutorService, ThreadPoolExecutor',
          body: `The hierarchy is small and worth memorising. \`Executor\` declares one method, \`execute(Runnable)\`, and nothing else — it is the "run this somewhere" abstraction. \`ExecutorService\` extends it with lifecycle (\`shutdown\`, \`shutdownNow\`, \`awaitTermination\`) and submission (\`submit\`, \`invokeAll\`, \`invokeAny\`). \`ScheduledExecutorService\` adds delayed and periodic execution. \`ThreadPoolExecutor\` is the concrete engine, and the \`Executors\` factory is just a convenience layer over it.

\`Executors\` offers \`newFixedThreadPool(n)\`, \`newCachedThreadPool()\`, \`newSingleThreadExecutor()\`, \`newScheduledThreadPool(n)\`, and \`newWorkStealingPool()\`. They look friendly, and two of them are dangerous in production: fixed and single-threaded pools use an **unbounded** \`LinkedBlockingQueue\`, so a slow consumer turns into unbounded memory growth until the JVM dies. Cached pools are unbounded in *threads*, which is the native-thread exhaustion path.

The professional move is to construct \`ThreadPoolExecutor\` directly with an explicit bounded queue, an explicit rejection policy, a named \`ThreadFactory\`, and a sensible keep-alive. That is four lines and it makes the failure mode "reject with a clear signal" instead of "die slowly".`,
        },
        {
          id: 'pool-sizing',
          title: 'Core size, max size, queue, keep-alive',
          body: `\`ThreadPoolExecutor\` decides what to do with a task in a fixed order. If fewer than \`corePoolSize\` threads exist, create one. Otherwise try to enqueue. If the queue is full and fewer than \`maximumPoolSize\` threads exist, create another. Otherwise invoke the rejection handler.

That order surprises people: with an unbounded queue, \`maximumPoolSize\` is never reached, because the queue never rejects. This is why a fixed pool's "max" is decorative. With a small bounded queue, the pool grows to max quickly and then rejects — the intended behaviour for back-pressure.

\`keepAliveTime\` retires threads above the core size when idle. \`allowCoreThreadTimeOut(true)\` lets even core threads expire, useful for bursty services. \`prestartAllCoreThreads()\` avoids paying creation cost on the first request.

Choose the queue deliberately: \`ArrayBlockingQueue\` for a fixed bound, \`LinkedBlockingQueue\` with a capacity for a softer bound, \`SynchronousQueue\` for direct handoff (the cached-pool model), \`PriorityBlockingQueue\` for priority work. A bounded queue plus a rejection policy is the single most effective protection against overload.`,
        },
        {
          id: 'rejection-policies',
          title: 'Rejection policies and back-pressure',
          body: `When the pool and queue are saturated, the **rejected execution handler** decides. The four built-ins are \`AbortPolicy\` (throw \`RejectedExecutionException\`), \`CallerRunsPolicy\` (run the task on the submitting thread), \`DiscardPolicy\` (silently drop), and \`DiscardOldestPolicy\` (drop the head of the queue and retry).

\`AbortPolicy\` is the default and usually the right choice, because an exception is a signal you can log, count, and translate into an HTTP 503. \`CallerRunsPolicy\` provides natural back-pressure: the producer slows down because it is now doing the work, which throttles upstream without dropping anything. It is popular for batch importers and dangerous for latency-critical request threads, where it can blow the response budget.

\`DiscardPolicy\` is almost always a bug; it fails silently, and you discover it when a customer's order never processed. If you must drop work, drop it explicitly with a metric and a log line.

There is a fifth option that is often best: a custom handler that blocks the caller until space frees up (\`queue.put(task)\`), giving strict back-pressure with no loss. Combine it with a timeout so a dead consumer cannot hang the producer forever.`,
        },
        {
          id: 'future-and-callable',
          title: 'submit(), Callable, and Future',
          body: `\`submit\` accepts a \`Runnable\` or a \`Callable\` and returns a \`Future\`. For a \`Runnable\`, \`get()\` returns \`null\`; for a \`Callable\`, it returns the computed value. Crucially, \`submit\` captures exceptions instead of printing them — an uncaught exception in a submitted task is stored in the \`Future\` and rethrown as \`ExecutionException\` from \`get()\`.

That behaviour is a double-edged sword. It means failures are silent unless someone calls \`get()\`. Fire-and-forget tasks that throw will vanish. If you do not need the result, either call \`get()\` eventually, wrap the body in try/catch, or use \`execute\` with an uncaught exception handler.

\`Future\` offers \`get()\`, \`get(timeout, unit)\`, \`isDone()\`, \`isCancelled()\`, and \`cancel(mayInterruptIfRunning)\`. A timed \`get\` throws \`TimeoutException\` but does **not** stop the task — you must cancel it yourself, and cancellation only works if the task cooperates with interruption.

Batch helpers are often overlooked: \`invokeAll\` submits a collection and returns futures in the same order, blocking until all complete; \`invokeAny\` returns the first successful result and cancels the rest — ideal for hedging the same query against several replicas.`,
        },
        {
          id: 'shutdown',
          title: 'Shutdown: graceful, then forced',
          body: `A pool holds non-daemon threads, so an application that forgets to shut it down never exits. \`shutdown()\` stops accepting new tasks and lets queued ones finish; \`shutdownNow()\` drains the queue into a returned \`List<Runnable>\`, interrupts running tasks, and stops accepting.

The graceful pattern is \`shutdown()\`, then \`awaitTermination(timeout)\`, then \`shutdownNow()\` if the deadline passes. That gives in-flight work a chance to finish and bounds the total wait. \`awaitTermination\` returns a boolean — check it, or you will silently leak threads.

Interruption-based cancellation only works if tasks honour it: a task that ignores the interrupt flag, or blocks in an uninterruptible call, keeps running after \`shutdownNow\`. That is one more argument for the interruption contract from the thread-methods topic.

Two more details: \`shutdown()\` is idempotent, and any submission after shutdown is rejected with \`RejectedExecutionException\`. In frameworks, bind the pool lifecycle to application startup/shutdown hooks (or a \`try-with-resources\` on \`ExecutorService\`, which is \`AutoCloseable\` since Java 19) so tests and redeploys do not accumulate orphaned pools.`,
        },
      ],
      javaCode: [
        {
          title: 'Fixed pool with Callable and Future',
          description:
            'submit returns immediately; get blocks for the result, and ExecutionException unwraps the real failure.',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ExecutorBasics {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(4);
        try {
            List<Future<Long>> futures = new ArrayList<>();
            for (int i = 1; i <= 4; i++) {
                final long n = i;
                Callable<Long> task = () -> {
                    long sum = 0;
                    for (long k = n; k <= 1_000_000; k += n) sum += k;   // partial sum
                    return sum;
                };
                futures.add(pool.submit(task));
            }

            long total = 0;
            for (Future<Long> future : futures) {
                try {
                    total += future.get();                 // blocks until done
                } catch (ExecutionException e) {
                    System.out.println("task failed: " + e.getCause());
                }
            }
            System.out.println("total = " + total);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            pool.shutdown();
        }
    }
}`,
        },
        {
          title: 'A bounded pool with a named factory and back-pressure',
          description:
            'ArrayBlockingQueue bounds the backlog, CallerRunsPolicy throttles the producer, and the factory names threads for dumps.',
          code: `import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class BoundedPool {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger seq = new AtomicInteger();
        ThreadFactory factory = runnable -> {
            Thread t = new Thread(runnable, "orders-" + seq.incrementAndGet());
            t.setDaemon(false);
            return t;
        };

        ThreadPoolExecutor pool = new ThreadPoolExecutor(
                4,                                       // core
                8,                                       // max
                60, TimeUnit.SECONDS,                    // idle keep-alive
                new ArrayBlockingQueue<>(100),           // bounded backlog
                factory,
                new ThreadPoolExecutor.CallerRunsPolicy() // back-pressure, no loss
        );

        for (int i = 0; i < 500; i++) {
            final int id = i;
            pool.execute(() -> {
                try {
                    Thread.sleep(5);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        pool.shutdown();
        if (!pool.awaitTermination(10, TimeUnit.SECONDS)) {
            System.out.println("forcing shutdown after timeout");
            pool.shutdownNow();
        }
        System.out.println("pool size at end = " + pool.getPoolSize());
    }
}`,
        },
        {
          title: 'invokeAll with a deadline, then cancel',
          description:
            'invokeAll returns when every task finishes or the timeout expires; unfinished futures are already cancelled.',
          code: `import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class BatchExecution {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(3);
        try {
            List<Callable<String>> tasks = List.of(
                    () -> { Thread.sleep(100); return "fast"; },
                    () -> { Thread.sleep(400); return "medium"; },
                    () -> { Thread.sleep(5_000); return "slow"; }
            );

            List<Future<String>> results = pool.invokeAll(tasks, 1, TimeUnit.SECONDS);
            for (Future<String> future : results) {
                if (future.isCancelled()) {
                    System.out.println("cancelled (deadline hit)");
                } else {
                    try {
                        System.out.println("result = " + future.get());
                    } catch (ExecutionException e) {
                        System.out.println("failed: " + e.getCause());
                    }
                }
            }
        } finally {
            pool.shutdownNow();
            pool.awaitTermination(2, TimeUnit.SECONDS);
        }
    }
}`,
        },
      ],
      keyTakeaways: [
        'Thread creation is expensive and unbounded creation is a self-inflicted denial of service.',
        'Executor -> ExecutorService -> ThreadPoolExecutor; Executors factories hide unbounded queues.',
        'ThreadPoolExecutor grows to max only when the queue rejects, so an unbounded queue makes max useless.',
        'A bounded queue plus CallerRunsPolicy or AbortPolicy turns overload into controlled back-pressure.',
        'shutdown() drains, shutdownNow() interrupts; always await termination and check the result.',
      ],
      interviewTips: [
        'Explain the task-admission order: core threads, then queue, then max threads, then rejection.',
        'Say why Executors.newFixedThreadPool is risky in production — the unbounded queue.',
        'Distinguish Runnable from Callable, and note that submit captures exceptions in the Future.',
        'Mention that a timed get() does not cancel the task; cancellation requires cooperation.',
      ],
      pitfalls: [
        'Using an unbounded queue and believing maximumPoolSize protects you.',
        'Forgetting shutdown(), so the JVM never exits or tests leak pools.',
        'Ignoring the result of awaitTermination and assuming tasks finished.',
        'Dropping work with DiscardPolicy and losing it silently.',
        'Calling get() on a pool thread waiting for another task in the same small pool, causing starvation deadlock.',
      ],
      quiz: [
        {
          question: 'With corePoolSize 4, maximumPoolSize 8 and an unbounded LinkedBlockingQueue, how many threads will exist under load?',
          options: ['Always 8', 'At most 4, because tasks queue instead of growing the pool', 'Exactly 4 until the queue is full', 'Unbounded'],
          answerIndex: 1,
          explanation: 'An unbounded queue never rejects, so the pool never needs to grow beyond core size.',
        },
        {
          question: 'What does future.get() throw when the task threw an exception?',
          options: ['The original checked exception', 'ExecutionException wrapping the cause', 'IllegalStateException', 'It returns null'],
          answerIndex: 1,
          explanation: 'Submit captures the throwable; get() rethrows it wrapped in ExecutionException, so always inspect getCause().',
        },
      ],
    },
    {
      slug: 'completablefuture-forkjoin-threadlocal-and-virtual-threads',
      title: 'CompletableFuture, ForkJoin, ThreadLocal & Virtual Threads',
      order: 11,
      level: 'expert',
      summary: 'Composable async pipelines, work-stealing parallelism, thread-scoped state, and Java 21 lightweight threads.',
      subtopics: [
        {
          id: 'completablefuture',
          title: 'CompletableFuture: composing instead of blocking',
          body: `\`Future.get()\` is a blocking read of a single result, with no way to say "when this finishes, do that". Three dependent \`get()\` calls are no faster than sequential code. \`CompletableFuture<T>\` implements \`Future<T>\` and \`CompletionStage<T>\`, adding non-blocking composition.

The core verbs: \`thenApply\` maps a value, \`thenCompose\` flattens a call that itself returns a future (the \`flatMap\` of async), \`thenAccept\` consumes without returning, \`thenRun\` ignores the value, \`thenCombine\` merges two independent futures, \`allOf\` waits for many, and \`anyOf\` takes the first to finish.

Two suffixes matter. \`...Async\` runs the continuation on \`ForkJoinPool.commonPool()\` (or a supplied executor) instead of the completing thread, which is what you want for CPU work but not for a cheap transform, where the extra hop costs more than it saves. And \`thenApply\` runs on whichever thread completed the previous stage — a subtle fact that determines whether your "async" pipeline is actually parallel.

Completion is a graph, not a queue: stages registered on an incomplete future are stored and triggered when it completes, and each stage can complete exactly once.`,
        },
        {
          id: 'cf-errors-and-executors',
          title: 'Errors, timeouts, and choosing an executor',
          body: `\`CompletableFuture\` has two failure channels — exceptional completion and cancellation — and both silently swallow errors if you never look. Always terminate a pipeline with an exception handler: \`exceptionally(fn)\` maps a throwable to a fallback value, \`handle((v, t) -> ...)\` sees both, and \`whenComplete\` observes without transforming.

Java 9 added the safety net you actually want: \`completeOnTimeout(value, time, unit)\` supplies a default after a deadline, and \`orTimeout(time, unit)\` completes exceptionally with \`TimeoutException\`. Both are far cleaner than racing a \`ScheduledExecutorService\`.

Never run blocking I/O on the common pool. \`ForkJoinPool.commonPool()\` has \`cores - 1\` threads and is shared by every parallel stream and every \`...Async\` stage in the JVM. One blocking call there can starve unrelated code, including library internals. Pass an explicit executor: \`supplyAsync(supplier, ioPool)\`.

Also: a \`CompletableFuture\` never throws at the call site. If nobody inspects it, a failed stage is invisible. Treat an unhandled future the same as an ignored exception — log it in \`whenComplete\` at the boundary of your service.`,
        },
        {
          id: 'forkjoin',
          title: 'ForkJoinPool and work stealing',
          body: `\`ForkJoinPool\` is built for **divide and conquer**. A task splits itself into subtasks (\`fork\`), waits for their results (\`join\`), and combines them. The canonical shapes are \`RecursiveTask<V>\` for a value and \`RecursiveAction\` for a void operation, with a threshold below which the task computes directly.

The innovation is the **work-stealing** scheduler. Each worker owns a double-ended queue and pushes its forks onto one end. When a worker's deque is empty, it steals from the *opposite* end of another worker's deque. Stealing the oldest task maximises the chance of grabbing a large chunk, which keeps the steals few and the load balanced. Idle cores do not sit still; they take work.

Locality comes from LIFO execution of your own tasks: the subtask you forked last is the one most likely still in cache.

Two practical caveats. First, \`join\` inside a fork-join task does not block the thread — it helps by running other tasks while waiting, which is why this design avoids the thread-starvation deadlocks of a fixed pool. Second, that magic only works for \`ForkJoinTask\`; a plain blocking call inside the pool still blocks a worker, so keep I/O out of it.

Java 8's parallel streams and \`Arrays.parallelSort\` run on the same common pool, which is why blocking inside a \`parallelStream\` is doubly bad.`,
        },
        {
          id: 'threadlocal',
          title: 'ThreadLocal and the leak hiding in pools',
          body: `\`ThreadLocal<T>\` gives each thread its own copy of a value. \`set\` writes into a map stored **on the Thread object** (keyed weakly by the \`ThreadLocal\` instance), and \`get\` reads from it. No synchronization, no contention, no sharing — ideal for per-request context, transaction handles, or non-thread-safe formatters.

The classic pattern is \`ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"))\`, which is safe because each thread gets its own instance. \`InheritableThreadLocal\` copies the value into child threads at creation time, which is a different tool with different hazards.

The trap is **thread pools**. A pool thread lives for hours and serves thousands of requests. If a request sets a \`ThreadLocal\` and never clears it, the value stays attached to that thread and the next request sees stale data — a cross-request data leak, and a memory leak because the value cannot be collected while the thread is alive. Always \`remove()\` in a \`finally\` block.

Java 21's \`ScopedValue\` (preview in 21, evolving since) addresses this structurally: the binding is scoped to a block and automatically unbound on exit, with no leak possible. Virtual threads make the leak worse, because millions of short-lived threads each carry a map until they die.`,
        },
        {
          id: 'virtual-threads',
          title: 'Virtual threads and Project Loom',
          body: `A **virtual thread** (Java 21, JEP 444) is a thread scheduled by the JVM rather than the OS. Platform threads map 1:1 to kernel threads and cost about a megabyte of stack each; virtual threads are heap-allocated continuations costing a few hundred bytes, so a JVM can host millions.

The mechanism is **mounting**. A virtual thread runs on a **carrier** platform thread from a \`ForkJoinPool\` until it hits a blocking operation. At that point the JVM saves its continuation, unmounts it, and frees the carrier to run another virtual thread. When the blocking call completes, the virtual thread is rescheduled onto some carrier and resumes exactly where it left off. From the code's perspective, the call simply blocked.

Create them with \`Thread.ofVirtual().start(task)\`, \`Thread.startVirtualThread(task)\`, or — for services — \`Executors.newVirtualThreadPerTaskExecutor()\`, which gives you one virtual thread per task with normal \`ExecutorService\` semantics and no pooling.

This inverts the old advice. With virtual threads you *want* simple blocking code, one thread per request, no callback chains. Throughput comes from cheap parking, not from clever async composition. Note that virtual threads are daemon threads and are not faster for CPU-bound work — there, you still want a small platform-thread pool.`,
        },
        {
          id: 'pinning',
          title: 'Pinning, and what still blocks a carrier',
          body: `A virtual thread cannot always unmount. It becomes **pinned** to its carrier when it blocks inside a \`synchronized\` block or method, or while executing a native frame (JNI). A pinned virtual thread blocks the carrier platform thread, and enough of them exhaust the scheduler.

Historically that made \`synchronized\` a scaling hazard for virtual threads. JDK 24 (JEP 491) removed pinning caused by \`synchronized\`, so on current JDKs the remaining pinning sources are native frames and some class-initialization cases. On Java 21, prefer \`ReentrantLock\` in code paths that virtual threads will execute, and keep \`synchronized\` sections free of blocking calls.

Two more limits are permanent. \`ThreadLocal\` still attaches a map per virtual thread, so a million threads with fat thread-locals is a million leaks — use \`ScopedValue\` or avoid per-thread state. And \`ThreadGroup\`-based APIs, \`Thread.stop\`, and priority are meaningless for virtual threads; \`setPriority\` is ignored.

Diagnose pinning with \`-Djdk.tracePinnedThreads=full\`, which prints a stack trace whenever a virtual thread blocks while pinned. If throughput plateaus while CPUs idle, pinning is a prime suspect.`,
        },
      ],
      javaCode: [
        {
          title: 'A CompletableFuture pipeline',
          description:
            'supplyAsync, thenCompose, thenCombine and a terminal exceptionally, all on an explicit executor so the common pool stays free.',
          code: `import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class CompletableFutureDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService io = Executors.newFixedThreadPool(4);
        try {
            CompletableFuture<Integer> price =
                    CompletableFuture.supplyAsync(() -> 100, io);

            CompletableFuture<Integer> withTax = price
                    .thenApply(p -> p + p / 10)                 // map
                    .thenApply(p -> p - 5);

            CompletableFuture<String> customer =
                    CompletableFuture.supplyAsync(() -> "ACME", io);

            CompletableFuture<String> invoice = withTax
                    .thenCombine(customer, (amount, name) -> name + " owes " + amount)
                    .thenCompose(text -> CompletableFuture.supplyAsync(
                            () -> "INVOICE: " + text, io))       // flatMap
                    .exceptionally(error -> "failed: " + error.getMessage());

            System.out.println(invoice.get(2, TimeUnit.SECONDS));

            // timeouts without a scheduler
            String fallback = CompletableFuture
                    .supplyAsync(() -> { sleep(5_000); return "slow"; }, io)
                    .completeOnTimeout("default", 200, TimeUnit.MILLISECONDS)
                    .get();
            System.out.println(fallback);
        } finally {
            io.shutdownNow();
        }
    }

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}`,
        },
        {
          title: 'ForkJoinPool with RecursiveTask',
          description:
            'Divide the array, fork the halves, join the results; small ranges are computed directly and work stealing balances the load.',
          code: `import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ForkJoinSum {
    static final class SumTask extends RecursiveTask<Long> {
        private static final int THRESHOLD = 10_000;
        private final long[] data;
        private final int from, to;

        SumTask(long[] data, int from, int to) {
            this.data = data;
            this.from = from;
            this.to = to;
        }

        @Override
        protected Long compute() {
            if (to - from <= THRESHOLD) {
                long sum = 0;
                for (int i = from; i < to; i++) sum += data[i];
                return sum;
            }
            int mid = (from + to) >>> 1;
            SumTask left = new SumTask(data, from, mid);
            SumTask right = new SumTask(data, mid, to);

            left.fork();                       // push onto this worker's deque
            long rightResult = right.compute(); // do the near half in place
            long leftResult = left.join();      // steal-aware wait
            return leftResult + rightResult;
        }
    }

    public static void main(String[] args) {
        long[] data = new long[1_000_000];
        for (int i = 0; i < data.length; i++) data[i] = i + 1;

        ForkJoinPool pool = new ForkJoinPool(Runtime.getRuntime().availableProcessors());
        long sum = pool.invoke(new SumTask(data, 0, data.length));
        System.out.println("sum = " + sum);

        // 8 threads would also work: pool = new ForkJoinPool(8)
        pool.shutdown();
    }
}`,
        },
        {
          title: 'ThreadLocal cleanup and virtual threads',
          description:
            'A per-thread formatter must be removed in finally; the virtual-thread section needs Java 21 and shows one thread per task.',
          code: `import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ContextAndVirtualThreads {
    private static final ThreadLocal<SimpleDateFormat> FORMAT =
            ThreadLocal.withInitial(() -> new SimpleDateFormat("HH:mm:ss.SSS"));

    static String stamp() {
        try {
            return FORMAT.get().format(new Date());
        } finally {
            FORMAT.remove();          // essential when the thread is reused
        }
    }

    public static void main(String[] args) throws InterruptedException {
        // ----- platform threads -----
        try (ExecutorService pool = Executors.newFixedThreadPool(4)) {
            for (int i = 0; i < 8; i++) {
                pool.submit(() -> System.out.println("pool " + stamp()));
            }
        }

        // ----- virtual threads (Java 21+) -----
        try (ExecutorService virtual = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 100_000; i++) {
                final int id = i;
                virtual.submit(() -> {
                    Thread.sleep(1);            // parks, carrier is released
                    if (id % 25_000 == 0) {
                        System.out.println(Thread.currentThread() + " -> " + id);
                    }
                });
            }
        }
        System.out.println("done: 100k virtual tasks");
    }
}`,
        },
      ],
      keyTakeaways: [
        'CompletableFuture composes async work; Future alone can only block on one result.',
        'Always choose the executor explicitly and terminate pipelines with exceptionally/handle.',
        'ForkJoinPool uses per-worker deques and work stealing, and joins help rather than block.',
        'ThreadLocal is per-thread state and must be remove()d in pooled threads to avoid leaks.',
        'Virtual threads are JVM-scheduled, park cheaply, and pin on native frames and (pre-JDK 24) synchronized.',
      ],
      interviewTips: [
        'Explain thenApply versus thenCompose versus thenCombine with map/flatMap/merge analogies.',
        'Say that ForkJoin steals from the tail of another deque and why that maximises chunk size.',
        'Describe a virtual thread as a continuation mounted on a carrier platform thread.',
        'Mention that virtual threads do not help CPU-bound work and are not a pool to size.',
      ],
      pitfalls: [
        'Blocking inside the common pool and starving every Async stage and parallel stream.',
        'Forgetting ThreadLocal.remove() in a pooled thread, leaking data across requests.',
        'Ignoring an exceptionally failed CompletableFuture, so errors vanish.',
        'Recursing below a sensible threshold in ForkJoin, where task overhead exceeds the work.',
        'Assuming virtual threads remove the need for bounded concurrency against a downstream service.',
      ],
      quiz: [
        {
          question: 'What is the difference between thenApply and thenCompose?',
          options: [
            'Nothing, they are aliases',
            'thenApply maps a value; thenCompose flattens a function that returns another stage',
            'thenCompose runs asynchronously and thenApply does not',
            'thenApply handles exceptions and thenCompose does not',
          ],
          answerIndex: 1,
          explanation: 'thenApply is map; thenCompose is flatMap and avoids nesting CompletableFuture<CompletableFuture<T>>.',
        },
        {
          question: 'Why must ThreadLocal.remove() be called in a thread pool?',
          options: [
            'Otherwise the pool refuses new tasks',
            'Pool threads are reused, so the value leaks into later tasks and is never collected',
            'It is required by the compiler',
            'It makes the value visible to other threads',
          ],
          answerIndex: 1,
          explanation: 'ThreadLocal values live on the Thread object; a long-lived pooled thread keeps them alive and exposes them to unrelated work.',
        },
      ],
    },
  ],
};
