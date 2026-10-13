import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "@/app/lib/db";
import type { UserRole } from "@/app/lib/roles";

export type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
};

const UserRoleSchema = z.enum(["Employee", "Admin", "Owner"]);

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const userId = session?.user?.id;
  const sessionRole = UserRoleSchema.safeParse(session?.user?.role);
  if (!userId || !sessionRole.success) {
    return null;
  }

  const rows = await sql`
    SELECT id, email, role
    FROM public.users
    WHERE id = ${userId}
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
