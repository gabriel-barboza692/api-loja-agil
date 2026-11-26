import type { UseCase } from '../../../shared/application/use-case.js';
import { UniqueId } from '../../../shared/domain/unique-id.value-object.js';
import type { User } from '../../domain/entity/user.entity.js';
import { Email } from '../../domain/value-object/email.value-object.js';
import { Name } from '../../domain/value-object/name.value-object.js';
import { EmailALreadyInUseError } from '../error/email-already-in-use.error.js';
import { UserNotFoundError } from '../error/user-not-found.error.js';
import type { UserRepository } from '../port/user.repository.js';
import { toUserOutput, type UserOutput } from '../user-output.js';

export type UpdateProfileInput = {
  userId: string;
  name?: string;
  email?: string;
};

export class UpdateProfileUseCase implements UseCase<UpdateProfileInput, UserOutput> {
  constructor(private readonly users: UserRepository) {}

  async execute(input: UpdateProfileInput): Promise<UserOutput> {
    const user = await this.findUser(input.userId);
    if (input.name !== undefined) {
      user.rename(Name.create(input.name));
    }
    if (input.email !== undefined) {
      await this.changeEmail(user, Email.create(input.email));
    }
    await this.users.save(user);
    return toUserOutput(user);
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.users.findById(UniqueId.from(userId));
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  private async changeEmail(user: User, email: Email): Promise<void> {
    if (user.hasEmail(email)) {
      return;
    }
    if (await this.users.findByEmail(email)) {
      throw new EmailALreadyInUseError(email.toString());
    }
    user.changeEmail(email);
  }
}
