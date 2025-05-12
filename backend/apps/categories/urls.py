from django.urls import path

from .views import CategoryView, SubCategoryView, DocumentsListView, ParentCategoryView


app_name = 'categories'



urlpatterns = [
    path('', CategoryView.as_view(), name='category'),
    path('documents/', DocumentsListView.as_view(), name='documents'),
    path('parent/<str:slug>/', ParentCategoryView.as_view(), name='parent_category'),
    path('<str:slug>/', SubCategoryView.as_view()),
]