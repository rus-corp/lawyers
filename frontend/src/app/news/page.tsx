import ArticlesView from '@/views/ArticlesView';
import { excerpt, readTime } from '@/lib/html';
import { pageMetadata } from '@/lib/metadata';
import { getNews } from '@/lib/server-api';
import { SITE_NAME } from '@/lib/site';
import { formatDate } from '@/lib/text';

export async function generateMetadata() {
  const news = await getNews();
  return pageMetadata(
    'news',
    '/news',
    {
      title: `Статьи о праве и оформлении документов | ${SITE_NAME}`,
      description:
        'Практические материалы без сложных формулировок: как подготовить юридический документ и подать его адресату.',
    },
    // An empty list has nothing to offer a search engine yet.
    { noindex: news.length === 0 },
  );
}

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
