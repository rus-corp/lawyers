import Link from 'next/link';
import { Breadcrumb, siteUrl } from '@/api/category_path';

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  const breadcrumbs = [{title: 'Документы', url: '/categories'}, ...items];
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.title, item: siteUrl + item.url,
    })),
  };
  return <nav className="container" aria-label="Хлебные крошки" style={{paddingTop: 16, paddingBottom: 16}}>
    {breadcrumbs.map((item, index) => <span key={item.url}>
      {index > 0 && ' / '}
      {index === breadcrumbs.length - 1 ? <span aria-current="page">{item.title}</span> : <Link href={item.url}>{item.title}</Link>}
    </span>)}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, '\\u003c')}} />
  </nav>;
}
