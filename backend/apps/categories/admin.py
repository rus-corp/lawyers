from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .forms import DocumentForm, CategoryAdminForm, InstructionAdminForm

from .models import Category, DocumentContent, DocumentFAQ, Documents, Instructions, Lawyer, Tag

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




class DocumentContentInline(admin.StackedInline):
    model = DocumentContent
    can_delete = False
    max_num = 1
    fieldsets = (
        ('Для поисковиков', {'fields': ('seo_title', 'seo_description', 'h1')}),
        ('Текст страницы', {
            'fields': ('lead', 'when_needed', 'whats_inside', 'legal_basis', 'filing', 'attachments', 'preview'),
            'description': 'Пустые разделы на сайте не показываются.',
        }),
        ('Проверка юристом', {'fields': ('reviewed_by', 'reviewed_at')}),
    )


class DocumentFAQInline(admin.StackedInline):
    model = DocumentFAQ
    extra = 1
    fields = ('question', 'answer', 'order')


@admin.register(Lawyer)
class LawyerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'position')
    list_display_links = ('id', 'name')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Documents)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'title', 'price', 'pages')
    prepopulated_fields = {'slug': ('title',)}
    list_display_links = ('id', 'title', 'category')
    search_fields = ('title',)
    list_filter = ('title',)
    autocomplete_fields = ('tags',)
    form = DocumentForm
    inlines = (DocumentContentInline, DocumentFAQInline)

    # def form_field_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "category":
    #         kwargs["queryset"] = Category.objects.all()
    #     return super().form_field_for_foreignkey(db_field, request, **kwargs)
    
    # def get_queryset(self, request):
    #     categories = Category.objects.filter(documents__isnull=False)
    #     return categories


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug')
    list_display_links = ('id', 'title')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title',)


@admin.register(Instructions)
class InstructionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'title',)
    form = InstructionAdminForm