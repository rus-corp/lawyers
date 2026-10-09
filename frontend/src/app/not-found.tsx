import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-center px-6 py-24 md:px-16 lg:px-24">
      <div className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[#C62828]">Ошибка 404</div>
      <h1 className="font-display mb-8 max-w-3xl text-[42px] font-black leading-[0.92] tracking-[-0.045em] text-[#1C1915] sm:text-[54px] md:text-[88px]">
        Страница не найдена
      </h1>
      <p className="mb-10 max-w-xl text-[15px] leading-relaxed text-[#8C8880] md:text-[17px]">
        Возможно, документ переехал или ссылка устарела. Попробуйте найти его в каталоге.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/categories"
          data-cursor="pointer"
          className="bg-[#1B4FD8] px-8 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1438B0]"
        >
          Перейти в каталог
        </Link>
        <Link
          href="/"
          data-cursor="pointer"
          className="border border-[#E8E4DE] px-8 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1C1915] transition-colors hover:border-[#1C1915]"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
