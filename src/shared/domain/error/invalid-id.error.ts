import { DomainError } from '../domain-error.js';

export class InvalidIdError extends DomainError {
  code: string = 'INVALID_ID';
  constructor(value: string) {
    super(`Identificador inválido: "${value}".`);
  }
}
