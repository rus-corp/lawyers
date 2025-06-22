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
        // width={200}
        // height={200}
        sizes="(max-width: 768px) 100vw, 200px"
        fill
        />
      </div>
      <div className={style.itemContent}>
        <p>{content}</p>
      </div>
    </div>
  );
}