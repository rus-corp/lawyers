'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FolderCard from '@/components/FolderCard';
import CatalogSearch from '@/components/CatalogSearch';
import PageBar from '@/components/PageBar';
import FeedbackForm from '@/components/FeedbackForm';
import { CATEGORIES, TEMPLATES, pad2, plural, withCount } from '@/lib/text';
import type { SearchItem } from '@/lib/types';

interface CategoryCard {
  id: number;
  title: string;
  url: string;
  count: number;
}

interface Props {
  categories: CategoryCard[];
  searchIndex: SearchItem[];
}

const ACCENTS = ['#C62828', '#1B4FD8'];

export default function CategoriesView({ categories, searchIndex }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className="min-h-screen bg-[white] flex flex-col">
      <PageBar backHref="/" backLabel="Назад" right={withCount(categories.length, CATEGORIES)} />

      {/* Main — fills viewport */}
      <div className="flex-1 flex flex-col pt-10 pb-10 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto w-full">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-[1px] bg-[#C62828]" />
              <span className="font-display text-[10px] tracking-[0.28em] uppercase text-[#8C8880]">
                Документы
              </span>
            </div>
            <h1
              className="font-display font-black text-[#1C1915] leading-none"
              style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', letterSpacing: '-0.03em' }}
            >
              Каталог
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="font-display hidden md:flex items-center gap-2 text-[11px] text-[#B8B4AE]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              </svg>
              Наведите на категорию
            </div>
            <div className="font-display text-[12px] font-medium text-[#1C1915]">
              {total}<span className="text-[#8C8880] font-normal"> {plural(total, TEMPLATES)}</span>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative z-30 mb-8">
          <CatalogSearch items={searchIndex} placeholder="Найти документ — брачный договор, алименты, раздел имущества..." />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 md:gap-8">
          {categories.map((cat, i) => (
            <FolderCard
              key={cat.id}
              href={cat.url}
              number={pad2(i + 1)}
              title={cat.title}
              count={cat.count}
              accent={ACCENTS[i % ACCENTS.length]}
              isHovered={hovered === cat.id}
              index={i}
              animateIn={false}
              onHoverStart={() => setHovered(cat.id)}
              onHoverEnd={() => setHovered(null)}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <p className="font-body py-16 text-center text-[15px] text-[#8C8880]">Документы скоро появятся.</p>
        )}

        {/* Request form */}
        <section className="mt-24 grid gap-10 border-t border-[#E8E4DE] pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Заявка</div>
            <h2 className="font-display mb-6 text-[36px] font-black leading-[0.98] tracking-[-0.035em] text-[#1C1915] md:text-[52px]">
              Не нашли нужный документ?
            </h2>
            <p className="mb-8 max-w-md text-[15px] leading-7 text-[#6A6662]">
              Оставьте заявку, и наш юрист свяжется с вами в ближайшее время.
            </p>
            <div className="space-y-4 text-[13px] leading-7 text-[#8C8880]">
              <p>
                На сайте вы найдёте актуальные шаблоны досудебных претензий, исков и других заявлений — составленные
                юристами на основе успешных дел.
              </p>
              <p>
                Каждый документ поставляется в формате .doc и сопровождается подробной инструкцией по заполнению.
                Подходит для самостоятельного использования без обращения к юристу.
              </p>
            </div>
          </div>
          <FeedbackForm />
        </section>
      </div>
    </div>
  );
}
