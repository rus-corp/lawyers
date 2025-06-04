from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import Category, Documents

admin.site.site_header = 'Управление проектом Сам Себе Юрист'
admin.site.site_title = 'Сам Себе Юрист Admin'
admin.site.index_title = 'Админ панель'

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
    list_display = ('id', 'title', 'category', 'price')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('id', 'title',)
    search_fields = ('title',)
    list_filter = ('title',)