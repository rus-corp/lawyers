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
    actions = ["change_price"]

    @admin.action(description="Изменить цену на подкатегории и документы")
    def change_price(self, request, queryset):
        from django import forms
        from django.contrib import messages
        from django.shortcuts import render

        class PriceForm(forms.Form):
            new_price = forms.IntegerField(label="Новая цена", min_value=0)
        if request.method == 'POST':
            form = PriceForm(request.POST)
            if form.is_valid():
                new_price = form.cleaned_data['new_price']
                print('new_price', new_price)
                count = 0
                for category in queryset:
                    children = category.get_descendants(include_self=True)
                    docs = Documents.objects.filter(category__in=children)
                    count += docs.update(price=new_price)
                messages.success(request, f"Обновлено {count} документов.")
                return
            else:
                messages.error(request, "Форма заполнена неверно. Пожалуйста, исправьте ошибки.")
        else:
            form = PriceForm()
        return render(request, 'admin/set_price.html', context={'form': form, 'categories': queryset})




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