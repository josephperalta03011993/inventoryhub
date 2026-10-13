import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRoleSchema, verifySessionToken } from "@/app/lib/auth-utils";

async function getRole(request: NextRequest) {
  const token = request.cookies.get("inventory_session")?.value;
  if (!token) {
    return null;
  }
  const session = await verifySessionToken(token);
  const role = UserRoleSchema.safeParse(session?.role);
  return role.success ? role.data : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await getRole(request);

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/owner") && role !== "Owner") {
    const destination = role === "Admin" ? "/products" : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (pathname.startsWith("/users") && role !== "Admin") {
    const destination = role === "Owner" ? "/owner/dashboard" : "/products";
    return NextResponse.redirect(new URL(destination, request.url));
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/owner/:path*", "/users/:path*"],
};
