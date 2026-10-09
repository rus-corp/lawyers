import LegalView from '@/views/LegalView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () => pageMetadata('politic', '/politic', { title: 'Политика конфиденциальности — ПРАВОДОК' });

export default function PoliticPage() {
  return <LegalView pageId="privacy" />;
}
