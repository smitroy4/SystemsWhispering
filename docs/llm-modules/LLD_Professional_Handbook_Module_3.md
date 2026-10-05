# Module 3: Core Design Principles

This module develops the principles that guide good low-level design before design patterns are introduced. The goal is not to memorize slogans such as SOLID, DRY, or KISS. The goal is to learn how to reason about change, responsibility, dependencies, contracts, and boundaries so that a design remains understandable and adaptable as requirements evolve.

---

## Introduction to Design Principles

### Design principles

Design principles are guidelines for making software design decisions that remain healthy as a system changes.

A design principle is not a rigid law. It is a reasoning tool. When two designs both work today, principles help us predict which design will be easier to change tomorrow.

Consider a notification feature:

```java
class NotificationService {

    public void send(String channel, String recipient, String message) {
        if (channel.equals("EMAIL")) {
            // email implementation
        } else if (channel.equals("SMS")) {
            // SMS implementation
        } else if (channel.equals("PUSH")) {
            // push implementation
        }
    }
}
```

This works for three channels. But suppose the product adds WhatsApp, Slack, retry policies, templates, provider failover, and delivery tracking.

The problem is not that the original code was syntactically wrong. The problem is that one class accumulated knowledge about many changing concerns.

Good design principles help us ask:

- What is likely to change?
- Which class should own that change?
- Which code should remain stable?
- What should depend on what?
- Where should variation live?
- What contract should clients rely on?
- How can we test a unit without constructing the entire system?

The central LLD mindset is:

> **Design around responsibilities, contracts, and likely change rather than around classes alone.**

A class diagram is the result of design reasoning; it is not the reasoning itself.

### Cost of change

Software design becomes valuable when requirements change.

Suppose a payment system initially supports cards:

```java
class PaymentService {

    public void pay(Order order, Card card) {
        // validate
        // charge card
        // update order
    }
}
```

Later, the system needs:

- UPI
- wallets
- bank transfers
- refunds
- payment provider failover
- fraud checks

If every new payment type requires modifying the same central class, the cost of change grows.

A useful mental model is:

```text
Cost of change
      |
      |          poorly structured design
      |        /
      |      /
      |    /
      |  /
      |_/________________
             time
```

Good design does not mean eliminating change. Change is unavoidable.

Good design means:

- localizing change,
- reducing the number of affected modules,
- protecting stable business rules,
- reducing regression risk,
- making tests easier,
- making dependencies explicit.

This is why coupling and cohesion matter so much.

### Change

A design should explicitly account for variation.

There are several useful categories of change:

**Requirement change**

Example:

```text
"Orders can be cancelled only before shipment."
```

becomes:

```text
"Orders can be cancelled before shipment,
or within 30 minutes after shipment for premium users."
```

**Technology change**

Example:

```text
PostgreSQL -> another database
REST provider -> another payment provider
```

**Policy change**

Example:

```text
Discount rules change during a festival.
```

**Scale change**

Example:

```text
Synchronous email sending -> asynchronous notification processing
```

**Operational change**

Example:

```text
One payment provider -> provider failover
```

A strong design tries to isolate each kind of likely variation.

### Contract

A contract defines what a component promises to its clients.

For example:

```java
public interface PaymentGateway {

    PaymentResult charge(Money amount, PaymentMethod method);
}
```

The caller knows:

- it can request a charge,
- it provides the required inputs,
- it receives a result.

The caller does not need to know:

- which HTTP client is used,
- how authentication works,
- which provider SDK is used,
- how request serialization works.

This creates a boundary.

A contract can include:

- method signatures,
- accepted inputs,
- returned outputs,
- exceptions,
- state transitions,
- behavioral guarantees,
- invariants.

A weak abstraction hides almost nothing:

```java
interface PaymentGateway {
    StripeClient getStripeClient();
    String getApiKey();
    HttpClient getHttpClient();
}
```

This leaks implementation details.

A stronger abstraction exposes the business operation:

```java
interface PaymentGateway {
    PaymentResult charge(Money amount, PaymentMethod method);
}
```

The second contract is more stable because it represents the business capability rather than one implementation.

### Restraint

Good LLD requires restraint.

A common mistake is assuming that more abstraction automatically means better design.

For example:

```text
Controller
  -> Service
      -> Manager
          -> Coordinator
              -> Handler
                  -> Processor
                      -> Strategy
```

If each class contains only one trivial method and there is no meaningful variation, the design may be harder to understand than a simpler one.

Restraint means:

- do not abstract without a reason,
- do not introduce patterns because they are fashionable,
- do not create interfaces for every class automatically,
- do not predict every imaginable future requirement,
- do not create layers that add no meaningful boundary.

The question is not:

> "Can I abstract this?"

The better question is:

> "What change or dependency does this abstraction protect?"

### SOLID

SOLID is a group of five object-oriented design principles:

- **S** — Single Responsibility Principle
- **O** — Open-Closed Principle
- **L** — Liskov Substitution Principle
- **I** — Interface Segregation Principle
- **D** — Dependency Inversion Principle

SOLID is useful because it gives names to recurring design problems.

However, SOLID should not be treated as five independent rules.

They interact:

```text
SRP -> clear responsibilities
        |
        v
OCP -> isolate variation
        |
        v
LSP -> preserve behavioral contracts
        |
        v
ISP -> keep contracts focused
        |
        v
DIP -> protect high-level policy from implementation details
```

A practical interpretation is:

> Keep responsibilities coherent, isolate variation, preserve contracts, expose focused interfaces, and depend on stable abstractions where that dependency buys useful flexibility.

### DRY

DRY stands for **Don't Repeat Yourself**.

The important interpretation is not:

> "Never write the same line twice."

It is:

> "Do not maintain the same piece of knowledge in multiple places."

For example:

```java
if (age >= 18) {
    // allowed
}
```

appearing in two methods is not automatically a DRY violation.

But if the business rule is:

```text
Adults must be at least 18.
```

and the system stores the rule in five unrelated places, changing the legal threshold becomes risky.

DRY is about duplicated **knowledge**, not merely duplicated text.

### KISS

KISS means **Keep It Simple**.

A simple design:

- has understandable responsibilities,
- minimizes unnecessary indirection,
- uses the smallest useful abstraction,
- makes control flow obvious.

For example, if a requirement is simply:

```text
Calculate total = item price × quantity.
```

this may be enough:

```java
public Money calculateTotal(OrderItem item) {
    return item.price().multiply(item.quantity());
}
```

Introducing five strategies and factories for a calculation that has no variation would reduce clarity.

### YAGNI

YAGNI means **You Aren't Gonna Need It**.

Do not build functionality merely because it might be useful later.

Bad:

```java
class User {
    // support for future biometric authentication
    // future loyalty system
    // future blockchain identity
    // future multi-tenant permissions
}
```

if none of those requirements exist.

YAGNI does not mean ignoring architecture.

It means:

- design clean boundaries,
- avoid speculative features,
- introduce abstractions when they solve a current or reasonably evidenced design problem.

A useful distinction:

```text
Preparing for change != implementing every possible future
```

---

## Single Responsibility Principle

### SRP

The Single Responsibility Principle says that a class should have one coherent responsibility and, in the classic formulation, one reason to change.

It is often misunderstood as:

> "A class must have exactly one method."

That is incorrect.

A class can have many methods while still owning one cohesive responsibility.

Example:

```java
class Invoice {

    public Money subtotal() {
        // ...
    }

    public Money tax() {
        // ...
    }

    public Money total() {
        // ...
    }
}
```

These methods all participate in the responsibility of representing invoice calculations.

Contrast that with:

```java
class InvoiceService {

    public Money calculateTotal(Invoice invoice) {
        // ...
    }

    public void saveToDatabase(Invoice invoice) {
        // ...
    }

    public void sendEmail(Invoice invoice) {
        // ...
    }

    public byte[] generatePdf(Invoice invoice) {
        // ...
    }
}
```

This class mixes:

- business calculation,
- persistence,
- communication,
- document rendering.

Those concerns change for different reasons.

### One reason to change

The phrase "one reason to change" is more useful than "one responsibility" because it connects design to requirements.

Imagine:

```java
class OrderService {

    public void placeOrder(Order order) {
        // validate
        // calculate price
        // save
        // send notification
    }
}
```

Possible changes include:

```text
Pricing rules change
Database changes
Notification provider changes
Order validation changes
```

The class now has multiple change drivers.

A better decomposition:

```text
OrderService
    -> OrderValidator
    -> PricingService
    -> OrderRepository
    -> NotificationService
```

The application service coordinates the workflow, while each collaborator owns a coherent concern.

### Responsibility

A responsibility should be expressed in business or technical terms that make sense.

Examples:

```text
Order
    owns order state and order invariants

PricingService
    calculates prices according to pricing policy

OrderRepository
    persists and retrieves orders

NotificationService
    coordinates notifications
```

A weak responsibility name often indicates a weak boundary:

```text
CommonUtils
Helper
Manager
Processor
Handler
Service
```

These names are not automatically wrong, but they often hide unclear ownership.

### Change ownership

A useful design question is:

> "If this rule changes, which class should I modify?"

Suppose the cancellation rule is:

```text
An order can be cancelled only before shipment.
```

The rule should have an obvious owner.

```java
public class Order {

    private OrderStatus status;

    public void cancel() {
        if (status != OrderStatus.CREATED &&
            status != OrderStatus.CONFIRMED) {
            throw new IllegalStateException(
                "Order cannot be cancelled"
            );
        }

        status = OrderStatus.CANCELLED;
    }
}
```

Now the invariant is close to the state it protects.

This is often preferable to:

```java
orderService.cancel(order);
```

containing every order-state rule.

### Collaborators

SRP does not mean a class must work alone.

A well-designed class can collaborate with several objects.

For example:

```text
CheckoutService
   |
   +--> OrderRepository
   +--> PaymentGateway
   +--> InventoryService
   +--> NotificationPublisher
```

The service has one responsibility: coordinating checkout.

Its collaborators have their own responsibilities.

The key is that the service should not absorb their implementation details.

### Class decomposition

Do not split classes mechanically.

Bad decomposition:

```text
OrderValidator
OrderCalculator
OrderStatusManager
OrderDataHolder
OrderRepositoryManager
```

if the boundaries have no independent meaning.

A better decomposition follows actual reasons to change:

```java
class Order {
    // order state and invariants
}

interface OrderRepository {
    // persistence boundary
}

class PricingService {
    // pricing policy
}

class CheckoutService {
    // checkout workflow
}
```

### Example: Refactoring a God Service

Before:

```java
class CheckoutService {

    public void checkout(Order order) {
        // validate customer
        // calculate discounts
        // calculate tax
        // call payment provider
        // update inventory
        // save order
        // send email
        // generate invoice PDF
    }
}
```

After:

```java
class CheckoutService {

    private final OrderValidator validator;
    private final PricingService pricingService;
    private final PaymentGateway paymentGateway;
    private final InventoryService inventoryService;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    public CheckoutService(
            OrderValidator validator,
            PricingService pricingService,
            PaymentGateway paymentGateway,
            InventoryService inventoryService,
            OrderRepository orderRepository,
            NotificationService notificationService) {

        this.validator = validator;
        this.pricingService = pricingService;
        this.paymentGateway = paymentGateway;
        this.inventoryService = inventoryService;
        this.orderRepository = orderRepository;
        this.notificationService = notificationService;
    }

    public void checkout(Order order) {
        validator.validate(order);

        Money total = pricingService.calculate(order);

        paymentGateway.charge(total, order.paymentMethod());

        inventoryService.reserve(order.items());

        order.markConfirmed();

        orderRepository.save(order);

        notificationService.sendOrderConfirmation(order);
    }
}
```

The service is still substantial, but the individual policies and infrastructure concerns are not embedded inside it.

### Key Takeaways

- SRP is about coherent responsibility, not method count.
- "One reason to change" is a practical way to identify responsibility boundaries.
- Responsibility should have a clear owner.
- Collaborating with other classes does not violate SRP.
- Avoid both God classes and meaningless micro-classes.
- Decompose around real change boundaries.

---

## Open-Closed Principle

### OCP

The Open-Closed Principle states that software entities should be open for extension but closed for modification.

In practice:

> New behavior should often be addable without repeatedly changing stable existing code.

This does not mean existing code must literally never change.

It means we should identify stable behavior and isolate expected variation.

### Open for extension

Suppose an application supports multiple discount policies.

A naive implementation:

```java
class DiscountService {

    public Money calculate(Order order, String type) {
        if (type.equals("REGULAR")) {
            return regularDiscount(order);
        }

        if (type.equals("PREMIUM")) {
            return premiumDiscount(order);
        }

        if (type.equals("FESTIVAL")) {
            return festivalDiscount(order);
        }

        throw new IllegalArgumentException("Unknown type");
    }
}
```

Every new discount requires modifying the class.

An extension-oriented design:

```java
interface DiscountPolicy {
    Money calculate(Order order);
}
```

Implementations:

```java
class RegularDiscountPolicy implements DiscountPolicy {
    @Override
    public Money calculate(Order order) {
        return Money.zero();
    }
}

class PremiumDiscountPolicy implements DiscountPolicy {
    @Override
    public Money calculate(Order order) {
        return order.subtotal().multiply(0.10);
    }
}

class FestivalDiscountPolicy implements DiscountPolicy {
    @Override
    public Money calculate(Order order) {
        return order.subtotal().multiply(0.20);
    }
}
```

The stable consumer:

```java
class DiscountService {

    private final DiscountPolicy policy;

    public DiscountService(DiscountPolicy policy) {
        this.policy = policy;
    }

    public Money calculate(Order order) {
        return policy.calculate(order);
    }
}
```

Adding a new policy can happen through another implementation.

### Closed for modification

"Closed" means the stable abstraction should not need modification for every variation.

For example:

```text
DiscountService
      |
      v
DiscountPolicy
   /    |     \
Regular Premium Festival
```

The interface defines the stable capability.

The policies contain the variation.

### Extension points

An extension point is a deliberate place where new behavior can be plugged in.

Examples:

```java
interface PaymentGateway
interface NotificationSender
interface PricingRule
interface FileStorage
interface TaxCalculator
```

A useful extension point should be based on a meaningful variation.

Bad:

```java
interface StringProcessor {
    String process(String value);
}
```

created only because "interfaces are good."

Good:

```java
interface TaxPolicy {
    Money calculateTax(Order order);
}
```

when tax policy genuinely varies.

### Abstraction

OCP depends heavily on abstraction.

But abstraction should represent something stable.

For example:

```java
interface FileStorage {
    FileId upload(FileContent content);
    InputStream download(FileId id);
}
```

Possible implementations:

```text
LocalFileStorage
S3FileStorage
CloudinaryFileStorage
```

The application depends on the capability, not on a specific provider.

### Variation

The most important OCP question is:

> "What is expected to vary?"

For example:

```text
Payment method varies
Tax policy varies
Notification channel varies
Storage provider varies
Pricing rule varies
```

Do not create an abstraction for something that has no meaningful variation.

### OCP is not "never modify code"

Suppose a requirement changes the fundamental meaning of an order.

Some existing code will need modification.

OCP is a design heuristic for protecting stable code from predictable variation.

It is not a guarantee against all modifications.

### Example: Notification Channels

Poor:

```java
class NotificationService {

    public void notify(User user, String message, String channel) {
        switch (channel) {
            case "EMAIL" -> sendEmail(user, message);
            case "SMS" -> sendSms(user, message);
            case "PUSH" -> sendPush(user, message);
        }
    }
}
```

Better:

```java
interface NotificationSender {
    void send(Notification notification);
}
```

```java
class EmailNotificationSender implements NotificationSender {
    public void send(Notification notification) {
        // email
    }
}

class SmsNotificationSender implements NotificationSender {
    public void send(Notification notification) {
        // SMS
    }
}
```

The selection mechanism can then live at the composition boundary.

### OCP and configuration

Spring Boot often makes OCP practical:

```java
@Service
class NotificationService {

    private final List<NotificationSender> senders;

    NotificationService(List<NotificationSender> senders) {
        this.senders = senders;
    }
}
```

New implementations can be registered without rewriting the service's core algorithm.

However, framework dependency injection does not automatically create good design. The abstraction still needs a coherent contract.

### Key Takeaways

- OCP is about isolating variation.
- Extension points should represent meaningful change.
- Stable policy should depend on stable abstractions.
- OCP does not mean "never edit existing code."
- Do not create abstractions solely to satisfy OCP mechanically.

---

## Liskov Substitution Principle

### LSP

The Liskov Substitution Principle states that objects of a subtype should be usable wherever the supertype is expected without breaking the correctness of the program.

The critical word is **behavior**.

A class can satisfy the method signatures of a parent class and still violate LSP.

### Behavioral contracts

Suppose:

```java
interface PaymentGateway {
    PaymentResult charge(Money amount);
}
```

A client expects:

```text
charge(amount)
    -> succeeds or reports a defined payment failure
```

Now imagine an implementation:

```java
class OfflinePaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult charge(Money amount) {
        throw new UnsupportedOperationException();
    }
}
```

If the application treats every `PaymentGateway` as charge-capable, this implementation violates the behavioral expectation.

The method exists, but the contract is broken.

### Substitutability

If code says:

```java
PaymentGateway gateway = getGateway();
gateway.charge(amount);
```

the caller should not need:

```java
if (gateway instanceof OfflinePaymentGateway) {
    // special behavior
}
```

Repeated type checks often indicate that the abstraction does not describe a true common behavior.

### Subclass behavior

Consider a base class:

```java
class Bird {

    public void fly() {
        // fly
    }
}
```

Then:

```java
class Penguin extends Bird {

    @Override
    public void fly() {
        throw new UnsupportedOperationException();
    }
}
```

The inheritance hierarchy claims:

```text
Penguin is a Bird
Bird can fly
Penguin cannot fly
```

The abstraction is wrong.

Better:

```java
interface Bird {
    void eat();
}

interface FlyingBird extends Bird {
    void fly();
}

class Sparrow implements FlyingBird {
    public void eat() {}
    public void fly() {}
}

class Penguin implements Bird {
    public void eat() {}
}
```

### Invalid inheritance

A common LSP smell is:

```text
Parent has operation X
Child inherits X
Child cannot meaningfully support X
```

Other signs:

- child throws `UnsupportedOperationException`,
- child weakens validation unexpectedly,
- child changes return semantics,
- child violates parent invariants,
- callers need `instanceof`,
- child requires special-case handling.

### Composition as alternative

If a type does not truly satisfy the parent's behavioral contract, composition may be better.

Instead of:

```java
class SpecialOrder extends Order {
    // changes fundamental order behavior
}
```

consider:

```java
class Order {
    private final OrderPolicy policy;
}
```

or:

```java
class Order {
    private final PricingPolicy pricingPolicy;
}
```

Composition allows behavior to vary without claiming a subtype relationship.

### LSP and API contracts

LSP matters beyond inheritance.

It applies to interfaces and implementations.

For example:

```java
interface Repository<T> {
    T findById(long id);
}
```

If one implementation returns `null`, another throws, and another silently creates a new entity, the contract is unclear.

A stronger contract might specify:

```java
Optional<T> findById(long id);
```

Now the absence case is explicit.

### Key Takeaways

- LSP is about behavioral substitutability.
- Matching method signatures is not enough.
- `UnsupportedOperationException` can be a strong LSP warning.
- Avoid inheritance when the subtype cannot honor the parent's contract.
- Composition is often a better alternative when behavior varies.

---

## Interface Segregation Principle

### ISP

The Interface Segregation Principle says that clients should not be forced to depend on methods they do not use.

A large interface often creates unnecessary coupling.

### Fat interfaces

Consider:

```java
interface EmployeeOperations {
    void createEmployee();
    void updateEmployee();
    void deleteEmployee();
    void generatePayroll();
    void approveLeave();
    void conductPerformanceReview();
}
```

A payroll component may need only:

```java
generatePayroll()
```

Yet it depends on the entire interface.

This is a fat interface.

### Client-specific interfaces

Split contracts around client needs:

```java
interface EmployeeManagement {
    void createEmployee();
    void updateEmployee();
    void deleteEmployee();
}

interface PayrollService {
    void generatePayroll();
}

interface LeaveManagement {
    void approveLeave();
}
```

Now clients depend only on what they require.

### Interface dependencies

Suppose:

```java
class PayrollProcessor {

    private final EmployeeOperations employeeOperations;
}
```

The payroll processor is now coupled to unrelated employee operations.

With ISP:

```java
class PayrollProcessor {

    private final PayrollService payrollService;
}
```

The dependency communicates intent more clearly.

### UnsupportedOperationException

This is a common smell:

```java
class ReadOnlyUserService implements UserOperations {

    @Override
    public void createUser() {
        throw new UnsupportedOperationException();
    }

    @Override
    public User getUser(long id) {
        // supported
    }
}
```

The implementation does not truly satisfy the interface.

Possible solution:

```java
interface UserReader {
    User getUser(long id);
}

interface UserWriter {
    void createUser(User user);
}
```

A component can implement one or both.

### Interface decomposition

Do not split interfaces into microscopic pieces merely to avoid fat interfaces.

Good:

```java
interface OrderReader {
    Order findById(OrderId id);
}

interface OrderWriter {
    void save(Order order);
}
```

when clients genuinely have different needs.

Potentially excessive:

```java
interface OrderIdProvider {
    OrderId getId();
}

interface OrderStatusProvider {
    OrderStatus getStatus();
}
```

if the resulting design makes normal domain operations unnecessarily fragmented.

### Key Takeaways

- ISP reduces unnecessary client coupling.
- Fat interfaces create dependencies on unrelated behavior.
- `UnsupportedOperationException` can reveal a bad contract.
- Split interfaces according to meaningful client needs.
- Avoid excessive fragmentation.

---

## Dependency Inversion Principle

### DIP

The Dependency Inversion Principle states that high-level policy should not depend directly on low-level implementation details. Both should depend on abstractions, and abstractions should not depend on details.

The practical question is:

> "Does my business policy know about a specific infrastructure technology?"

### Dependency direction

Poor:

```text
CheckoutService
      |
      v
StripePaymentGateway
```

The application service directly knows a provider.

Better:

```text
CheckoutService
      |
      v
PaymentGateway
      ^
      |
StripePaymentGateway
```

Now the high-level policy depends on a business-level abstraction.

### Policy vs implementation

High-level policy:

```text
Place an order
Charge payment
Reserve inventory
Confirm order
```

Low-level details:

```text
Stripe SDK
PostgreSQL driver
Kafka client
SMTP library
Redis client
```

Business logic should not unnecessarily depend directly on those details.

### Abstractions

Example:

```java
public interface PaymentGateway {
    PaymentResult charge(Money amount, PaymentMethod method);
}
```

Infrastructure:

```java
@Component
class StripePaymentGateway implements PaymentGateway {

    private final StripeClient client;

    StripePaymentGateway(StripeClient client) {
        this.client = client;
    }

    @Override
    public PaymentResult charge(
            Money amount,
            PaymentMethod method) {

        // translate domain request to Stripe API
        // call Stripe
        // translate result back
        return ...;
    }
}
```

Application policy:

```java
@Service
class CheckoutService {

    private final PaymentGateway paymentGateway;

    CheckoutService(PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
}
```

### Dependency injection

Dependency injection supplies dependencies from outside the class.

Constructor injection:

```java
class OrderService {

    private final OrderRepository repository;

    OrderService(OrderRepository repository) {
        this.repository = repository;
    }
}
```

Benefits:

- dependencies are explicit,
- objects are easier to test,
- construction is controlled,
- required dependencies cannot be silently omitted.

With Spring:

```java
@Service
class OrderService {

    private final OrderRepository repository;

    OrderService(OrderRepository repository) {
        this.repository = repository;
    }
}
```

Spring constructs the object and supplies the dependency.

### Inversion of control

Normally, an object might create its dependencies:

```java
class OrderService {

    private final OrderRepository repository =
        new PostgresOrderRepository();
}
```

The class controls construction and becomes tightly coupled.

With inversion of control:

```java
class OrderService {

    private final OrderRepository repository;

    OrderService(OrderRepository repository) {
        this.repository = repository;
    }
}
```

The object receives what it needs.

The framework or composition root controls construction.

### DIP does not mean "interface everywhere"

This is important.

An interface is useful when it provides a meaningful boundary.

Bad:

```java
interface OrderServiceInterface {
    void placeOrder();
}

class OrderServiceImpl implements OrderServiceInterface {
    // only implementation
}
```

If there is no meaningful substitution, no independent boundary, and no architectural benefit, this may add ceremony without reducing coupling.

### Key Takeaways

- DIP is about dependency direction.
- High-level policy should be protected from low-level implementation details.
- Constructor injection makes dependencies explicit.
- Dependency injection is a technique; dependency inversion is a design principle.
- Do not create interfaces mechanically.

---

## DRY, KISS, and YAGNI Principles

### DRY

DRY prevents duplicated knowledge.

Example:

```java
class OrderValidator {
    boolean canCancel(Order order) {
        return order.status() != SHIPPED;
    }
}

class RefundService {
    boolean canRefund(Order order) {
        return order.status() != SHIPPED;
    }
}
```

If the actual business rule changes, both locations may need modification.

Better:

```java
class Order {
    boolean canCancel() {
        return status != SHIPPED;
    }
}
```

Now the rule has one owner.

However, duplication can sometimes be intentional.

Two pieces of code may look similar but represent different concepts.

Prematurely merging them can create coupling.

### KISS

KISS favors the simplest design that correctly satisfies current requirements.

Suppose:

```text
Requirement:
Calculate delivery charge using distance.
```

A simple implementation may be sufficient:

```java
class DeliveryChargeCalculator {

    Money calculate(double distanceKm) {
        return Money.of(distanceKm * 10);
    }
}
```

Do not immediately build:

```text
StrategyFactory
RuleEngine
PluginRegistry
DynamicScriptExecutor
Configuration DSL
```

unless the requirements justify them.

### YAGNI

YAGNI prevents speculative features.

Example:

```text
Current:
Only PostgreSQL is required.

Speculation:
Support PostgreSQL + MySQL + MongoDB + DynamoDB + Cassandra.
```

Creating five repository implementations "for future flexibility" can increase:

- maintenance,
- testing,
- configuration,
- cognitive load.

Instead, establish a clean persistence boundary if needed and implement the current requirement.

### Duplication

Not all duplication is equal.

**Textual duplication**

```java
return price.multiply(quantity);
```

**Structural duplication**

Two methods have similar control flow.

**Knowledge duplication**

The same business rule is defined in multiple places.

Knowledge duplication is usually the most dangerous.

### Simplicity

Simplicity does not mean naive code.

A sophisticated algorithm can be appropriate when the problem requires it.

The target is:

> minimum complexity that safely solves the actual problem.

### Avoiding overengineering

Overengineering often appears as:

```text
Requirement
   |
   +--> unnecessary abstraction
   +--> unnecessary pattern
   +--> unnecessary infrastructure
   +--> unnecessary configurability
```

Symptoms:

- difficult onboarding,
- many interfaces with one implementation,
- configuration for values that never change,
- abstractions that expose no real boundary,
- tests that are longer than the production behavior.

### Future requirements

Good architecture prepares for change without implementing imaginary features.

Example:

```text
Good:
PaymentGateway abstraction because payment provider replacement is a realistic requirement.

Overengineering:
Generic PaymentPluginMarketplace with dynamic runtime plugin loading because "maybe someday."
```

### Key Takeaways

- DRY is about duplicated knowledge, not identical text.
- KISS favors understandable solutions.
- YAGNI prevents speculative features.
- Some duplication is safer than premature coupling.
- Future-proofing should be proportional to credible future change.

---

## High Cohesion and Loose Coupling

### Cohesion

Cohesion measures how strongly the responsibilities inside a module belong together.

High cohesion:

```text
Order
 ├── status
 ├── items
 ├── total
 ├── cancel()
 └── confirm()
```

These concepts all relate to an order.

Low cohesion:

```text
ApplicationManager
 ├── calculateTax()
 ├── sendEmail()
 ├── createUser()
 ├── generatePdf()
 ├── clearCache()
 └── parseCsv()
```

The class has unrelated responsibilities.

### Coupling

Coupling describes how strongly modules depend on each other.

High coupling:

```text
CheckoutService
  -> StripeClient
  -> PostgreSQLConnection
  -> KafkaProducer
  -> RedisClient
  -> SmtpClient
```

The service knows many infrastructure details.

Lower coupling:

```text
CheckoutService
  -> PaymentGateway
  -> OrderRepository
  -> EventPublisher
  -> Cache
```

The service depends on meaningful capabilities.

### Module boundaries

A good boundary should answer:

- What does this module own?
- What does it expose?
- What does it hide?
- What can change internally without affecting clients?

Example:

```text
Checkout Module
---------------------------
Public:
CheckoutService
CheckoutResult

Hidden:
Payment orchestration
Persistence implementation
Notification implementation
Provider-specific code
```

### Change blast radius

Change blast radius means how much of the system must be touched when one requirement changes.

Suppose:

```text
Change: replace payment provider
```

If only:

```text
StripePaymentGateway
```

changes, blast radius is small.

If the change requires editing:

```text
Controller
CheckoutService
Order
Database
Kafka producer
Tests
```

the architecture may have leaked payment-provider details.

### Responsibility grouping

High cohesion and low coupling work together.

```text
High cohesion
      +
Low coupling
      |
      v
Smaller change blast radius
```

A module should contain closely related responsibilities and minimize unnecessary knowledge of other modules.

### Example

Poor:

```java
class OrderService {

    private StripeClient stripe;
    private JdbcTemplate jdbc;
    private JavaMailSender mailSender;
    private RedisTemplate redis;
}
```

Better:

```java
class OrderService {

    private final PaymentGateway paymentGateway;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final OrderCache orderCache;
}
```

The second design does not eliminate dependencies. It improves their meaning and boundaries.

### Key Takeaways

- Cohesion asks whether responsibilities belong together.
- Coupling asks how much modules know about each other.
- Aim for high cohesion and appropriately low coupling.
- Good boundaries reduce change blast radius.
- Loose coupling does not mean zero coupling.

---

## Law of Demeter

### Law of Demeter

The Law of Demeter is commonly summarized as:

> An object should have limited knowledge of the structure of objects it collaborates with.

The practical warning is against long chains of navigation.

### Immediate collaborators

Suppose:

```java
order.getCustomer()
     .getAddress()
     .getCity()
     .getName();
```

The caller knows the internal structure:

```text
Order
 -> Customer
    -> Address
       -> City
          -> Name
```

This creates coupling to the object graph.

A better API might be:

```java
order.shippingCityName();
```

The `Order` object can delegate internally.

### Object graphs

Long chains make changes expensive.

If:

```java
customer.getAddress().getCity()
```

changes because address representation changes, every caller using that chain may need modification.

A method such as:

```java
customer.shippingCity()
```

can protect the representation.

### Delegation

Delegation moves knowledge to the object that owns it.

Instead of:

```java
if (order.getCustomer().getMembership().getLevel() == PREMIUM) {
    // discount
}
```

consider:

```java
if (order.customerIsPremium()) {
    // discount
}
```

or better, depending on the domain:

```java
Money discount = order.calculateDiscount();
```

The domain object can own or delegate the relevant business rule.

### Coupling through object chains

A common smell:

```java
a.getB().getC().getD().doSomething();
```

This does not mean every chained call is automatically bad.

Some chains are natural:

```java
builder.name("Smit")
       .email("...")
       .build();
```

The Law of Demeter is primarily about unnecessary knowledge of object internals.

### Key Takeaways

- Avoid unnecessary navigation through object graphs.
- Prefer behavior over exposing internal structure.
- Delegation can reduce coupling.
- Not every chained method call violates the principle.
- The goal is to hide representation and preserve boundaries.

---

## Separation of Concerns and Information Hiding

### Separation of concerns

Separation of concerns means keeping different kinds of decisions or responsibilities distinct.

Typical backend separation:

```text
Controller
    |
    v
Application Service
    |
    v
Domain Model
    |
    v
Repository
    |
    v
Persistence
```

The exact architecture can vary, but each layer should have a meaningful reason to exist.

A controller should not contain:

```text
SQL
payment provider calls
complex business rules
email logic
```

A repository should not decide:

```text
whether a customer is eligible for a festival discount
```

### Information hiding

Information hiding means hiding implementation decisions that clients do not need to know.

Example:

```java
interface FileStorage {
    FileId upload(FileContent content);
}
```

The caller does not need to know:

```text
S3 bucket
path convention
multipart handling
AWS SDK
retry strategy
```

Those details can remain inside the implementation.

### Responsibilities

A clean separation might look like:

```text
OrderController
    HTTP concerns

OrderService
    use-case orchestration

Order
    order invariants and state

OrderRepository
    persistence contract

JpaOrderRepository
    JPA implementation
```

This does not mean every application must have exactly these classes.

The boundary should follow actual responsibilities.

### Encapsulation

Encapsulation protects state and behavior together.

Poor:

```java
class BankAccount {
    public BigDecimal balance;
}
```

Any caller can modify it:

```java
account.balance = new BigDecimal("-50000");
```

Better:

```java
class BankAccount {

    private Money balance;

    public void withdraw(Money amount) {
        if (amount.isGreaterThan(balance)) {
            throw new InsufficientFundsException();
        }

        balance = balance.subtract(amount);
    }

    public Money balance() {
        return balance;
    }
}
```

The object controls its invariant.

### Changeable implementation details

Suppose:

```java
interface OrderRepository {
    Optional<Order> findById(OrderId id);
    void save(Order order);
}
```

The application should not need to know whether implementation uses:

```text
JPA
JDBC
MongoDB
remote API
in-memory storage
```

The repository abstraction hides that decision.

### Repository abstraction

Repository abstractions are useful when they protect domain/application code from persistence details.

Example:

```java
public interface OrderRepository {
    Optional<Order> findById(OrderId id);
    void save(Order order);
}
```

Infrastructure:

```java
@Repository
class JpaOrderRepository implements OrderRepository {

    private final SpringDataOrderRepository repository;

    // mapping and persistence details
}
```

A repository should not become a generic dumping ground for business rules.

### Key Takeaways

- Separate responsibilities that change for different reasons.
- Hide implementation details behind stable contracts.
- Encapsulation protects invariants.
- Repository abstractions can isolate persistence details.
- Separation of concerns is about meaningful boundaries, not arbitrary layers.

---

## Designing for Testability: The Ultimate Proof of Loose Coupling

### Testability

A design is often easier to test when its dependencies are explicit and replaceable.

Consider:

```java
class PaymentService {

    public PaymentResult pay(Money amount) {
        StripeClient client = new StripeClient();
        return client.charge(amount);
    }
}
```

Testing this class requires the real Stripe client or complicated interception.

Better:

```java
class PaymentService {

    private final PaymentGateway gateway;

    PaymentService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public PaymentResult pay(Money amount) {
        return gateway.charge(amount, PaymentMethod.card());
    }
}
```

Test:

```java
PaymentGateway gateway = mock(PaymentGateway.class);

PaymentService service = new PaymentService(gateway);
```

The dependency is explicit.

### Construction seams

A construction seam is a place where we can substitute how an object is created.

Poor:

```java
class ReportService {

    public Report generate() {
        PdfGenerator generator = new PdfGenerator();
        // ...
    }
}
```

Better:

```java
class ReportService {

    private final PdfGenerator generator;

    ReportService(PdfGenerator generator) {
        this.generator = generator;
    }
}
```

The constructor becomes a seam.

### Control seams

A control seam allows tests to control external behavior.

Example:

```java
interface Clock {
    Instant now();
}
```

Production:

```java
class SystemClock implements Clock {
    public Instant now() {
        return Instant.now();
    }
}
```

Test:

```java
class FixedClock implements Clock {

    private final Instant instant;

    FixedClock(Instant instant) {
        this.instant = instant;
    }

    public Instant now() {
        return instant;
    }
}
```

Now time-dependent logic can be tested deterministically.

This is particularly useful for:

- expiration,
- booking windows,
- payment deadlines,
- token expiry,
- scheduled jobs.

### Observation seams

An observation seam lets tests observe outcomes without depending on internal implementation.

Poor:

```java
class OrderService {
    private boolean internalFlag;
}
```

A test should not need to inspect private implementation state.

Prefer observable behavior:

```java
Order order = service.placeOrder(command);

assertThat(order.status())
    .isEqualTo(OrderStatus.CONFIRMED);
```

or:

```java
verify(eventPublisher).publish(
    new OrderConfirmedEvent(order.id())
);
```

### Isolation

A good unit test should isolate the behavior under test.

Example:

```text
CheckoutService
    |
    +-- fake PaymentGateway
    +-- fake InventoryService
    +-- fake OrderRepository
```

This allows a test to answer:

> "Does checkout coordinate these collaborators correctly?"

without testing Stripe, PostgreSQL, Kafka, and inventory simultaneously.

### Mocking

Mocks are useful, but excessive mocking can be a design smell.

If a test requires:

```java
when(a.getB()).thenReturn(b);
when(b.getC()).thenReturn(c);
when(c.getD()).thenReturn(d);
```

the test may be revealing Law of Demeter violations or excessive coupling.

Mocks should verify meaningful collaboration, not implementation trivia.

### Loose coupling

Testability is a useful practical signal for coupling.

If replacing a dependency is easy:

```java
new PaymentService(fakeGateway)
```

the dependency boundary is probably healthy.

If testing requires:

```text
Spring context
database
Redis
Kafka
external HTTP server
real credentials
```

for a small unit of business logic, the design may have excessive coupling.

### Example: Testable Checkout

Production:

```java
class CheckoutService {

    private final PaymentGateway paymentGateway;
    private final InventoryService inventoryService;
    private final OrderRepository orderRepository;

    CheckoutService(
            PaymentGateway paymentGateway,
            InventoryService inventoryService,
            OrderRepository orderRepository) {

        this.paymentGateway = paymentGateway;
        this.inventoryService = inventoryService;
        this.orderRepository = orderRepository;
    }

    public Order checkout(Order order) {

        inventoryService.reserve(order.items());

        paymentGateway.charge(
            order.total(),
            order.paymentMethod()
        );

        order.confirm();

        orderRepository.save(order);

        return order;
    }
}
```

A focused unit test can replace each collaborator.

The design is not "good because it is mockable." It is good because the dependencies are meaningful and explicit. Testability is evidence that the boundaries are useful.

### Key Takeaways

- Testability is a practical indicator of coupling quality.
- Constructor injection creates useful construction seams.
- Clock and external-service abstractions create deterministic control seams.
- Tests should observe behavior, not implementation details.
- Excessive mocking often exposes poor boundaries.
- If a small unit requires an entire production environment to test, reconsider its dependencies.

---

# Putting the Principles Together

The principles in this module are most useful when applied together rather than independently.

Consider a payment workflow.

A tightly coupled design:

```text
CheckoutService
 |
 +-- creates StripeClient
 +-- writes directly to PostgreSQL
 +-- sends email directly
 +-- contains discount rules
 +-- checks inventory
 +-- knows Kafka details
```

Potential problems:

- SRP violation
- high coupling
- low cohesion
- weak information hiding
- poor testability
- difficult provider replacement
- large change blast radius

A more deliberate design:

```text
                    +------------------+
                    | CheckoutService  |
                    +--------+---------+
                             |
       +---------------------+----------------------+
       |                     |                      |
       v                     v                      v
PaymentGateway       OrderRepository        InventoryService
       ^                     ^                      ^
       |                     |                      |
Stripe implementation   JPA implementation   Inventory implementation

                             |
                             v
                     NotificationPublisher
```

Reasoning:

- **SRP:** responsibilities are separated.
- **OCP:** provider-specific implementations can vary behind contracts.
- **LSP:** implementations must honor their interfaces' behavioral contracts.
- **ISP:** interfaces expose focused capabilities.
- **DIP:** checkout depends on application-level abstractions rather than SDKs.
- **DRY:** business rules have clear owners.
- **KISS:** abstractions are introduced where they protect real boundaries.
- **YAGNI:** no speculative provider framework is required.
- **High cohesion:** each component has a focused purpose.
- **Loose coupling:** implementation details are hidden.
- **Law of Demeter:** callers avoid navigating internal object graphs.
- **Separation of concerns:** HTTP, business, persistence, and infrastructure concerns remain distinct.
- **Testability:** collaborators can be replaced in unit tests.

---

# Practical Design Review Checklist

When reviewing a class or small subsystem, ask:

## Responsibility

- What does this class own?
- What are its reasons to change?
- Are unrelated concerns mixed together?

## Change

- What is likely to vary?
- Can the variation be isolated?
- What is the expected change blast radius?

## Contracts

- What does the abstraction promise?
- Are inputs, outputs, failures, and invariants clear?
- Can implementations actually honor the contract?

## Coupling

- Does the class know unnecessary implementation details?
- Does it depend on concrete infrastructure unnecessarily?
- Are there long object chains?

## Cohesion

- Do the methods and state belong to one concept?
- Could the class be described with one coherent responsibility?

## Abstraction

- Does the abstraction protect a real boundary?
- Is there meaningful variation?
- Is the interface too broad?

## Simplicity

- Is the design more complicated than the requirement?
- Are patterns being used because they solve a problem or because they are familiar?
- Are future requirements being implemented prematurely?

## Testability

- Can dependencies be replaced?
- Can business behavior be tested without infrastructure?
- Are tests coupled to implementation details?

---

# Interview Perspective

In an LLD interview, principles should appear through reasoning rather than as a memorized list.

A weak answer:

> "I will use SOLID principles and dependency injection."

A stronger answer:

> "Payment providers are likely to vary independently from checkout rules, so I will keep checkout dependent on a PaymentGateway contract. The provider implementation will live behind that boundary. That reduces the change blast radius if the provider changes and also lets me test checkout with a fake gateway."

This demonstrates:

```text
Requirement
    ↓
Likely variation
    ↓
Responsibility
    ↓
Boundary
    ↓
Abstraction
    ↓
Dependency direction
    ↓
Testability
```

### Common interviewer follow-ups

**Why did you create this interface?**

Good answer:

> "Because this dependency represents a meaningful variation point and I want the higher-level policy isolated from the provider implementation."

Weak answer:

> "Because SOLID says interfaces are good."

**Why not use inheritance?**

Good answer:

> "The behavior varies but the subtype does not satisfy a stable parent behavioral contract, so composition gives us the variation without creating an invalid is-a relationship."

**Why split this class?**

Good answer:

> "These responsibilities change for different reasons. Separating them reduces the blast radius of those changes."

**Why not abstract this?**

Good answer:

> "There is currently no meaningful variation or boundary being protected, so the abstraction would add complexity without a clear benefit. I would introduce it when the requirement justifies it."

**How would you test this?**

Good answer:

> "The external collaborators are injected through constructors, so I can replace payment, persistence, and messaging dependencies with test doubles and verify the checkout behavior in isolation."

---

# Common Mistakes

## Treating SOLID as a checklist

A design can technically contain interfaces, dependency injection, and small classes while still being poor.

Always start with the requirement and change analysis.

## Creating interfaces for every class

This creates ceremony:

```text
UserService
UserServiceImpl
UserServiceFactory
IUserService
```

without necessarily creating a useful boundary.

## Overusing SRP

Turning every method into a separate class can make the system harder to understand.

SRP means coherent responsibility, not maximum fragmentation.

## Misunderstanding OCP

OCP does not mean existing code can never change.

It means stable areas should be protected from predictable variation where doing so is valuable.

## Violating LSP through inheritance

If subclasses repeatedly throw:

```java
UnsupportedOperationException
```

or require special handling, reconsider the hierarchy.

## Fat interfaces

Large interfaces force clients to depend on unrelated behavior.

Split contracts according to meaningful client needs.

## Confusing dependency injection with dependency inversion

Spring's `@Autowired` or constructor injection is a mechanism.

DIP is about architectural dependency direction.

## Blindly applying DRY

Two similar-looking pieces of code may represent different concepts.

Combining them too early can create unwanted coupling.

## YAGNI taken too far

YAGNI does not mean ignoring design.

You can still create a clean boundary without implementing speculative features.

## Mistaking loose coupling for no coupling

A system with no dependencies is not useful.

The goal is meaningful, explicit, and appropriately directed dependencies.

## Ignoring behavior in design

Method names and class diagrams are insufficient.

Ask what happens when:

- payment fails,
- inventory is unavailable,
- a duplicate request arrives,
- a provider changes,
- a subclass receives an unexpected input,
- a dependency times out.

Good LLD includes behavior and failure reasoning.

---

# Mini Case Study: Designing a Notification Module

## Problem

An ecommerce system needs to notify customers when an order is confirmed.

Initially:

```text
Email only
```

Later:

```text
SMS
Push
WhatsApp
```

Requirements:

- send order-confirmation notifications,
- support multiple channels,
- avoid coupling order logic to providers,
- keep the system testable.

## Naive design

```java
class OrderService {

    public void confirm(Order order) {

        order.confirm();

        EmailClient emailClient = new EmailClient();
        emailClient.send(
            order.customerEmail(),
            "Order confirmed"
        );
    }
}
```

Problems:

- order service knows email infrastructure,
- hard to replace email,
- hard to test without email client,
- adding SMS modifies the order service.

## Improved design

```java
interface NotificationSender {
    void send(Notification notification);
}
```

```java
class EmailNotificationSender implements NotificationSender {
    public void send(Notification notification) {
        // email provider
    }
}
```

```java
class SmsNotificationSender implements NotificationSender {
    public void send(Notification notification) {
        // SMS provider
    }
}
```

Application code:

```java
class OrderService {

    private final NotificationSender notificationSender;

    OrderService(NotificationSender notificationSender) {
        this.notificationSender = notificationSender;
    }

    public void confirm(Order order) {

        order.confirm();

        notificationSender.send(
            Notification.orderConfirmed(order)
        );
    }
}
```

This design demonstrates:

```text
DIP
OCP
SRP
testability
information hiding
loose coupling
```

## But what if multiple channels are required?

Do not immediately force one sender to perform all channels.

Model the requirement explicitly:

```java
interface NotificationSender {
    Channel channel();
    void send(Notification notification);
}
```

Then an orchestrator can choose the relevant sender:

```java
class NotificationService {

    private final Map<Channel, NotificationSender> senders;

    NotificationService(List<NotificationSender> senders) {
        this.senders = senders.stream()
            .collect(Collectors.toMap(
                NotificationSender::channel,
                Function.identity()
            ));
    }

    public void send(
            Notification notification,
            Channel channel) {

        NotificationSender sender = senders.get(channel);

        if (sender == null) {
            throw new IllegalArgumentException(
                "Unsupported notification channel: " + channel
            );
        }

        sender.send(notification);
    }
}
```

This is useful when channel selection is a real requirement.

If the application only ever needs email, introducing a registry, factory, and strategy hierarchy may be unnecessary.

That is the balance between OCP and YAGNI.

---

# Production Perspective

These principles directly influence real Spring Boot systems.

A typical production backend may look like:

```text
HTTP Controller
      |
      v
Application Service
      |
      +------------------+
      |                  |
      v                  v
Domain Model       Application Ports
                         |
              +----------+----------+
              |          |          |
              v          v          v
           PostgreSQL  Kafka      External API
```

The framework provides mechanisms:

```text
Spring Boot
Spring DI
Spring Data JPA
Spring Security
Kafka clients
Redis clients
```

But frameworks do not decide your boundaries for you.

For example:

```java
@Service
class OrderService {

    private final OrderRepository repository;
    private final PaymentGateway paymentGateway;
}
```

The important architectural decision is not `@Service`.

The important decision is:

```text
OrderService
    depends on
business-relevant capabilities
```

rather than:

```text
OrderService
    depends directly on
JPA + Stripe SDK + Kafka Producer + RedisTemplate
```

Framework annotations are implementation mechanisms. Design principles determine where those mechanisms belong.

---

# Summary

Core design principles provide the reasoning foundation for LLD.

The most important idea is not memorizing acronyms. It is understanding how a design behaves under change.

```text
Requirements
    ↓
Identify responsibilities
    ↓
Identify likely variation
    ↓
Define contracts
    ↓
Protect stable policy
    ↓
Control dependency direction
    ↓
Minimize unnecessary coupling
    ↓
Keep responsibilities cohesive
    ↓
Make behavior testable
```

A strong design usually has:

- coherent responsibilities,
- explicit ownership,
- stable contracts,
- isolated variation,
- valid behavioral substitutability,
- focused interfaces,
- appropriate dependency inversion,
- limited duplication of business knowledge,
- simple solutions,
- minimal speculative functionality,
- high cohesion,
- appropriately low coupling,
- hidden implementation details,
- testable boundaries.

The ultimate goal is not "SOLID code."

The goal is software in which change remains understandable and localized.

## Key Takeaways

1. Design principles are decision-making tools, not rigid laws.
2. The cost of change is one of the strongest ways to evaluate an LLD.
3. SRP asks who owns a responsibility and who should change when its rules change.
4. OCP encourages isolation of meaningful variation behind extension points.
5. LSP is about behavioral contracts, not merely inheritance syntax.
6. ISP prevents clients from depending on unrelated operations.
7. DIP protects high-level policy from low-level implementation details.
8. DRY is primarily about duplicated knowledge.
9. KISS favors the simplest design that correctly solves the actual requirement.
10. YAGNI prevents speculative complexity.
11. High cohesion keeps related responsibilities together.
12. Loose coupling reduces unnecessary dependency between modules.
13. Law of Demeter discourages unnecessary knowledge of object graphs.
14. Separation of concerns and information hiding create stable boundaries.
15. Testability is a strong practical signal that dependencies and responsibilities are well designed.
16. Good LLD balances extensibility with restraint.
17. The best design explanation connects every abstraction to a concrete requirement, variation, dependency, or testability need.

---

<!-- CONTINUE FROM: Module 4 > Why UML Matters in LLD -->
