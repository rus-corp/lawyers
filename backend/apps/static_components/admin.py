from django.contrib import admin

from .models import (
    DocumentSidebar,
    DocumentSidebarItem,
    DocumentSidebarSection,
    DocumentInstruction
)


class DocumentSidebarSectionInline(admin.TabularInline):
    model = DocumentSidebarSection
    extra = 1
    fields = ('title', 'section_type', 'sort_order')
    ordering = ('sort_order', 'id')


class DocumentSidebarItemInline(admin.TabularInline):
    model = DocumentSidebarItem
    extra = 1
    fields = ('text', 'sort_order')
    ordering = ('sort_order', 'id')


@admin.register(DocumentSidebar)
class DocumentSidebarAdmin(admin.ModelAdmin):
    list_display = ('id', 'document')
    list_display_links = ('id', 'document')
    search_fields = ('document__title', 'document__slug')
    autocomplete_fields = ('document',)
    inlines = (DocumentSidebarSectionInline,)


@admin.register(DocumentSidebarSection)
class DocumentSidebarSectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'sidebar', 'section_type', 'sort_order')
    list_display_links = ('id', 'title')
    list_filter = ('section_type',)
    search_fields = ('title', 'sidebar__document__title', 'sidebar__document__slug')
    autocomplete_fields = ('sidebar',)
    ordering = ('sort_order', 'id')
    inlines = (DocumentSidebarItemInline,)


@admin.register(DocumentSidebarItem)
class DocumentSidebarItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'section', 'sort_order')
    list_display_links = ('id', 'section')
    search_fields = (
        'text',
        'section__title',
        'section__sidebar__document__title',
        'section__sidebar__document__slug',
    )
    autocomplete_fields = ('section',)
    ordering = ('sort_order', 'id')


@admin.register(DocumentInstruction)
class DocumentInstructionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'document')
    search_fields = ('title', 'document__title')
    autocomplete_fields = ('document',)