import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/app/lib/db";
import { requireRole } from "@/app/lib/session";
import { submitStockReport } from "../actions";

export const metadata: Metadata = {
  title: "Report a Stock Count",
  description: "Submit a counted product quantity for review.",
};

export default async function NewStockReportPage() {
  await requireRole("Employee");
  const products = await sql`
    SELECT id, name, sku, stock
    FROM public.products
    ORDER BY name ASC
  `;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report a Stock Count</h1>
        <p className="mt-2 text-sm text-slate-600">
          Submit the quantity you counted. An Admin or Owner will review it before inventory is updated.
        </p>
      </header>

      <form
        action={submitStockReport}
        className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="productId" className="mb-1.5 block text-sm font-medium text-slate-700">
            Product
          </label>
          <select
            id="productId"
            name="productId"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="" disabled>Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku}) — current stock: {product.stock}
              </option>
            ))}
          </select>
          {products.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">There are no products to report yet.</p>
          )}
        </div>

        <div>
          <label htmlFor="reportedQuantity" className="mb-1.5 block text-sm font-medium text-slate-700">
            Quantity counted
          </label>
          <input
            id="reportedQuantity"
            name="reportedQuantity"
            type="number"
            min="0"
            max="2147483647"
            step="1"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-slate-700">
            Note
          </label>
          <textarea
            id="note"
            name="note"
            required
            maxLength={500}
            rows={4}
            placeholder="Briefly describe the count or discrepancy."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
          <Link href="/reports/mine" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={products.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit for review
          </button>
        </div>
      </form>
    </main>
  );
}
