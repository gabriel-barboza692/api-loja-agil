import { aUser } from '../../domain/__tests__/user.builder.js';
import { WeakPasswordError } from '../../domain/errors/weak-password-error.js';
import { Email } from '../../domain/value-object/email.value-object.js';
import { FakePasswordHasher } from '../__tests__/fake-password-hasher.js';
import { InMemoryUserRepository } from '../__tests__/in-memory-user.repository.js';
import { EmailALreadyInUseError } from '../error/email-already-in-use.error.js';
import { SignUpUseCase } from './sign-up.use-case.js';

describe('SignUpUseCase', () => {
  let users: InMemoryUserRepository;
  let signUp: SignUpUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    signUp = new SignUpUseCase(users, new FakePasswordHasher());
  });

  test('should register a customer an return it without the password', async () => {
    const output = await signUp.execute({
      name: 'Ana Silva',
      email: 'Ana@LojaAgil.com',
      password: 'agil2026',
    });
    expect(output).toEqual({
      id: expect.any(String),
      name: 'Ana Silva',
      email: 'ana@lojaagil.com',
      role: 'CUSTOMER',
    });
  });

  test('should store only the hash of the password', async () => {
    await signUp.execute({
      name: 'Ana Silva',
      email: 'ana@lojaagil.com',
      password: 'agil2026',
    });
    const stored = await users.findByEmail(Email.create('ana@lojaagil.com'));
    expect(stored?.toSnapshot().passwordHash).toBe('hashed:agil2026');
  });

  test('should reject an email that is already in use, ignoring case', async () => {
    await users.save(aUser().withEmail('ana@lojaagil.com').build());
    await expect(
      signUp.execute({
        name: 'Outra Ana',
        email: 'ANA@lojaagil.com',
        password: 'agil2026',
      }),
    ).rejects.toThrow(EmailALreadyInUseError);
  });

  test('should not store anything when the input is invalid', async () => {
    await expect(
      signUp.execute({
        name: 'Ana Silva',
        email: 'ana@lojaagil.com',
        password: 'curta',
      }),
    ).rejects.toThrow(WeakPasswordError);
    expect(await users.findAll()).toEqual([]);
  });
});
