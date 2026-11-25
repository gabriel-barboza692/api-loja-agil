import type { User } from '../domain/entity/user.entity.js';
import type { Role } from '../domain/enum/role.js';

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function toUserOutput(user: User): UserOutput {
  const { email, id, name, role } = user.toSnapshot();
  return { email, id, name, role };
}
