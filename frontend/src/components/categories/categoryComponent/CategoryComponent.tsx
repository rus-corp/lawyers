"use client"
import React from 'react';
import Image from 'next/image';
import style from '../styles/mainCategory.module.css'

import { getCategoryBySlug } from '@/api';
import { CategoryComponentProps, CategoryItemType } from '../types/types'
import SubCategoryComponent from '../subCategoryComponent/SubCategoryComponent';


export default function CategoryComponent(
  { categorySlug, clickedCategory }: CategoryComponentProps
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
        />
      ))}
    </div>
  );
}



const CategoryItem = ({ id, title, slug, clickedCategory }: CategoryItemType) => {
  // const [active, setActive] = React.useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('')
  const handleClick = (categorySlug: string) => {
    // setActive(!active)
    setSelectedCategory(categorySlug)
    clickedCategory(categorySlug)
  }
  return (
    <>
      <div className={`${style.categoryItem} ${style.categoryCategoryItem}`}>
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
          <p style={{ fontSize: '1.1rem'}}>{title}</p>
        </div>
      </div>
      {/* {active && <SubCategoryComponent categorySlug={selectedCategory}/>} */}
    </>
  );
}