import { z } from 'zod';

export const UserRoleSchema = z.enum(['Employee', 'Admin', 'Owner']);

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

export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
