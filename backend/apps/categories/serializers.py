from rest_framework import serializers

from .models import Category, Documents


class CategorySerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Category
    fields = ('id', 'title', 'slug')



class DocumentsSerializer(serializers.ModelSerializer):
  category = CategorySerializer(read_only=True)
  
  class Meta:
    model = Documents
    fields = ('id', 'title', 'slug', 'category', 'price')