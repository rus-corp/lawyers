import React from 'react';
import type { Metadata } from "next";
import { getPageMeta } from "@/api";


import style from './payment.module.css'



export async function generateMetadata(): Promise<Metadata> {
  const response = await getPageMeta('payment_rules')
  if (!response) return {}
  return {
    title: response.title,
    description: response.description,
    keywords: response.keywords,
  };
}



export default function PAaymentComponent() {
  return (
    <section className={style.paymentModule}>
      <div className="container">
        <div className={style.blockHeader}>
          <h3>УСЛОВИЯ ОПЛАТЫ И ВОЗРАТА</h3>
          <div className={style.blockDate}>
            <p>По состоянию на 01 июня 2025 года</p>
          </div>
        </div>
        <div className={style.blockContent}>
          <div className={style.contentItem}>
            <p>После нажатия кнопки «Оплатить» Вы перейдете на специальную защищенную 
              платежную страницу сервиса ЮKassa. На платежной странице будет указан 
              номер заказа и сумма платежа. Для оплаты Вам необходимо ввести данные 
              своей банковской карты и подтвердить платеж, нажав на кнопку «Оплатить». 
              Если Ваша карта поддерживает технологию 3-D Secure, Вам будет предложено 
              пройти стандартную одноминутную процедуру проверки владельца карты на сайте 
              Вашего банка.
            </p>
            <p>
              Обращаем Ваше внимание, что после проведения платежа на Ваш электронный 
              адрес может прийти подтверждение оплаты. Просим Вас сохранять данный документ. 
            </p>
            <p>
              Мы принимаем платежи по следующим банковским картам: МИР, VISA, MasterCard, Maestro, AmExpress
            </p>
          </div>
          <div className={style.contentItem}>
            <h4>ВОЗВРАТ</h4>
            <span>Согласно статьи 18 Закона Российской Федерации от 7 февраля 1992 года №2300-1 «О защите прав потребителей» в случае обнаружения недостатков потребитель вправе по своему выбору:</span>
            <ul>
              <li>- потребовать соразмерного уменьшения покупной цены</li>
              <li>- отказаться от исполнения договора купли-продажи и потребовать возврата уплаченной суммы</li>
              <li>- расторгнуть договор и прекратить использование сайта.</li>
            </ul>
          </div>
          <div className={style.contentItem}>
            <h4>ОТМЕНА ЗАКАЗА</h4>
            <p>
              При аннулировании позиций из оплаченного заказа 
              (или при аннулировании заказа целиком) по уважительным причинам, не связанными с виной потребителя, 
              Вы можете заказать другие услуги на эту сумму, либо вернуть всю сумму на карту, предварительно написав письмо 
              на электронную почту.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}