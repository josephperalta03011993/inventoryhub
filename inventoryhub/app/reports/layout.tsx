import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/app/(admin)/AdminSidebar";
import { getCurrentUser } from "@/app/lib/session";

export default async function ReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const variant =
    user.role === "Owner"
      ? "owner"
      : user.role === "Admin"
        ? "admin"
        : "employee";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <AdminSidebar variant={variant} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
