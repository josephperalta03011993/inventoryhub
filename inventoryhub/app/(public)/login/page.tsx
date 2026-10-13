'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uiError, setUiError] = useState<string | null>(null);
  const [uiSuccess, setUiSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUiError(null);
    setUiSuccess(null);
    setIsLoading(true);

    try {
      //  Points directly to my colocated endpoint handler sitting right next door!
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: { error?: string; redirectTo?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      const redirectTo = data.redirectTo;
      if (
        redirectTo !== "/products" &&
        redirectTo !== "/owner/dashboard" &&
        redirectTo !== "/"
      ) {
        throw new Error("The account does not have a valid destination.");
      }

      setUiSuccess('Authorized! Access granted.');
      setTimeout(() => {
        window.location.assign(redirectTo);
      }, 600);

    } catch (err: unknown) {
      setUiError(err instanceof Error ? err.message : 'Network interruption occurred.');
    } finally {
      setIsLoading(false);
    }
  }

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
        {uiSuccess && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{uiSuccess}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-field" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email-field"
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label htmlFor="password-field" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password-field"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
