from rest_framework import generics
from rest_framework.response import Response


from .models import Category, Documents
from .serializers import CategorySerializer, DocumentsSerializer


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
      return Category.objects.filter(title__icontains=title)
    return Category.objects.filter(level=0)
    # return Category.objects.all()



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



class DocumentsView(generics.RetrieveAPIView):
  serializer_class = DocumentsSerializer

  def get_object(self):
    category = self.kwargs['slug']
    return Documents.objects.get(category__slug=category)