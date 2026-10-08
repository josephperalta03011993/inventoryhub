import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction History",
  description: "Inventory adjustments with a full audit trail.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}