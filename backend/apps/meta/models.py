import re

from django.core.exceptions import ValidationError
from django.db import models

class MetaTags(models.Model):
  slug = models.CharField(
    max_length=255,
    help_text='Путь страгицы (без начального "/", например: about, categories/слаг категории)',
    verbose_name='Путь'
  )
  title = models.CharField(max_length=255, verbose_name='Title')
  description = models.TextField(verbose_name='Description', blank=True)
  keywords = models.CharField(max_length=255, blank=True, verbose_name='Keywords')

  class Meta:
    verbose_name = 'Мета Тег'
    verbose_name_plural = 'Мета Теги'

  def __str__(self):
    return self.title


# The counter the site used before this setting existed.
DEFAULT_METRIKA_ID = '102650009'


def extract_metrika_id(value: str) -> str:
  """Accepts the counter number or the whole Metrika snippet and returns the number."""
  value = value.strip()
  if not value or value.isdigit():
    return value
  match = re.search(r'ym\(\s*(\d+)', value) or re.search(r'mc\.yandex\.ru/watch/(\d+)', value)
  if not match:
    raise ValidationError('Укажите номер счётчика (только цифры) или вставьте код Метрики целиком.')
  return match.group(1)


def extract_verification_code(value: str) -> str:
  """Accepts the code or the whole <meta ... content="..."> tag and returns the code."""
  value = value.strip()
  match = re.search(r'content\s*=\s*["\']([^"\']+)["\']', value)
  if match:
    value = match.group(1).strip()
  if value and not re.fullmatch(r'[A-Za-z0-9_-]+', value):
    raise ValidationError('Код может содержать только латинские буквы, цифры, «-» и «_».')
  return value


class SiteSettings(models.Model):
  """Settings that apply to every page of the site. There is only one record."""

  metrika_id = models.CharField(
    'Яндекс Метрика: номер счётчика',
    # Long enough for a pasted snippet; only the number is stored.
    max_length=2000, blank=True, default=DEFAULT_METRIKA_ID,
    help_text='Номер счётчика, например 102650009. Можно вставить код Метрики целиком — номер извлечётся сам. '
              'Пусто — счётчик на сайте не выводится.',
  )
  yandex_verification = models.CharField(
    'Яндекс.Вебмастер: код подтверждения',
    max_length=500, blank=True,
    help_text='Значение content из мета-тега yandex-verification. Можно вставить мета-тег целиком.',
  )
  google_verification = models.CharField(
    'Google Search Console: код подтверждения',
    max_length=500, blank=True,
    help_text='Значение content из мета-тега google-site-verification. Можно вставить мета-тег целиком.',
  )

  class Meta:
    verbose_name = 'Настройки сайта'
    verbose_name_plural = 'Настройки сайта'

  def __str__(self):
    return 'Настройки сайта'

  def clean(self):
    errors = {}
    for field, extract in (('metrika_id', extract_metrika_id),
                           ('yandex_verification', extract_verification_code),
                           ('google_verification', extract_verification_code)):
      try:
        setattr(self, field, extract(getattr(self, field)))
      except ValidationError as error:
        errors[field] = error.messages
    if errors:
      raise ValidationError(errors)

  def save(self, *args, **kwargs):
    self.pk = 1
    # Creating the record a second time updates the existing one.
    kwargs['force_insert'] = False
    super().save(*args, **kwargs)

  @classmethod
  def load(cls):
    """The saved record, or the defaults while nothing has been saved yet."""
    return cls.objects.filter(pk=1).first() or cls(pk=1)
