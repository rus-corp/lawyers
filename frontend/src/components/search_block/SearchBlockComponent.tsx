import React from 'react';

import style from './searchBlock.module.css'
import { CategoryType } from './types';

type Props = {
  categoriesList: CategoryType[];
  categoryClicked: Function;
}

export default function SearchBlockComponent({ categoriesList, categoryClicked }: Props) {
  if (!categoriesList || categoriesList.length === 0) {
    return null
  }
  return(
    <div className={style.searchBlockList}>
      {categoriesList?.map((item) => (
        <CategoryItem key={item.id}
        title={item.title}
        slug={item.slug}
        categoryClicked={categoryClicked}
        />
      ))}
    </div>
  );
}




const CategoryItem = ({title, slug, categoryClicked}: CategoryType) => {
  const handleClick = () => {
    if (categoryClicked) {
      categoryClicked(slug)
    }
  }
  return (
    <div className={style.categoryItem} onClick={handleClick}>
      <p>{title}</p>
    </div>
  );
}