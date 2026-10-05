import type { LldModule } from '../../types/lld.ts';

export const module03: LldModule = {
  slug: 'core-design-principles',
  title: 'Core Design Principles',
  order: 3,
  summary: 'Reasoning tools for change: SOLID, DRY, KISS, YAGNI, cohesion, coupling, and testability — principles before patterns.',
  topics: [
    {
      slug: 'design-principles-intro',
      title: 'Introduction to Design Principles',
      order: 1,
      summary: 'Principles as change-prediction tools: responsibilities, contracts, variation, and restraint.',
      subtopics: [
        {
          id: 'principles-reasoning',
          title: 'Design principles',
          body: 'A principle is a reasoning tool, not a law. When two designs both work today, principles predict which one survives tomorrow: what is likely to change, who should own that change, what stays stable, and where variation should live.\n\nDesign around responsibilities, contracts, and likely change — the class diagram is the result of that reasoning, never the reasoning itself.',
        },
        {
          id: 'cost-of-change',
          title: 'Cost of change',
          body: 'Design pays off when requirements move. A card-only `PaymentService` that absorbs UPI, wallets, refunds, and failover in one class makes every addition costlier than the last.\n\nGood design localizes change: fewer affected modules, protected business rules, smaller regression risk, easier tests, explicit dependencies. Judge structure by the next reasonable change, not the current snapshot.',
        },
        {
          id: 'contract-restraint',
          title: 'Contract',
          body: 'A contract states what a component promises: signatures, inputs, outputs, exceptions, transitions, guarantees. `PaymentResult charge(Money, PaymentMethod)` hides SDKs, auth, and serialization; an interface exposing `getStripeClient()` leaks them.\n\nStable contracts name business capabilities. Leaky ones name implementations — and every leak becomes a future change driver.',
        },
        {
          id: 'restraint-solid',
          title: 'Restraint',
          body: 'More abstraction is not better design. A Controller→Service→Manager→Coordinator→Handler→Processor→Strategy chain with one trivial method per layer is harder to understand than the simple version it replaced.\n\nAsk "what change or dependency does this abstraction protect?" If nothing concrete answers, delete it. SOLID names five recurring problems (SRP→responsibilities, OCP→variation, LSP→contracts, ISP→focused interfaces, DIP→stable policy) — use them as lenses, not commandments.',
        },
        {
          id: 'dry-kiss-teaser',
          title: 'DRY',
          body: 'DRY bans duplicated *knowledge*, not duplicated text. Two methods checking `age >= 18` are fine until "adult means 18" lives in five places — then the threshold change becomes surgery.\n\nConversely, merging similar-looking code that models different concepts creates coupling. DRY the rule, not the resemblance.',
        },
      ],
      javaCode: [
        {
          title: 'Varying channels without if-else chains',
          description: 'A policy map replaces the growing conditional — variation gets an owner.',
          code: `import java.util.Map;

public class ChannelRouter {
    interface Channel {
        void send(String message);
    }

    public static void main(String[] args) {
        Map<String, Channel> channels = Map.of(
            "EMAIL", message -> System.out.println("email: " + message),
            "SMS", message -> System.out.println("sms: " + message));
        channels.get("EMAIL").send("hi");
        channels.get("SMS").send("hi");
    }
}`,
        },
      ],
      diagrams: ['change-surface'],
      keyTakeaways: [
        'Principles predict change cost; they do not decorate code.',
        'Localize variation behind owners with clear contracts.',
        'Stable contracts name capabilities, never implementations.',
        'Restraint beats speculative abstraction every time.',
      ],
      interviewTips: [
        'Open with change analysis: "these three things vary, so each gets an owner."',
        'Never recite SOLID unprompted — let each principle surface from a concrete decision.',
      ],
      pitfalls: [
        'Seven-layer chains with one trivial method per layer.',
        'Interfaces created "because interfaces are good" with no variation behind them.',
        'Merging coincidentally similar code that models different concepts.',
      ],
      quiz: [
        {
          question: 'What does DRY actually forbid duplicating?',
          options: ['Any two identical lines', 'The same business knowledge in multiple places', 'Import statements', 'Test data'],
          answerIndex: 1,
          explanation: 'Knowledge duplication makes rule changes risky; coincidental text similarity is harmless.',
        },
        {
          question: 'A good extension-point question is…',
          options: ['"Can I abstract this?"', '"What change does this abstraction protect?"', '"Which pattern fits?"', '"How many layers?"'],
          answerIndex: 1,
          explanation: 'Abstraction must defend against a concrete change or dependency, otherwise it is ceremony.',
        },
      ],
    },
    {
      slug: 'single-responsibility',
      title: 'Single Responsibility Principle',
      order: 2,
      summary: 'One coherent responsibility per class: find change drivers, name owners, split on real boundaries.',
      subtopics: [
        {
          id: 'srp-meaning',
          title: 'SRP',
          body: 'SRP means one *coherent responsibility* — not one method. An `Invoice` with `subtotal()`, `tax()`, and `total()` owns invoice math; an `InvoiceService` that also saves, emails, and renders PDFs mixes calculation, persistence, communication, and rendering.\n\nThose concerns change for different reasons, so every change drags unrelated code into review and testing.',
        },
        {
          id: 'change-drivers',
          title: 'One reason to change',
          body: 'Map each class to its change drivers: pricing rules, database vendor, notification provider, validation wording. An `OrderService.placeOrder` touching all four has four reasons to change.\n\nDecompose along those drivers — validator, pricing, repository, notifier — with the service left coordinating the workflow instead of implementing it.',
        },
        {
          id: 'collaborators-split',
          title: 'Collaborators',
          body: 'SRP never means working alone: `CheckoutService` coordinating repository, gateway, inventory, and publisher still has one job — checkout. The rule is about *implementation* ownership, not call counts.\n\nSplit too far and boundaries lose meaning (`OrderStatusManager`, `OrderRepositoryManager`); split on genuine change ownership and each piece earns its name.',
        },
        {
          id: 'cancel-owner',
          title: 'Change ownership',
          body: 'Ask "if this rule changes, which class do I edit?" Cancellation-before-shipment belongs in `Order.cancel()` next to the status it guards — not in a service method that also prices and persists.\n\nRules colocated with their state survive requirement edits; rules scattered across services do not.',
        },
      ],
      javaCode: [
        {
          title: 'Invoice math stays with the invoice',
          description: 'Coherent calculations owned by the entity they describe.',
          code: `public class InvoiceMath {
    static class Invoice {
        private final long[] lines;

        Invoice(long... lines) {
            this.lines = lines.clone();
        }

        long subtotal() {
            long sum = 0;
            for (long line : lines) {
                sum += line;
            }
            return sum;
        }

        long tax() {
            return subtotal() / 10; // 10% rule lives with the math
        }

        long total() {
            return subtotal() + tax();
        }
    }

    public static void main(String[] args) {
        Invoice invoice = new Invoice(100, 200, 300);
        System.out.println(invoice.total()); // 660
    }
}`,
        },
      ],
      diagrams: ['srp-split'],
      keyTakeaways: [
        'SRP counts coherent responsibilities, never methods.',
        'Change drivers reveal boundaries better than gut feel.',
        'Coordinating collaborators is still one responsibility.',
        'Split on real change ownership, not mechanical slicing.',
      ],
      interviewTips: [
        'Narrate the split: "pricing changes hit PricingService; nothing else moves."',
        'Reject both God classes and confetti classes by name.',
      ],
      pitfalls: [
        'Fragmenting into meaningless micro-classes with coupled names.',
        'Letting services absorb entity rules that belong beside state.',
        'Naming by mechanics (Manager, Handler) instead of responsibility.',
      ],
      quiz: [
        {
          question: 'An Invoice with subtotal/tax/total violates SRP when…',
          options: ['It has three methods', 'It also saves to the DB and sends email', 'It uses long instead of Money', 'It is immutable'],
          answerIndex: 1,
          explanation: 'Persistence and communication are different change drivers from calculation.',
        },
        {
          question: 'What is the practical SRP test?',
          options: ['Counting methods', '"If this rule changes, which class do I edit?"', 'Alphabetizing members', 'Removing all collaborators'],
          answerIndex: 1,
          explanation: 'Single ownership per rule is what makes future changes local.',
        },
      ],
    },
    {
      slug: 'open-closed',
      title: 'Open-Closed Principle',
      order: 3,
      summary: 'Open for extension, closed for modification: isolate variation behind stable extension points.',
      subtopics: [
        {
          id: 'ocp-meaning',
          title: 'OCP',
          body: 'New behavior should arrive without repeatedly editing stable code. A `DiscountService` switching on REGULAR/PREMIUM/FESTIVAL strings must be modified for every new policy; one depending on a `DiscountPolicy` interface absorbs new policies as new classes.\n\nClosed never means frozen forever — fundamental meaning changes still edit core code. It means *predictable variation* stops touching stable paths.',
        },
        {
          id: 'extension-points',
          title: 'Extension points',
          body: 'An extension point is a deliberate socket for variation: `PaymentGateway`, `NotificationSender`, `PricingRule`, `TaxCalculator`. Good sockets name real variation (tax policy genuinely differs); bad ones (`StringProcessor` "because interfaces are good") add ceremony with no protected change.\n\nFrameworks like Spring make registration cheap — but the contract still needs a coherent capability behind it.',
        },
        {
          id: 'variation-question',
          title: 'Variation',
          body: 'The only OCP question that matters: "what is expected to vary?" Payment methods, tax rules, channels, storage providers, pricing — each earns its abstraction by answering yes.\n\nNo meaningful variation, no abstraction. A single stable tax formula stays a method, not a strategy hierarchy.',
        },
        {
          id: 'notification-example',
          title: 'Example: Notification Channels',
          body: 'A switch on EMAIL/SMS/PUSH routes every new channel through the service. Behind `NotificationSender`, each channel is a class and selection moves to the composition boundary.\n\nAdding WhatsApp becomes additive: one class plus registration, zero edits to existing senders or the service core.',
        },
      ],
      javaCode: [
        {
          title: 'Discount policies behind one interface',
          description: 'New policy = new class. The service never changes.',
          code: `public class DiscountPolicies {
    interface DiscountPolicy {
        long calculate(long subtotal);
    }

    static class RegularDiscount implements DiscountPolicy {
        @Override
        public long calculate(long subtotal) {
            return 0;
        }
    }

    static class FestivalDiscount implements DiscountPolicy {
        @Override
        public long calculate(long subtotal) {
            return subtotal / 5; // 20% off
        }
    }

    static class DiscountService {
        private final DiscountPolicy policy;

        DiscountService(DiscountPolicy policy) {
            this.policy = policy;
        }

        long calculate(long subtotal) {
            return policy.calculate(subtotal);
        }
    }

    public static void main(String[] args) {
        DiscountService service = new DiscountService(new FestivalDiscount());
        System.out.println(service.calculate(1000)); // 200
    }
}`,
        },
      ],
      diagrams: ['ocp-plugin'],
      keyTakeaways: [
        'Isolate expected variation behind stable interfaces.',
        'Extension points must name real, evidenced variation.',
        'Closed protects stable code; it never bans all edits.',
        'Selection logic belongs at the composition boundary.',
      ],
      interviewTips: [
        'Say what varies first, then show the socket: "discounts vary, so DiscountPolicy."',
        'Concede the limit: fundamental meaning changes still edit core code.',
      ],
      pitfalls: [
        'Speculative sockets with one implementation and no variation.',
        'Switch statements growing a case per release.',
        'Hiding selection inside the service instead of the boundary.',
      ],
      quiz: [
        {
          question: 'What does OCP protect stable code from?',
          options: ['All edits forever', 'Predictable variation in isolated areas', 'Compilation', 'Code review'],
          answerIndex: 1,
          explanation: 'Extension points absorb expected change; fundamental shifts still edit the core.',
        },
        {
          question: 'Where should channel selection live?',
          options: ['Inside each sender', 'At the composition boundary', 'In the database', 'Nowhere — hardcode it'],
          answerIndex: 1,
          explanation: 'Senders implement; one boundary place decides which sender runs.',
        },
      ],
    },
    {
      slug: 'liskov-substitution',
      title: 'Liskov Substitution Principle',
      order: 4,
      summary: 'Subtypes must honor supertype behavior: signatures match, contracts hold, no instanceof checks.',
      subtopics: [
        {
          id: 'lsp-behavior',
          title: 'LSP',
          body: 'LSP demands behavioral substitutability: any subtype must work wherever the supertype is expected, with no surprises. Matching signatures is necessary but nowhere near sufficient.\n\nAn `OfflinePaymentGateway` whose `charge()` throws `UnsupportedOperationException` compiles against `PaymentGateway` — and breaks every caller that reasonably charges through it.',
        },
        {
          id: 'substitutability-smells',
          title: 'Substitutability',
          body: 'The telltale smell is the `instanceof` check at call sites: branching on the concrete type proves the abstraction promises something implementations do not uniformly deliver.\n\nOther alarms: weakened validation, changed return semantics, violated invariants, and special-case handling scattered through clients. Each one says the hierarchy models syntax, not behavior.',
        },
        {
          id: 'penguin-fix',
          title: 'Subclass behavior',
          body: 'The classic failure: `Penguin extends Bird` overriding `fly()` to throw. The hierarchy claims penguins fly; reality disagrees. The repair splits capabilities — `Bird.eat()` for all birds, `FlyingBird.fly()` only for fliers — so `Sparrow` and `Penguin` each promise exactly what they deliver.\n\nWhen no honest common behavior exists, composition beats inheritance: hold a policy instead of claiming a false is-a.',
        },
        {
          id: 'api-contracts',
          title: 'LSP and API contracts',
          body: 'LSP governs interfaces too. A `Repository.findById` returning `null` in one implementation, throwing in another, and auto-creating in a third leaves callers guessing. `Optional<T>` makes absence explicit and every implementation substitutable.\n\nWrite contracts that implementations *can* uniformly honor, then hold them to it.',
        },
      ],
      javaCode: [
        {
          title: 'Birds that promise honestly',
          description: 'Capability split so no subtype ever throws for existing.',
          code: `public class HonestBirds {
    interface Bird {
        void eat();
    }

    interface FlyingBird extends Bird {
        void fly();
    }

    static class Sparrow implements FlyingBird {
        @Override
        public void eat() {
            System.out.println("sparrow eats");
        }

        @Override
        public void fly() {
            System.out.println("sparrow flies");
        }
    }

    static class Penguin implements Bird {
        @Override
        public void eat() {
            System.out.println("penguin eats");
        }
    }

    public static void main(String[] args) {
        Bird bird = new Penguin();
        bird.eat(); // safe: Bird promises only eat()
        FlyingBird flier = new Sparrow();
        flier.fly();
    }
}`,
        },
      ],
      diagrams: ['lsp-rectangle'],
      keyTakeaways: [
        'LSP is behavioral: subtypes must honor supertype promises.',
        'Signature match without behavior match still violates it.',
        '`instanceof` at call sites confesses a broken abstraction.',
        'Split capabilities until every subtype delivers fully.',
      ],
      interviewTips: [
        'Lead with the Penguin: everyone recognizes the broken promise instantly.',
        'Connect to composition: "where no honest is-a exists, hold a policy."',
      ],
      pitfalls: [
        'Throwing UnsupportedOperationException from inherited methods.',
        'Weakening validation or return guarantees in overrides.',
        'Assuming signature compatibility equals substitutability.',
      ],
      quiz: [
        {
          question: 'Why does Penguin-extends-Bird with throwing fly() violate LSP?',
          options: ['Penguins cannot eat', 'Callers reasonably expect every Bird to fly', 'Interfaces forbid birds', 'It uses too much memory'],
          answerIndex: 1,
          explanation: 'The hierarchy advertises flight; the subtype cannot deliver it.',
        },
        {
          question: 'What does repeated `instanceof` at call sites signal?',
          options: ['Great performance', 'The abstraction does not describe uniform behavior', 'Too few classes', 'Missing generics'],
          answerIndex: 1,
          explanation: 'Clients probing concrete types proves the contract is a fiction.',
        },
      ],
    },
    {
      slug: 'interface-segregation',
      title: 'Interface Segregation Principle',
      order: 5,
      summary: 'No client forced onto methods it never uses: split fat contracts by real client needs.',
      subtopics: [
        {
          id: 'isp-meaning',
          title: 'ISP',
          body: 'A fat interface couples clients to behavior they never touch. A payroll component needing only `generatePayroll()` should not depend on a six-method `EmployeeOperations` covering hiring, reviews, and leave.\n\nSegregation splits contracts around client needs: `EmployeeManagement`, `PayrollService`, `LeaveManagement` — each consumer holds exactly the capability it uses.',
        },
        {
          id: 'uoe-smell',
          title: 'UnsupportedOperationException',
          body: 'A method that exists only to throw is the contract confessing. `ReadOnlyUserService.createUser()` throwing means read clients were forced onto a write contract.\n\nThe repair is `UserReader` versus `UserWriter`: components implement one or both, and no client ever sees an operation it cannot honor.',
        },
        {
          id: 'decomposition-balance',
          title: 'Interface decomposition',
          body: 'Segregate by genuine client shapes — `OrderReader` versus `OrderWriter` where reads and writes truly diverge. But fragmentation has its own cost: per-field provider interfaces turn normal domain operations into assembly puzzles.\n\nSplit where clients differ; stop where cohesion would shatter.',
        },
        {
          id: 'dependency-clarity',
          title: 'Interface dependencies',
          body: 'Narrow dependencies document intent: `PayrollProcessor` holding `PayrollService` says what it needs in one type. Holding the fat interface says nothing and couples everything.\n\nReview every constructor parameter: could a smaller contract satisfy this client? If yes, shrink it.',
        },
      ],
      javaCode: [
        {
          title: 'Reader and writer, never both forced',
          description: 'Segregated contracts let read-only services promise honestly.',
          code: `public class SegregatedUsers {
    record User(String name) {
    }

    interface UserReader {
        User getUser(long id);
    }

    interface UserWriter {
        void createUser(User user);
    }

    static class ReadOnlyDirectory implements UserReader {
        @Override
        public User getUser(long id) {
            return new User("user-" + id);
        }
    }

    public static void main(String[] args) {
        UserReader directory = new ReadOnlyDirectory();
        System.out.println(directory.getUser(7).name()); // user-7
    }
}`,
        },
      ],
      diagrams: ['isp-split'],
      keyTakeaways: [
        'Clients depend only on methods they actually use.',
        'Fat interfaces couple unrelated consumers together.',
        'Throwing stubs reveal contracts nobody can fully honor.',
        'Segregate by client shape, not into dust.',
      ],
      interviewTips: [
        'Show the before/after constructor parameter — the shrink is the argument.',
        'Defend the stopping point: why not split further?',
      ],
      pitfalls: [
        'Per-field micro-interfaces that fragment normal operations.',
        'Leaving throwing stubs "temporarily" — they calcify.',
        'One mega-interface per domain "for convenience".',
      ],
      quiz: [
        {
          question: 'A read-only service throwing on createUser indicates…',
          options: ['Great security', 'A fat contract forced onto a narrow client', 'Too many records', 'Missing builders'],
          answerIndex: 1,
          explanation: 'The interface promises more than this client can deliver — split it.',
        },
        {
          question: 'What bounds segregation?',
          options: ['Nothing — split forever', 'Genuine client differences; stop before cohesion shatters', 'Alphabetical order', 'File count'],
          answerIndex: 1,
          explanation: 'Segregation serves real client shapes, not theoretical purity.',
        },
      ],
    },
    {
      slug: 'dependency-inversion',
      title: 'Dependency Inversion Principle',
      order: 6,
      summary: 'Policy depends on abstractions, never on SDKs: invert the arrows toward stable capabilities.',
      subtopics: [
        {
          id: 'dip-meaning',
          title: 'DIP',
          body: 'High-level policy must not know low-level details: both depend on abstractions, and abstractions never depend on details. Ask of any class: "does my business policy name a specific infrastructure technology?" If yes, the arrow points the wrong way.\n\n`CheckoutService` depending on `PaymentGateway` (with `StripePaymentGateway` implementing it) keeps checkout ignorant of SDKs, drivers, and wire formats.',
        },
        {
          id: 'policy-vs-detail',
          title: 'Policy vs implementation',
          body: 'Policy reads like business intent — place order, charge payment, reserve inventory. Details read like vendor manuals — Stripe SDK, Postgres driver, Kafka client, SMTP library.\n\nInversion puts the interface on the policy side: infrastructure adapts upward to the business contract instead of business code reaching down into SDKs.',
        },
        {
          id: 'ioc-di',
          title: 'Inversion of control',
          body: 'Objects that `new` their dependencies control construction and weld themselves to concretes. Inverted objects receive collaborators — via constructors — leaving a composition root or framework to assemble the graph.\n\nInjection is the technique; inversion is the principle. Spring wires objects, but only contract direction decides whether the design inverts.',
        },
        {
          id: 'no-ceremony',
          title: 'DIP does not mean "interface everywhere"',
          body: '`OrderServiceInterface` with a single `OrderServiceImpl` protects nothing: no variation, no boundary, no architectural benefit — just ceremony. Create the seam where substitution, testing, or provider independence genuinely pays.\n\nEvery abstraction invoices complexity; only real boundaries can afford the bill.',
        },
      ],
      javaCode: [
        {
          title: 'Policy above the provider',
          description: 'Checkout depends on the gateway contract; Stripe stays below it.',
          code: `public class PolicyAboveProvider {
    record Charge(String id) {
    }

    interface PaymentGateway {
        Charge charge(long amountInPaise);
    }

    static class StripeGateway implements PaymentGateway {
        @Override
        public Charge charge(long amountInPaise) {
            return new Charge("stripe-" + amountInPaise);
        }
    }

    static class CheckoutService {
        private final PaymentGateway gateway;

        CheckoutService(PaymentGateway gateway) {
            this.gateway = gateway;
        }

        String checkout(long amountInPaise) {
            return gateway.charge(amountInPaise).id();
        }
    }

    public static void main(String[] args) {
        CheckoutService checkout = new CheckoutService(new StripeGateway());
        System.out.println(checkout.checkout(500)); // stripe-500
    }
}`,
        },
      ],
      diagrams: ['dependency-inversion'],
      keyTakeaways: [
        'Policy depends on abstractions; implementations adapt upward.',
        'Constructor injection declares needs; frameworks assemble graphs.',
        'Inversion is direction, injection is mechanism — don’t conflate them.',
        'Seams without variation are ceremony, not design.',
      ],
      interviewTips: [
        'Draw the before/after arrows: down into SDK versus up into the contract.',
        'Name the litmus test: "does my policy name a vendor?"',
      ],
      pitfalls: [
        'Single-implementation `XxxInterface`/`XxxImpl` pairs with no boundary.',
        'Constructor bodies that `new` infrastructure directly.',
        'Calling injection (the mechanism) a substitute for direction (the principle).',
      ],
      quiz: [
        {
          question: 'What makes CheckoutService DIP-compliant?',
          options: ['It uses Spring', 'It depends on PaymentGateway, never on Stripe classes', 'It has many methods', 'It avoids constructors'],
          answerIndex: 1,
          explanation: 'Policy sees only the business contract; provider details stay below it.',
        },
        {
          question: 'When is an interface NOT justified?',
          options: ['Provider variation exists', 'No substitution, boundary, or benefit exists', 'Tests need fakes', 'Two vendors ship'],
          answerIndex: 1,
          explanation: 'Without variation or independence to protect, the seam is pure ceremony.',
        },
      ],
    },
    {
      slug: 'dry-kiss-yagni',
      title: 'DRY, KISS, and YAGNI Principles',
      order: 7,
      summary: 'Knowledge over text, simplicity over machinery, and building only what requirements evidence.',
      subtopics: [
        {
          id: 'dry-knowledge',
          title: 'DRY',
          body: 'DRY bans duplicated knowledge, not duplicated lines. When "adults must be 18" lives in five places, the threshold change becomes surgery; when two methods merely share text shape for different concepts, merging them manufactures coupling.\n\nGive the rule one owner — ideally the object whose state the rule guards — and let coincidental resemblance stay duplicated.',
        },
        {
          id: 'kiss-minimum',
          title: 'KISS',
          body: 'Keep the minimum complexity that safely solves the actual problem. A delivery charge of distance × rate is one method — not a StrategyFactory with a plugin registry and a configuration DSL.\n\nSophistication is fine when the problem demands it; machinery for its own sake taxes every future reader, including you.',
        },
        {
          id: 'yagni-evidence',
          title: 'YAGNI',
          body: 'Do not build for imaginary futures: five repository implementations "for flexibility" when only PostgreSQL is required multiplies maintenance, testing, and configuration for zero benefit.\n\nThe distinction that saves YAGNI from recklessness: preparing for change (clean boundaries) is not implementing every possible future (speculative features). Evidence of variation earns abstraction; imagination does not.',
        },
        {
          id: 'simplicity-balance',
          title: 'Future requirements',
          body: 'A `PaymentGateway` abstraction is justified when provider replacement is realistic; a dynamic plugin marketplace "maybe someday" is not. Calibrate to credible change: name the requirement that would force the abstraction, and build it when that requirement arrives.\n\nReview check: can anyone point at the variation this structure protects? Silence means delete.',
        },
      ],
      javaCode: [
        {
          title: 'One owner for the cancel rule',
          description: 'DRY applied to knowledge: the rule lives with the state it guards.',
          code: `public class CancelRule {
    enum Status { CREATED, CONFIRMED, SHIPPED, CANCELLED }

    static class Order {
        private Status status = Status.CREATED;

        boolean canCancel() {
            return status != Status.SHIPPED; // single owner of the rule
        }

        void cancel() {
            if (!canCancel()) {
                throw new IllegalStateException("Too late to cancel");
            }
            status = Status.CANCELLED;
        }
    }

    public static void main(String[] args) {
        Order order = new Order();
        System.out.println(order.canCancel()); // true
        order.cancel();
        System.out.println(order.canCancel()); // false
    }
}`,
        },
      ],
      diagrams: ['simplicity-triptych'],
      keyTakeaways: [
        'DRY the business rule, not the resemblance.',
        'KISS targets minimum safe complexity for the real requirement.',
        'YAGNI blocks speculative features, not clean boundaries.',
        'Every abstraction must name the variation it protects.',
      ],
      interviewTips: [
        'When shown duplication, ask "same knowledge or same shape?" before merging.',
        'Defend simplicity with the requirement quote, not taste.',
      ],
      pitfalls: [
        'Merging coincidentally similar code from different domains.',
        'Strategy hierarchies for calculations with no variation.',
        'Five-database designs for one-database requirements.',
      ],
      quiz: [
        {
          question: 'Two methods both check `age >= 18` for different features. DRY says…',
          options: ['Merge them immediately', 'Merge only if they encode the same business rule', 'Delete one', 'Extract a framework'],
          answerIndex: 1,
          explanation: 'Shared text is harmless; shared knowledge in two places is the risk.',
        },
        {
          question: 'What distinguishes preparing for change from overengineering?',
          options: ['Nothing — both add code', 'Clean boundaries now versus speculative features now', 'The number of interfaces', 'Using Spring or not'],
          answerIndex: 1,
          explanation: 'Boundaries keep options open cheaply; speculative features spend budget on imagination.',
        },
      ],
    },
    {
      slug: 'cohesion-coupling',
      title: 'High Cohesion and Loose Coupling',
      order: 8,
      summary: 'Belonging inside modules, ignorance between them, and the blast radius that measures both.',
      subtopics: [
        {
          id: 'cohesion-belonging',
          title: 'Cohesion',
          body: 'Cohesion asks whether a module’s pieces belong together: an `Order` with status, items, total, `cancel()`, and `confirm()` reads as one concept. An `ApplicationManager` with tax, email, users, PDFs, cache, and CSV reads as six accidents sharing a file.\n\nHigh cohesion makes each component describable in one breath — and changeable for one reason.',
        },
        {
          id: 'coupling-knowledge',
          title: 'Coupling',
          body: 'Coupling asks how much modules know about each other. A service holding Stripe, JDBC, Kafka, Redis, and SMTP clients knows five infrastructures; the same service on gateway, repository, publisher, and cache abstractions knows four capabilities.\n\nZero coupling is not the goal — a useful system connects. The goal is coupling that is intentional, minimal, and aimed at stable contracts.',
        },
        {
          id: 'blast-radius',
          title: 'Change blast radius',
          body: 'Blast radius measures how much must move when one requirement changes. Replacing a payment provider should touch the provider adapter — not the controller, order entity, database mapping, event producer, and every test.\n\nWhen a small change detonates widely, provider details have leaked past their boundary. Pull them back behind the contract.',
        },
        {
          id: 'boundaries-ownership',
          title: 'Module boundaries',
          body: 'A boundary answers four questions: what does this module own, what does it expose, what does it hide, and what may change internally without disturbing clients? A checkout module publishing `CheckoutService` while hiding orchestration, persistence, and provider code lets all three evolve independently.\n\nCohesion plus loose coupling converges on small blast radii — that is the whole ballgame.',
        },
      ],
      javaCode: [
        {
          title: 'Capabilities, not clients, in the fields',
          description: 'The same service, rewired from infrastructure to abstractions.',
          code: `public class CapabilityFields {
    interface PaymentGateway {
        String charge(long amount);
    }

    interface OrderRepository {
        void save(String order);
    }

    static class OrderService {
        private final PaymentGateway paymentGateway;
        private final OrderRepository orderRepository;

        OrderService(PaymentGateway paymentGateway, OrderRepository orderRepository) {
            this.paymentGateway = paymentGateway;
            this.orderRepository = orderRepository;
        }

        String checkout(String order, long amount) {
            String receipt = paymentGateway.charge(amount);
            orderRepository.save(order);
            return receipt;
        }
    }

    public static void main(String[] args) {
        OrderService service = new OrderService(
            amount -> "receipt-" + amount,
            order -> System.out.println("saved " + order));
        System.out.println(service.checkout("book", 500));
    }
}`,
        },
      ],
      diagrams: ['blast-radius'],
      keyTakeaways: [
        'Cohesion groups what belongs; coupling limits what is known.',
        'Blast radius is the observable score of both.',
        'Depend on capabilities, never on client libraries.',
        'Boundaries must answer own/expose/hide/change-freely.',
      ],
      interviewTips: [
        'Trace one change ("swap the provider") through the diagram and count touched boxes.',
        'Say "blast radius of one" as the ideal for provider swaps.',
      ],
      pitfalls: [
        'Field lists naming SDKs instead of capabilities.',
        'God "Manager" classes with unrelated method grab-bags.',
        'Chasing zero coupling into useless, disconnected modules.',
      ],
      quiz: [
        {
          question: 'What does blast radius measure?',
          options: ['Lines of code', 'How much must move when one requirement changes', 'Test runtime', 'Memory usage'],
          answerIndex: 1,
          explanation: 'Small blast radius means provider swaps stay inside their adapters.',
        },
        {
          question: 'Why prefer gateway/repository fields over SDK clients?',
          options: ['Fewer imports', 'Capabilities stay stable while providers vary', 'Faster compilation', 'Longer names'],
          answerIndex: 1,
          explanation: 'Abstraction fields decouple policy from infrastructure churn.',
        },
      ],
    },
    {
      slug: 'law-of-demeter',
      title: 'Law of Demeter',
      order: 9,
      summary: 'Talk to friends, not strangers: delegate instead of navigating object graphs.',
      subtopics: [
        {
          id: 'demeter-idea',
          title: 'Law of Demeter',
          body: 'An object should limit its knowledge of collaborators’ internals. `order.getCustomer().getAddress().getCity().getName()` couples the caller to four structural decisions — any reshuffle breaks every such chain.\n\nThe repair delegates: `order.shippingCityName()` keeps the navigation inside the object that owns it.',
        },
        {
          id: 'delegation-fix',
          title: 'Delegation',
          body: 'Move the knowledge to its owner. Instead of testing `order.getCustomer().getMembership().getLevel() == PREMIUM` from outside, ask `order.customerIsPremium()` — or better, `order.calculateDiscount()`, letting the domain own the rule entirely.\n\nEach delegation removes one structural dependency from callers and gives the rule a single maintainable home.',
        },
        {
          id: 'chains-vs-builders',
          title: 'Coupling through object chains',
          body: 'The classic smell is `a.getB().getC().getD().doSomething()` — four couplings for one effect. But not every chain sins: builder calls (`builder.name(..).email(..).build()`) return the same receiver by design, navigating nothing.\n\nJudge chains by knowledge exposed, not dot count. Fluent APIs on one object are fine; spelunking through four foreign graphs is not.',
        },
        {
          id: 'mock-smell',
          title: 'Mocking reveals violations',
          body: 'Tests that stub `when(a.getB()).thenReturn(b); when(b.getC()).thenReturn(c); when(c.getD())…` are confessing the production code knows too much. Each stubbed link is a hidden dependency.\n\nWhen mocks chain, shorten the production chain first — the tests simplify themselves afterward.',
        },
      ],
      javaCode: [
        {
          title: 'Delegate instead of spelunking',
          description: 'One behavior method replaces a four-link navigation chain.',
          code: `public class DemeterDelegation {
    static class City {
        private final String name;

        City(String name) {
            this.name = name;
        }
    }

    static class Address {
        private final City city;

        Address(City city) {
            this.city = city;
        }
    }

    static class Customer {
        private final Address address;

        Customer(Address address) {
            this.address = address;
        }

        String shippingCityName() {
            return address.city.name; // navigation lives with the owner
        }
    }

    static class Order {
        private final Customer customer;

        Order(Customer customer) {
            this.customer = customer;
        }

        String shippingCityName() {
            return customer.shippingCityName(); // one hop, not four
        }
    }

    public static void main(String[] args) {
        Order order = new Order(new Customer(new Address(new City("Pune"))));
        System.out.println(order.shippingCityName()); // Pune
    }
}`,
        },
      ],
      diagrams: ['train-wreck'],
      keyTakeaways: [
        'Limit knowledge of collaborators’ internal structure.',
        'Delegate navigation to the object that owns it.',
        'Fluent single-receiver chains are fine; foreign-graph spelunking is not.',
        'Chained mocks diagnose production coupling.',
      ],
      interviewTips: [
        'Rewrite one train-wreck live into a delegate method.',
        'Concede builders as the principled exception.',
      ],
      pitfalls: [
        'Exposing getters solely so outsiders can navigate deeper.',
        'Counting dots instead of judging knowledge exposure.',
        'Forcing delegation where a stable data carrier is the honest model.',
      ],
      quiz: [
        {
          question: 'Why is `order.getCustomer().getAddress().getCity()` risky?',
          options: ['It is too short', 'Caller couples to four structural decisions that may change', 'Getters are forbidden', 'It allocates too much'],
          answerIndex: 1,
          explanation: 'Every link is a dependency on someone else’s representation.',
        },
        {
          question: 'Tests stubbing a.getB().getC().getD() suggest…',
          options: ['Excellent coverage', 'Production code knows too much about internals', 'Need for more mocks', 'Static analysis failure'],
          answerIndex: 1,
          explanation: 'Chained stubs mirror chained navigation — shorten the production chain.',
        },
      ],
    },
    {
      slug: 'separation-concerns-hiding',
      title: 'Separation of Concerns and Information Hiding',
      order: 10,
      summary: 'Distinct decisions in distinct places, with implementation details hidden behind contracts.',
      subtopics: [
        {
          id: 'soc-layers',
          title: 'Separation of concerns',
          body: 'Separate kinds of decisions: controllers speak HTTP, services orchestrate use cases, domain models guard invariants, repositories promise persistence, infrastructure implements it. Each layer exists because its decisions change for different reasons.\n\nA controller running SQL, pricing rules, provider calls, and email logic has no reason to exist as one unit — split until each piece answers a different "why did this change?"',
        },
        {
          id: 'info-hiding',
          title: 'Information hiding',
          body: 'Hide what clients must not depend on: `FileStorage.upload()` reveals nothing about buckets, path conventions, multipart handling, SDKs, or retries. Callers depend on the capability; all five details stay replaceable.\n\nHidden decisions can evolve freely; leaked ones freeze the moment external code observes them.',
        },
        {
          id: 'responsibility-map',
          title: 'Responsibilities',
          body: 'A clean map reads: controller owns HTTP, service owns orchestration, order owns invariants, repository owns the persistence contract, JPA classes own the mapping. No layer decides what another layer should decide.\n\nBoundaries follow responsibilities, never package-count aesthetics — five empty layers with one real decision is ceremony.',
        },
        {
          id: 'repository-boundary',
          title: 'Repository abstraction',
          body: '`OrderRepository` with `findById`/`save` shields domain code from JPA, JDBC, Mongo, or remote APIs. The abstraction earns its keep exactly when storage varies or tests need fakes.\n\nBut repositories guard persistence, not business: discount eligibility and pricing rules live in domain services and entities, never in repository implementations.',
        },
      ],
      javaCode: [
        {
          title: 'Storage hidden behind a capability',
          description: 'Callers see upload; buckets and SDKs stay inside.',
          code: `import java.util.HashMap;
import java.util.Map;

public class HiddenStorage {
    record FileId(String value) {
    }

    interface FileStorage {
        FileId upload(byte[] content);
    }

    static class InMemoryFileStorage implements FileStorage {
        private final Map<String, byte[]> buckets = new HashMap<>();
        private int next;

        @Override
        public FileId upload(byte[] content) {
            String key = "file-" + (++next);
            buckets.put(key, content.clone());
            return new FileId(key);
        }
    }

    public static void main(String[] args) {
        FileStorage storage = new InMemoryFileStorage();
        System.out.println(storage.upload(new byte[]{1, 2, 3}).value()); // file-1
    }
}`,
        },
      ],
      diagrams: ['layered-onion'],
      keyTakeaways: [
        'Separate decisions that change for different reasons.',
        'Hide implementation choices clients must not observe.',
        'Boundaries follow responsibilities, not layer-count fashion.',
        'Repositories isolate persistence, never host business rules.',
      ],
      interviewTips: [
        'Walk one request top-to-bottom naming each layer’s decision.',
        'Justify every layer by the change it absorbs.',
      ],
      pitfalls: [
        'Controllers with SQL and provider calls baked in.',
        'Repositories deciding discounts or eligibility.',
        'Leaking SDK types through supposedly stable contracts.',
      ],
      quiz: [
        {
          question: 'What should a repository never decide?',
          options: ['How to persist', 'Business rules like discount eligibility', 'Connection pooling', 'Mapping rows'],
          answerIndex: 1,
          explanation: 'Repositories guard persistence mechanics; domain rules live in domain code.',
        },
        {
          question: 'Why hide the storage bucket convention?',
          options: ['Security through obscurity', 'Callers depending on it freeze future changes', 'It saves memory', 'Compilers require it'],
          answerIndex: 1,
          explanation: 'Observed details become depended-upon details; hidden ones stay changeable.',
        },
      ],
    },
    {
      slug: 'designing-for-testability',
      title: 'Designing for Testability: The Ultimate Proof of Loose Coupling',
      order: 11,
      summary: 'Seams that admit fakes, behavior worth observing, and tests that stay honest.',
      subtopics: [
        {
          id: 'testability-signal',
          title: 'Testability',
          body: 'A class constructing its own `StripeClient` can only be tested with Stripe — or heroic interception. The same class taking a `PaymentGateway` tests with a one-line fake.\n\nTestability is not the goal; it is the *signal*. Easy substitution proves the boundary is healthy; painful setup proves coupling.',
        },
        {
          id: 'seams-three',
          title: 'Construction seams',
          body: 'Constructors are the premier seam: `ReportService(PdfGenerator)` substitutes freely where `new PdfGenerator()` inside `generate()` seals the dependency shut.\n\nControl seams (`Clock` with `SystemClock` versus `FixedClock`) make time deterministic for expirations and deadlines. Observation seams assert outcomes — confirmed status, published events — never private flags.',
        },
        {
          id: 'isolation-mocks',
          title: 'Isolation',
          body: 'A focused test answers one question — "does checkout coordinate correctly?" — with fakes standing in for payment, inventory, and persistence. No Stripe, no Postgres, no Kafka for a unit of business logic.\n\nBut mocks that verify trivia instead of collaboration smell: chained stubbing usually exposes Demeter violations, and tests asserting private state freeze implementation.',
        },
        {
          id: 'checkout-proof',
          title: 'Example: Testable Checkout',
          body: 'A checkout taking gateway, inventory, and repository through its constructor, then reserving, charging, confirming, and saving in order, tests completely with fakes. The design earns it: meaningful explicit dependencies with nothing hidden.\n\nGood boundaries make testing boring — and boring tests are the compliment.',
        },
      ],
      javaCode: [
        {
          title: 'Checkout with a fake gateway',
          description: 'Constructor seam admits a lambda; behavior asserts the outcome.',
          code: `public class TestableCheckout {
    interface PaymentGateway {
        String charge(long amount);
    }

    static class CheckoutService {
        private final PaymentGateway gateway;

        CheckoutService(PaymentGateway gateway) {
            this.gateway = gateway;
        }

        String checkout(long amount) {
            return "receipt:" + gateway.charge(amount);
        }
    }

    public static void main(String[] args) {
        PaymentGateway fake = amount -> "test-charge";
        CheckoutService service = new CheckoutService(fake);
        String receipt = service.checkout(500);
        if (!receipt.equals("receipt:test-charge")) {
            throw new AssertionError(receipt);
        }
        System.out.println(receipt);
    }
}`,
        },
      ],
      diagrams: ['seam-diagram'],
      keyTakeaways: [
        'Test pain diagnoses coupling; easy fakes confirm boundaries.',
        'Constructors, clocks, and observable outcomes are the three seams.',
        'Isolate the unit; mock collaboration, not trivia.',
        'Needing production to test a unit indicts the design.',
      ],
      interviewTips: [
        'Offer the fake-in-one-line test as evidence for any boundary claim.',
        'Distinguish behavior assertions from implementation spying.',
      ],
      pitfalls: [
        'Chained stubs papering over train-wreck navigation.',
        'Asserting private flags instead of observable outcomes.',
        'Spinning Spring, databases, and brokers for pure business logic.',
      ],
      quiz: [
        {
          question: 'What does painful test setup usually prove?',
          options: ['Thorough testing', 'Excessive coupling in the design', 'Slow hardware', 'Missing documentation'],
          answerIndex: 1,
          explanation: 'When fakes cannot reach the seams, dependencies point the wrong way.',
        },
        {
          question: 'Why prefer a FixedClock over Instant.now() in code under test?',
          options: ['It runs faster', 'Time becomes a deterministic control seam', 'It uses less memory', 'Clocks are singletons'],
          answerIndex: 1,
          explanation: 'Injected time makes expirations and deadlines repeatable.',
        },
      ],
    },
    // __MORE_TOPICS__
  ],
};

