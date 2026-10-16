import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // Payment pages stay crawlable on purpose: their `noindex` tag only works if a robot can read it.
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
