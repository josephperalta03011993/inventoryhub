// auth.config.ts (Project Root Folder)
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Redirect target for unauthenticated requests
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      //  protected route boundaries
      const isOwnerReport = nextUrl.pathname.startsWith('/reports');
      const isAdminProducts = nextUrl.pathname.startsWith('/products');

      // If they are attempting to reach a secured dashboard segment:
      if (isOwnerReport || isAdminProducts) {
        if (isLoggedIn) return true; // Allow access if a valid session exists
        return false; // Otherwise, halt execution and redirect to /login
      }
      
      return true; // Allow public routes (like login/signup views) to load freely
    },
  },
  providers: [], // Kept empty here; populated inside server-side auth.ts
} satisfies NextAuthConfig;
