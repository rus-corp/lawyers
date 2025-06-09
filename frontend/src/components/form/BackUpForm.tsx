import React from 'react';

import style from './backUpForm.module.css'
import { CreateItemInput } from '@/ui/inputs/SearchInput';
import TextAreaComponent from '@/ui/inputs/TextArea';
import { FormDataType } from './types';
import MainBtn from '@/ui/buttons/MainBtn';
import { createBackUp } from '@/api';

export default function BackUpForm() {
  const [formData, setFormData] = React.useState<FormDataType>({
    name: '',
    email: '',
    phone: '',
    text: '',
  })
  const handleChange = (name: string, value: string) => {
    console.log(name, value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleSendBackup = async (data: FormDataType) => {
    const response = await createBackUp(data)
    if (response.status === 201) {
      console.log('Backup request sent successfully')
    }
  }

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    handleSendBackup(formData)
    setFormData({
      name: '',
      email: '',
      phone: '',
      text: '',
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
            fieldName={'text'}
            placeholder={'Сообщение'}
            fieldData={formData.text}
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