import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@/app/lib/db";
import { hashPassword, LoginSchema, UserRoleSchema } from "@/app/lib/auth-utils";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const rows = await sql`
          SELECT id, name, email, password, role
          FROM public.users
          WHERE email = ${email.toLowerCase()}
          LIMIT 1
        `;

        const user = rows[0] as
          | {
              id: string;
              name: string;
              email: string;
              password: string;
              role: string;
            }
          | undefined;
        const role = UserRoleSchema.safeParse(user?.role);

        if (
          !user ||
          !role.success ||
          (await hashPassword(password)) !== user.password
        ) {
          return null;
        }

        return {
          id: String(user.id),
          name: String(user.name),
          email: String(user.email),
          role: role.data,
        };
      },
    }),
  ],
});
