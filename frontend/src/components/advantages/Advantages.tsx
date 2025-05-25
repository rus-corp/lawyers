import React from 'react';
import Image from 'next/image';
import style from './advantages.module.css'
import AdvantegeItem from './partials/AdvantegeItem';


export default function Advantages() {
  return(
    <section className={style.advantegesSection}>
      <div className={style.blockContent}>
        <div className={style.blockHeader}>
          <h3>Преимущества</h3>
        </div>
        <div className={style.advanContent}>
        <AdvantegeItem
          img_source={'/block_img/progress.png'}
          img_alt={'timeimg'}
          content={'Быстрая подготовка'}
          />
          <AdvantegeItem
          img_source={'/block_img/achievement.png'}
          img_alt={'garimg'}
          content={'Правовая уверенность'}
          />
          <AdvantegeItem
          img_source={'/block_img/targe.png'}
          img_alt={'protimg'}
          content={'Гарантия защиты'}
          />
          <AdvantegeItem
          img_source={'/block_img/eco_img.png'}
          img_alt={'ecoimg'}
          content={'Экономия средств'}
          />
        </div>
      </div>
    </section>
  );
}