import { Suspense } from 'react';
import PaymentPageClient from './PaymentPageClient';

export default function PaymentPage() {
  return (
    <Suspense fallback={<p>Загрузка...</p>}>
      <PaymentPageClient />
    </Suspense>
  );
}