from django.db import models


class Order(models.Model):
  order_id = models.CharField(max_length=255, unique=True, verbose_name='ID заказа',)
  user_email = models.EmailField(verbose_name='Email пользователя', null=True, blank=True)
  description = models.CharField(max_length=155, verbose_name='Номер документа', null=True, blank=True)
  price = models.IntegerField(verbose_name='Цена')
  created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
  updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
  is_paid = models.BooleanField(default=False, verbose_name='Оплачен', null=True, blank=True)
  is_completed = models.BooleanField(default=False, verbose_name='Завершен', null=True, blank=True)
  is_canceled = models.BooleanField(default=False, verbose_name='Отменен', null=True, blank=True)

  class Meta:
    verbose_name = 'Заказ'
    verbose_name_plural = 'Заказы'
    ordering = ['-created_at']
  
  def __str__(self):
    return self.order_id