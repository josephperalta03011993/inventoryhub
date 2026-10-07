"use client";

import { useMemo } from "react";
import { getProducts, getLowStockProducts, getTotalStockValue } from "@/lib/owner-mock-data";
import { PageHeader, SummaryCard, Th, Td, ExportCsvButton } from "@/components/owner/OwnerUI";

export default function StockStatusReportPage() {
  const products = useMemo(() => getProducts(), []);
  const lowStockProducts = useMemo(() => getLowStockProducts(products), [products]);
  const totalStockValue = useMemo(() => getTotalStockValue(products), [products]);

  const exportRows = products.map((p) => ({
    product: p.name,
    sku: p.sku,
    quantity: p.quantity,
    restockLevel: p.restockLevel,
    unitPrice: p.price,
    stockValue: (p.quantity * p.price).toFixed(2),
    belowRestockLevel: p.quantity < p.restockLevel ? "Yes" : "No",
  }));

  return (
    <main className="min-h-screen bg-white text-black px-8 py-10">
      <PageHeader
        title="Stock Status"
        description="Overall stock levels and total inventory value across all products."
      />

      <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Total Products" value={products.length} />
        <SummaryCard label="Total Stock Value" value={`$${totalStockValue.toFixed(2)}`} />
        <SummaryCard label="Below Restock Level" value={lowStockProducts.length} />
      </section>

      <div className="mb-4 flex justify-end">
        <ExportCsvButton data={exportRows} filename="stock-status-report.csv" />
      </div>

      <div className="border border-[#E5E5E5] rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Quantity</Th>
              <Th>Restock Level</Th>
              <Th>Unit Price</Th>
              <Th>Stock Value</Th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => {
              const isLow = p.quantity < p.restockLevel;
              return (
                <tr key={p.id} className="border-t border-[#E5E5E5]">
                  <Td>{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td className={isLow ? "text-red-600 font-medium" : ""}>{p.quantity}</Td>
                  <Td>{p.restockLevel}</Td>
                  <Td>${p.price.toFixed(2)}</Td>
                  <Td>${(p.quantity * p.price).toFixed(2)}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}