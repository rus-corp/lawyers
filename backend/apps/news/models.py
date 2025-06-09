from django.db import models


class News(models.Model):
  title = models.CharField(max_length=200, verbose_name='Название')
  text = models.TextField(max_length=1500, verbose_name='Текст')
  img = models.ImageField(upload_to='news/images/', verbose_name='картинка', blank=True, null=True)
  slug = models.SlugField(max_length=255, verbose_name='слаг')
  created_at = models.DateField(auto_now_add=True)
  
  class Meta:
    verbose_name = 'Новость'
    verbose_name_plural = 'Новости'
  
  
  def __str__(self):
    return self.title