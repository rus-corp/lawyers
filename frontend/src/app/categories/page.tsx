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
import { getCategories } from '@/api';

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
  const handleMainCategoryClick = (categorySlug: string) => {
    setClickedMainCategory(categorySlug)
  }
  const handleCategoryClick = (categorySlug: string) => {
    console.log(categorySlug)
    setClickedCategory(categorySlug)
  }
  const handleClickSubCategory = (categorySlug: string) => {
    console.log(categorySlug)
  }
  const handleSearch = async (name: string, value: string) => {
    setSearchDoc(value);
    const response = await handleFindCategories(value)
  }
  const handleClickedCategory = (category: string) => {
    console.log(category)
    setSearchDoc('')
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
        <BackUpForm />
      </section>

    </div>
  );
}