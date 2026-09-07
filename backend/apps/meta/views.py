from django.shortcuts import render
from rest_framework import viewsets

from .models import MetaTags
from .serializers import MetaTagsSerializer


class MeatTagsView(viewsets.ReadOnlyModelViewSet):
  queryset = MetaTags.objects.all()
  serializer_class = MetaTagsSerializer
  lookup_field = 'slug'
  lookup_value_regex = '.+'  # Metadata keys include nested page paths.