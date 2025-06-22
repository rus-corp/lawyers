import React from 'react';
import { Metadata } from 'next';
import style from './news_page.module.css'
import NewsListComponent from "@/components/news_component/NewsListComponent";
import { getPageMeta } from '@/api';


export async function generateMetadata(): Promise<Metadata> {
  const response = await getPageMeta('news')
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}


export default function NewsPage() {
  return(
    <div className="container">
      <section className={style.newsPage}>
        <div className={style.pageHeader}>
          <h3>Статьи</h3>
        </div>
        <NewsListComponent />
      </section>
    </div>
  );
}