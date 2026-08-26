from rest_framework import serializers

from apps.categories.models import Documents

from .models import (
    DocumentInstruction,
    DocumentSidebar,
    DocumentSidebarItem,
    DocumentSidebarSection,
)


class SidebarDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = ('id', 'title', 'slug', 'price')


class DocumentSidebarItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentSidebarItem
        fields = ('id', 'text', 'sort_order')


class DocumentSidebarSectionSerializer(serializers.ModelSerializer):
    items = DocumentSidebarItemSerializer(many=True, read_only=True)

    class Meta:
        model = DocumentSidebarSection
        fields = ('id', 'title', 'section_type', 'sort_order', 'items')


class DocumentSidebarSerializer(serializers.ModelSerializer):
    document = SidebarDocumentSerializer(read_only=True)
    sections = DocumentSidebarSectionSerializer(many=True, read_only=True)

    class Meta:
        model = DocumentSidebar
        fields = ('id', 'document', 'sections')


class DocumentInstructionSerializer(serializers.ModelSerializer):
    document = SidebarDocumentSerializer(read_only=True)

    class Meta:
        model = DocumentInstruction
        fields = ('id', 'document', 'title', 'description')
