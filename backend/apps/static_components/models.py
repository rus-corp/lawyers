from django.db import models

from apps.categories.models import Documents


class DocumentSidebar(models.Model):
    document = models.OneToOneField(
        Documents,
        on_delete=models.CASCADE,
        related_name='sidebar',
        verbose_name='Документ'
    )

    class Meta:
        verbose_name = 'Левая колонка документа'
        verbose_name_plural = 'Левые колонки документов'

    def __str__(self):
        return f'Левая колонка: {self.document.title}'



class DocumentSidebarSection(models.Model):
    class SectionType(models.TextChoices):
        INSTRUCTION = 'instruction', 'Инструкция'
        DATA = 'data', 'Данные'
        TIPS = 'tips', 'Советы'
        OTHER = 'other', 'Другое'

    sidebar = models.ForeignKey(
        DocumentSidebar,
        on_delete=models.CASCADE,
        related_name='sections'
    )
    title = models.CharField(max_length=355)
    section_type = models.CharField(max_length=20, choices=SectionType.choices, default=SectionType.OTHER)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Секция левой колонки'
        verbose_name_plural = 'Секции левой колонки'
        ordering = ('sort_order', 'id')

    def __str__(self):
        return f'{self.title} ({self.sidebar.document.title})'


class DocumentSidebarItem(models.Model):
    section = models.ForeignKey(
        DocumentSidebarSection,
        on_delete=models.CASCADE,
        related_name='items',
    )
    text = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Пункт секции левой колонки'
        verbose_name_plural = 'Пункты секций левой колонки'
        ordering = ('sort_order', 'id')

    def __str__(self):
        return f'Пункт {self.sort_order}: {self.section.title}'




class DocumentInstruction(models.Model):
    document = models.OneToOneField(
        Documents,
        on_delete=models.CASCADE,
        related_name='document_instruction',
        verbose_name='Документ'
    )
    title = models.CharField(max_length=355)
    description = models.TextField()

    class Meta:
        verbose_name = 'Статья инструкция к определенному документу'
        verbose_name_plural = 'Статьи инструкции к определенным документам'
    
    def __str__(self):
        return f'Статья-инструкция - {self.title}'