'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { isAuthenticated, getUser, clearAuth } from '@/lib/auth';

const subscribe = () => () => {};

export default function Navbar() {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const user = hasMounted && isAuthenticated() ? getUser() : null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    clearAuth();
    setMenuOpen(false);
    router.push('/');
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 text-white shadow-[0_12px_40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="app-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg shadow-fuchsia-500/20 ring-1 ring-white/15">⚡</span>
          <span className="bg-linear-to-r from-white via-indigo-100 to-fuchsia-100 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            EventFlow
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn border border-white/10 bg-white/10 text-white hover:bg-white/15">
                Dashboard
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white"
                  onClick={() => setMenuOpen(!menuOpen)}
                  id="user-menu-btn"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-64 rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl shadow-slate-900/15">
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
              <Link href="/login" className="btn border border-white/10 bg-white/10 text-white hover:bg-white/15" id="login-link">
                Log In
              </Link>
              <Link href="/signup" className="btn bg-white text-slate-950 hover:bg-slate-100" id="signup-link">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
