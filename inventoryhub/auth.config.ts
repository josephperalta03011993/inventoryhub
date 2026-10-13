import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { UserRoleSchema } from "@/app/lib/auth-utils";

const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      const role = UserRoleSchema.safeParse(token.role);
      if (session.user && token.sub && role.success) {
        session.user.id = token.sub;
        session.user.role = role.data;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const user = auth?.user;

      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const parsedRole = UserRoleSchema.safeParse(user.role);
      if (!parsedRole.success) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      const role = parsedRole.data;
      const redirectTo =
        role === "Owner" ? "/owner/dashboard" : "/products";

      if (pathname.startsWith("/owner") && role !== "Owner") {
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }

      if (pathname.startsWith("/users") && role !== "Admin") {
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }

      if (pathname.startsWith("/products")) {
        if (role === "Owner") {
          return NextResponse.redirect(new URL("/owner/dashboard", request.url));
        }
        if (
          role === "Employee" &&
          (/^\/products\/new\/?$/.test(pathname) ||
            /^\/products\/[^/]+\/edit\/?$/.test(pathname))
        ) {
          return NextResponse.redirect(new URL("/products", request.url));
        }
      }

      if (pathname.startsWith("/reports")) {
        const reportPath = pathname.replace(/\/+$/, "") || "/";
        if (
          (role === "Employee" &&
            reportPath !== "/reports/new" &&
            reportPath !== "/reports/mine") ||
          (role !== "Employee" && reportPath !== "/reports")
        ) {
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
