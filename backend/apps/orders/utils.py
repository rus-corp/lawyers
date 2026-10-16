from yookassa import Payment, Configuration
from celery import shared_task
import time
import uuid
from django.core.mail import EmailMessage, get_connection
from django.conf import settings

import logging
logger = logging.getLogger('django')

from apps.categories.models import Documents, Instructions

Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY



def create_payment(amount: int, client_email: str, document_name: str, description: int):
  idempotence_key = str(uuid.uuid4())
  try:
    payment = Payment.create({
      "amount" : {
        "value": str(amount),
        "currency": "RUB"
      },
      "confirmation": {
        "type": "redirect",
        "return_url": 'https://pravo-dok.ru/payment_page/success',
      },
      "capture": True,
      "receipt": {
        "customer": {
          "email": client_email
        },
        "items": [
          {
            "description": f"Проект документа '{document_name[:100]}'",
            "quantity": 1.000,
            "amount": {
              "value": str(amount),
              "currency": "RUB"
            },
            "vat_code": 9,
            "payment_mode": "full_prepayment",
            "payment_subject": "service"
          }
        ]
      }
    }, idempotence_key)
    return payment
  except Exception as e:
    print(f"Error creating payment: {e}")
  


# Pauses before repeated attempts to reach the mail server. Each stays under the broker's
# one-hour visibility timeout, otherwise a delayed task could run twice and send two letters.
RETRY_DELAYS = [60, 300, 900, 1800, 1800]
# The first connection to the mail server after a pause sometimes stalls in the TLS handshake,
# while the next one goes through at once.
CONNECT_ATTEMPTS = 3


def open_mail_connection():
  connection = get_connection()
  for attempt in range(CONNECT_ATTEMPTS):
    try:
      connection.open()
      return connection
    except OSError as e:
      if attempt == CONNECT_ATTEMPTS - 1:
        raise
      logger.warning(f'Почтовый сервер не ответил ({e}), подключаюсь ещё раз')
      time.sleep(2)


def notify_admin(text: str):
  try:
    connection = open_mail_connection()
    try:
      connection.send_messages([EmailMessage(
        subject="Документ",
        body=text,
        from_email=settings.EMAIL_HOST_USER,
        to=['info@pravo-dok.ru']
      )])
    finally:
      connection.close()
  except Exception as e:
    logger.error(f'Не удалось уведомить администратора: {text} ({e})')


@shared_task(bind=True, max_retries=len(RETRY_DELAYS))
def send_document_to_email(self, document_id: str, client_email: str, paid: bool = True):
  greeting = "Благодарим вас за оплату." if paid else "Благодарим вас за обращение."
  mail_body = f"""
  {greeting} Во вложении вы найдёте юридический документ, оформленный согласно вашему запросу.

  Если у вас возникнут вопросы по содержанию или потребуется дополнительная информация, не стесняйтесь обращаться к нам в ответ на это письмо.

  С уважением,
  Правовые
  Документы
  info@pravo-dok.ru
  pravo-dok.ru
  """
  email = EmailMessage(
    subject="Документ",
    body=mail_body,
    from_email=settings.EMAIL_HOST_USER,
    to=[client_email]
  )
  document = Documents.objects.filter(id=document_id).first()
  if not document:
    logger.error(f'Не найден документ с id {document_id} для клиента {client_email}')
    notify_admin(f"Не найден документ с id:{document_id}! Отправьте на почту клиенту {client_email}")
    return
  categories = document.category.get_ancestors(include_self=True) if document.category else []
  for category in categories:
    instructions = Instructions.objects.filter(category__slug=category.slug)
    for instruction in instructions:
      if instruction.file:
        try:
          email.attach_file(instruction.file.path)
        except Exception as e:
          logger.error(f'Инструкция {instruction.pk} не приложена к письму клиенту {client_email}: {e}')
  try:
    email.attach_file(document.file.path)
  except Exception as e:
    # A missing file will not appear by itself, so there is nothing to retry.
    logger.error(f'Документы клиенту {client_email} не отправлены: нет файла документа {document_id} ({e})')
    notify_admin(f"Не смог отправить письмо клиенту {client_email}: нет файла документа {document_id}")
    return
  try:
    # Nothing has been sent while connecting, so only this step is retried on the spot.
    connection = open_mail_connection()
    try:
      connection.send_messages([email])
    finally:
      connection.close()
  except OSError as e:
    # Timeouts, refused connections and SMTP errors are usually temporary.
    attempt = self.request.retries
    if attempt < self.max_retries:
      delay = RETRY_DELAYS[attempt]
      logger.warning(f'Документы клиенту {client_email} не отправлены: {e}. Попытка {attempt + 2} через {delay // 60} мин.')
      raise self.retry(exc=e, countdown=delay)
    logger.error(f'Документы клиенту {client_email} не отправлены {e}')
    notify_admin(f"Не смог отправить письмо клиенту {client_email}")
    return
  logger.info(f'Клиенту {client_email} отправлены документы')
