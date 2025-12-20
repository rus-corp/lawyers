from django.urls import path
from apps.site_settings.views import FooterAPIView, HeaderApiView

app_name = 'site_settings'

urlpatterns = [
    # Итоговый путь будет: .../footer/
    path('footer/', FooterAPIView.as_view(), name='footer_api'),
    path('header/', HeaderApiView.as_view(), name='header_api'),
    
]