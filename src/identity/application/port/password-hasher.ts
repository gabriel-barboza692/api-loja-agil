import { type PasswordVerifier } from '../../domain/port/password-verifier.js';
import { type PasswordHash } from '../../domain/value-object/password-hash.value-object.js';
import { type Password } from '../../domain/value-object/password.value-object.js';

export interface PasswordHasher extends PasswordVerifier {
  hash(password: Password): Promise<PasswordHash>;
}
