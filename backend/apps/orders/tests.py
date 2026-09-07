import tempfile
from unittest.mock import patch

from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.categories.models import Category, Documents, Instructions
from .utils import send_document_to_email


@override_settings(PAYMENTS_ENABLED=False, EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', EMAIL_HOST_USER='sender@example.com')
class DocumentDeliveryTests(TestCase):
  def setUp(self):
    self.media = tempfile.TemporaryDirectory()
    self.addCleanup(self.media.cleanup)
    self.media_settings = override_settings(MEDIA_ROOT=self.media.name)
    self.media_settings.enable()
    self.addCleanup(self.media_settings.disable)
    self.client = APIClient()
    self.category = Category.objects.create(title='Category', slug='category')
    self.document = Documents.objects.create(
      title='Document', slug='document', price=500, category=self.category,
      file=SimpleUploadedFile('document.docx', b'document'))
    self.data = {'description': str(self.document.pk), 'user_email': 'client@example.com'}

  @patch('apps.orders.serializers.create_payment')
  @patch('apps.orders.views.send_document_to_email.delay')
  def test_free_request_queues_delivery_without_payment(self, send, payment):
    response = self.client.post('/api/orders/', self.data)
    self.assertEqual(response.status_code, 202)
    send.assert_called_once_with(document_id=str(self.document.pk), client_email='client@example.com', paid=False)
    payment.assert_not_called()
    self.assertNotIn('confirmation_token', response.data)

  @patch('apps.orders.views.send_document_to_email.delay')
  def test_invalid_requests_do_not_send(self, send):
    for data in ({**self.data, 'user_email': 'invalid'}, {**self.data, 'description': '999999'}, {}):
      self.assertEqual(self.client.post('/api/orders/', data).status_code, 400)
    self.document.file.delete()
    self.assertEqual(self.client.post('/api/orders/', self.data).status_code, 400)
    send.assert_not_called()

  @patch('apps.orders.views.send_document_to_email.delay', side_effect=RuntimeError('Queue unavailable'))
  def test_queue_failure_returns_error(self, send):
    self.assertEqual(self.client.post('/api/orders/', self.data).status_code, 503)

  @override_settings(PAYMENTS_ENABLED=True)
  @patch('apps.orders.views.send_document_to_email.delay')
  @patch('apps.orders.serializers.create_payment', return_value={
    'id': 'payment-id', 'amount': {'value': '500'}, 'paid': False,
    'confirmation': {'confirmation_url': 'https://example.com/checkout'}})
  def test_paid_flow_is_preserved(self, payment, send):
    response = self.client.post('/api/orders/', {**self.data, 'price': 500})
    self.assertEqual(response.status_code, 201)
    self.assertEqual(response.data['confirmation_token'], 'https://example.com/checkout')
    payment.assert_called_once()
    send.assert_not_called()

  def test_config_tracks_server_setting(self):
    self.assertFalse(self.client.get('/api/orders/config/').data['payments_enabled'])
    with override_settings(PAYMENTS_ENABLED=True):
      self.assertTrue(self.client.get('/api/orders/config/').data['payments_enabled'])

  def test_free_email_includes_document_and_instructions(self):
    Instructions.objects.create(title='Instructions', category=self.category,
      file=SimpleUploadedFile('instructions.txt', b'instructions'))
    send_document_to_email(str(self.document.pk), 'client@example.com', paid=False)
    self.assertEqual(len(mail.outbox), 1)
    self.assertEqual(len(mail.outbox[0].attachments), 2)
    self.assertNotIn('за оплату', mail.outbox[0].body)

  def test_paid_email_keeps_original_greeting(self):
    send_document_to_email(str(self.document.pk), 'client@example.com')
    self.assertIn('за оплату', mail.outbox[0].body)
