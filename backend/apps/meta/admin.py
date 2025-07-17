from django.contrib import admin

from .models import MetaTags


@admin.register(MetaTags)
class MetaTagsAdmin(admin.ModelAdmin):
  list_display = ('id', 'slug', 'title')
  search_fields = ('slug', 'title')
  
