import { ValueObject } from '../../../shared/domain/value-object.js';
import { InvalidPasswordHashError } from '../errors/invalid-password-hash.error.js';

export class PasswordHash extends ValueObject<{ value: string }> {
  static fromHash(password: string): PasswordHash {
    if (password.trim().length === 0) {
      throw new InvalidPasswordHashError();
    }
    return new PasswordHash({ value: password });
  }

  toString(): string {
    return this.props.value;
  }
}
