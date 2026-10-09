import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import CategoryDetailView from '@/views/CategoryDetailView';
import { pageMetadata } from '@/lib/metadata';
import {
  getCategoryDocuments,
  getCategoryPath,
  getChildren,
  getPaymentsEnabled,
  getRootCategories,
} from '@/lib/server-api';
import { pad2 } from '@/lib/text';

type Props = { params: Promise<{ categorySlug: string }> };

const ACCENTS = ['#C62828', '#1B4FD8'];

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug);
  return pageMetadata(category.url.slice(1), category.url, { title: category.title, description: category.description });
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug);
  const [roots, sections, documents, paymentsEnabled] = await Promise.all([
    getRootCategories(),
    getChildren(category.slug),
    getCategoryDocuments(category.slug),
    getPaymentsEnabled(),
  ]);
  const index = Math.max(0, roots.findIndex(root => root.id === category.id));

  return (
    <>
      <BreadcrumbsJsonLd items={category.breadcrumbs} />
      <CategoryDetailView
        title={category.title}
        number={pad2(index + 1)}
        accent={ACCENTS[index % ACCENTS.length]}
        description={category.description}
        total={documents.length}
        sections={sections.map(({ id, title, url, description }) => ({
          id,
          title,
          url,
          description: description ?? '',
          count: documents.filter(document => document.section?.url === url).length,
        }))}
        documents={documents.map(({ id, title, url, description, tags, pages, price, section }) => ({
          id,
          title,
          url,
          description,
          tags,
          pages,
          sectionTitle: section?.title ?? '',
          // Prices are shown only while paid delivery is switched on.
          price: paymentsEnabled && price > 0 ? price : null,
        }))}
      />
    </>
  );
}
