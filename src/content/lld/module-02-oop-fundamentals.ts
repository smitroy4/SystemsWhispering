import type { LldModule } from '../../types/lld.ts';

export const module02: LldModule = {
  slug: 'object-oriented-programming',
  title: 'Object-Oriented Programming Fundamentals',
  order: 2,
  summary: 'The Java object model behind every LLD decision: memory, references, encapsulation, inheritance, polymorphism, and composition.',
  topics: [
    {
      slug: 'oop-java-memory-model',
      title: 'Introduction to OOP and the Java Memory Model',
      order: 1,
      summary: 'Objects, references, stack frames, and heap allocation — the runtime model every LLD decision assumes.',
      subtopics: [
        {
          id: 'oop-fundamentals',
          title: 'OOP fundamentals',
          body: 'Object-oriented programming organizes software around objects that combine state and behavior. In LLD this matters because we repeatedly ask: what objects exist, what state each owns, what behavior belongs to it, and how objects collaborate.\n\nThe key design rule: behavior that protects state should live close to the state it protects. A `BankAccount` that validates deposits inside `deposit()` owns its invariant; a service that mutates balances directly does not.',
        },
        {
          id: 'stack-frames',
          title: 'Stack',
          body: 'Each thread has a stack of method frames holding locals, parameters, and intermediate execution state. When `transfer()` calls `calculateFee()`, a new frame is pushed; when it returns, the frame is discarded.\n\nA common simplification — "objects live on the stack" — is a poor model for Java. Stack frames hold execution state and *references*; objects themselves live on the heap.',
        },
        {
          id: 'heap-objects',
          title: 'Heap',
          body: 'The heap holds objects and arrays. In `BankAccount account = new BankAccount("ACC-1", 5000)`, the variable `account` holds a reference while the object — account number plus balance — lives on the heap.\n\nFor LLD, the heap model answers: how many objects exist, who points at them, and how long they live. Lifetime and reachability questions start here.',
        },
        {
          id: 'references-aliasing',
          title: 'References',
          body: 'Assignment copies the reference, not the object. After `BankAccount second = first`, both variables point at one object — so `second.deposit(500)` changes what `first` observes.\n\nAliasing is the root of many design questions: who may mutate shared state, should a collection be defensively copied, and can two threads reach the same object?',
        },
        {
          id: 'pass-by-value',
          title: 'Java pass-by-value',
          body: 'Java is always pass-by-value — including for references. A method receives a *copy of the reference* pointing at the same object: it can mutate the object (`account.deposit(500)`) but reassigning the parameter (`account = new BankAccount(...)`) never affects the caller.\n\nConfusing "reference copy" with "object copy" breaks collaboration reasoning. If a method must not mutate its argument, the design should say so — with immutability, copies, or documentation.',
        },
        {
          id: 'shared-references',
          title: 'Shared references',
          body: 'When `Checkout` and `CartController` both hold the same `Cart`, every mutation is visible to both. Shared mutable state demands explicit ownership: the cart should own its items while collaborators ask it for information or invoke guarded operations.\n\nUncontrolled sharing creates bugs now and race conditions later. Prefer clear owners, defensive copies at boundaries, and immutable snapshots where mutation is not required.',
        },
      ],
      javaCode: [
        {
          title: 'Guarded BankAccount',
          description: 'State plus protecting behavior, aliasing made visible.',
          code: `public class BankAccountGuard {
    private final String accountNumber;
    private long balanceInPaise;

    public BankAccountGuard(String accountNumber, long initialBalanceInPaise) {
        this.accountNumber = accountNumber;
        this.balanceInPaise = initialBalanceInPaise;
    }

    public void deposit(long amountInPaise) {
        if (amountInPaise <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        balanceInPaise += amountInPaise;
    }

    public long balanceInPaise() {
        return balanceInPaise;
    }

    public static void main(String[] args) {
        BankAccountGuard first = new BankAccountGuard("A", 1000);
        BankAccountGuard second = first; // alias: one object, two references
        second.deposit(500);
        System.out.println(first.balanceInPaise()); // 1500 — shared state
    }
}`,
        },
      ],
      diagrams: ['oop-memory-model'],
      keyTakeaways: [
        'OOP models state plus behavior; protecting behavior belongs near the state.',
        'Stack frames hold execution state and references; objects live on the heap.',
        'Assignment copies references, so aliasing shares mutation.',
        'Java is pass-by-value — method params cannot replace caller variables.',
        'Shared mutable state needs explicit ownership.',
      ],
      interviewTips: [
        'When asked about references, draw the arrows: variables on one side, the object on the other.',
        'Connect aliasing to design: "That is why the cart defensively copies its item list."',
      ],
      pitfalls: [
        'Saying objects live on the stack — frames hold references, not objects.',
        'Expecting parameter reassignment to affect the caller.',
        'Letting every collaborator mutate a shared object with no owner.',
      ],
      quiz: [
        {
          question: 'After `BankAccount second = first; second.deposit(500);`, what does `first` observe?',
          options: ['Its old balance — the object was copied', 'The deposit — both references point at one object', 'A compiler error', 'A new independent account'],
          answerIndex: 1,
          explanation: 'Assignment copies the reference value, so both variables reach the same heap object.',
        },
        {
          question: 'Why can a method mutate its object parameter but not replace the caller’s variable?',
          options: ['Java is pass-by-reference', 'The method gets a copy of the reference: same object, independent variable', 'The heap is copied per call', 'Primitives behave differently from all objects'],
          answerIndex: 1,
          explanation: 'Pass-by-value copies the reference itself — mutation lands on the shared object, reassignment stays local.',
        },
        {
          question: 'What design question does a shared Cart force?',
          options: ['Which database to use', 'Who may mutate the shared state', 'How fast deposit runs', 'Whether to use records'],
          answerIndex: 1,
          explanation: 'Shared reachability demands ownership: who creates, mutates, and guards the state.',
        },
      ],
    },
    {
      slug: 'classes-objects-this',
      title: 'Classes, Objects, and the this Keyword',
      order: 2,
      summary: 'Blueprints versus runtime instances, instance behavior, identity, and what `this` really means.',
      subtopics: [
        {
          id: 'class-blueprint',
          title: 'Classes',
          body: 'A class defines a type: the state its instances carry and the behavior they offer. `Product` declares `id`, `name`, `priceInPaise` plus `changePrice()` — the blueprint every product object follows.\n\nDesign classes around coherent state; behavior that enforces rules on that state belongs inside the class, not scattered across services.',
        },
        {
          id: 'objects-state',
          title: 'Objects',
          body: 'Objects are runtime instances created with `new`. Two products share structure but hold independent state — changing one phone’s price never touches the laptop.\n\nIn domain terms, class membership never implies entity sameness: two `Order` objects may both be orders yet represent entirely different business entities.',
        },
        {
          id: 'instance-methods',
          title: 'Instance methods',
          body: 'Instance methods run in the context of one object: `order.confirm()` transitions *that* order from PENDING to CONFIRMED, rejecting anything else. This is why domain behavior models naturally inside domain objects — the method and the state it guards cannot drift apart.\n\nPrefer methods that enforce transitions over getters that expose state for others to transition.',
        },
        {
          id: 'this-keyword',
          title: 'this',
          body: '`this` refers to the current object. Its everyday use is disambiguation when parameters shadow fields: `this.id = id` assigns the parameter to the field.\n\nBeyond that, `this` is identity made explicit — passing `this` to a collaborator shares the current object, with all the aliasing consequences that implies.',
        },
        {
          id: 'identity-vs-equality',
          title: 'Object references',
          body: 'After `Product p2 = p1`, one object has two names — `p2.changePrice(900)` is visible through `p1`. Contrast this with two separately constructed equal-valued products: same values, different identities.\n\nThe domain rule follows: two `Money` objects for the same amount may be interchangeable, but two same-named customers are not the same customer. Never confuse equal values with shared identity.',
        },
      ],
      javaCode: [
        {
          title: 'Product, this, and guarded transitions',
          description: 'Disambiguation plus a state machine no outsider can corrupt.',
          code: `public class ProductThis {
    enum OrderStatus { PENDING, CONFIRMED }

    static class Product {
        private final String id;
        private long priceInPaise;

        Product(String id, long priceInPaise) {
            this.id = id; // this.id = field, id = parameter
            this.priceInPaise = priceInPaise;
        }

        public void changePrice(long newPriceInPaise) {
            if (newPriceInPaise < 0) {
                throw new IllegalArgumentException("Price cannot be negative");
            }
            this.priceInPaise = newPriceInPaise;
        }

        public long priceInPaise() {
            return priceInPaise;
        }
    }

    static class Order {
        private OrderStatus status = OrderStatus.PENDING;

        public void confirm() {
            if (status != OrderStatus.PENDING) {
                throw new IllegalStateException("Invalid transition");
            }
            status = OrderStatus.CONFIRMED;
        }
    }

    public static void main(String[] args) {
        Product phone = new Product("P-101", 1000);
        Product alias = phone;
        alias.changePrice(900);
        System.out.println(phone.priceInPaise()); // 900 — one object

        Order order = new Order();
        order.confirm();
        System.out.println("confirmed");
    }
}`,
        },
      ],
      diagrams: ['class-object-instance'],
      keyTakeaways: [
        'A class is a type; an object is a runtime instance with independent state.',
        'Instance methods run against one object and should guard its transitions.',
        '`this` disambiguates fields and names the current identity.',
        'Aliasing shares one object; equal values do not imply shared identity.',
      ],
      interviewTips: [
        'Use the Money-vs-Customer contrast to show you separate value equality from entity identity.',
        'Point at `confirm()` as the pattern: transitions as methods, never raw setters.',
      ],
      pitfalls: [
        'Exposing setters that let outsiders drive state machines.',
        'Treating two equal-valued objects as the same domain entity.',
        'Passing `this` out of a constructor before the object is fully built.',
      ],
      quiz: [
        {
          question: 'What does `this.id = id` do in a constructor?',
          options: ['Compares field and parameter', 'Assigns the parameter to the current object’s field', 'Creates a new object', 'Declares a local variable'],
          answerIndex: 1,
          explanation: '`this` names the current object, resolving shadowing between field and parameter.',
        },
        {
          question: 'Why is `order.confirm()` better than `order.setStatus(CONFIRMED)`?',
          options: ['It is shorter', 'It enforces the legal transition inside the object', 'It runs faster', 'It avoids imports'],
          answerIndex: 1,
          explanation: 'Behavior methods guard state machines; raw setters let any caller force any state.',
        },
      ],
    },
    {
      slug: 'constructors-initialization',
      title: 'Constructors and Object Initialization',
      order: 3,
      summary: 'Constructors as contracts: invariants at birth, initialization order, delegation, and records.',
      subtopics: [
        {
          id: 'constructors-invariants',
          title: 'Constructors',
          body: 'A constructor should make invalid objects unbuildable. Validating `id` and `email` before assignment establishes the invariant — every `User` that exists is a valid `User`.\n\nRead the parameter list as a contract: "these are the things required for this object to exist correctly." A no-arg constructor that permits empty shells needs an explicit justification.',
        },
        {
          id: 'init-order',
          title: 'Initialization order',
          body: 'Construction runs in a fixed order: memory allocated, fields get defaults, field initializers and instance blocks run, then the constructor body. So `name` ends as "constructor" when a field initializer, an instance block, and the constructor all assign it — last writer wins.\n\nKnowing the order prevents subtle bugs where initializers observe half-built state, especially with overridden methods called from constructors.',
        },
        {
          id: 'delegation-records',
          title: 'Constructor delegation',
          body: 'Overloads should delegate with `this(...)` so validation and assignment live in exactly one place. For immutable carriers, prefer records: the compact constructor enforces invariants (`Money` rejects blank currency and negative amounts) with almost no boilerplate.\n\nWhen overloads multiply into telescoping constructors, switch to static factories, builders, or parameter objects instead of adding another overload.',
        },
        {
          id: 'field-discipline',
          title: 'Field initialization',
          body: 'Initialize collections inline (`new ArrayList<>()`) so they exist from birth. But keep constructors free of workflows: no network calls, no database access, no message publishing.\n\nConstructors establish validity; they do not run the business. Heavy work belongs in explicit lifecycle methods or collaborators.',
        },
      ],
      javaCode: [
        {
          title: 'Validated construction with records',
          description: 'Invariants at birth, delegation, and a compact record constructor.',
          code: `import java.util.ArrayList;
import java.util.List;

public class ValidatedConstruction {
    static class User {
        private final String id;
        private final String email;

        User(String id, String email) {
            this(id, email, false);
        }

        User(String id, String email, boolean ignored) {
            if (id == null || id.isBlank() || email == null || email.isBlank()) {
                throw new IllegalArgumentException("Invalid user");
            }
            this.id = id;
            this.email = email;
        }
    }

    record Money(String currency, long amount) {
        public Money {
            if (currency == null || currency.isBlank()) {
                throw new IllegalArgumentException("Currency required");
            }
            if (amount < 0) {
                throw new IllegalArgumentException("Amount cannot be negative");
            }
        }
    }

    public static void main(String[] args) {
        List<Object> created = new ArrayList<>();
        created.add(new User("U-1", "user@example.com"));
        created.add(new Money("INR", 500));
        System.out.println("created=" + created.size());
    }
}`,
        },
      ],
      diagrams: ['init-order-steps'],
      keyTakeaways: [
        'Constructors make invalid states unbuildable — validate at birth.',
        'Initialization order is fixed: defaults, initializers, constructor body.',
        'Delegate overloads; reach for records, factories, or builders past a few params.',
        'Constructors establish state; they do not run workflows.',
      ],
      interviewTips: [
        'Read a constructor aloud as a contract: "this object cannot exist without X."',
        'Mention the telescoping-constructor smell and name the builder alternative.',
      ],
      pitfalls: [
        'Calling overridable methods from constructors — subclass state is not ready yet.',
        'Doing I/O in constructors, making objects untestable without infrastructure.',
        'Adding a fifth overload instead of switching to a builder or factory.',
      ],
      quiz: [
        {
          question: 'What runs first: field initializers or the constructor body?',
          options: ['Constructor body', 'Field initializers and instance blocks', 'Static methods', 'Garbage collection'],
          answerIndex: 1,
          explanation: 'Defaults, then initializers/blocks, then the constructor body — last writer wins.',
        },
        {
          question: 'When should you prefer a builder over more overloads?',
          options: ['Always, for every class', 'When telescoping constructors hurt readability', 'When fields are all static', 'Never — overloads scale fine'],
          answerIndex: 1,
          explanation: 'Growing overload lists signal a construction problem that factories, builders, or parameter objects solve.',
        },
      ],
    },
    {
      slug: 'encapsulation-access-modifiers',
      title: 'Encapsulation and Access Modifiers',
      order: 4,
      summary: 'Beyond private fields: behavior-oriented APIs that make invalid states unreachable.',
      subtopics: [
        {
          id: 'encapsulation-idea',
          title: 'Encapsulation',
          body: 'Encapsulation means controlling how state changes — not merely hiding fields. A public `balance` lets anyone assign `-100000`; a `withdraw()` that checks positivity and sufficiency keeps the invariant no matter who calls.\n\nThe goal: expose behavior through meaningful operations so the object, not its callers, owns correctness.',
        },
        {
          id: 'visibility-ladder',
          title: 'Visibility ladder',
          body: '`private` confines access to the class — the strongest everyday boundary. Package-private keeps implementation inside a package. `protected` opens the hierarchy and couples subclasses to internals, so use it deliberately. `public` publishes a contract: every public method is a promise to unknown callers, and changing it breaks them.',
        },
        {
          id: 'getters-setters-trap',
          title: 'Getters/setters',
          body: 'Accessors are not automatically encapsulation. `setStatus()` lets callers force any state, bypassing the rules `confirm()` would enforce. Getters that hand out mutable internals (like a live item list) leak the same way.\n\nAsk of every accessor: does this preserve an invariant, or does it just relocate the `public` keyword?',
        },
        {
          id: 'behavior-apis',
          title: 'Behavior-oriented APIs',
          body: 'Compare `order.setStatus(CANCELLED)` with `order.cancel()`: the second names intent and hosts the guard. Compare `cart.getItems().add(item)` with `cart.addItem(item)`: the second lets the cart enforce limits, totals, and duplicates.\n\nTests then verify observable behavior (`cannotCancelConfirmedOrder`) instead of field values — the implementation stays free to change.',
        },
      ],
      javaCode: [
        {
          title: 'Withdraw guards instead of setters',
          description: 'The object owns its invariant; callers get behavior, not fields.',
          code: `public class EncapsulatedAccount {
    private long balanceInPaise;

    EncapsulatedAccount(long initialBalanceInPaise) {
        this.balanceInPaise = initialBalanceInPaise;
    }

    public void withdraw(long amountInPaise) {
        if (amountInPaise <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
        if (amountInPaise > balanceInPaise) {
            throw new IllegalStateException("Insufficient funds");
        }
        balanceInPaise -= amountInPaise;
    }

    public long balanceInPaise() {
        return balanceInPaise;
    }

    public static void main(String[] args) {
        EncapsulatedAccount account = new EncapsulatedAccount(1000);
        account.withdraw(400);
        System.out.println(account.balanceInPaise()); // 600
    }
}`,
        },
      ],
      diagrams: ['encapsulation-wall'],
      keyTakeaways: [
        'Encapsulation controls state change, not just field visibility.',
        'Visibility rungs run private, package, protected, public — each a wider promise.',
        'Naked setters relocate `public` without adding safety.',
        'Behavior methods (`cancel`, `withdraw`) carry intent plus guards.',
      ],
      interviewTips: [
        'Refactor any setter you are shown into the business operation it hides.',
        'Say "public is a contract" when asked why an API cannot casually change.',
      ],
      pitfalls: [
        'Returning mutable internals from getters — hand out copies or unmodifiable views.',
        'Protected state across deep hierarchies — subclasses couple to internals.',
        'Testing fields instead of behavior, freezing implementation details.',
      ],
      quiz: [
        {
          question: 'What is wrong with `public void setStatus(OrderStatus s)`?',
          options: ['Nothing — setters are always safe', 'It lets callers force any state, bypassing transition rules', 'It is too slow', 'It cannot compile'],
          answerIndex: 1,
          explanation: 'Raw setters skip the guards a behavior method like confirm() would enforce.',
        },
        {
          question: 'Why is `public` the strongest commitment?',
          options: ['It uses more memory', 'Unknown callers depend on it, so changes break them', 'It implies static', 'It disables inheritance'],
          answerIndex: 1,
          explanation: 'Public members are contracts with code you cannot see; changing them breaks strangers.',
        },
      ],
    },
    {
      slug: 'interfaces-vs-abstract-classes',
      title: 'Abstraction: Interfaces vs Abstract Classes',
      order: 5,
      summary: 'Contracts versus shared bases: choosing the abstraction that matches the relationship.',
      subtopics: [
        {
          id: 'abstraction-idea',
          title: 'Abstraction',
          body: 'Abstraction lets code depend on a capability instead of details. An order flow needs "charge this payment" — not Stripe SDK calls, HTTP auth, or JSON shapes. `PaymentProcessor` names the stable capability; providers vary behind it.\n\nThe right question is never "interface or abstract class?" but "what relationship am I modeling, and what must stay stable?"',
        },
        {
          id: 'interfaces-contracts',
          title: 'Interfaces',
          body: 'An interface is a pure capability contract: `NotificationChannel.send()` promises delivery without saying how. Unrelated implementations (email, SMS, push) share nothing but the promise, and consumers like `NotificationService` stay independent of every provider.\n\nReach for interfaces when implementations may be unrelated, several types share the capability, or coupling must stay minimal.',
        },
        {
          id: 'abstract-shared-state',
          title: 'Abstract classes',
          body: 'Abstract classes add shared state and implementation to the contract: `PaymentGateway` holds `merchantId`, validates amounts once, and leaves `charge()` abstract. Subclasses inherit real behavior, not just a signature.\n\nUse them when related implementations genuinely share state or logic — never merely to reuse a few methods, which composition handles better.',
        },
        {
          id: 'choosing-guideline',
          title: 'Choosing interface vs abstract class',
          body: 'Capability shared by unrelated types → interface (`PaymentProcessor`, `PricingStrategy`). True shared base with state → abstract class (`BaseFileProcessor`, `BaseJob`). Multiple capabilities → several interfaces; Java classes get one parent but unlimited interfaces.\n\nName contracts after responsibilities, not mechanics — `PaymentProcessor` communicates; `ThingManager` confesses nothing.',
        },
      ],
      javaCode: [
        {
          title: 'Channels behind one contract',
          description: 'Interface capability, two unrelated implementations, one stable consumer.',
          code: `public class ChannelAbstraction {
    interface NotificationChannel {
        void send(String message);
    }

    static class EmailChannel implements NotificationChannel {
        @Override
        public void send(String message) {
            System.out.println("email: " + message);
        }
    }

    static class SmsChannel implements NotificationChannel {
        @Override
        public void send(String message) {
            System.out.println("sms: " + message);
        }
    }

    static class NotificationService {
        private final NotificationChannel channel;

        NotificationService(NotificationChannel channel) {
            this.channel = channel;
        }

        void notify(String message) {
            channel.send(message);
        }
    }

    public static void main(String[] args) {
        new NotificationService(new EmailChannel()).notify("hi");
        new NotificationService(new SmsChannel()).notify("hi");
    }
}`,
        },
      ],
      diagrams: ['interface-vs-abstract'],
      keyTakeaways: [
        'Abstraction hides details behind meaningful capability contracts.',
        'Interfaces suit unrelated implementations sharing a capability.',
        'Abstract classes suit hierarchies sharing real state or behavior.',
        'Choose by relationship and variation, not by blanket rule.',
      ],
      interviewTips: [
        'Answer "what is stable here?" before naming the abstraction type.',
        'Show the consumer depending on the interface to prove the decoupling.',
      ],
      pitfalls: [
        'Vague contract names (`Manager`, `ProcessorService`) that document nothing.',
        'Inheriting just to reuse helpers — compose instead.',
        'Sealed-looking hierarchies modeled as open interfaces with one implementation.',
      ],
      quiz: [
        {
          question: 'When is an abstract class preferable to an interface?',
          options: ['Always — it does more', 'When implementations genuinely share state or behavior', 'When no code is shared at all', 'When only one method exists'],
          answerIndex: 1,
          explanation: 'Shared state and real common behavior justify a base; pure capability calls for an interface.',
        },
        {
          question: 'What does depending on NotificationChannel buy the service?',
          options: ['Faster bytecode', 'Independence from every provider implementation', 'Fewer files', 'Static dispatch'],
          answerIndex: 1,
          explanation: 'The consumer knows only the contract, so providers vary without touching it.',
        },
      ],
    },
    {
      slug: 'inheritance-types',
      title: 'Inheritance and Its Types',
      order: 6,
      summary: 'Is-a modeling done right: substitutable hierarchies, Java’s single-inheritance limit, and the danger signs.',
      subtopics: [
        {
          id: 'is-a-test',
          title: 'Is-a relationship',
          body: 'Inheritance must model a genuine is-a: every `Car` is a `Vehicle`. `Engine` under `Car` fails the test — a car *has* an engine, and modeling it as is-a corrupts every expectation the hierarchy promises.\n\nThe sharper test: can every child instance be treated as the parent *without violating expectations*? If substitution surprises anyone, prefer composition.',
        },
        {
          id: 'subclass-contracts',
          title: 'Subclasses',
          body: 'A subclass inherits state, constructors (via `super`), and behavior, then specializes: `FullTimeEmployee` supplies `calculateCompensation()` for the abstract `Employee` contract. Overriding must preserve parent expectations — weakening a promise breaks substitutability, the subject of LSP later.\n\nProtected members and deep override chains raise the coupling price of every level added.',
        },
        {
          id: 'types-limit',
          title: 'Types of inheritance',
          body: 'Single (`Dog` from `Animal`), multilevel (`Dog` from `Mammal` from `Animal`), and hierarchical (siblings sharing one parent) all work in Java. What does not: one class extending two classes — `class C extends A, B` is invalid.\n\nMultiple *capabilities* come from interfaces instead: `SmartPhone implements Camera, GPS, MusicPlayer` gains three contracts with none of the diamond ambiguity.',
        },
        {
          id: 'lld-judgment',
          title: 'Inheritance and LLD',
          body: 'Inherit when the domain relationship is real, substitution holds, shared state is meaningful, and the tree stays shallow enough to hold in mind. Walk away when hierarchies deepen, subclasses inherit irrelevancies, parent edits ripple unpredictably, or the only motive is reusing code.\n\nReuse without relationship is composition’s job — the next topic but one makes the full case.',
        },
      ],
      javaCode: [
        {
          title: 'Contracts plus capabilities',
          description: 'Abstract base with shared state; interfaces for multiple capabilities.',
          code: `public class InheritanceShapes {
    interface Camera {
        void capture();
    }

    interface GPS {
        String locate();
    }

    static abstract class Employee {
        private final String id;

        protected Employee(String id) {
            this.id = id;
        }

        public String id() {
            return id;
        }

        public abstract long calculateCompensation();
    }

    static class FullTimeEmployee extends Employee {
        private final long monthlySalary;

        FullTimeEmployee(String id, long monthlySalary) {
            super(id);
            this.monthlySalary = monthlySalary;
        }

        @Override
        public long calculateCompensation() {
            return monthlySalary;
        }
    }

    static class SmartPhone implements Camera, GPS {
        @Override
        public void capture() {
            System.out.println("photo taken");
        }

        @Override
        public String locate() {
            return "loc";
        }
    }

    public static void main(String[] args) {
        Employee emp = new FullTimeEmployee("E-1", 9000);
        System.out.println(emp.id() + "=" + emp.calculateCompensation());
        SmartPhone phone = new SmartPhone();
        phone.capture();
        System.out.println(phone.locate());
    }
}`,
        },
      ],
      diagrams: ['inheritance-tree'],
      keyTakeaways: [
        'Inheritance models is-a; failing the substitution test means composition.',
        'Subclass overrides must preserve parent contracts.',
        'Java allows single class inheritance plus unlimited interfaces.',
        'Reuse alone never justifies a hierarchy.',
      ],
      interviewTips: [
        'Run the is-a sentence aloud: "a Car is a Vehicle" passes, "an Engine is a Car" fails.',
        'Name the diamond problem when explaining why classes stay single-inherited.',
      ],
      pitfalls: [
        'Deep trees where Base edits ripple through five levels.',
        'Overriding to weaken or surprise — substitutability dies quietly.',
        'Using extends for utility reuse instead of composition or helpers.',
      ],
      quiz: [
        {
          question: 'Why is `Engine extends Car` wrong?',
          options: ['Engines are too small', 'A car has an engine — the relationship is has-a, not is-a', 'Java forbids all inheritance', 'Subclasses cannot have fields'],
          answerIndex: 1,
          explanation: 'Inheritance promises substitutability; an engine cannot stand in for a car.',
        },
        {
          question: 'How does Java model multiple capabilities without multiple inheritance?',
          options: ['Copy-paste', 'One class implementing several interfaces', 'Static methods only', 'It cannot be modeled'],
          answerIndex: 1,
          explanation: 'Interfaces grant many contracts while single class inheritance avoids the diamond.',
        },
      ],
    },
    {
      slug: 'polymorphism-dispatch',
      title: 'Polymorphism: Compile-Time vs Runtime',
      order: 7,
      summary: 'One operation, many implementations: overloading resolved by the compiler, overriding resolved at runtime.',
      subtopics: [
        {
          id: 'overloading-compile-time',
          title: 'Method overloading',
          body: 'Overloading is compile-time polymorphism: `print(String)` versus `print(int)` is chosen by argument types before the program ever runs. Same idea for `process(Order)` versus `process(Payment)` — the compiler matches the signature at the call site.\n\nOverloads share a name because they share intent; each variant handles one shape of input. Changing argument types can silently rebind a call, so keep overloads semantically aligned.',
        },
        {
          id: 'overriding-runtime',
          title: 'Method overriding',
          body: 'Overriding is runtime polymorphism: `Animal animal = new Dog(); animal.speak();` prints "dog" because the *object*, not the variable, decides. The reference type only promises the method exists; the runtime type supplies the behavior.\n\nThis split is the whole game: stable code written against parents, varying behavior supplied by children.',
        },
        {
          id: 'dynamic-dispatch',
          title: 'Dynamic dispatch',
          body: 'Dispatch answers three questions per call: the reference type (what is promised), the actual object (what exists), and the runtime target (what runs). For `animal.speak()` with a `Dog` inside, the lookup lands on `Dog.speak()`.\n\nDesigns lean on this constantly: strategy objects, channel implementations, and pricing policies all vary behavior by swapping the runtime object while call sites stay frozen.',
        },
        {
          id: 'parent-type-refs',
          title: 'Parent-type references',
          body: '`PaymentProcessor processor = new StripePaymentProcessor()` tells the consumer exactly one thing: the capability. Stripe specifics never leak into order flow, so providers change without touching callers.\n\nProgram to the parent (or interface) wherever variation is expected; reach for the concrete type only where its extra operations are genuinely needed.',
        },
      ],
      javaCode: [
        {
          title: 'Overload versus override, running',
          description: 'Compiler picks the overload; the runtime picks the override.',
          code: `public class DispatchDemo {
    static class Animal {
        void speak() {
            System.out.println("animal");
        }
    }

    static class Dog extends Animal {
        @Override
        void speak() {
            System.out.println("dog");
        }
    }

    static class Printer {
        void print(String value) {
            System.out.println("str:" + value);
        }

        void print(int value) {
            System.out.println("int:" + value);
        }
    }

    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.speak(); // dog — runtime dispatch
        Printer printer = new Printer();
        printer.print("hello"); // str — compile-time choice
        printer.print(42); // int — compile-time choice
    }
}`,
        },
      ],
      diagrams: ['dispatch-steps'],
      keyTakeaways: [
        'Overloading resolves at compile time by signature.',
        'Overriding resolves at runtime by actual object.',
        'Reference type promises; runtime type delivers.',
        'Parent-typed variables isolate callers from implementations.',
      ],
      interviewTips: [
        'Trace one call aloud: "reference says Animal, object is Dog, so Dog.speak runs."',
        'Distinguish overload (same class, different params) from override (subclass, same signature).',
      ],
      pitfalls: [
        'Expecting overloads to dispatch on runtime type — they never do.',
        'Changing signatures so overloads drift apart semantically.',
        'Downcasting to concretes everywhere, defeating the parent abstraction.',
      ],
      quiz: [
        {
          question: '`Animal a = new Dog(); a.speak();` prints…',
          options: ['animal', 'dog', 'A compiler error', 'Nothing — it throws'],
          answerIndex: 1,
          explanation: 'Overridden methods dispatch on the runtime object, which is a Dog.',
        },
        {
          question: 'When is an overloaded method selected?',
          options: ['At runtime by object type', 'At compile time by argument types', 'By the JVM garbage collector', 'Randomly per call'],
          answerIndex: 1,
          explanation: 'Overloading is static: the compiler binds the call from static argument types.',
        },
      ],
    },
    {
      slug: 'association-aggregation-composition',
      title: 'Association, Aggregation, and Composition',
      order: 8,
      summary: 'How objects connect: plain links, whole-part ties, and lifecycle ownership.',
      subtopics: [
        {
          id: 'association-links',
          title: 'Association',
          body: 'Association is the general case: objects know each other. A `Doctor` holding a list of `Patient` references is associated — the model says they interact, nothing more.\n\nOwnership semantics stay open at this level; the domain must still answer who creates, mutates, and retires each side.',
        },
        {
          id: 'aggregation-parts',
          title: 'Aggregation',
          body: 'Aggregation is whole-part without lifecycle control: a `Team` has `Player`s, but players survive the team dissolving. Lifetimes are independent even though the grouping is real.\n\nUse it when the part is meaningful on its own and merely collected by the whole — rosters, playlists, tags.',
        },
        {
          id: 'composition-ownership',
          title: 'Composition',
          body: 'Composition adds ownership: an `OrderItem` exists only as part of its `Order`. The order creates the lifecycle boundary — items arrive with it and retire with it.\n\nIn code this often means defensive copies in (`new ArrayList<>(items)`) and no live handles out. External code sees items through the order, never around it.',
        },
        {
          id: 'ownership-question',
          title: 'Has-a relationship',
          body: 'Every has-a deserves the ownership question, not a mechanical label: who creates the object, who mutates it, who controls its lifetime, who guards its invariants? A `RequestContext` bounded by one request and a shared `Address` give opposite answers to the same question.\n\nResources sharpen the point — connections, files, sockets, locks: whoever acquires must clearly own release, ideally via try-with-resources.',
        },
      ],
      javaCode: [
        {
          title: 'Composed order items',
          description: 'Defensive copy in; no live list out. The order owns its parts.',
          code: `import java.util.ArrayList;
import java.util.List;

public class OrderComposition {
    static class Order {
        private final List<String> items;

        Order(List<String> items) {
            this.items = new ArrayList<>(items); // copy in: own the parts
        }

        int itemCount() {
            return items.size();
        }
    }

    public static void main(String[] args) {
        List<String> cart = new ArrayList<>(List.of("book", "pen"));
        Order order = new Order(cart);
        cart.add("sneaky"); // outsider mutates the source list
        System.out.println(order.itemCount()); // 2 — order unaffected
    }
}`,
        },
      ],
      diagrams: ['ownership-diamonds'],
      keyTakeaways: [
        'Association links objects with open ownership.',
        'Aggregation groups independently living parts.',
        'Composition binds part lifecycles to the whole.',
        'Always ask who creates, mutates, and retires each object.',
      ],
      interviewTips: [
        'Draw the three UML line styles (plain, hollow diamond, filled diamond) while defining them.',
        'Justify composition with lifecycle: "items die with the order."',
      ],
      pitfalls: [
        'Labeling every field "composition" without lifecycle reasoning.',
        'Handing out live internal collections that bypass ownership.',
        'Forgetting resource release ownership for files, sockets, locks.',
      ],
      quiz: [
        {
          question: 'Team–Player (players outlive teams) is…',
          options: ['Composition', 'Aggregation', 'Inheritance', 'Dependency injection'],
          answerIndex: 1,
          explanation: 'Whole-part grouping with independent lifetimes is aggregation.',
        },
        {
          question: 'Why does Order copy its item list?',
          options: ['To save memory', 'To own its parts against outsider mutation', 'To sort faster', 'To satisfy generics'],
          answerIndex: 1,
          explanation: 'Defensive copying enforces composition: the whole controls part state.',
        },
      ],
    },
    {
      slug: 'dependency-relationships',
      title: 'Dependency Relationships',
      order: 9,
      summary: 'Needs between components: direction, injection, cycles, and testability.',
      subtopics: [
        {
          id: 'direction-matters',
          title: 'Dependency direction',
          body: 'Every dependency should point from volatile policy toward stable capability. `OrderService` depending directly on `StripeSdkClient` welds business logic to one provider; depending on `PaymentProcessor` with `StripePaymentProcessor` behind it lets providers vary freely.\n\nBefore adding a dependency ask: is it necessary, is it stable, does it point the right way, and could the caller need only a narrower capability?',
        },
        {
          id: 'injection-explicit',
          title: 'Dependency injection',
          body: 'Inject collaborators instead of constructing them: a constructor taking `PaymentProcessor` declares its needs, while `new StripePaymentProcessor()` inside hard-codes them. Constructor injection additionally makes dependencies `final`, visible, and impossible to forget.\n\nInjected designs read as bills of materials — everything the object needs is listed at birth.',
        },
        {
          id: 'cycles-danger',
          title: 'Circular dependencies',
          body: 'A depending on B depending on A tangles reasoning, construction order, and tests. Cycles usually signal a missing responsibility: extract the shared contract, move it to the right boundary, or introduce a mediator.\n\nTreat every new dependency as a chance to check the graph stays acyclic.',
        },
        {
          id: 'testability-fakes',
          title: 'Testability',
          body: 'Injected abstractions substitute trivially: a lambda returning `PaymentResult.success()` stands in for any provider, so `OrderService` tests run without networks or SDKs.\n\nIf a class cannot be tested without its infrastructure, its dependencies point the wrong way — the test pain is the design feedback.',
        },
      ],
      javaCode: [
        {
          title: 'Injected service with a lambda fake',
          description: 'Constructor injection plus a one-line test double.',
          code: `public class InjectedService {
    interface PaymentProcessor {
        String process(String request);
    }

    static class OrderService {
        private final PaymentProcessor paymentProcessor;

        OrderService(PaymentProcessor paymentProcessor) {
            this.paymentProcessor = paymentProcessor;
        }

        String place(String request) {
            return "order:" + paymentProcessor.process(request);
        }
    }

    public static void main(String[] args) {
        PaymentProcessor fake = request -> "ok";
        OrderService service = new OrderService(fake);
        System.out.println(service.place("book")); // order:ok
    }
}`,
        },
      ],
      diagrams: ['dependency-inversion'],
      keyTakeaways: [
        'Depend on stable abstractions, not volatile concretes.',
        'Constructor injection makes needs explicit, final, and testable.',
        'Cycles reveal missing responsibilities — restructure, don’t patch.',
        'Untestable classes usually have backward dependencies.',
      ],
      interviewTips: [
        'Redraw any concrete arrow as interface-plus-implementation on the whiteboard.',
        'Offer the fake-in-one-line test as proof the direction is right.',
      ],
      pitfalls: [
        'Field injection hiding required dependencies from constructors.',
        'Depending on entire collaborators when one capability method suffices.',
        'Letting cycles accumulate until construction order becomes magic.',
      ],
      quiz: [
        {
          question: 'Why prefer constructor injection over `new` inside the class?',
          options: ['It runs faster', 'Needs stay explicit, final, and substitutable in tests', 'It removes all dependencies', 'It enables static methods'],
          answerIndex: 1,
          explanation: 'Injected dependencies are visible at birth and replaceable by fakes.',
        },
        {
          question: 'What does a dependency cycle usually indicate?',
          options: ['Perfect layering', 'A missing responsibility or misplaced contract', 'Too few classes', 'Excessive generics'],
          answerIndex: 1,
          explanation: 'Cycles mean two things know too much about each other — extract or relocate the shared piece.',
        },
      ],
    },
    {
      slug: 'generics-type-safety',
      title: 'Generics and Type Safety',
      order: 10,
      summary: 'Precise reusable APIs: intent-carrying collections, erasure limits, and invariance traps.',
      subtopics: [
        {
          id: 'generics-intent',
          title: 'Generics',
          body: 'Raw `List` accepts anything — strings beside integers, discovered at crash time. `List<Order>` moves the check to compilation and documents intent: this collection holds orders, nothing else.\n\nGeneric signatures like `Map<ProductId, Product>` read as design statements, far more useful than `Map<Object, Object>`.',
        },
        {
          id: 'erasure-limits',
          title: 'Type erasure',
          body: 'Java erases type arguments at runtime: `List<String>` and `List<Integer>` share one class. Consequences follow — no `new T()`, no overloading by type argument alone, and runtime checks need explicit `Class<T>` tokens.\n\nDesign generic APIs with erasure in mind: pass class tokens where runtime type matters and avoid promises the runtime cannot keep.',
        },
        {
          id: 'invariance-trap',
          title: 'Generic invariance',
          body: '`List<Dog>` is *not* a `List<Animal>`, though `Dog` is an `Animal`. Allowing it would let someone add a `Cat` through the `List<Animal>` view, breaking the original list’s guarantee.\n\nNeed flexibility? Bounded wildcards (`List<? extends Animal>` for producers) express exactly how far the guarantee stretches.',
        },
        {
          id: 'repository-contract',
          title: 'Generics in LLD',
          body: '`Repository<ID, T>` with `Optional<T> findById(ID)` is the canonical precise contract — but only build it when reuse is real. One simple repository does not need a generic framework around it.\n\nGenerics serve reuse; YAGNI still governs whether the reuse exists.',
        },
      ],
      javaCode: [
        {
          title: 'Typed repository, Honest erasure',
          description: 'Precise contracts plus the invariance rule the compiler enforces.',
          code: `import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class GenericsShowcase {
    interface Repository<ID, T> {
        Optional<T> findById(ID id);

        T save(T entity);
    }

    static class Order {
        final String id;

        Order(String id) {
            this.id = id;
        }
    }

    static class OrderRepository implements Repository<String, Order> {
        private final List<Order> store = new ArrayList<>();

        @Override
        public Optional<Order> findById(String id) {
            return store.stream().filter(o -> o.id.equals(id)).findFirst();
        }

        @Override
        public Order save(Order entity) {
            store.add(entity);
            return entity;
        }
    }

    public static void main(String[] args) {
        Repository<String, Order> repo = new OrderRepository();
        repo.save(new Order("O-1"));
        System.out.println(repo.findById("O-1").isPresent()); // true
        // List<Order> is NOT a List<Object>: invariance protects the element type.
    }
}`,
        },
      ],
      diagrams: ['erasure-diagram'],
      keyTakeaways: [
        'Generics move type errors from runtime crashes to compile time.',
        'Erasure removes type arguments at runtime — design around it.',
        'Generic types are invariant; wildcards express safe flexibility.',
        'Raw types forfeit every guarantee generics provide.',
      ],
      interviewTips: [
        'Explain invariance with the Cat-in-Dog-list story — interviewers love it.',
        'Show a `Class<T>` token when asked how to beat erasure.',
      ],
      pitfalls: [
        'Assuming `List<Dog>` assigns to `List<Animal>`.',
        'Using raw types in new code, inviting ClassCastException.',
        'Building generic frameworks for a single concrete use case.',
      ],
      quiz: [
        {
          question: 'Why is `List<Dog>` not a `List<Animal>`?',
          options: ['Dogs are not animals', 'A Cat could be added through the wider view, breaking the guarantee', 'Generics are slower', 'Lists are immutable'],
          answerIndex: 1,
          explanation: 'Invariance protects element-type promises against wider-typed writes.',
        },
        {
          question: 'What does erasure imply for `new T()`?',
          options: ['It always works', 'It is unavailable — runtime has no T to construct', 'It returns null', 'It requires records'],
          answerIndex: 1,
          explanation: 'Type arguments vanish at runtime, so the JVM cannot instantiate an unknown T.',
        },
      ],
    },
    {
      slug: 'composition-over-inheritance',
      title: 'The Golden Rule: Composition Over Inheritance',
      order: 11,
      summary: 'Collaborate instead of inheriting: delegation keeps behavior combinable and hierarchies shallow.',
      subtopics: [
        {
          id: 'composition-delegation',
          title: 'Composition',
          body: 'Composition means holding collaborators: `Car` has an `Engine` and calls `engine.start()`. `RetryingPaymentProcessor` wraps any `PaymentProcessor`, adding retries without touching provider code.\n\nBehavior composes at runtime — swap the delegate, change the behavior — while hierarchies freeze it at compile time.',
        },
        {
          id: 'deep-hierarchy-risk',
          title: 'Deep hierarchies',
          body: 'Each level of `Base → A → B → C → D` inherits state, methods, visibility, lifecycle, and override quirks from everything above. A `Base` edit ripples through layers nobody fully holds in mind.\n\nDepth is coupling wearing a costume. Shallow trees survive contact with changing requirements; deep ones fossilize.',
        },
        {
          id: 'is-has-test',
          title: 'Is-a vs has-a',
          body: 'Ask it plainly: is a Dog an Animal (yes — inheritance candidate) or does a Car have an Engine (yes — composition)? The delivery-system test is sharper: pricing, routing, tracking, and notification vary *independently*, so `ExpressDeliveryWithPremiumPricingAndSmsTracking` screams for composed policies, not a combinatorial tree.',
        },
        {
          id: 'when-inheritance-fits',
          title: 'When inheritance is appropriate',
          body: 'Inherit when the is-a is genuine, the parent contract is meaningful, substitution holds, shared state is substantial, and the tree stays shallow. Otherwise compose: independent variation, combinable behaviors, has-a relationships, and runtime substitution all favor collaborators.\n\nThe goal was never fewer classes — it is better responsibility and change isolation.',
        },
      ],
      javaCode: [
        {
          title: 'Retry as decoration, not ancestry',
          description: 'Behavior added by wrapping — combinable with any processor.',
          code: `public class RetryDecoration {
    interface PaymentProcessor {
        String process(String request);
    }

    static class CardProcessor implements PaymentProcessor {
        @Override
        public String process(String request) {
            return "charged:" + request;
        }
    }

    static class RetryingProcessor implements PaymentProcessor {
        private final PaymentProcessor delegate;

        RetryingProcessor(PaymentProcessor delegate) {
            this.delegate = delegate;
        }

        @Override
        public String process(String request) {
            String result = delegate.process(request);
            return "retried[" + result + "]";
        }
    }

    public static void main(String[] args) {
        PaymentProcessor processor = new RetryingProcessor(new CardProcessor());
        System.out.println(processor.process("book"));
    }
}`,
        },
      ],
      diagrams: ['fragile-base'],
      keyTakeaways: [
        'Composition models has-a collaboration; delegation supplies behavior.',
        'Deep hierarchies couple every layer to Base edits.',
        'The is-a sentence test separates the two in seconds.',
        'Independently varying behaviors compose; they do not inherit.',
      ],
      interviewTips: [
        'Name the combinatorial explosion: "pricing × routing × tracking would need dozens of subclasses."',
        'Show the wrapper working with two different delegates to prove combinability.',
      ],
      pitfalls: [
        'Inheriting for reuse alone, then fighting the hierarchy at every change.',
        'Letting trees deepen past the point anyone can hold in mind.',
        'Reading the rule as "never inherit" — genuine is-a hierarchies still qualify.',
      ],
      quiz: [
        {
          question: 'Why does retry logic belong in a wrapper rather than a base class?',
          options: ['Wrappers run faster', 'It composes with any processor without forcing a hierarchy', 'Base classes cannot have fields', 'Interfaces forbid it'],
          answerIndex: 1,
          explanation: 'Decoration adds behavior to arbitrary implementations; ancestry would demand a parallel tree.',
        },
        {
          question: 'What is the headline risk of deep inheritance?',
          options: ['Too few classes', 'Base edits ripple through coupled layers', 'Interfaces disappear', 'Constructors vanish'],
          answerIndex: 1,
          explanation: 'Depth multiplies inherited state, behavior, and override quirks — change anywhere shakes everywhere.',
        },
      ],
    },
    // __MORE_TOPICS__
  ],
};
