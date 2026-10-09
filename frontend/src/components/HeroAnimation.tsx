'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DOCS = [
  {
    title: 'Трудовой договор',
    subtitle: `№ 47 от ${new Date().getFullYear()} г.`,
    stamp: 'ПОДПИСАН',
    stampColor: '#1B4FD8',
    lines: [
      { w: 88, label: 'Работодатель: ООО «Формат»' },
      { w: 72, label: 'Работник: Иванова М.А.' },
      { w: 60, label: 'Должность: Менеджер' },
      { w: 80, label: '1. Предмет договора' },
      { w: 55, label: 'Срок: бессрочно' },
      { w: 76, label: 'Оклад: 95 000 ₽ / мес.' },
      { w: 45, label: 'Место работы: г. Москва' },
      { w: 68, label: '2. Права и обязанности' },
      { w: 50, label: 'Подписи сторон ↓' },
    ],
  },
  {
    title: 'Брачный договор',
    subtitle: 'Нотариально удостоверен',
    stamp: 'НОТАРИУС',
    stampColor: '#C62828',
    lines: [
      { w: 82, label: 'Супруг: Петров А.С.' },
      { w: 74, label: 'Супруга: Петрова Е.Д.' },
      { w: 90, label: '1. Общие положения' },
      { w: 62, label: 'Режим собственности' },
      { w: 70, label: 'Совместно нажитое имущество' },
      { w: 50, label: 'Раздельная собственность' },
      { w: 78, label: '3. Заключительные положения' },
      { w: 55, label: 'Нотариус: Смирнов И.В.' },
    ],
  },
  {
    title: 'Договор аренды',
    subtitle: 'Квартира, г. Москва',
    stamp: 'АКТИВЕН',
    stampColor: '#1B4FD8',
    lines: [
      { w: 78, label: 'Наймодатель: Соколов В.И.' },
      { w: 70, label: 'Наниматель: Кузнецова Л.Р.' },
      { w: 86, label: 'Адрес: ул. Пушкина, д. 12' },
      { w: 60, label: 'Площадь: 54 кв. м.' },
      { w: 72, label: 'Срок: 12 месяцев' },
      { w: 55, label: 'Оплата: 65 000 ₽ / мес.' },
      { w: 80, label: 'Залог: 65 000 ₽' },
      { w: 48, label: 'Подписи сторон ↓' },
    ],
  },
  {
    title: 'Доверенность',
    subtitle: 'Генеральная',
    stamp: 'ДЕЙСТВУЕТ',
    stampColor: '#C62828',
    lines: [
      { w: 76, label: 'Доверитель: Морозов П.А.' },
      { w: 68, label: 'Поверенный: Козлов С.В.' },
      { w: 90, label: 'Полномочия: все юр. действия' },
      { w: 58, label: 'Срок: до 31.12.2027' },
      { w: 74, label: 'Паспорт: 45 07 ******' },
      { w: 50, label: 'Нотариус удостоверил' },
      { w: 64, label: 'Реестровый № 1-2847' },
    ],
  },
];

type Phase = 'enter' | 'write' | 'exit';

export default function HeroAnimation() {
  const [docIndex, setDocIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('enter');
  const [writtenLines, setWrittenLines] = useState(0);
  const [folderPulse, setFolderPulse] = useState(false);

  const doc = DOCS[docIndex];

  // After enter, start writing
  useEffect(() => {
    if (phase !== 'enter') return;
    const t = setTimeout(() => setPhase('write'), 500);
    return () => clearTimeout(t);
  }, [phase]);

  // Write lines one by one
  useEffect(() => {
    if (phase !== 'write') return;
    if (writtenLines >= doc.lines.length) {
      // All lines written — pause then exit
      const t = setTimeout(() => setPhase('exit'), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setWrittenLines(n => n + 1), 160);
    return () => clearTimeout(t);
  }, [phase, writtenLines, doc.lines.length]);

  // On exit, fold into folder then next doc
  useEffect(() => {
    if (phase !== 'exit') return;
    const t = setTimeout(() => {
      setFolderPulse(true);
      setTimeout(() => setFolderPulse(false), 400);
      setDocIndex(i => (i + 1) % DOCS.length);
      setWrittenLines(0);
      setPhase('enter');
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" aria-hidden="true">

      {/* ── FOLDER ── */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20">
        <motion.div
          animate={folderPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <FolderIcon count={docIndex} accentColor={doc.stampColor} />
        </motion.div>
      </div>

      {/* ── DOCUMENT ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={docIndex}
          className="absolute z-10"
          style={{ top: '8%', left: '5%', right: '18%' }}
          /* Enter: slide down from top */
          initial={{ y: -60, opacity: 0, rotate: -3, scale: 0.94 }}
          animate={
            phase === 'exit'
              ? { y: 80, x: 80, opacity: 0, rotate: 8, scale: 0.55 }
              : { y: 0, opacity: 1, rotate: -1.5, scale: 1 }
          }
          transition={
            phase === 'exit'
              ? { duration: 0.65, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <DocCard doc={doc} writtenLines={writtenLines} />
        </motion.div>
      </AnimatePresence>

      {/* Ghost doc behind (next) */}
      <div
        className="absolute z-0 opacity-[0.07]"
        style={{ top: '14%', left: '11%', right: '24%', pointerEvents: 'none' }}
      >
        <DocCard doc={DOCS[(docIndex + 1) % DOCS.length]} writtenLines={0} ghost />
      </div>

    </div>
  );
}

/* ── DocCard ── */
function DocCard({
  doc, writtenLines, ghost,
}: {
  doc: typeof DOCS[0];
  writtenLines: number;
  ghost?: boolean;
}) {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        background: '#FEFCF9',
        border: '1px solid #E0DAD3',
        boxShadow: ghost ? 'none' : '0 24px 64px rgba(28,25,21,0.14), 0 4px 16px rgba(28,25,21,0.07)',
        padding: '28px 28px 24px',
      }}
    >
      {/* Header bar */}
      <div
        className="h-[2.5px] w-16 mb-5 rounded-full"
        style={{ background: doc.stampColor }}
      />

      {/* Title */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <div
            className="font-display font-black text-[15px] text-[#1C1915] leading-tight mb-0.5"
          >
            {doc.title}
          </div>
          <div
            className="font-display text-[10px] uppercase tracking-[0.2em] mb-5"
            style={{ color: '#8C8880' }}
          >
            {doc.subtitle}
          </div>
        </div>
        {/* Stamp badge */}
        <div
          className="font-display text-[8px] font-bold tracking-[0.18em] uppercase px-2 py-1 rounded-sm shrink-0 ml-3 mt-0.5"
          style={{
            border: `1px solid ${doc.stampColor}`,
            color: doc.stampColor,
            opacity: ghost ? 0 : 1,
          }}
        >
          {doc.stamp}
        </div>
      </div>

      {/* Animated text lines */}
      <div className="space-y-[7px]">
        {doc.lines.map((line, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Dot */}
            <div
              className="w-1 h-1 rounded-full shrink-0 transition-opacity duration-200"
              style={{
                background: i < writtenLines ? doc.stampColor : '#D8D3CC',
                opacity: ghost ? 0.4 : 1,
              }}
            />
            {/* Label */}
            <div
              className="font-display text-[9px] text-[#8C8880] transition-opacity duration-200 truncate shrink-0"
              style={{
                opacity: ghost ? 0 : i < writtenLines ? 0.75 : 0.2,
                maxWidth: `${line.w}%`,
              }}
            >
              {line.label}
            </div>
            {/* Animated underline */}
            <motion.div
              className="h-[1.5px] rounded-full"
              style={{ background: i < writtenLines ? '#E0DAD3' : '#EEEBE6', flex: 1, transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: ghost ? 1 : i < writtenLines ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Folder Icon ── */
function FolderIcon({ count, accentColor }: { count: number; accentColor: string }) {
  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Stack of saved docs behind */}
      {count > 1 && (
        <div className="absolute" style={{
          width: 64, height: 80, bottom: 20,
          background: 'white', border: '1px solid #E0DAD3', borderRadius: 6,
          transform: 'rotate(-4deg) translateX(-6px)',
          boxShadow: '0 2px 8px rgba(28,25,21,0.08)',
        }} />
      )}
      {count > 0 && (
        <div className="absolute" style={{
          width: 64, height: 80, bottom: 20,
          background: 'white', border: '1px solid #E8E4DE', borderRadius: 6,
          transform: 'rotate(3deg) translateX(4px)',
          boxShadow: '0 2px 8px rgba(28,25,21,0.07)',
        }} />
      )}

      {/* Main card */}
      <div className="relative" style={{
        width: 68, height: 84,
        background: 'white',
        border: '1px solid #E0DAD3',
        borderRadius: 8,
        boxShadow: '0 8px 28px rgba(28,25,21,0.13), 0 2px 8px rgba(28,25,21,0.07)',
        overflow: 'hidden',
      }}>
        {/* Accent stripe */}
        <div style={{ height: 3, background: accentColor, borderRadius: '8px 8px 0 0' }} />

        {/* Lines suggesting text */}
        <div className="px-3 pt-3 space-y-1.5">
          {[80, 60, 70, 50, 65].map((w, i) => (
            <div key={i} style={{
              height: 2.5, width: `${w}%`, borderRadius: 2,
              background: i === 0 ? '#1C1915' : '#E0DAD3',
              opacity: i === 0 ? 0.6 : 1,
            }} />
          ))}
        </div>

        {/* Count badge — bottom right */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1">
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: accentColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="font-display" style={{ fontSize: 9, fontWeight: 800, color: 'white' }}>
              {count}
            </span>
          </div>
        </div>
      </div>

      <div className="font-display" style={{ fontSize: 9, color: '#8C8880', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Архив
      </div>
    </div>
  );
}
