"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import style from '../docs.module.css'
import CategoryComponent from '@/components/categories/categoryComponent/CategoryComponent';


export default function CategoryLayout({ children, params }: { children: React.ReactNode; params: { categorySlug: string } }) {
  const categorySlug = params.categorySlug

  const handleClick = (categorySlug: string) => {
  }
  return(
    <>
    <CategoryComponent
    categorySlug={categorySlug}
    beforeLevelClickedCategory={categorySlug}
    clickedCategory={handleClick}
    />
    {children}
    </>
  );
}