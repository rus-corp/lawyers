from django.shortcuts import render
from rest_framework import generics


from .models import News
from .serializers import NewsSerializer


class NewsList(generics.ListAPIView):
  queryset = News.objects.all()
  serializer_class = NewsSerializer



class NewsListItem(generics.RetrieveAPIView):
  queryset = News.objects.all()
  lookup_field='slug'
  serializer_class = NewsSerializer