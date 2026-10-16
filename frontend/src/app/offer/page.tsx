import LegalView from '@/views/LegalView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () =>
  pageMetadata('offer', '/offer', {
    title: 'Пользовательское соглашение (публичная оферта) — ПРАВОДОК',
    description:
      'Пользовательское соглашение сервиса ПРАВОДОК: правила и условия предоставления и использования услуг сайта pravo-dok.ru.',
  });

export default function OfferPage() {
  return <LegalView pageId="offer" />;
}
