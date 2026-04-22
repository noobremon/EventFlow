'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isAuthenticated, getUser, clearAuth } from '@/lib/auth';
import { User } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => (isAuthenticated() ? getUser() : null));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="app-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">⚡</span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">EventFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
                  onClick={() => setMenuOpen(!menuOpen)}
                  id="user-menu-btn"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                    <div className="flex flex-col text-sm">
                      <strong>{user.name}</strong>
                      <span className="text-slate-500">{user.email}</span>
                    </div>
                    <hr className="my-3 border-slate-200" />
                    <button onClick={handleLogout} className="btn btn-ghost w-full justify-start" id="logout-btn">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost" id="login-link">
                Log In
              </Link>
              <Link href="/signup" className="btn btn-primary" id="signup-link">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
