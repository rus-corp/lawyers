import React from 'react';


import style from './docs.module.css'

import BackUpForm from '@/components/form/BackUpForm';
import SearchBlockComponent from '@/components/search_block/SearchBlockComponent';
import MainCategoryComponent from '@/components/categories/mainCategoryComponent/MainCategoryComponent';
import { CategorySearchProvider } from '@/context/CategorySearchContext';

import { getPageMeta } from '@/api';



// export async function generateMetadata(): Promise<Metadata> {
//   console.log('categ meta')
//   const response = await getPageMeta('categories')
//   console.log(response)
//   if (!response) return {}
//   return {
//     title: response.title,
//     description: response.description,
//     keywords: response.keywords,
//   };
// }


export default function MainCategoryLayout({ children }: { children: React.ReactNode}) {
  return(
    <CategorySearchProvider>
      <section className={style.docsPage}>
        <SearchBlockComponent/>
        <div className={style.blockContent}>
          <MainCategoryComponent
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
    </CategorySearchProvider>
  );
}