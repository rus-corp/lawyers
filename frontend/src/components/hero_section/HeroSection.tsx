import React from 'react';
import Image from 'next/image';
import style from './hero_section.module.css'
import MainBtn from '@/ui/buttons/MainBtn';


export default function HeroSection() {
  return(
    <section className={style.heroSection}>
      <div className={style.mainBlock}>
        <div className={style.mainBlockContent}>
          <div className={style.blockHeader}>
            <h2>Юридические документы</h2>
            <h2>на все случаи жизни</h2>
          </div>
          <div className={style.blockDesc}>
            <h4>Быстро, надёжно, без лишнего</h4>
          </div>
          <div className={style.blockBtn}>
            <MainBtn
            handleRoute={'/categories'}
            btnTitle='Создать документ'
            />
          </div>
        </div>
        <div className={style.mainBlockImg}>
          <Image
          src={'/images/main_img.png'}
          alt='main_img'
          width={700}
          height={600}
          />
        </div>
      </div>
    </section>
  );
}