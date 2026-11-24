import { ValueObject } from '../../shared/domain/value-object.js';
import { InvalidNameError } from './invalid-name.error.js';

class Name extends ValueObject<{ value: string }> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;
  static create(name: string) {
    const normalized = name.trim().replace(/\s{2,}/g, ' ');
    if (normalized.length < this.MIN_LENGTH || normalized.length > this.MAX_LENGTH) {
      throw new InvalidNameError(this.MIN_LENGTH, this.MAX_LENGTH);
    }
    return new Name({ value: normalized });
  }

  toString(): string {
    return this.props.value;
  }
}

describe('Name', () => {
  test('should trim the value and collapse repeated spaces', () => {
    const name = Name.create('  Ana    Maria  Silva ');
    expect(name.toString()).toBe('Ana Maria Silva');
  });
  test('should keep the original letter case', () => {
    const name = Name.create('Ana de Souza');
    expect(name.toString()).toBe('Ana de Souza');
  });
  test('should accept names from 2 to 100 characters', () => {
    expect(Name.create('Li').toString()).toBe('Li');
    expect(Name.create('a'.repeat(100)).toString()).toHaveLength(100);
  });
  test.each(['', '   ', 'A', 'a'.repeat(101)])('should reject a name with invalid length (%#)', (value) => {
    expect(() => Name.create(value)).toThrow(InvalidNameError);
  });
  test('should report the INVALID_NAME code', () => {
    expect(() => Name.create('A')).toThrow(
      expect.objectContaining({
        code: 'INVALID_NAME',
        message: 'Nome inválido: deve ter entre 2 e 100 caracteres.',
      }),
    );
  });
});
