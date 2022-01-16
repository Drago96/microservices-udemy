import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buffer = await Password.generateBuffer(password, salt);

    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = await Password.generateBuffer(suppliedPassword, salt);

    return buffer.toString("hex") === hashedPassword;
  }

  private static async generateBuffer(password: string, salt: string) {
    return (await scryptAsync(password, salt, 64)) as Buffer;
  }
}
