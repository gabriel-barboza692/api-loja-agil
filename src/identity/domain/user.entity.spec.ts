import { Email } from './email.value-object.js';
import { InvalidEmailError } from './invalid-email.error.js';
import { Name } from './name.value-object.js';
import { PasswordHash } from './password-hash.value-object.js';
import type { PasswordVerifier } from './password-verifier.js';
import { Password } from './password.value-object.js';
import { Role } from './role.js';
import { UserRegistered } from './user-registered.event.js';
import type { UserSnapshot } from './user.entity.js';
import { User } from './user.entity.js';

function registerAna(): User {
  return User.register({
    name: Name.create('Ana Silva'),
    email: Email.create('ana@lojaagil.com'),
    passwordHash: PasswordHash.fromHash('hashed:agil2026'),
  });
}

const storedOperator: UserSnapshot = {
  id: '019a6b7e-8c4d-7f3a-9b2e-5d1c0a4e7f60',
  name: 'Bruno Costa',
  email: 'bruno@lojaagil.com',
  passwordHash: 'hashed:operador1',
  role: Role.OPERATOR,
};

class PrefixVerifierMock implements PasswordVerifier {
  async verify(password: Password, hash: PasswordHash): Promise<boolean> {
    return Promise.resolve(hash.toString() === `hashed:${password.reveal()}`);
  }
}

describe('User', () => {
  describe('register', () => {
    test('should create a customer with a new id and the given data', () => {
      const user = registerAna();
      expect(user.toSnapshot()).toEqual({
        id: user.id.toString(),
        name: 'Ana Silva',
        email: 'ana@lojaagil.com',
        passwordHash: 'hashed:agil2026',
        role: Role.CUSTOMER,
      });
    });

    test('should give each registered user a different id', () => {
      expect(registerAna().equals(registerAna())).toBe(false);
    });

    test('should record the UserRegistered event', () => {
      const user = registerAna();

      const events = user.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserRegistered);
      expect(events[0]).toMatchObject({
        aggregateId: user.id.toString(),
        email: 'ana@lojaagil.com',
      });
    });
  });

  describe('restore', () => {
    test('should rebuild a user from a snapshot without recording events', () => {
      const user = User.restore(storedOperator);

      expect(user.toSnapshot()).toEqual(storedOperator);
      expect(user.pullDomainEvents()).toEqual([]);
    });

    test('should reject a snapshot with invalid data', () => {
      const corrupted = { ...storedOperator, email: 'bruno' };
      expect(() => User.restore(corrupted)).toThrow(InvalidEmailError);
    });
  });

  describe('profile changes', () => {
    test('should rename the user', () => {
      const user = registerAna();
      user.rename(Name.create('Ana Souza'));
      expect(user.toSnapshot().name).toBe('Ana Souza');
    });
    test('should change the email', () => {
      const user = registerAna();
      user.changeEmail(Email.create('ana.souza@lojaagil.com'));
      expect(user.hasEmail(Email.create('ana.souza@lojaagil.com'))).toBe(true);
      expect(user.hasEmail(Email.create('ana@lojaagil.com'))).toBe(false);
    });
    test('should change the password hash', () => {
      const user = registerAna();
      user.changePassword(PasswordHash.fromHash('hashed:nova2026'));
      expect(user.toSnapshot().passwordHash).toBe('hashed:nova2026');
    });
  });

  describe('authenticate', () => {
    test('should accept the password that matches the stored hash', async () => {
      const user = registerAna();
      const authenticated = await user.authenticate(Password.create('agil2026'), new PrefixVerifierMock());
      expect(authenticated).toBe(true);
    });
    test('should refuse a different password', async () => {
      const user = registerAna();
      const authenticated = await user.authenticate(Password.create('errada123'), new PrefixVerifierMock());
      expect(authenticated).toBe(false);
    });
  });
});
