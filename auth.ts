// auth.ts (Project Root Folder)
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { sql } from '@/app/lib/db';
import { hashPassword } from '@/app/lib/auth-utils';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(4) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        //  Look up the user inside your PostgreSQL tables
        const users = await sql`
          SELECT id, name, email, password, role FROM users 
          WHERE email = ${email.toLowerCase()} LIMIT 1
        `;

        if (users.length === 0) return null;
        const userRecord = users[0];

        // Cryptographically verify the incoming input text password hash
        const incomingHashedPassword = await hashPassword(password);
        if (incomingHashedPassword !== userRecord.password) return null;

        // Return the complete user model including their system role tier!
        return {
          id: String(userRecord.id),
          name: userRecord.name,
          email: userRecord.email,
          role: userRecord.role, // Employee, Admin, or Owner
        };
      },
    }),
  ],
  callbacks: {
    //Inject the user's database role directly into the JWT token
    async jwt({ token, user}) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    //  Pass the token's role data field straight into the front-facing layout session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as 'Employee' | 'Admin' | 'Owner';
      }
      return session;
    },
  },
});
