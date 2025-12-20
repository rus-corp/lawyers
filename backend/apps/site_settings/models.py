from django.db import models
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
from wagtail.models import Orderable
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel  # <--- Важно для InlinePanel

# 1. Абстрактный класс (Шаблон для ссылки)
class AbstractBaseLink(Orderable):
    link_title = models.CharField("Текст ссылки", max_length=255)
    link_page = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name="Внутренняя страница"
    )
    link_external = models.URLField("Внешняя ссылка", blank=True)

    # Панели определены здесь, чтобы не дублировать их в каждом классе
    panels = [
        FieldPanel('link_title'),
        FieldPanel('link_page'),
        FieldPanel('link_external'),
    ]

    class Meta:
        abstract = True
        ordering = ['sort_order']
    
    @property
    def url(self):
        if self.link_page:
            return self.link_page.get_url()
        return self.link_external



# 2. Ссылка для Центральной колонки
# ВАЖНО: Наследуемся от AbstractFooterLink, чтобы получить поля link_title и т.д.
class FooterMainLink(AbstractBaseLink):
    page = ParentalKey('FooterSettings', related_name='main_links', on_delete=models.CASCADE)




# 3. Ссылка для Правой колонки
# ВАЖНО: Наследуемся от AbstractFooterLink
class FooterLegalLink(AbstractBaseLink):
    page = ParentalKey('FooterSettings', related_name='legal_links', on_delete=models.CASCADE)





# 4. Настройки Футера
@register_setting
class FooterSettings(BaseSiteSetting, ClusterableModel): # ВАЖНО: ClusterableModel нужен здесь
    company_name = models.CharField("Название компании (Заголовок)", max_length=255, default="Правовые документы")
    contact_info = models.TextField("Контакты (Email/Адрес)", default="info@pravo-dok.ru") 
    copyright_text = models.CharField("Копирайт", max_length=255, default="© 2025 Все права защищены")

    panels = [
        MultiFieldPanel([
            FieldPanel('company_name'),
            FieldPanel('contact_info'),
            FieldPanel('copyright_text'),
        ], heading="Левая колонка (Инфо)"),
        
        InlinePanel('main_links', label="Центральная колонка (Меню)"),
        InlinePanel('legal_links', label="Правая колонка (Документы)"),
    ]

    class Meta:
        verbose_name = "Футер"



class HeaderMainLink(AbstractBaseLink):
    page = ParentalKey('HeaderSettings', related_name='header_links', on_delete=models.CASCADE)



@register_setting
class HeaderSettings(BaseSiteSetting, ClusterableModel):
    header_email = models.CharField('Email в шапке', max_length=100, blank=True)
    panels = [
        MultiFieldPanel([
            FieldPanel('header_email')
        ], heading='Настройки шапки'),
    InlinePanel('header_links', label='Навигация в шапке')
    ]

    class Meta:
        verbose_name = "Хидер (Шапка)"