import { DomainEvent } from '../../../shared/domain/domain-event.js';

export class UserRegistered extends DomainEvent {
  readonly eventName: string = 'UserRegistered';
  constructor(
    aggregateId: string,
    readonly email: string,
  ) {
    super(aggregateId);
  }
}
