"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import style from '../styles/mainCategory.module.css'
import { CategoryComponentProps, CategoryItemType } from '../types/types';
import { getCategoryBySlug } from '@/api';


export default function SubCategoryComponent({
  categorySlug,
}: CategoryComponentProps) {
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
    <div className={style.subCategoryListBlock}>
      {categories.map((categoryItem) => (
        <SubCategoryItem key={categoryItem.id}
        id={categoryItem.id}
        title={categoryItem.title}
        slug={categoryItem.slug}
        beforeLevelClickedCategory=''
        />
      ))}
    </div>
  );
}


const SubCategoryItem = ({ id, title, slug }: CategoryItemType) => {
  const router = useRouter()
  const handleClick = (categorySlug: string) => {
    router.push(`/docs/${categorySlug}`)
  }
  return (
      <div className={`${style.categoryItem} ${style.subCategoryItem}`}>
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