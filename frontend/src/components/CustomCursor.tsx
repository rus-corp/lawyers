'use client';

import { useEffect, useRef, useState } from 'react';

interface Pos { x: number; y: number; }

type HoverType = 'default' | 'pointer' | 'document' | 'category';

export default function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const gavelRef  = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const pos    = useRef<Pos>({ x: -200, y: -200 });
  const target = useRef<Pos>({ x: -200, y: -200 });
  const raf    = useRef<number>(0);

  const [hoverType, setHoverType] = useState<HoverType>('default');
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.12);

      const { x, y } = pos.current;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%,-50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      }
      if (gavelRef.current) {
        gavelRef.current.style.transform = `translate(${x + 18}px, ${y + 18}px)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      // detect hover type
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;
      const closest = el.closest('[data-cursor]') as HTMLElement | null;
      setHoverType((closest?.dataset.cursor as HoverType) || 'default');
    };

    let clickTimer = 0;
    const onClick = (e: MouseEvent) => {
      setClicking(true);
      if (rippleRef.current) {
        const r = rippleRef.current;
        r.style.left = `${e.clientX}px`;
        r.style.top  = `${e.clientY}px`;
        r.style.animation = 'none';
        void r.offsetWidth;
        r.style.animation = 'click-ripple 0.5s cubic-bezier(0.16,1,0.3,1) forwards';
      }
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => setClicking(false), 200);
    };

    document.documentElement.classList.add('has-custom-cursor');
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.clearTimeout(clickTimer);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const ringSize = hoverType === 'default' ? 36 : hoverType === 'pointer' ? 52 : 64;
  const ringOpacity = hoverType === 'default' ? 0.25 : 0.5;
  const showGavel = hoverType === 'document' || hoverType === 'category';

  return (
    <div className="custom-cursor" aria-hidden="true">
      {/* Red dot — primary cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width:  clicking ? 10 : 8,
          height: clicking ? 10 : 8,
          background: '#C62828',
          boxShadow: clicking
            ? '0 0 16px 5px rgba(198,40,40,0.8)'
            : '0 0 8px 2px rgba(198,40,40,0.55)',
          transform: 'translate(-200px, -200px)',
          transition: 'width 0.15s, height 0.15s, box-shadow 0.15s',
          willChange: 'transform',
        }}
      />

      {/* Outer ring — lagging cursor */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-[#C62828]"
        style={{
          width:   ringSize,
          height:  ringSize,
          opacity: ringOpacity,
          transform: 'translate(-200px, -200px)',
          transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s',
          willChange: 'transform',
        }}
      />

      {/* Gavel motif — subtle SVG near cursor when over document */}
      <div
        ref={gavelRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ opacity: showGavel ? 0.65 : 0, transform: 'translate(-200px, -200px)', transition: 'opacity 0.3s' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          {/* minimal gavel: a small rectangle (head) + thin line (handle) */}
          <rect x="1" y="5" width="7" height="3.5" rx="0.5" fill="#C62828" />
          <rect x="5.5" y="7" width="1.5" height="7" rx="0.5" fill="#C62828" />
        </svg>
      </div>

      {/* Click ripple */}
      <div
        ref={rippleRef}
        className="fixed pointer-events-none z-[9996] rounded-full border border-[#C62828]"
        style={{ width: 32, height: 32, marginLeft: -16, marginTop: -16, opacity: 0 }}
      />
    </div>
  );
}
