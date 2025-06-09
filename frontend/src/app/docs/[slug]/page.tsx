"use client"
import React from 'react';
import Link from 'next/link';

import style from '../docs_page.module.css'
import { DocProps, DocumentType } from '../types';
import { getDocument } from '../../../api';
import MainBtn from '@/ui/buttons/MainBtn';



export default function DocItem({ params: { slug } }: DocProps) {
  const [documentData, setDocument] = React.useState<DocumentType>();

  const handleGetDocument = async () => {
    const doc = await getDocument(slug);
    console.log(doc)
    setDocument(doc);
  };

  React.useEffect(() => {
    handleGetDocument();
  }, [slug]);

  return(
    <section className={style.docPage}>
      <div className={style.pageHeader}>
        <div className={style.headerContent}>
          <div className={style.headerTitle}>
            <h4>Документ будет доступен после подтверждения платежа</h4>
          </div>
          <div className={style.headerContent}>
            <p>Оплачивая документ Вы безоговорочно выражаете свое согласие с содержанием</p>
              <div className={style.links}>
                <Link href={'/offer'}>оферты</Link>  
                <Link href={'/politic'}>Политикой конфиденциальности</Link>и
                <Link href={'/payment'}>условиями оплаты</Link>
              </div>
          </div>
        </div>
        <div className={style.payBtn}>
          <MainBtn
          btnTitle={`Оплатить документ ${documentData?.price} ₽`}
          />
        </div>
      </div>
      <div className="container">
        <div className={style.pageContent}>
          <div className={style.contentData}>
            <div className={style.contentItem}>
              <div className={style.contentDataTitle}>
                <h5>Вы получите:</h5>
              </div>
              <div className={style.contentDataList}>
                <p>- Готовый шаблон искового заявления;</p>
                <p>- Подробную инструкцию по заполнению;</p>
                <p>- Пример, как правильно оформить документ;</p>
                <p>- Советы по подаче в суд или адресанту.</p>
              </div>
            </div>
            <div className={style.contentItem}>
              <div className={style.contentDataTitle}>
                <h5>Кому подойдёт данный документ:</h5>
              </div>
              <div className={style.contentDataList}>
                <p>- Вам отказали в возврате денег;</p>
                <p>- Работодатель нарушил ваши права;</p>
                <p>- Вам нужно подать заявление в суд без юриста.</p>
              </div>
            </div>
            <div className={style.contentItem}>
              <div className={style.contentDataTitle}>
                <h5>Как будет выглядеть документ:</h5>
              </div>
              <div className={style.contentDataList}>
                <p>- Формат: .docx (Word)</p>
                <p>- Адаптирован под гражданский/арбитражный процесс</p>
                <p>- Можно редактировать под вашу ситуацию</p>
              </div>
            </div>
          </div>
          <div className={style.contentDoc}>
            <div className={style.documentSkeleton}>
              <div className={style.documentTitle}>{documentData?.category.title}</div>
              <div className={`${style.skeletonLine} ${style.short}`}></div>
              <div className={`${style.skeletonLine} ${style.short} ${style.right}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>

              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.medium}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.medium}`}></div>

              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.medium}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.full}`}></div>
              <div className={`${style.skeletonLine} ${style.medium}`}></div>
            </div>
          </div>
        </div>
      </div>
      {/* <p>{slug}</p> */}
      {/* <p>docs page</p> */}
    </section>
  );
}