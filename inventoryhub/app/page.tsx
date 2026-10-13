import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-black uppercase tracking-widest text-black">
        InventoryHub
      </p>
      <h1 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">
        Know what is on your shelves, always.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-700">
        InventoryHub is a simple inventory management system for small
        businesses. Replace spreadsheets and paper records with one place to
        track products, record stock changes, and review reports.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Log in
        </Link>
        {/* <Link
          href="/signup"
          className="rounded-lg border border-gray-400 bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Create an account
        </Link> */}
      </div>

      <section aria-labelledby="roles-heading" className="mt-16">
        <h2 id="roles-heading" className="text-xl font-semibold text-gray-900">
          Built for the whole team
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Employees</h3>
            <p className="mt-2 text-sm text-gray-700">
              View products and keep stock counts up to date.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Admins</h3>
            <p className="mt-2 text-sm text-gray-700">
              Manage the product catalog and staff accounts.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">Owners</h3>
            <p className="mt-2 text-sm text-gray-700">
              Monitor stock value, low-stock alerts, and a full history of
              changes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
