"use client"
import React from 'react';

import style from '../../docs.module.css'
import SubCategoryComponent from '@/components/categories/subCategoryComponent/SubCategoryComponent';


type Props = {
  params: {
    categorySlug: string;
    subCategorySlug: string;
  }
}


export default function SubCategoryLayout(
  { children, params }: { children: React.ReactNode; params: { categorySlug: string; subCategorySlug: string } }
) {
  const { subCategorySlug, categorySlug } = params;
  console.log('subSlug', subCategorySlug)
  const handleClick = (categorySlug: string) => {
    console.log(categorySlug)
  }
  
  return(
    <>
    <SubCategoryComponent
    beforeLevelClickedCategory={subCategorySlug}
    categorySlug={subCategorySlug}
    clickedCategory={handleClick}
    />
    {children}
    </>
  );
}