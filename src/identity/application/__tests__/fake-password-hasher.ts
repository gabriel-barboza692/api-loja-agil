import { PasswordHash } from '../../domain/value-object/password-hash.value-object.js';
import type { Password } from '../../domain/value-object/password.value-object.js';
import type { PasswordHasher } from '../port/password-hasher.js';

export class FakePasswordHasher implements PasswordHasher {
  async hash(password: Password): Promise<PasswordHash> {
    return PasswordHash.fromHash(`hashed:${password.reveal()}`);
  }

  async verify(password: Password, hash: PasswordHash): Promise<boolean> {
    return hash.toString() === `hashed:${password.reveal()}`;
  }
}
