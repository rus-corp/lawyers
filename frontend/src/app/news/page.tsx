import React from 'react';

import style from './news_page.module.css'
import NewsListComponent from "@/components/news_component/NewsListComponent";

export default function NewsPage() {
  return(
    <div className="container">
      <section className={style.newsPage}>
        <div className={style.pageHeader}>
          <h3>Новости</h3>
        </div>
        <NewsListComponent />
      </section>
    </div>
  );
}