from rest_framework import serializers
from .models import BackUpForm


class BackUpSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = BackUpForm
    fields = '__all__'