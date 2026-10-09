import ArticleDetailView from '@/views/ArticleDetailView';
import { excerpt, readTime, sanitize } from '@/lib/html';
import { pageMetadata } from '@/lib/metadata';
import { getNewsItem } from '@/lib/server-api';
import { formatDate } from '@/lib/text';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  return pageMetadata(`news/${item.slug}`, `/news/${item.slug}`, {
    title: item.title,
    description: excerpt(item.text, 160),
  });
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  return (
    <ArticleDetailView
      title={item.title}
      date={formatDate(item.created_at)}
      readTime={readTime(item.text)}
      html={sanitize(item.text)}
    />
  );
}
