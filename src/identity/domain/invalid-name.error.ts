import { DomainError } from '../../shared/domain/domain-error.js';

export class InvalidNameError extends DomainError {
  code: string = 'INVALID_NAME';
  constructor(minLength: number, maxLength: number) {
    super(`Nome inválido: deve ter entre ${minLength} e ${maxLength} caracteres.`);
  }
}
