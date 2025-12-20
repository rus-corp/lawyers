from rest_framework.views import APIView
from rest_framework.response import Response
from wagtail.models import Site
from .models import FooterSettings, HeaderSettings
from .serializers import FooterSettingsSerializer, HeaderSettingsSerializer



class FooterAPIView(APIView):
    def get(self, request):
        # 1. Пытаемся определить сайт по запросу (важно для мультисайтовости)
        site = Site.objects.first()

        # 2. Получаем настройки именно для этого сайта
        footer_settings = FooterSettings.for_site(site)
        
        # 3. Сериализуем данные
        # context={'request': request} нужен, чтобы полные URL картинок строились правильно (если они будут)
        serializer = FooterSettingsSerializer(footer_settings, context={'request': request})
        
        return Response(serializer.data)


class HeaderApiView(APIView):
    def get(self, request):
        site = Site.objects.first()
        header_settings = HeaderSettings.for_site(site)
        serializer = HeaderSettingsSerializer(header_settings, context={'request': request})

        return Response(serializer.data)