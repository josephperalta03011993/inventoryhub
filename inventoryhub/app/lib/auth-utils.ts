import { z } from 'zod';
import { SignJWT, jwtVerify } from 'jose';

export interface UserSessionPayload {
  id: string;
  email: string;
  role: 'Employee' | 'Admin' | 'Owner';
}

export const UserRoleSchema = z.enum(['Employee', 'Admin', 'Owner']);

const UserSessionPayloadSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: UserRoleSchema,
});

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

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }
  return new TextEncoder().encode(secret);
}

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
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), { algorithms: ['HS256'] });
    const result = UserSessionPayloadSchema.safeParse(payload);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
