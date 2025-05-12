import React from 'react';
import Image from 'next/image';

import style from './styles/categoryBtn.module.css'
import { CategoryBtnType } from '@/types';

export const CategoryBtn = ({ title }: CategoryBtnType) => {
  return(
    <button className={style.btnContainer}>
      <div className={style.btnContent}>
        <Image
        src={'/icons/note-tak.png'}
        alt='doc'
        width={60}
        height={60}
        />
        <p>{title}</p>
      </div>
    </button>
  );
}