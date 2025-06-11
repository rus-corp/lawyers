import React from 'react';

import style from './contacts.module.css'
import BackUpForm from '@/components/form/BackUpForm';


export default function Contacts() {
  return(
    <section className={style.contactsPage}>
      <div className="container">
        <div className={style.pageHeader}>
          <h3>Наши Контакты</h3>
        </div>
        <div className={style.headerDesc}>
          <p>Будем рады помочь! Если у вас возникли вопросы, идеи или вы просто хотите пообщаться, не стесняйтесь — здесь вы найдете всю необходимую информацию для связи с нами.</p>
        </div>
        <div className={style.companyInfo}>
          <div className={style.infoHeader}>
            <h5>Наши реквизиты:</h5>
          </div>
          <div className={style.infoContent}>
            <p>Название: Индивидуальный предприниматель Давыдов Вадим Анатольевич</p>
            <p>ИНН: 771886673828</p>
            <p>Расчётный счёт:	40802810838000228773</p>
            <p>Название банка-получателя	ПАО Сбербанк</p>
            <p>Корреспондентский счёт	30101810400000000225</p>
            <p>ОГРН 	322774600149529</p>
            <p>БИК	044525225</p>
            <p>Адрес: Москва ул Жебрунова 6 с1 офис 330</p>
          </div>
        </div>
        <div className={style.formContainer}>
          <BackUpForm />
        </div>
      </div>
    </section>
  );
}