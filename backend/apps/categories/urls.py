from django.urls import path

from .views import CategoryView, SubCategoryView, DocumentsView, ParentCategoryView, SearchView


app_name = 'categories'



urlpatterns = [
    path('', CategoryView.as_view(), name='category'),
    path('documents/<str:slug>/', DocumentsView.as_view(), name='documents'),
    path('parent/<str:slug>/', ParentCategoryView.as_view(), name='parent_category'),
    path('<str:slug>/', SubCategoryView.as_view()),
    path('search/<str:slug>/', SearchView.as_view()),
]