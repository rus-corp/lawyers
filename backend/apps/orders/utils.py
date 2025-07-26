from yookassa import Payment, Configuration
from celery import shared_task
import uuid
from django.core.mail import EmailMessage
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
        "return_url": 'https://сам-себе-юрист.рф/payment_page/success',
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
            "vat_code": 1,
            "payment_mode": "full_prepayment",
            "payment_subject": "service"
          }
        ]
      }
    }, idempotence_key)
    return payment
  except Exception as e:
    print(f"Error creating payment: {e}")
  


@shared_task
def send_document_to_email(document_id: str, client_email: str):
  mail_body = """
  Благодарим вас за оплату. Во вложении вы найдёте юридический документ, оформленный согласно вашему запросу.

  Если у вас возникнут вопросы по содержанию или потребуется дополнительная информация, не стесняйтесь обращаться к нам в ответ на это письмо.

  С уважением,
  Сам Себе Юрист
  info@сам-себе-юрист.рф
  сам-себе-юрист.рф
  """
  email = EmailMessage(
    subject="Документ",
    body=mail_body,
    from_email=settings.EMAIL_HOST_USER,
    to=[client_email]
  )
  document = Documents.objects.get(id=document_id)
  categories = document.category.get_ancestors(include_self=True)
  for category in categories:
    instructions = Instructions.objects.filter(category__slug=category.slug)
    for instruction in instructions:
      if instruction.file:
        email.attach_file(instruction.file.path)
      else:
        continue
  try:
    email.attach_file(document.file.path)
    email.send()
    logger.info(f'Клиенту {client_email} отправлены документы')
  except  Exception as e:
    logger.error(f'Документы клиенту {client_email} не отправлены')