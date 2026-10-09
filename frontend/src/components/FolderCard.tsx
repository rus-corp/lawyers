'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { TEMPLATES, withCount } from '@/lib/text';

const TAB_COLORS = ['#C62828','#1B4FD8','#2E7D32','#D4A017','#7B1FA2','#00838F','#E8600A','#1565C0'];

interface Props {
  href: string;
  number: string;
  title: string;
  count: number;
  accent: string;
  isHovered: boolean;
  index: number;
  animateIn?: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export default function FolderCard({
  href, number, title, count, accent, isHovered, index, animateIn = true,
  onHoverStart, onHoverEnd,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 220, damping: 24 });
  const springY = useSpring(rotY, { stiffness: 220, damping: 24 });

  const onMouseMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    rotX.set(-dy * 10);
    rotY.set( dx *  8);
  };
  const onMouseLeave = () => { rotX.set(0); rotY.set(0); };

  const enterProps = animateIn
    ? { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const } }
    : { initial: { opacity: 0, y: 20 }, animate:    { opacity: 1, y: 0 } };

  return (
    <motion.div
      ref={ref}
      data-cursor="category"
      className="relative select-none"
      {...enterProps}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 800 }}
    >
      <Link href={href} className="block rounded-2xl" onFocus={onHoverStart} onBlur={onHoverEnd}>
        <motion.div
          style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
          animate={{ y: isHovered ? -12 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Always-visible tabs on touch/mobile devices */}
          <div className="pointer-events-none absolute left-0 right-0 md:hidden" style={{ bottom: '100%', marginBottom: 2, zIndex: 20 }}>
            {TAB_COLORS.map((color, di) => {
              const total = TAB_COLORS.length;
              const tabW = 90 / total;
              const leftPct = di * (90 / (total - 1));
              return (
                <motion.div
                  key={color}
                  className="absolute rounded-t-md"
                  style={{ left: `${leftPct}%`, width: `${tabW}%`, height: 12, bottom: 0, background: color, zIndex: total - di }}
                  initial={{ y: 8, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 0.82 - di * 0.055 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.08 + di * 0.035 }}
                />
              );
            })}
          </div>

          {/* ── Bookmark tabs (fan up on hover) ── */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute left-0 right-0 hidden pointer-events-none md:block"
                style={{ bottom: '100%', marginBottom: 2, zIndex: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                {TAB_COLORS.map((color, di) => {
                  const total = TAB_COLORS.length;
                  const tabW = 90 / total;
                  const leftPct = di * (90 / (total - 1));
                  return (
                    <motion.div
                      key={di}
                      className="absolute rounded-t-md"
                      style={{ left: `${leftPct}%`, width: `${tabW}%`, height: 16, bottom: 0, background: color, zIndex: total - di }}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 0.9 - di * 0.07 }}
                      exit={{ y: 5, opacity: 0 }}
                      transition={{ duration: 0.26, delay: di * 0.025, ease: [0.16, 1, 0.3, 1] }}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Back sheets (depth) ── */}
          <motion.div
            className="absolute inset-x-0 rounded-2xl"
            style={{ top: 0, bottom: 0, background: 'white', border: '1px solid #E8E4DE' }}
            animate={{
              x: isHovered ? 6 : 3,
              y: isHovered ? 8 : 5,
              rotate: isHovered ? 2.5 : 1.5,
              scale: isHovered ? 0.97 : 0.98,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 rounded-2xl"
            style={{ top: 0, bottom: 0, background: 'white', border: '1px solid #EFEBE5' }}
            animate={{
              x: isHovered ? 3 : 1.5,
              y: isHovered ? 4 : 2.5,
              rotate: isHovered ? 1.2 : 0.7,
              scale: isHovered ? 0.985 : 0.99,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* ── Main card ── */}
          <motion.div
            className="relative rounded-2xl flex flex-col justify-between overflow-hidden"
            animate={{
              boxShadow: isHovered
                ? `0 28px 60px rgba(28,25,21,0.15), 0 8px 24px rgba(28,25,21,0.08)`
                : `0 2px 12px rgba(28,25,21,0.07)`,
            }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'white',
              border: '1px solid #E8E4DE',
              minHeight: 200,
              padding: '22px 22px 20px',
            }}
          >
            {/* Accent stripe — top */}
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-t-2xl"
              animate={{ height: isHovered ? 4 : 3, opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
              style={{ background: accent }}
            />

            {/* Number */}
            <div className="font-display pt-2" style={{ fontSize: 10, color: '#C8C4BE', letterSpacing: '0.1em' }}>
              {number}
            </div>

            {/* Title + count */}
            <div>
              <div
                className="font-display font-black text-[#1C1915] leading-tight mb-2"
                style={{ fontSize: 'clamp(18px, 2vw, 28px)', letterSpacing: '-0.02em' }}
              >
                {title}
              </div>
              <motion.div
                className="font-display"
                animate={{ color: isHovered ? accent : '#B8B4AE' }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}
              >
                {withCount(count, TEMPLATES)}
              </motion.div>
            </div>

            {/* Arrow — appears on hover */}
            <motion.div
              className="absolute bottom-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.6 }}
              transition={{ duration: 0.25 }}
              style={{ background: accent }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M1.5 4.5h6M5.5 2l2 2.5-2 2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>

        </motion.div>
      </Link>
    </motion.div>
  );
}
