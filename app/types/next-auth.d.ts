// app/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Augment the core Auth.js interfaces to officially recognize your custom role parameters
declare module "next-auth" {
  interface Session {
    user: {
      role: 'Employee' | 'Admin' | 'Owner';
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
