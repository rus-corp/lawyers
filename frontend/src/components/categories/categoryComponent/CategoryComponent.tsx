"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import style from '../styles/mainCategory.module.css'
import { usePathname } from 'next/navigation'

import { getCategoryBySlug } from '@/api';
import { CategoryComponentProps, CategoryItemType } from '../types/types'
import { useCategorySearch } from '@/context/CategorySearchContext';


export default function CategoryComponent(
  { categorySlug, beforeLevelClickedCategory }: CategoryComponentProps
) {
  const pathname = usePathname()
  const { findCategory, setFindCategory } = useCategorySearch()
  const activeSlug = React.useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    const categoriesIndex = parts.indexOf('categories');
    if (parts.length === 2) {
      // return parts[parts.length - 1] || '';
    } else if (parts.length === 3) {
      return parts[parts.length - 1] || '';
    }
  }, [pathname])
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
    if (findCategory) {
      const timer = setTimeout(() => {
        setFindCategory('')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [categorySlug, findCategory])
  return(
    <div className={style.categoryListBlock}>
      {categories.map((categoryItem) => (
        <CategoryItem key={categoryItem.id}
        id={categoryItem.id}
        title={categoryItem.title}
        slug={categoryItem.slug}
        beforeLevelClickedCategory={beforeLevelClickedCategory}
        isActive={categoryItem.slug === activeSlug}
        isFind={categoryItem.slug === findCategory}
        />
      ))}
    </div>
  );
}



const CategoryItem = ({ id, title, slug, beforeLevelClickedCategory, isActive, isFind }: CategoryItemType) => {
  return (
    <>
      <div
      className={isActive || isFind
        ?`${style.categoryItem} ${style.categoryCategoryItem} ${style.clicked}` 
        : `${style.categoryItem} ${style.categoryCategoryItem}`}>
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