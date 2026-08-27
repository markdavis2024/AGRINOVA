import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'agrinova_super_secret_key_2026';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}

export function generateToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}