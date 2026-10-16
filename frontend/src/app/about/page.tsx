import AboutView from '@/views/AboutView';
import { pageMetadata } from '@/lib/metadata';
import { getCatalog } from '@/lib/server-api';
import type { CatalogCategory } from '@/lib/types';

export const generateMetadata = () =>
  pageMetadata('about', '/about', {
    title: 'О сервисе ПРАВОДОК — шаблоны юридических документов',
    description:
      'ПРАВОДОК — онлайн-сервис для тех, кто хочет грамотно и самостоятельно решать юридические вопросы: готовые шаблоны документов и понятные инструкции.',
  });

export default async function AboutPage() {
  let catalog: CatalogCategory[] = [];
  try {
    catalog = await getCatalog();
  } catch (error) {
    console.error('Catalog is unavailable', error);
  }
  const totalDocs = catalog.reduce((sum, category) => sum + category.documentsCount, 0);
  const sectionsCount = catalog.reduce((sum, category) => sum + category.sections.length, 0);
  return <AboutView totalDocs={totalDocs || null} sectionsCount={sectionsCount || null} />;
}
