from rest_framework import generics
from rest_framework.response import Response


from .models import Category
from .serializers import CategorySerializer


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
