"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { PageHeader } from "@/components/owner/OwnerUI";

// Shown when an owner page can't load its data, so a failed query is never
// mistaken for an empty report.
export default function OwnerError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 md:px-8 md:py-10">
      <PageHeader
        title="Couldn't load this report"
        description="The inventory data couldn't be reached. The numbers below would not be accurate, so nothing is shown. Please try again in a moment."
      />

      <button
        type="button"
        onClick={() => retry()}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Try again
      </button>
    </main>
  );
}
