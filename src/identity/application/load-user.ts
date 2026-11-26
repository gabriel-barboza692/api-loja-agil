import { UniqueId } from '../../shared/domain/unique-id.value-object.js';
import type { User } from '../domain/entity/user.entity.js';
import { UserNotFoundError } from './error/user-not-found.error.js';
import type { UserRepository } from './port/user.repository.js';

export async function loadUser(users: UserRepository, userId: string): Promise<User> {
  const user = await users.findById(UniqueId.from(userId));
  if (!user) {
    throw new UserNotFoundError();
  }
  return user;
}
