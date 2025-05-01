'use client'
import React from 'react';
import Image from 'next/image';
import style from './category.module.css'
import { CategoryItemType, CategoryListType } from './types';


export default function Category() {
  const [categories, setCategories] = React.useState<CategoryListType[]>([])
  const handleClickCategory = (categoryTitle: string) => {
    console.log(categoryTitle)
  }
  React.useEffect(() => {
    setCategories(categoriesList)
  }, [])

  return(
    <section className={style.blockCategories}>
      <div className={style.blockContent}>
        <div className={style.categoryList}>
          {categories.map((categ) => (
            <CategoryItem key={categ.id}
            title={categ.title}
            handleClick={handleClickCategory}
            />
          ))}
        </div>
      </div>
      <div className={style.backBlock}
      >
        <Image
        className={style.backImg}
        src={'/icons/back2.png'}
        alt='back'
        width={45}
        height={45}
        />
        <p>Назад</p>
      </div>
    </section>
  );
}



const CategoryItem = ( { title, handleClick }: CategoryItemType ) => {
  return (
    <div className={style.categoryItem}>
      <div
      className={style.categoryContent}
      onClick={() => handleClick(title)}
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
  );
}



const categoriesList = [
  {'id': 1, 'title': 'Судебные документы'},
  {'id': 2, 'title': 'Договоры'},
]


const categ2 = [
  {'id': 2, 'title': 'Защита прав потребителей'},
  {'id': 3, 'title': 'Семейное право'},
]