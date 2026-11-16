import logging
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from lawyers_back.logging_filters import SkipMissingMeta
from .models import DEFAULT_METRIKA_ID, MetaTags, SiteSettings


class MissingMetaLoggingTests(TestCase):
  def file_handler(self):
    return next(handler for handler in logging.getLogger('django').handlers
                if any(isinstance(item, SkipMissingMeta) for item in handler.filters))

  def test_only_missing_meta_is_left_out_of_the_log(self):
    with patch.object(self.file_handler(), 'emit') as emit:
      self.assertEqual(self.client.get('/api/meta/no-such-page/').status_code, 404)
      emit.assert_not_called()
      self.assertEqual(self.client.get('/api/categories/no-such-category/').status_code, 404)
      emit.assert_called_once()
    self.assertIn('/api/categories/no-such-category/', emit.call_args.args[0].getMessage())

  def test_existing_meta_record_is_still_served(self):
    MetaTags.objects.create(slug='home', title='Главная')
    response = self.client.get('/api/meta/home/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data['title'], 'Главная')


class SiteSettingsTests(TestCase):
  def test_api_gives_the_current_counter_before_anything_is_saved(self):
    self.assertEqual(self.client.get('/api/settings/').json(),
      {'metrika_id': DEFAULT_METRIKA_ID, 'yandex_verification': '', 'google_verification': ''})
    self.assertFalse(SiteSettings.objects.exists())

  def test_api_returns_saved_values(self):
    SiteSettings.objects.create(metrika_id='', yandex_verification='abc123', google_verification='g-1_x')
    self.assertEqual(self.client.get('/api/settings/').json(),
      {'metrika_id': '', 'yandex_verification': 'abc123', 'google_verification': 'g-1_x'})

  def test_pasted_snippets_are_reduced_to_codes(self):
    settings = SiteSettings(
      metrika_id='<script>(function(m,e,t,r,i,k,a){...})(); ym(98765432, "init", {clickmap:true});</script>',
      yandex_verification='<meta name="yandex-verification" content="4f1e2d3c" />',
      google_verification="<meta name='google-site-verification' content='AbC_-9' />")
    settings.full_clean()
    self.assertEqual((settings.metrika_id, settings.yandex_verification, settings.google_verification),
      ('98765432', '4f1e2d3c', 'AbC_-9'))
    pixel = SiteSettings(metrika_id='<img src="https://mc.yandex.ru/watch/12345678" alt="" />')
    pixel.full_clean()
    self.assertEqual(pixel.metrika_id, '12345678')

  def test_anything_else_is_rejected(self):
    with self.assertRaises(ValidationError) as error:
      SiteSettings(metrika_id='счётчик', yandex_verification='<script>alert(1)</script>').full_clean()
    self.assertEqual(set(error.exception.message_dict), {'metrika_id', 'yandex_verification'})

  def test_there_is_only_one_record(self):
    SiteSettings.objects.create(yandex_verification='first')
    SiteSettings.objects.create(yandex_verification='second')
    self.assertEqual(SiteSettings.objects.count(), 1)
    self.assertEqual(SiteSettings.load().yandex_verification, 'second')


class SiteSettingsAdminTests(TestCase):
  def setUp(self):
    self.client.force_login(get_user_model().objects.create_superuser('admin', 'admin@example.com', 'password'))

  def test_list_opens_the_single_record(self):
    self.assertRedirects(self.client.get('/admin/meta/sitesettings/'), '/admin/meta/sitesettings/add/')
    SiteSettings.objects.create()
    self.assertRedirects(self.client.get('/admin/meta/sitesettings/'), '/admin/meta/sitesettings/1/change/')
    self.assertEqual(self.client.get('/admin/meta/sitesettings/add/').status_code, 403)
    self.assertEqual(self.client.get('/admin/meta/sitesettings/1/delete/').status_code, 403)

  def test_server_values_are_shown_read_only(self):
    SiteSettings.objects.create()
    response = self.client.get('/admin/meta/sitesettings/1/change/')
    for text in ('https://pravo-dok.ru', 'HTTPS', 'UTF-8', 'name="metrika_id"', 'name="yandex_verification"'):
      self.assertContains(response, text)
    for field in ('site_address', 'protocol', 'charset'):
      self.assertNotContains(response, f'name="{field}"')

  def test_saving_a_pasted_tag_keeps_only_the_code(self):
    self.client.post('/admin/meta/sitesettings/add/', {
      'metrika_id': '102650009',
      'yandex_verification': '<meta name="yandex-verification" content="7d1c0ffee" />',
      'google_verification': '',
    })
    self.assertEqual(SiteSettings.load().yandex_verification, '7d1c0ffee')

