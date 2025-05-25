'use client'
import React from 'react';
import Image from 'next/image';
import style from './category.module.css'
import { CategoryItemType, CategoryListType, CategoryType } from './types';

import { getCategories, getCategoryBySlug, getCategoryByParent } from '@/api';



// export default function Category() {
//   const [categories, setCategories] = React.useState<CategoryListType[]>([])
//   const [clickedCategory, setClickedCategory] = React.useState<string>('')
  
//   const handleClickCategory = async (categorySlug: string) => {
//     setClickedCategory(categorySlug)
//     const response = await getCategoryBySlug(categorySlug)
//     setCategories(response.data)
//   }
//   const handleGetCategories = async () => {
//     const response = await getCategories()
//     setCategories(response.data)
//   }
//   // const handleBack = async() => {
//   //   const response = await getCategoryByParent(clickedCategory)
//   //   setCategories(response.data)
//   // }

//   const handleTogle = (categorySlug: string, levelCategories: CategoryType[], setLevelCategories: (newCats: CategoryType[]) => void) => {
//     const updated = levelCategories.map(cat => {
//       if (cat.categorySlug !== categorySlug) return cat

//       if (cat.children) {
//         return {...cat, isExpanded: !cat.isExpanded}
//       } else {
//         const newCat = {...cat, isLoading: true}
//         const children = handleClickCategory(categorySlug)
//         const updatedCat = {
//           ...newCat,
//           isExpanded: true,
//           isLoading: false,
//           children: children,
//         }
//         // setLevelCategories(
//         //   prev => prev.map(c => (c.id === categoryId ? updatedCat : c))
//         // )
//       }
//     })
//   }

//   React.useEffect(() => {
//     handleGetCategories()
//   }, [])

//   return(
//     <section className={style.blockCategories}>
//       <div className={style.blockContent}>
//         <div className={style.categoryList}>
//           {categories.map((categ) => (
//             <CategoryItem key={categ.id}
//             title={categ.title}
//             categorySlug={categ.slug}
//             handleClick={handleClickCategory}
//             />
//           ))}
//         </div>
//       </div>
//       <div className={style.backBlock}
//       >
//         <Image
//         className={style.backImg}
//         src={'/icons/back2.png'}
//         alt='back'
//         width={45}
//         height={45}
//         />
//         <p>Назад</p>
//       </div>
//     </section>
//   );
// }



// const CategoryItem = ( { title, categorySlug, handleClick }: CategoryItemType ) => {
//   return (
//     <div className={style.categoryItem}>
//       <div
//       className={style.categoryContent}
//       onClick={() => handleClick(categorySlug)}
//       >
//         <Image
//         src={'/icons/note-tak.png'}
//         alt='doc'
//         width={60}
//         height={60}
//         />
//         <p>{title}</p>
//       </div>
//     </div>
//   );
// }