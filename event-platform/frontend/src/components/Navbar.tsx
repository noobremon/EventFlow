'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, getUser, clearAuth } from '@/lib/auth';
import { User } from '@/types';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>EventFlow</span>
        </Link>

        <div className={styles.actions}>
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
              <div className={styles.userMenu}>
                <button
                  className={styles.avatar}
                  onClick={() => setMenuOpen(!menuOpen)}
                  id="user-menu-btn"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <hr className={styles.divider} />
                    <button onClick={handleLogout} className={styles.dropdownItem} id="logout-btn">
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
