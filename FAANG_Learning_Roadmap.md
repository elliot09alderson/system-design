# FAANG Learning Roadmap: OOP, SOLID, Design Patterns & System Design
> For MERN Stack Developers with Zero OOP Background

---

## The Big Picture

FAANG interviews test two distinct things:

| Interview Type | What it tests |
|---|---|
| **LLD** (Low Level Design) | OOP + SOLID + Design Patterns |
| **HLD** (High Level Design / System Design) | Distributed systems, scalability, trade-offs |

You need both. Start with LLD — it's the foundation.

---

## Phase 1: OOP Fundamentals (2–3 weeks)

You already write JavaScript. Good news — JS has classes. Start there, not Java.

### 4 Pillars to internalize:

```
Encapsulation  → bundle data + behavior, hide internals
Abstraction    → expose only what's needed (interfaces/contracts)
Inheritance    → parent/child class hierarchy
Polymorphism   → same method name, different behavior per class
```

### Practice track:
- Model real things: `BankAccount`, `Animal`, `Vehicle`, `User`
- Build each with **TypeScript** (adds interfaces, access modifiers — much closer to what FAANG interviewers expect)
- Rule: *no functions outside classes* during this phase

### Resources:
- "Object-Oriented JavaScript" by Stoyan Stefanov — JS-native
- TypeScript docs on classes/interfaces (free, official)

---

## Phase 2: SOLID Principles (2 weeks)

Learn each principle by seeing a **violation first**, then the fix.

| Principle | One-line meaning | Common violation |
|---|---|---|
| **S** — Single Responsibility | One class, one reason to change | `UserService` that also sends emails AND logs |
| **O** — Open/Closed | Open to extend, closed to modify | Adding `if (type === 'new')` everywhere |
| **L** — Liskov Substitution | Subclasses must be substitutable | `Square extends Rectangle` breaking area logic |
| **I** — Interface Segregation | Don't force classes to implement unused methods | Fat interfaces with 20 methods |
| **D** — Dependency Inversion | Depend on abstractions, not concretions | `new MySQLDatabase()` hardcoded inside a service |

### Practice:
Take your Phase 1 classes and deliberately break each principle, then fix it.
Teaching yourself the violation is more memorable than just reading.

---

## Phase 3: Design Patterns (4–5 weeks)

The 23 GoF patterns group into three categories:

### Creational — how objects are created

| Pattern | Use case |
|---|---|
| **Singleton** | DB connection, Logger |
| **Factory Method** | Create objects without specifying exact class |
| **Abstract Factory** | Family of related objects |
| **Builder** | Step-by-step construction (SQL query builder, Config) |
| **Prototype** | Clone existing objects |

### Structural — how classes/objects are composed

| Pattern | Use case |
|---|---|
| **Adapter** | Make incompatible interfaces work together |
| **Decorator** | Add behavior at runtime (middleware in Express!) |
| **Facade** | Simplified interface to complex subsystem |
| **Proxy** | Lazy loading, access control, caching |
| **Composite** | Tree structures (file system, DOM) |

### Behavioral — how objects communicate

| Pattern | Use case |
|---|---|
| **Observer** | Event emitters — you already use this in Node.js |
| **Strategy** | Swap algorithms at runtime (payment methods) |
| **Command** | Undo/redo, queuing operations |
| **Chain of Responsibility** | Middleware chains (Express middleware!) |
| **Iterator** | Traverse collections |
| **Template Method** | Define skeleton, let subclasses fill in steps |

### FAANG Priority Patterns:
Singleton, Factory, Builder, Observer, Strategy, Decorator, Proxy — these appear most in LLD interviews.

---

## Phase 4: LLD Practice — The FAANG Interview Format (6–8 weeks)

This is where you apply everything. An LLD interview is:
> "Design X in 45 minutes using classes."

### Common LLD problems:
- Design a Parking Lot
- Design LRU Cache
- Design a Hotel Booking System
- Design an ATM
- Design Chess / Snake & Ladders
- Design Amazon Locker
- Design a Ride-sharing app (Uber)
- Design BookMyShow (ticket booking)
- Design a Logger Framework

### How to approach any LLD problem:
1. Identify entities (nouns) → classes
2. Identify behaviors (verbs) → methods
3. Identify relationships (has-a, is-a)
4. Apply SOLID as you go
5. Apply relevant design patterns

### Repository to use:
`awesome-low-level-design-main` — attempt problems yourself first, then review solutions.

---

## Phase 5: HLD / System Design (run parallel with Phase 4)

### Core concepts to master:

```
Horizontal vs Vertical Scaling
Load Balancers
Caching (Redis, CDN, write-through vs write-back)
Databases (SQL vs NoSQL, sharding, replication)
Message Queues (Kafka, RabbitMQ)
CAP Theorem
Consistent Hashing
Rate Limiting
API Design (REST, GraphQL)
Microservices vs Monolith
```

### Common HLD problems (FAANG):
- Design Twitter/Instagram feed
- Design URL shortener (bit.ly)
- Design WhatsApp
- Design YouTube
- Design Uber
- Design Rate Limiter
- Design Notification System
- Design Search Autocomplete

### Resources:
- **"System Design Interview"** by Alex Xu (Vol 1 + 2) — the bible
- **ByteByteGo** newsletter/YouTube (same author, free content)
- **Grokking the System Design Interview** (Educative.io)

---

## Timeline (6 months to FAANG-ready)

| Month | Focus |
|---|---|
| 1 | OOP in TypeScript + SOLID principles |
| 2 | Design Patterns (creational + structural) |
| 3 | Design Patterns (behavioral) + first LLD problems |
| 4 | LLD practice (2–3 problems/week) |
| 5 | HLD fundamentals + practice |
| 6 | Mixed practice + mock interviews |

---

## Your Biggest Leverage Points as a MERN Developer

Since you already know MERN, you have more foundation than you think:

1. **Express middleware = Chain of Responsibility** — you've been using design patterns without knowing it
2. **React hooks like `useContext` = Observer pattern**
3. **MongoDB vs PostgreSQL trade-offs** — you already have intuition for DB design, build on it for HLD
4. **Use TypeScript, not Java** — FAANG accepts any language; TS gives you interfaces and strict typing without leaving your comfort zone
5. **Node.js EventEmitter = Observer pattern** — `emit` / `on` is textbook Observer

---

## Daily Practice Structure

| Block | Activity |
|---|---|
| 30 min | Read one concept (SOLID / pattern / HLD topic) |
| 45 min | Code one implementation |
| 30 min | Review one solved LLD problem |

Consistency over intensity. 6 months of this gets you interview-ready.

---

## Quick Reference: MERN Patterns You Already Know

| MERN concept | Design Pattern equivalent |
|---|---|
| Express middleware chain | Chain of Responsibility |
| `EventEmitter` (`on`, `emit`) | Observer |
| React Context + Provider | Facade + Observer |
| Mongoose Model | Active Record / Repository |
| `process.env` config | Singleton |
| React HOCs | Decorator |
