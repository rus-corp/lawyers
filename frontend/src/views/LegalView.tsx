import PageBar from '@/components/PageBar';
import { legalContent, type LegalPageId } from '@/data/legal';
import { pad2 } from '@/lib/text';

export default function LegalView({ pageId }: { pageId: LegalPageId }) {
  const page = legalContent[pageId];
  return (
    <main className="min-h-screen bg-[#F7F6F3]">
      <PageBar variant="flat" maxWidth={1100} backHref="/" backLabel="На главную" />
      <article className="mx-auto max-w-[900px] px-6 py-16 md:px-12 md:py-24">
        <div className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Правовая информация</div>
        <h1 className="font-display mb-6 break-words text-[36px] font-black leading-none tracking-[-0.035em] text-[#1C1915] sm:text-[44px] md:text-[68px]">
          {page.title}
        </h1>
        {page.updated && <p className="mb-6 text-[11px] uppercase tracking-[0.14em] text-[#8C8880]">{page.updated}</p>}
        {page.lead && <p className="max-w-2xl text-[16px] leading-relaxed text-[#8C8880]">{page.lead}</p>}
        <div className="mt-14 divide-y divide-[#E8E4DE] border-y border-[#E8E4DE]">
          {page.sections.map((section, index) => (
            <section key={section.title} className="grid gap-3 py-8 md:grid-cols-[64px_1fr]">
              <span className="text-[11px] text-[#C62828]">{pad2(index + 1)}</span>
              <div>
                <h2 className="font-display mb-3 text-[20px] font-bold text-[#1C1915]">{section.title}</h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="text-[14px] leading-7 text-[#6A6662]">{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
        {page.closing && <p className="mt-8 text-[14px] font-bold leading-7 text-[#1C1915]">{page.closing}</p>}
      </article>
    </main>
  );
}
