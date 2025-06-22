from rest_framework import serializers

from .models import MetaTags


class MetaTagsSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = MetaTags
    fields = '__all__'