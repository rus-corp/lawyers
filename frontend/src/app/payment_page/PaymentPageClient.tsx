"use client";
import YookassaComponent from "@/components/yookassa/YokassaComponent";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import style from './payment_page.module.css'

import { createNewOrder } from "@/api";
import { CreateOrderData } from "./types";


const PaymentPage = () => {
  const hasSentRef = useRef(false);
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const documentId = searchParams.get('documentId');
  const userEmail = searchParams.get('userEmail')
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null);
  const returnUrl = 'https://сам-себе-юрист.рф/payment/success';


  const handleCreateOrder = async (createOrderData: CreateOrderData) => {
    const response = await createNewOrder(createOrderData);
    if (response?.status === 201) {
      setConfirmationToken(response.data.confirmation_token);
    }
  }



  useEffect(() => {
    if (amount && documentId && userEmail && !hasSentRef.current) {
      const data = {
        price: Number(amount),
        description: String(documentId),
        user_email: String(userEmail)
      }
      handleCreateOrder(data)
      hasSentRef.current = true;
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
          <p>Загрузка формы оплаты...</p>
        )}
      </div>
    </section>
  );
};

export default PaymentPage;