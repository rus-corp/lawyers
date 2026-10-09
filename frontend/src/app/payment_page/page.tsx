import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentView from '@/views/PaymentView';

export const metadata: Metadata = { title: 'Оплата заказа — ПРАВОДОК', robots: { index: false, follow: false } };

export default function PaymentPage() {
  return (
    <Suspense fallback={<p className="px-6 py-24 text-center text-[15px] text-[#8C8880]">Загрузка…</p>}>
      <PaymentView />
    </Suspense>
  );
}
