"use client"
import React from 'react';
import Image from 'next/image';
import style from '../styles/mainCategory.module.css'
import { CategoryComponentProps, CategoryItemType } from '../types/types';
import { getCategoryBySlug } from '@/api';


export default function SubCategoryComponent({
  categorySlug
}: CategoryComponentProps) {
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
    <div className={style.subCategoryListBlock}>
      {categories.map((categoryItem) => (
        <SubCategoryItem key={categoryItem.id}
        id={categoryItem.id}
        title={categoryItem.title}
        slug={categoryItem.slug}
        />
      ))}
    </div>
  );
}


const SubCategoryItem = ({ id, title, slug }: CategoryItemType) => {
  const handleClick = (categorySlug: string) => {
    console.log(categorySlug)
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
      {/* {active && <CategoryComponent mainCategorySlug={active}/>} */}
    </>
  );
}