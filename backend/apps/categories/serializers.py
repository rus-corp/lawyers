from rest_framework import serializers

from .models import Category, Documents


class CategorySerializer(serializers.ModelSerializer):
  documents_count = serializers.IntegerField(read_only=True)
  
  class Meta:
    model = Category
    fields = ('id', 'title', 'slug', 'documents_count')



class DocumentsSerializer(serializers.ModelSerializer):
  category = CategorySerializer(read_only=True)
  
  class Meta:
    model = Documents
    fields = ('id', 'title', 'slug', 'category', 'price')