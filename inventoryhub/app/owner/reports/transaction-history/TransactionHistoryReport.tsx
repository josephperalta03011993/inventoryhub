"use client";

import Form from "next/form";
import Link from "next/link";
import type {
  Employee,
  Transaction,
  TransactionFilters,
  TransactionType,
} from "@/lib/owner-data";
import { PageHeader, Th, Td, ExportCsvButton } from "@/components/owner/OwnerUI";

const REPORT_PATH = "/owner/reports/transaction-history";

const TYPE_LABELS: Record<TransactionType, string> = {
  stock_adjustment: "Stock Adjustment",
  restock: "Restock",
  physical_count: "Physical Count",
};

export default function TransactionHistoryReport({
  transactions,
  employees,
  filters,
  historyNotConfigured,
  isDefaultRange,
  defaultDays,
}: {
  transactions: Transaction[];
  employees: Employee[];
  filters: TransactionFilters;
  historyNotConfigured: boolean;
  isDefaultRange: boolean;
  defaultDays: number;
}) {
  const isFiltered = !isDefaultRange || filters.employeeId !== "";

  const exportRows = transactions.map((t) => ({
    date: t.displayTime,
    product: t.productName,
    sku: t.sku,
    type: TYPE_LABELS[t.transactionType] ?? t.transactionType,
    previousQuantity: t.previousQuantity,
    newQuantity: t.newQuantity,
    change: t.quantityChange,
    employee: t.employeeName,
    reason: t.reason,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <PageHeader
        title="Transaction History"
        description={`Full audit trail of every inventory adjustment, with employee and reason. Shows the last ${defaultDays} days unless you choose a date range.`}
      />

      {historyNotConfigured && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          Transaction history is not set up yet. Run{" "}
          <code>database/migrations/001_inventory_transactions.sql</code> in
          your Neon SQL Editor, then refresh this page. The migration records
          current quantities as opening balances; earlier stock changes cannot
          be recovered.
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        {/* Keyed on the filters so the inputs reset after navigating back/forward */}
        <Form
          key={`${filters.startDate}|${filters.endDate}|${filters.employeeId}`}
          action={REPORT_PATH}
          className="flex flex-wrap items-end gap-3"
        >
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-xs uppercase tracking-wide">Start date</span>
            <input
              type="date"
              name="start"
              defaultValue={filters.startDate}
              aria-label="Filter start date"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-xs uppercase tracking-wide">End date</span>
            <input
              type="date"
              name="end"
              defaultValue={filters.endDate}
              aria-label="Filter end date"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-xs uppercase tracking-wide">Employee</span>
            <select
              name="employee"
              defaultValue={filters.employeeId}
              aria-label="Filter by employee"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All employees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Apply
          </button>
          {isFiltered && (
            <Link href={REPORT_PATH} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Reset filters
            </Link>
          )}
        </Form>

        <ExportCsvButton data={exportRows} filename="transaction-history-report.csv" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
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
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500">
                  {historyNotConfigured
                    ? "Transaction history is unavailable until the database setup is complete."
                    : "No transactions match the selected filters."}
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <Td>{t.displayTime}</Td>
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
