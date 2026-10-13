import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { requireAnyRole } from "@/app/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAnyRole(["Admin", "Employee"]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <AdminSidebar variant={user.role === "Admin" ? "admin" : "employee"} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
