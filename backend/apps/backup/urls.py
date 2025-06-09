from django.urls import path

from .views import BackUpView


app_name = 'backup'



urlpatterns = [
    path('', BackUpView.as_view(), name='backup'),
]