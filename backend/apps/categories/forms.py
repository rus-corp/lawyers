from django import forms
from .models import Category, Documents, Instructions


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Documents
        fields = ['title', 'slug', 'category', 'price', 'file', 'description', 'pages', 'tags']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        free_categories = Category.objects.filter(level=2, documents__isnull=True)
        # A document being edited keeps its own category in the list, otherwise it could not be saved.
        if self.instance.pk and self.instance.category_id:
            free_categories = free_categories | Category.objects.filter(pk=self.instance.category_id)
        self.fields['category'].queryset = free_categories.distinct()



class CategoryAdminForm(forms.ModelForm):
    parent = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        required=False,
        # empty_label='--- Корневая категория (Уровень 0) ---'
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        choices = []
        if not self.fields['parent'].required:
            choices.append(('', self.fields['parent'].empty_label))
        categories = Category.objects.all().order_by('tree_id', 'lft')

        for category in categories:
            INDENT = '\u00A0\u00A0\u00A0'
            indent = f"{INDENT * 3 * category.level}"
            label = f"{indent} {category.title}" if indent else category.title
            choices.append((category.pk, label))

        self.fields['parent'].choices = choices




class InstructionAdminForm(forms.ModelForm):
    category = forms.ModelChoiceField(queryset=Category.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        choices = []
        categories = Category.objects.all().order_by('tree_id', 'lft')

        for categ in categories:
            INDENT = '\u00A0\u00A0\u00A0'
            indent = f"{INDENT * 3 * categ.level}"
            label = f"{indent} {categ.title}" if indent else categ.title
            choices.append((categ.pk, label))

        self.fields['category'].choices = choices
        