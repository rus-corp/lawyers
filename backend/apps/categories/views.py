from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404

from .models import Category, Documents
from .serializers import CategorySerializer, DocumentsSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest



class SearchView(generics.ListAPIView):
  # queryset = Category.objects.all()
  serializer_class = CategorySerializer

  def get_queryset(self):
    slug = self.kwargs['slug']
    categories = Category.objects.filter(slug=slug)
    if categories:
      parents = categories.get_ancestors(include_self=True)
      # get_ancestors(ascending=False, include_self=False)
    return parents



class CategoryView(generics.ListAPIView):
  serializer_class = CategorySerializer

  def get_queryset(self):
    title = self.request.query_params.get('title')
    if title:
      try:
        print(title)
        vector = SearchVector('title')
        search_query = SearchQuery(title)
        qs = Category.objects.annotate(
          rank=SearchRank(vector, search_query),
          similarity=TrigramSimilarity('title', title),
        ).annotate(
          best=Greatest('rank', 'similarity')
        )
        query_len = len(title)
        # threshold = min(0.3, max(0.05, 0.02 * len(title)))
        if query_len <= 3:
          threshold = 0.05
        elif query_len <= 5:
          threshold = 0.08
        elif query_len <= 9:
          threshold = 0.01
        elif query_len <= 15:
          threshold = 0.02
        elif query_len <= 25:
          threshold = 0.04
        elif query_len <= 40:
          threshold = 0.08
        elif query_len <= 65:
          threshold = 0.1
        else:
          threshold = 0.2
        return qs.filter(best__gt=threshold).order_by('-best')
      except Exception as e:
        import traceback
        traceback.print_exc()
        raise
      # return Category.objects.filter(title__icontains=title)
    qs = Category.objects.filter(level=0)
    qs = Category.objects.add_related_count(
        qs, Documents, 'category', 'documents_count', cumulative=True
    )
    children_qs = Category.objects.add_related_count(
        Category.objects.all(), Documents, 'category', 'documents_count', cumulative=False
    )
    return qs.prefetch_related(Prefetch('children', queryset=children_qs))



class SubCategoryView(generics.ListAPIView):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer

  def get_queryset(self):
    parent = get_object_or_404(Category, slug=self.kwargs['slug'])
    children = parent.get_children()
    return Category.objects.add_related_count(
        children, Documents, 'category', 'documents_count', cumulative=True
    )
  # def get(self, request, slug):
  #   category = Category.objects.get(slug=slug)
  #   children = category.get_children()
  #   serializer = CategorySerializer(children, many=True)
  #   return Response(serializer.data)


class ParentCategoryView(generics.ListAPIView):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer
  
  def get(self, request, slug):
    category = Category.objects.get(slug=slug)
    parents = Category.objects.filter(level=category.level)
    if parents:
      serializer = CategorySerializer(parents, many=True)
      return Response(serializer.data)
    return Response({"detail": "No previous sibling"}, status=204)



class DocumentsView(generics.RetrieveAPIView):
  serializer_class = DocumentsSerializer

  def get_object(self):
    category = self.kwargs['slug']
    return Documents.objects.get(category__slug=category)