import { getCategoryPath, siteUrl } from '@/api/category_path';
import { getPageMeta } from '@/api';

type Props = {params: {categorySlug: string}};
export async function generateMetadata({params}: Props) {
  const {category} = await getCategoryPath(params.categorySlug);
  const meta = await getPageMeta(category.url.slice(1));
  return {title: meta?.title || category.title, description: meta?.description,
    keywords: meta?.keywords, alternates: {canonical: siteUrl + category.url}};
}
export default async function CategoryPage({params}: Props) {
  const {category} = await getCategoryPath(params.categorySlug);
  return null;
}
