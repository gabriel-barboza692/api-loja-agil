import { WeakPasswordError } from '../errors/weak-password-error.js';
import { Password } from './password.value-object.js';

describe('Password', () => {
  test('should accept a password with at least 8 characters, letters and digits', () => {
    const password = Password.create('agil2026');
    expect(password.reveal()).toBe('agil2026');
  });
  test('should keep spaces and symbols exactly as typed', () => {
    const password = Password.create(' Loja Ágil #1 ');
    expect(password.reveal()).toBe(' Loja Ágil #1 ');
  });
  test.each([
    ['shorter than 8 characters', 'agil202'],
    ['without digits', 'lojaagil'],
    ['without letters', '20262026'],
    ['longer than 128 characters', `a1${'x'.repeat(127)}`],
  ])('should reject a password %s', (_, value) => {
    expect(() => Password.create(value)).toThrow(WeakPasswordError);
  });
  test('should hide the value when converted to text or JSON', () => {
    const password = Password.create('agil2026');
    expect(String(password)).toBe('********');
    expect(JSON.stringify({ password })).toBe('{"password":"********"}');
  });
});
