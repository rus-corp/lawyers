import React, { useState } from 'react';

import style from './email_modal.module.css'
import { EmailModalProps } from './types';


export default function EmailModal({ isOpen, onClose, onSubmit }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const handleSubmit = () => {
    if (!email || !email.includes('@')) {
      alert('Введите корректный email');
      return;
    }
    onSubmit(email);
    onClose();
  };

  if (!isOpen) return null;
  
  return(
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <h2>Введите ваш email</h2>
        <input
          type="email"
          className={style.email_input}
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={style.modal_buttons}>
          <button className={style.cancel_button} onClick={onClose}>
            Отмена
          </button>
          <button className={style.submit_button} onClick={handleSubmit}>
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}