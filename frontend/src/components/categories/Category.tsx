import React from 'react';

import style from './category.module.css'


export default function Category() {
  return(
    <section className={style.blockCategories}>
      <div className={style.blockContent}>
        <div className={style.blockHeader}>
          <h4>Категории</h4>
        </div>
        <div className={style.categoryList}>
          <div className={style.categoryItem}>
            <p>Судебные документы</p>
          </div>
        </div>
      </div>
    </section>
  );
}