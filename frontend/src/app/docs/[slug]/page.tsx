import React from 'react';

import { DocProps } from '../types';
import { getDocument, getPageMeta } from '@/api';
import DocPageComponent from '@/components/doc_page_component/DocPageComponent';


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const response = await getPageMeta(`news/${params.slug}`)
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}



export default async function DocItem({ params: { slug } }: DocProps) {
  const document = await getDocument(slug);
  const documentData = document?.data


  return(
    <>
      <DocPageComponent
      initialData={documentData}
      />
    </>
  );
}