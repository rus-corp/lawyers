"use client"
import React from 'react';
import Image from 'next/image';
import style from '../styles/mainCategory.module.css'

import { getCategoryBySlug } from '@/api';
import { CategoryComponentProps, CategoryItemType } from '../types/types'
// import SubCategoryComponent from '../subCategoryComponent/SubCategoryComponent';

export default function CategoryComponent(
  { categorySlug }: CategoryComponentProps
) {
  const [categories, setCategories] = React.useState<CategoryItemType[]>([])
  const getCategoriesList = async (categorySlug: string) => {
    const response = await getCategoryBySlug(categorySlug)
    if (response.status === 200) {
      console.log(response.data)
      setCategories(response.data)
    }
  }
  React.useEffect(() => {
    getCategoriesList(categorySlug)
  }, [categorySlug])
  return(
    <div className={style.categoryListBlock}>
      {categories.map((categoryItem) => (
        <CategoryItem key={categoryItem.id}
        id={categoryItem.id}
        title={categoryItem.title}
        slug={categoryItem.slug}
        />
      ))}
    </div>
  );
}



const CategoryItem = ({ id, title, slug }: CategoryItemType) => {
  const [active, setActive] = React.useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('')
  const handleClick = (categorySlug: string) => {
    console.log(categorySlug)
    setActive(!active)
    setSelectedCategory(categorySlug)
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
          width={60}
          height={60}
          />
          <p>{title}</p>
        </div>
      </div>
      {/* {active && <SubCategoryComponent categorySlug={selectedCategory}/>} */}
    </>
  );
}