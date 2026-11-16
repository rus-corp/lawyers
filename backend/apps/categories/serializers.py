from rest_framework import serializers

from .models import Category, DocumentContent, DocumentFAQ, Documents, Lawyer


class CategorySerializer(serializers.ModelSerializer):
  url = serializers.CharField(source='get_url', read_only=True)
  breadcrumbs = serializers.ListField(source='get_breadcrumbs', read_only=True)
  documents_count = serializers.IntegerField(read_only=True)
  
  class Meta:
    model = Category
    fields = ('id', 'title', 'slug', 'description', 'documents_count', 'url', 'breadcrumbs')



class LawyerSerializer(serializers.ModelSerializer):

  class Meta:
    model = Lawyer
    fields = ('name', 'position', 'experience', 'photo')


class DocumentContentSerializer(serializers.ModelSerializer):
  reviewed_by = LawyerSerializer(read_only=True)

  class Meta:
    model = DocumentContent
    fields = ('seo_title', 'seo_description', 'h1', 'lead', 'when_needed', 'whats_inside', 'legal_basis',
              'filing', 'attachments', 'preview', 'reviewed_by', 'reviewed_at')


class DocumentFAQSerializer(serializers.ModelSerializer):

  class Meta:
    model = DocumentFAQ
    fields = ('question', 'answer')


class DocumentsSerializer(serializers.ModelSerializer):
  category = CategorySerializer(read_only=True)
  url = serializers.CharField(source='category.get_url', read_only=True)
  tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='title')
  content = serializers.SerializerMethodField()
  faq = DocumentFAQSerializer(many=True, read_only=True)
  
  class Meta:
    model = Documents
    fields = ('id', 'title', 'slug', 'category', 'price', 'url', 'description', 'pages', 'tags', 'content', 'faq')

  def get_content(self, document):
    content = getattr(document, 'content', None)
    return DocumentContentSerializer(content).data if content else None



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