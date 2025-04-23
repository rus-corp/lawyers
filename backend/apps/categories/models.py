from django.db import models
from mptt.models import MPTTModel, TreeForeignKey



class Category(MPTTModel):
  title = models.CharField(max_length=255, verbose_name='Название')
  slug = models.SlugField(max_length=255, unique=True, verbose_name='URL')
  parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children', verbose_name='Родительская категория')

  class MPTTMeta:
    order_insertion_by = ['title']
  
  
  class Meta:
    verbose_name = 'Категория'
    verbose_name_plural = 'Категории'

  def __str__(self):
    return self.title