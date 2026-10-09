import PageBar from '@/components/PageBar';
import FeedbackForm from '@/components/FeedbackForm';
import { CONTACT_EMAIL } from '@/lib/site';

export default function ContactsView() {
  return (
    <main className="min-h-screen bg-[#F7F6F3]">
      <PageBar variant="flat" maxWidth={1300} backHref="/" backLabel="На главную" right="Контакты" />
      <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Контакты</div>
            <h1 className="font-display mb-6 text-[42px] font-black leading-[0.92] tracking-[-0.045em] text-[#1C1915] sm:text-[52px] md:text-[76px]">
              Будем рады помочь
            </h1>
            <p className="mb-10 max-w-md text-[16px] leading-relaxed text-[#8C8880]">
              Если у вас возникли вопросы, идеи или вы просто хотите пообщаться, не стесняйтесь — напишите нам на почту
              или оставьте заявку.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-cursor="pointer"
              className="group flex max-w-md items-center justify-between gap-8 border border-[#E8E4DE] bg-white px-6 py-5 transition-colors hover:border-[#1B4FD8]"
            >
              <span>
                <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-[#8C8880]">Электронная почта</span>
                <span className="font-display text-[18px] font-bold text-[#1C1915]">{CONTACT_EMAIL}</span>
              </span>
              <span className="text-[#1B4FD8] transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div>
            <h2 className="font-display mb-3 text-[26px] font-black leading-tight text-[#1C1915]">Не нашли нужный документ?</h2>
            <p className="mb-7 text-[14px] leading-7 text-[#6A6662]">
              Оставьте заявку, и наш юрист свяжется с вами в ближайшее время.
            </p>
            <FeedbackForm />
          </div>
        </div>
      </div>
    </main>
  );
}
