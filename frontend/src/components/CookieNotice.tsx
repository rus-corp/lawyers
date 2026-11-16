'use client';

import { useState } from 'react';
import Link from 'next/link';
import { enter } from '@/lib/enter';
import { COOKIE_NOTICE } from '@/lib/site';

const YEAR = 60 * 60 * 24 * 365;

export default function CookieNotice() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const accept = () => {
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${COOKIE_NOTICE}=accepted; max-age=${YEAR}; path=/; samesite=lax${secure}`;
    setOpen(false);
  };

  return (
    <section
      aria-label="Файлы cookie"
      className="enter fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:bottom-6 md:left-8 md:max-w-[540px]"
      style={enter({ y: 16 })}
    >
      <div
        className="flex flex-col gap-4 rounded-2xl border border-border bg-[#FAF8F4]/95 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-6 md:p-6"
        style={{ boxShadow: '0 12px 40px rgba(28,25,21,0.14), 0 1px 0 rgba(255,255,255,0.9) inset' }}
      >
        <p className="font-body text-[13px] leading-relaxed text-[#4A4642]">
          Мы используем файлы cookie, чтобы сайт работал, и для анализа посещаемости. Продолжая пользоваться сайтом, вы
          соглашаетесь с{' '}
          <Link href="/politic" className="underline underline-offset-2 transition-colors hover:text-[#C62828]">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          data-cursor="pointer"
          onClick={accept}
          className="font-display w-full shrink-0 bg-[#C62828] px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#8B0000] sm:w-auto"
        >
          Хорошо
        </button>
      </div>
    </section>
  );
}
