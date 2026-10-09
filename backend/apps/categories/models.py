from django.db import models
from mptt.models import MPTTModel, TreeForeignKey



class Category(MPTTModel):
  title = models.CharField(max_length=255, verbose_name='Название')
  slug = models.SlugField(max_length=255, unique=True, verbose_name='URL')
  parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children', verbose_name='Родительская категория')
  description = models.TextField(blank=True, default='', verbose_name='Описание', help_text='Одно-два предложения под заголовком категории или подраздела')

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