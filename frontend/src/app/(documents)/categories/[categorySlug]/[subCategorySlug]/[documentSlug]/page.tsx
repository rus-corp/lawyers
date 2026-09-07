import { notFound } from 'next/navigation';
import { getCategoryPath, siteUrl } from '@/api/category_path';
import { getPageMeta } from '@/api';
import DocPageComponent from '@/components/doc_page_component/DocPageComponent';
import Breadcrumbs from '@/components/categories/Breadcrumbs';

type Props = {params: {categorySlug: string; subCategorySlug: string; documentSlug: string}};
const pathFor = (params: Props['params']) => `${params.categorySlug}/${params.subCategorySlug}/${params.documentSlug}`;

export async function generateMetadata({params}: Props) {
  const {document} = await getCategoryPath(pathFor(params));
  if (!document) notFound();
  const meta = await getPageMeta(document.url.slice(1))
    ?? await getPageMeta(`docs/${params.documentSlug}`);
  return {
    title: meta?.title || document.title,
    description: meta?.description || `Получите документ «${document.title}» и инструкции по заполнению на электронную почту.`,
    keywords: meta?.keywords,
    alternates: {canonical: siteUrl + document.url},
  };
}

export default async function DocumentPage({params}: Props) {
  const {category, document} = await getCategoryPath(pathFor(params));
  if (!document) notFound();
  return <>
    <Breadcrumbs items={category.breadcrumbs} />
    <DocPageComponent initialData={document} />
  </>;
}
