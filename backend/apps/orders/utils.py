from yookassa import Payment, Configuration
import uuid
from django.core.mail import EmailMessage
from django.conf import settings

from apps.categories.models import Documents, Instructions

Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY



def create_payment(amount: int, description: str):
  idempotence_key = str(uuid.uuid4())
  try:
    payment = Payment.create({
      "amount" : {
        "value": str(amount),
        "currency": "RUB"
      },
      "confirmation": {
        "type": "embedded"
      },
      "capture": True,
      "description": description
    }, idempotence_key)
    return payment
  except Exception as e:
    print(f"Error creating payment: {e}")
  



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
  categories = document.category.get_ancestors()
  for category in categories:
    instruction = Instructions.objects.filter(category__slug=category.slug).first()
    if instruction:
      email.attach_file(instruction.file.path)
    else:
      continue
  try:
    email.attach_file(document.file.path)
    email.send(fail_silently=False)
  except  Exception as e:
    print(f"Error sending email: {e}")