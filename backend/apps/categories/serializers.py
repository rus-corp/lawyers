from rest_framework import serializers

from .models import Category, Documents


class CategorySerializer(serializers.ModelSerializer):
  url = serializers.CharField(source='get_url', read_only=True)
  breadcrumbs = serializers.ListField(source='get_breadcrumbs', read_only=True)
  documents_count = serializers.IntegerField(read_only=True)
  
  class Meta:
    model = Category
    fields = ('id', 'title', 'slug', 'description', 'documents_count', 'url', 'breadcrumbs')



class DocumentsSerializer(serializers.ModelSerializer):
  category = CategorySerializer(read_only=True)
  url = serializers.CharField(source='category.get_url', read_only=True)
  tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='title')
  
  class Meta:
    model = Documents
    fields = ('id', 'title', 'slug', 'category', 'price', 'url', 'description', 'pages', 'tags')



class DocumentListSerializer(serializers.ModelSerializer):
  # URLs and sections come from maps built once per request, so the list costs no query per document.
  url = serializers.SerializerMethodField()
  section = serializers.SerializerMethodField()
  tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='title')

  class Meta:
    model = Documents
    fields = ('id', 'title', 'slug', 'price', 'url', 'description', 'pages', 'tags', 'section')

  def get_url(self, document):
    return self.context['urls'][document.category_id]

  def get_section(self, document):
    return self.context['sections'].get(document.category_id)