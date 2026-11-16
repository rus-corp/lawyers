'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import EmailModal from '@/components/EmailModal';
import Logo from '@/components/Logo';
import PlainText from '@/components/PlainText';
import { enter } from '@/lib/enter';
import { createOrder, fetchPaymentsEnabled } from '@/lib/api';
import { PAGES, formatDate, formatPrice, pad2, withCount } from '@/lib/text';
import type { Breadcrumb, DocumentFAQ, LawyerInfo } from '@/lib/types';

export interface InfoBlock {
  title: string;
  // sanitized HTML fragments
  items: string[];
}

// A section of the page written for this document; plain text from the admin panel.
export interface ContentSection {
  id: string;
  title: string;
  text: string;
}

interface Props {
  document: { id: number; title: string; price: number; pages: number | null; tags: string[] };
  heading: string;
  breadcrumbs: Breadcrumb[];
  // shown when the document has no lead of its own
  description?: string;
  lead: string;
  preview: string;
  sections: ContentSection[];
  faq: DocumentFAQ[];
  review: { lawyer: LawyerInfo | null; date: string | null } | null;
  infoBlocks: InfoBlock[];
  instruction: { title: string; html: string } | null;
  initialPaymentsEnabled: boolean;
}

const DEFAULT_MESSAGE = 'Документ будет отправлен на указанную почту в течение нескольких минут.';

const LIST_STYLES = '[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li+li]:mt-1';

// The template text fades out towards the bottom of the sheet: it is a fragment, not the whole document.
const PREVIEW_FADE = 'linear-gradient(to bottom, #000 72%, transparent)';

// Real document titles run from two words to a full sentence, so the heading scales with length.
function titleSize(length: number): string {
  if (length > 70) return 'clamp(24px, 2.6vw, 40px)';
  if (length > 36) return 'clamp(28px, 3.4vw, 54px)';
  return 'clamp(40px, 5.5vw, 88px)';
}

export default function DocumentDetailView({
  document: doc,
  heading,
  breadcrumbs,
  description,
  lead,
  preview,
  sections,
  faq,
  review,
  infoBlocks,
  instruction,
  initialPaymentsEnabled,
}: Props) {
  const router = useRouter();
  const [emailOpen, setEmailOpen] = useState(false);
  const [paymentsEnabled, setPaymentsEnabled] = useState(initialPaymentsEnabled);
  const closeModal = useCallback(() => setEmailOpen(false), []);

  useEffect(() => {
    fetchPaymentsEnabled().then(setPaymentsEnabled).catch(() => {});
  }, []);

  const parents = breadcrumbs.slice(0, -1);
  const backHref = parents[parents.length - 1]?.url ?? '/categories';
  const price = paymentsEnabled ? formatPrice(doc.price) : null;

  const handleEmailSubmit = async (email: string) => {
    const enabled = await fetchPaymentsEnabled();
    setPaymentsEnabled(enabled);
    if (enabled) {
      const params = new URLSearchParams({
        amount: String(doc.price),
        documentId: String(doc.id),
        userEmail: email,
        title: doc.title,
      });
      router.push(`/payment_page?${params}`);
      return;
    }
    const response = await createOrder({ description: String(doc.id), user_email: email });
    if (response.status !== 202) throw new Error('Unexpected response');
    return response.data?.message || DEFAULT_MESSAGE;
  };

  const meta = [
    { label: 'Категория', value: parents[0]?.title },
    { label: 'Раздел', value: parents[1]?.title },
    { label: 'Объём', value: doc.pages ? withCount(doc.pages, PAGES) : undefined },
    { label: 'Формат', value: 'DOCX (Word)' },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <div className="enter min-h-screen bg-[white]" style={enter({ duration: 0.6 })}>
      {/* Header */}
      <header
        style={enter({ y: -20 })}
        className="enter relative z-20 flex items-center justify-between px-5 md:px-16 py-5 md:py-6 bg-[white]/90 backdrop-blur-sm border-b border-[#E8E4DE]"
      >
        <Link
          href={backHref}
          data-cursor="pointer"
          className="font-display flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-[#8C8880] hover:text-[#C62828] transition-colors duration-300"
        >
          <span>←</span>
          <span className="hidden sm:inline">Назад к разделу</span>
        </Link>
        <Logo className="text-[13px] text-[#1C1915]" />
        <div className="flex items-center gap-4">
          <span className="font-display hidden text-[11px] text-[#8C8880] sm:inline">{doc.pages ? `${doc.pages} стр.` : 'DOCX'}</span>
          {price && (
            <>
              <div className="hidden w-[1px] h-4 bg-[#E8E4DE] sm:block" />
              <span className="font-display text-[13px] font-semibold text-[#C62828]">{price}</span>
            </>
          )}
        </div>
      </header>

      {/* Hero entrance */}
      <div className="pt-12 pb-8 px-5 md:px-16 lg:px-24 max-w-[1400px] mx-auto">

        {/* Breadcrumb */}
        <nav
          aria-label="Хлебные крошки"
          style={enter({ y: 10, duration: 0.5, delay: 0.2 })}
          className="enter font-display mb-8 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-[#8C8880] sm:mb-10 sm:text-[11px] sm:tracking-[0.2em]"
        >
          <Link href="/categories" data-cursor="pointer" className="transition-colors hover:text-[#C62828]">Документы</Link>
          {parents.map(item => (
            <span key={item.url} className="contents">
              <span className="text-[#C62828]">/</span>
              <Link href={item.url} data-cursor="pointer" className="transition-colors hover:text-[#C62828]">{item.title}</Link>
            </span>
          ))}
          <span className="text-[#C62828]">/</span>
          <span aria-current="page" className="text-[#1C1915]">{doc.title}</span>
        </nav>

        {/* Document entering animation */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 items-start">

          {/* Left: Title + content */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="overflow-hidden mb-6 pb-2">
              <h1
                className="enter font-display font-black text-[#1C1915] leading-[1.02] break-words"
                style={{ fontSize: titleSize(heading.length), ...enter({ y: '110%', from: 1, duration: 0.9, delay: 0.25, expo: true }) }}
              >
                {heading}
              </h1>
            </div>

            <div
              style={enter({ y: 20, duration: 0.7, delay: 0.2 })}
              className={`enter font-body text-[18px] text-[#8C8880] leading-relaxed max-w-xl ${doc.tags.length > 0 ? 'mb-12' : 'mb-16'}`}
            >
              {lead ? <PlainText text={lead} className={`space-y-4 ${LIST_STYLES}`} /> : <p>{description}</p>}
            </div>

            {/* Tags */}
            {doc.tags.length > 0 && (
              <div
                style={enter({ y: 16, delay: 0.6 })}
                className="enter flex flex-wrap gap-2 mb-16"
              >
                {doc.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-display px-4 py-1.5 border border-[#E8E4DE] text-[11px] tracking-[0.15em] uppercase text-[#8C8880]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Document content — reading mode */}
            <div
              style={enter({ y: 30, scale: 0.98, duration: 0.9, delay: 0.7, expo: true })}
              className="enter relative"
              aria-hidden={preview ? undefined : true}
            >
              {/* Paper depth effect */}
              <div className="absolute -bottom-3 -right-3 inset-x-3 h-full bg-[#1C1915] opacity-[0.04] rounded-sm" />
              <div className="absolute -bottom-1.5 -right-1.5 inset-x-1.5 h-full bg-[#1C1915] opacity-[0.06] rounded-sm" />

              {/* Document paper */}
              <div
                className="relative bg-[#FEFCF9] border border-[#E0DAD3] p-6 sm:p-10 md:p-14"
                style={{ boxShadow: '0 20px 60px rgba(28,25,21,0.1), 0 4px 16px rgba(28,25,21,0.06)' }}
              >
                {preview ? (
                  <div
                    className="max-h-[560px] overflow-hidden py-2 md:max-h-[760px]"
                    style={{ maskImage: PREVIEW_FADE, WebkitMaskImage: PREVIEW_FADE }}
                  >
                    <PlainText
                      text={preview}
                      className={`space-y-5 break-words font-mono text-[12px] leading-[1.9] text-[#3D3935] sm:text-[13px] ${LIST_STYLES}`}
                    />
                  </div>
                ) : (
                  <div className="min-h-[340px] py-5 md:min-h-[640px]">
                    <div className="mb-12 text-center font-mono md:mb-20 text-[18px] uppercase tracking-[0.12em] text-[#1C1915] break-words md:text-[22px]">
                      {doc.title}
                    </div>
                    <div className="space-y-8">
                      {[42, 68, 86, 74, 92, 58, 82, 96, 71, 88, 64, 91].map((width, index) => (
                        <motion.div
                          key={index}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: index * 0.07, ease: 'linear' }}
                          className="h-[2px] bg-[#3D3935]/55"
                          style={{ width: `${width}%`, transformOrigin: 'left' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {preview && (
              <p className="font-body mt-6 text-[12px] text-[#8C8880]">
                Начало шаблона. Полный документ в формате DOCX придёт на почту.
              </p>
            )}
          </div>

          {/* Right: Actions sidebar */}
          <div
            style={enter({ x: 30, duration: 0.8, delay: 0.6 })}
            className={`enter lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 space-y-6 ${sections.length > 0 ? 'lg:row-span-2' : ''}`}
          >
            {/* Price card */}
            <div className="border border-[#E8E4DE] p-8 bg-[#FEFCF9]">
              <div className="font-display text-[11px] tracking-[0.2em] uppercase text-[#8C8880] mb-3">
                {price ? 'Стоимость' : 'Доставка'}
              </div>
              <div className={`font-display font-black text-[#1C1915] leading-none mb-6 ${price ? 'text-[48px]' : 'text-[36px]'}`}>
                {price ?? 'Отправить на почту'}
              </div>

              <button
                type="button"
                data-cursor="pointer"
                onClick={() => setEmailOpen(true)}
                className="font-display w-full bg-[#C62828] text-white px-4 py-4 text-[12px] tracking-[0.18em] uppercase font-semibold hover:bg-[#8B0000] transition-colors duration-300"
              >
                Получить по электронной почте
              </button>
              <div className="font-body mt-5 flex items-center gap-2 text-[11px] text-[#8C8880]">
                <span className="text-[#1B4FD8]">◆</span>
                {paymentsEnabled ? 'Документ придёт вложением после оплаты' : 'Документ придёт вложением в письме'}
              </div>
              <p className="font-body mt-4 border-t border-[#E8E4DE] pt-4 text-[10px] leading-relaxed text-[#8C8880]">
                {paymentsEnabled ? 'Оплачивая документ, вы выражаете согласие с содержанием ' : 'Отправляя запрос, вы выражаете согласие с содержанием '}
                <Link href="/offer" className="underline underline-offset-2 hover:text-[#C62828]">оферты</Link>
                {paymentsEnabled ? ', ' : ' и '}
                <Link href="/politic" className="underline underline-offset-2 hover:text-[#C62828]">политики конфиденциальности</Link>
                {paymentsEnabled && (
                  <>
                    {' и '}
                    <Link href="/payment_rules" className="underline underline-offset-2 hover:text-[#C62828]">условий оплаты</Link>
                  </>
                )}
              </p>
            </div>

            {/* Meta */}
            <div className="border border-[#E8E4DE] p-8 space-y-5">
              {meta.map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-6">
                  <span className="font-display text-[11px] tracking-[0.15em] uppercase text-[#8C8880]">
                    {label}
                  </span>
                  <span className="font-display text-right text-[13px] text-[#1C1915] font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {review && (
              <div className="border border-[#E8E4DE] p-8">
                <div className="font-display mb-5 text-[11px] tracking-[0.2em] uppercase text-[#8C8880]">Проверено юристом</div>
                {review.lawyer && (
                  <div className="flex items-center gap-4">
                    {review.lawyer.photo && (
                      // Photos are served by the site's web server as they are, without resizing.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.lawyer.photo}
                        alt={review.lawyer.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-display text-[15px] font-semibold text-[#1C1915]">{review.lawyer.name}</div>
                      <div className="font-body mt-1 text-[12px] leading-snug text-[#6A6662]">{review.lawyer.position}</div>
                      {review.lawyer.experience && (
                        <div className="font-body mt-1 text-[12px] leading-snug text-[#8C8880]">{review.lawyer.experience}</div>
                      )}
                    </div>
                  </div>
                )}
                {review.date && (
                  <div className={`font-body text-[12px] text-[#8C8880] ${review.lawyer ? 'mt-5' : ''}`}>
                    Дата проверки: {formatDate(review.date)}
                  </div>
                )}
              </div>
            )}

            {/* Legal note */}
            <p className="font-body text-[11px] text-[#8C8880] leading-relaxed px-1">
              Документ соответствует действующему законодательству Российской Федерации. Рекомендуем проконсультироваться с юристом перед подписанием.
            </p>
          </div>

          {/* The page's own texts. Rendered without entrance animation, so they are visible in the HTML as is. */}
          {sections.length > 0 && (
            <div className="min-w-0 space-y-14 lg:col-start-1 lg:row-start-2">
              {sections.map((section, index) => (
                <section key={section.id} aria-labelledby={`about-${section.id}`} className="border-t border-[#E8E4DE] pt-12">
                  <div className="mb-3 text-[10px] tracking-[0.18em] text-[#C62828]">{pad2(index + 1)}</div>
                  <h2
                    id={`about-${section.id}`}
                    className="font-display mb-6 text-[28px] font-black leading-tight tracking-[-0.03em] text-[#1C1915] md:text-[36px]"
                  >
                    {section.title}
                  </h2>
                  <PlainText text={section.text} className="rich-text max-w-[760px]" />
                </section>
              ))}
            </div>
          )}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mt-24 border-t border-[#E8E4DE] pt-14"
        >
          <div className="mb-10 max-w-2xl">
            <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Что произойдёт после заказа</div>
            <h2 className="font-display text-[36px] font-black leading-tight tracking-[-0.03em] text-[#1C1915] md:text-[52px]">
              Всё необходимое — в одном письме
            </h2>
          </div>
          <div className={`grid border-l border-t border-[#E8E4DE] ${infoBlocks.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
            {infoBlocks.map((block, index) => (
              <div key={index} className="border-b border-r border-[#E8E4DE] p-7 md:p-9">
                <div className="mb-6 text-[10px] tracking-[0.18em] text-[#C62828]">{pad2(index + 1)}</div>
                <h3 className="font-display mb-5 text-[19px] font-bold text-[#1C1915]">{block.title}</h3>
                <ul className="space-y-3">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-3 text-[13px] leading-relaxed text-[#6A6662]">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#1B4FD8]" />
                      <span className="rich-inline min-w-0" dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {instruction && (
          <section className="mt-24 border-t border-[#E8E4DE] pt-14">
            <div className="mx-auto max-w-[860px]">
              <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Инструкция</div>
              <h2 className="font-display mb-10 text-[32px] font-black leading-tight tracking-[-0.03em] text-[#1C1915] md:text-[46px]">
                {instruction.title}
              </h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: instruction.html }} />
            </div>
          </section>
        )}

        {faq.length > 0 && (
          <section aria-labelledby="faq-title" className="mt-24 border-t border-[#E8E4DE] pt-14">
            <div className="mx-auto max-w-[860px]">
              <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Вопросы и ответы</div>
              <h2
                id="faq-title"
                className="font-display mb-10 text-[32px] font-black leading-tight tracking-[-0.03em] text-[#1C1915] md:text-[46px]"
              >
                Частые вопросы
              </h2>
              <div className="border-t border-[#E8E4DE]">
                {faq.map((item, index) => (
                  <details key={index} open={index === 0} className="group border-b border-[#E8E4DE]">
                    <summary
                      data-cursor="pointer"
                      className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden"
                    >
                      <h3 className="font-display text-[17px] font-bold leading-snug text-[#1C1915] md:text-[19px]">{item.question}</h3>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[22px] leading-none text-[#C62828] transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <PlainText text={item.answer} className="rich-text pb-8 md:pr-12" />
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>

      <AnimatePresence>
        {emailOpen && (
          <EmailModal
            documentTitle={doc.title}
            pages={doc.pages}
            paymentsEnabled={paymentsEnabled}
            onClose={closeModal}
            onSubmit={handleEmailSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
