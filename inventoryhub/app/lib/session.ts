import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifySessionToken } from "@/app/lib/auth-utils";
import { sql } from "@/app/lib/db";

export type UserRole = "Employee" | "Admin" | "Owner";

export type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
};

const UserRoleSchema = z.enum(["Employee", "Admin", "Owner"]);

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("inventory_session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return null;
  }

  const rows = await sql`
    SELECT id, email, role
    FROM public.users
    WHERE id = ${session.id}
    LIMIT 1
  `;
  const user = rows[0];
  const role = UserRoleSchema.safeParse(user?.role);

  if (!user || !role.success) {
    return null;
  }

  return {
    id: String(user.id),
    email: String(user.email),
    role: role.data,
  };
}

export function getRoleHome(role: UserRole): string {
  if (role === "Owner") return "/owner/dashboard";
  return "/products";
}

export async function requireAnyRole(roles: UserRole[]): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!roles.includes(user.role)) {
    redirect(getRoleHome(user.role));
  }

  return user;
}

export async function requireRole(role: UserRole): Promise<CurrentUser> {
  return requireAnyRole([role]);
}
