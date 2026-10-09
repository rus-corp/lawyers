'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';
import HeroAnimation from '@/components/HeroAnimation';
import FolderCard from '@/components/FolderCard';
import CatalogSearch from '@/components/CatalogSearch';
import { TEMPLATES, pad2, withCount } from '@/lib/text';
import type { SearchItem } from '@/lib/types';

interface HomeCategory {
  id: number;
  title: string;
  url: string;
  count: number;
}

interface Props {
  categories: HomeCategory[];
  totalDocs: number | null;
  searchIndex: SearchItem[];
}

const ACCENTS = ['#C62828', '#1B4FD8', '#1B4FD8', '#C62828'];

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return { count, ref };
}

/* ── About section ── */
interface Stat {
  target: number;
  suffix: string;
  label: string;
  text?: string;
}

const FEATURES = [
  { n: '01', title: 'Быстрая подготовка',   desc: 'Нужный документ за 5 минут, без похода к юристу' },
  { n: '02', title: 'Правовая уверенность', desc: 'Шаблоны разработаны практикующими юристами' },
  { n: '03', title: 'Гарантия защиты',      desc: 'Документы соответствуют действующему законодательству' },
  { n: '04', title: 'Экономия средств',     desc: 'Стоимость в разы ниже консультации юриста' },
];

function StatCell({ target, suffix, label, text }: Stat) {
  const { count, ref } = useCountUp(target, 1400);
  const [hov, setHov] = useState(false);
  const isText = text !== undefined;
  return (
    <motion.div
      ref={ref}
      className="relative py-10 px-6 md:px-8 cursor-default overflow-hidden"
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Hover background sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -20 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'linear-gradient(90deg, rgba(27,79,216,0.07) 0%, transparent 100%)' }}
      />
      <div
        className="font-display relative leading-none mb-3 flex items-baseline"
        style={{ fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 900, color: '#1C1915', letterSpacing: '-0.04em' }}
      >
        {isText ? text : count}
        <span style={{ fontSize: isText ? '1em' : '0.5em', fontWeight: 800, letterSpacing: '-0.02em', marginLeft: isText ? 0 : 2 }}>
          {suffix}
        </span>
      </div>
      <div
        className="font-display relative uppercase whitespace-pre-line leading-snug"
        style={{ fontSize: 10, color: hov ? '#1B4FD8' : '#6A6662', letterSpacing: '0.16em', transition: 'color 0.3s' }}
      >
        {label}
      </div>
      {/* Hover underline */}
      <motion.div
        animate={{ width: hov ? 32 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-6 h-[2px] bg-cobalt md:left-8"
      />
    </motion.div>
  );
}

function FeatureCell({ n, title, desc, index }: typeof FEATURES[0] & { index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className="relative py-10 px-6 md:px-8 cursor-default overflow-hidden"
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      {/* Left accent border */}
      <motion.div
        className="absolute bottom-6 left-0 top-6 w-[3px] rounded-full bg-cobalt"
        animate={{ scaleY: hov ? 1 : 0, opacity: hov ? 1 : 0 }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'top' }}
      />
      {/* Subtle bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: 'rgba(27,79,216,0.04)' }}
      />
      <div
        className="font-display relative mb-5"
        style={{ fontSize: 11, color: hov ? '#1B4FD8' : '#8C8880', letterSpacing: '0.06em', transition: 'color 0.3s' }}
      >
        {n}
      </div>
      <div
        className="font-display relative font-bold text-[#1C1915] leading-snug mb-3"
        style={{ fontSize: 'clamp(15px, 1.3vw, 18px)' }}
      >
        {title}
      </div>
      {/* Description remains fully readable on touch devices */}
      <div className="font-body relative min-h-11" style={{ fontSize: 13, color: '#4A4642', lineHeight: 1.65 }}>
        {desc}
      </div>
    </motion.div>
  );
}

function AboutSection({ totalDocs }: { totalDocs: number | null }) {
  const stats: Stat[] = [
    totalDocs
      ? { target: totalDocs, suffix: '', label: 'Шаблонов\nдокументов' }
      : { target: 0, suffix: '', label: 'Редактируемый\nформат', text: 'DOCX' },
    { target: 5,   suffix: ' мин', label: 'Среднее время\nсоздания' },
    { target: 100, suffix: '%',    label: 'Соответствие\nзаконодательству' },
    { target: 0,   suffix: '',     label: 'Готовый файл\nк печати', text: '.doc' },
  ];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-16 lg:px-24">

        {/* Section label */}
        <motion.div
          className="mb-10 flex items-center gap-3 border-t border-[#E8E4DE] pt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-3 h-[1px] bg-[#C62828]" />
          <span className="font-display text-[10px] tracking-[0.28em] uppercase text-[#8C8880]">
            О платформе
          </span>
        </motion.div>

        <motion.div
          className="mb-12 grid max-w-5xl gap-6 md:grid-cols-[1.25fr_0.75fr] md:items-end"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <h2 className="font-display text-[38px] font-black leading-[0.98] tracking-[-0.04em] text-[#1C1915] sm:text-[52px] md:text-[64px]">
            Документы, которым можно доверять
          </h2>
          <p className="max-w-md text-[13px] leading-7 text-[#6A6662] md:pb-1">
            Убираем сложный юридический язык и оставляем главное: точность, актуальность и понятный результат.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-3xl border border-[#D9D6D0] bg-[#F7F6F3] shadow-[0_24px_70px_rgba(28,25,21,0.07)]">
          {/* Stats row */}
          <div className="relative grid grid-cols-1 gap-px bg-[#D9D6D0] sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="overflow-hidden bg-white">
                <StatCell {...s} />
              </div>
            ))}
          </div>

          {/* Features row */}
          <div className="relative grid grid-cols-1 gap-px border-t border-[#D9D6D0] bg-[#D9D6D0] sm:grid-cols-2 md:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div key={f.n} className="overflow-hidden bg-[#F7F6F3]">
                <FeatureCell {...f} index={i} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

const ALL_REQUESTS = [
  { id: 1,  text: 'Нужен трудовой договор на испытательный срок',      tag: 'Трудовые',     color: '#1B4FD8' },
  { id: 2,  text: 'Как оформить доверенность на продажу авто?',         tag: 'Доверенности', color: '#7B1FA2' },
  { id: 3,  text: 'Расторгнуть договор аренды досрочно',                tag: 'Аренда',       color: '#00838F' },
  { id: 4,  text: 'Брачный договор перед свадьбой',                     tag: 'Семейные',     color: '#C62828' },
  { id: 5,  text: 'NDA для сотрудников — актуальный шаблон',            tag: 'Трудовые',     color: '#1B4FD8' },
  { id: 6,  text: 'Устав ООО — нужен готовый шаблон',                   tag: 'Корпоративные',color: '#2E7D32' },
  { id: 7,  text: 'Договор займа между физическими лицами',              tag: 'Кредиты',      color: '#E8600A' },
  { id: 8,  text: 'Исковое заявление о возврате долга',                 tag: 'Жалобы',       color: '#C62828' },
  { id: 9,  text: 'Согласие родителей на выезд ребёнка за рубеж',       tag: 'Семейные',     color: '#C62828' },
  { id: 10, text: 'Договор купли-продажи квартиры с задатком',          tag: 'Купля-продажа',color: '#1565C0' },
];

function RequestsSection() {
  const [visible, setVisible] = useState([0, 1, 2]);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(previous => [...previous.slice(1), (previous[previous.length - 1] + 1) % ALL_REQUESTS.length]);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="overflow-hidden py-16">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="flex min-h-[440px] flex-col items-start gap-7 rounded-3xl border border-[#E8E4DE] bg-[#F7F6F3] p-5 sm:min-h-0 sm:p-8 md:flex-row md:items-center md:gap-16">

          {/* Left label */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-[1px] bg-[#C62828]" />
              <span className="font-display text-[10px] tracking-[0.28em] uppercase text-[#8C8880]">
                Запросы
              </span>
            </div>
            <h2 className="font-display font-black text-[#1C1915] leading-tight"
              style={{ fontSize: 'clamp(22px, 2.5vw, 36px)', letterSpacing: '-0.025em' }}>
              С чем <br className="hidden md:block" />обращаются
            </h2>
          </motion.div>

          {/* Notification stream */}
          <div className="relative h-[220px] min-h-[220px] w-full flex-none overflow-hidden sm:h-[180px] sm:min-h-[180px] md:flex-1">
            <AnimatePresence>
              {visible.map((idx, pos) => {
                const r = ALL_REQUESTS[idx];
                return (
                  <motion.div
                    key={r.id}
                    layout
                    data-cursor="pointer"
                    initial={{ opacity: 0, y: 56, scale: 0.95 }}
                    animate={{ opacity: pos === 2 ? 0.55 : pos === 1 ? 0.78 : 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute w-full"
                    style={{ top: pos === 0 ? 0 : pos === 1 ? 68 : 136 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Link
                      href="/categories"
                      tabIndex={-1}
                      className="flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3.5 sm:gap-4 sm:px-5"
                      style={{
                        background: `linear-gradient(90deg, ${r.color}0D, white 42%)`,
                        border: `1px solid ${r.color}20`,
                        boxShadow: pos === 0 ? '0 4px 20px rgba(28,25,21,0.08)' : 'none',
                      }}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                      <span className="font-body flex-1 text-[12px] font-medium leading-snug text-[#1C1915] sm:truncate sm:text-[13px]">
                        {r.text}
                      </span>
                      <span className="font-display hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline"
                        style={{ color: r.color }}>
                        {r.tag}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function HomeView({ categories, totalDocs, searchIndex }: Props) {
  const [catHovered, setCatHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 });

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);
      mouseY.set((e.clientY - cy) / cy);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const bgX = useTransform(springX, v => v *  -8);
  const bgY = useTransform(springY, v => v *  -8);

  return (
    <div ref={containerRef} className="min-h-screen bg-[white] overflow-hidden">

      {/* ── HERO ── */}
      <motion.section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        {/* Background grid texture */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ x: bgX, y: bgY }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1C1915" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Blue ambient orb */}
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(27,79,216,0.07) 0%, transparent 65%)', borderRadius: '50%' }} />

        {/* Main content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 md:px-16 lg:px-24 w-full">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-6 h-[1px] bg-[#C62828]" />
            <span className="font-display text-[11px] tracking-[0.25em] uppercase text-[#8C8880] font-medium">
              Правовые документы онлайн
            </span>
          </motion.div>

          <h1 className="contents">
            {/* Row 1: full-width heading line */}
            <span className="mb-2 block" style={{ clipPath: 'inset(-20% 0% -30% 0%)' }}>
              <motion.span
                className="flex flex-wrap items-baseline gap-x-4 selection-none"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ lineHeight: 1.0 }}
              >
                <span className="font-display font-light text-[#1C1915]"
                  style={{ fontSize: 'clamp(34px, 5.5vw, 96px)', letterSpacing: '-0.02em' }}>
                  Юридические
                </span>
                <span className="font-display font-black" style={{ fontSize: 'clamp(42px, 7.5vw, 128px)', color: '#1B4FD8', letterSpacing: '-0.03em' }}>
                  документы
                </span>
              </motion.span>
            </span>
          </h1>

          {/* Row 2: two-column — heading continues LEFT, document card RIGHT */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] gap-0 items-start">

            {/* Left: rest of heading + subtext + CTA */}
            <div>
              <div className="mb-1" style={{ clipPath: 'inset(-20% 0% -30% 0%)' }}>
                <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                  <span className="font-display font-black italic text-[#1C1915] selection-none block"
                    style={{ fontSize: 'clamp(42px, 7.5vw, 128px)', letterSpacing: '-0.03em', lineHeight: 1.0, opacity: 0.22 }}>
                    на все случаи
                  </span>
                </motion.div>
              </div>

              <div className="mb-12" style={{ clipPath: 'inset(-20% 0% -30% 0%)' }}>
                <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4">
                  <span className="font-display font-black text-[#1C1915] selection-none"
                    style={{ fontSize: 'clamp(42px, 7.5vw, 128px)', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
                    жизни
                  </span>
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="font-display text-[12px] font-semibold tracking-[0.14em] uppercase self-end mb-2"
                    style={{ color: '#C62828' }}>
                    {new Date().getFullYear()}
                  </motion.span>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-14">
                <p className="font-body text-[17px] md:text-[19px] text-[#8C8880] max-w-[340px] leading-relaxed" style={{ fontWeight: 400 }}>
                  Актуальные шаблоны с понятными инструкциями.<br />Быстро, надёжно и без лишней сложности.
                </p>
                <Link href="/categories" data-cursor="pointer" className="group flex items-center gap-4">
                  <span className="font-display text-[13px] tracking-[0.2em] uppercase text-[#1C1915] font-semibold transition-colors duration-300 group-hover:text-[#1B4FD8]">
                    Смотреть документы
                  </span>
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 border border-[#1C1915] rounded-full transition-all duration-500 group-hover:scale-[1.4] group-hover:border-[#1B4FD8] group-hover:opacity-0" />
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-colors duration-300 group-hover:text-[#1B4FD8]" aria-hidden="true">
                      <path d="M1 5H9M9 5L5.5 1.5M9 5L5.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Right: document card — appears under "документы" */}
            <motion.div
              className="hidden md:block relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 380, marginTop: -8 }}
            >
              <HeroAnimation />
            </motion.div>
          </div>

          {/* Mobile: animation below */}
          <motion.div className="relative mt-5 h-[220px] opacity-80 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 1 }}>
            <HeroAnimation />
          </motion.div>

        </div>

        {/* Scroll indicator — Figma-aligned: line above text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <motion.div
            className="w-[1px] bg-[#B8B4AE]"
            initial={{ height: 0 }}
            animate={{ height: 40 }}
            transition={{ delay: 1.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="font-display text-[9px] tracking-[0.35em] uppercase text-[#B8B4AE]">
            SCROLL
          </span>
        </motion.div>
      </motion.section>

      {/* ── О НАС ── */}
      <AboutSection totalDocs={totalDocs} />

      {/* ── CATEGORIES PREVIEW ── */}
      <section className="py-28 relative">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-16 lg:px-24">

          {/* Header row */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-[1px] bg-[#C62828]" />
                <span className="font-display text-[11px] tracking-[0.25em] uppercase text-[#8C8880]">Разделы</span>
              </div>
              <h2 className="font-display text-[40px] md:text-[60px] font-black text-[#1C1915] leading-none">
                Категории
              </h2>
            </div>
          </div>

          {/* Search bar */}
          {searchIndex.length > 0 && (
            <div className="relative z-30 mb-10">
              <CatalogSearch items={searchIndex} placeholder="Найти документ — брачный договор, алименты..." />
            </div>
          )}

          {/* Categories grid — folder cards */}
          {categories.length > 0 && (
            <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 sm:gap-8">
              {categories.map(({ id, title, url, count }, i) => (
                <FolderCard
                  key={id}
                  href={url}
                  number={pad2(i + 1)}
                  title={title}
                  count={count}
                  accent={ACCENTS[i % ACCENTS.length]}
                  isHovered={catHovered === id}
                  index={i}
                  animateIn={true}
                  onHoverStart={() => setCatHovered(id)}
                  onHoverEnd={() => setCatHovered(null)}
                />
              ))}
            </div>
          )}

          {/* View all categories button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mt-12"
          >
            <Link
              href="/categories"
              data-cursor="pointer"
              className="group flex items-center gap-4 rounded-2xl border border-[#E8E4DE] bg-white px-8 py-4 transition-all duration-300 hover:border-[#1B4FD8] hover:bg-[#F0F5FF]"
            >
              <span
                className="font-display text-[13px] font-semibold text-[#1C1915] group-hover:text-[#1B4FD8] transition-colors duration-300"
                style={{ letterSpacing: '0.01em' }}
              >
                Посмотреть все категории
              </span>
              <div className="w-7 h-7 rounded-full bg-[#1C1915] group-hover:bg-[#1B4FD8] flex items-center justify-center transition-colors duration-300">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 5h6M6 3l2 2-2 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── ЗАПРОСЫ ── */}
      <RequestsSection />

      {/* ── BOTTOM CTA ── */}
      <section className="px-5 py-20 sm:px-8 md:px-16 md:py-24 lg:px-24">
        <motion.div
          data-cursor="pointer"
          className="group relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'white',
            border: '1px solid #E8E4DE',
            boxShadow: '0 4px 32px rgba(28,25,21,0.06)',
          }}
          whileHover={{ y: -3, boxShadow: '0 24px 60px rgba(28,25,21,0.1)' }}
        >
          <Link href="/categories" className="block">
            {/* Blue ambient orb */}
            <div className="absolute top-0 right-0 w-[45%] h-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 90% 30%, rgba(27,79,216,0.1) 0%, transparent 65%)' }} />

            {/* § watermark */}
            <div className="font-display absolute right-10 top-1/2 -translate-y-1/2 font-black pointer-events-none select-none leading-none"
              style={{ fontSize: 'clamp(100px, 16vw, 220px)', color: '#1C1915', opacity: 0.04 }} aria-hidden="true">
              §
            </div>

            <div className="relative z-10 px-10 md:px-14 py-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-4 h-[1px] bg-[#C62828]" />
                  <span className="font-display text-[11px] tracking-[0.25em] uppercase text-[#8C8880]">Начать сейчас</span>
                </div>
                <h2
                  className="font-display font-black text-[#1C1915] leading-none"
                  style={{ fontSize: 'clamp(32px, 4.5vw, 72px)', letterSpacing: '-0.03em' }}
                >
                  Ваш правовой<br />
                  <span style={{ color: '#1B4FD8' }}>вопрос решён.</span>
                </h2>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-body text-[14px] text-[#8C8880] max-w-[180px] leading-relaxed hidden md:block">
                  {totalDocs ? `${withCount(totalDocs, TEMPLATES)}.` : 'Актуальные шаблоны.'} Сразу к использованию.
                </span>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-[#1C1915] transition-all duration-300 group-hover:scale-[1.08] group-hover:bg-[#1B4FD8]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 9h12M12 5l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
