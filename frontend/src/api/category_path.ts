import { cache } from 'react';
import { isAxiosError } from 'axios';
import { notFound } from 'next/navigation';
import { backendUrl } from './_variables';
import { DocumentType } from '@/app/docs/types';

export type Breadcrumb = { title: string; url: string };
export type CategoryPathData = {
  category: { title: string; slug: string; url: string; breadcrumbs: Breadcrumb[] };
  document: DocumentType | null;
};
export const getCategoryPath = cache(async (path: string): Promise<CategoryPathData> => {
  try {
    const response = await backendUrl.get(`categories/path/${path}/`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
});
export const siteUrl = 'https://pravo-dok.ru';
