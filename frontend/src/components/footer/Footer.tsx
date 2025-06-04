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
              <h4>САМ СЕБЕ ЮРИСТ</h4>
            </div>
            <div className={style.companyContacts}>
              <p>+7 (777) 987 65 43</p>
              <p>sam.sebe.urist@mail.ru</p>
            </div>
          </div>
          <div className={style.aboutBlock}>
            <Link href={'/about'}>О нас</Link>
            <Link href={'/docs'}>Документы</Link>
            <Link href={'#'}>Контакты</Link>
          </div>
          <div className={style.aboutBlock}>
            <Link href={'/offer'}>Публичная оферта</Link>
            <Link href={'/politic'}>Политика конфиденциальности</Link>
            <Link href={'/payment'}>Условия оплаты</Link>
          </div>
        </div>
        <div className={style.dataFooter}>
          <p>© 2025 Сам Себе Юрист. Все права защищены</p>
        </div>

      </div>
    </footer>
  );
}