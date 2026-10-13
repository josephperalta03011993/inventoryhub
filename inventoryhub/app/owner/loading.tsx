// Shown while any owner page waits on the database.
export default function OwnerLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10" aria-busy="true">
      <div className="mb-8 space-y-3 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-slate-200" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-slate-200" />
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-xl border border-slate-200 bg-white" />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
      <span className="sr-only">Loading report…</span>
    </main>
  );
}
