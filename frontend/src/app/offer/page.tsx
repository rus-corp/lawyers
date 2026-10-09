import LegalView from '@/views/LegalView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () => pageMetadata('offer', '/offer', { title: 'Пользовательское соглашение (публичная оферта) — ПРАВОДОК' });

export default function OfferPage() {
  return <LegalView pageId="offer" />;
}
