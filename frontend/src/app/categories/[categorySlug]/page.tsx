import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import CategoryDetailView from '@/views/CategoryDetailView';
import { pageMetadata } from '@/lib/metadata';
import { getCategoryPath, getChildren, getRootCategories, hasDocument } from '@/lib/server-api';
import { pad2 } from '@/lib/text';

type Props = { params: Promise<{ categorySlug: string }> };

const ACCENTS = ['#C62828', '#1B4FD8'];

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug);
  return pageMetadata(category.url.slice(1), category.url, { title: category.title });
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const { category } = await getCategoryPath(categorySlug);
  const [roots, sections] = await Promise.all([getRootCategories(), getChildren(category.slug)]);
  const documentLists = await Promise.all(
    sections.map(async section => (await getChildren(section.slug)).filter(hasDocument)),
  );
  const index = Math.max(0, roots.findIndex(root => root.id === category.id));
  const documents = sections.flatMap((section, sectionIndex) =>
    documentLists[sectionIndex].map(({ id, title, url }) => ({ id, title, url, sectionTitle: section.title })),
  );

  return (
    <>
      <BreadcrumbsJsonLd items={category.breadcrumbs} />
      <CategoryDetailView
        title={category.title}
        number={pad2(index + 1)}
        accent={ACCENTS[index % ACCENTS.length]}
        total={documents.length}
        sections={sections.map(({ id, title, url }, sectionIndex) => ({
          id,
          title,
          url,
          count: documentLists[sectionIndex].length,
        }))}
        documents={documents}
      />
    </>
  );
}
