import React from "react";

type SummaryCardProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function SummaryCard({ label, value, className = "" }: SummaryCardProps) {
  return (
    <div className={`border border-[#E5E5E5] rounded-md px-4 py-5 bg-white ${className}`}>
      <div className="text-xs uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
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
    <a
      href={href}
      className={`border border-[#E5E5E5] rounded-md px-4 py-4 bg-white hover:bg-[#F9F9F9] transition-colors ${className}`}
    >
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs">{description}</div>
    </a>
  );
}

type CellProps = {
  children: React.ReactNode;
  className?: string;
};

export function Th({ children, className = "" }: CellProps) {
  return (
    <th
      className={`px-4 py-2 text-left text-xs font-semibold border-b border-[#E5E5E5] ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: CellProps) {
  return (
    <td className={`px-4 py-2 text-sm border-t border-[#E5E5E5] align-middle ${className}`}>
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
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-sm">{description}</p>
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
          return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
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
      className={`text-sm border border-[#E5E5E5] rounded-md px-3 py-1.5 hover:bg-[#F9F9F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      Export CSV
    </button>
  );
}