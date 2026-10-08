import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InventoryHub | Inventory Management",
    template: "%s | InventoryHub",
  },
  description:
    "A simple web-based inventory management system for small businesses.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "InventoryHub",
    description: "Track stock, transactions, and reports in one place.",
    siteName: "InventoryHub",
    type: "website",
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}