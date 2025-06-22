import React from 'react';
import { Metadata } from 'next';
import style from '../news_page.module.css'
import { Props, NewsItemType } from '../types';
import { getNewsItem } from '@/api';
import ArticleContent from '@/ui/article_content/ArticleContent';
import { getPageMeta } from '@/api';



export async function generateMetadata({ params }: { params: { slug: string } }) {
  const response = await getPageMeta(`news/${params.slug}`)
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}



export default async function NewsItemPage({ params: { slug } }: Props) {
  const response = await getNewsItem(slug);
  const newsItemData = response?.data

  return(
    <section className={style.newsItemPage}>
      <div className="container">
        <h3>{newsItemData?.title}</h3>
        {newsItemData ? (
          <ArticleContent
          htmlContent={newsItemData.text}
          />
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </section>
  );
}