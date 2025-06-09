import React from 'react';

import style from './header.module.css'
import Image from 'next/image';
import Link from 'next/link';


export default function Header() {
  return(
    <header className={style.header}>
        <div className={style.companyLogo}>
          <Image src="/images/logo.png"
          priority={true}
          width={150}
          height={150}
          alt='logo'
          />
        </div>
        <div className={style.navMenu}>
          <Link href='/'>Главная</Link>
          <Link href='/categories'>Документы</Link>
          <Link href='/about'>О нас</Link>
          <Link href='/news'>Новости</Link>
        </div>
        <div className={style.contacts}>
          <span>info@сам-себе-юрист.рф</span>
        </div>
    </header>
  );
}