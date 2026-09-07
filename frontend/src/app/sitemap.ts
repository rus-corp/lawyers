import type { MetadataRoute } from 'next';
import { backendUrl } from '@/api/_variables';
import { siteUrl } from '@/api/category_path';

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await backendUrl.get<{url: string}[]>('categories/sitemap/');
  const paths = ['/', '/categories', '/about', '/contacts', '/offer', '/politic',
    ...response.data.map(item => item.url)];
  return Array.from(new Set(paths)).map(path => ({url: siteUrl + path}));
}
