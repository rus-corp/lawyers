import React from 'react';
import Link from 'next/link';
import style from './footer.module.css'


export default function Footer() {
  return(
    <footer className={style.footer}>
      <div className="container">
        <div className={style.mainFooterBlock}>
          <div className={style.companyBlock}>
            <div className={style.companyName}>
              <h4>Правовые документы</h4>
            </div>
            <div className={style.companyContacts}>
              <p>info@pravo-dok.ru</p>
            </div>
          </div>
          <div className={style.aboutBlock}>
            <Link href={'/about'}>О нас</Link>
            <Link href={'/categories'}>Документы</Link>
            <Link href={'/contacts'}>Контакты</Link>
          </div>
          <div className={style.aboutBlock}>
            <Link href={'/offer'}>Публичная оферта</Link>
            <Link href={'/politic'}>Политика конфиденциальности</Link>
            <Link href={'/payment_rules'}>Условия оплаты</Link>
          </div>
        </div>
        <div className={style.dataFooter}>
          <p>© 2025 Правовые документы. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}