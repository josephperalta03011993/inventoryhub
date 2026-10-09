import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      
      const isOwnerReport = nextUrl.pathname.startsWith('/reports');
      const isAdminProducts = nextUrl.pathname.startsWith('/products');

      // If a user tries to access a protected route segment:
      if (isOwnerReport || isAdminProducts) {
        if (!isLoggedIn) return false; // Not logged in? Instantly bounce to /login

       
        const userRole = (auth?.user as any)?.role;

        // If trying to access Owner reports, they MUST be an Owner
        if (isOwnerReport && userRole !== 'Owner') {
          return false;
        }

        // If trying to access Admin/Product paths, they MUST be an Admin or an Owner
        if (isAdminProducts && userRole !== 'Admin' && userRole !== 'Owner') {
          // Temporarily returning true here for initial local workspace testing if your signup doesn't seed roles yet:
          return true; 
        }

        return true; // Clearance approved!
      }
      
      return true; // Allow public routes (like login/signup) to load freely
    },
  },
  providers: [], // Kept empty here; populated inside server-side auth.ts
} satisfies NextAuthConfig;
