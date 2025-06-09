import React from 'react';

import style from './searchInput.module.css'
import { AreaInputProps } from './input_type';


export default function TextAreaComponent({
  fieldName,
  fieldData,
  placeholder,
  handleChange
}: AreaInputProps) {
  const handleChangeField = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = ev.target
    handleChange(name, value)
  }
  return(
    <div className={style.createField}>
      <textarea
      rows={4} cols={50}
      className={style.inputField}
      name={fieldName}
      value={fieldData}
      onChange={handleChangeField}
      placeholder={placeholder}
      />
    </div>
  );
}