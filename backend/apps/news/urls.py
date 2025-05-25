from django.urls import path

from .views import NewsList, NewsListItem


app_name = 'news'



urlpatterns = [
    path('', NewsList.as_view(), name='news_list'),
    path('<str:slug>/', NewsListItem.as_view(), name='news_item')
]