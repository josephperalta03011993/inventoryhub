"use client";

import { useMemo, useState } from "react";
import { getProducts, getLowStockProducts } from "@/lib/owner-mock-data";
import { PageHeader, Th, Td, ExportCsvButton } from "@/components/owner/OwnerUI";

export default function LowStockReportPage() {
  const [search, setSearch] = useState("");

  const lowStockProducts = useMemo(() => getLowStockProducts(getProducts()), []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return lowStockProducts;
    return lowStockProducts.filter(
      (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)
    );
  }, [lowStockProducts, search]);

  const exportRows = filtered.map((p) => ({
    product: p.name,
    sku: p.sku,
    quantity: p.quantity,
    restockLevel: p.restockLevel,
    shortfall: p.restockLevel - p.quantity,
  }));

  return (
    <main className="min-h-screen bg-white text-black px-8 py-10">
      <PageHeader
        title="Low Stock Alerts"
        description="All products currently below their restock threshold."
      />

      <div className="mb-4 flex items-center justify-between gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          aria-label="Search low stock products"
          className="w-full max-w-xs border border-[#E5E5E5] rounded-md px-3 py-1.5 text-sm"
        />
        <ExportCsvButton data={exportRows} filename="low-stock-report.csv" />
      </div>

      <div className="border border-[#E5E5E5] rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Quantity</Th>
              <Th>Restock Level</Th>
              <Th>Shortfall</Th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-sm text-center border-t border-[#E5E5E5]">
                  {lowStockProducts.length === 0
                    ? "No products are currently below restock level."
                    : "No products match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-[#E5E5E5]">
                  <Td>{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td className="text-red-600 font-medium">{p.quantity}</Td>
                  <Td>{p.restockLevel}</Td>
                  <Td>{p.restockLevel - p.quantity}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}