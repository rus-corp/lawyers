"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import style from '../styles/mainCategory.module.css'
import { CategoryComponentProps, CategoryItemType } from '../types/types';
import { getCategoryBySlug } from '@/api';
import { usePathname } from 'next/navigation'
import { useCategorySearch } from '@/context/CategorySearchContext';


export default function SubCategoryComponent({
  categorySlug,
}: CategoryComponentProps) {
  const [categories, setCategories] = React.useState<CategoryItemType[]>([])
  const pathname = usePathname()
  const { findCategory, setFindCategory } = useCategorySearch()
  // const activeSlug = React.useMemo(() => {
  //     const parts = pathname.split('/').filter(Boolean);
  //     const categoriesIndex = parts.indexOf('categories');
  //     if (parts.length === 3) {
  //       return parts[parts.length - 1] || '';
  //     }
  //   }, [pathname])
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
  }, [categorySlug])
  return(
    <div className={style.subCategoryListBlock}>
      {categories.map((categoryItem) => (
        <SubCategoryItem key={categoryItem.id}
        id={categoryItem.id}
        title={categoryItem.title}
        slug={categoryItem.slug}
        beforeLevelClickedCategory=''
        isActive={categoryItem.slug === findCategory}
        />
      ))}
    </div>
  );
}


const SubCategoryItem = ({ id, title, slug, isActive }: CategoryItemType) => {
  const router = useRouter()
  const handleClick = (categorySlug: string) => {
    router.push(`/docs/${categorySlug}`)
  }
  return (
      <div
      className={isActive ? `${style.categoryItem} ${style.subCategoryItem} ${style.clicked}` : `${style.categoryItem} ${style.subCategoryItem}`}>
        <div
        className={style.categoryContent}
        onClick={() => handleClick(slug)}
        >
          <Image
          src={'/icons/icon_categ_1.png'}
          alt='doc'
          width={40}
          height={40}
          />
          <p className={style.subCategoryTitle}>{title}</p>
        </div>
      </div>
  );
}