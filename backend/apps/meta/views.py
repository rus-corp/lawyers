from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MetaTags, SiteSettings
from .serializers import MetaTagsSerializer, SiteSettingsSerializer


class MeatTagsView(viewsets.ReadOnlyModelViewSet):
  queryset = MetaTags.objects.all()
  serializer_class = MetaTagsSerializer
  lookup_field = 'slug'
  lookup_value_regex = '.+'  # Metadata keys include nested page paths.



class SiteSettingsView(APIView):
  """Values the site puts on every page: the Metrika counter and the ownership codes."""

  def get(self, request):
    return Response(SiteSettingsSerializer(SiteSettings.load()).data)
