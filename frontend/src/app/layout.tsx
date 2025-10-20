export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import { getPageMeta } from "@/api";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ['400', '700'],
});


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export async function generateMetadata(): Promise<Metadata> {
//   console.log('gen meta')
//   const response = await getPageMeta('home')
//   console.log('meta res', response)
//   if (!response) return {}
//   return {
//     title: response.title,
//     description: response.description,
//     keywords: response.keywords,
//   };
// }

export const metadata: Metadata = {
  title: 'Онлайн-сервис "ПРАВОДОК".',
  description: "'ПРАВОДОК' – помощь в составлении исковых заявлений, досудебных претензий, ходатайств и договоров."
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(102650009, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />
      </head>
      <body className={manrope.className}>
        <noscript><div><img src="https://mc.yandex.ru/watch/102650009" style={{ position: 'absolute', left: '-9999px' }} alt="" /></div></noscript>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
