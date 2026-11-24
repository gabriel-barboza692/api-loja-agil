import { AggregateRoot } from './aggregate-root.js';
import { DomainEvent } from './domain-event.js';
import { UniqueId } from './unique-id.value-object.js';

class CounterIncremented extends DomainEvent {
  readonly eventName = 'CounterIncremented';

  constructor(
    aggregateId: string,
    readonly value: number,
  ) {
    super(aggregateId);
  }
}

class Counter extends AggregateRoot {
  private value = 0;
  static create(): Counter {
    return new Counter(UniqueId.create());
  }
  increment(): void {
    this.value += 1;
    this.record(new CounterIncremented(this.id.toString(), this.value));
  }
}

describe('AggregateRoot', () => {
  test('should start withou pending events', () => {
    const counter = Counter.create();
    expect(counter.pullDomainEvents()).toEqual([]);
  });
  test('should record events in the order they happen', () => {
    const counter = Counter.create();
    counter.increment();
    counter.increment();
    const events = counter.pullDomainEvents() as CounterIncremented[];
    expect(events.map((event) => event.value)).toEqual([1, 2]);
    expect(events.map((event) => event.aggregateId)).toEqual([counter.id.toString(), counter.id.toString()]);
  });
  test('should clear the events once they are pulled', () => {
    const counter = Counter.create();
    counter.increment();
    counter.pullDomainEvents();
    expect(counter.pullDomainEvents()).toEqual([]);
  });
  test('should keep identity-based equality from Entity', () => {
    const counter = Counter.create();
    expect(counter.equals(counter)).toBe(true);
    expect(counter.equals(Counter.create())).toBe(false);
  });
});
