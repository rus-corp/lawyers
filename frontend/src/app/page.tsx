import JsonLd from '@/components/JsonLd';
import HomeView from '@/views/HomeView';
import { pageMetadata } from '@/lib/metadata';
import { buildSearchIndex, getCatalog } from '@/lib/server-api';
import { CONTACT_EMAIL, DEFAULT_DESCRIPTION, SITE_ALT_NAME, SITE_NAME, SITE_URL } from '@/lib/site';
import type { CatalogCategory } from '@/lib/types';

export const generateMetadata = () =>
  pageMetadata('home', '/', {
    title: `Шаблоны юридических документов: иски, заявления, договоры | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  });

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: SITE_ALT_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  email: CONTACT_EMAIL,
};

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: SITE_ALT_NAME,
  url: SITE_URL,
  inLanguage: 'ru',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

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
    <>
      <JsonLd data={ORGANIZATION} />
      <JsonLd data={WEBSITE} />
      <HomeView
        categories={catalog.slice(0, 4).map(({ id, title, url, documentsCount }) => ({ id, title, url, count: documentsCount }))}
        totalDocs={totalDocs || null}
        searchIndex={buildSearchIndex(catalog)}
      />
    </>
  );
}
