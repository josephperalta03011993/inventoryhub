"use client";

import type { Product } from "@/lib/owner-data";
import { PageHeader, SummaryCard, Th, Td, ExportCsvButton, formatCurrency } from "@/components/owner/OwnerUI";

export default function StockStatusReport({
  products,
  lowStockCount,
  totalStockValue,
}: {
  products: Product[];
  lowStockCount: number;
  totalStockValue: number;
}) {
  const exportRows = products.map((p) => ({
    product: p.name,
    sku: p.sku,
    quantity: p.quantity,
    restockLevel: p.restockLevel,
    unitPrice: p.price,
    stockValue: (p.quantity * p.price).toFixed(2),
    lowStock: p.isLowStock ? "Yes" : "No",
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <PageHeader
        title="Stock Status"
        description="Overall stock levels and total inventory value across all products."
      />

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard label="Total Products" value={products.length} />
        <SummaryCard label="Total Stock Value" value={formatCurrency(totalStockValue)} />
        <SummaryCard label="Below Restock Level" value={lowStockCount} />
      </section>

      <div className="mb-4 flex justify-end">
        <ExportCsvButton data={exportRows} filename="stock-status-report.csv" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Quantity</Th>
              <Th>Restock Level</Th>
              <Th>Unit Price</Th>
              <Th>Stock Value</Th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500">
                  No products have been added yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <Td>{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td className={p.isLowStock ? "font-medium text-red-700" : ""}>{p.quantity}</Td>
                  <Td>{p.restockLevel}</Td>
                  <Td>{formatCurrency(p.price)}</Td>
                  <Td>{formatCurrency(p.quantity * p.price)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}