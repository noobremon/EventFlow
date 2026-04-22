'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready] = useState(() => isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!ready) {
    return (
      <>
        <Navbar />
        <div className="app-shell flex min-h-[60vh] items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-8 sm:py-10">
        <div className="app-shell">{children}</div>
      </main>
    </>
  );
}
