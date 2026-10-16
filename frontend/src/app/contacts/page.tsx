import ContactsView from '@/views/ContactsView';
import { pageMetadata } from '@/lib/metadata';

export const generateMetadata = () =>
  pageMetadata('contacts', '/contacts', {
    title: 'Контакты — ПРАВОДОК',
    description: 'Напишите нам на info@pravo-dok.ru или оставьте заявку на сайте — юрист свяжется с вами в ближайшее время.',
  });

export default function ContactsPage() {
  return <ContactsView />;
}
