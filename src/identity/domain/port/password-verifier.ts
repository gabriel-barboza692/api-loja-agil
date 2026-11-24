import { type PasswordHash } from '../value-object/password-hash.value-object.js';
import { type Password } from '../value-object/password.value-object.js';

export interface PasswordVerifier {
  verify(password: Password, hash: PasswordHash): Promise<boolean>;
}
