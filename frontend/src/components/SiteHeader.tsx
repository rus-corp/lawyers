'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { CONTACT_EMAIL } from '@/lib/site';

const TABS = [
  { label: 'Главная', href: '/', color: 'bg-tab-home border-tab-home', match: (path: string) => path === '/' },
  {
    label: 'Документы',
    href: '/categories',
    color: 'bg-tab-docs border-tab-docs',
    match: (path: string) => ['/categories', '/docs', '/payment_page'].some(prefix => path.startsWith(prefix)),
  },
  { label: 'О нас', href: '/about', color: 'bg-tab-about border-tab-about', match: (path: string) => path.startsWith('/about') },
  { label: 'Статьи', href: '/news', color: 'bg-tab-articles border-tab-articles', match: (path: string) => path.startsWith('/news') },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-[70]"
      aria-label="Основная навигация"
    >
      {/* Warm neutral navigation panel */}
      <div
        className="mx-3 mt-3 flex flex-wrap items-center justify-between overflow-hidden rounded-2xl border border-border bg-[#FAF8F4]/95 px-5 pt-3 backdrop-blur-xl md:mx-8 md:mt-4 md:overflow-visible md:px-8 md:pt-3.5"
        style={{ boxShadow: '0 12px 40px rgba(28,25,21,0.10), 0 1px 0 rgba(255,255,255,0.9) inset' }}
      >
        <Link
          href="/"
          data-cursor="pointer"
          aria-label="Перейти на главную страницу"
          className="pb-3 text-[15px] text-graphite transition-opacity hover:opacity-70 md:pb-3.5"
        >
          <Logo variant="nav" />
        </Link>

        {/* Desktop bookmark tabs */}
        <div className="hidden self-end md:flex md:items-end md:gap-1">
          {TABS.map(({ label, href, color, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                data-cursor="pointer"
                aria-current={active ? 'page' : undefined}
                className={`font-display relative rounded-t-xl border-x border-t px-6 pb-3 pt-2.5 text-[13px] font-semibold text-white transition-all duration-200 lg:px-8 ${color} ${
                  active
                    ? '-translate-y-1 shadow-[0_-8px_24px_rgba(7,30,94,0.22)] brightness-110'
                    : 'opacity-70 hover:-translate-y-0.5 hover:opacity-100'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <a
          data-cursor="pointer"
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-display pb-3 text-[10px] font-semibold text-cobalt transition-colors hover:text-cobalt-dark sm:text-[13px] md:pb-3.5"
        >
          {CONTACT_EMAIL}
        </a>

        <div className="flex basis-full items-end justify-between gap-1 border-t border-graphite/10 md:hidden">
          {TABS.map(({ label, href, color, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex-1 rounded-t-lg border-x border-t px-1 pb-2 pt-2.5 text-center text-[10px] font-semibold text-white transition-all ${color} ${
                  active ? '-translate-y-0.5 brightness-110' : 'opacity-65 hover:opacity-100'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
