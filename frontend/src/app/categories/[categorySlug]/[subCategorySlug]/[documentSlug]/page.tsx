import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import DocumentDetailView, { type InfoBlock } from '@/views/DocumentDetailView';
import { sanitize } from '@/lib/html';
import { buildMetadata } from '@/lib/metadata';
import {
  getCategoryPath,
  getDocumentInstruction,
  getDocumentSidebar,
  getPageMeta,
  getPaymentsEnabled,
} from '@/lib/server-api';
import type { SidebarSection } from '@/lib/types';

type Props = { params: Promise<{ categorySlug: string; subCategorySlug: string; documentSlug: string }> };

const BUTTON_LABEL = 'Получить по электронной почте';

const describe = (title: string) => `Получите документ «${title}» и инструкции по заполнению на электронную почту.`;

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Admin texts were written for the old button caption and list items start with a dash.
const adaptText = (text: string) => text.replace(/Оплатить документ/g, BUTTON_LABEL);
const adaptItem = (html: string) => adaptText(sanitize(html)).replace(/^(\s*(?:<p>)?\s*)[-–—•]\s+/, '$1');

function sidebarBlocks(sections: SidebarSection[]): InfoBlock[] {
  return sections.map(section => ({
    title: adaptText(section.title).replace(/:\s*$/, ''),
    items: section.items.map(item => adaptItem(item.text)),
  }));
}

function defaultBlocks(title: string): InfoBlock[] {
  return [
    {
      title: `После нажатия «${BUTTON_LABEL}»`,
      items: ['Внесите корректный адрес электронной почты', 'На эту почту придёт письмо с документами'],
    },
    {
      title: 'В письме вы получите',
      items: [
        'Готовый шаблон документа',
        'Подробную инструкцию по заполнению',
        'Пример правильного оформления',
        'Советы по подаче в суд или адресату',
      ],
    },
    {
      title: 'Кому подойдёт документ',
      items: [
        `Вам нужно подготовить документ «${title}» без юриста`,
        'Вы хотите использовать актуальный редактируемый шаблон',
        'Вам важны инструкция и пример правильного оформления',
      ],
    },
    {
      title: 'Как будет выглядеть документ',
      items: [
        'Формат: .docx (Word)',
        'Адаптирован под гражданский и арбитражный процесс',
        'Можно редактировать под вашу ситуацию',
      ],
    },
  ].map(block => ({ ...block, items: block.items.map(escapeHtml) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subCategorySlug, documentSlug } = await params;
  const { document } = await getCategoryPath(categorySlug, subCategorySlug, documentSlug);
  if (!document) notFound();
  const meta = (await getPageMeta(document.url.slice(1))) ?? (await getPageMeta(`docs/${documentSlug}`));
  return buildMetadata(meta, document.url, { title: document.title, description: describe(document.title) });
}

export default async function DocumentPage({ params }: Props) {
  const { categorySlug, subCategorySlug, documentSlug } = await params;
  const { category, document } = await getCategoryPath(categorySlug, subCategorySlug, documentSlug);
  if (!document) notFound();

  const [sidebar, instruction, paymentsEnabled] = await Promise.all([
    getDocumentSidebar(document.slug),
    getDocumentInstruction(document.slug),
    getPaymentsEnabled(),
  ]);

  return (
    <>
      <BreadcrumbsJsonLd items={category.breadcrumbs} />
      <DocumentDetailView
        document={{ id: document.id, title: document.title, price: document.price }}
        breadcrumbs={category.breadcrumbs}
        description={describe(document.title)}
        infoBlocks={sidebar?.sections?.length ? sidebarBlocks(sidebar.sections) : defaultBlocks(document.title)}
        instruction={instruction ? { title: instruction.title, html: sanitize(instruction.description) } : null}
        initialPaymentsEnabled={paymentsEnabled}
      />
    </>
  );
}
