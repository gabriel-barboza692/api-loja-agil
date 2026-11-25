import type { UseCase } from '../../../shared/application/use-case.js';
import { Email } from '../../domain/value-object/email.value-object.js';
import { Password } from '../../domain/value-object/password.value-object.js';
import { InvalidCredentialsError } from '../error/invalid-credentials.error.js';
import type { PasswordHasher } from '../port/password-hasher.js';
import type { UserRepository } from '../port/user.repository.js';
import type { UserOutput } from '../user-output.js';
import { toUserOutput } from '../user-output.js';

export type SignInInput = {
  email: string;
  password: string;
};

type Credentials = {
  email: Email;
  password: Password;
};

export class SignInUseCase implements UseCase<SignInInput, UserOutput> {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: SignInInput): Promise<UserOutput> {
    const credentials = this.parseCredentials(input);
    if (!credentials) {
      throw new InvalidCredentialsError();
    }
    const user = await this.users.findByEmail(credentials.email);
    const authenticated = await user?.authenticate(credentials.password, this.passwordHasher);
    if (!user || !authenticated) {
      throw new InvalidCredentialsError();
    }
    return toUserOutput(user);
  }

  private parseCredentials(input: SignInInput): Credentials | null {
    try {
      return {
        email: Email.create(input.email),
        password: Password.create(input.password),
      };
    } catch {
      return null;
    }
  }
}
