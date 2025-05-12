from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import Category, Documents


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('pk', 'title', 'slug', 'parent')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('pk', 'title', 'slug')
    search_fields = ('title',)
    list_filter = ('parent',)
    ordering = ('title',)



@admin.register(Documents)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('id', 'title',)
    search_fields = ('title',)
    list_filter = ('title',)