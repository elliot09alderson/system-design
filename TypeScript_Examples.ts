// =============================================================================
// TYPESCRIPT EXAMPLES: OOP + SOLID + DESIGN PATTERNS
// For MERN developers targeting FAANG
// =============================================================================

// =============================================================================
// PART 1: OOP FUNDAMENTALS
// =============================================================================

// -----------------------------------------------------------------------------
// 1. ENCAPSULATION
// Bundle data + behavior together. Hide internals using private.
// -----------------------------------------------------------------------------

class BankAccount {
  private balance: number;       // hidden from outside
  private owner: string;

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  getBalance(): number {          // controlled access — not direct property access
    return this.balance;
  }
}

const account = new BankAccount("Pratik", 1000);
account.deposit(500);
account.withdraw(200);
console.log(account.getBalance()); // 1300
// account.balance = 99999;        // ERROR — private, not accessible


// -----------------------------------------------------------------------------
// 2. ABSTRACTION
// Expose only what the caller needs. Hide complexity behind an interface.
// -----------------------------------------------------------------------------

interface PaymentProcessor {
  pay(amount: number): boolean;
}

// Caller doesn't know HOW payment works — just calls .pay()
class StripeProcessor implements PaymentProcessor {
  pay(amount: number): boolean {
    console.log(`Charging $${amount} via Stripe API...`);
    // complex Stripe SDK logic hidden here
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  pay(amount: number): boolean {
    console.log(`Charging $${amount} via PayPal API...`);
    // complex PayPal SDK logic hidden here
    return true;
  }
}

function checkout(processor: PaymentProcessor, amount: number): void {
  const success = processor.pay(amount);
  if (success) console.log("Order confirmed!");
}

checkout(new StripeProcessor(), 299);
checkout(new PayPalProcessor(), 199);


// -----------------------------------------------------------------------------
// 3. INHERITANCE
// Parent class defines shared behavior. Child class extends and specializes.
// -----------------------------------------------------------------------------

abstract class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }

  abstract makeSound(): void;     // must be implemented by child
}

class Dog extends Animal {
  makeSound(): void {
    console.log(`${this.name} says: Woof!`);
  }

  fetch(): void {
    console.log(`${this.name} fetches the ball`);
  }
}

class Cat extends Animal {
  makeSound(): void {
    console.log(`${this.name} says: Meow!`);
  }
}

const dog = new Dog("Bruno");
dog.makeSound();  // Bruno says: Woof!
dog.move(10);     // Bruno moved 10m
dog.fetch();      // Bruno fetches the ball

const cat = new Cat("Whiskers");
cat.makeSound();  // Whiskers says: Meow!


// -----------------------------------------------------------------------------
// 4. POLYMORPHISM
// Same method name, different behavior depending on the object type.
// -----------------------------------------------------------------------------

class Shape {
  area(): number {
    return 0;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  area(): number {
    return 0.5 * this.base * this.height;
  }
}

// Polymorphism in action — same loop, different behavior
const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 8)];
shapes.forEach(shape => console.log(`Area: ${shape.area().toFixed(2)}`));
// Area: 78.54
// Area: 24.00
// Area: 12.00


// =============================================================================
// PART 2: SOLID PRINCIPLES
// =============================================================================

// -----------------------------------------------------------------------------
// S — Single Responsibility Principle
// A class should have only ONE reason to change.
// -----------------------------------------------------------------------------

// VIOLATION: UserService does too many things
class UserServiceBad {
  createUser(name: string, email: string): void {
    // save to DB
    console.log(`Saving ${name} to database`);
    // send email (different responsibility!)
    console.log(`Sending welcome email to ${email}`);
    // log action (another responsibility!)
    console.log(`[LOG] User ${name} created`);
  }
}

// FIX: Each class has one job
class UserRepository {
  save(name: string, email: string): void {
    console.log(`Saving ${name} to database`);
  }
}

class EmailService {
  sendWelcome(email: string): void {
    console.log(`Sending welcome email to ${email}`);
  }
}

class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class UserService {
  constructor(
    private repo: UserRepository,
    private email: EmailService,
    private logger: Logger
  ) {}

  createUser(name: string, emailAddress: string): void {
    this.repo.save(name, emailAddress);
    this.email.sendWelcome(emailAddress);
    this.logger.log(`User ${name} created`);
  }
}


// -----------------------------------------------------------------------------
// O — Open/Closed Principle
// Open for extension, closed for modification.
// Add new behavior without changing existing code.
// -----------------------------------------------------------------------------

// VIOLATION: Every new discount type requires modifying this function
function calculateDiscountBad(type: string, price: number): number {
  if (type === "student") return price * 0.8;
  if (type === "senior") return price * 0.7;
  // adding "employee" means editing this function — BAD
  return price;
}

// FIX: New discount types just add a new class
interface DiscountStrategy {
  apply(price: number): number;
}

class StudentDiscount implements DiscountStrategy {
  apply(price: number): number { return price * 0.8; }
}

class SeniorDiscount implements DiscountStrategy {
  apply(price: number): number { return price * 0.7; }
}

class EmployeeDiscount implements DiscountStrategy {
  apply(price: number): number { return price * 0.5; }
}

class PriceCalculator {
  calculate(price: number, discount: DiscountStrategy): number {
    return discount.apply(price);
  }
}

const calculator = new PriceCalculator();
console.log(calculator.calculate(100, new StudentDiscount()));  // 80
console.log(calculator.calculate(100, new EmployeeDiscount())); // 50


// -----------------------------------------------------------------------------
// L — Liskov Substitution Principle
// Subclasses must be substitutable for their parent class.
// If you use a parent type, swapping in a child must not break things.
// -----------------------------------------------------------------------------

// VIOLATION: Square breaks Rectangle's contract
class RectangleBad {
  constructor(protected width: number, protected height: number) {}

  setWidth(w: number): void { this.width = w; }
  setHeight(h: number): void { this.height = h; }
  area(): number { return this.width * this.height; }
}

class SquareBad extends RectangleBad {
  setWidth(w: number): void {
    this.width = w;
    this.height = w; // Square forces equal sides — breaks Rectangle contract!
  }
  setHeight(h: number): void {
    this.width = h;
    this.height = h;
  }
}

// FIX: Don't force inheritance where it doesn't fit. Use a common interface.
interface ResizableShape {
  area(): number;
}

class RectangleGood implements ResizableShape {
  constructor(private width: number, private height: number) {}
  area(): number { return this.width * this.height; }
}

class SquareGood implements ResizableShape {
  constructor(private side: number) {}
  area(): number { return this.side ** 2; }
}


// -----------------------------------------------------------------------------
// I — Interface Segregation Principle
// Don't force classes to implement methods they don't need.
// Many small interfaces > one fat interface.
// -----------------------------------------------------------------------------

// VIOLATION: All printers must implement all methods even if irrelevant
interface AllInOnePrinterBad {
  print(): void;
  scan(): void;
  fax(): void;
  staple(): void;
}

// A basic printer doesn't fax or staple — forced to implement them anyway!
class BasicPrinterBad implements AllInOnePrinterBad {
  print(): void { console.log("Printing..."); }
  scan(): void { throw new Error("Not supported"); }      // ugly
  fax(): void { throw new Error("Not supported"); }       // ugly
  staple(): void { throw new Error("Not supported"); }    // ugly
}

// FIX: Split into focused interfaces
interface Printable { print(): void; }
interface Scannable { scan(): void; }
interface Faxable { fax(): void; }

class BasicPrinter implements Printable {
  print(): void { console.log("Printing..."); }
}

class OfficePrinter implements Printable, Scannable, Faxable {
  print(): void { console.log("Printing..."); }
  scan(): void { console.log("Scanning..."); }
  fax(): void { console.log("Faxing..."); }
}


// -----------------------------------------------------------------------------
// D — Dependency Inversion Principle
// High-level modules should not depend on low-level modules.
// Both should depend on abstractions (interfaces).
// -----------------------------------------------------------------------------

// VIOLATION: OrderService is tightly coupled to MySQLDatabase
class MySQLDatabaseBad {
  save(data: string): void { console.log(`MySQL: saving ${data}`); }
}

class OrderServiceBad {
  private db = new MySQLDatabaseBad(); // hardcoded — can't swap DB without editing this class

  createOrder(item: string): void {
    this.db.save(item);
  }
}

// FIX: Depend on an abstraction
interface Database {
  save(data: string): void;
}

class MySQLDatabase implements Database {
  save(data: string): void { console.log(`MySQL: saving ${data}`); }
}

class MongoDatabase implements Database {
  save(data: string): void { console.log(`MongoDB: saving ${data}`); }
}

class OrderService {
  constructor(private db: Database) {} // injected — can swap DB freely

  createOrder(item: string): void {
    this.db.save(item);
  }
}

const mysqlOrder = new OrderService(new MySQLDatabase());
mysqlOrder.createOrder("Laptop");   // MySQL: saving Laptop

const mongoOrder = new OrderService(new MongoDatabase());
mongoOrder.createOrder("Phone");    // MongoDB: saving Phone


// =============================================================================
// PART 3: DESIGN PATTERNS
// =============================================================================

// =============================================================================
// CREATIONAL PATTERNS
// =============================================================================

// -----------------------------------------------------------------------------
// Singleton — only one instance exists across the app
// Use case: DB connection, Logger, Config
// -----------------------------------------------------------------------------

class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private connectionString: string;

  private constructor() {
    this.connectionString = "mongodb://localhost:27017/mydb";
    console.log("DB connection created");  // only prints once
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  query(sql: string): void {
    console.log(`Running: ${sql} on ${this.connectionString}`);
  }
}

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true — same instance


// -----------------------------------------------------------------------------
// Factory Method — create objects without specifying exact class
// Use case: Different notification types, different parsers
// -----------------------------------------------------------------------------

interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string): void { console.log(`Email: ${message}`); }
}

class SMSNotification implements Notification {
  send(message: string): void { console.log(`SMS: ${message}`); }
}

class PushNotification implements Notification {
  send(message: string): void { console.log(`Push: ${message}`); }
}

class NotificationFactory {
  static create(type: "email" | "sms" | "push"): Notification {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms":   return new SMSNotification();
      case "push":  return new PushNotification();
    }
  }
}

const notif = NotificationFactory.create("email");
notif.send("Your order shipped!");  // Email: Your order shipped!


// -----------------------------------------------------------------------------
// Builder — construct complex objects step by step
// Use case: Query builder, HTTP request builder, Config builder
// -----------------------------------------------------------------------------

class QueryBuilder {
  private table: string = "";
  private conditions: string[] = [];
  private columns: string[] = ["*"];
  private limitValue: number | null = null;

  from(table: string): QueryBuilder {
    this.table = table;
    return this;  // return this enables method chaining
  }

  select(...columns: string[]): QueryBuilder {
    this.columns = columns;
    return this;
  }

  where(condition: string): QueryBuilder {
    this.conditions.push(condition);
    return this;
  }

  limit(n: number): QueryBuilder {
    this.limitValue = n;
    return this;
  }

  build(): string {
    let query = `SELECT ${this.columns.join(", ")} FROM ${this.table}`;
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(" AND ")}`;
    }
    if (this.limitValue !== null) {
      query += ` LIMIT ${this.limitValue}`;
    }
    return query;
  }
}

const query = new QueryBuilder()
  .from("users")
  .select("id", "name", "email")
  .where("age > 18")
  .where("active = true")
  .limit(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND active = true LIMIT 10


// -----------------------------------------------------------------------------
// Prototype — clone existing objects
// Use case: Duplicating config objects, template objects
// -----------------------------------------------------------------------------

interface Cloneable<T> {
  clone(): T;
}

class UserConfig implements Cloneable<UserConfig> {
  constructor(
    public theme: string,
    public language: string,
    public notifications: boolean
  ) {}

  clone(): UserConfig {
    return new UserConfig(this.theme, this.language, this.notifications);
  }
}

const defaultConfig = new UserConfig("dark", "en", true);
const userConfig = defaultConfig.clone();
userConfig.theme = "light";  // modify clone without affecting original

console.log(defaultConfig.theme); // dark
console.log(userConfig.theme);    // light


// =============================================================================
// STRUCTURAL PATTERNS
// =============================================================================

// -----------------------------------------------------------------------------
// Adapter — make incompatible interfaces work together
// Use case: Integrating a 3rd party library with a different interface
// -----------------------------------------------------------------------------

// Your app expects this interface
interface ModernLogger {
  log(level: string, message: string): void;
}

// But this is what the old library provides
class LegacyLogger {
  writeLog(message: string): void {
    console.log(`[LEGACY] ${message}`);
  }
}

// Adapter bridges the gap
class LoggerAdapter implements ModernLogger {
  constructor(private legacy: LegacyLogger) {}

  log(level: string, message: string): void {
    this.legacy.writeLog(`[${level.toUpperCase()}] ${message}`);
  }
}

const legacyLogger = new LegacyLogger();
const logger: ModernLogger = new LoggerAdapter(legacyLogger);
logger.log("error", "Something broke");  // [LEGACY] [ERROR] Something broke


// -----------------------------------------------------------------------------
// Decorator — add behavior at runtime without modifying the original class
// Use case: Express middleware, logging, caching, auth wrapping
// This is EXACTLY what Express middleware does!
// -----------------------------------------------------------------------------

interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number { return 1; }
  description(): string { return "Simple coffee"; }
}

// Each decorator wraps a Coffee and adds to it
class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  cost(): number { return this.coffee.cost() + 0.5; }
  description(): string { return this.coffee.description() + ", milk"; }
}

class SugarDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  cost(): number { return this.coffee.cost() + 0.25; }
  description(): string { return this.coffee.description() + ", sugar"; }
}

class VanillaDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  cost(): number { return this.coffee.cost() + 0.75; }
  description(): string { return this.coffee.description() + ", vanilla"; }
}

let myCoffee: Coffee = new SimpleCoffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
myCoffee = new VanillaDecorator(myCoffee);

console.log(myCoffee.description()); // Simple coffee, milk, sugar, vanilla
console.log(myCoffee.cost());        // 2.5


// -----------------------------------------------------------------------------
// Facade — simplified interface to a complex subsystem
// Use case: Wrapping complex third-party SDKs, simplifying module APIs
// -----------------------------------------------------------------------------

// Complex subsystems
class VideoEncoder {
  encode(filename: string): void { console.log(`Encoding ${filename}`); }
}

class AudioMixer {
  mix(filename: string): void { console.log(`Mixing audio for ${filename}`); }
}

class ThumbnailGenerator {
  generate(filename: string): void { console.log(`Generating thumbnail for ${filename}`); }
}

class FileUploader {
  upload(filename: string): void { console.log(`Uploading ${filename} to CDN`); }
}

// Facade — caller just calls one method
class VideoProcessingFacade {
  private encoder = new VideoEncoder();
  private mixer = new AudioMixer();
  private thumbnailer = new ThumbnailGenerator();
  private uploader = new FileUploader();

  process(filename: string): void {
    this.encoder.encode(filename);
    this.mixer.mix(filename);
    this.thumbnailer.generate(filename);
    this.uploader.upload(filename);
    console.log("Video ready!");
  }
}

const processor = new VideoProcessingFacade();
processor.process("intro.mp4");  // all steps happen, caller doesn't care how


// -----------------------------------------------------------------------------
// Proxy — control access to an object (lazy loading, caching, auth)
// Use case: API caching, access control, lazy initialization
// -----------------------------------------------------------------------------

interface UserFetcher {
  getUser(id: number): string;
}

class RealUserFetcher implements UserFetcher {
  getUser(id: number): string {
    console.log(`Fetching user ${id} from database...`);
    return `User_${id}`;
  }
}

// Caching Proxy
class CachedUserFetcher implements UserFetcher {
  private cache: Map<number, string> = new Map();
  private real = new RealUserFetcher();

  getUser(id: number): string {
    if (this.cache.has(id)) {
      console.log(`Cache hit for user ${id}`);
      return this.cache.get(id)!;
    }
    const user = this.real.getUser(id);
    this.cache.set(id, user);
    return user;
  }
}

const fetcher = new CachedUserFetcher();
fetcher.getUser(1);  // Fetching user 1 from database...
fetcher.getUser(1);  // Cache hit for user 1
fetcher.getUser(2);  // Fetching user 2 from database...


// =============================================================================
// BEHAVIORAL PATTERNS
// =============================================================================

// -----------------------------------------------------------------------------
// Observer — notify many objects when one object changes state
// Use case: Event systems, React state, Node EventEmitter, real-time updates
// This is what Node.js EventEmitter does under the hood!
// -----------------------------------------------------------------------------

interface Observer {
  update(event: string, data: unknown): void;
}

class EventEmitter {
  private listeners: Map<string, Observer[]> = new Map();

  on(event: string, observer: Observer): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(observer);
  }

  emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach(obs => obs.update(event, data));
  }
}

class EmailAlertObserver implements Observer {
  update(event: string, data: unknown): void {
    console.log(`Email alert: ${event} — ${JSON.stringify(data)}`);
  }
}

class SlackAlertObserver implements Observer {
  update(event: string, data: unknown): void {
    console.log(`Slack alert: ${event} — ${JSON.stringify(data)}`);
  }
}

const emitter = new EventEmitter();
emitter.on("order.placed", new EmailAlertObserver());
emitter.on("order.placed", new SlackAlertObserver());

emitter.emit("order.placed", { orderId: 42, item: "MacBook" });
// Email alert: order.placed — {"orderId":42,"item":"MacBook"}
// Slack alert: order.placed — {"orderId":42,"item":"MacBook"}


// -----------------------------------------------------------------------------
// Strategy — swap algorithms at runtime
// Use case: Sorting strategies, payment methods, compression algorithms
// This is the same as the Open/Closed example but named correctly
// -----------------------------------------------------------------------------

interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log("Using bubble sort");
    return [...data].sort((a, b) => a - b); // simplified
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log("Using quicksort");
    return [...data].sort((a, b) => a - b); // simplified
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

const sorter = new Sorter(new BubbleSort());
sorter.sort([3, 1, 4, 1, 5]);  // Using bubble sort

sorter.setStrategy(new QuickSort());
sorter.sort([3, 1, 4, 1, 5]);  // Using quicksort


// -----------------------------------------------------------------------------
// Chain of Responsibility — pass request through a chain of handlers
// Use case: Express middleware, validation pipelines, auth checks
// This is EXACTLY how app.use() works in Express!
// -----------------------------------------------------------------------------

interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

abstract class BaseHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;  // allows chaining: auth.setNext(logging).setNext(validation)
  }

  handle(request: string): string | null {
    if (this.nextHandler) return this.nextHandler.handle(request);
    return null;
  }
}

class AuthHandler extends BaseHandler {
  handle(request: string): string | null {
    if (request === "no-token") return "Auth failed: no token";
    console.log("Auth passed");
    return super.handle(request);
  }
}

class LoggingHandler extends BaseHandler {
  handle(request: string): string | null {
    console.log(`[LOG] Processing: ${request}`);
    return super.handle(request);
  }
}

class ValidationHandler extends BaseHandler {
  handle(request: string): string | null {
    if (request.length < 3) return "Validation failed: too short";
    console.log("Validation passed");
    return super.handle(request);
  }
}

class FinalHandler extends BaseHandler {
  handle(request: string): string | null {
    return `Request "${request}" processed successfully`;
  }
}

// Wire up the chain
const auth = new AuthHandler();
const logging = new LoggingHandler();
const validation = new ValidationHandler();
const final = new FinalHandler();

auth.setNext(logging).setNext(validation).setNext(final);

console.log(auth.handle("no-token"));   // Auth failed: no token
console.log(auth.handle("ok"));         // Auth passed -> LOG -> Validation failed
console.log(auth.handle("valid-request")); // Auth -> LOG -> Validation -> Success


// -----------------------------------------------------------------------------
// Command — encapsulate an action as an object (enables undo/redo)
// Use case: Text editor undo, transaction rollback, job queues
// -----------------------------------------------------------------------------

interface Command {
  execute(): void;
  undo(): void;
}

class TextEditor {
  private content: string = "";

  type(text: string): void { this.content += text; }
  delete(count: number): void { this.content = this.content.slice(0, -count); }
  getContent(): string { return this.content; }
}

class TypeCommand implements Command {
  constructor(private editor: TextEditor, private text: string) {}

  execute(): void { this.editor.type(this.text); }
  undo(): void { this.editor.delete(this.text.length); }
}

class CommandHistory {
  private history: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    command?.undo();
  }
}

const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new TypeCommand(editor, "Hello"));
history.execute(new TypeCommand(editor, " World"));
console.log(editor.getContent()); // Hello World

history.undo();
console.log(editor.getContent()); // Hello

history.undo();
console.log(editor.getContent()); // (empty)


// -----------------------------------------------------------------------------
// Template Method — define skeleton of algorithm, let subclasses fill in steps
// Use case: Data parsers, report generators, game loops
// -----------------------------------------------------------------------------

abstract class DataExporter {
  // Template method — defines the skeleton
  export(data: unknown[]): void {
    const formatted = this.format(data);  // step 1: subclass implements
    this.validate(formatted);              // step 2: shared logic
    this.write(formatted);                 // step 3: subclass implements
  }

  protected validate(data: string): void {
    if (!data) throw new Error("Empty data");
    console.log("Data validated");
  }

  protected abstract format(data: unknown[]): string;
  protected abstract write(data: string): void;
}

class CSVExporter extends DataExporter {
  protected format(data: unknown[]): string {
    return data.join(",");
  }

  protected write(data: string): void {
    console.log(`Writing CSV: ${data}`);
  }
}

class JSONExporter extends DataExporter {
  protected format(data: unknown[]): string {
    return JSON.stringify(data);
  }

  protected write(data: string): void {
    console.log(`Writing JSON: ${data}`);
  }
}

new CSVExporter().export(["Pratik", "30", "Mumbai"]);
// Data validated
// Writing CSV: Pratik,30,Mumbai

new JSONExporter().export(["Pratik", "30", "Mumbai"]);
// Data validated
// Writing JSON: ["Pratik","30","Mumbai"]


// =============================================================================
// SUMMARY: MERN → Design Patterns mapping
// =============================================================================
//
// Express app.use()              → Chain of Responsibility
// Node.js EventEmitter on/emit   → Observer
// React Context + Provider       → Facade + Observer
// mongoose.connect() (one conn)  → Singleton
// React Higher-Order Components  → Decorator
// process.env config object      → Singleton
// Axios interceptors             → Chain of Responsibility
// Redux reducers                 → Command (with undo via time-travel)
// React.memo / useMemo           → Proxy (caching)
// Multiple payment gateways      → Strategy
//
// You've been using design patterns the whole time!
// =============================================================================
