'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      <main className={isLoginPage ? '' : 'pb-20'}>
        <div className={isLoginPage ? '' : 'max-w-lg mx-auto px-4 py-4'}>
          {children}
        </div>
      </main>
      {!isLoginPage && <BottomNav />}
    </>
  );
}
