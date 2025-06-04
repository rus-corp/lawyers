import React from 'react';

import style from '../docs_page.module.css'
import { DocProps } from '../types';



export default function DocItem({ params: { slug } }: DocProps) {
  return(
    <p>{slug}</p>
  );
}