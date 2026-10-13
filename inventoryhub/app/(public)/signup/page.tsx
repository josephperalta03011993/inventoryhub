'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account registration failed.');
      }

      setUiSuccess('Account created. Redirecting to sign in...');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => router.replace('/login'), 1000);
    } catch (err: unknown) {
      setUiError(
        err instanceof Error ? err.message : 'Could not connect to the server.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="block h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700">
              InventoryHub
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="text-sm text-slate-500">
            Register for InventoryHub access.
          </p>
        </div>

        {uiError && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {uiError}
          </div>
        )}
        {uiSuccess && (
          <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {uiSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name-field" className="mb-1.5 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name-field"
              type="text"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Jordan Lee"
            />
          </div>

          <div>
            <label htmlFor="email-field" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
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
            <label htmlFor="password-field" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password-field"
              type="password"
              required
              minLength={6}
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
      <Link href="/" className="mt-6 text-sm font-medium text-slate-500 hover:text-indigo-700">
        ← Back to home
      </Link>
    </main>
  );
}
