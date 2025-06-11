from django import forms
from .models import Category, Documents, Instructions


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Documents
        fields = ['title', 'slug', 'category', 'price', 'file']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['category'].queryset = Category.objects.filter(level=2, documents__isnull=True)



class CategoryAdminForm(forms.ModelForm):
    parent = forms.ModelChoiceField(queryset=Category.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        choices = []
        for level in range(0, 4):
            cats = Category.objects.filter(level=level)
            if cats.exists():
                group = (f'Уровень {level}', [(cat.pk, cat.title) for cat in cats])
                choices.append(group)
        self.fields['parent'].choices = choices


class InstructionAdminForm(forms.ModelForm):
    category = forms.ModelChoiceField(queryset=Category.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        choices = []
        for level in range(0, 4):
            cats = Category.objects.filter(level=level)
            if cats.exists():
                group = (f'Уровень {level}', [(cat.pk, cat.title) for cat in cats])
                choices.append(group)
        self.fields['category'].choices = choices
        