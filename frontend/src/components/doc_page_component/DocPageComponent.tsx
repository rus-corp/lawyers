"use client"
import React from 'react';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import style from './docComponent.module.css'

import { DocumentType } from '@/app/docs/types';
import { getDocumentInstruction, getDocumentSidebar } from '@/api/static';
import { documentSidebarFallback } from './documentSidebarFallback';

import EmailModal from '@/ui/modal/EmailModal';
import MainBtn from '@/ui/buttons/MainBtn';

type DocumentSidebarItemType = {
  id: number;
  text: string;
  sort_order: number;
}

type DocumentSidebarSectionType = {
  id: number;
  title: string;
  section_type: string;
  sort_order: number;
  items: DocumentSidebarItemType[];
}

type DocumentSidebarType = {
  id: number;
  document: {
    id: number;
    title: string;
    slug: string;
    price: number;
  };
  sections: DocumentSidebarSectionType[];
}

type DocumentInstructionType = {
  id: number;
  document: {
    id: number;
    title: string;
    slug: string;
    price: number;
  };
  title: string;
  description: string;
}

type Props = {
  initialData: DocumentType
}


export default function DocPageComponent({ initialData }: Props) {
  const router = useRouter();
  const [documentData, setDocument] = React.useState<DocumentType>();
  const [documentSidebar, setDocumentSidebar] = React.useState<DocumentSidebarType | null>(null);
  const [documentInstruction, setDocumentInstruction] = React.useState<DocumentInstructionType | null>(null);
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

  const handleGetDocumentSidebar = async () => {
    try {
      const response = await getDocumentSidebar(initialData.slug);
      setDocumentSidebar(response.data ?? null);
    } catch {
      setDocumentSidebar(null);
    }
  };

  const handleGetDocumentInstruction = async () => {
    try {
      const response = await getDocumentInstruction(initialData.slug);
      setDocumentInstruction(response.data ?? null);
    } catch {
      setDocumentInstruction(null);
    }
  };

  React.useEffect(() => {
    if (!initialData?.slug) return;

    handleGetDocumentSidebar();
    handleGetDocumentInstruction();
  }, [initialData?.slug]);

  const createSanitizedMarkup = (html: string) => ({
    __html: DOMPurify.sanitize(html),
  });

  const sidebarSections: DocumentSidebarSectionType[] = documentSidebar?.sections?.length
    ? documentSidebar.sections
    : documentSidebarFallback;

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
            {sidebarSections.map((section) => (
              <div key={section.id} className={style.contentItem}>
                <div className={style.contentDataTitle}>
                  <h5>{section.title}</h5>
                </div>
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={style.contentDataList}
                    dangerouslySetInnerHTML={createSanitizedMarkup(item.text)}
                  />
                ))}
              </div>
            ))}
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
        {documentInstruction ? (
              <div>
                <h3>{documentInstruction.title}</h3>
                <div dangerouslySetInnerHTML={createSanitizedMarkup(documentInstruction.description)} />
              </div>
            ) : null}
      </div>
    </section>
  );
}
