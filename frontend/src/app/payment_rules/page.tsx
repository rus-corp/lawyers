import LegalView from '@/views/LegalView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () =>
  pageMetadata('payment_rules', '/payment_rules', {
    title: 'Условия оплаты и возврата — ПРАВОДОК',
    description:
      'Условия оплаты и возврата на сайте pravo-dok.ru: оплата банковской картой через ЮKassa, возврат средств и отмена заказа.',
  });

export default function PaymentRulesPage() {
  return <LegalView pageId="payment-terms" />;
}
