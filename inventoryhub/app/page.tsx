import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/session";

export default async function Home() {
  const user = await getCurrentUser();

  if (user?.role === "Owner") {
    redirect("/owner/dashboard");
  }

  if (user) {
    redirect("/products");
  }

  return (
    <main className="flex min-h-screen flex-col justify-center bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          InventoryHub
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Know what is on your shelves, always.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600">
          InventoryHub is a simple inventory management system for small
          businesses. Replace spreadsheets and paper records with one place to
          track products, record stock changes, and review reports.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Log in
          </Link>
          {/* <Link
            href="/signup"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Create an account
          </Link> */}
        </div>
      </div>
      <section aria-labelledby="roles-heading" className="mx-auto mt-16 w-full max-w-6xl">
        <h2 id="roles-heading" className="text-xl font-semibold text-slate-900">
          Built for the whole team
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Employees</h3>
            <p className="mt-2 text-sm text-slate-600">
              View product details and keep up with stock information.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Admins</h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage the product catalog and staff accounts.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Owners</h3>
            <p className="mt-2 text-sm text-slate-600">
              Monitor stock value, low-stock alerts, and a full history of
              changes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
