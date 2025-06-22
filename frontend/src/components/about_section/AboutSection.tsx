import React from 'react';
import Image from 'next/image';
import style from './about_section.module.css'


export default function AboutSection() {
  return(
    <section className={style.aboutSection}>
      <div className={style.blockImg}>
        <Image
        src={'/images/about_sec.png'}
        alt='about_img'
        width={600}
        height={600}
        />
      </div>
      <div className={style.blockContent}>
        <div className={style.blockHeader}>
          <h3>О сервисе</h3>
        </div>
        <div className={style.blockDesc}>
          <p>
            Онлайн-сервис "Сам Себе Юрист".
            Сервис предлагает интерактивное создание готовых правовых или
            процессуальных документов на основе имеющихся шаблонов.
          </p>
          <br></br>
          <p>
            Готовые образцы юридических документов — быстро, понятно, актуально
            Подготовьте досудебную претензию, иск или заявление без юриста — скачайте шаблон, отредактируйте и подавайте.
          </p>

        </div>
      </div>
    </section>
  );
}