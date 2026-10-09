import type { MetadataRoute } from 'next';
import { getNews, getSitemapPaths } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

const STATIC_PATHS = ['/', '/categories', '/about', '/news', '/contacts', '/offer', '/politic', '/payment_rules'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalogPaths, news] = await Promise.all([getSitemapPaths(), getNews().catch(() => [])]);
  const paths = [...STATIC_PATHS, ...catalogPaths, ...news.map(item => `/news/${item.slug}`)];
  return Array.from(new Set(paths)).map(path => ({ url: SITE_URL + path }));
}
