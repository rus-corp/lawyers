import CategoriesView from '@/views/CategoriesView';
import { pageMetadata, withNames } from '@/lib/metadata';
import { buildSearchIndex, getCatalog } from '@/lib/server-api';
import { SITE_NAME } from '@/lib/site';
import { TEMPLATES, withCount } from '@/lib/text';

const FORMAT = 'Формат DOCX, инструкция по заполнению, отправка на электронную почту.';

export async function generateMetadata() {
  const catalog = await getCatalog();
  const total = catalog.reduce((sum, category) => sum + category.documentsCount, 0);
  return pageMetadata('categories', '/categories', {
    title: `Каталог юридических документов: шаблоны и образцы | ${SITE_NAME}`,
    description:
      total > 0
        ? withNames(
            `${withCount(total, TEMPLATES)} юридических документов по разделам: `,
            catalog.map(category => category.title),
            5,
            `. ${FORMAT}`,
          )
        : `Шаблоны юридических документов по разделам права. ${FORMAT}`,
  });
}

export default async function CategoriesPage() {
  const catalog = await getCatalog();
  return (
    <CategoriesView
      categories={catalog.map(({ id, title, url, documentsCount }) => ({ id, title, url, count: documentsCount }))}
      searchIndex={buildSearchIndex(catalog)}
    />
  );
}
