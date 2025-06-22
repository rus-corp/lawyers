"use client"
import React from 'react';

import style from './header.module.css'
import Image from 'next/image';
import Link from 'next/link';


export default function Header() {
  const [clicked, setClicked] = React.useState(false)
  const handleClick = () => {
    setClicked(!clicked)
  }
  return(
    <header className={style.header}>
      <Link href={'/'}>
        <div className={style.companyLogo}>
          <Image src="/images/logo.png"
          priority={true}
          width={150}
          height={150}
          alt='logo'
          />
        </div>
      </Link> 
        <div className={clicked ? `${style.navMenu}` : `${style.navMenu} ${style.open}`}>
          <Link href='/' onClick={handleClick}>Главная</Link>
          <Link href='/categories' onClick={handleClick}>Документы</Link>
          <Link href='/about' onClick={handleClick}>О нас</Link>
          <Link href='/news' onClick={handleClick}>Статьи</Link>
          <span>info@сам-себе-юрист.рф</span>
        </div>
        <div
        className={clicked ? `${style.burger}` : `${style.burger} ${style.active}`}
        onClick={handleClick}>
          <span></span>
        </div>
    </header>
  );
}