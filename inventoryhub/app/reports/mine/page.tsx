import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/app/lib/db";
import { requireRole } from "@/app/lib/session";

export const metadata: Metadata = {
  title: "My Stock Reports",
  description: "Track stock-count reports submitted for review.",
};

export default async function MyStockReportsPage() {
  const employee = await requireRole("Employee");
  const reports = await sql`
    SELECT
      report.id,
      product.name AS product_name,
      product.sku,
      report.reported_quantity,
      report.note,
      report.status,
      report.submitted_at
    FROM public.employee_stock_reports AS report
    LEFT JOIN public.products AS product ON product.id = report.product_id
    WHERE report.employee_id = ${employee.id}
    ORDER BY report.submitted_at DESC
  `;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Stock Reports</h1>
          <p className="mt-2 text-sm text-slate-600">Check the review status of your submitted counts.</p>
        </div>
        <Link href="/reports/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Submit a count
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Counted quantity</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500">
                  You have not submitted any stock counts.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {report.product_name ?? "Deleted product"}{report.sku ? ` (${report.sku})` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{report.reported_quantity}</td>
                  <td className="max-w-sm whitespace-pre-wrap px-4 py-3 text-sm text-slate-700">{report.note}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(report.submitted_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-slate-700">{report.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
