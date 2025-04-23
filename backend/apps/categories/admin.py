from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import Category

@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('title', 'slug', 'parent')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title',)
    list_filter = ('parent',)
    ordering = ('title',)