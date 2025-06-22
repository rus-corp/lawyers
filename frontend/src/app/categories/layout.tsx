"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

import style from './docs.module.css'
import BackUpForm from '@/components/form/BackUpForm';
import { CreateItemInput } from '@/ui/inputs/SearchInput';
import SearchBlockComponent from '@/components/search_block/SearchBlockComponent';
import MainCategoryComponent from '@/components/categories/mainCategoryComponent/MainCategoryComponent';


import { getCategories, getSeacrhCategories } from '@/api';



export default function MainCategoryLayout({ children }: { children: React.ReactNode}) {
  const router = useRouter()
  const [seacrhDoc, setSearchDoc] = React.useState<string>('')
  const [searchedCategories, setSearchedCategories] = React.useState([])
  const [clickedCategory, setClickedCategory] = React.useState('')
  const [clickedMainCategory, setClickedMainCategory] = React.useState('')

  const handleSearchCategories = async (searchQuery: string) => {
    const response = await getSeacrhCategories(searchQuery)
    if (response.status === 200) {
      // console.log(response.data)
      const categoryData = response.data
      if (categoryData.length === 3) {
        setClickedCategory(categoryData[categoryData.length - 2].slug)
        setClickedMainCategory(categoryData[categoryData.length - 3].slug)
        router.push(`/categories/${categoryData[categoryData.length - 2].slug}/${categoryData[categoryData.length - 3].slug}`)
      } else if (categoryData.length === 2) {
        setClickedMainCategory(categoryData[categoryData.length - 2].slug)
        router.push(`/categories/${categoryData[categoryData.length - 2].slug}`)
      }
    }
  }
  const handleClick = (category: string) => {
    console.log(category)
  }
  const handleFindCategories = async (value: string) => {
    const response = await getCategories(value)
    setSearchedCategories(response.data)
    return response
  }

  const handleSearch = async (name: string, value: string) => {
    setSearchDoc(value);
    const response = await handleFindCategories(value)
  }

  const handleClickedCategory = (title: string, category: string) => {
    setSearchDoc(title)
    const response = handleSearchCategories(category)
    setSearchedCategories([])
  }
  return(
      <section className={style.docsPage}>
        <div className={style.searchBlock}>
          <div className={style.headerSearch}>
            <CreateItemInput
            fieldType='text'
            fieldName='search'
            value={seacrhDoc}
            changeFunc={handleSearch}
            placeholder='Поиск по документам'
            />
          </div>
          <div className={style.searchCategoriesList}>
            <SearchBlockComponent
            categoriesList={searchedCategories}
            categoryClicked={handleClickedCategory}
            />
          </div>
        </div>
        <div className={style.blockContent}>
        <MainCategoryComponent
        clickedCategory={handleClick}
        />
        {children}
        </div>

        <div className={style.pageInfoBlock}>
          <div className={style.infoContent}>
            <h6 style={{ fontWeight: 400 }}>На сайте вы найдете актуальные шаблоны досудебных претензий, исков и других заявлений — составленные юристами на основе успешных дел.</h6>
            <h6 style={{ fontWeight: 400 }}>Каждый документ поставляется в формате .doc и сопровождается подробной инструкцией по заполнению. Подходит для самостоятельного использования без обращения к юристу.</h6>
            <p>Нужный документ — за 5 минут, без похода к юристу.</p>
          </div>
        </div>
        <BackUpForm />
      </section>
  );
}