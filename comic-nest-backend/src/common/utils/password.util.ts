// src/common/utils/password.util.ts
import * as bcrypt from 'bcrypt';
import { appConstants } from '../constants';

export class PasswordUtil {
  static async hashPassword(
    password: string,
    saltRounds: number | undefined,
  ): Promise<string> {
    return await bcrypt.hash(
      password,
      saltRounds || appConstants.BCRYPT_SALT_ROUNDS_DEFAULT,
    );
  }

  static async comparePasswords(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }
}
