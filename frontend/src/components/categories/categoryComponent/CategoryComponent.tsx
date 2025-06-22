"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import style from '../styles/mainCategory.module.css'

import { getCategoryBySlug } from '@/api';
import { CategoryComponentProps, CategoryItemType } from '../types/types'
import SubCategoryComponent from '../subCategoryComponent/SubCategoryComponent';


export default function CategoryComponent(
  { categorySlug, clickedCategory, beforeLevelClickedCategory }: CategoryComponentProps
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
        clickedCategory={clickedCategory}
        beforeLevelClickedCategory={beforeLevelClickedCategory}
        />
      ))}
    </div>
  );
}



const CategoryItem = ({ id, title, slug, clickedCategory, beforeLevelClickedCategory }: CategoryItemType) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('')
  const handleClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    clickedCategory(categorySlug)
  }
  return (
    <>
      <div className={`${style.categoryItem} ${style.categoryCategoryItem}`}>
        <Link href={`/categories/${beforeLevelClickedCategory}/${slug}`}
        className={style.categoryContent}
        onClick={() => handleClick(slug)}
        >
          <Image
          src={'/icons/note-tak.png'}
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