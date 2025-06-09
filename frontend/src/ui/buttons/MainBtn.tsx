import React from 'react';

import style from './main_btn.module.css'

import { MainBtnType } from '@/types';


export default function MainBtn({ btnTitle }: MainBtnType) {
  return(
    <button className={style.mainBtn}>{btnTitle}</button>
  );
}