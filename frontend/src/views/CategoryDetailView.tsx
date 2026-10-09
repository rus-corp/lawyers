'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageBar from '@/components/PageBar';
import { DOCUMENTS, TEMPLATES, normalize, pad2, withCount } from '@/lib/text';

interface Section {
  id: number;
  title: string;
  url: string;
  count: number;
}

interface Doc {
  id: number;
  title: string;
  url: string;
  sectionTitle: string;
}

interface Props {
  title: string;
  number: string;
  accent: string;
  description?: string;
  total: number;
  sections: Section[];
  documents: Doc[];
}

export default function CategoryDetailView({ title, number, accent, description, total, sections, documents }: Props) {
  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState<number | null>(null);
  const [view, setView] = useState<'cards' | 'list'>('cards');

  const filtered = useMemo(() => {
    const query = normalize(search);
    return documents
      .filter(d => normalize(d.title).includes(query) || normalize(d.sectionTitle).includes(query))
      .sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  }, [documents, search]);

  // Group by first letter for alphabet sections
  const grouped = useMemo(() => {
    const map: Record<string, Doc[]> = {};
    filtered.forEach(d => {
      const letter = (d.title.trim()[0] ?? '#').toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(d);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b, 'ru'));
  }, [filtered]);

  const letters = grouped.map(([l]) => l);

  return (
    <div className="min-h-screen bg-white">
      <PageBar backHref="/categories" backLabel="Все категории" right={withCount(total, TEMPLATES)} />

      <div className="max-w-[1400px] mx-auto px-5 md:px-16 lg:px-24 pt-12 pb-16">

        {/* Category hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-[1px]" style={{ background: accent }} />
            <span className="font-display text-[10px] tracking-[0.28em] uppercase text-[#8C8880]">
              {number} · Категория
            </span>
          </div>
          <h1
            className="font-display font-black text-[#1C1915] leading-none mb-4"
            style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', letterSpacing: '-0.035em' }}
          >
            {title}
          </h1>
          {description && (
            <p className="font-body text-[16px] text-[#8C8880] max-w-xl leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        {sections.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mb-12"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-[#1C1915]">
                Подразделы
              </h2>
              <span className="text-[11px] text-[#8C8880]">Выберите тему</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {sections.map((section, index) => (
                <Link
                  key={section.id}
                  href={section.url}
                  data-cursor="category"
                  className="group flex min-h-44 flex-col rounded-xl border border-[#E8E4DE] bg-[#FEFCF9] p-5 text-left transition-all hover:-translate-y-1 hover:border-[#C62828] hover:shadow-[0_14px_40px_rgba(28,25,21,0.08)]"
                >
                  <div className="mb-7 flex items-center justify-between text-[10px] text-[#B8B4AE]">
                    <span>{pad2(index + 1)}</span>
                    <span>{withCount(section.count, DOCUMENTS)}</span>
                  </div>
                  <h3 className="font-display mb-2 text-[18px] font-bold text-[#1C1915]">{section.title}</h3>
                  <span className="mt-auto pt-4 text-[11px] text-[#C62828] transition-transform group-hover:translate-x-1">Смотреть →</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-10"
        >
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8C8880]" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Поиск в разделе «${title}»...`}
            aria-label={`Поиск в разделе «${title}»`}
            className="font-body w-full pl-12 pr-12 py-4 rounded-2xl text-[14px] text-[#1C1915] placeholder-[#B8B4AE] outline-none transition-all duration-300"
            style={{
              background: 'white',
              border: '1px solid #E8E4DE',
              boxShadow: '0 2px 12px rgba(28,25,21,0.05)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E8E4DE'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(28,25,21,0.05)'; }}
          />
          {search && (
            <button
              type="button"
              aria-label="Очистить поиск"
              data-cursor="pointer"
              onClick={() => setSearch('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8C8880] hover:text-[#1C1915]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <span className="font-display text-[12px] text-[#8C8880]">
            {search ? `Найдено: ${filtered.length}` : `Все документы: ${filtered.length}`}
          </span>

          <div className="flex items-center gap-2">
            {/* Sort label */}
            <div className="font-display hidden md:flex items-center gap-1.5 text-[11px] text-[#C8C4BE] mr-3">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3h6M3 5h4M4 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              А–Я
            </div>

            {/* View switcher */}
            {([
              { id: 'cards', label: 'Карточки', icon: <><rect x="1" y="1" width="3.5" height="3.5" rx="0.5"/><rect x="5.5" y="1" width="3.5" height="3.5" rx="0.5"/><rect x="1" y="5.5" width="3.5" height="3.5" rx="0.5"/><rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.5"/></> },
              { id: 'list',  label: 'Список', icon: <><path d="M1 2.5h8M1 5h8M1 7.5h8" strokeLinecap="round"/></> },
            ] as const).map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                aria-label={label}
                aria-pressed={view === id}
                data-cursor="pointer"
                onClick={() => setView(id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  background: view === id ? '#1C1915' : 'transparent',
                  color: view === id ? 'white' : '#B8B4AE',
                  border: view === id ? 'none' : '1px solid #E8E4DE',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill={id === 'list' ? 'none' : 'currentColor'} stroke={id === 'list' ? 'currentColor' : 'none'} strokeWidth={id === 'list' ? 1.3 : 0} aria-hidden="true">
                  {icon}
                </svg>
              </button>
            ))}
          </div>
        </motion.div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-2">
            {filtered.map((doc, i) => {
              const isHov = hovered === doc.id;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
                  onHoverStart={() => setHovered(doc.id)}
                  onHoverEnd={() => setHovered(null)}
                >
                  <Link href={doc.url} data-cursor="document" className="block">
                    <motion.div
                      className="flex items-center gap-5 px-5 py-4 rounded-xl"
                      animate={{
                        x: isHov ? 4 : 0,
                        background: isHov ? `${accent}07` : '#ffffff',
                        boxShadow: isHov ? `0 4px 20px rgba(28,25,21,0.07), 0 0 0 1px ${accent}20` : '0 1px 3px rgba(28,25,21,0.04)',
                      }}
                      transition={{ duration: 0.2 }}
                      style={{ border: '1px solid #ECEAE6' }}
                    >
                      <span className="font-display text-[11px] text-[#C8C4BE] w-6 shrink-0">
                        {pad2(i + 1)}
                      </span>

                      <div
                        className="w-[3px] h-8 rounded-full shrink-0"
                        style={{ background: isHov ? accent : '#E8E4DE', transition: 'background 0.2s' }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-[14px] text-[#1C1915] leading-snug mb-0.5 truncate" style={{ letterSpacing: '-0.01em' }}>
                          {doc.title}
                        </div>
                        <div className="font-body text-[11px] text-[#8C8880] truncate">
                          {doc.sectionTitle}
                        </div>
                      </div>

                      <motion.div
                        animate={{ opacity: isHov ? 1 : 0, x: isHov ? 0 : -4 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: accent }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                          <path d="M1.5 4h5M4.5 1.5L7 4l-2.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CARDS VIEW */}
        {view === 'cards' && (
          <div className="flex gap-8">
            {/* Sticky alphabet index */}
            {!search && (
              <div className="hidden lg:flex flex-col gap-1 pt-1" style={{ minWidth: 28 }}>
                {letters.map(letter => (
                  <a
                    key={letter}
                    href={`#letter-${letter}`}
                    data-cursor="pointer"
                    className="font-display text-[11px] font-semibold leading-none py-1 text-center rounded transition-colors duration-150"
                    style={{ color: '#B8B4AE', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = '#B8B4AE')}
                  >
                    {letter}
                  </a>
                ))}
              </div>
            )}

            <div className="flex-1 space-y-10">
              {grouped.map(([letter, docs]) => (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display text-[13px] font-black" style={{ color: accent }}>{letter}</span>
                    <div className="flex-1 h-[1px]" style={{ background: '#F0EDE8' }} />
                    <span className="font-display text-[10px] text-[#C8C4BE]">{docs.length}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {docs.map((doc, i) => {
                      const isHov = hovered === doc.id;
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                          onHoverStart={() => setHovered(doc.id)}
                          onHoverEnd={() => setHovered(null)}
                        >
                          <Link href={doc.url} data-cursor="document" className="block h-full">
                            <motion.div
                              className="relative rounded-xl p-5 flex flex-col gap-3 h-full overflow-hidden"
                              animate={{
                                y: isHov ? -3 : 0,
                                boxShadow: isHov ? `0 16px 40px rgba(28,25,21,0.1), 0 0 0 1.5px ${accent}28` : '0 1px 4px rgba(28,25,21,0.05)',
                              }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              style={{ background: 'white', border: '1px solid #ECEAE6' }}
                            >
                              <h3 className="font-display font-semibold text-[#1C1915] leading-snug flex-1"
                                style={{ fontSize: 14, letterSpacing: '-0.01em' }}>
                                {doc.title}
                              </h3>

                              <div className="flex items-center justify-between gap-3 pt-2" style={{ borderTop: '1px solid #F5F3EF' }}>
                                <span className="font-display min-w-0 truncate px-1.5 py-0.5 rounded text-[9px] tracking-wide"
                                  style={{ background: `${accent}0D`, color: accent }}>
                                  {doc.sectionTitle}
                                </span>
                                <span className="font-display shrink-0 text-[10px] text-[#C8C4BE]">
                                  DOCX
                                </span>
                              </div>

                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                animate={{ scaleX: isHov ? 1 : 0, opacity: isHov ? 1 : 0 }}
                                initial={{ scaleX: 0 }}
                                style={{ background: accent, transformOrigin: 'left' }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </motion.div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-[15px] text-[#8C8880]">
              {search ? `По запросу «${search}» ничего не найдено` : 'В этой категории пока нет документов'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
