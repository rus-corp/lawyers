import type { MetadataRoute } from 'next';
import { getNews, getSitemapEntries } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

const STATIC_PATHS = ['/', '/categories', '/about', '/contacts', '/offer', '/politic', '/payment_rules'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, news] = await Promise.all([getSitemapEntries(), getNews().catch(() => [])]);
  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map(path => ({ url: SITE_URL + path })),
    ...catalog.map(({ url, lastmod }) => ({ url: SITE_URL + url, ...(lastmod ? { lastModified: lastmod } : {}) })),
  ];
  // The articles section is listed only once it has something in it.
  if (news.length > 0) {
    const latest = news.map(item => item.created_at).sort().at(-1);
    entries.push({ url: `${SITE_URL}/news`, lastModified: latest });
    entries.push(...news.map(item => ({ url: `${SITE_URL}/news/${item.slug}`, lastModified: item.created_at })));
  }
  const seen = new Set<string>();
  return entries.filter(entry => !seen.has(entry.url) && seen.add(entry.url));
}
