import * as bcrypt from 'bcrypt';
export default class PasswordHandler {
  public static async hashPassword(plaintextPassword: string) {
    return await bcrypt.hashSync(plaintextPassword, 10);
  }

  public static async comparePassword(plaintextPassword: string, hash: string) {
    return await bcrypt.compare(plaintextPassword, hash);
  }
}
