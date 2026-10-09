import CategoriesView from '@/views/CategoriesView';
import { pageMetadata } from '@/lib/metadata';
import { buildSearchIndex, getCatalog } from '@/lib/server-api';

export const generateMetadata = () => pageMetadata('categories', '/categories', { title: 'Документы' });

export default async function CategoriesPage() {
  const catalog = await getCatalog();
  return (
    <CategoriesView
      categories={catalog.map(({ id, title, url, documentsCount }) => ({ id, title, url, count: documentsCount }))}
      searchIndex={buildSearchIndex(catalog)}
    />
  );
}
