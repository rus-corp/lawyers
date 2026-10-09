'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageBar from '@/components/PageBar';
import { DOCUMENTS, formatPrice, pad2, withCount } from '@/lib/text';

interface Doc {
  id: number;
  title: string;
  url: string;
  price: number | null;
}

interface Props {
  title: string;
  categoryTitle: string;
  categoryUrl: string;
  documents: Doc[];
}

export default function SectionDetailView({ title, categoryTitle, categoryUrl, documents }: Props) {
  return (
    <main className="min-h-screen bg-white">
      <PageBar variant="flat" backHref={categoryUrl} backLabel={categoryTitle} right={withCount(documents.length, DOCUMENTS)} />

      <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-12 md:px-16 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14 max-w-3xl">
          <div className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Подраздел</div>
          <h1
            className={`font-display mb-6 font-black leading-[0.98] tracking-[-0.04em] text-[#1C1915] ${
              title.length > 32 ? 'text-[32px] sm:text-[40px] md:text-[56px]' : 'text-[40px] sm:text-[48px] md:text-[76px]'
            }`}
          >
            {title}
          </h1>
          <p className="text-[16px] leading-relaxed text-[#8C8880]">
            Выберите подходящий вариант — каждый шаблон можно отредактировать под вашу ситуацию.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={document.url}
                data-cursor="document"
                className="group flex h-full min-h-64 flex-col border border-[#E8E4DE] bg-[#FEFCF9] p-7 text-left transition-all hover:-translate-y-1 hover:border-[#C62828] hover:shadow-[0_18px_50px_rgba(28,25,21,0.08)]"
              >
                <div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-[#8C8880]">
                  <span>{pad2(index + 1)}</span>
                  <span>DOCX</span>
                </div>
                <h2 className="font-display mb-8 text-[22px] font-bold leading-tight text-[#1C1915]">{document.title}</h2>
                <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#E8E4DE] pt-5">
                  <span className="font-display text-[18px] font-black text-[#1B4FD8]">
                    {document.price ? formatPrice(document.price) : 'Отправить на почту'}
                  </span>
                  <span className="shrink-0 text-[12px] text-[#C62828] transition-transform group-hover:translate-x-1">Открыть →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {documents.length === 0 && (
          <p className="font-body py-16 text-center text-[15px] text-[#8C8880]">В этом подразделе пока нет документов</p>
        )}
      </div>
    </main>
  );
}
