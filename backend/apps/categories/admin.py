from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .forms import DocumentForm, CategoryAdminForm, InstructionAdminForm

from .models import Category, Documents, Instructions

admin.site.site_header = 'Управление проектом Правовые документы'
admin.site.site_title = 'Правовые документы Admin'
admin.site.index_title = 'Админ панель'

@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    mptt_indented_field = 'title'
    list_display = ('pk', 'title', 'slug', 'parent')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('pk', 'title', 'slug')
    search_fields = ('title',)
    list_filter = ('parent',)
    # ordering = ('parent',)
    mptt_level_indent = 40
    form = CategoryAdminForm



@admin.register(Documents)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'title', 'price')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('id', 'title',)
    search_fields = ('title',)
    list_filter = ('title',)
    form = DocumentForm

    # def form_field_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "category":
    #         kwargs["queryset"] = Category.objects.all()
    #     return super().form_field_for_foreignkey(db_field, request, **kwargs)
    
    # def get_queryset(self, request):
    #     categories = Category.objects.filter(documents__isnull=False)
    #     return categories


@admin.register(Instructions)
class InstructionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'title',)
    form = InstructionAdminForm