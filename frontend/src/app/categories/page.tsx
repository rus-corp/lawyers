"use client"
import React from 'react';

import style from './docs.module.css'
import MainCategoryComponent from '@/components/categories/mainCategoryComponent/MainCategoryComponent';
import CategoryComponent from '@/components/categories/categoryComponent/CategoryComponent';
import SubCategoryComponent from '@/components/categories/subCategoryComponent/SubCategoryComponent';
import SearchBlockComponent from '@/components/search_block/SearchBlockComponent';
import { CreateItemInput } from '@/ui/inputs/SearchInput';
import BackUpForm from '@/components/form/BackUpForm';

// import { getDocumentsList } from '@/api';
import { getCategories, getSeacrhCategories } from '@/api';

export default function Docs() {
  const [clickedMainCategory, setClickedMainCategory] = React.useState('')
  const [clickedCategory, setClickedCategory] = React.useState('')
  const [seacrhDoc, setSearchDoc] = React.useState<string>('')
  const [searchedCategories, setSearchedCategories] = React.useState([])

  const handleFindCategories = async (value: string) => {
    const response = await getCategories(value)
    setSearchedCategories(response.data)
    return response
  }
  const handleSearchCategories = async (searchQuery: string) => {
    const response = await getSeacrhCategories(searchQuery)
    if (response.status === 200) {
      const categoryData = response.data
      if (categoryData.length === 3) {
        setClickedCategory(categoryData[categoryData.length - 2].slug)
        setClickedMainCategory(categoryData[categoryData.length - 3].slug)
      } else if (categoryData.length === 2) {
        setClickedMainCategory(categoryData[categoryData.length - 2].slug)
      }
    }
  }
  const handleMainCategoryClick = (categorySlug: string) => {
    setClickedMainCategory(categorySlug)
  }
  const handleCategoryClick = (categorySlug: string) => {
    setClickedCategory(categorySlug)
  }
  const handleClickSubCategory = (categorySlug: string) => {
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
    <div className='container'>
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
          clickedCategory={handleMainCategoryClick}
          />
          <CategoryComponent
          categorySlug={clickedMainCategory}
          clickedCategory={handleCategoryClick}
          />
          <SubCategoryComponent
          categorySlug={clickedCategory}
          clickedCategory={handleClickSubCategory}
          />
        </div>
        <div className={style.pageInfoBlock}>
          <div className={style.infoContent}>
            <h4 style={{ fontWeight: 400 }}>На сайте вы найдете актуальные шаблоны досудебных претензий, исков и других заявлений — составленные юристами на основе успешных дел.</h4>
            <h6 style={{ fontWeight: 400 }}>Каждый документ поставляется в формате .doc и сопровождается подробной инструкцией по заполнению. Подходит для самостоятельного использования без обращения к юристу.</h6>
            <p>Нужный документ — за 5 минут, без похода к юристу.</p>

          </div>
        </div>
        <BackUpForm />
      </section>

    </div>
  );
}