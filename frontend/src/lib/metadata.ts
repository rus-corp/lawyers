import type { Metadata } from 'next';
import { getPageMeta } from './server-api';
import { SITE_URL } from './site';
import type { PageMeta } from './types';

interface Fallback {
  title?: string;
  description?: string;
}

// Only fields that have a value are returned: an explicit `undefined` would
// override the defaults set in the root layout.
export function buildMetadata(meta: PageMeta | null, canonicalPath: string, fallback: Fallback = {}): Metadata {
  const metadata: Metadata = { alternates: { canonical: SITE_URL + canonicalPath } };
  const title = meta?.title || fallback.title;
  const description = meta?.description || fallback.description;
  if (title) metadata.title = title;
  if (description) metadata.description = description;
  if (meta?.keywords) metadata.keywords = meta.keywords;
  return metadata;
}

// Titles and descriptions come from the "Мета Теги" records in the admin panel when present.
export async function pageMetadata(key: string, canonicalPath: string, fallback: Fallback = {}): Promise<Metadata> {
  return buildMetadata(await getPageMeta(key), canonicalPath, fallback);
}
