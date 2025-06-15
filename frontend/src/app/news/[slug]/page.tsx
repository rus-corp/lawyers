"use client"
import React from 'react';

import style from '../news_page.module.css'
import { Props, NewsItemType } from '../types';
import { getNewsItem } from '@/api';
import ArticleContent from '@/ui/article_content/ArticleContent';

export default function NewsItemPage({ params: { slug } }: Props) {
  const [newsItemData, setNewsItemData] = React.useState<NewsItemType>()
  const handleGetNewItem = async (newsSlug: string) => {
    const response = await getNewsItem(newsSlug)
    if (response?.status === 200) {
      setNewsItemData(response.data)
    }
  }

  React.useEffect(() => {
    handleGetNewItem(slug)
  }, [])
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