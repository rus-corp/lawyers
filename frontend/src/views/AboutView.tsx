'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import PageBar from '@/components/PageBar';
import { FONT_BODY, FONT_DISPLAY } from '@/lib/fonts';

interface Props {
  totalDocs: number | null;
  sectionsCount: number | null;
}

const WHY = [
  {
    n: '01',
    title: 'Актуальность и надёжность',
    desc: 'Все документы составлены профессиональными юристами и соответствуют последним изменениям законодательства.',
    accent: '#C62828',
    bg: '#FDF5F4',
    graphic: <CheckGraphic />,
  },
  {
    n: '02',
    title: 'Простота использования',
    desc: 'Каждый шаблон снабжён понятными пояснениями. Создание документа — максимально удобно для пользователей без юридического образования.',
    accent: '#1B4FD8',
    bg: '#F2F5FF',
    graphic: <StepsGraphic />,
  },
  {
    n: '03',
    title: 'Экономия времени и денег',
    desc: 'Качественный документ за считанные минуты, не тратя время на поездки к юристам и значительные суммы на их услуги.',
    accent: '#C62828',
    bg: '#FDF5F4',
    graphic: <TimeGraphic />,
  },
  {
    n: '04',
    title: 'Разнообразие тем',
    desc: 'Гражданские, семейные, трудовые, жилищные, административные дела и шаблоны для бизнеса — всё в одном месте.',
    accent: '#1B4FD8',
    bg: '#F2F5FF',
    graphic: <CategoriesGraphic />,
  },
  {
    n: '05',
    title: 'Юридическая самостоятельность',
    desc: 'Каждый человек имеет право понимать и использовать закон в своих интересах. Мы помогаем действовать грамотно.',
    accent: '#C62828',
    bg: '#FDF5F4',
    graphic: <PersonGraphic />,
  },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Graphic: animated checkmark document
function CheckGraphic() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" aria-hidden="true">
      <motion.rect x="20" y="10" width="56" height="72" rx="4"
        fill="#FDF5F4" stroke="#C62828" strokeWidth="1.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }}
      />
      {[0,1,2,3].map(i => (
        <motion.line key={i} x1="30" y1={26 + i * 12} x2={54 - i * 4} y2={26 + i * 12}
          stroke="#C62828" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.16,1,0.3,1] }}
          style={{ transformOrigin: '30px center' }}
        />
      ))}
      <motion.circle cx="84" cy="72" r="20" fill="#C62828"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.16,1,0.3,1] }}
        style={{ transformOrigin: '84px 72px' }}
      />
      <motion.path d="M74 72l6 6 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      />
    </svg>
  );
}

// Graphic: 3-step flow
function StepsGraphic() {
  const steps = ['Выбери', 'Получи', 'Заполни'];
  return (
    <svg width="160" height="60" viewBox="0 0 160 60" fill="none" aria-hidden="true">
      {steps.map((label, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.16,1,0.3,1] }}
        >
          <circle cx={24 + i * 56} cy={24} r={16} fill="#1B4FD8" fillOpacity={0.08 + i * 0.06} stroke="#1B4FD8" strokeWidth="1.5"/>
          <text x={24 + i * 56} y={28} textAnchor="middle" fill="#1B4FD8" fontSize="10" style={{ fontFamily: FONT_DISPLAY }} fontWeight="700">{i+1}</text>
          <text x={24 + i * 56} y={52} textAnchor="middle" fill="#1B4FD8" fontSize="8" style={{ fontFamily: FONT_BODY }} fillOpacity="0.7">{label}</text>
          {i < 2 && (
            <motion.path d={`M${40 + i * 56} 24 L${64 + i * 56} 24`}
              stroke="#1B4FD8" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
            />
          )}
        </motion.g>
      ))}
    </svg>
  );
}

// Graphic: time/cost comparison
function TimeGraphic() {
  return (
    <svg width="140" height="90" viewBox="0 0 140 90" fill="none" aria-hidden="true">
      {/* Юрист */}
      <motion.rect x="10" y="30" width="44" height="50" rx="3" fill="#C62828" fillOpacity="0.08"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16,1,0.3,1] }}
        style={{ transformOrigin: '32px 80px' }}
      />
      <motion.rect x="10" y="30" width="44" height="50" rx="3" fill="none" stroke="#C62828" strokeWidth="1.2" strokeOpacity="0.3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      />
      <text x="32" y="25" textAnchor="middle" fill="#C62828" fontSize="8" style={{ fontFamily: FONT_BODY }} fillOpacity="0.6">Юрист</text>
      <text x="32" y="72" textAnchor="middle" fill="#C62828" fontSize="9" style={{ fontFamily: FONT_DISPLAY }} fontWeight="800">₽₽₽</text>
      {/* ПРАВОДОК */}
      <motion.rect x="68" y="62" width="44" height="18" rx="3" fill="#C62828"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.16,1,0.3,1] }}
        style={{ transformOrigin: '90px 80px' }}
      />
      <text x="90" y="25" textAnchor="middle" fill="#C62828" fontSize="8" style={{ fontFamily: FONT_BODY }} fillOpacity="0.6">ПРАВОДОК</text>
      <text x="90" y="75" textAnchor="middle" fill="white" fontSize="8" style={{ fontFamily: FONT_DISPLAY }} fontWeight="700">5 мин</text>
      {/* axis */}
      <line x1="6" y1="80" x2="130" y2="80" stroke="#E8E4DE" strokeWidth="1"/>
      <motion.path d="M120 80 L130 80" stroke="#C62828" strokeWidth="1.2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }}
      />
    </svg>
  );
}

// Graphic: category bubbles
function CategoriesGraphic() {
  const cats = ['Семья', 'Труд', 'Жильё', 'Бизнес', 'Суд', 'Дарение'];
  const positions = [[20,20],[80,12],[140,22],[18,56],[96,50],[148,58]];
  return (
    <svg width="180" height="80" viewBox="0 0 180 80" fill="none" aria-hidden="true">
      {cats.map((cat, i) => (
        <motion.g key={cat}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: [0.16,1,0.3,1] }}
          style={{ transformOrigin: `${positions[i][0]}px ${positions[i][1]}px` }}
        >
          <rect
            x={positions[i][0] - 24} y={positions[i][1] - 12}
            width={48} height={24} rx="12"
            fill={i % 2 === 0 ? '#1B4FD8' : '#C62828'}
            fillOpacity={0.1 + i * 0.03}
            stroke={i % 2 === 0 ? '#1B4FD8' : '#C62828'}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <text
            x={positions[i][0]} y={positions[i][1] + 4}
            textAnchor="middle"
            fill={i % 2 === 0 ? '#1B4FD8' : '#C62828'}
            fontSize="8" style={{ fontFamily: FONT_DISPLAY }} fontWeight="600"
          >
            {cat}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

// Graphic: person with scale/balance icon
function PersonGraphic() {
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" fill="none" aria-hidden="true">
      {/* Person */}
      <motion.circle cx="50" cy="18" r="12" fill="#C62828" fillOpacity="0.12" stroke="#C62828" strokeWidth="1.5"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16,1,0.3,1] }}
        style={{ transformOrigin: '50px 18px' }}
      />
      <motion.path d="M28 56c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#C62828" fillOpacity="0.08" stroke="#C62828" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
      {/* Balance / scale */}
      <motion.line x1="50" y1="62" x2="50" y2="80" stroke="#C62828" strokeWidth="1.5"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        style={{ transformOrigin: '50px 62px' }}
      />
      <motion.line x1="30" y1="68" x2="70" y2="68" stroke="#C62828" strokeWidth="1.5" strokeLinecap="round"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        style={{ transformOrigin: '50px 68px' }}
      />
      <motion.circle cx="30" cy="72" r="5" fill="#C62828" fillOpacity="0.15" stroke="#C62828" strokeWidth="1.2"
        initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.16,1,0.3,1] }}
      />
      <motion.circle cx="70" cy="72" r="5" fill="#C62828" fillOpacity="0.15" stroke="#C62828" strokeWidth="1.2"
        initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.16,1,0.3,1] }}
      />
    </svg>
  );
}

export default function AboutView({ totalDocs, sectionsCount }: Props) {
  const [activeReason, setActiveReason] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveReason(current => (current + 1) % WHY.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  const activeItem = WHY[activeReason];

  const stats = [
    totalDocs ? { value: String(totalDocs), label: 'Шаблонов\nдокументов' } : { value: 'DOCX', label: 'Редактируемый\nформат' },
    sectionsCount ? { value: String(sectionsCount), label: 'Тематических\nразделов' } : { value: '.doc', label: 'Готовый файл\nк печати' },
    { value: '5 мин', label: 'На подготовку\nдокумента' },
    { value: '100%', label: 'Соответствие\nзаконодательству' },
  ];

  return (
    <div className="min-h-screen bg-white">

      <PageBar backHref="/" backLabel="Главная" right="О нас" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-16 lg:px-24 pt-12 pb-24">

        {/* Hero */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-3 h-[1px] bg-[#C62828]" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#8C8880]" style={{ fontFamily: FONT_DISPLAY }}>
              О платформе
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-end">
            <h1>
              {['Делаем право', 'доступным', 'каждому'].map((word, i) => (
                <span key={i} className="block" style={{ clipPath: 'inset(-20% 0% -30% 0%)' }}>
                  <motion.span
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.08 }}
                    className="block font-black leading-none"
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 'clamp(40px, 6vw, 96px)',
                      letterSpacing: '-0.04em',
                      color: i === 1 ? '#C62828' : '#1C1915',
                    }}
                  >
                    {word}{' '}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="pb-2"
            >
              <p className="text-[16px] text-[#4A4642] leading-[1.75]" style={{ fontFamily: FONT_BODY }}>
                <span className="font-bold text-[#1C1915]">ПРАВОДОК</span> — это современный онлайн-сервис, созданный для тех, кто стремится грамотно и самостоятельно решать юридические вопросы.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <FadeIn className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: '1px solid #E8E4DE', borderBottom: '1px solid #E8E4DE' }}>
            {stats.map((s, i) => (
              <div
                key={i}
                className="py-8 px-6 flex flex-col gap-2"
                style={{ borderRight: i < 3 ? '1px solid #E8E4DE' : 'none' }}
              >
                <span
                  className="font-black leading-none"
                  style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(28px, 3vw, 44px)', letterSpacing: '-0.03em', color: i % 2 === 0 ? '#C62828' : '#1B4FD8' }}
                >
                  {s.value}
                </span>
                <span className="text-[11px] text-[#8C8880] leading-snug whitespace-pre-line" style={{ fontFamily: FONT_BODY }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Mission */}
        <FadeIn className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-[1px] bg-[#1B4FD8]" />
                <span className="text-[10px] tracking-[0.28em] uppercase text-[#8C8880]" style={{ fontFamily: FONT_DISPLAY }}>
                  Миссия
                </span>
              </div>
            </div>
            <div>
              <p
                className="text-[#1C1915] leading-[1.75]"
                style={{ fontFamily: FONT_BODY, fontSize: 'clamp(16px, 1.4vw, 20px)' }}
              >
                Наша миссия — сделать право доступным каждому, а подготовку юридических документов — простой, понятной и быстрой задачей. Мы уверены, что в большинстве жизненных ситуаций человек способен справиться без привлечения дорогостоящих специалистов, если у него есть качественный, правильно составленный шаблон и чёткие инструкции.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* What we offer */}
        <FadeIn className="mb-28">
          <div
            className="rounded-3xl p-10 md:p-14"
            style={{ background: 'linear-gradient(135deg, #FDF5F4 0%, #F2F5FF 100%)', border: '1px solid #E8E4DE' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-[1px] bg-[#C62828]" />
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#8C8880]" style={{ fontFamily: FONT_DISPLAY }}>
                Что мы предлагаем
              </span>
            </div>
            <p className="text-[15px] md:text-[17px] text-[#1C1915] leading-[1.8] max-w-3xl" style={{ fontFamily: FONT_BODY }}>
              Широкий выбор готовых юридических шаблонов, включая{' '}
              {['договоры', 'исковые заявления', 'жалобы', 'заявления', 'ходатайства', 'досудебные претензии'].map((w, i, arr) => (
                <span key={w}>
                  <span className="font-semibold text-[#1C1915]">{w}</span>
                  {i < arr.length - 1 ? ', ' : ' '}
                </span>
              ))}
              и другие виды документов. Все шаблоны разработаны с учётом действующего законодательства Российской Федерации и регулярно обновляются нашими юристами.
            </p>
          </div>
        </FadeIn>

        {/* Why us — dynamic story */}
        <FadeIn>
          <section className="relative overflow-hidden rounded-[32px] bg-[#151C32] p-6 text-white sm:p-9 lg:p-12">
            <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-[#1B4FD8]/25 blur-3xl" />

            <div className="relative mb-10 flex flex-col gap-4 border-b border-white/15 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-4 bg-[#6E9BFF]" />
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/50">Почему выбирают нас</span>
                </div>
                <h2 className="text-[40px] font-black leading-none tracking-[-0.04em] sm:text-[54px]" style={{ fontFamily: FONT_DISPLAY }}>
                  5 причин доверять
                </h2>
              </div>
              <div className="text-[11px] leading-relaxed text-white/40">Переключается автоматически<br className="hidden md:block" /> или выберите причину</div>
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="flex flex-col">
                {WHY.map((item, index) => {
                  const active = activeReason === index;
                  return (
                    <button
                      key={item.n}
                      type="button"
                      onClick={() => setActiveReason(index)}
                      onMouseEnter={() => setActiveReason(index)}
                      className={`group relative flex items-center gap-5 border-b border-white/10 px-3 py-5 text-left transition-all sm:px-5 ${active ? 'bg-white text-[#151C32]' : 'text-white/55 hover:text-white'}`}
                    >
                      <span className={`text-[10px] tracking-[0.16em] ${active ? 'text-[#1B4FD8]' : 'text-white/30'}`}>{item.n}</span>
                      <span className="text-[15px] font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{item.title}</span>
                      <span className={`ml-auto text-[14px] transition-transform ${active ? 'translate-x-0 text-[#1B4FD8]' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>→</span>
                      {active && (
                        <motion.div
                          layoutId="reason-progress"
                          className="absolute bottom-0 left-0 h-[2px] bg-[#1B4FD8]"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 4.2, ease: 'linear' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.n}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-3xl bg-white p-7 text-[#1C1915] sm:p-10"
                  >
                    <div className="absolute -right-4 -top-10 select-none text-[150px] font-black leading-none opacity-[0.035]" style={{ color: activeItem.accent, fontFamily: FONT_DISPLAY }}>{activeItem.n}</div>
                    <div className="relative mb-auto flex min-h-32 items-center">{activeItem.graphic}</div>
                    <div className="relative">
                      <div className="mb-5 h-[3px] w-10 rounded-full" style={{ background: activeItem.accent }} />
                      <h3 className="mb-4 text-[27px] font-black leading-tight tracking-[-0.025em] sm:text-[34px]" style={{ fontFamily: FONT_DISPLAY }}>{activeItem.title}</h3>
                      <p className="max-w-xl text-[14px] leading-7 text-[#6A6662] sm:text-[15px]">{activeItem.desc}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </FadeIn>

      </div>
    </div>
  );
}
