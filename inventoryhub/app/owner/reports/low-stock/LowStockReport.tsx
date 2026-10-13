"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/owner-data";
import { PageHeader, Th, Td, ExportCsvButton } from "@/components/owner/OwnerUI";

export default function LowStockReport({
  lowStockProducts,
}: {
  lowStockProducts: Product[];
}) {
  const [search, setSearch] = useState("");

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
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
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
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <ExportCsvButton data={exportRows} filename="low-stock-report.csv" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
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
                <td colSpan={5} className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500">
                  {lowStockProducts.length === 0
                    ? "No products are currently below restock level."
                    : "No products match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <Td>{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td className="font-medium text-red-700">{p.quantity}</Td>
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