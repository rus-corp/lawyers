import React from 'react';

import style from './docs.module.css'
import MainCategoryComponent from '@/components/categories/mainCategoryComponent/MainCategoryComponent';
import DocsComponent from '@/components/docs_block/DocsComponent';

export default function Docs() {
  return(
    <section className={style.docsPage}>
      <div className={style.blockContent}>
        <MainCategoryComponent />
        <DocsComponent />
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