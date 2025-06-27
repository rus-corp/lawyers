import React from 'react';

import SubCategoryComponent from '@/components/categories/subCategoryComponent/SubCategoryComponent';
import { getPageMeta } from '@/api';



export async function generateMetadata({ params }: { params: { slug: string } }) {
  const response = await getPageMeta(`news/${params.slug}`)
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}




export default function SubCategoryLayout(
  { children, params }: { children: React.ReactNode; params: { categorySlug: string; subCategorySlug: string } }
) {
  const { subCategorySlug, categorySlug } = params;
  
  return(
    <>
    <SubCategoryComponent
    beforeLevelClickedCategory={subCategorySlug}
    categorySlug={subCategorySlug}
    />
    {children}
    </>
  );
}