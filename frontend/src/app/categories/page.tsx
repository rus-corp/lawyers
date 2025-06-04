"use client"
import React from 'react';

import style from './docs.module.css'
import MainCategoryComponent from '@/components/categories/mainCategoryComponent/MainCategoryComponent';
import CategoryComponent from '@/components/categories/categoryComponent/CategoryComponent';
import SubCategoryComponent from '@/components/categories/subCategoryComponent/SubCategoryComponent';
import { CreateItemInput } from '@/ui/inputs/SearchInput';

import { getDocumentsList } from '@/api';

export default function Docs() {
  const [clickedMainCategory, setClickedMainCategory] = React.useState('')
  const [clickedCategory, setClickedCategory] = React.useState('')
  const [seacrhDoc, setSearchDoc] = React.useState<string>('')
  const handleFindDocs = async () => {
    const response = await getDocumentsList(seacrhDoc)
    if (response.status == 200) {

    }
  }
  const handleMainCategoryClick = (categorySlug: string) => {
    setClickedMainCategory(categorySlug)
  }
  const handleCategoryClick = (categorySlug: string) => {
    setClickedCategory(categorySlug)
  }
  const handleClickSubCategory = (categorySlug: string) => {
    console.log(categorySlug)
  }
  const handleSearch = (value: string) => {
    console.log(value);
    setSearchDoc(value);
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
        {/* <DocsComponent /> */}
        {/* <div className={style.blockDocs}>
          <div className={style.docsHeader}>
            <div className={style.headerTitle}>
              <h3>Документы</h3>
            </div>
            <div className={style.headerSearch}>
              <input type="text" />
            </div>
          </div>
          <div className={style.docsFiles}></div>
        </div> */}
      </div>
    </section>
  );
}