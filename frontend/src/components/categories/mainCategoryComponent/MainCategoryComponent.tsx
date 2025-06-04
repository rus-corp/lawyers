"use client"
import React, { act } from 'react';
import Image from 'next/image';
import style from '../styles/mainCategory.module.css'

import { CategoryItemType, MainCategoryProps } from '../types/types';
import { getCategories, getCategoryBySlug, getCategoryByParent } from '@/api';

import CategoryComponent from '../categoryComponent/CategoryComponent';

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
    <section className={style.categoriesBlock}>
      <div className={style.blockContent}>
        <div className={style.mainCategoryList}>
          {mainCategories.map((mainCategoryItem) => (
            <MainCategoryItem key={mainCategoryItem.id}
            id={mainCategoryItem.id}
            title={mainCategoryItem.title}
            slug={mainCategoryItem.slug}
            clickedCategory={clickedCategory}
            />
          ))}
        </div>
      </div>
    </section>
  );
}





const MainCategoryItem = ({ id, title, slug, clickedCategory }: CategoryItemType) => {
  // const [active, setActive] = React.useState<boolean>(false)
  // const [selectedCAtegory, setSelectedCategory] = React.useState('')
  const handleClick = (categorySlug: string) => {
    // setActive(!active)
    // setSelectedCategory(categorySlug)
    clickedCategory(categorySlug)
  }
  return (
    <>
      <div className={style.categoryItem}>
        <div
        className={style.categoryContent}
        onClick={() => handleClick(slug)}
        >
          <Image
          src={'/icons/note-tak.png'}
          alt='doc'
          width={40}
          height={40}
          />
          <p>{title}</p>
        </div>
      </div>
      {/* {active && <CategoryComponent categorySlug={selectedCAtegory}/>} */}
    </>
  );
}