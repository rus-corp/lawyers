"use client";
import YookassaComponent from "@/components/yookassa/YokassaComponent";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import style from './payment_page.module.css'

import { createNewOrder, getPaymentConfig } from "@/api/orders";
import { CreateOrderData } from "./types";


const PaymentPage = () => {
  const hasSentRef = useRef(false);
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const documentId = searchParams.get('documentId');
  const userEmail = searchParams.get('userEmail')
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null);
  const [message, setMessage] = useState('Загрузка формы оплаты...');
  const returnUrl = 'https://pravo-dok.ru/payment_page/success';


  const handleCreateOrder = async (createOrderData: CreateOrderData) => {
    if (!await getPaymentConfig()) {
      setMessage('Документы доступны бесплатно. Откройте страницу документа и нажмите «Отправить на почту».');
      return;
    }
    const response = await createNewOrder(createOrderData);
    if (response.status === 202) setMessage(response.data.message);
    if (response?.status === 201) {
      const confirmationUrl = response.data.confirmation_token;
      if (confirmationUrl) {
        window.location.href = confirmationUrl;
      }
    }
  }



  useEffect(() => {
    if (amount && documentId && userEmail && !hasSentRef.current) {
      const data = {
        price: Number(amount),
        description: String(documentId),
        user_email: String(userEmail)
      }
      handleCreateOrder(data).catch(() => setMessage('Не удалось выполнить запрос. Попробуйте ещё раз.'))
      hasSentRef.current = true;
    } else {
      setMessage('Откройте страницу документа, чтобы запросить его на почту.');
    }
  }, [])

  return (
    <section className={style.paymentPage}>
      <div className='container'>
        {confirmationToken ? (
          <>
            <h2>Оплата</h2>
            <YookassaComponent paymentToken={confirmationToken} returnUrl={returnUrl} />
          </>

        ) : (
          <p role="status">{message}</p>
        )}
      </div>
    </section>
  );
};

export default PaymentPage;