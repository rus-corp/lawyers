import ContactsView from '@/views/ContactsView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () => pageMetadata('contacts', '/contacts', { title: 'Контакты — ПРАВОДОК' });

export default function ContactsPage() {
  return <ContactsView />;
}
