import React from 'react';

import style from './header.module.css'
import Image from 'next/image';
import Link from 'next/link';


export default function Header() {
  return(
    <header className={style.header}>
        <div className={style.companyLogo}>
          <Image src="/images/small_logo.png"
          width={150}
          height={150}
          alt='logo'
          />
        </div>
        <div className={style.navMenu}>
          <Link href='/#'>Главная</Link>
          <Link href='/docs'>Документы</Link>
          <Link href='/about'>О нас</Link>
          <Link href='/#'>Контакты</Link>
        </div>
        <div className={style.contacts}>
          <span>+7 (777) 987-65-43</span>
        </div>
    </header>
  );
}