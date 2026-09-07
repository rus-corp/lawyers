from rest_framework import serializers

from .models import Category, Documents


class CategorySerializer(serializers.ModelSerializer):
  url = serializers.CharField(source='get_url', read_only=True)
  breadcrumbs = serializers.ListField(source='get_breadcrumbs', read_only=True)
  documents_count = serializers.IntegerField(read_only=True)
  
  class Meta:
    model = Category
    fields = ('id', 'title', 'slug', 'documents_count', 'url', 'breadcrumbs')



class DocumentsSerializer(serializers.ModelSerializer):
  category = CategorySerializer(read_only=True)
  url = serializers.CharField(source='category.get_url', read_only=True)
  
  class Meta:
    model = Documents
    fields = ('id', 'title', 'slug', 'category', 'price', 'url')