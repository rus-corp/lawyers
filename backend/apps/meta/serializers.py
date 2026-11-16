from rest_framework import serializers

from .models import MetaTags, SiteSettings


class MetaTagsSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = MetaTags
    fields = '__all__'



class SiteSettingsSerializer(serializers.ModelSerializer):

  class Meta:
    model = SiteSettings
    fields = ('metrika_id', 'yandex_verification', 'google_verification')
