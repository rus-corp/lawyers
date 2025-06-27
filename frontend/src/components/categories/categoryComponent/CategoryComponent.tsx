"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import style from '../styles/mainCategory.module.css'

import { getCategoryBySlug } from '@/api';
import { CategoryComponentProps, CategoryItemType } from '../types/types'



export default function CategoryComponent(
  { categorySlug, beforeLevelClickedCategory }: CategoryComponentProps
) {
  const [categories, setCategories] = React.useState<CategoryItemType[]>([])
  const getCategoriesList = async (categorySlug: string) => {
    const response = await getCategoryBySlug(categorySlug)
    if (response.status === 200) {
      setCategories(response.data)
    }
  }

  React.useEffect(() => {
    if (categorySlug) {
      getCategoriesList(categorySlug)
    }
  }, [categorySlug])
  return(
    <div className={style.categoryListBlock}>
      {categories.map((categoryItem) => (
        <CategoryItem key={categoryItem.id}
        id={categoryItem.id}
        title={categoryItem.title}
        slug={categoryItem.slug}
        beforeLevelClickedCategory={beforeLevelClickedCategory}
        />
      ))}
    </div>
  );
}



const CategoryItem = ({ id, title, slug, beforeLevelClickedCategory }: CategoryItemType) => {
  return (
    <>
      <div className={`${style.categoryItem} ${style.categoryCategoryItem}`}>
        <Link href={`/categories/${beforeLevelClickedCategory}/${slug}`}
        className={style.categoryContent}
        >
          <Image
          src={'/icons/icon_categ_3.png'}
          alt='doc'
          width={40}
          height={40}
          />
          <p className={style.categoryTitle}>{title}</p>
        </Link >
      </div>
    </>
  );
}