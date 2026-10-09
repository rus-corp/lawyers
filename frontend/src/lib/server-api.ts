import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ApiError, apiGet } from './api';
import type {
  CatalogCategory,
  Category,
  CategoryDocument,
  CategoryPathData,
  DocumentInstruction,
  DocumentItem,
  DocumentSidebar,
  NewsItem,
  PageMeta,
  SearchItem,
} from './types';

const TTL = 60_000;
const CONFIG_TTL = 15_000;
const TIMEOUT = 10_000;
const MAX_ENTRIES = 2000;
const CONCURRENCY = 6;

type Entry = { expires: number; value: Promise<unknown> };
const store = new Map<string, Entry>();

// Pages render on every request, so GET responses are kept in memory for a short time.
function cachedGet<T>(path: string, ttl = TTL): Promise<T | null> {
  const now = Date.now();
  const hit = store.get(path);
  if (hit && hit.expires > now) return hit.value as Promise<T | null>;
  if (store.size >= MAX_ENTRIES) store.clear();
  const value = apiGet<T>(path, { signal: AbortSignal.timeout(TIMEOUT) });
  store.set(path, { expires: now + ttl, value });
  value.catch(() => {
    if (store.get(path)?.value === value) store.delete(path);
  });
  return value;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export function decodeSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const encodePath = (segments: string[]) => segments.map(s => encodeURIComponent(decodeSegment(s))).join('/');

const isNotFound = (error: unknown) => error instanceof ApiError && error.status === 404;

export async function getRootCategories(): Promise<Category[]> {
  return (await cachedGet<Category[]>('categories/')) ?? [];
}

export async function getChildren(slug: string): Promise<Category[]> {
  return (await cachedGet<Category[]>(`categories/${encodeURIComponent(slug)}/`)) ?? [];
}

// Every document of a category or subsection, with price, section and details, in one request.
export async function getCategoryDocuments(slug: string): Promise<CategoryDocument[]> {
  return (await cachedGet<CategoryDocument[]>(`categories/${encodeURIComponent(slug)}/documents/`)) ?? [];
}

export const getCategoryPath = cache(async (...segments: string[]): Promise<CategoryPathData> => {
  try {
    const data = await cachedGet<CategoryPathData>(`categories/path/${encodePath(segments)}/`);
    if (!data) notFound();
    return data;
  } catch (error) {
    if (isNotFound(error)) notFound();
    throw error;
  }
});

export async function getDocumentBySlug(slug: string): Promise<DocumentItem | null> {
  try {
    return await cachedGet<DocumentItem>(`categories/documents/${encodeURIComponent(decodeSegment(slug))}/`);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

async function optional<T>(path: string, ttl = TTL): Promise<T | null> {
  try {
    return await cachedGet<T>(path, ttl);
  } catch (error) {
    if (!isNotFound(error)) console.error(`Request failed: ${path}`, error);
    return null;
  }
}

export const getDocumentSidebar = (slug: string) =>
  optional<DocumentSidebar>(`static-components/sidebar/${encodeURIComponent(slug)}/`);

export const getDocumentInstruction = (slug: string) =>
  optional<DocumentInstruction>(`static-components/instruction/${encodeURIComponent(slug)}/`);

const metaStore = new Map<string, { expires: number; value: PageMeta | null }>();

export const getPageMeta = cache(async (pagePath: string): Promise<PageMeta | null> => {
  const now = Date.now();
  const hit = metaStore.get(pagePath);
  if (hit && hit.expires > now) return hit.value;
  try {
    const value = await apiGet<PageMeta>(`meta/${encodePath(pagePath.split('/'))}/`, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (metaStore.size >= MAX_ENTRIES) metaStore.clear();
    metaStore.set(pagePath, { expires: now + TTL, value });
    return value;
  } catch (error) {
    // A missing record is the normal case and is remembered too.
    if (isNotFound(error)) {
      if (metaStore.size >= MAX_ENTRIES) metaStore.clear();
      metaStore.set(pagePath, { expires: now + TTL, value: null });
    } else {
      console.error(`Request failed: meta/${pagePath}`, error);
    }
    return null;
  }
});

export async function getNews(): Promise<NewsItem[]> {
  return (await cachedGet<NewsItem[]>('news/')) ?? [];
}

export const getNewsItem = cache(async (slug: string): Promise<NewsItem> => {
  try {
    const item = await cachedGet<NewsItem>(`news/${encodeURIComponent(decodeSegment(slug))}/`);
    if (!item) notFound();
    return item;
  } catch (error) {
    if (isNotFound(error)) notFound();
    throw error;
  }
});

export async function getPaymentsEnabled(): Promise<boolean> {
  const data = await optional<{ payments_enabled: boolean }>('orders/config/', CONFIG_TTL);
  return Boolean(data?.payments_enabled);
}

export async function getSitemapPaths(): Promise<string[]> {
  const items = await optional<{ url: string }[]>('categories/sitemap/');
  return (items ?? []).map(item => item.url);
}

export const getCatalog = cache(async (): Promise<CatalogCategory[]> => {
  const roots = await getRootCategories();
  const branches = await mapLimit(roots, CONCURRENCY, root =>
    Promise.all([getChildren(root.slug), getCategoryDocuments(root.slug)]),
  );

  return roots.map((root, index) => {
    const [sections, documents] = branches[index];
    return {
      id: root.id,
      title: root.title,
      slug: root.slug,
      url: root.url,
      documentsCount: documents.length,
      sections: sections.map(section => ({
        id: section.id,
        title: section.title,
        slug: section.slug,
        url: section.url,
        documents: documents
          .filter(document => document.section?.url === section.url)
          .map(({ id, title, url, tags }) => ({ id, title, url, tags })),
      })),
    };
  });
});

export function buildSearchIndex(catalog: CatalogCategory[]): SearchItem[] {
  return catalog.flatMap(category => [
    { title: category.title, url: category.url, kind: 'category' as const, context: '' },
    ...category.sections.flatMap(section => [
      { title: section.title, url: section.url, kind: 'section' as const, context: category.title },
      ...section.documents.map(document => ({
        title: document.title,
        url: document.url,
        kind: 'document' as const,
        context: `${category.title} · ${section.title}`,
        tags: document.tags,
      })),
    ]),
  ]);
}
