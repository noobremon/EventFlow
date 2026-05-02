'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setAuth(data.data.token, data.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="app-shell py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1fr] lg:items-stretch">
          <section className="surface-dark relative overflow-hidden p-8 sm:p-10 lg:order-last">
            <div className="pointer-events-none absolute -top-16 left-0 size-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-20 right-0 size-56 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
            <div className="relative max-w-xl">
              <div className="section-kicker border-white/10 bg-white/5 text-white/75">Create account</div>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Set up your event workspace in minutes.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                Launch public pages, RSVP flows, and attendee tools from a single streamlined setup.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Simple setup', 'Start without a steep learning curve'],
                  ['Reusable templates', 'Move faster on every new event'],
                  ['Built for teams', 'Work with clarity from day one'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-300">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mx-auto flex w-full max-w-md items-center lg:order-first">
            <div className="card w-full p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-black tracking-tight text-slate-950">Create Account</h1>
                <p className="mt-1 text-sm text-slate-600">Start organizing amazing events</p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4" id="signup-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name"
                    className="form-input"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    className="form-input"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    className="form-input"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} id="signup-submit">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-slate-950 hover:text-slate-700">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
