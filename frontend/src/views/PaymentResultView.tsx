'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { TELEGRAM_URL } from '@/lib/site';

interface Props {
  type: 'success' | 'error';
  documentTitle?: string;
  email?: string;
  errorText?: string;
  onRetry?: () => void;
}

export default function PaymentResultView({ type, documentTitle, email, errorText, onRetry }: Props) {
  const success = type === 'success';
  const primary = `${success ? 'bg-[#168A4A] hover:bg-[#10703C]' : 'bg-[#C62828] hover:bg-[#8B0000]'} text-white px-8 py-4 text-center text-[11px] tracking-[0.16em] uppercase font-semibold transition-colors`;
  const secondary = 'border border-[#E8E4DE] text-[#1C1915] px-8 py-4 text-center text-[11px] tracking-[0.16em] uppercase font-semibold hover:border-[#1C1915] transition-colors';

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="h-20 px-6 md:px-14 flex items-center justify-between border-b border-[#E8E4DE]">
        <Logo variant="flat" className="text-[14px] text-[#1C1915]" />
        <div className="text-[10px] tracking-[0.16em] uppercase text-[#8C8880]">{success ? 'Заказ оформлен' : 'Заказ не оформлен'}</div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[1fr_0.8fr]">
        <section className="px-7 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col justify-center">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className={`w-16 h-16 rounded-full ${success ? 'bg-[#168A4A]' : 'bg-[#C62828]'} text-white flex items-center justify-center text-[26px] mb-10`}>
            {success ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M5 8.5h18v12H5z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="m6 10 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            ) : '×'}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}>
            <div className={`text-[10px] tracking-[0.22em] uppercase ${success ? 'text-[#168A4A]' : 'text-[#C62828]'} mb-5`}>
              {success ? 'Оплата прошла успешно' : 'Платёж не завершён'}
            </div>
            <h1 className="font-display text-[42px] sm:text-[54px] md:text-[88px] font-black leading-[0.9] tracking-[-0.05em] text-[#1C1915] mb-8 max-w-3xl">
              {success ? 'Проверьте почтовый ящик' : 'Что-то пошло не так'}
            </h1>
            <div role={success ? undefined : 'alert'} className="text-[15px] md:text-[17px] text-[#8C8880] leading-relaxed max-w-xl mb-10 space-y-4">
              {success ? (
                <>
                  <p>
                    Спасибо! Документ будет отправлен вложением на {email ? <span className="text-[#1C1915] font-semibold">{email}</span> : 'ваш email'} в течение пары минут. Ссылки для скачивания не будет.
                  </p>
                  <p className="text-[#C62828]">Проверьте папку «Спам» — письмо могло попасть туда.</p>
                  <p>
                    Если документ не пришёл,{' '}
                    <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="text-[#1B4FD8] underline underline-offset-4 hover:text-[#C62828]">
                      напишите нам в Telegram
                    </a>
                    {' '}— пришлём его в ближайшее время.
                  </p>
                </>
              ) : (
                <p>{errorText ?? 'Не удалось создать заказ. Деньги не списаны. Попробуйте ещё раз.'}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {success || !onRetry ? (
                <Link href="/" data-cursor="pointer" className={primary}>На главную</Link>
              ) : (
                <button type="button" data-cursor="pointer" onClick={onRetry} className={primary}>Попробовать снова</button>
              )}
              <Link href="/categories" data-cursor="pointer" className={secondary}>
                {success ? 'Продолжить покупки' : 'Вернуться в каталог'}
              </Link>
            </div>
          </motion.div>
        </section>

        <aside className={`${success ? 'bg-[#EFF9F2]' : 'bg-[#FAF2F2]'} px-7 md:px-16 py-16 md:py-24 flex items-center overflow-hidden`} aria-hidden="true">
          {success ? (
            <div className="relative mx-auto flex h-[480px] w-full max-w-md items-end justify-center">
              <motion.div
                initial={{ y: -280, rotate: -8, opacity: 0 }}
                animate={{ y: 42, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-20 z-10 w-[78%] bg-white p-7 shadow-[0_22px_60px_rgba(28,25,21,0.14)]"
              >
                <div className="mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.16em] text-[#8C8880]"><span>От: ПРАВОДОК</span><span>Только что</span></div>
                <div className="font-display mb-3 text-[17px] font-bold text-[#1C1915]">Ваш документ готов</div>
                <div className="mb-6 text-[11px] leading-relaxed text-[#8C8880]">Документ приложен к этому письму.</div>
                <div className="flex items-center gap-3 border border-[#E8E4DE] bg-[#F7F6F3] p-3">
                  <div className="flex h-10 w-8 items-center justify-center bg-white text-[8px] font-bold text-[#C62828]">DOCX</div>
                  <div className="min-w-0"><div className="truncate text-[11px] font-semibold text-[#1C1915]">{documentTitle ?? 'Документ'}</div><div className="mt-1 text-[9px] text-[#8C8880]">Вложение</div></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0.7, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="relative z-20 h-48 w-full rounded-t-[40px] border-[10px] border-[#168A4A] bg-[#10703C] shadow-[0_24px_60px_rgba(22,138,74,0.28)]"
              >
                <div className="absolute -top-6 left-1/2 h-12 w-32 -translate-x-1/2 rounded-full border-[10px] border-[#168A4A] bg-[#EFF9F2]" />
                <div className="absolute bottom-8 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-white/45" />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-3 z-30 text-[10px] uppercase tracking-[0.18em] text-white">Доставка на email</motion.div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, rotate: -3, y: 30 }} animate={{ opacity: 1, rotate: 2, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="bg-white w-full max-w-md mx-auto p-8 md:p-11 shadow-[0_30px_80px_rgba(28,25,21,0.12)]">
              <div className="w-16 h-1 bg-[#C62828] mb-12" />
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#8C8880] mb-4">Оплата не завершена</div>
              <h2 className="font-display text-[28px] font-black leading-tight text-[#1C1915] mb-5">{documentTitle ?? 'Документ'}</h2>
              <p className="text-[12px] leading-relaxed text-[#8C8880]">Повторите попытку — письмо будет отправлено только после успешной оплаты.</p>
            </motion.div>
          )}
        </aside>
      </div>
    </main>
  );
}
