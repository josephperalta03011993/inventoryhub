import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  matcher: ["/products/:path*", "/owner/:path*", "/users/:path*", "/reports/:path*"],
};
