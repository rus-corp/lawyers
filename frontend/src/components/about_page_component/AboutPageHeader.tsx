import React from 'react';
import Image from 'next/image';
import style from './styles/about_main.module.css'


export default function AboutPageHeader() {
  return(
    <aside className={style.aboutHeader}>
      <div className={style.mainHeader}>
        <div className={style.headerBlock}>
          <h2>Делаем право доступным каждому</h2>
        </div>
        <div className={style.imgBlock}>
          <Image
          src={'/about_img/eco_img.png'}
          alt='about_main'
          width={800}
          height={800}
          />
        </div>
      </div>
    </aside>
  );
}