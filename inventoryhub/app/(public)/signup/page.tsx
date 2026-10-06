'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
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
      // 🚀 FIXED: Pointing explicitly to the absolute API directory layout hub route path
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to provision account credentials.');
      }

      setUiSuccess('Account registration successful! Redirecting to sign in terminal...');
      setName('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err: unknown) {
      setUiError(err instanceof Error ? err.message : 'Network communication failure occurred.');
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
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Clearance Request</h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Register New Personnel Profile</p>
        </div>

        {uiError && <div aria-live="polite" className="p-3 bg-white border border-black text-xs font-bold uppercase text-center text-black">⚠️ {uiError}</div>}
        {uiSuccess && <div className="p-3 bg-gray-50 border border-[#E5E5E5] text-xs font-bold uppercase text-center text-gray-900">✓ {uiSuccess}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name-field" className="block text-[10px] font-black uppercase tracking-widest text-black mb-1.5">Full Legal Name</label>
            <input
              id="name-field"
              type="text"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs text-gray-900 font-medium focus:border-black focus:outline-hidden transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email-field" className="block text-[10px] font-black uppercase tracking-widest text-black mb-1.5">Business Email Address</label>
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
            <label htmlFor="password-field" className="block text-[10px] font-black uppercase tracking-widest text-black mb-1.5">System Access Password</label>
            <input
              id="password-field"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs text-gray-900 font-medium focus:border-black focus:outline-hidden transition-all"
              placeholder="Minimum 6 characters"
            />
          </div>

          {/* 🚀 ROLE SELECT DROPDOWN COMLETELY DELETED ACCORDING TO USER STORY SPECIFICATIONS */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white text-xs font-black uppercase tracking-widest py-3 px-4 hover:bg-gray-900 disabled:bg-gray-400 transition-all text-center rounded-xl cursor-pointer"
          >
            {isLoading ? 'Requesting Access...' : 'Submit Clearance Request'}
          </button>
        </form>

        <div className="border-t border-[#E5E5E5] pt-4 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Already have clearance? <Link href="/login" className="text-black hover:underline ml-1">Log in here</Link>
          </p>
        </div>
      </div>
      <Link href="/" className="mt-6 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest">← Return To Terminal</Link>
    </main>
  );
}
