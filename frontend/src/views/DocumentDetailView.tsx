'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import EmailModal from '@/components/EmailModal';
import Logo from '@/components/Logo';
import { createOrder, fetchPaymentsEnabled } from '@/lib/api';
import { PAGES, formatPrice, pad2, withCount } from '@/lib/text';
import type { Breadcrumb } from '@/lib/types';

export interface InfoBlock {
  title: string;
  // sanitized HTML fragments
  items: string[];
}

interface Props {
  document: { id: number; title: string; price: number; pages: number | null; tags: string[] };
  breadcrumbs: Breadcrumb[];
  description: string;
  infoBlocks: InfoBlock[];
  instruction: { title: string; html: string } | null;
  initialPaymentsEnabled: boolean;
}

const DEFAULT_MESSAGE = 'Документ будет отправлен на указанную почту в течение нескольких минут.';

// Real document titles run from two words to a full sentence, so the heading scales with length.
function titleSize(length: number): string {
  if (length > 70) return 'clamp(24px, 2.6vw, 40px)';
  if (length > 36) return 'clamp(28px, 3.4vw, 54px)';
  return 'clamp(40px, 5.5vw, 88px)';
}

export default function DocumentDetailView({ document: doc, breadcrumbs, description, infoBlocks, instruction, initialPaymentsEnabled }: Props) {
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
    <motion.div
      className="min-h-screen bg-[white]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-5 md:px-16 py-5 md:py-6 bg-[white]/90 backdrop-blur-sm border-b border-[#E8E4DE]"
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
      </motion.header>

      {/* Hero entrance */}
      <div className="pt-12 pb-8 px-5 md:px-16 lg:px-24 max-w-[1400px] mx-auto">

        {/* Breadcrumb */}
        <motion.nav
          aria-label="Хлебные крошки"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-display mb-8 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-[#8C8880] sm:mb-10 sm:text-[11px] sm:tracking-[0.2em]"
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
        </motion.nav>

        {/* Document entering animation */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 items-start">

          {/* Left: Title + content */}
          <div className="min-w-0">
            <div className="overflow-hidden mb-6 pb-2">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="font-display font-black text-[#1C1915] leading-[1.02] break-words"
                style={{ fontSize: titleSize(doc.title.length) }}
              >
                {doc.title}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={`font-body text-[18px] text-[#8C8880] leading-relaxed max-w-xl ${doc.tags.length > 0 ? 'mb-12' : 'mb-16'}`}
            >
              {description}
            </motion.p>

            {/* Tags */}
            {doc.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-2 mb-16"
              >
                {doc.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-display px-4 py-1.5 border border-[#E8E4DE] text-[11px] tracking-[0.15em] uppercase text-[#8C8880]"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Document content — reading mode */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              aria-hidden="true"
            >
              {/* Paper depth effect */}
              <div className="absolute -bottom-3 -right-3 inset-x-3 h-full bg-[#1C1915] opacity-[0.04] rounded-sm" />
              <div className="absolute -bottom-1.5 -right-1.5 inset-x-1.5 h-full bg-[#1C1915] opacity-[0.06] rounded-sm" />

              {/* Document paper */}
              <div
                className="relative bg-[#FEFCF9] border border-[#E0DAD3] p-6 sm:p-10 md:p-14"
                style={{ boxShadow: '0 20px 60px rgba(28,25,21,0.1), 0 4px 16px rgba(28,25,21,0.06)' }}
              >
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
              </div>
            </motion.div>
          </div>

          {/* Right: Actions sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:sticky lg:top-28 space-y-6"
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

            {/* Legal note */}
            <p className="font-body text-[11px] text-[#8C8880] leading-relaxed px-1">
              Документ соответствует действующему законодательству Российской Федерации. Рекомендуем проконсультироваться с юристом перед подписанием.
            </p>
          </motion.div>
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
          <div className="grid border-l border-t border-[#E8E4DE] md:grid-cols-2">
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
    </motion.div>
  );
}
