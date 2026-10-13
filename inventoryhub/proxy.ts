import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
const middleware: NextMiddleware = (_request, _event) => NextResponse.next();
const authProxy = auth(middleware);

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authProxy(request, event);
}

export const config = {
  matcher: ["/products/:path*", "/owner/:path*", "/users/:path*", "/reports/:path*"],
};
