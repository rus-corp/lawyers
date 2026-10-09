'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { sendFeedback } from '@/lib/api';
import { EMAIL_PATTERN } from '@/lib/text';
import type { FeedbackPayload } from '@/lib/types';

const EMPTY: FeedbackPayload = { name: '', email: '', phone: '', text: '' };

const FIELDS: { name: keyof FeedbackPayload; label: string; type: string; maxLength: number; autoComplete: string }[] = [
  { name: 'name', label: 'Ваше имя', type: 'text', maxLength: 150, autoComplete: 'name' },
  { name: 'email', label: 'Почта', type: 'email', maxLength: 155, autoComplete: 'email' },
  { name: 'phone', label: 'Телефон', type: 'tel', maxLength: 50, autoComplete: 'tel' },
];

const INPUT =
  'font-body w-full border-b border-[#C8C4BE] bg-transparent py-3 text-[16px] text-[#1C1915] outline-none transition-colors placeholder:text-[#C8C4BE] focus:border-[#1B4FD8]';
const LABEL = 'font-display mb-2 block text-[10px] uppercase tracking-[0.14em] text-[#8C8880]';

export default function FeedbackForm() {
  const [form, setForm] = useState<FeedbackPayload>(EMPTY);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const update = (name: keyof FeedbackPayload, value: string) => {
    setForm(previous => ({ ...previous, [name]: value }));
    setError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;
    const payload = { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), text: form.text.trim() };
    if (!payload.name || !payload.phone || !payload.text) {
      setError('Заполните все поля формы');
      return;
    }
    if (!EMAIL_PATTERN.test(payload.email)) {
      setError('Введите корректный адрес электронной почты');
      return;
    }
    if (!agreed) {
      setError('Пожалуйста, согласитесь с политикой конфиденциальности');
      return;
    }
    setStatus('sending');
    try {
      await sendFeedback(payload);
      setForm(EMPTY);
      setAgreed(false);
      setStatus('sent');
    } catch {
      setStatus('idle');
      setError('Не удалось отправить заявку. Попробуйте ещё раз.');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="border border-[#E8E4DE] bg-white p-7 shadow-[0_20px_70px_rgba(28,25,21,0.06)] md:p-9">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#168A4A] text-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display mb-3 text-[26px] font-black leading-tight text-[#1C1915]">Заявка отправлена</h3>
        <p className="mb-6 text-[14px] leading-7 text-[#6A6662]">Наш юрист свяжется с вами в ближайшее время.</p>
        <button
          type="button"
          data-cursor="pointer"
          onClick={() => setStatus('idle')}
          className="text-[11px] uppercase tracking-[0.16em] text-[#1B4FD8] underline-offset-4 hover:underline"
        >
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-[#E8E4DE] bg-white p-6 shadow-[0_20px_70px_rgba(28,25,21,0.06)] md:p-9">
      <div className="grid gap-7 sm:grid-cols-2">
        {FIELDS.map(({ name, label, type, maxLength, autoComplete }) => (
          <div key={name} className={name === 'name' ? 'sm:col-span-2' : ''}>
            <label htmlFor={`feedback-${name}`} className={LABEL}>
              {label}
            </label>
            <input
              id={`feedback-${name}`}
              type={type}
              value={form[name]}
              maxLength={maxLength}
              autoComplete={autoComplete}
              onChange={event => update(name, event.target.value)}
              className={INPUT}
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="feedback-text" className={LABEL}>
            Сообщение
          </label>
          <textarea
            id="feedback-text"
            rows={4}
            value={form.text}
            maxLength={1000}
            onChange={event => update('text', event.target.value)}
            className={`${INPUT} resize-y`}
          />
        </div>
      </div>

      <label className="mt-7 flex items-start gap-3 text-[12px] leading-relaxed text-[#6A6662]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={event => {
            setAgreed(event.target.checked);
            setError('');
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#1B4FD8]"
        />
        <span>
          Нажимая «Отправить», вы соглашаетесь с{' '}
          <Link href="/politic" className="underline underline-offset-2 hover:text-[#C62828]">
            Политикой конфиденциальности
          </Link>
        </span>
      </label>

      <div role="alert" className="min-h-8 pt-3 text-[11px] text-[#C62828]">
        {error}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        data-cursor="pointer"
        className="mt-2 flex w-full items-center justify-between bg-[#1B4FD8] px-6 py-5 text-white transition-colors hover:bg-[#1438B0] disabled:opacity-60"
      >
        <span className="font-display text-[12px] font-semibold uppercase tracking-[0.16em]">
          {status === 'sending' ? 'Отправляем…' : 'Отправить'}
        </span>
        <span>{status === 'sending' ? '···' : '→'}</span>
      </button>
    </form>
  );
}
