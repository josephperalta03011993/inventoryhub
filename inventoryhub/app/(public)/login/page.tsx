'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { authenticate } from './actions';

export default function LoginPage() {
  const [uiError, formAction, isLoading] = useActionState(authenticate, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="block h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">InventoryHub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to your InventoryHub account.</p>
        </div>

        {uiError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{uiError}</div>}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email-field" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email-field"
              type="email"
              name="email"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label htmlFor="password-field" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password-field"
              type="password"
              name="password"
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link href="/signup" className="ml-1 font-medium text-indigo-600 hover:text-indigo-700">
            Sign up
          </Link>
        </p>
      </div>
      <Link href="/" className="mt-6 text-sm font-medium text-slate-500 hover:text-indigo-700">← Back to home</Link>
    </main>
  );
}
