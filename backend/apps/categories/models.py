from django.db import models
from django.utils import timezone
from mptt.models import MPTTModel, TreeForeignKey



class Category(MPTTModel):
  title = models.CharField(max_length=255, verbose_name='Название')
  slug = models.SlugField(max_length=255, unique=True, verbose_name='URL')
  parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children', verbose_name='Родительская категория')
  description = models.TextField(blank=True, default='', verbose_name='Описание', help_text='Одно-два предложения под заголовком категории или подраздела')
  updated_at = models.DateTimeField(auto_now=True, verbose_name='Изменено')

  def get_url(self):
    return '/categories/' + '/'.join(self.get_ancestors(include_self=True).values_list('slug', flat=True))

  def get_breadcrumbs(self):
    ancestors = list(self.get_ancestors(include_self=True))
    return [
      {'title': category.title, 'url': '/categories/' + '/'.join(item.slug for item in ancestors[:index + 1])}
      for index, category in enumerate(ancestors)
    ]

  class MPTTMeta:
    order_insertion_by = ['title']
  
  
  class Meta:
    verbose_name = 'Категория'
    verbose_name_plural = 'Категории'

  def __str__(self):
    return self.title



class Tag(models.Model):
  title = models.CharField(max_length=50, unique=True, verbose_name='Название')
  slug = models.SlugField(max_length=60, unique=True, verbose_name='URL')

  class Meta:
    verbose_name = 'Тег'
    verbose_name_plural = 'Теги'
    ordering = ['title']

  def __str__(self):
    return self.title



class Documents(models.Model):
  title = models.CharField(max_length=255, verbose_name='Название документа')
  file = models.FileField(verbose_name='Файл')
  slug = models.SlugField(max_length=255, unique=True, verbose_name='URL')
  price = models.IntegerField(verbose_name='Цена', default=0)
  description = models.TextField(blank=True, default='', verbose_name='Краткое описание', help_text='Одно-два предложения: показывается в карточке и под заголовком документа')
  pages = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Число страниц')
  tags = models.ManyToManyField(Tag, blank=True, related_name='documents', verbose_name='Теги')
  updated_at = models.DateTimeField(auto_now=True, verbose_name='Изменено')
  
  category = models.ForeignKey(
    Category,
    on_delete=models.CASCADE,
    related_name='documents',
    verbose_name='Категория',
    null=True,
    blank=True
  )
  
  
  class Meta:
    verbose_name = 'Документ'
    verbose_name_plural = 'Документы'
  
  def __str__(self):
    return self.title




class Instructions(models.Model):
  title = models.CharField(max_length=200, verbose_name='Название')
  category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='instructions', verbose_name='Категория')
  file = models.FileField(verbose_name='Файл', upload_to='instructions/', null=True, blank=True)


  class Meta:
    verbose_name = 'Инструкция'
    verbose_name_plural = 'Инструкции'
  

  def __str__(self):
    return self.title



TEXT_HELP = 'Абзацы разделяйте пустой строкой. Строки, которые начинаются с «- », станут списком.'


def touch_document(document_id):
  """A change to the page content moves the document's date in the sitemap."""
  Documents.objects.filter(pk=document_id).update(updated_at=timezone.now())


class Lawyer(models.Model):
  name = models.CharField('ФИО', max_length=150)
  slug = models.SlugField('URL', max_length=150, unique=True)
  position = models.CharField('Специализация', max_length=200, help_text='Например: юрист по семейным спорам')
  experience = models.CharField('Опыт', max_length=200, blank=True, help_text='Например: практика с 2012 года')
  photo = models.ImageField('Фото', upload_to='lawyers/', blank=True)
  bio = models.TextField('О юристе', blank=True)

  class Meta:
    verbose_name = 'Юрист'
    verbose_name_plural = 'Юристы'
    ordering = ['name']

  def __str__(self):
    return self.name


class DocumentContent(models.Model):
  """Text of the document page that is unique to this document."""

  document = models.OneToOneField(Documents, on_delete=models.CASCADE, related_name='content', verbose_name='Документ')
  seo_title = models.CharField(
    'Title для поисковиков', max_length=100, blank=True,
    help_text='До 60–70 символов. Пусто — собирается из названия документа.')
  seo_description = models.CharField(
    'Description для поисковиков', max_length=300, blank=True,
    help_text='До 160 символов. Пусто — берётся из вступления.')
  h1 = models.CharField('Заголовок на странице (H1)', max_length=255, blank=True, help_text='Пусто — название документа.')
  lead = models.TextField(
    'Вступление', blank=True,
    help_text='2–3 предложения: что это за документ и зачем он нужен. Показывается под заголовком.')
  when_needed = models.TextField('Когда нужен и кому подойдёт', blank=True, help_text='Конкретные жизненные ситуации. ' + TEXT_HELP)
  whats_inside = models.TextField('Что входит в шаблон', blank=True, help_text='Разделы документа. ' + TEXT_HELP)
  legal_basis = models.TextField('Правовые основания', blank=True, help_text='Статьи законов, на которые опирается документ. ' + TEXT_HELP)
  filing = models.TextField(
    'Куда и как подавать', blank=True,
    help_text='Суд или орган, подсудность, госпошлина, сроки. ' + TEXT_HELP)
  attachments = models.TextField('Какие документы приложить', blank=True, help_text=TEXT_HELP)
  preview = models.TextField(
    'Начало текста шаблона', blank=True,
    help_text='Шапка и первый раздел документа. Показываются на странице как предпросмотр. ' + TEXT_HELP)
  reviewed_by = models.ForeignKey(
    Lawyer, on_delete=models.SET_NULL, null=True, blank=True,
    related_name='reviewed_documents', verbose_name='Проверил юрист')
  reviewed_at = models.DateField('Дата проверки', null=True, blank=True)

  class Meta:
    verbose_name = 'Содержание страницы'
    verbose_name_plural = 'Содержание страницы'

  def __str__(self):
    return f'Содержание: {self.document}'

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    touch_document(self.document_id)

  def delete(self, *args, **kwargs):
    result = super().delete(*args, **kwargs)
    touch_document(self.document_id)
    return result


class DocumentFAQ(models.Model):
  document = models.ForeignKey(Documents, on_delete=models.CASCADE, related_name='faq', verbose_name='Документ')
  question = models.CharField('Вопрос', max_length=255)
  answer = models.TextField('Ответ', help_text=TEXT_HELP)
  order = models.PositiveSmallIntegerField('Порядок', default=0)

  class Meta:
    verbose_name = 'Вопрос и ответ'
    verbose_name_plural = 'Вопросы и ответы'
    ordering = ['order', 'id']

  def __str__(self):
    return self.question

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    touch_document(self.document_id)

  def delete(self, *args, **kwargs):
    result = super().delete(*args, **kwargs)
    touch_document(self.document_id)
    return result
