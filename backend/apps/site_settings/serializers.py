from rest_framework import serializers
from .models import FooterSettings, FooterMainLink, FooterLegalLink, HeaderSettings, HeaderMainLink

# Сериализатор для одной ссылки
class LinkSerializer(serializers.ModelSerializer):
    # Используем наш метод url из модели, чтобы получить готовую строку адреса
    url = serializers.ReadOnlyField()

    class Meta:
        model = FooterMainLink # (подойдет любая из двух, поля одинаковые)
        fields = ['link_title', 'url']

# Сериализатор для всего футера
class FooterSettingsSerializer(serializers.ModelSerializer):
    # Вкладываем списки ссылок
    main_links = LinkSerializer(many=True, read_only=True)
    legal_links = LinkSerializer(many=True, read_only=True)

    class Meta:
        model = FooterSettings
        fields = [
            'company_name', 
            'contact_info', 
            'copyright_text', 
            'main_links', 
            'legal_links'
        ]


class HeaderLinkSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = HeaderMainLink
        fields = ['id', 'link_title', 'url']
    
    def get_url(self, obj):
        # 1. Сначала проверяем, выбрана ли Внутренняя страница
        print(obj)
        if obj.link_page:
            # Важно: .specific позволяет получить все данные страницы,
            # но для URL достаточно и базового объекта.
            # get_url() может вернуть None, если страница не опубликована!
            return obj.link_page.get_url()
        if obj.link_external:
            return obj.link_external
            
        # 3. Если ничего нет — возвращаем пустую строку или None
        return None
    
class HeaderSettingsSerializer(serializers.ModelSerializer):
    header_links = HeaderLinkSerializer(many=True, read_only=True)

    class Meta:
        model = HeaderSettings
        fields = ['header_email','header_links']