from rest_framework import generics
from rest_framework.response import Response


from .models import Category, Documents
from .serializers import CategorySerializer, DocumentsSerializer


class CategoryView(generics.ListAPIView):
  queryset = Category.objects.filter(level=0)
  serializer_class = CategorySerializer



class SubCategoryView(generics.ListAPIView):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer
  
  def get(self, request, slug):
    category = Category.objects.get(slug=slug)
    children = category.get_children()
    serializer = CategorySerializer(children, many=True)
    return Response(serializer.data)


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



class DocumentsListView(generics.ListAPIView):
  queryset = Documents.objects.all()
  serializer_class = DocumentsSerializer

  def get_queryset(self, title):
    documents = Documents.objects.all()
    title = self.request.query_params.get('title')
    if title:
      queryset = queryset.filter(title__icontains=title)
      return queryset