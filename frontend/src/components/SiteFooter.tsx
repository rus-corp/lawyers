import Link from 'next/link';
import Logo from './Logo';
import { CONTACT_EMAIL } from '@/lib/site';

const LINKS = [
  { label: 'Политика конфиденциальности', href: '/politic' },
  { label: 'Условия оплаты', href: '/payment_rules' },
  { label: 'Публичная оферта', href: '/offer' },
  { label: 'Статьи', href: '/news' },
  { label: 'Контакты', href: '/contacts' },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#151C32] px-6 py-12 text-white md:px-16 md:py-16">
      <div className="pointer-events-none absolute -right-24 -top-44 h-96 w-96 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-36 left-[20%] h-72 w-72 rounded-full bg-[#1B4FD8]/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-12 grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Link
              href="/"
              data-cursor="pointer"
              aria-label="Перейти на главную страницу"
              className="mb-5 inline-flex text-[15px] text-white transition-opacity hover:opacity-75"
            >
              <Logo variant="nav" />
            </Link>
            <div className="font-display max-w-3xl text-[32px] font-black leading-[0.98] tracking-[-0.035em] sm:text-[44px] md:text-[58px]">
              Правовые решения
              <br />
              <span className="text-[#6E9BFF]">без лишней сложности</span>
            </div>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group flex items-center justify-between gap-8 border border-white/20 bg-white/[0.06] px-6 py-5 text-[13px] transition-colors hover:border-[#6E9BFF] hover:bg-white/10"
          >
            <span>{CONTACT_EMAIL}</span>
            <span className="text-[#6E9BFF] transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
        <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div className="text-[12px] leading-6 text-white/50">
            Готовые юридические документы с понятными инструкциями и доставкой на электронную почту.
          </div>
          <nav aria-label="Правовая информация" className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 md:grid-cols-5">
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="text-left text-[11px] text-white/55 transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-white/10 pt-5">
          <span className="text-[10px] tracking-[0.12em] text-white/35">
            © {new Date().getFullYear()} ПРАВОДОК.РУ — Юридические документы онлайн
          </span>
        </div>
      </div>
    </footer>
  );
}
