import HomeView from '@/views/HomeView';
import { pageMetadata } from '@/lib/metadata';
import { buildSearchIndex, getCatalog } from '@/lib/server-api';
import type { CatalogCategory } from '@/lib/types';

export const generateMetadata = () => pageMetadata('home', '/');

export default async function Home() {
  // The landing page still renders when the catalog is unavailable.
  let catalog: CatalogCategory[] = [];
  try {
    catalog = await getCatalog();
  } catch (error) {
    console.error('Catalog is unavailable', error);
  }
  const totalDocs = catalog.reduce((sum, category) => sum + category.documentsCount, 0);

  return (
    <HomeView
      categories={catalog.slice(0, 4).map(({ id, title, url, documentsCount }) => ({ id, title, url, count: documentsCount }))}
      totalDocs={totalDocs || null}
      searchIndex={buildSearchIndex(catalog)}
    />
  );
}
