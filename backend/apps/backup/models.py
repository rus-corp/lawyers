from django.db import models

class BackUpForm(models.Model):
  name = models.CharField(max_length=150, verbose_name='Имя')
  phone = models.CharField(max_length=50, verbose_name='Телефон')
  email  = models.EmailField(max_length=155, verbose_name='Почта')
  text = models.TextField(max_length=1000, verbose_name='Сообщение')
  created_at = models.DateTimeField(auto_now_add=True, verbose_name='создано')

  class Meta:
    verbose_name = 'Обратная связь'
    verbose_name_plural = 'Обратные связи'

  def __str__(self):
    return self.name



