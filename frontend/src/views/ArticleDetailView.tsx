'use client';

import { motion } from 'framer-motion';
import PageBar from '@/components/PageBar';

interface Props {
  title: string;
  date: string;
  readTime: string;
  // sanitized HTML
  html: string;
}

export default function ArticleDetailView({ title, date, readTime, html }: Props) {
  return (
    <main className="min-h-screen bg-white">
      <PageBar variant="flat" maxWidth={1000} backHref="/news" backLabel="Все статьи" />
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-[860px] px-6 py-16 md:px-12 md:py-24"
      >
        <div className="mb-6 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.16em] text-[#8C8880]">
          <span className="text-[#C62828]">Статья</span>
          <span>{date}</span>
          <span>{readTime}</span>
        </div>
        <h1 className="font-display mb-12 break-words text-[36px] font-black leading-[0.98] tracking-[-0.04em] text-[#1C1915] sm:text-[44px] md:text-[68px]">
          {title}
        </h1>
        <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
      </motion.article>
    </main>
  );
}
