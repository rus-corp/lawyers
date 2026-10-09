'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageBar from '@/components/PageBar';
import { ARTICLES, withCount } from '@/lib/text';

interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export default function ArticlesView({ articles }: { articles: ArticleCard[] }) {
  return (
    <main className="min-h-screen bg-[#F7F6F3]">
      <PageBar
        variant="flat"
        maxWidth={1300}
        backHref="/"
        backLabel="На главную"
        right={articles.length > 0 ? withCount(articles.length, ARTICLES) : undefined}
      />
      <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-16 md:py-24">
        <div className="mb-14 max-w-3xl">
          <div className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Правовой журнал</div>
          <h1 className="font-display mb-6 text-[42px] font-black leading-[0.92] tracking-[-0.045em] text-[#1C1915] sm:text-[52px] md:text-[82px]">
            Понятно о праве
          </h1>
          <p className="text-[16px] leading-relaxed text-[#8C8880]">
            Практические материалы без сложных формулировок — от подготовки документа до его подачи адресату.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="border border-[#E8E4DE] bg-white p-9 md:p-12">
            <div className="mb-4 text-[10px] uppercase tracking-[0.14em] text-[#8C8880]">Скоро</div>
            <h2 className="font-display mb-4 text-[28px] font-bold leading-tight text-[#1C1915]">Материалы готовятся к публикации</h2>
            <p className="mb-8 max-w-xl text-[13px] leading-7 text-[#6A6662]">
              Пока статей нет, но готовые шаблоны документов с инструкциями уже доступны в каталоге.
            </p>
            <Link href="/categories" data-cursor="pointer" className="text-[11px] uppercase tracking-[0.16em] text-[#1B4FD8] underline-offset-4 hover:underline">
              Перейти в каталог →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={`/news/${article.slug}`}
                  data-cursor="document"
                  className="group flex h-full min-h-80 flex-col border border-[#E8E4DE] bg-white p-7 text-left transition-all hover:-translate-y-1 hover:border-[#1B4FD8] hover:shadow-[0_20px_60px_rgba(28,25,21,0.08)] md:p-9"
                >
                  <div className="mb-10 flex justify-between text-[10px] uppercase tracking-[0.14em] text-[#8C8880]">
                    <span>Статья</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="font-display mb-5 text-[28px] font-bold leading-tight text-[#1C1915]">{article.title}</h2>
                  <p className="mb-8 text-[13px] leading-7 text-[#6A6662]">{article.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-[#E8E4DE] pt-6 text-[11px]">
                    <span className="text-[#8C8880]">{article.date}</span>
                    <span className="text-[#1B4FD8] transition-transform group-hover:translate-x-1">Читать →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
