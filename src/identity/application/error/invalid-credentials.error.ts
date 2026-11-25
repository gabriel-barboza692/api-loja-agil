import { DomainError } from '../../../shared/domain/domain-error.js';

export class InvalidCredentialsError extends DomainError {
  code: string = 'INVALID_CREDENTIALS';
  constructor() {
    super('E-mail ou senha inválidos.');
  }
}
