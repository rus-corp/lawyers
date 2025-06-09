from django.shortcuts import render
from rest_framework import generics
from .models import BackUpForm
from .serializer import BackUpSerializer


class BackUpView(generics.CreateAPIView):
  queryset = BackUpForm.objects.all()
  serializer_class = BackUpSerializer
