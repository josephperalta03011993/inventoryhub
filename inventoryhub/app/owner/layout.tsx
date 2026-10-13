import type { ReactNode } from "react";
import AdminSidebar from "../(admin)/AdminSidebar";
import { requireRole } from "@/app/lib/session";

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  await requireRole("Owner");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <AdminSidebar variant="owner" />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
