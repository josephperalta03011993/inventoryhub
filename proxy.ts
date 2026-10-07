// proxy.ts (Project Root Folder)
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// INITIALIZE NETWORK BOUNDARY: Binds your Auth.js session rules to the Next.js edge router
export default NextAuth(authConfig).auth;

export const config = {
  // Intercepts all paths EXCEPT backend APIs, internal files, and image assets
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
