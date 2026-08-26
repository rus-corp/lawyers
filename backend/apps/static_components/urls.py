from django.urls import path

from .views import DocumentInstructionView, DocumentSidebarView


app_name = 'static_components'


urlpatterns = [
    path('sidebar/<str:slug>/', DocumentSidebarView.as_view(), name='document_sidebar'),
    path('instruction/<str:slug>/', DocumentInstructionView.as_view(), name='document_instruction'),
]
