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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      setUiSuccess('Authorized! Access granted.');
      setTimeout(() => {
        window.location.href = '/products';
      }, 1500);

    } catch (err: unknown) {
      setUiError(err instanceof Error ? err.message : 'Network interruption occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black font-sans flex flex-col justify-center items-center px-6 py-12 selection:bg-black selection:text-white">
      <div className="max-w-md w-full bg-white border border-[#E5E5E5] p-8 rounded-2xl shadow-2xs space-y-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-black rounded-full block" />
            <span className="text-xs font-black uppercase tracking-widest text-black">InventoryHub</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Sign In Terminal</h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Authorized Personnel Clearance</p>
        </div>

        {uiError && <div aria-live="polite" className="p-3 bg-white border border-black text-xs font-bold uppercase text-center text-black">⚠️ {uiError}</div>}
        {uiSuccess && <div className="p-3 bg-gray-50 border border-[#E5E5E5] text-xs font-bold uppercase text-center text-gray-900">✓ {uiSuccess}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-field" className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-black">Business Email</label>
            <input
              id="email-field"
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs text-gray-900 font-medium focus:border-black focus:outline-hidden transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label htmlFor="password-field" className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-black">System Password</label>
            <input
              id="password-field"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs text-gray-900 font-medium focus:border-black focus:outline-hidden transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white text-xs font-black uppercase tracking-widest py-3 px-4 hover:bg-gray-900 disabled:bg-gray-400 transition-all text-center rounded-xl cursor-pointer"
          >
            {isLoading ? 'Verifying Context...' : 'Authorize Access'}
          </button>
        </form>
      </div>
      <Link href="/" className="mt-6 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest">← Return To Terminal Overview</Link>
    </main>
  );
}
