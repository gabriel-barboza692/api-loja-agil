import { ValueObject } from '../../../shared/domain/value-object.js';
import { WeakPasswordError } from '../errors/weak-password-error.js';

export class Password extends ValueObject<{ value: string }> {
  private static MIN_LENGTH = 8;
  private static MAX_LENGTH = 128;
  private static ONLY_NUMBER_REGEX = /^\d+$/g;
  private static ONLY_TEXT_REGEX = /^\p{L}+$/u;
  private static MASK = '********';
  static create(password: string) {
    if (password.length < this.MIN_LENGTH || password.length > this.MAX_LENGTH) {
      throw new WeakPasswordError(this.MIN_LENGTH, this.MAX_LENGTH);
    }
    if (this.ONLY_NUMBER_REGEX.test(password) || this.ONLY_TEXT_REGEX.test(password)) {
      throw new WeakPasswordError(this.MIN_LENGTH, this.MAX_LENGTH);
    }

    return new Password({ value: password });
  }
  reveal(): string {
    return this.props.value;
  }

  toString() {
    return Password.MASK;
  }

  toJSON() {
    return Password.MASK;
  }
}
