import ArticlesView from '@/views/ArticlesView';
import { excerpt, readTime } from '@/lib/html';
import { pageMetadata } from '@/lib/metadata';
import { getNews } from '@/lib/server-api';
import { formatDate } from '@/lib/text';

export const generateMetadata = () => pageMetadata('news', '/news', { title: 'Статьи — ПРАВОДОК' });

export default async function NewsPage() {
  const news = await getNews();
  const articles = [...news]
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id)
    .map(item => ({
      slug: item.slug,
      title: item.title,
      excerpt: excerpt(item.text),
      date: formatDate(item.created_at),
      readTime: readTime(item.text),
    }));
  return <ArticlesView articles={articles} />;
}
