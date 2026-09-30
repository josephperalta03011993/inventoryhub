"use client";

import { useMemo, useState } from "react";
import { getTransactions } from "@/lib/owner-mock-data";
import { PageHeader, Th, Td, ExportCsvButton } from "@/components/owner/OwnerUI";

const TYPE_LABELS: Record<string, string> = {
  stock_adjustment: "Stock Adjustment",
  restock: "Restock",
  physical_count: "Physical Count",
};

export default function TransactionHistoryReportPage() {
  const transactions = useMemo(() => getTransactions(), []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const txDate = t.timestamp.slice(0, 10); // "YYYY-MM-DD"
      if (startDate && txDate < startDate) return false;
      if (endDate && txDate > endDate) return false;
      return true;
    });
  }, [transactions, startDate, endDate]);

  const exportRows = filtered.map((t) => ({
    date: new Date(t.timestamp).toLocaleString(),
    product: t.productName,
    sku: t.sku,
    type: TYPE_LABELS[t.transactionType] ?? t.transactionType,
    previousQuantity: t.previousQuantity,
    newQuantity: t.newQuantity,
    change: t.quantityChange,
    employee: t.employeeName,
    reason: t.reason,
  }));

  function clearFilters() {
    setStartDate("");
    setEndDate("");
  }

  return (
    <main className="min-h-screen bg-white text-black px-8 py-10">
      <PageHeader
        title="Transaction History"
        description="Full audit trail of every inventory adjustment, with employee and reason."
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-xs uppercase tracking-wide">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Filter start date"
              className="border border-[#E5E5E5] rounded-md px-3 py-1.5 text-sm"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-xs uppercase tracking-wide">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="Filter end date"
              className="border border-[#E5E5E5] rounded-md px-3 py-1.5 text-sm"
            />
          </label>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm underline hover:no-underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <ExportCsvButton data={exportRows} filename="transaction-history-report.csv" />
      </div>

      <div className="border border-[#E5E5E5] rounded-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              <Th>Date</Th>
              <Th>Product</Th>
              <Th>Type</Th>
              <Th>Previous</Th>
              <Th>New</Th>
              <Th>Change</Th>
              <Th>Employee</Th>
              <Th>Reason</Th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-3 text-sm text-center border-t border-[#E5E5E5]">
                  No transactions in the selected date range.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="border-t border-[#E5E5E5]">
                  <Td>{new Date(t.timestamp).toLocaleString()}</Td>
                  <Td>
                    {t.productName}{" "}
                    <span className="text-xs">({t.sku})</span>
                  </Td>
                  <Td>{TYPE_LABELS[t.transactionType] ?? t.transactionType}</Td>
                  <Td>{t.previousQuantity}</Td>
                  <Td>{t.newQuantity}</Td>
                  <Td className={t.quantityChange < 0 ? "text-red-600 font-medium" : "text-green-700 font-medium"}>
                    {t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}
                  </Td>
                  <Td>{t.employeeName}</Td>
                  <Td>{t.reason}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}