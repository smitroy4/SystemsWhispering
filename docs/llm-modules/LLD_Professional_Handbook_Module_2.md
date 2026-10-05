# Module 2: Object-Oriented Programming Fundamentals

Object-oriented programming (OOP) is one of the primary tools used to express low-level software design in Java. LLD is not the same thing as OOP, but OOP gives us the language mechanisms used to model responsibilities, state, behavior, relationships, and dependencies.

This module builds the Java object model required for the rest of the LLD curriculum.

The module follows the supplied curriculum exactly:

1. Introduction to OOP and the Java Memory Model
2. Classes, Objects, and the this Keyword
3. Constructors and Object Initialization
4. Encapsulation and Access Modifiers
5. Abstraction: Interfaces vs Abstract Classes
6. Inheritance and Its Types
7. Polymorphism: Compile-Time vs Runtime
8. Association, Aggregation, and Composition
9. Dependency Relationships
10. Generics and Type Safety
11. The Golden Rule: Composition Over Inheritance

---

## Introduction to OOP and the Java Memory Model

Object-oriented programming organizes software around objects that combine state and behavior.

In LLD, this matters because we repeatedly need to answer:

- What objects exist?
- What state does each object own?
- What behavior belongs to that object?
- How do objects collaborate?
- Which objects share references?
- Which object owns another object's lifetime?

Java adds another important dimension: objects live in memory, references point to objects, and method calls create stack frames.

Understanding these mechanics prevents many incorrect assumptions during design.

### OOP fundamentals

The central OOP concepts are:

- Objects
- Classes
- Encapsulation
- Abstraction
- Inheritance
- Polymorphism

These are language and modeling mechanisms, not goals by themselves.

A useful mental model is:

```text
Class
  |
  | creates
  v
Object
  |
  +--> state
  |
  +--> behavior
```

For example:

```java
public class BankAccount {

    private final String accountNumber;
    private long balanceInPaise;

    public BankAccount(String accountNumber, long initialBalanceInPaise) {
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
}
```

An instance of `BankAccount` has state:

```text
accountNumber
balanceInPaise
```

and behavior:

```text
deposit()
balanceInPaise()
```

The important design idea is that behavior that protects state should generally live close to the state it protects.

### Stack

The JVM uses thread stacks to hold method execution frames.

Conceptually:

```text
Thread
 |
 +-- Stack
      |
      +-- main()
      |
      +-- createAccount()
      |
      +-- deposit()
```

Each method invocation has its own stack frame containing method-local information such as:

- local variables,
- parameters,
- intermediate execution state.

For example:

```java
public void transfer(Account source, Account target, long amount) {
    long fee = calculateFee(amount);
    // ...
}
```

`source`, `target`, `amount`, and `fee` are local variables/parameters associated with the invocation.

A common simplification is:

> "Objects are stored on the stack."

That is not a good general model for Java object reasoning.

The important distinction is:

```text
Stack
  -> method execution state / references to objects

Heap
  -> objects and arrays
```

### Heap

The heap is the runtime memory area where Java objects and arrays are allocated.

For:

```java
BankAccount account = new BankAccount("ACC-1", 5000);
```

the variable `account` holds a reference to the created object.

Conceptually:

```text
Stack
+----------------------+
| account ------------ |------+
+----------------------+      |
                              v
                         Heap
                    +-------------+
                    | BankAccount |
                    | ACC-1       |
                    | 5000        |
                    +-------------+
```

The exact JVM implementation details are more sophisticated, but this model is extremely useful for LLD.

### Objects

An object is a runtime instance of a class.

```java
BankAccount a = new BankAccount("A", 1000);
BankAccount b = new BankAccount("B", 2000);
```

There are two distinct objects:

```text
a ---> BankAccount("A", 1000)

b ---> BankAccount("B", 2000)
```

They have the same class but different state.

This distinction matters when designing domain objects. Two `Order` objects may both be instances of the `Order` class but represent completely different business entities.

### References

Java variables containing objects hold references to objects.

```java
BankAccount account = new BankAccount("A", 1000);
```

Conceptually:

```text
account -----> object
```

Assignments copy the reference value:

```java
BankAccount first = new BankAccount("A", 1000);
BankAccount second = first;
```

Now:

```text
first  ----+
           |
           v
       BankAccount
           ^
           |
second ----+
```

There is still only one object.

Therefore:

```java
second.deposit(500);
```

also changes what `first` observes.

### Java pass-by-value

Java is always pass-by-value.

For primitive values:

```java
int a = 10;
change(a);
```

the called method receives a copy of the value.

For object references, the reference value itself is copied:

```java
void change(BankAccount account) {
    account.deposit(500);
}
```

The method receives a copy of the reference pointing to the same object.

Therefore it can mutate the object:

```text
caller reference ----+
                     |
                     v
                 Account object
                     ^
                     |
method reference ----+
```

But reassigning the method parameter does not replace the caller's variable:

```java
void replace(BankAccount account) {
    account = new BankAccount("NEW", 0);
}
```

The caller's reference remains unchanged.

This distinction is critical when reasoning about object collaboration.

### Shared references

Shared references mean multiple parts of the program can reach the same mutable object.

```java
Cart cart = new Cart();

Checkout checkout = new Checkout(cart);
CartController controller = new CartController(cart);
```

Both may hold a reference to the same cart.

That creates a design question:

> Who is allowed to mutate the shared state?

Uncontrolled shared mutable state can create bugs and concurrency problems.

Prefer clear ownership:

```text
Cart
 |
 +--> owns cart items

Checkout
 |
 +--> asks Cart for information
```

rather than allowing every collaborator to modify internal collections directly.

### LLD implications

Understanding references helps answer:

- Who owns an object?
- Is an object shared?
- Can a caller mutate it?
- Should a collection be copied?
- Is an object mutable or immutable?
- Can two threads reach the same state?

These questions become increasingly important when we reach concurrency and domain modeling.

### Key Takeaways

- OOP models software using objects containing state and behavior.
- Java object references point to objects rather than containing the object itself in the conceptual model.
- The stack represents method execution state; objects are generally allocated on the heap.
- Java is pass-by-value, including when the value being passed is an object reference.
- Multiple references can point to the same mutable object.
- Shared mutable state requires deliberate ownership.

---

## Classes, Objects, and the this Keyword

A class defines a type and describes the state and behavior its instances provide.

An object is a concrete runtime instance of that class.

### Classes

Example:

```java
public class Product {

    private final String id;
    private String name;
    private long priceInPaise;

    public Product(String id, String name, long priceInPaise) {
        this.id = id;
        this.name = name;
        this.priceInPaise = priceInPaise;
    }

    public void changePrice(long newPriceInPaise) {
        if (newPriceInPaise < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        this.priceInPaise = newPriceInPaise;
    }
}
```

The class defines:

```text
State
- id
- name
- priceInPaise

Behavior
- changePrice()
```

### Objects

Objects are created with `new`:

```java
Product phone =
        new Product("P-101", "Phone", 4999900);
```

Another object:

```java
Product laptop =
        new Product("P-102", "Laptop", 8999900);
```

They have the same structure but independent state.

### Instance methods

Instance methods operate in the context of a particular object.

```java
phone.changePrice(4799900);
```

The method operates on `phone`.

The conceptual model is:

```text
phone
  |
  +--> changePrice(...)
       |
       +--> modifies phone's state
```

This is why domain behavior can often be modeled naturally inside domain objects.

For example:

```java
public class Order {

    private OrderStatus status;

    public void confirm() {
        if (status != OrderStatus.PENDING) {
            throw new IllegalStateException("Invalid transition");
        }

        status = OrderStatus.CONFIRMED;
    }
}
```

`Order` protects its own state transition.

### this

`this` refers to the current object.

It is especially common when constructor parameters have the same names as fields:

```java
public Product(String id) {
    this.id = id;
}
```

Here:

```text
this.id
```

means the current object's field.

```text
id
```

means the constructor parameter.

### Object references

Consider:

```java
Product p1 = new Product("P1", "Phone", 1000);
Product p2 = p1;
```

`p1` and `p2` reference the same object.

Therefore:

```java
p2.changePrice(900);
```

means:

```text
p1 ----+
       |
       v
   Product
       ^
       |
p2 ----+
```

### Heap objects

Objects are runtime entities with identity.

Two objects can have identical values but still be different objects:

```java
Product a = new Product("P1", "Phone", 1000);
Product b = new Product("P1", "Phone", 1000);
```

Whether these represent the same domain entity depends on the domain identity rules.

This distinction becomes important later when modeling entities and value objects.

### Design implication

Do not confuse:

```text
same values
```

with:

```text
same identity
```

For example, two `Money` objects representing INR 500 can reasonably be treated as equal values.

Two `Customer` objects with the same name are not necessarily the same customer.

This distinction is foundational for domain modeling.

### Key Takeaways

- A class defines a type; an object is a runtime instance.
- Instance methods operate on a particular object.
- `this` refers to the current object.
- Multiple variables can reference one object.
- Object identity and value equality are different design concepts.

---

## Constructors and Object Initialization

Constructors establish the initial state of an object.

A well-designed constructor should make it difficult to create an invalid object.

### Constructors

Example:

```java
public class User {

    private final String id;
    private final String email;

    public User(String id, String email) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Invalid id");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Invalid email");
        }

        this.id = id;
        this.email = email;
    }
}
```

The constructor establishes the object's invariant:

```text
User
 |
 +-- id must exist
 +-- email must exist
```

### Object creation

For:

```java
User user = new User("U-1", "user@example.com");
```

conceptually:

```text
1. Allocate object
2. Initialize fields to default values
3. Execute field initializers / initialization logic
4. Execute constructor
5. Return reference
```

The exact JVM mechanics are more detailed, but this sequence is useful for design reasoning.

### Initialization order

Consider:

```java
public class Example {

    private String name = "default";

    {
        name = "initializer";
    }

    public Example() {
        name = "constructor";
    }
}
```

The initialization stages matter.

A simplified conceptual order is:

```text
Object memory allocated
       |
       v
Fields receive default values
       |
       v
Field initializers / instance initializer blocks
       |
       v
Constructor body
```

Understanding initialization order helps avoid subtle bugs.

### Field initialization

Prefer simple, deterministic initialization.

```java
private final List<OrderItem> items = new ArrayList<>();
```

This ensures the collection exists whenever the object is constructed.

However, initialization should not accidentally perform expensive or externally dependent operations.

Avoid making constructors responsible for:

```text
network calls
database calls
message publishing
complex infrastructure initialization
```

Constructors should establish object validity, not execute entire workflows.

### Constructor delegation

Constructors can delegate:

```java
public Product(String id) {
    this(id, "Unknown", 0);
}

public Product(String id, String name, long price) {
    this.id = id;
    this.name = name;
    this.price = price;
}
```

This reduces duplicated initialization logic.

### Canonical constructors

For immutable data carriers such as Java records:

```java
public record Money(String currency, long amount) {

    public Money {
        if (currency == null || currency.isBlank()) {
            throw new IllegalArgumentException("Currency required");
        }

        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
    }
}
```

The compact constructor is useful for enforcing invariants.

### Constructor design and LLD

A constructor communicates:

> "These are the things required for this object to exist correctly."

For example:

```java
public Order(
        OrderId id,
        CustomerId customerId,
        List<OrderItem> items) {
    ...
}
```

This communicates that an order cannot meaningfully exist without those values.

Conversely:

```java
public Order() {}
```

may allow invalid intermediate states unless there is a real reason for such a constructor.

### Constructor explosion

Too many constructors can make APIs difficult to understand:

```java
new Report(a);
new Report(a, b);
new Report(a, b, c);
new Report(a, b, c, d);
```

Alternatives include:

- static factory methods,
- builders,
- parameter objects,
- records where appropriate.

Choose based on complexity rather than applying a pattern automatically.

### Key Takeaways

- Constructors establish initial object state.
- Important invariants should be protected during creation.
- Initialization order matters.
- Constructor delegation avoids duplication.
- Constructors should generally establish state rather than perform large workflows.
- Constructor design is part of the object's public contract.

---

## Encapsulation and Access Modifiers

Encapsulation means controlling how an object's state and behavior are exposed.

The goal is not simply to make fields `private`.

The deeper goal is:

> **Control how state can change and expose behavior through meaningful operations.**

### Encapsulation

Bad design:

```java
public class BankAccount {
    public long balance;
}
```

Any caller can do:

```java
account.balance = -100000;
```

The object cannot protect its invariant.

Better:

```java
public class BankAccount {

    private long balance;

    public void withdraw(long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }

        if (amount > balance) {
            throw new IllegalStateException("Insufficient funds");
        }

        balance -= amount;
    }
}
```

Now the object controls state changes.

### State and behavior

A useful object-oriented design groups related state and behavior:

```text
BankAccount
 |
 +--> balance
 |
 +--> deposit()
 +--> withdraw()
```

Instead of:

```text
BankAccount
 |
 +--> balance

BankAccountService
 |
 +--> arbitrary balance mutations
```

The service can still coordinate workflows, but the entity should protect its own local invariants where appropriate.

### private

`private` means a member is accessible only within its declaring class.

This is the strongest normal field-level visibility boundary.

```java
private long balance;
```

It prevents arbitrary external mutation.

### protected

`protected` allows access from the class hierarchy and package-related contexts.

Use it deliberately. Excessive protected state can make inheritance hierarchies tightly coupled.

### Package-private

If no modifier is specified:

```java
class InternalOrderValidator {
}
```

the member/type has package-private visibility.

This can be useful for keeping implementation details inside a package.

### public

`public` exposes an API to callers.

Every public method should therefore be treated as part of a contract.

Changing:

```java
public void process(...)
```

can affect many consumers.

### Getters/setters

Getters and setters are not automatically good encapsulation.

This:

```java
public void setStatus(OrderStatus status) {
    this.status = status;
}
```

may allow callers to bypass business rules.

Prefer:

```java
public void confirm() {
    if (status != OrderStatus.PENDING) {
        throw new IllegalStateException("Cannot confirm");
    }

    status = OrderStatus.CONFIRMED;
}
```

The API expresses the business operation rather than exposing raw state mutation.

### Behavior-oriented APIs

Compare:

```java
order.setStatus(CANCELLED);
```

with:

```java
order.cancel();
```

The second communicates intent and provides a place to enforce rules.

Similarly:

```java
cart.getItems().add(item);
```

can bypass cart rules.

Prefer:

```java
cart.addItem(item);
```

Now the cart controls its own invariants.

### Encapsulation and testing

Strong encapsulation does not mean behavior becomes impossible to test.

Test public behavior:

```java
@Test
void cannotCancelConfirmedOrder() {
    Order order = confirmedOrder();

    assertThrows(
            IllegalStateException.class,
            order::cancel
    );
}
```

Tests should generally verify observable behavior rather than internal field implementation.

### Key Takeaways

- Encapsulation protects state and controls valid state transitions.
- `private` fields are useful, but encapsulation is broader than visibility.
- Setters can accidentally expose unrestricted state mutation.
- Behavior-oriented methods communicate intent and enforce invariants.
- Public APIs should be designed as contracts.

---

## Abstraction: Interfaces vs Abstract Classes

Abstraction allows code to depend on a capability or contract rather than unnecessary implementation details.

### Abstraction

Suppose an order needs payment processing.

The order flow does not necessarily need to know:

```text
Stripe SDK details
HTTP requests
API authentication
JSON serialization
provider-specific response formats
```

It may only need:

```java
public interface PaymentProcessor {
    PaymentResult process(PaymentRequest request);
}
```

The stable abstraction is:

```text
PaymentProcessor
       ^
       |
+------+------+
|             |
Stripe      Razorpay
```

### Interfaces

An interface defines a contract.

```java
public interface NotificationChannel {
    void send(Notification notification);
}
```

Implementations:

```java
public class EmailChannel implements NotificationChannel {

    @Override
    public void send(Notification notification) {
        // email-specific behavior
    }
}

public class SmsChannel implements NotificationChannel {

    @Override
    public void send(Notification notification) {
        // SMS-specific behavior
    }
}
```

A consumer can depend on the contract:

```java
public class NotificationService {

    private final NotificationChannel channel;

    public NotificationService(NotificationChannel channel) {
        this.channel = channel;
    }

    public void send(Notification notification) {
        channel.send(notification);
    }
}
```

### Abstract classes

An abstract class can provide both abstraction and shared implementation/state.

```java
public abstract class PaymentGateway {

    protected final String merchantId;

    protected PaymentGateway(String merchantId) {
        this.merchantId = merchantId;
    }

    public abstract PaymentResult charge(PaymentRequest request);

    protected void validate(PaymentRequest request) {
        if (request.amount() <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
    }
}
```

A subclass can reuse shared state and behavior.

### Contracts

An abstraction should represent a meaningful contract.

Good:

```java
PaymentProcessor
```

because it represents a capability.

Weak:

```java
ThingManager
ProcessorFactoryService
```

if the abstraction does not communicate a meaningful responsibility.

### Shared state

Abstract classes are useful when related implementations genuinely share state or implementation.

```text
Base class
 |
 +--> common state
 +--> common behavior
 |
 +--> specialized behavior
```

Interfaces are generally better when you want a capability contract without requiring shared implementation or inheritance.

### Choosing interface vs abstract class

A practical guideline:

Use an **interface** when:

- you need a capability contract,
- implementations may be unrelated,
- multiple types may implement the capability,
- you want loose coupling.

Use an **abstract class** when:

- implementations genuinely share state,
- there is meaningful common behavior,
- there is a strong conceptual base type,
- inheritance is appropriate.

Do not choose inheritance simply to reuse a few methods.

### LLD implication

The important question is not:

> "Interface or abstract class?"

It is:

> "What relationship am I modeling, and what needs to remain stable?"

If the answer is a capability:

```text
PaymentProcessor
NotificationChannel
PricingStrategy
```

an interface is often natural.

If the answer is a true shared base with state and implementation:

```text
BaseFileProcessor
BaseJob
```

an abstract class may be appropriate.

### Key Takeaways

- Abstraction hides implementation details behind meaningful contracts.
- Interfaces are well suited to capabilities and independent implementations.
- Abstract classes are useful when a hierarchy genuinely shares state or behavior.
- Choose based on the relationship and variation, not on a blanket rule.

---

## Inheritance and Its Types

Inheritance allows one type to derive from another.

In Java:

```java
class Dog extends Animal {
}
```

represents an inheritance relationship.

### Inheritance

Inheritance should model a meaningful:

> **is-a**

relationship.

For example:

```text
Vehicle
  ^
  |
Car
```

A car is a vehicle.

But:

```text
Car
  ^
  |
Engine
```

is incorrect. A car has an engine.

### Is-a relationship

Ask:

> Can every instance of the child genuinely be treated as an instance of the parent without violating expectations?

If yes, inheritance may be appropriate.

If not, composition is usually safer.

### Subclasses

Example:

```java
public abstract class Employee {

    private final String id;

    protected Employee(String id) {
        this.id = id;
    }

    public String id() {
        return id;
    }

    public abstract long calculateCompensation();
}
```

Subclass:

```java
public class FullTimeEmployee extends Employee {

    private final long monthlySalary;

    public FullTimeEmployee(String id, long monthlySalary) {
        super(id);
        this.monthlySalary = monthlySalary;
    }

    @Override
    public long calculateCompensation() {
        return monthlySalary;
    }
}
```

### Method overriding

A subclass can provide specialized behavior:

```java
@Override
public long calculateCompensation() {
    return monthlySalary;
}
```

The overriding method must preserve the expectations of the parent contract.

This is closely related to substitutability, which becomes important when studying SOLID later.

### Types of inheritance

Common inheritance structures include:

```text
Single inheritance:

Animal
  |
  +--> Dog
```

```text
Multilevel inheritance:

Animal
  |
  +--> Mammal
          |
          +--> Dog
```

```text
Hierarchical inheritance:

       Animal
       /    \
     Dog    Cat
```

Java classes support single inheritance of classes.

### Multiple inheritance limitation

Java does not allow a class to extend multiple classes:

```java
class C extends A, B { } // invalid
```

But a class can implement multiple interfaces:

```java
class SmartPhone implements Camera, GPS, MusicPlayer {
}
```

This avoids many class-inheritance ambiguities while still allowing multiple capabilities.

### Inheritance and LLD

Inheritance can be useful when:

- the hierarchy represents a real domain relationship,
- substitutability is valid,
- shared behavior/state is meaningful,
- the hierarchy is expected to remain understandable.

Inheritance becomes dangerous when:

- hierarchies become deep,
- subclasses inherit irrelevant behavior,
- parent changes break children,
- subclasses override behavior in surprising ways,
- inheritance is used only for code reuse.

### Key Takeaways

- Inheritance represents an is-a relationship.
- Subclasses must remain valid substitutes for their parent type.
- Java classes have single class inheritance.
- Multiple capabilities can be modeled through interfaces.
- Inheritance should represent domain or behavioral relationships, not merely code reuse.

---

## Polymorphism: Compile-Time vs Runtime

Polymorphism means that the same conceptual operation can work with different types or implementations.

Java supports both compile-time and runtime forms.

### Polymorphism

Consider:

```java
PaymentProcessor processor;
```

The variable can reference different implementations:

```java
processor = new StripePaymentProcessor();
```

or:

```java
processor = new RazorpayPaymentProcessor();
```

The calling code can remain stable.

### Method overloading

Compile-time polymorphism can be represented through method overloading.

```java
public class Printer {

    public void print(String value) {
        System.out.println(value);
    }

    public void print(int value) {
        System.out.println(value);
    }
}
```

The compiler selects the appropriate method based on the argument types.

```java
printer.print("hello");
printer.print(42);
```

### Method overriding

Runtime polymorphism occurs when a subclass overrides a method.

```java
class Animal {
    public void speak() {
        System.out.println("animal");
    }
}

class Dog extends Animal {
    @Override
    public void speak() {
        System.out.println("dog");
    }
}
```

Then:

```java
Animal animal = new Dog();
animal.speak();
```

prints the behavior of `Dog`.

### Compile-time polymorphism

Overloading:

```java
process(Order order)
process(Payment payment)
```

is resolved during compilation.

The compiler determines which signature matches the invocation.

### Runtime polymorphism

Overriding:

```java
Animal animal = new Dog();
animal.speak();
```

uses dynamic dispatch.

The runtime object determines which overridden implementation executes.

### Dynamic dispatch

Conceptually:

```text
Reference type:
Animal

Actual object:
Dog

Call:
animal.speak()

Runtime:
Dog.speak()
```

This is a central mechanism behind polymorphic LLD designs.

### Parent-type references

Using a parent type or interface allows client code to remain independent from implementations.

```java
PaymentProcessor processor =
        new StripePaymentProcessor();
```

The consumer only needs to know:

```text
PaymentProcessor
```

not the complete Stripe implementation.

### LLD example

A notification service:

```java
public interface NotificationChannel {
    void send(Notification notification);
}
```

Client:

```java
public class NotificationService {

    private final NotificationChannel channel;

    public NotificationService(NotificationChannel channel) {
        this.channel = channel;
    }

    public void notify(Notification notification) {
        channel.send(notification);
    }
}
```

The service can work with:

```text
EmailChannel
SmsChannel
PushChannel
```

without changing its core workflow.

This is polymorphism serving a design goal: isolating variation.

### Key Takeaways

- Overloading is compile-time polymorphism.
- Overriding is runtime polymorphism.
- Dynamic dispatch allows behavior to vary according to the runtime object.
- Programming to a parent type or interface can reduce coupling.
- Polymorphism is most valuable when it isolates meaningful variation.

---

## Association, Aggregation, and Composition

Object relationships describe how objects are connected and how ownership/lifetime works.

### Association

Association is a general relationship between objects.

Example:

```text
Doctor -------- Patient
```

A doctor may interact with many patients.

In Java:

```java
public class Doctor {
    private final List<Patient> patients;
}
```

The exact ownership semantics depend on the domain.

### Aggregation

Aggregation represents a whole-part relationship where the part can exist independently of the whole.

Example:

```text
Team
 |
 +--> Player
```

A player can exist even if the team is dissolved.

Conceptually:

```text
Team ----> Player
```

but:

```text
Player lifetime != Team lifetime
```

### Composition

Composition represents stronger ownership.

Example:

```text
Order
 |
 +--> OrderItem
```

If an `OrderItem` exists only as part of a specific order, the order can conceptually own its lifecycle.

```text
Order
 |
 +--> OrderItem
 +--> OrderItem
```

### Has-a relationship

Association, aggregation, and composition often appear as "has-a" relationships.

For example:

```java
public class Order {

    private final List<OrderItem> items;

    public Order(List<OrderItem> items) {
        this.items = new ArrayList<>(items);
    }
}
```

The important question is not simply whether a field exists.

Ask:

> What is the ownership relationship?

### Object ownership

Ownership answers questions such as:

- Who creates the object?
- Who can mutate it?
- Who controls its lifecycle?
- Who is responsible for its invariants?

For example:

```text
Order
 |
 +--> OrderItem
```

If `Order` owns its items, external code should not freely mutate the internal collection.

### Object lifetime

Lifetime relationships matter.

Consider:

```text
Request
 |
 +--> RequestContext
```

If `RequestContext` exists only during a request, its lifetime is bounded by that request.

Compare:

```text
Customer
 |
 +--> Address
```

An address may exist independently depending on the domain model.

### Resource ownership

Ownership becomes particularly important for resources:

- database connections,
- files,
- sockets,
- locks,
- threads.

For example, code that acquires a resource should have a clear responsibility for releasing it.

```java
try (var input = Files.newInputStream(path)) {
    // use resource
}
```

The ownership/lifetime is explicit.

### LLD modeling rule

Do not mechanically classify every relationship as aggregation or composition.

The useful question is:

> **What does the relationship mean in the domain, and who owns the lifecycle and invariants?**

### Key Takeaways

- Association is a general relationship.
- Aggregation indicates a whole-part relationship without strong lifecycle ownership.
- Composition indicates stronger ownership and lifecycle dependence.
- Ownership determines who controls state and object lifetime.
- Resource ownership is especially important for safe production systems.

---

## Dependency Relationships

A dependency exists when one component needs another to perform its work.

Dependencies are unavoidable. The design goal is to control them.

### Dependencies

Example:

```java
public class OrderService {

    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

`OrderService` depends on `PaymentService`.

The design question is:

> Is this dependency stable, necessary, and pointing in the right direction?

### Dependency direction

Suppose business logic directly depends on a concrete infrastructure implementation:

```text
OrderService
    |
    v
StripeSdkClient
```

Now changing providers affects the order logic.

A more isolated design:

```text
OrderService
    |
    v
PaymentProcessor
    ^
    |
StripePaymentProcessor
```

The application depends on a stable capability while infrastructure implements it.

### Abstractions

An abstraction can control dependency direction:

```java
public interface PaymentProcessor {
    PaymentResult process(PaymentRequest request);
}
```

Then:

```java
public class OrderService {

    private final PaymentProcessor paymentProcessor;

    public OrderService(PaymentProcessor paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }
}
```

The service does not need provider-specific details.

### Dependency injection

Dependency injection means providing dependencies to an object rather than making the object construct them internally.

Prefer:

```java
public OrderService(PaymentProcessor paymentProcessor) {
    this.paymentProcessor = paymentProcessor;
}
```

over:

```java
public OrderService() {
    this.paymentProcessor = new StripePaymentProcessor();
}
```

The second design hard-codes the dependency.

### Constructor injection

Constructor injection makes required dependencies explicit:

```java
public OrderService(
        OrderRepository repository,
        PaymentProcessor paymentProcessor) {
    this.repository = repository;
    this.paymentProcessor = paymentProcessor;
}
```

The object cannot be constructed without them.

This improves:

- readability,
- testability,
- dependency visibility,
- immutability of dependencies.

### Coupling

Dependency creates coupling.

The goal is not to remove all coupling.

Instead:

```text
Bad:
Many unnecessary dependencies
        +
Unstable concrete dependencies
        +
Circular dependencies

Better:
Small number of intentional dependencies
        +
Stable contracts
        +
Clear dependency direction
```

### Testability

Dependency injection makes substitution easy:

```java
PaymentProcessor fakePayment =
        request -> PaymentResult.success();

OrderService service =
        new OrderService(repository, fakePayment);
```

The test does not need a real payment provider.

### Circular dependencies

A dangerous structure is:

```text
A --> B
^     |
|     v
+-----+
```

where:

```text
A depends on B
B depends on A
```

Circular dependencies make reasoning and testing harder.

Often the solution is to identify a missing responsibility or move a shared contract to a more appropriate boundary.

### LLD implication

When introducing a dependency, ask:

1. Why does this dependency exist?
2. Does the caller need the whole collaborator or only a capability?
3. Is the dependency stable?
4. Can the dependency be replaced in tests?
5. Is dependency direction appropriate?
6. Does this create a cycle?

### Key Takeaways

- Dependencies are normal; uncontrolled dependencies are the problem.
- Dependency direction strongly influences maintainability.
- Constructor injection makes required dependencies explicit.
- Depending on stable abstractions can isolate infrastructure variation.
- Good dependency structure improves testability and reduces change propagation.

---

## Generics and Type Safety

Generics allow Java code to operate on types while retaining compile-time type safety.

They are particularly important for collections and reusable LLD components.

### Generics

Without generics:

```java
List items = new ArrayList();
items.add("Order");
items.add(100);
```

The collection can contain unrelated values.

With generics:

```java
List<Order> orders = new ArrayList<>();
```

The compiler enforces the intended element type.

### Generic collections

Examples:

```java
List<Order> orders;
Set<UserId> userIds;
Map<ProductId, Product> products;
```

Generics communicate design intent.

```java
Map<ProductId, Product>
```

says:

> Product IDs map to Product objects.

That is more useful than:

```java
Map<Object, Object>
```

### Type safety

Type safety catches many errors during compilation rather than runtime.

```java
List<Order> orders = new ArrayList<>();

orders.add(new Order());

Order order = orders.get(0);
```

The compiler knows the collection contains `Order`.

### Type erasure

Java generics are implemented primarily through type erasure.

For example:

```java
List<String>
```

and:

```java
List<Integer>
```

do not retain those generic type arguments as distinct runtime class types in the same way a developer might expect.

This creates limitations such as:

```java
// Not allowed
new T();
```

inside a generic class without an appropriate mechanism.

Understanding erasure is useful when designing generic APIs.

### Generic invariance

A common mistake is assuming:

```text
List<Dog> is a List<Animal>
```

It is not.

Even though:

```text
Dog is an Animal
```

the generic types are invariant.

Therefore:

```java
List<Dog> dogs = new ArrayList<>();
// List<Animal> animals = dogs; // invalid
```

Why?

If it were allowed, someone could add a `Cat` to the `List<Animal>` reference, violating the original `List<Dog>` guarantee.

### Raw types

Avoid raw types:

```java
List list;
```

Prefer:

```java
List<Order> orders;
```

Raw types weaken type safety and can create runtime `ClassCastException` problems.

### Generics in LLD

Generics make reusable components precise.

For example:

```java
public interface Repository<ID, T> {

    Optional<T> findById(ID id);

    T save(T entity);
}
```

Then:

```java
Repository<OrderId, Order>
```

expresses a precise contract.

However, generic abstractions should still solve a real reuse problem.

Do not create highly generic frameworks when the domain only has one simple repository.

### Key Takeaways

- Generics provide compile-time type safety.
- Generic collections make API intent explicit.
- Java generics use type erasure.
- Generic types are invariant by default.
- Raw types should generally be avoided.
- Generics are useful for reusable, type-safe LLD components but should not become abstraction for abstraction's sake.

---

## The Golden Rule: Composition Over Inheritance

One of the most important design heuristics in LLD is:

> **Prefer composition over inheritance when reuse or behavior can be modeled through collaboration instead of a rigid type hierarchy.**

This is not an absolute prohibition against inheritance.

### Composition

Composition means an object contains or collaborates with other objects.

Example:

```java
public class Car {

    private final Engine engine;

    public Car(Engine engine) {
        this.engine = engine;
    }

    public void start() {
        engine.start();
    }
}
```

The relationship is:

```text
Car
 |
 +--> Engine
```

A car has an engine.

### Delegation

Delegation means an object passes responsibility to a collaborator.

```java
public class OrderService {

    private final PricingPolicy pricingPolicy;

    public OrderService(PricingPolicy pricingPolicy) {
        this.pricingPolicy = pricingPolicy;
    }

    public Money calculateTotal(Order order) {
        return pricingPolicy.calculate(order);
    }
}
```

The order service does not inherit pricing behavior. It delegates pricing to a policy.

### Inheritance

Inheritance creates a stronger relationship:

```text
PaymentProcessor
      ^
      |
CardPaymentProcessor
```

It can be appropriate when the subtype genuinely is a specialization of the parent contract.

### Deep hierarchies

Deep inheritance structures are often difficult to reason about:

```text
Base
 |
 +--> A
      |
      +--> B
           |
           +--> C
                |
                +--> D
```

A change in `Base` can affect many levels.

Developers must understand inherited:

- state,
- methods,
- visibility,
- lifecycle,
- overriding behavior.

This increases coupling.

### Is-a vs has-a

Use this simple question:

```text
Is A a B?
```

If yes, inheritance may be appropriate.

```text
Is a Dog an Animal?
Yes.
```

```text
Does a Car have an Engine?
Yes.
```

That second relationship suggests composition.

### Reuse through composition

Suppose several payment methods need retry behavior.

Instead of:

```text
PaymentProcessor
   |
   +--> RetryablePaymentProcessor
           |
           +--> CardPaymentProcessor
           +--> UpiPaymentProcessor
```

you can compose behavior:

```text
PaymentProcessor
      |
      v
RetryingPaymentProcessor
      |
      v
Actual PaymentProcessor
```

For example:

```java
public class RetryingPaymentProcessor implements PaymentProcessor {

    private final PaymentProcessor delegate;

    public RetryingPaymentProcessor(PaymentProcessor delegate) {
        this.delegate = delegate;
    }

    @Override
    public PaymentResult process(PaymentRequest request) {
        // retry policy
        return delegate.process(request);
    }
}
```

This is composition and delegation.

The behavior can be combined with different implementations without creating a large hierarchy.

### When inheritance is appropriate

Inheritance can still be the correct choice when:

- the relationship is genuinely is-a,
- the parent defines a meaningful contract,
- substitution is valid,
- shared implementation/state is substantial,
- the hierarchy remains shallow and understandable.

### When composition is preferable

Composition is often better when:

- behavior changes independently,
- multiple behaviors need to be combined,
- inheritance would create a deep hierarchy,
- the relationship is has-a,
- you want runtime substitution,
- you want to avoid parent-child coupling.

### A practical example

Suppose a delivery system supports:

```text
StandardDelivery
ExpressDelivery
SameDayDelivery
```

A naive inheritance model may work.

But if delivery also varies independently by:

```text
Pricing
Route calculation
Notification policy
Tracking strategy
```

you could end up with combinations such as:

```text
ExpressDeliveryWithPremiumPricingAndSmsTracking
```

This is a sign that independent behaviors should be composed.

A more flexible structure:

```text
Delivery
 |
 +--> DeliveryPricing
 +--> RouteStrategy
 +--> TrackingPolicy
 +--> NotificationPolicy
```

Now each behavior can vary independently.

### The deeper principle

Composition over inheritance is not:

> "Never use inheritance."

It is:

> "Do not use inheritance when collaboration provides a clearer and more change-friendly model."

### Key Takeaways

- Composition models has-a relationships and collaboration.
- Delegation allows behavior to be provided by collaborators.
- Inheritance is best reserved for genuine is-a relationships and valid substitution.
- Deep inheritance creates coupling and change risk.
- Composition is particularly useful when multiple behaviors vary independently.
- The goal is not fewer classes; it is better responsibility and change isolation.

---

## Key Takeaways

- OOP gives LLD a vocabulary for modeling objects, state, behavior, and relationships.
- Java object references, stack/heap concepts, and pass-by-value semantics are essential for reasoning about object behavior.
- Classes define types; objects represent runtime instances.
- Constructors establish valid initial state and should communicate object requirements.
- Encapsulation protects state and gives business behavior clear ownership.
- Interfaces model contracts and capabilities; abstract classes are useful when meaningful shared state or implementation exists.
- Inheritance represents an is-a relationship and should preserve substitutability.
- Polymorphism allows stable client code to work with different implementations.
- Association, aggregation, and composition describe relationships and ownership/lifetime semantics.
- Dependencies should have clear direction and should be injected rather than unnecessarily constructed internally.
- Generics provide compile-time type safety and make reusable APIs precise.
- Composition and delegation are often more flexible than inheritance for behavior reuse.
- A strong LLD engineer uses OOP mechanisms deliberately rather than treating every language feature as a design requirement.

---

<!-- CONTINUE FROM: Module 3 > Introduction to Design Principles -->
