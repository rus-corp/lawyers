from django.apps import AppConfig


class StaticComponentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.static_components'
    verbose_name = 'Статика страниц'