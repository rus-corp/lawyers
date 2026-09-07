"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import style from './searchBlock.module.css'

import SearchingListComponent from './SearchingListComponent';
import { CreateItemInput } from '@/ui/inputs/SearchInput';

import { getCategories, getSeacrhCategories } from '@/api';
import { useCategorySearch } from '@/context/CategorySearchContext';




export default function SearchBlockComponent() {
  const router = useRouter()
  const { setFindCategory } = useCategorySearch()
  const [seacrhDoc, setSearchDoc] = React.useState<string>('')
  const [searchedCategories, setSearchedCategories] = React.useState([])
  
  const handleSearchCategories = async (searchQuery: string) => {
    const response = await getSeacrhCategories(searchQuery)
    if (response.status === 200) {
      const categoryData = response.data
      const selectedCategory = categoryData[categoryData.length - 1];
      if (selectedCategory?.url) router.push(selectedCategory.url);
    }
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
    setFindCategory(category)
    const response = handleSearchCategories(category)
    setSearchedCategories([])
  }
  return (
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
        <SearchingListComponent
        categoriesList={searchedCategories}
        categoryClicked={handleClickedCategory}
        />
      </div>
    </div>
  );
}




