import React, { useState } from 'react';

import style from './email_modal.module.css'
import { EmailModalProps } from './types';


export default function EmailModal({ isOpen, onClose, onSubmit }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    if (!email || !email.includes('@')) {
      alert('Введите корректный email');
      return;
    }
    setPending(true);
    setError('');
    try {
      await onSubmit(email.trim());
      onClose();
    } catch {
      setError('Не удалось отправить запрос. Проверьте почту и попробуйте ещё раз.');
    } finally {
      setPending(false);
    }
  };

  if (!isOpen) return null;
  
  return(
    <div className={style.modal_overlay}>
      <form className={style.modal} onSubmit={handleSubmit}>
        <h2>Введите ваш email</h2>
        <input
          required
          disabled={pending}
          type="email"
          className={style.email_input}
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p role="alert">{error}</p>
        <div className={style.modal_buttons}>
          <button type="button" disabled={pending} className={style.cancel_button} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" disabled={pending} className={style.submit_button}>
            {pending ? "Отправка…" : "Продолжить"}
          </button>
        </div>
      </form>
    </div>
  );
}