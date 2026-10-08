import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Low Stock Alerts",
  description: "Products currently below their restock threshold.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}