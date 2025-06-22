
import AboutPageHeader from "@/components/about_page_component/AboutPageHeader";
import AboutPageContent from '@/components/about_page_component/AboutPageContent'
import { Metadata } from "next";
import { getPageMeta } from "@/api";

import style from './about_page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const response = await getPageMeta('about')
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}


export default function About() {
  return(
    <div className="container">
      <section className={style.aboutPage}>
        <AboutPageHeader />
        <AboutPageContent />
      </section>
    </div>
  );
}