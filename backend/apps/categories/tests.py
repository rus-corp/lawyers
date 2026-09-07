from django.test import TestCase
from rest_framework.test import APIClient
from apps.meta.models import MetaTags
from .models import Category, Documents


class CategoryURLTests(TestCase):
  def setUp(self):
    self.client = APIClient()
    self.root = Category.objects.create(title='Семейное право', slug='family')
    self.parent = Category.objects.create(title='Алименты', slug='alimony', parent=self.root)
    self.leaf = Category.objects.create(title='Иск', slug='claim', parent=self.parent)
    self.document = Documents.objects.create(title='Документ', slug='different-document-slug', category=self.leaf)
    self.url = '/categories/family/alimony/claim'

  def test_document_url_uses_complete_category_path(self):
    response = self.client.get('/api/categories/path/family/alimony/claim/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data['document']['id'], self.document.pk)
    self.assertEqual(response.data['document']['url'], self.url)
    self.assertEqual([item['url'] for item in response.data['category']['breadcrumbs']],
      ['/categories/family', '/categories/family/alimony', self.url])

  def test_wrong_ancestry_or_missing_document_returns_404(self):
    for path in ['wrong/alimony/claim', 'family/wrong/claim', 'claim', 'missing']:
      self.assertEqual(self.client.get(f'/api/categories/path/{path}/').status_code, 404)
    self.document.delete()
    self.assertEqual(self.client.get('/api/categories/path/family/alimony/claim/').status_code, 404)

  def test_legacy_lookup_provides_redirect_target(self):
    response = self.client.get('/api/categories/documents/claim/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data['url'], self.url)
    self.assertEqual(self.client.get('/api/categories/documents/missing/').status_code, 404)

  def test_catalog_and_search_use_same_urls(self):
    children = self.client.get('/api/categories/alimony/').data
    self.assertEqual(children[0]['url'], self.url)
    search = self.client.get('/api/categories/search/claim/').data
    self.assertEqual(search[-1]['url'], self.url)
    self.assertEqual(self.client.get('/api/categories/search/missing/').status_code, 404)

  def test_category_pages_resolve_without_document(self):
    response = self.client.get('/api/categories/path/family/alimony/')
    self.assertEqual(response.status_code, 200)
    self.assertIsNone(response.data['document'])

  def test_sitemap_uses_only_canonical_existing_paths(self):
    Category.objects.create(title='Empty', slug='empty', parent=self.parent)
    urls = [item['url'] for item in self.client.get('/api/categories/sitemap/').data]
    self.assertEqual(urls, ['/categories/family', '/categories/family/alimony', self.url])

  def test_nested_metadata_key_resolves(self):
    MetaTags.objects.create(slug=self.url.lstrip('/'), title='SEO title')
    response = self.client.get('/api/meta/categories/family/alimony/claim/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data['title'], 'SEO title')
