"use client"
import React from 'react';

type CategorySearchContextType = {
  findCategory: string;
  setFindCategory: (value: string) => void;
}


const CategorySearchContext = React.createContext<CategorySearchContextType | undefined>(undefined);


export const CategorySearchProvider = ({ children }: {children: React.ReactNode}) => {
  const [findCategory, setFindCategory] = React.useState<string>('')
  return (
    <CategorySearchContext.Provider value={{ findCategory, setFindCategory}}>
      {children}
    </CategorySearchContext.Provider>
  );
}

export const useCategorySearch = () => {
  const context = React.useContext(CategorySearchContext)
  if (!context) {
    throw new Error('useCategorySearch must be used within a CategorySearchProvider')
  }
  return context
}