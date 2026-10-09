import type { Metadata } from 'next';
import PaymentResultView from '@/views/PaymentResultView';

export const metadata: Metadata = { title: 'Оплата прошла успешно — ПРАВОДОК', robots: { index: false, follow: false } };

export default function PaymentSuccessPage() {
  return <PaymentResultView type="success" />;
}
