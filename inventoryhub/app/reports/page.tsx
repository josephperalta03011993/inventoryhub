import type { Metadata } from "next";
import { sql } from "@/app/lib/db";
import { requireAnyRole } from "@/app/lib/session";
import { approveStockReport, rejectStockReport } from "./actions";

export const metadata: Metadata = {
  title: "Stock Reports",
  description: "Review employee-submitted stock counts.",
};

export default async function StockReportsPage() {
  await requireAnyRole(["Admin", "Owner"]);
  const reports = await sql`
    SELECT
      report.id,
      report.reported_quantity,
      report.note,
      report.submitted_at,
      product.name AS product_name,
      product.sku,
      product.stock AS current_stock,
      employee.name AS employee_name
    FROM public.employee_stock_reports AS report
    LEFT JOIN public.products AS product ON product.id = report.product_id
    LEFT JOIN public.users AS employee ON employee.id = report.employee_id
    WHERE report.status = 'pending'
    ORDER BY report.submitted_at ASC
  `;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Stock Reports</h1>
        <p className="mt-2 text-sm text-slate-600">
          Approving a count updates product stock and records the change in transaction history.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Counted</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Review</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="border-t border-slate-100 px-4 py-6 text-center text-sm text-slate-500">
                  No stock reports are waiting for review.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {report.product_name ?? "Deleted product"}{report.sku ? ` (${report.sku})` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{report.current_stock ?? "—"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{report.reported_quantity}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{report.employee_name ?? "Unknown"}</td>
                  <td className="max-w-sm whitespace-pre-wrap px-4 py-3 text-sm text-slate-700">{report.note}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(report.submitted_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
                  </td>
                  <td className="px-4 py-3">
                    {report.product_name ? (
                      <div className="flex gap-2">
                        <form action={approveStockReport}>
                          <input type="hidden" name="reportId" value={report.id} />
                          <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                            Approve
                          </button>
                        </form>
                        <form action={rejectStockReport}>
                          <input type="hidden" name="reportId" value={report.id} />
                          <button type="submit" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Reject
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Product removed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
