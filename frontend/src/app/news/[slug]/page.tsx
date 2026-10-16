import JsonLd from '@/components/JsonLd';
import ArticleDetailView from '@/views/ArticleDetailView';
import { excerpt, readTime, sanitize } from '@/lib/html';
import { pageMetadata, seoTitle } from '@/lib/metadata';
import { getNewsItem } from '@/lib/server-api';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { formatDate } from '@/lib/text';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  return pageMetadata(
    `news/${item.slug}`,
    `/news/${item.slug}`,
    { title: seoTitle(item.title), description: excerpt(item.text, 160) },
    { publishedTime: item.created_at },
  );
}

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  const url = `${SITE_URL}/news/${item.slug}`;
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: item.title,
          description: excerpt(item.text, 160),
          datePublished: item.created_at,
          inLanguage: 'ru',
          mainEntityOfPage: url,
          author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` } },
        }}
      />
      <ArticleDetailView
        title={item.title}
        date={formatDate(item.created_at)}
        readTime={readTime(item.text)}
        html={sanitize(item.text)}
      />
    </>
  );
}
