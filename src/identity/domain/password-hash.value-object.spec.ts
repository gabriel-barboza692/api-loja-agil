import { InvalidPasswordHashError } from './invalid-password-hash.error.js';
import { PasswordHash } from './password-hash.value-object.js';

describe('PasswordHash', () => {
  test('should keep the hash produced by the infrastructure', () => {
    const hash = PasswordHash.fromHash('scrypt$c2FsdA==$aGFzaA==');
    expect(hash.toString()).toBe('scrypt$c2FsdA==$aGFzaA==');
  });
  test.each(['', '   '])('should reject an empty hash (%#)', (value) => {
    expect(() => PasswordHash.fromHash(value)).toThrow(InvalidPasswordHashError);
  });
  test('should report the INVALID_PASSWORD_HASH code', () => {
    expect(() => PasswordHash.fromHash('')).toThrow(expect.objectContaining({ code: 'INVALID_PASSWORD_HASH' }));
  });
});
