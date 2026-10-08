import type { Metadata } from "next";
import { getProducts, getLowStockProducts, getTotalStockValue } from "@/lib/owner-mock-data";
import { SummaryCard, ReportLink, Th, Td, PageHeader } from "@/components/owner/OwnerUI";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  description: "The official dashboard for ownership to manage reports on the store.",
};

export default function OwnerDashboardPage() {
  const products = getProducts();
  const lowStockProducts = getLowStockProducts(products);
  const totalStockValue = getTotalStockValue(products);

  return (
    <main className="min-h-screen bg-white text-black px-8 py-10">
      <PageHeader
        title="Owner Dashboard"
        description="High-level overview of inventory status and quick access to reports."
      />

      {/* Summary Cards */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Products" value={products.length} />
        <SummaryCard label="Total Stock Value" value={`$${totalStockValue.toFixed(2)}`} />
        <SummaryCard label="Low Stock Items" value={lowStockProducts.length} />
      </section>

      {/* Low Stock Preview */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Low Stock Preview</h2>
          <a href="/owner/reports/low-stock" className="text-sm underline hover:no-underline">
            View full report
          </a>
        </div>

        <div className="border border-[#E5E5E5] rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
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
                    className="px-4 py-3 text-sm text-center border-t border-[#E5E5E5]"
                  >
                    No products are currently below restock level.
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((p) => (
                  <tr key={p.id} className="border-t border-[#E5E5E5]">
                    <Td>{p.name}</Td>
                    <Td>{p.sku}</Td>
                    <Td className="text-red-600 font-medium">{p.quantity}</Td>
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
        <h2 className="text-xl font-semibold mb-4">Reports</h2>

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