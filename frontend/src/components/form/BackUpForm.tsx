import React from 'react';

import style from './backUpForm.module.css'
import { CreateItemInput } from '@/ui/inputs/SearchInput';
import TextAreaComponent from '@/ui/inputs/TextArea';
import { FormDataType } from './types';
import MainBtn from '@/ui/buttons/MainBtn';

export default function BackUpForm() {
  const [formData, setFormData] = React.useState<FormDataType>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const handleChange = (name: string, value: string) => {
    console.log(name, value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    console.log(formData)
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
  }
  return(
    <form className={style.backupForm} onSubmit={handleSubmit}>
      <div className={style.formHeader}>
        <h3>Не нашли нужный документ?</h3>
        <p>Оставьте заявку и наш юрист свяжется с Вами в ближайшее время</p>
      </div>
      <div className={style.formFields}>
        <div className={style.formField}>
          <CreateItemInput
          fieldType='text'
          fieldName={'name'}
          value={formData.name}
          changeFunc={handleChange}
          placeholder='Ваше Имя'
          />
        </div>
        <div className={style.formField}>
          <CreateItemInput
          fieldType='text'
          fieldName={'email'}
          value={formData.email}
          changeFunc={handleChange}
          placeholder='Почта'
          />
        </div>
        <div className={style.formField}>
          <CreateItemInput
          fieldType='text'
          fieldName={'phone'}
          value={formData.phone}
          changeFunc={handleChange}
          placeholder='Телефон'
          />
          <div className={style.formField}>
            <TextAreaComponent
            fieldName={'message'}
            placeholder={'Сообщение'}
            fieldData={formData.message}
            handleChange={handleChange}
            />
          </div>
        </div>
      </div>
      <MainBtn
      btnTitle='Отправить'
      />
    </form>
  );
}