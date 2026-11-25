import { DomainError } from '../../../shared/domain/domain-error.js';

export class EmailALreadyInUseError extends DomainError {
  readonly code: string = 'EMAIL_ALREADY_IN_USE';
  constructor(email: string) {
    super(`O e-mail "${email}" já está em uso.`);
  }
}
