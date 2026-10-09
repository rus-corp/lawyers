'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import PaymentResultView from './PaymentResultView';
import { createOrder, fetchPaymentsEnabled } from '@/lib/api';
import { formatPrice } from '@/lib/text';

type State = { kind: 'loading' } | { kind: 'redirect' } | { kind: 'info'; text: string } | { kind: 'error' };

const FREE_MESSAGE =
  'Документы доступны бесплатно. Откройте страницу документа и нажмите «Получить по электронной почте».';
const SENT_MESSAGE = 'Документ будет отправлен на указанную почту в течение нескольких минут.';

export default function PaymentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get('amount'));
  const documentId = searchParams.get('documentId');
  const userEmail = searchParams.get('userEmail');
  const title = searchParams.get('title') || 'Документ';
  const missing = !documentId || !userEmail || !Number.isFinite(amount) || amount <= 0;

  const [state, setState] = useState<State>({ kind: 'loading' });
  const sent = useRef(false);

  const createPayment = useCallback(async () => {
    if (!documentId || !userEmail) return;
    try {
      if (!(await fetchPaymentsEnabled())) {
        setState({ kind: 'info', text: FREE_MESSAGE });
        return;
      }
      const response = await createOrder({ price: amount, description: documentId, user_email: userEmail });
      const confirmationUrl = response.data?.confirmation_token;
      if (response.status === 201 && confirmationUrl && /^https:\/\//.test(confirmationUrl)) {
        setState({ kind: 'redirect' });
        window.location.href = confirmationUrl;
      } else if (response.status === 202) {
        setState({ kind: 'info', text: response.data?.message || SENT_MESSAGE });
      } else {
        setState({ kind: 'error' });
      }
    } catch {
      setState({ kind: 'error' });
    }
  }, [amount, documentId, userEmail]);

  useEffect(() => {
    // The ref keeps a re-run of the effect from creating a second order.
    if (missing || sent.current) return;
    sent.current = true;
    void createPayment();
  }, [missing, createPayment]);

  if (state.kind === 'error') {
    return (
      <PaymentResultView
        type="error"
        documentTitle={title}
        onRetry={() => {
          setState({ kind: 'loading' });
          void createPayment();
        }}
      />
    );
  }

  const waiting = !missing && (state.kind === 'loading' || state.kind === 'redirect');
  const message = missing
    ? 'Откройте страницу документа, чтобы запросить его на почту.'
    : state.kind === 'info'
      ? state.text
      : state.kind === 'redirect'
        ? 'Переходим на защищённую платёжную страницу ЮKassa…'
        : 'Создаём заказ…';

  return (
    <motion.main className="min-h-screen bg-[#F7F6F3]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="h-20 px-6 md:px-14 flex items-center justify-between border-b border-[#E8E4DE] bg-white/80 backdrop-blur-xl">
        <button type="button" data-cursor="pointer" onClick={() => router.back()} className="text-[11px] tracking-[0.16em] uppercase text-[#8C8880] hover:text-[#C62828] transition-colors">← Назад</button>
        <Logo variant="flat" className="text-[14px] text-[#1C1915]" />
        <div className="hidden text-[10px] tracking-[0.14em] uppercase text-[#8C8880] sm:block">Защищённая оплата</div>
      </header>

      <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-12 md:py-20 grid lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-16 items-start">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-8 rounded-full bg-[#1B4FD8] text-white text-[11px] flex items-center justify-center">02</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C8880]">Оплата заказа</span>
          </div>
          <h1 className="font-display text-[40px] sm:text-[48px] md:text-[72px] font-black leading-[0.92] tracking-[-0.045em] text-[#1C1915] mb-5">
            {waiting ? 'Остался один шаг' : missing ? 'Заказ не выбран' : 'Оплата не требуется'}
          </h1>
          {waiting && (
            <p className="text-[15px] text-[#8C8880] leading-relaxed max-w-md mb-12">
              После оплаты документ автоматически отправится на <span className="text-[#1C1915] font-semibold break-all">{userEmail}</span>
            </p>
          )}

          <div className="bg-white border border-[#E8E4DE] p-6 md:p-9 shadow-[0_20px_70px_rgba(28,25,21,0.06)]">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-[#1C1915]">Банковская карта</span>
              <div className="flex gap-2">
                <span className="border border-[#E8E4DE] px-2 py-1 text-[9px] font-bold text-[#1B4FD8]">МИР</span>
                <span className="border border-[#E8E4DE] px-2 py-1 text-[9px] font-bold text-[#1C1915]">VISA</span>
              </div>
            </div>

            <div role="status" className="flex items-center gap-4 border-t border-[#E8E4DE] pt-7">
              {waiting && (
                <span className="spinner h-6 w-6 shrink-0 rounded-full border-2 border-[#E8E4DE] border-t-[#1B4FD8]" aria-hidden="true" />
              )}
              <p className="text-[15px] leading-relaxed text-[#1C1915]">{message}</p>
            </div>

            {waiting ? (
              <p className="mt-6 text-[11px] leading-relaxed text-[#8C8880]">
                Данные карты вводятся на стороне ЮKassa — мы их не видим и не храним.
              </p>
            ) : (
              <Link
                href="/categories"
                data-cursor="pointer"
                className="mt-8 flex w-full items-center justify-between bg-[#1B4FD8] px-6 py-5 text-white transition-colors hover:bg-[#1438B0]"
              >
                <span className="font-display text-[12px] tracking-[0.16em] uppercase font-semibold">Перейти в каталог</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </motion.section>

        {waiting && (
          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="lg:sticky lg:top-32">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#2864E8] via-[#1B4FD8] to-[#12348F] p-7 text-white shadow-[0_24px_70px_rgba(27,79,216,0.24)] md:p-10">
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-white/20" />
              <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-white/[0.06]" />
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/65 mb-10">Ваш заказ</div>
              <div className="w-12 h-16 bg-white mb-7 p-2" aria-hidden="true">
                <div className="h-0.5 bg-[#C62828] mb-2" />
                <div className="space-y-1"><div className="h-px bg-[#E8E4DE]" /><div className="h-px bg-[#E8E4DE]" /><div className="h-px w-2/3 bg-[#E8E4DE]" /></div>
              </div>
              <h2 className="font-display text-[25px] font-bold leading-tight mb-3 break-words">{title}</h2>
              <p className="text-[12px] text-white/65 leading-relaxed mb-8">DOCX · доставка вложением на email</p>
              <div className="border-t border-white/25 pt-6 flex items-end justify-between">
                <span className="text-[10px] tracking-[0.16em] uppercase text-white/65">Итого</span>
                <span className="font-display text-[35px] font-black">{formatPrice(amount)}</span>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </motion.main>
  );
}
