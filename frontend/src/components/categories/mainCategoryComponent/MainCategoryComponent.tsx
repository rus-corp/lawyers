"use client"
import React, { act } from 'react';
import Image from 'next/image';
import style from '../styles/mainCategory.module.css'
import Link from 'next/link';

import { CategoryItemType, MainCategoryProps } from '../types/types';
import { getCategories, getCategoryBySlug, getCategoryByParent } from '@/api';


export default function MainCategoryComponent({ clickedCategory }: MainCategoryProps) {
  const [mainCategories, setMainCategories] = React.useState<CategoryItemType[]>([])
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
            clickedCategory={clickedCategory}
            beforeLevelClickedCategory=''
            />
          ))}
        </div>
      </div>
    </div>
  );
}





const MainCategoryItem = ({ id, title, slug, clickedCategory }: CategoryItemType) => {
  const handleClick = (categorySlug: string) => {
    clickedCategory(categorySlug)
  }
  return (
    <>
      <div className={`${style.categoryItem} ${style.mainCategoryItem}`}>
        <Link href={`/categories/${slug}`}
        className={style.categoryContent}
        onClick={() => handleClick(slug)}
        >
          <Image
          src={'/icons/note-tak.png'}
          alt='doc'
          width={40}
          height={40}
          />
          <p className={style.mainCategoryTitle}>{title}</p>
        </Link>
      </div>
    </>
  );
}