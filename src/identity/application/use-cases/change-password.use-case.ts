import type { UseCase } from '../../../shared/application/use-case.js';
import type { User } from '../../domain/entity/user.entity.js';
import { Password } from '../../domain/value-object/password.value-object.js';
import { IncorrectCurrentPasswordError } from '../error/incorrect-current-password.error.js';
import { loadUser } from '../load-user.js';
import type { PasswordHasher } from '../port/password-hasher.js';
import type { UserRepository } from '../port/user.repository.js';

export type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export class ChangePasswordUseCase implements UseCase<ChangePasswordInput, void> {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await loadUser(this.users, input.userId);
    const newPassword = Password.create(input.newPassword);
    await this.ensureCurrentPassword(user, input.currentPassword);
    user.changePassword(await this.passwordHasher.hash(newPassword));
    await this.users.save(user);
  }

  private async ensureCurrentPassword(user: User, value: string): Promise<void> {
    const current = parsePassword(value);
    if (!current || !(await user.authenticate(current, this.passwordHasher))) {
      throw new IncorrectCurrentPasswordError();
    }
  }
}

function parsePassword(value: string): Password | null {
  try {
    return Password.create(value);
  } catch {
    return null;
  }
}
