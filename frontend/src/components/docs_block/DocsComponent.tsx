'use client';
import React from 'react';
import Image from 'next/image';

import style from './docs_block.module.css'

import { getDocumentsList } from '@/api';
import { DocumentsType } from './types'
import { CreateItemInput } from '@/ui/inputs/SearchInput';

export default function DocsComponent() {
  const [documents, setDocuments] = React.useState<DocumentsType[]>([])
  const [seacrhDoc, setSearchDoc] = React.useState<string>('')
  const handleGetDocuments = async (): Promise<void> => {
    const response = await getDocumentsList();
    if (response && response.status === 200) {
      console.log(response.data);
      setDocuments(response.data);
    }
  }

  const handleSearch = (value: string) => {
    console.log(value);
    setSearchDoc(value);
  }

  React.useEffect(() => {
    handleGetDocuments()
  }, [])

  return(
    <section className={style.docsBlock}>
      <div className={style.docsBlockHeader}>
        <div className={style.headerTitle}>
          <h3>Документы</h3>
        </div>
        <div className={style.headerSearch}>
          <CreateItemInput
          fieldType='text'
          fieldName='search'
          value={seacrhDoc}
          changeFunc={handleSearch}
          />
        </div>
      </div>
      <div className={style.docksBlockContent}>
        <div className={style.blockContentHeader}>
          <p>Название</p>
          <p>Скачать</p>
        </div>
        {documents.map((item: DocumentsType) => (
          <DocumnetItem key={item.id}
          title={item.title}
          file={item.file}
          />
        ))}
      </div>
    </section>
  );
}


const DocumnetItem = ({
  title,
  file,
  slug,
  category,
}:DocumentsType) => {
  return (
    <a href={file} download>
      <div className={style.documentItem}>
        <Image
        src='/block_img/note_tak.png'
        width={32}
        height={32}
        alt='document icon'
        />
        <p>{title}</p>
      </div>
    </a>
  );
}