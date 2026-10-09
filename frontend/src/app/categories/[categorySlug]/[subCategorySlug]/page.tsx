import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import SectionDetailView from '@/views/SectionDetailView';
import { pageMetadata, seoTitle, withNames } from '@/lib/metadata';
import { getCategoryDocuments, getCategoryPath, getPaymentsEnabled } from '@/lib/server-api';
import { TEMPLATES, withCount } from '@/lib/text';

type Props = { params: Promise<{ categorySlug: string; subCategorySlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { categorySlug, subCategorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug, subCategorySlug);
  const documents = await getCategoryDocuments(category.slug);
  return pageMetadata(category.url.slice(1), category.url, {
    // Differs from the title of the document that often carries the same name as its subsection.
    title: seoTitle(category.title, 'образцы документов'),
    description:
      category.description ||
      withNames(
        documents.length > 0 ? `${category.title}: ${withCount(documents.length, TEMPLATES)} — ` : `${category.title}: шаблоны документов`,
        documents.map(document => document.title),
        2,
        '. Формат DOCX, инструкция по заполнению, отправка на электронную почту.',
      ),
  });
}

export default async function SubCategoryPage({ params }: Props) {
  const { categorySlug, subCategorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug, subCategorySlug);
  const [documents, paymentsEnabled] = await Promise.all([getCategoryDocuments(category.slug), getPaymentsEnabled()]);
  const parent = category.breadcrumbs[0];

  return (
    <>
      <BreadcrumbsJsonLd items={category.breadcrumbs} />
      <SectionDetailView
        title={category.title}
        description={category.description}
        categoryTitle={parent?.title ?? 'Документы'}
        categoryUrl={parent?.url ?? '/categories'}
        documents={documents.map(({ id, title, url, description, pages, price }) => ({
          id,
          title,
          url,
          description,
          pages,
          // Prices are shown only while paid delivery is switched on.
          price: paymentsEnabled && price > 0 ? price : null,
        }))}
      />
    </>
  );
}
