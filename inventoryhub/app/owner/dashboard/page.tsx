import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getProducts, getLowStockProducts, getTotalStockValue } from "@/lib/owner-data";
import { SummaryCard, ReportLink, Th, Td, PageHeader, formatCurrency } from "@/components/owner/OwnerUI";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  description: "The official dashboard for ownership to manage reports on the store.",
};

export default async function OwnerDashboardPage() {
  await connection();
  const products = await getProducts();
  const lowStockProducts = getLowStockProducts(products);
  const totalStockValue = getTotalStockValue(products);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <PageHeader
        title="Owner Dashboard"
        description="High-level overview of inventory status and quick access to reports."
      />

      {/* Summary Cards */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Products" value={products.length} />
        <SummaryCard label="Total Stock Value" value={formatCurrency(totalStockValue)} />
        <SummaryCard label="Low Stock Items" value={lowStockProducts.length} />
      </section>

      {/* Low Stock Preview */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Low Stock Preview</h2>
          <Link href="/owner/reports/low-stock" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View full report
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>SKU</Th>
                <Th>Quantity</Th>
                <Th>Restock Level</Th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No products are currently below restock level.
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <Td>{p.name}</Td>
                    <Td>{p.sku}</Td>
                    <Td className="font-medium text-red-700">{p.quantity}</Td>
                    <Td>{p.restockLevel}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReportLink
            title="Stock Status"
            description="View overall stock levels and total inventory value."
            href="/owner/reports/stock-status"
          />
          <ReportLink
            title="Low Stock Alerts"
            description="See all products below their restock threshold."
            href="/owner/reports/low-stock"
          />
          <ReportLink
            title="Transaction History"
            description="Review all inventory adjustments with full audit trail."
            href="/owner/reports/transaction-history"
          />
        </div>
      </section>
    </main>
  );
}