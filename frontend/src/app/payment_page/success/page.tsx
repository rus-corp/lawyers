import React from 'react';
import Image from 'next/image';
import style from './payment_success.module.css'
import MainBtn from '@/ui/buttons/MainBtn';

export default function PaymentSuccessPage() {
  return(
    <section className={style.paymentSuccess}>
      <div className="container">
        <div className={style.sectionBlock}>
          <div className={style.imageBlock}>
            <Image
            src={'/icons/vector.png'}
            width={150}
            height={150}
            alt='success'
            />
          </div>
          <div className={style.blockContent}>
            <h2>УСПЕШНО</h2>
            <p>Спасибо! Оплата прошла успешно. Документ будет отправлен на Ваш Email в течении пары минут</p>
            <MainBtn
            btnTitle='Вернуться на главную'
            handleRoute='/'
            />
          </div>
        </div>

      </div>
    </section>
  );
}