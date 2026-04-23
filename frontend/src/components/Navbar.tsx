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
    <nav className="sticky top-0 z-50 border-b border-indigo-300/30 bg-gradient-to-r from-indigo-950/90 via-violet-900/90 to-fuchsia-900/90 text-white shadow-[0_8px_30px_rgb(79_70_229/0.35)] backdrop-blur-xl">
      <div className="app-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white shadow-lg shadow-indigo-500/40">⚡</span>
          <span className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">EventFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20">
                Dashboard
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-sm font-semibold text-white"
                  onClick={() => setMenuOpen(!menuOpen)}
                  id="user-menu-btn"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-64 rounded-xl border border-indigo-200/50 bg-white p-3 text-slate-900 shadow-2xl shadow-indigo-500/20">
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
              <Link href="/login" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20" id="login-link">
                Log In
              </Link>
              <Link href="/signup" className="btn bg-white text-indigo-700 hover:bg-indigo-50" id="signup-link">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
