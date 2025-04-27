from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import Category

@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('pk', 'title', 'slug', 'parent')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('pk', 'title', 'slug')
    search_fields = ('title',)
    list_filter = ('parent',)
    ordering = ('title',)