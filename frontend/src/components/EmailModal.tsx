'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EMAIL_PATTERN, PAGES, withCount } from '@/lib/text';

interface Props {
  documentTitle: string;
  pages?: number | null;
  paymentsEnabled: boolean;
  onClose: () => void;
  // Resolves with a confirmation message when the document was sent right away.
  onSubmit: (email: string) => Promise<string | void>;
}

export default function EmailModal({ documentTitle, pages, paymentsEnabled, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pending, setPending] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const matches = Boolean(emailConfirm) && email.trim().toLowerCase() === emailConfirm.trim().toLowerCase();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setEmailError('Введите корректный адрес электронной почты');
      return;
    }
    if (!matches) {
      setEmailError('Адреса не совпадают — проверьте ввод');
      return;
    }
    setPending(true);
    setEmailError('');
    try {
      const message = await onSubmit(value);
      if (message) setSentMessage(message);
    } catch {
      setEmailError('Не удалось отправить запрос. Проверьте почту и попробуйте ещё раз.');
    } finally {
      setPending(false);
    }
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Закрыть окно"
        className="absolute inset-0 bg-[#1C1915]/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-title"
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[94dvh] w-full max-w-[560px] overflow-y-auto bg-white shadow-[0_32px_100px_rgba(28,25,21,0.24)]"
      >
        <div className={`h-1 ${sentMessage ? 'bg-[#168A4A]' : 'bg-[#C62828]'}`} />
        <div className="p-6 sm:p-8 md:p-12">
          <div className="flex items-start justify-between gap-8 mb-10">
            <div>
              <div className={`font-display text-[10px] tracking-[0.24em] uppercase mb-3 ${sentMessage ? 'text-[#168A4A]' : 'text-[#C62828]'}`}>
                {sentMessage ? 'Письмо отправлено' : paymentsEnabled ? 'Шаг 01 / 02' : 'Доставка документа'}
              </div>
              <h2 id="email-title" className="font-display text-[32px] md:text-[42px] font-black leading-[0.98] text-[#1C1915]">
                {sentMessage ? 'Проверьте почтовый ящик' : 'Куда отправить документ?'}
              </h2>
            </div>
            <button
              type="button"
              data-cursor="pointer"
              aria-label="Закрыть"
              onClick={onClose}
              className="shrink-0 w-10 h-10 rounded-full border border-[#E8E4DE] text-[#8C8880] hover:text-[#C62828] hover:border-[#C62828] transition-colors"
            >
              ×
            </button>
          </div>

          {sentMessage ? (
            <div role="status">
              <p className="mb-3 text-[15px] leading-7 text-[#6A6662]">{sentMessage}</p>
              <p className="mb-7 text-[15px] leading-7 text-[#6A6662]">
                Письмо придёт на <span className="font-semibold text-[#1C1915]">{email.trim()}</span>. Ссылки для скачивания
                не будет — документ приложен к письму. Если письма нет, проверьте папку «Спам».
              </p>
              <button
                type="button"
                data-cursor="pointer"
                onClick={onClose}
                className="w-full flex items-center justify-between bg-[#168A4A] text-white px-6 py-5 hover:bg-[#10703C] transition-colors"
              >
                <span className="font-display text-[12px] tracking-[0.16em] uppercase font-semibold">Понятно</span>
                <span className="text-[15px]">✓</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="delivery-email" className="font-display block text-[11px] tracking-[0.16em] uppercase text-[#8C8880] mb-3">
                Электронная почта
              </label>
              <div className={`flex items-center border-b-2 ${emailError ? 'border-[#C62828]' : 'border-[#1C1915]'} mb-2`}>
                <input
                  id="delivery-email"
                  autoFocus
                  type="email"
                  autoComplete="email"
                  disabled={pending}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError('');
                  }}
                  placeholder="name@example.ru"
                  className="font-body w-full bg-transparent py-4 text-[20px] text-[#1C1915] outline-none placeholder:text-[#C8C4BE]"
                />
                <span className="text-[#1B4FD8] text-[18px]" aria-hidden="true">↗</span>
              </div>
              <label htmlFor="delivery-email-confirm" className="font-display mt-5 block text-[11px] tracking-[0.16em] uppercase text-[#8C8880] mb-3">
                Повторите электронную почту
              </label>
              <div className={`flex items-center border-b-2 ${emailError ? 'border-[#C62828]' : matches ? 'border-[#1B4FD8]' : 'border-[#1C1915]'} mb-2`}>
                <input
                  id="delivery-email-confirm"
                  type="email"
                  disabled={pending}
                  value={emailConfirm}
                  onChange={(event) => {
                    setEmailConfirm(event.target.value);
                    setEmailError('');
                  }}
                  onPaste={(event) => event.preventDefault()}
                  autoComplete="off"
                  placeholder="Введите адрес ещё раз"
                  className="font-body w-full bg-transparent py-4 text-[20px] text-[#1C1915] outline-none placeholder:text-[#C8C4BE]"
                />
                {matches && <span className="text-[#1B4FD8] text-[18px]" aria-hidden="true">✓</span>}
              </div>
              <div role="alert" className="min-h-6 text-[11px] text-[#C62828]">{emailError}</div>

              <div className="my-7 p-4 bg-[#F7F6F3] flex gap-4">
                <div className="w-9 h-11 bg-white border border-[#E8E4DE] shrink-0 flex items-center justify-center text-[#C62828] text-[10px] font-bold">DOCX</div>
                <div className="min-w-0">
                  <div className="font-display text-[12px] font-semibold text-[#1C1915] truncate">{documentTitle}</div>
                  <div className="text-[11px] text-[#8C8880] mt-1">
                    {pages ? `${withCount(pages, PAGES)} · файл придёт вложением в письме` : 'Файл придёт вложением в письме'}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                data-cursor="pointer"
                className="w-full flex items-center justify-between bg-[#1B4FD8] text-white px-6 py-5 hover:bg-[#1438B0] disabled:opacity-60 transition-colors"
              >
                <span className="font-display text-[12px] tracking-[0.16em] uppercase font-semibold">
                  {pending ? 'Отправляем…' : paymentsEnabled ? 'Перейти к оплате' : 'Отправить документ'}
                </span>
                <span className="text-[15px]">{pending ? '···' : '→'}</span>
              </button>
              <p className="text-[10px] text-[#8C8880] leading-relaxed mt-4 text-center">
                Указывая email, вы соглашаетесь с{' '}
                <Link href="/politic" target="_blank" className="underline underline-offset-2 hover:text-[#C62828]">
                  политикой обработки персональных данных
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
