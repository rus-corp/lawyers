from django.contrib import admin

from .models import News


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
  list_display = ('id', 'title', 'created_at')
  list_display_links = ('id', 'title',)
  search_fields = ('title', 'created_at')
  prepopulated_fields = {'slug': ('title',)}