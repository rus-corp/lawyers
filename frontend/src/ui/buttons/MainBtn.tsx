"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import style from './main_btn.module.css'

import { MainBtnType } from '@/types';


export default function MainBtn({ btnTitle, handleRoute, paymentBtn }: MainBtnType) {
  const router = useRouter();
  const handleButtonClick = () => {
    if (paymentBtn) {
      paymentBtn(true)
    }
    if (handleRoute) { 
      router.push(handleRoute);
    }
  };
  return(
    <button
    className={style.mainBtn}
    onClick={handleButtonClick}
    >{btnTitle}</button>
  );
}