import JsonLd from './JsonLd';
import { SITE_URL } from '@/lib/site';
import type { Breadcrumb } from '@/lib/types';

export default function BreadcrumbsJsonLd({ items }: { items: Breadcrumb[] }) {
  const breadcrumbs = [{ title: 'Документы', url: '/categories' }, ...items];
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          item: SITE_URL + item.url,
        })),
      }}
    />
  );
}
