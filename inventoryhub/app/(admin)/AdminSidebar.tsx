"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const navigation = [
  {
    heading: "WORKSPACE",
    items: [
      { label: "Products", href: "/products" },
      { label: "Add product", href: "/products/new" },
      { label: "Users", href: "/users" },
      { label: "Add user", href: "/users/new" },
      { label: "Stock reports", href: "/reports" },
    ],
  },
];

const employeeNavigation = [
  {
    heading: "WORKSPACE",
    items: [
      { label: "Products", href: "/products" },
      { label: "Report a stock count", href: "/reports/new" },
      { label: "My stock reports", href: "/reports/mine" },
    ],
  },
];

const ownerNavigation = [
  {
    heading: "WORKSPACE",
    items: [{ label: "Owner dashboard", href: "/owner/dashboard" }],
  },
  {
    heading: "REPORTS",
    items: [
      { label: "Stock reports", href: "/reports" },
      { label: "Stock status", href: "/owner/reports/stock-status" },
      { label: "Low stock", href: "/owner/reports/low-stock" },
      { label: "Employees", href: "/owner/reports/employees" },
      {
        label: "Transaction history",
        href: "/owner/reports/transaction-history",
      },
    ],
  },
];

export default function AdminSidebar({
  variant,
}: {
  variant: "admin" | "employee" | "owner";
}) {
  const pathname = usePathname();
  const sections =
    variant === "admin"
      ? navigation
      : variant === "employee"
        ? employeeNavigation
        : ownerNavigation;
  const homeHref = variant === "owner" ? "/owner/dashboard" : "/products";

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="border-b border-slate-200 px-6 py-5">
        <Link href={homeHref} className="text-lg font-bold text-slate-900">
          InventoryHub
        </Link>
        <p className="mt-1 text-xs text-slate-500">Inventory management</p>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-6 p-4">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="mb-2 px-3 text-xs font-semibold tracking-wide text-slate-400">
              {section.heading}
            </h2>
            <ul className="flex flex-wrap gap-1 md:flex-col">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/products" &&
                    pathname.startsWith("/products/") &&
                    pathname !== "/products/new") ||
                  (item.href === "/users" &&
                    pathname.startsWith("/users/") &&
                    pathname !== "/users/new") ||
                  (item.href === "/reports" &&
                    pathname.startsWith("/reports/") &&
                    pathname !== "/reports/new" &&
                    pathname !== "/reports/mine");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
