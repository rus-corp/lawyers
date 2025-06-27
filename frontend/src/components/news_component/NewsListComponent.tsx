"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import style from './news.module.css'
import { getNews } from '@/api';
import ArticleContent from '@/ui/article_content/ArticleContent';

import { NewsItemType } from './types';


export default function NewsListComponent() {
  const [news, setNews] = React.useState<NewsItemType[]>([])

  const handleGetNewsList = async () => {
    const response = await getNews()
    if (response?.status === 200) {
      setNews(response.data)
    }
  }

  React.useEffect(() => {
    handleGetNewsList()
  }, [])
  return(
    <div className={style.newsList}>
      {news.map((newsItem) => (
        <NewsItem key={newsItem.id}
        id={newsItem.id}
        title={newsItem.title}
        text={newsItem.text}
        slug={newsItem.slug}
        img={newsItem.img}
        created_at={newsItem.created_at}
        />
      ))}
    </div>
  );
}



const NewsItem = ({id, title, text, slug, img, created_at}: NewsItemType) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/news/${slug}`)
  }
  const handleValidateDate = (date: string) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDate
  }

  return (
    <div className={style.newsItem}
    onClick={handleClick}
    >
      <div className={style.newsContent}>
        <div className={style.newsTitle}>
          <h4>{title}</h4>
        </div>
        <div className={style.newsData}>
          <p>{handleValidateDate(created_at)}</p>
        </div>
      </div>
    </div>
  );
}