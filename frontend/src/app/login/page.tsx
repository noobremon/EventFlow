'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.data.token, data.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="app-shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
          <section className="surface-dark relative overflow-hidden p-8 sm:p-10">
            <div className="pointer-events-none absolute -top-16 right-0 size-48 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-20 left-0 size-56 rounded-full bg-indigo-500/20 blur-3xl"></div>
            <div className="relative max-w-xl">
              <div className="section-kicker border-white/10 bg-white/5 text-white/75">Welcome back</div>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Log in to your event command center.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Resume event planning, approvals, and attendee management from one focused dashboard.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Fast access', 'Jump back into your workspace'],
                  ['Live data', 'See registrations as they happen'],
                  ['Zero clutter', 'Keep the workflow simple'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-300">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mx-auto flex w-full max-w-md items-center">
            <div className="card w-full p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-black tracking-tight text-slate-950">Log In</h1>
                <p className="mt-1 text-sm text-slate-600">Access your EventFlow workspace</p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="login-submit">
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-slate-950 hover:text-slate-700">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
