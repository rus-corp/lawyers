'use client';

import { usePathname } from 'next/navigation';

// Replays the page entrance animation on every route change.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
