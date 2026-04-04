import bcrypt from "bcryptjs";
import { HttpError } from "@/lib/http-error";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    throw new HttpError(400, "Password is too long");
  }
  
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function validatePasswordStrength(password: string): void {
  if (!password || password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    throw new HttpError(400, "Password is too long");
  }

  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    throw new HttpError(400, "Password must contain at least one letter and one number");
  }
}