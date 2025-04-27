from django.urls import path

from .views import CategoryView, SubCategoryView


app_name = 'categories'



urlpatterns = [
    path('', CategoryView.as_view(), name='category'),
    path('<str:slug>/', SubCategoryView.as_view())
]