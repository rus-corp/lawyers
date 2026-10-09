import LegalView from '@/views/LegalView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () =>
  pageMetadata('politic', '/politic', {
    title: 'Политика конфиденциальности — ПРАВОДОК',
    description:
      'Политика конфиденциальности сервиса ПРАВОДОК: какие персональные данные собирает сайт pravo-dok.ru и как они обрабатываются.',
  });

export default function PoliticPage() {
  return <LegalView pageId="privacy" />;
}
