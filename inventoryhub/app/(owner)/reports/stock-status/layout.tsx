import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Status",
  description: "Overall stock levels and total inventory value.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}