import type { LldModule } from '../../types/lld.ts';

export const module01: LldModule = {
  slug: 'introduction-to-software-design',
  title: 'Introduction to Software Design',
  order: 1,
  summary: 'Foundations of software design, from decision-making to the professional LLD interview framework.',
  topics: [
    {
      slug: 'what-is-software-design',
      title: 'What is Software Design?',
      order: 1,
      summary: 'Understanding software design as a set of intentional decisions that shape the system\'s evolution.',
      subtopics: [
        {
          id: 'design-as-decisions',
          title: 'Software design as decisions',
          body: 'Software design is not a phase that happens before coding; it is the continuous process of making decisions about how a system is structured. Every time you decide whether to use an interface or a concrete class, or where to place a piece of business logic, you are performing software design.\n\nIn a professional setting, the quality of these decisions determines the "technical debt" of the project. Good decisions make the system resilient to change, while poor decisions create "fragility," where a change in one module breaks unrelated parts of the system.',
        },
        {
          id: 'structure-communication',
          title: 'Structure and communication',
          body: 'Design serves as a communication tool between developers. A well-structured codebase "documents" itself. When a new engineer joins a project, they should be able to infer the system\'s intent simply by looking at the package structure and class relationships.\n\nStructure is about organizing components to minimize cognitive load. By grouping related logic and separating concerns, design reduces the amount of information a developer must hold in their head to make a safe change.',
        },
        {
          id: 'design-enforced-by-code',
          title: 'Design enforced by code',
          body: 'The most effective designs are those enforced by the compiler, not by documentation. Using `final` classes, `private` modifiers, and strict interface contracts ensures that other developers cannot accidentally violate the design intent.\n\nFor example, if a design dictates that a service should only be accessed via an interface, making the implementation class package-private prevents external leakage and enforces the architectural boundary.',
        },
        {
          id: 'design-vs-diagrams',
          title: 'Design vs diagrams',
          body: 'A common mistake is confusing "design" with "drawing diagrams." A UML diagram is a *representation* of a design, not the design itself. The design is the actual logic, the chosen patterns, and the dependency graph of the code.\n\nDiagrams are useful for brainstorming and alignment, but the source of truth is always the code. If the code deviates from the diagram, the diagram is wrong—not the code.',
        },
        {
          id: 'runtime-behavior',
          title: 'Runtime behavior',
          body: 'Design is not just about static class hierarchies; it is about how the system behaves at runtime. This includes how objects are instantiated, how messages flow between them, and how state is managed across requests.\n\nUnderstanding the dynamic nature of design—such as the difference between a static association and a runtime dependency—is critical for debugging complex issues like memory leaks or race conditions in high-throughput Java applications.',
        },
      ],
      javaCode: [
        {
          title: 'Design Enforced by Access Modifiers',
          description: 'Using package-private visibility to enforce the use of a Factory.',
          code: `// Service Interface\npublic interface PaymentProcessor {\n    void process(double amount);\n}\n\n// Implementation is package-private\nclass StripePaymentProcessor implements PaymentProcessor {\n    @Override\n    public void process(double amount) {\n        System.out.println("Processing $" + amount + " via Stripe");\n    }\n}\n\n// Public Factory enforces the design\npublic class PaymentProcessorFactory {\n    public static PaymentProcessor getProcessor() {\n        return new StripePaymentProcessor();\n    }\n}`,
        },
      ],
      diagrams: ['design-decisions-flow'],
      keyTakeaways: [
        'Design is the sum of intentional decisions about structure and behavior.',
        'Good design reduces cognitive load and minimizes the cost of change.',
        'Compiler-enforced constraints are superior to documentation-based guidelines.',
        'The code is the ultimate source of truth for the design, not the diagrams.',
      ],
      interviewTips: [
        'Avoid saying "I will draw a diagram." Instead, say "I will define the structural decisions."',
        'Mention that you prioritize "maintainability" and "extensibility" as the primary goals of your design.',
      ],
      pitfalls: [
        'Over-relying on diagrams that drift from the actual implementation.',
        'Confusing the act of coding with the act of designing.',
        'Using public modifiers for everything, which removes design enforcement.',
      ],
      quiz: [
        {
          question: 'What is the primary difference between software design and software diagrams?',
          options: ['Diagrams are mandatory, design is optional', 'Design is the actual set of decisions; diagrams are just representations', 'Design happens in the IDE, diagrams happen on a whiteboard', 'There is no difference'],
          answerIndex: 1,
          explanation: 'Design is the actual conceptual and structural layout of the code; diagrams are just a way to visualize those decisions.',
        },
        {
          question: 'How can a developer enforce a design decision using Java code?',
          options: ['By writing a long README file', 'By using comments', 'By using access modifiers like private and package-private', 'By using only public classes'],
          answerIndex: 2,
          explanation: 'Access modifiers allow developers to hide implementation details and force users to interact with the system through intended interfaces.',
        },
        {
          question: 'Which of the following is a goal of reducing cognitive load in design?',
          options: ['Increasing the number of classes', 'Making the system more complex', 'Allowing a developer to understand a component without knowing the whole system', 'Writing more lines of code'],
          answerIndex: 2,
          explanation: 'Good design isolates complexity so that developers can work on small parts of the system independently.',
        },
      ],
    },
    {
      slug: 'hld-vs-lld',
      title: 'High-Level vs Low-Level Design — Drawing the Boundary',
      order: 2,
      summary: 'Defining the scope of HLD and LLD and understanding how the boundary shifts based on the problem.',
      subtopics: [
        {
          id: 'hld-lld-definition',
          title: 'HLD vs LLD',
          body: 'High-Level Design (HLD) focuses on the "macro" view of the system. It deals with services, databases, third-party integrations, and the overall data flow. HLD answers the question: "What are the big pieces and how do they talk to each other?"\n\nLow-Level Design (LLD) focuses on the "micro" view. It deals with classes, interfaces, design patterns, and internal logic. LLD answers the question: "How is this specific component implemented to be maintainable and efficient?"',
        },
        {
          id: 'scope-of-decisions',
          title: 'Scope of decisions',
          body: 'The scope of HLD is typically the system boundary. Decisions include choosing between a SQL vs NoSQL database, using a Message Queue for async processing, or selecting a microservices vs monolithic architecture.\n\n The scope of LLD is the component boundary. Decisions include whether to use a Strategy pattern for different pricing algorithms, how to handle object state transitions, or how to structure a complex if-else block into a polymorphic hierarchy.',
        },
        {
          id: 'system-level-decisions',
          title: 'System-level decisions',
          body: 'System-level decisions (HLD) are often concerned with Non-Functional Requirements (NFRs) like scalability, availability, and reliability. For example, deciding to use a CDN to reduce latency is an HLD decision.\n\nThese decisions set the constraints for the LLD. If the HLD decides on a stateless service for scalability, the LLD must ensure that no local session state is stored in the Java classes.',
        },
        {
          id: 'component-level-decisions',
          title: 'Component-level decisions',
          body: 'Component-level decisions (LLD) are concerned with the "cleanliness" of the code. They focus on the SOLID principles, reducing coupling, and increasing cohesion.\n\nAn LLD decision might be: "Instead of a 500-line Service class, I will split it into five specialized Collaborators to ensure each class has a single responsibility."',
        },
        {
          id: 'moving-boundary',
          title: 'Moving HLD/LLD boundary',
          body: 'The boundary between HLD and LLD is fluid. In a small project, HLD might just be a few sketches, and most of the effort is LLD. In a massive distributed system, HLD becomes a full-time job involving infrastructure and networking.\n\nDuring an interview, the "boundary" is often defined by the interviewer. If they ask you to "Design a Parking Lot," they are usually asking for LLD, unless they specifically ask about the cloud infrastructure and database scaling.',
        },
      ],
      javaCode: [
        {
          title: 'LLD Example: Refactoring a Component',
          description: 'Moving from a "God Object" (Poor LLD) to a decoupled structure (Good LLD).',
          code: `// Poor LLD: Everything in one class\nclass OrderService {\n    public void placeOrder(Order o) {\n        // 1. Validate\n        // 2. Calculate Tax\n        // 3. Save to DB\n        // 4. Send Email\n    }\n}\n\n// Good LLD: Delegating to specialized components\nclass OrderService {\n    private final OrderValidator validator;\n    private final TaxCalculator taxCalc;\n    private final OrderRepository repo;\n    private final NotificationService notifier;\n\n    public void placeOrder(Order o) {\n        validator.validate(o);\n        double tax = taxCalc.calculate(o);\n        repo.save(o);\n        notifier.sendEmail(o);\n    }\n}`,
        },
      ],
      diagrams: ['hld-lld-layers'],
      keyTakeaways: [
        'HLD is about services and infrastructure; LLD is about classes and patterns.',
        'HLD answers "What"; LLD answers "How".',
        'HLD constraints (like statelessness) dictate LLD implementation.',
        'The boundary between HLD and LLD shifts based on the system scale.',
      ],
      interviewTips: [
        'If the prompt is ambiguous, clarify: "Are we focusing on the system architecture (HLD) or the class-level design (LLD)?"',
        'Demonstrate that you understand how an LLD decision (e.g., using an interface) supports an HLD goal (e.g., pluggable providers).',
      ],
      pitfalls: [
        'Trying to solve HLD problems (like database sharding) during an LLD interview.',
        'Ignoring HLD constraints when implementing LLD (e.g., adding a static cache in a distributed system).',
      ],
      quiz: [
        {
          question: 'Which of these is typically an LLD decision?',
          options: ['Choosing between AWS and Azure', 'Using a Strategy pattern for payment methods', 'Selecting Kafka as the message broker', 'Deciding on a microservices architecture'],
          answerIndex: 1,
          explanation: 'Design patterns and class structures are the core of Low-Level Design.',
        },
        {
          question: 'True or False: HLD decisions always come before LLD decisions.',
          options: ['True', 'False'],
          answerIndex: 1,
          explanation: 'While typically HLD comes first, design is iterative. An LLD limitation might force a change in the HLD.',
        },
        {
          question: 'What happens when the HLD/LLD boundary is ignored?',
          options: ['The code becomes faster', 'The system is easier to test', 'The developer might over-engineer a component or miss a system-wide constraint', 'Nothing happens'],
          answerIndex: 2,
          explanation: 'Confusion between levels leads to either missing the "big picture" or over-complicating the "small picture".',
        },
      ],
    },
    {
      slug: 'architecture-vs-design',
      title: 'Software Architecture vs Software Design',
      order: 3,
      summary: 'Distinguishing between the immutable structural decisions (Architecture) and the flexible implementation details (Design).',
      subtopics: [
        {
          id: 'arch-design-definition',
          title: 'Architecture vs design',
          body: 'Software Architecture is the set of "significant" decisions that are expensive to change. It defines the skeleton of the system—the boundaries, the communication protocols, and the core technology stack.\n\nSoftware Design is the detailed implementation of that architecture. Architecture is the "What" and the "Where"; Design is the "How."',
        },
        {
          id: 'scope-of-decisions',
          title: 'Scope of decisions',
          body: 'Architectural decisions are global. For example, deciding that "all services must communicate via asynchronous events" is an architectural decision. It affects every single module in the system.\n\nDesign decisions are local. Deciding that "the `User` class should use a `List` instead of a `Set` for roles" is a design decision. It only affects the `User` component and its immediate collaborators.',
        },
        {
          id: 'reversibility',
          title: 'Reversibility',
          body: 'The key differentiator between architecture and design is **reversibility**. A design decision (e.g., changing a loop to a stream) is easily reversed. An architectural decision (e.g., moving from a monolithic database to a distributed event-store) is extremely expensive and risky to reverse.\n\nSenior engineers spend more time analyzing architectural decisions because the "cost of being wrong" is much higher.',
        },
        {
          id: 'arch-decisions',
          title: 'Architectural decisions',
          body: 'Examples of architectural decisions include:\n- **Layering**: Deciding on a 3-tier architecture (Presentation, Business, Data).\n- **Data Strategy**: Choosing a relational database for ACID compliance vs a document store for flexibility.\n- **Integration**: Choosing REST over gRPC for external API consumption.',
        },
        {
          id: 'emergent-architecture',
          title: 'Architecture emerging from design decisions',
          body: 'While architecture is often planned top-down, it can also emerge bottom-up. If several design decisions independently lean towards a specific pattern (e.g., everyone starts using a specific event-bus), a new architectural pattern has emerged.\n\nAgile architecture acknowledges that we cannot know everything upfront. We make the best design decisions we can, and when a pattern emerges that solves a systemic problem, we formalize it as architecture.',
        },
      ],
      javaCode: [
        {
          title: 'Architecture vs Design',
          description: 'Comparing a global architectural boundary with a local design choice.',
          code: `// ARCHITECTURAL DECISION: Layered Architecture\n// The design ensures that the Controller NEVER talks to the Repository directly.\npublic class UserController {\n    private final UserService service; // Architectural boundary\n\n    public void handleRequest(Request req) {\n        service.process(req);\n    }\n}\n\n// DESIGN DECISION: Using a specific data structure\nclass UserService {\n    // Local design choice: Using a Map for O(1) lookup\n    private final Map<String, User> userCache = new HashMap<>();\n\n    public User findUser(String id) {\n        return userCache.get(id);\n    }\n}`,
        },
      ],
      diagrams: ['reversibility-scale'],
      keyTakeaways: [
        'Architecture is about expensive-to-change, global decisions.',
        'Design is about cheaper-to-change, local decisions.',
        'Reversibility is the main metric for distinguishing the two.',
        'Architecture can be planned (top-down) or emergent (bottom-up).',
      ],
      interviewTips: [
        'When discussing a design, explicitly mention the architectural constraint it satisfies. E.g., "This design choice ensures we maintain the statelessness required by our HLD."',
        'Show maturity by acknowledging that some decisions are "hard to reverse" and require deeper analysis.',
      ],
      pitfalls: [
        'Treating every design choice as an "architectural" decision (over-engineering).',
        'Underestimating the cost of changing a core architectural boundary.',
      ],
      quiz: [
        {
          question: 'Which of the following is an architectural decision?',
          options: ['Using a HashMap instead of a TreeMap', 'Choosing a Microservices architecture over a Monolith', 'Renaming a variable for clarity', 'Adding a getter method to a class'],
          answerIndex: 1,
          explanation: 'The choice of system-wide structure (Microservices vs Monolith) is a global decision that is expensive to reverse.',
        },
        {
          question: 'What is "reversibility" in the context of software design?',
          options: ['The ability to undo a git commit', 'The ease with which a decision can be changed without breaking the whole system', 'The ability to run a program in reverse', 'The process of refactoring code'],
          answerIndex: 1,
          explanation: 'Reversibility refers to the cost and effort required to change a structural decision.',
        },
        {
          question: 'True or False: Architecture can emerge from design decisions.',
          options: ['True', 'False'],
          answerIndex: 0,
          explanation: 'Emergent architecture happens when local design patterns are successfully scaled to the system level.',
        },
      ],
    },
    {
      slug: 'functional-vs-non-functional',
      title: 'Functional vs Non-Functional Requirements',
      order: 4,
      summary: 'Learning to balance "what the system does" with "how the system performs."',
      subtopics: [
        {
          id: 'functional-reqs',
          title: 'Functional requirements',
          body: 'Functional requirements (FRs) define the specific behaviors of the system. They are the "features." If a functional requirement is not met, the system is incomplete.\n\nExample: "A user must be able to add an item to the shopping cart." This is a binary requirement—either the user can do it, or they cannot.',
        },
        {
          id: 'non-functional-reqs',
          title: 'Non-functional requirements',
          body: 'Non-functional requirements (NFRs) define the *constraints* or *quality attributes* of the system. They describe "how" the system should perform its functions. NFRs include scalability, availability, security, and maintainability.\n\nExample: "The shopping cart must load within 200ms for 10,000 concurrent users." The system still "works" (functional) if it takes 5 seconds, but it fails the NFR.',
        },
        {
          id: 'performance-constraints',
          title: 'Performance constraints',
          body: 'Performance constraints are a subset of NFRs. They often involve trade-offs. For instance, increasing availability (via redundancy) might increase latency (via synchronization overhead).\n\nIn an LLD interview, you must explicitly ask about performance constraints. A "Parking Lot" design for 10 cars is very different from one for 10,000 cars (concurrency, locking, and DB indexing become critical).',
        },
        {
          id: 'quantifiable-reqs',
          title: 'Quantifiable requirements',
          body: 'A common mistake is using vague terms like "the system should be fast" or "it should be scalable." These are not requirements; they are wishes. Professional requirements must be quantifiable.\n\nCorrect: "The system must support 5,000 requests per second with a p99 latency of 100ms." This gives the designer a concrete target to aim for when choosing data structures and algorithms.',
        },
        {
          id: 'reqs-influencing-arch',
          title: 'Requirements influencing architecture',
          body: 'NFRs usually drive the architecture more than FRs. If the primary requirement is "High Availability" (99.999%), you are forced into a distributed architecture with failover mechanisms, regardless of the functional features.\n\nSimilarly, a requirement for "Strict Auditability" (NFR) might force you to use Event Sourcing instead of a simple CRUD database.',
        },
      ],
      javaCode: [
        {
          title: 'FR vs NFR implementation',
          description: 'Showing how an NFR (Performance/Concurrency) changes the LLD of a functional requirement.',
          code: `// Functional Req: "Allow users to increment a counter"\n\n// Version 1: Ignores NFRs (Not thread-safe)\nclass SimpleCounter {\n    private int count = 0;\n    public void increment() { count++; }\n}\n\n// Version 2: Satisfies NFR "Must be thread-safe for 100 concurrent threads"\nimport java.util.concurrent.atomic.AtomicInteger;\n\nclass ThreadSafeCounter {\n    private final AtomicInteger count = new AtomicInteger(0);\n    public void increment() { count.incrementAndGet(); }\n}`,
        },
      ],
      diagrams: [],
      keyTakeaways: [
        'FRs = What the system does; NFRs = How the system performs.',
        'NFRs (scalability, availability) often drive the architecture.',
        'Requirements must be quantifiable (e.g., "200ms p99") to be useful.',
        'Trade-offs are inevitable: you often trade one NFR (e.g., consistency) for another (e.g., availability).',
      ],
      interviewTips: [
        'Proactively ask: "What are the non-functional requirements for this system? Specifically, what are the expected load and latency targets?"',
        'When you propose a design, justify it using an NFR: "I used a ConcurrentHashMap here to ensure we meet the low-latency requirement for concurrent reads."',
      ],
      pitfalls: [
        'Focusing only on functional requirements and ignoring performance/scalability.',
        'Using vague language ("fast", "scalable") instead of numbers.',
      ],
      quiz: [
        {
          question: 'Which of the following is a non-functional requirement?',
          options: ['User can reset their password', 'System must support 1,000 transactions per second', 'Admin can delete users', 'User can upload a profile picture'],
          answerIndex: 1,
          explanation: 'Transactions per second is a performance metric (NFR), not a feature (FR).',
        },
        {
          question: 'Why is it important to quantify NFRs?',
          options: ['To make the documentation look professional', 'To provide a concrete target for design and validation', 'To increase the project budget', 'Because the compiler requires it'],
          answerIndex: 1,
          explanation: 'Quantifiable targets allow designers to choose the correct tools (e.g., choosing a cache vs a DB).',
        },
        {
          question: 'True or False: NFRs can override FRs in terms of design influence.',
          options: ['True', 'False'],
          answerIndex: 0,
          explanation: 'High-availability or security requirements often dictate the entire architectural approach, regardless of the features.',
        },
      ],
    },
    {
      slug: 'design-process-thinking',
      title: 'The Software Design Process and Design Thinking',
      order: 5,
      summary: 'Applying an iterative, user-centric approach to solve design problems effectively.',
      subtopics: [
        {
          id: 'design-process',
          title: 'Software design process',
          body: 'Software design is an iterative loop: Understand $\rightarrow$ Propose $\rightarrow$ Validate $\rightarrow$ Refine. It is rarely a linear path. The goal is to reduce uncertainty by making the most critical decisions first.\n\nIn professional LLD, this process involves identifying the "core" of the problem—the part that is most likely to change or is most complex—and focusing design efforts there.',
        },
        {
          id: 'iterative-design',
          title: 'Iterative design',
          body: 'Iterative design acknowledges that the first solution is rarely the best. It encourages creating a "Minimum Viable Design" that satisfies the basic requirements, then refining it to handle edge cases and NFRs.\n\nThis prevents "Analysis Paralysis," where a designer spends weeks trying to find the "perfect" architecture before writing a single line of code.',
        },
        {
          id: 'design-thinking',
          title: 'Design thinking',
          body: 'Design Thinking is a human-centric approach to problem-solving. In LLD, this means thinking about the *developer* as the user. A design that is mathematically perfect but impossible for a human to maintain is a bad design.\n\nIt involves Empathy (understanding the pain of the current code), Definition (narrowing the problem), Ideation (brainstorming patterns), Prototyping (sketching classes), and Testing (code review/validation).',
        },
        {
          id: 'define-phase',
          title: 'Define',
          body: 'The "Define" phase is the most critical. It involves translating vague business requests into technical requirements. If you define the wrong problem, your perfect design will be useless.\n\nExample: If a client says "I want a fast search," the define phase clarifies: "Do we need real-time results as the user types, or is a 1-second delay acceptable?" This changes the design from a Trie-based approach to a simple DB query.',
        },
        {
          id: 'design-activities',
          title: 'Design activities',
          body: 'Core design activities include:\n- **Domain Modeling**: Identifying entities and their relationships.\n- **Interface Design**: Defining the contracts between components.\n- **Pattern Selection**: Applying proven solutions to common problems.\n- **Trade-off Analysis**: Weighing the pros and cons of different approaches.',
        },
        {
          id: 'problem-understanding',
          title: 'Problem understanding',
          body: 'Deep problem understanding requires asking "Why" multiple times. When a requirement seems strange, it usually hides a deeper constraint. Understanding the "Why" prevents over-engineering and helps in identifying the correct abstraction.\n\nExample: If you are asked to "support multiple currencies," the "Why" might be that the system needs to handle exchange rate fluctuations in real-time, not just store a currency symbol.',
        },
      ],
      javaCode: [
        {
          title: 'Iterative Refinement Example',
          description: 'Moving from a naive implementation to a more refined design based on new requirements.',
          code: `// Iteration 1: Simple requirements\nclass DiscountService {\n    public double apply(double price) {\n        return price * 0.9; // Hardcoded 10% discount\n    }\n}\n\n// Iteration 2: New requirement - "Different discounts for different users"\ninterface DiscountStrategy {\n    double calculate(double price);\n}\n\nclass DiscountService {\n    private final DiscountStrategy strategy;\n    public DiscountService(DiscountStrategy s) { this.strategy = s; }\n    public double apply(double price) { return strategy.calculate(price); }\n}`,
        },
      ],
      diagrams: ['design-decisions-flow'],
      keyTakeaways: [
        'Design is an iterative loop: Understand $\rightarrow$ Propose $\rightarrow$ Validate $\rightarrow$ Refine.',
        'Design Thinking focuses on the developer as the end-user of the code.',
        'The "Define" phase is where most design failures happen; clarify requirements first.',
        'Avoid Analysis Paralysis by starting with a simple design and refining it.',
      ],
      interviewTips: [
        'During an interview, talk through your iterative process. Say: "Initially, I will implement this simply, then I will refine it to handle X constraint."',
        'Ask clarifying questions to show you are in the "Define" phase of design thinking.',
      ],
      pitfalls: [
        'Jumping straight into coding without a "Define" phase.',
        'Over-engineering the first iteration to handle every possible future requirement (violating YAGNI).',
      ],
      quiz: [
        {
          question: 'What is the primary goal of "Design Thinking" in LLD?',
          options: ['To use the most complex patterns', 'To make the code a work of art', 'To make the system maintainable for humans (developers)', 'To avoid using diagrams'],
          answerIndex: 2,
          explanation: 'Design thinking in LLD is about reducing cognitive load for the people who will maintain the code.',
        },
        {
          question: 'What is "Analysis Paralysis" in software design?',
          options: ['A bug that freezes the UI', 'Spending too much time trying to find a "perfect" design without implementing', 'The process of debugging complex code', 'A state where the compiler cannot resolve types'],
          answerIndex: 1,
          explanation: 'It is the tendency to over-analyze and fail to make a decision, delaying the project.',
        },
        {
          question: 'Which phase of design thinking involves translating business needs into technical requirements?',
          options: ['Ideation', 'Define', 'Prototyping', 'Testing'],
          answerIndex: 1,
          explanation: 'The Define phase is where the problem is clarified and technical requirements are set.',
        },
      ],
    },
    {
      slug: 'good-design-characteristics',
      title: 'Characteristics of Good Software Design',
      order: 6,
      summary: 'Measuring the quality of a design through the lenses of maintainability, coupling, and cohesion.',
      subtopics: [
        {
          id: 'maintainability',
          title: 'Maintainability',
          body: 'Maintainability is the ease with which a software system can be modified to correct faults, improve performance, or adapt to a changed environment. A maintainable system is one where a change in one requirement leads to a change in a small, predictable part of the code.\n\nMaintainability is the ultimate metric of design quality. If a system is "hard to maintain," it means the design has failed to manage complexity.',
        },
        {
          id: 'coupling',
          title: 'Coupling',
          body: 'Coupling is the degree of interdependence between software modules. **Tight coupling** occurs when a class knows too much about the internal workings of another class. This makes the system fragile: changing Class A breaks Class B.\n\n**Loose coupling** is achieved by interacting through interfaces and abstractions. When classes are loosely coupled, they can be developed, tested, and replaced independently.',
        },
        {
          id: 'cohesion',
          title: 'Cohesion',
          body: 'Cohesion is the degree to which the elements inside a module belong together. **High cohesion** means a class does one thing and does it well (Single Responsibility). **Low cohesion** occurs in "God Objects" that handle unrelated tasks (e.g., a `User` class that also handles database connections and email sending).\n\nHigh cohesion makes a class easier to understand and less likely to change for unrelated reasons.',
        },
        {
          id: 'cost-of-change',
          title: 'Cost of change',
          body: 'The "Cost of Change" is the amount of effort (time, risk, testing) required to implement a new feature or fix a bug. In a poorly designed system, the cost of change grows exponentially over time.\n\nGood design keeps the cost of change linear. By using abstractions and loose coupling, you ensure that adding the 100th feature is not significantly harder than adding the 1st.',
        },
        {
          id: 'change-impact',
          title: 'Change impact',
          body: 'Change impact (or "Blast Radius") is the number of components affected by a single change. A design with a large blast radius is dangerous because it introduces regressions in unexpected places.\n\nReducing the blast radius is achieved through **encapsulation** and **information hiding**. By hiding the internal details of a module, you ensure that changes to those details do not leak out to the rest of the system.',
        },
        {
          id: 'measuring-quality',
          title: 'Measuring design quality',
          body: 'While design is often subjective, we can use quantitative metrics to flag "smells":\n- **Cyclomatic Complexity**: Measures the number of linear paths through the code (too many if/else/loops $\rightarrow$ bad).\n- **Lack of Cohesion in Methods (LCOM)**: Measures how many methods share the same fields.\n- **Afferent/Efferent Coupling**: Measures how many classes depend on a module vs how many the module depends on.',
        },
      ],
      javaCode: [
        {
          title: 'Tightly Coupled vs Loosely Coupled',
          description: 'Comparison of coupling in a notification system.',
          code: `// Tightly Coupled: OrderService depends on a concrete EmailSender\nclass OrderService {\n    private final EmailSender sender = new EmailSender(); // Tight coupling\n    public void completeOrder() {\n        sender.sendEmail(\"Order complete!\");\n    }\n}\n\n// Loosely Coupled: OrderService depends on an abstraction\ninterface NotificationProvider {\n    void notify(String msg);\n}\n\nclass OrderService {\n    private final NotificationProvider provider; // Loose coupling\n    public OrderService(NotificationProvider p) { this.provider = p; }\n    public void completeOrder() {\n        provider.notify(\"Order complete!\");\n    }\n}`,
        },
      ],
      diagrams: ['blast-radius'],
      keyTakeaways: [
        'Maintainability = Ease of modification.',
        'Loose Coupling = Independence between modules.',
        'High Cohesion = Focus within a module.',
        'Good design keeps the "cost of change" linear over time.',
      ],
      interviewTips: [
        'When reviewing your design, use these terms explicitly. Say: "I am using an interface here to reduce coupling and increase the maintainability of the system."',
        'If an interviewer asks "How do you know your design is good?", talk about cohesion, coupling, and the blast radius of changes.',
      ],
      pitfalls: [
        'Over-abstracting in an attempt to achieve "perfect" loose coupling, which can actually increase cognitive load.',
        'Confusing "more classes" with "higher cohesion".',
      ],
      quiz: [
        {
          question: 'What is the result of "Tight Coupling" in a system?',
          options: ['Higher performance', 'Reduced memory usage', 'Increased fragility (changes in one class break others)', 'Better cohesion'],
          answerIndex: 2,
          explanation: 'Tight coupling means components are highly interdependent, making the system fragile.',
        },
        {
          question: 'Which of these describes a "God Object"?',
          options: ['A class that is highly optimized', 'A class with very low cohesion that handles too many unrelated responsibilities', 'A class that uses a Singleton pattern', 'A class with no methods'],
          answerIndex: 1,
          explanation: 'A God Object is the opposite of high cohesion; it does everything, making it a maintenance nightmare.',
        },
        {
          question: 'What does "Blast Radius" refer to in software design?',
          options: ['The time it takes for a system to crash', 'The number of components affected by a single change', 'The amount of memory a class uses', 'The speed of network communication'],
          answerIndex: 1,
          explanation: 'Blast radius is the scope of impact a change has on the rest of the system.',
        },
      ],
    },
    {
      slug: 'common-design-mistakes',
      title: 'Common Software Design Mistakes',
      order: 7,
      summary: 'Identifying "design smells" that lead to technical debt and learning how to avoid them.',
      subtopics: [
        {
          id: 'god-objects',
          title: 'God objects',
          body: 'A "God Object" is a class that knows too much or does too much. It typically has thousands of lines of code and manages multiple unrelated responsibilities.\n\nThis violates the Single Responsibility Principle. The result is a class that is impossible to test in isolation and a nightmare to modify because any change could have unintended side effects across the entire system.',
        },
        {
          id: 'premature-abstraction',
          title: 'Premature abstraction',
          body: "Premature abstraction is the act of creating interfaces, generics, or design patterns before there is a concrete need for them. It is a form of over-engineering driven by the fear of future changes.\n\n\"We might need to support other databases in the future, so let's create an `IDataStore` interface now.\" If you only ever use one database, this abstraction adds unnecessary complexity and cognitive load without providing any value.",
        },
        {
          id: 'poor-design-decisions',
          title: 'Poor design decisions',
          body: 'Poor decisions often stem from ignoring trade-offs. For example, choosing a "convenient" solution (like a global static variable) over a "correct" one (like dependency injection). \n\nOther poor decisions include ignoring the "cost of change" or failing to encapsulate internal state, allowing external classes to manipulate private fields through public getters/setters.',
        },
        {
          id: 'design-review',
          title: 'Design review',
          body: 'Many design mistakes are caught—or created—during design reviews. A poor review focuses on syntax or "preference" (e.g., "I prefer this variable name"). A great review focuses on the *impact* of decisions.\n\nEffective review questions include: "What happens if this requirement changes?", "How do we test this in isolation?", and "Does this introduce a circular dependency?",',
        },
        {
          id: 'refactoring-prevention',
          title: 'Refactoring prevention',
          body: 'Refactoring prevention occurs when a design is so rigid that developers are afraid to change it. This usually happens because of tight coupling and a lack of automated tests.\n\nWhen the "cost of change" becomes too high, the team stops improving the design and starts "hacking" around it, leading to a death spiral of technical debt.',
        },
      ],
      javaCode: [
        {
          title: 'God Object vs. Refactored Design',
          description: 'Refactoring a God Object into cohesive components.',
          code: `// Poor Design: God Object\nclass OrderManager {\n    public void processOrder(Order o) {\n        // 1. Validate order\n        // 2. Calculate shipping\n        // 3. Charge credit card\n        // 4. Update inventory\n        // 5. Send email\n    }\n}\n\n// Good Design: Cohesive components\nclass OrderProcessor {\n    private final OrderValidator validator;\n    private final ShippingService shipping;\n    private final PaymentGateway payment;\n    private final InventoryManager inventory;\n    private final EmailService email;\n\n    public void processOrder(Order o) {\n        validator.validate(o);\n        shipping.calculate(o);\n        payment.charge(o);\n        inventory.update(o);\n        email.send(o);\n    }\n}`,
        },
      ],
      diagrams: [],
      keyTakeaways: [
        'God Objects violate SRP and increase fragility.',
        'Avoid "Speculative Generality" (premature abstraction).',
        'Design reviews should focus on trade-offs and impact, not preferences.',
        'Rigid designs that prevent refactoring lead to rapid technical debt accumulation.',
      ],
      interviewTips: [
        'If asked to critique a design, look for God Objects or premature abstractions. Use the term "Design Smell" to describe these issues.',
        'When proposing a change, explain how it reduces the "cost of change" or "blast radius".',
      ],
      pitfalls: [
        'Using patterns just to "show off" rather than to solve a specific problem.',
        'Ignoring the warning signs of a God Object until it is too late to refactor easily.',
      ],
      quiz: [
        {
          question: 'What is "Premature Abstraction"?',
          options: ['Using an interface for every single class', 'Creating an abstraction before there is a proven need for it', 'Using a design pattern correctly', 'Refactoring code to be more generic'],
          answerIndex: 1,
          explanation: 'Premature abstraction is over-engineering based on hypothetical future needs.',
        },
        {
          question: 'Which of these is a characteristic of a "God Object"?',
          options: ['High cohesion', 'Low coupling', 'Low cohesion and excessive responsibility', 'Excellent testability'],
          answerIndex: 2,
          explanation: 'God Objects handle too many unrelated tasks, resulting in low cohesion.',
        },
        {
          question: 'What is the most effective way to prevent a design from becoming "rigid"?',
          options: ['Writing more documentation', 'Using as many patterns as possible', 'Maintaining high test coverage and loose coupling', 'Avoiding all changes to the code'],
          answerIndex: 2,
          explanation: 'Tests provide the safety net needed to refactor, and loose coupling ensures changes are isolated.',
        },
      ],
    },
    {
      slug: 'read-write-design-docs',
      title: 'How to Read and Write Design Documents',
      order: 8,
      summary: 'The art of documenting architectural and design decisions for clarity, alignment, and future reference.',
      subtopics: [
        {
          id: 'design-docs-purpose',
          title: 'Design documents',
          body: 'A design document (or RFC - Request for Comments) is a written proposal for a technical change. Its purpose is not to record "what" is being built, but "why" it is being built this way. It is a tool for alignment before expensive coding begins.\n\nA good document allows a reviewer to understand the problem, the proposed solution, and the trade-offs without needing to talk to the author.',
        },
        {
          id: 'recording-decisions',
          title: 'Decisions',
          body: "The core of a design doc is the \"Decision Log.\" Instead of saying \"We will use Kafka,\" say \"We chose Kafka over RabbitMQ because we need partitioned-log replayability for our audit trail.\"\n\nDocumenting the *rationale* is more important than documenting the *choice*. This prevents future developers from reverting a decision because they didn't understand the original constraint.",
        },
        {
          id: 'non-goals',
          title: 'Non-goals',
          body: 'A "Non-goals" section is essential for preventing scope creep. It explicitly states what the design will NOT address. For example: "Non-goal: This design will not handle international currency conversion; it assumes all transactions are in USD."\n\nThis manages expectations and keeps the design focused on the immediate problem.',
        },
        {
          id: 'alternatives',
          title: 'Alternatives',
          body: 'A professional design doc must list the alternatives considered and why they were rejected. "We considered using a Synchronous API, but rejected it because it would introduce a tight coupling between the Order and Payment services."\n\nListing alternatives proves that the designer has done their due diligence and didn\'t just pick the first pattern that came to mind.',
        },
        {
          id: 'design-review-docs',
          title: 'Design review',
          body: 'The review process for a doc is where the "battle" for the design happens. Reviewers should look for edge cases, security holes, and violations of existing architectural boundaries.\n\nComments should be constructive and based on evidence. Instead of "I don\'t like this," use "If the database goes down, this design will cause a cascading failure because there is no circuit breaker."',
        },
        {
          id: 'trade-off-recording',
          title: 'Recording trade-offs',
          body: 'Every design has a trade-off. A design that claims to have "no downsides" is usually a sign of an inexperienced designer. Professional docs explicitly state the cost of the chosen approach.\n\nExample: "By choosing Eventual Consistency, we gain extreme write scalability but accept that users may see stale data for up to 500ms." This transparency allows the business to decide if the trade-off is acceptable.',
        },
      ],
      javaCode: [],
      diagrams: [],
      keyTakeaways: [
        'Design docs focus on the "Why", not the "What".',
        'Recording the rationale prevents the "Chesterton\'s Fence" problem (removing something without knowing why it was put there).',
        'Non-goals are critical for preventing scope creep.',
        'Listing alternatives proves the design was a conscious choice, not an accident.',
      ],
      interviewTips: [
        'If an interviewer asks "How do you handle design changes in a team?", talk about RFCs and design documents.',
        'Mention that you value "recording trade-offs" so that future maintainers understand the constraints of the current system.',
      ],
      pitfalls: [
        'Writing a "tutorial" instead of a "design document".',
        'Omitting the "Alternatives" section, making the design seem arbitrary.',
      ],
      quiz: [
        {
          question: 'What is the primary purpose of a "Non-goals" section in a design document?',
          options: ['To list features for future versions', 'To prevent scope creep by explicitly stating what is NOT being solved', 'To explain why the project is failing', 'To describe the user interface'],
          answerIndex: 1,
          explanation: 'Non-goals set boundaries and manage expectations about the scope of the solution.',
        },
        {
          question: 'Why should a designer list "Alternatives Considered" in their document?',
          options: ['To make the document longer', 'To show they know many patterns', 'To prove that the chosen solution is a conscious trade-off after evaluating other options', 'Because the manager requires it'],
          answerIndex: 2,
          explanation: 'Listing alternatives demonstrates a rigorous design process and justifies the chosen approach.',
        },
        {
          question: 'What is the most important thing to record when making a design decision?',
          options: ['The date and time', 'The name of the developer', 'The rationale/reasoning behind the decision', 'The number of lines of code'],
          answerIndex: 2,
          explanation: 'The rationale is what prevents future developers from making incorrect changes to a system they didn\'t build.',
        },
      ],
    },
    {
      slug: 'lld-approach-framework',
      title: 'The Framework: How to Approach LLD Problems',
      order: 9,
      summary: 'A structured, step-by-step approach to tackle any LLD interview or real-world problem.',
      subtopics: [
        {
          id: 'restate-problem',
          title: 'Restate the problem',
          body: 'Never start designing immediately. First, restate the problem in your own words to the interviewer. This ensures you and the interviewer are aligned on the goal.\n\nExample: "So, we are designing a Parking Lot system that needs to handle different vehicle sizes, track availability in real-time, and calculate fees based on duration. Is that correct?"',
        },
        {
          id: 'define-scope',
          title: 'Define scope',
          body: 'Clarify the boundaries. What is "in scope" and what is "out of scope"? This prevents you from wasting time on trivial details or getting bogged down in HLD problems.\n\nExample: "I will assume the payment processing is handled by an external API, so I will focus on the internal state management of the parking lot rather than the credit card transaction logic."',
        },
        {
          id: 'identify-requirements',
          title: 'Identify requirements',
          body: 'Separate requirements into Functional (FRs) and Non-Functional (NFRs). Write them down as a list. This acts as a checklist for your design.\n\nFRs: User can enter, User can exit, Admin can view stats.\nNFRs: Thread-safe concurrency, Low latency for entry/exit, Maintainability for new vehicle types.',
        },
        {
          id: 'design-structure',
          title: 'Design structure',
          body: 'Start with the "Core Entities" (the Nouns). Define their relationships (Association, Composition). Then, move to "Behavior" (the Verbs)—the methods and services that coordinate the entities.\n\nUse a "bottom-up" approach for entities and a "top-down" approach for the API/Interface.',
        },
        {
          id: 'analyze-dependencies',
          title: 'Analyze dependencies',
          body: 'Look at your class diagram and check for "Design Smells." Are there circular dependencies? Is one class doing too much (God Object)? Are you depending on concrete classes instead of interfaces?\n\nApply the SOLID principles here to refine the structure. If you see tight coupling, introduce a strategy or a factory.',
        },
        {
          id: 'consider-nfrs',
          title: 'Consider NFRs',
          body: 'Review your design against the NFRs you listed. If the system needs to be thread-safe, where do you need synchronization? If it needs to be extensible, where can you use the Open-Closed Principle?\n\nThis is where you add "Professional Polish" to the design—adding `volatile` keywords, using `ConcurrentHashMap`, or implementing a Circuit Breaker.',
        },
        {
          id: 'review-design',
          title: 'Review the design',
          body: 'Walk through a "Happy Path" scenario from start to finish. "A car arrives $\rightarrow$ Entry gate checks availability $\rightarrow$ Ticket issued $\rightarrow$ Car parks."\n\nThen, walk through "Edge Cases." What happens if the lot is full? What happens if the payment fails? This proves the robustness of your design.',
        },
        {
          id: 'interview-framework',
          title: 'LLD interview framework',
          body: 'In a 45-minute interview, time is your biggest enemy. Use this allocation:\n- **5-10 mins**: Clarification, Scope, and Requirements.\n- **15-20 mins**: Core Entities and Class Diagram (the "Skeleton").\n- **10 mins**: Deep dive into 1-2 complex behaviors/patterns.\n- **5 mins**: Trade-offs and NFR review.',
        },
      ],
      javaCode: [],
      diagrams: [],
      keyTakeaways: [
        'Never jump straight into code; always start with requirements and scope.',
        'Separate FRs and NFRs to ensure a complete design.',
        'Use the "Nouns-then-Verbs" approach to build the class structure.',
        'Validate the design with both happy paths and edge cases.',
      ],
      interviewTips: [
        'Treat the interviewer as a collaborator. "I am thinking of using a Strategy pattern here to handle different vehicle pricing; does that sound reasonable to you?"',
        'Strictly manage your time. If you spend 30 minutes on requirements, you will fail the interview.',
      ],
      pitfalls: [
        'Starting the design before clarifying the scope.',
        'Ignoring NFRs until the very end, requiring a massive redesign of the core classes.',
      ],
      quiz: [
        {
          question: 'What is the first step in the LLD framework?',
          options: ['Draw a class diagram', 'Write the Java code', 'Restate the problem and clarify scope', 'Choose a design pattern'],
          answerIndex: 2,
          explanation: 'Alignment on the problem and scope is essential before any design work begins.',
        },
        {
          question: 'Why should you walk through "Edge Cases" at the end of a design?',
          options: ['To waste time', 'To prove the design is robust and handles failures gracefully', 'To show off your coding skills', 'Because the interviewer always asks for it'],
          answerIndex: 1,
          explanation: 'Edge cases reveal gaps in the logic and show that the designer has thought about real-world failure modes.',
        },
        {
          question: 'What is a recommended time allocation for the "Core Entities/Class Diagram" phase in a 45-min interview?',
          options: ['5 minutes', '15-20 minutes', '35 minutes', '0 minutes (just code)'],
          answerIndex: 1,
          explanation: 'The structural skeleton is the meat of the LLD interview and requires the most focus.',
        },
      ],
    },
  ],
};
