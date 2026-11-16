import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BreadcrumbsJsonLd from '@/components/BreadcrumbsJsonLd';
import JsonLd from '@/components/JsonLd';
import DocumentDetailView, { type ContentSection, type InfoBlock } from '@/views/DocumentDetailView';
import { sanitize } from '@/lib/html';
import { buildMetadata, seoTitle } from '@/lib/metadata';
import { flattenText } from '@/lib/plain-text';
import {
  getCategoryPath,
  getDocumentInstruction,
  getDocumentSidebar,
  getPageMeta,
  getPaymentsEnabled,
} from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';
import { truncate } from '@/lib/text';
import type { DocumentContent, DocumentFAQ, DocumentItem, PageMeta, SidebarSection } from '@/lib/types';

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

// The page's own sections, in the order of the admin form; empty ones are left out.
const SECTIONS: { key: keyof DocumentContent; title: string }[] = [
  { key: 'when_needed', title: 'Когда нужен и кому подойдёт' },
  { key: 'whats_inside', title: 'Что входит в шаблон' },
  { key: 'legal_basis', title: 'Правовые основания' },
  { key: 'filing', title: 'Куда и как подавать' },
  { key: 'attachments', title: 'Какие документы приложить' },
];

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

function contentSections(content: DocumentContent | null): ContentSection[] {
  if (!content) return [];
  return SECTIONS.map(({ key, title }) => ({ id: key, title, text: text(content[key]) })).filter(section => section.text);
}

// The general "who it suits" block is dropped once the page has its own section about it.
function defaultBlocks(title: string, withAudience: boolean): InfoBlock[] {
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
    withAudience && {
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
  ]
    .filter(block => block !== false)
    .map(block => ({ ...block, items: block.items.map(escapeHtml) }));
}

// Texts set for the document itself come first, then the "Мета Теги" record for its address.
function documentMeta(content: DocumentContent | null, meta: PageMeta | null): PageMeta | null {
  if (!content?.seo_title && !content?.seo_description) return meta;
  return {
    title: text(content.seo_title) || meta?.title || '',
    description: text(content.seo_description) || meta?.description || '',
    keywords: meta?.keywords || '',
  };
}

function faqJsonLd(faq: DocumentFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: flattenText(item.answer) },
    })),
  };
}

function reviewJsonLd(document: DocumentItem, content: DocumentContent, heading: string) {
  const lawyer = content.reviewed_by;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: heading,
    url: SITE_URL + document.url,
    ...(content.reviewed_at ? { lastReviewed: content.reviewed_at } : {}),
    ...(lawyer ? { reviewedBy: { '@type': 'Person', name: lawyer.name, jobTitle: lawyer.position } } : {}),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, subCategorySlug, documentSlug } = await params;
  const { document } = await getCategoryPath(categorySlug, subCategorySlug, documentSlug);
  if (!document) notFound();
  const content = document.content ?? null;
  const meta = (await getPageMeta(document.url.slice(1))) ?? (await getPageMeta(`docs/${documentSlug}`));
  const lead = flattenText(content?.lead ?? '');
  return buildMetadata(documentMeta(content, meta), document.url, {
    title: seoTitle(document.title, 'образец в DOCX'),
    description:
      (lead && truncate(lead, 160)) ||
      document.description ||
      `Шаблон документа «${document.title}» в формате DOCX: инструкция по заполнению и пример оформления. Отправим на электронную почту.`,
  });
}

export default async function DocumentPage({ params }: Props) {
  const { categorySlug, subCategorySlug, documentSlug } = await params;
  const { category, document } = await getCategoryPath(categorySlug, subCategorySlug, documentSlug);
  if (!document) notFound();

  const content = document.content ?? null;
  const faq = document.faq ?? [];
  const heading = text(content?.h1) || document.title;
  const lead = text(content?.lead);
  const sections = contentSections(content);
  const reviewed = Boolean(content?.reviewed_by || content?.reviewed_at);

  const [sidebar, instruction, paymentsEnabled] = await Promise.all([
    getDocumentSidebar(document.slug),
    getDocumentInstruction(document.slug),
    getPaymentsEnabled(),
  ]);

  return (
    <>
      <BreadcrumbsJsonLd items={category.breadcrumbs} />
      {faq.length > 0 && <JsonLd data={faqJsonLd(faq)} />}
      {content && reviewed && <JsonLd data={reviewJsonLd(document, content, heading)} />}
      <DocumentDetailView
        document={{
          id: document.id,
          title: document.title,
          price: document.price,
          pages: document.pages,
          tags: document.tags ?? [],
        }}
        heading={heading}
        breadcrumbs={category.breadcrumbs}
        description={lead ? undefined : document.description || describe(document.title)}
        lead={lead}
        preview={text(content?.preview)}
        sections={sections}
        faq={faq}
        review={content && reviewed ? { lawyer: content.reviewed_by, date: content.reviewed_at } : null}
        infoBlocks={
          sidebar?.sections?.length
            ? sidebarBlocks(sidebar.sections)
            : defaultBlocks(document.title, !sections.some(section => section.id === 'when_needed'))
        }
        instruction={instruction ? { title: instruction.title, html: sanitize(instruction.description) } : null}
        initialPaymentsEnabled={paymentsEnabled}
      />
    </>
  );
}
