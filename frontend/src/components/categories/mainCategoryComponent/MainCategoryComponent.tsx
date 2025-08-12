"use client"
import React, { act } from 'react';
import Image from 'next/image';
import style from '../styles/mainCategory.module.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation'

import { CategoryItemType, CategoryItemResponse } from '../types/types';
import { getCategories, getCategoryBySlug, getCategoryByParent } from '@/api';

export default function MainCategoryComponent() {
  const pathname = usePathname()
  const activeSlug = React.useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    const categoriesIndex = parts.indexOf('categories');
    if (parts.length === 3) {
      return parts[categoriesIndex + 1] || '';
    }
    return parts[categoriesIndex + 1] || '';
  }, [pathname])
  const [mainCategories, setMainCategories] = React.useState<CategoryItemResponse[]>([])
  const handleGetCategories = async () => {
    const response = await getCategories()
    setMainCategories(response.data)
  }

  React.useEffect(() => {
    handleGetCategories()
  }, [])

  return(
    <div className={style.categoriesBlock}>
      <div className={style.blockContent}>
        <div className={style.mainCategoryList}>
          {mainCategories.map((mainCategoryItem) => (
            <MainCategoryItem key={mainCategoryItem.id}
            id={mainCategoryItem.id}
            title={mainCategoryItem.title}
            slug={mainCategoryItem.slug}
            beforeLevelClickedCategory=''
            isActive={mainCategoryItem.slug === activeSlug}
            docCount={mainCategoryItem.documents_count ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}





const MainCategoryItem = ({ id, title, slug, isActive, docCount }: CategoryItemType) => {
  return (
    <>
      <div
      className={isActive ? `${style.categoryItem} ${style.mainCategoryItem} ${style.clicked}` : `${style.categoryItem} ${style.mainCategoryItem}`}
      >
        <Link href={`/categories/${slug}`}
        className={style.categoryContent}
        >
          <Image
          src={'/icons/note-tak.png'}
          alt='doc'
          width={40}
          height={40}
          />
          <p className={style.mainCategoryTitle}>{title} ({docCount})</p>
        </Link>
      </div>
    </>
  );
}