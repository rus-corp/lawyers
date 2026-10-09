import type { Metadata } from 'next';
import { getPageMeta } from './server-api';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SHARE_IMAGE, SITE_NAME, SITE_URL } from './site';
import type { PageMeta } from './types';

const TITLE_LIMIT = 70;

// Adds the suffix and the site name while the result still fits a search snippet.
export function seoTitle(title: string, suffix?: string): string {
  const variants = [suffix ? `${title} — ${suffix} | ${SITE_NAME}` : '', `${title} | ${SITE_NAME}`];
  return variants.find(variant => variant && variant.length <= TITLE_LIMIT) ?? title;
}

// "A, B и другие" for a handful of names.
function listNames(names: string[], max: number): string {
  const shown = names.slice(0, max).join(', ');
  return names.length > max ? `${shown} и другие` : shown;
}

// A sentence with a list of names in the middle. Names are dropped from the list until the
// sentence fits; if not even one fits, the list is left out, so the ending is never cut off.
export function withNames(before: string, names: string[], max: number, after: string, limit = 200): string {
  for (let count = Math.min(max, names.length); count >= 1; count--) {
    const text = `${before}${listNames(names, count)}${after}`;
    if (text.length <= limit) return text;
  }
  return `${before.replace(/[\s:—–-]+$/, '')}${after}`;
}

interface Fallback {
  title?: string;
  description?: string;
}

interface Options {
  // ISO date of publication; marks the page as an article
  publishedTime?: string;
  noindex?: boolean;
}

// A nested `openGraph` replaces the one from the root layout as a whole,
// so every page gets the complete set of tags here.
export function buildMetadata(
  meta: PageMeta | null,
  canonicalPath: string,
  fallback: Fallback = {},
  options: Options = {},
): Metadata {
  const title = meta?.title || fallback.title || DEFAULT_TITLE;
  const description = meta?.description || fallback.description || DEFAULT_DESCRIPTION;
  const url = SITE_URL + canonicalPath;
  const share = { title, description, url, siteName: SITE_NAME, locale: 'ru_RU', images: [SHARE_IMAGE] };

  return {
    title,
    description,
    ...(meta?.keywords ? { keywords: meta.keywords } : {}),
    alternates: { canonical: url },
    openGraph: options.publishedTime
      ? { ...share, type: 'article', publishedTime: options.publishedTime }
      : { ...share, type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE.url] },
    ...(options.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

// Titles and descriptions come from the "Мета Теги" records in the admin panel when present.
export async function pageMetadata(
  key: string,
  canonicalPath: string,
  fallback: Fallback = {},
  options: Options = {},
): Promise<Metadata> {
  return buildMetadata(await getPageMeta(key), canonicalPath, fallback, options);
}
