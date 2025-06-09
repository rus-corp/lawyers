
import AboutPageHeader from "@/components/about_page_component/AboutPageHeader";
import AboutPageContent from '@/components/about_page_component/AboutPageContent'

import style from './about_page.module.css'


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