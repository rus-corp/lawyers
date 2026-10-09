import LegalView from '@/views/LegalView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () => pageMetadata('payment_rules', '/payment_rules', { title: 'Условия оплаты и возврата — ПРАВОДОК' });

export default function PaymentRulesPage() {
  return <LegalView pageId="payment-terms" />;
}
