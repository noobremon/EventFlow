'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Navbar from '@/components/Navbar';

const subscribe = () => () => {};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasMounted = useSyncExternalStore(subscribe, () => true, () => false);
  const authenticated = hasMounted && isAuthenticated();

  useEffect(() => {
    if (hasMounted && !authenticated) {
      router.push('/login');
    }
  }, [hasMounted, authenticated, router]);

  if (!hasMounted || !authenticated) {
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
