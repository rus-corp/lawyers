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