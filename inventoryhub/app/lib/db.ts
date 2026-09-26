// app/lib/db.ts
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('Critical Configuration Missing: DATABASE_URL env string was not located.');
}

export const sql = neon(process.env.DATABASE_URL);
