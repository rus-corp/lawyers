import Image from 'next/image';
import style from '../advantages.module.css'

import { AdvItemType } from './adv_types';


export default function AdvantegeItem({ img_source, img_alt, content }: AdvItemType) {
  return(
    <div className={style.adBlockItem}>
      <div className={style.itemImg}>
        <Image
        src={img_source}
        alt={img_alt}
        layout="responsive"
        width={200}
        height={200}
        />
      </div>
      <div className={style.itemContent}>
        <p>{content}</p>
      </div>
    </div>
  );
}