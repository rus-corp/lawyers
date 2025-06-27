"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import style from './docComponent.module.css'

import { DocumentType } from '@/app/docs/types';

import EmailModal from '@/ui/modal/EmailModal';
import MainBtn from '@/ui/buttons/MainBtn';

type Props = {
  initialData: DocumentType
}


export default function DocPageComponent({ initialData }: Props) {
  const router = useRouter();
  const [documentData, setDocument] = React.useState<DocumentType>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [handleRoute, setHandleRoute] = React.useState('')
  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setIsModalOpen(false)
    router.push(`/payment_page/?amount=${initialData?.price}&documentId=${initialData?.id}&userEmail=${email}`)
  };

  // const handleGetDocument = async () => {
  //   const doc = await getDocument(slug);
  //   setDocument(doc);
  // };

  // React.useEffect(() => {
  //   handleGetDocument();
  // }, [slug]);

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
                <Link href={'/payment_rules'}>условиями оплаты</Link>
              </div>
          </div>
        </div>
        <div className={style.payBtn}>
          <MainBtn
          btnTitle={`Оплатить документ ${initialData?.price} ₽`}
          paymentBtn={setIsModalOpen}
          />
        </div>
        <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSubmit}
        />
      </div>
      <div className="container">
        <div className={style.pageContent}>
          <div className={style.contentData}>
            <div className={style.contentItem}>
              <div className={style.contentDataTitle}>
                <h5>Вы получите:</h5>
              </div>
              <div className={style.contentDataList}>
                <p>- Готовый шаблон документа;</p>
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
              <div className={style.documentTitle}>{initialData?.category.title}</div>
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
    </section>
  );
}