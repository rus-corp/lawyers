import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Inter_Tight, Manrope } from 'next/font/google';
import './globals.css';
import CookieNotice from '@/components/CookieNotice';
import DeferredCursor from '@/components/DeferredCursor';
import PageTransition from '@/components/PageTransition';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import YandexMetrika from '@/components/YandexMetrika';
import { getSiteSettings } from '@/lib/server-api';
import { COOKIE_NOTICE, DEFAULT_DESCRIPTION, DEFAULT_TITLE, SHARE_IMAGE, SITE_NAME, SITE_URL, YANDEX_METRIKA_ID } from '@/lib/site';

// Every page reads from the API at request time; nothing is prerendered at build.
export const dynamic = 'force-dynamic';

// Only the upright style is loaded: the one italic line on the home page is slanted by the browser.
const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
});

const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'ru_RU',
    images: [SHARE_IMAGE],
  },
  twitter: { card: 'summary_large_image', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, images: [SHARE_IMAGE.url] },
};

// Ownership codes for Yandex.Webmaster and Google Search Console come from the admin settings.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const verification = {
    ...(settings?.yandex_verification ? { yandex: settings.yandex_verification } : {}),
    ...(settings?.google_verification ? { google: settings.google_verification } : {}),
  };
  return Object.keys(verification).length ? { ...BASE_METADATA, verification } : BASE_METADATA;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, cookieStore] = await Promise.all([getSiteSettings(), cookies()]);
  // An empty number in the admin switches the counter off; without an answer from the API
  // the previous counter keeps working.
  const metrikaId = settings ? settings.metrika_id : String(YANDEX_METRIKA_ID);

  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`${interTight.variable} ${manrope.variable}`}>
      <body>
        {/^\d+$/.test(metrikaId) && <YandexMetrika id={metrikaId} />}
        <div className="bg-[white] min-h-screen">
          <DeferredCursor />
          <SiteHeader />
          <div className="pt-28 md:pt-24">
            <PageTransition>{children}</PageTransition>
          </div>
          <SiteFooter />
        </div>
        {/* Rendered by the server, so it is not drawn late on top of a finished page and does not
            flash for visitors who have already closed it. */}
        {!cookieStore.has(COOKIE_NOTICE) && <CookieNotice />}
      </body>
    </html>
  );
}
