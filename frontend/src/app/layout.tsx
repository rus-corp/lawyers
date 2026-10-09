import type { Metadata } from 'next';
import { Inter_Tight, Manrope } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import PageTransition from '@/components/PageTransition';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import YandexMetrika from '@/components/YandexMetrika';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from '@/lib/site';

// Every page reads from the API at request time; nothing is prerendered at build.
export const dynamic = 'force-dynamic';

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`${interTight.variable} ${manrope.variable}`}>
      <body>
        <YandexMetrika />
        <div className="bg-[white] min-h-screen">
          <CustomCursor />
          <SiteHeader />
          <div className="pt-28 md:pt-24">
            <PageTransition>{children}</PageTransition>
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
