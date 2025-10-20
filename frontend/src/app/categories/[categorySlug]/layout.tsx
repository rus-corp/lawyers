import React from 'react';
import { Metadata } from 'next';
import style from '../docs.module.css'
import CategoryComponent from '@/components/categories/categoryComponent/CategoryComponent';
import { getPageMeta } from '@/api';



export async function generateMetadata({ params }: { params: { slug: string } }) {
  console.log('category slug meta', params.slug)
  if (!params.slug) return {}
  const response = await getPageMeta(`categories/${params.slug}`)
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}

export default function CategoryLayout({
   children, params }: { children: React.ReactNode; params: { categorySlug: string } 
}) {
  const categorySlug = params.categorySlug
  return(
    <>
    <CategoryComponent
    categorySlug={categorySlug}
    beforeLevelClickedCategory={categorySlug}
    />
    {children}
    </>
  );
}