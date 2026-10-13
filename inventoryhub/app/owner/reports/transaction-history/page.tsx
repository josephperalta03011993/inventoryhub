import type { Metadata } from "next";
import { connection } from "next/server";
import {
  DEFAULT_HISTORY_DAYS,
  getDefaultTransactionDateRange,
  getEmployees,
  getTransactions,
  TransactionHistoryNotConfiguredError,
  type Transaction,
  type TransactionFilters,
} from "@/lib/owner-data";
import TransactionHistoryReport from "./TransactionHistoryReport";

export const metadata: Metadata = {
  title: "Transaction History",
  description: "Inventory adjustments with a full audit trail.",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function readParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export default async function TransactionHistoryReportPage({
  searchParams,
}: PageProps<"/owner/reports/transaction-history">) {
  await connection();
  const params = await searchParams;
  const defaults = getDefaultTransactionDateRange();

  const start = readParam(params.start);
  const end = readParam(params.end);
  let startDate = ISO_DATE.test(start) ? start : defaults.startDate;
  let endDate = ISO_DATE.test(end) ? end : defaults.endDate;
  if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

  const filters: TransactionFilters = {
    startDate,
    endDate,
    employeeId: readParam(params.employee),
  };

  const employees = await getEmployees();
  let transactions: Transaction[] = [];
  let historyNotConfigured = false;

  try {
    transactions = await getTransactions(filters);
  } catch (error) {
    if (!(error instanceof TransactionHistoryNotConfiguredError)) {
      throw error;
    }
    historyNotConfigured = true;
  }

  return (
    <TransactionHistoryReport
      transactions={transactions}
      employees={employees}
      filters={filters}
      historyNotConfigured={historyNotConfigured}
      isDefaultRange={startDate === defaults.startDate && endDate === defaults.endDate}
      defaultDays={DEFAULT_HISTORY_DAYS}
    />
  );
}
