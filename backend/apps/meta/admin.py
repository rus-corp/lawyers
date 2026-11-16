from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import reverse

from .models import MetaTags, SiteSettings


@admin.register(MetaTags)
class MetaTagsAdmin(admin.ModelAdmin):
  list_display = ('id', 'slug', 'title')
  search_fields = ('slug', 'title')


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
  fieldsets = (
    ('Аналитика и подтверждение прав', {
      'fields': ('metrika_id', 'yandex_verification', 'google_verification'),
      'description': 'Выводятся на всех страницах сайта. Изменения появляются на сайте в течение минуты.',
    }),
    ('Настроено на сервере', {
      'fields': ('site_address', 'protocol', 'charset'),
      'description': 'Только для просмотра: адрес и протокол задают nginx и SSL-сертификат, '
                     'http и www перенаправляются на основной адрес. Кодировка всегда UTF-8.',
    }),
  )
  readonly_fields = ('site_address', 'protocol', 'charset')

  @admin.display(description='Адрес сайта')
  def site_address(self, obj):
    return settings.SITE_URL

  @admin.display(description='Протокол')
  def protocol(self, obj):
    return settings.SITE_URL.split('://', 1)[0].upper()

  @admin.display(description='Кодировка')
  def charset(self, obj):
    return 'UTF-8'

  def has_add_permission(self, request):
    return not SiteSettings.objects.exists()

  def has_delete_permission(self, request, obj=None):
    return False

  # The single record opens straight away instead of a list with one row.
  def changelist_view(self, request, extra_context=None):
    if SiteSettings.objects.exists():
      return redirect(reverse('admin:meta_sitesettings_change', args=[1]))
    return redirect(reverse('admin:meta_sitesettings_add'))
