import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import SectionDetailView from '@/views/SectionDetailView';
import { pageMetadata } from '@/lib/metadata';
import { getCategoryPath, getChildren, getDocumentPrices, getPaymentsEnabled, hasDocument } from '@/lib/server-api';

type Props = { params: Promise<{ categorySlug: string; subCategorySlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { categorySlug, subCategorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug, subCategorySlug);
  return pageMetadata(category.url.slice(1), category.url, { title: category.title });
}

export default async function SubCategoryPage({ params }: Props) {
  const { categorySlug, subCategorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug, subCategorySlug);
  const [children, paymentsEnabled] = await Promise.all([getChildren(category.slug), getPaymentsEnabled()]);
  const documents = children.filter(hasDocument);
  // Prices are shown only while paid delivery is switched on.
  const prices = paymentsEnabled ? await getDocumentPrices(documents.map(item => item.url)) : new Map<string, number>();
  const parent = category.breadcrumbs[0];

  return (
    <>
      <BreadcrumbsJsonLd items={category.breadcrumbs} />
      <SectionDetailView
        title={category.title}
        categoryTitle={parent?.title ?? 'Документы'}
        categoryUrl={parent?.url ?? '/categories'}
        documents={documents.map(({ id, title, url }) => ({ id, title, url, price: prices.get(url) ?? null }))}
      />
    </>
  );
}
