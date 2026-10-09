'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface Props {
  backHref: string;
  backLabel: string;
  right?: React.ReactNode;
  // glass: rounded floating bar; flat: full-width bar with a bottom border
  variant?: 'glass' | 'flat';
  maxWidth?: number;
}

export default function PageBar({ backHref, backLabel, right, variant = 'glass', maxWidth = 1400 }: Props) {
  if (variant === 'flat') {
    return (
      <header className="relative z-20 border-b border-[#E8E4DE] bg-white/90 px-6 py-5 backdrop-blur-xl md:px-16">
        <div className="mx-auto flex items-center justify-between gap-4" style={{ maxWidth }}>
          <Link
            href={backHref}
            data-cursor="pointer"
            className="text-[11px] uppercase tracking-[0.16em] text-[#8C8880] transition-colors hover:text-[#C62828]"
          >
            ← {backLabel}
          </Link>
          <Logo variant="flat" className="text-[#1C1915]" />
          <span className="hidden min-w-0 text-right text-[11px] text-[#8C8880] sm:inline">{right}</span>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-20"
    >
      <div
        className="mx-4 mt-4 flex items-center justify-between gap-4 rounded-2xl px-6 py-3.5 md:mx-8 md:px-8"
        style={{
          background: 'rgba(250,248,244,0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(28,25,21,0.08)',
          boxShadow: '0 2px 24px rgba(28,25,21,0.07)',
        }}
      >
        <Link
          href={backHref}
          data-cursor="pointer"
          className="font-display flex items-center gap-2 text-[13px] font-medium text-[#4A4642] transition-colors hover:text-[#1C1915]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M10 7H4M4 7L7 4M4 7L7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {backLabel}
        </Link>
        <Logo className="text-[15px] text-[#1C1915]" />
        <span className="font-display hidden text-[12px] text-[#8C8880] sm:inline">{right}</span>
      </div>
    </motion.header>
  );
}
