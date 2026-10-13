import React from "react";
import Link from "next/link";

// Prices are stored in pesos; matches the admin product pages.
export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

type SummaryCardProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function SummaryCard({ label, value, className = "" }: SummaryCardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm ${className}`}>
      <div className="mb-1 text-sm font-medium text-slate-500">{label}</div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

type ReportLinkProps = {
  title: string;
  description: string;
  href: string;
  className?: string;
};

export function ReportLink({ title, description, href, className = "" }: ReportLinkProps) {
  return (
    <Link
      href={href}
      className={`rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-indigo-200 hover:bg-indigo-50/40 ${className}`}
    >
      <div className="mb-1 text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-sm text-slate-500">{description}</div>
    </Link>
  );
}

type CellProps = {
  children: React.ReactNode;
  className?: string;
};

export function Th({ children, className = "" }: CellProps) {
  return (
    <th
      className={`border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: CellProps) {
  return (
    <td className={`border-t border-slate-100 px-4 py-3 text-sm align-middle text-slate-700 ${className}`}>
      {children}
    </td>
  );
}

type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </header>
  );
}

type ExportCsvButtonProps<T extends Record<string, unknown>> = {
  data: T[];
  filename: string;
  className?: string;
};

// Client-only CSV export. The page importing this must have "use client"
// at the top, since it attaches an onClick handler.
export function ExportCsvButton<T extends Record<string, unknown>>({
  data,
  filename,
  className = "",
}: ExportCsvButtonProps<T>) {
  function handleExport() {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((key) => {
          const value = row[key];
          const cell = value === null || value === undefined ? "" : String(value);
          // Escape quotes and wrap in quotes if the cell has a comma/quote/newline
          const escaped = cell.replace(/"/g, '""');
          return /[",\r\n]/.test(cell) ? `"${escaped}"` : escaped;
        })
        .join(",")
    );

    // The BOM tells Excel the file is UTF-8, so ₱ and names like "Peña" display correctly.
    const csv = "﻿" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={data.length === 0}
      className={`rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      Export CSV
    </button>
  );
}