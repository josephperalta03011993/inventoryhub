import { z } from 'zod';
import { SignJWT, jwtVerify } from 'jose';

export interface UserSessionPayload {
  id: string;
  email: string;
  role: 'Employee' | 'Admin' | 'Owner';
}

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid business email address.' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters long.' }),
});

export const SignUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please provide a valid company email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  role: z.enum(['Employee', 'Admin', 'Owner']),
});

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-change-this-in-production'
);

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signSessionToken(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] });
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}
