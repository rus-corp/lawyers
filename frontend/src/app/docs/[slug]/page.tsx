import { notFound, permanentRedirect } from 'next/navigation';
import { isAxiosError } from 'axios';
import { backendUrl } from '@/api/_variables';
import { DocProps } from '../types';

export default async function LegacyDocumentPage({params: {slug}}: DocProps) {
  let url: string;
  try {
    const response = await backendUrl.get(`categories/documents/${encodeURIComponent(slug)}/`);
    url = response.data.url;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
  if (!url) notFound();
  permanentRedirect(url);
}
