from django.urls import path, include
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter

# app_name = 'wag'

# 1. Настраиваем стандартный роутер Wagtail
api_router = WagtailAPIRouter('wagtailapi')
api_router.register_endpoint('pages', PagesAPIViewSet)
# api_router.register_endpoint('images', ...) # если нужно

# 2. Собираем все пути в один список
urlpatterns = [
    # Стандартные пути Wagtail (pages, images)
    # Они будут доступны по адресу .../v2/pages/
    path('v2/', api_router.urls),

    # Наши кастомные пути (например, футер)
    # Мы подключаем их тоже под префикс v2, чтобы было единообразно
    # Будет доступно по адресу .../v2/footer/
    path('v2/', include('apps.site_settings.urls')),
]