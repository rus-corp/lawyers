from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from apps.meta.models import MetaTags
from .forms import DocumentForm
from .models import Category, Documents, Tag


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



class CategoryDocumentsTests(TestCase):
  def setUp(self):
    self.client = APIClient()
    self.root = Category.objects.create(title='Семейное право', slug='family', description='Документы для семейных споров')
    self.alimony = Category.objects.create(title='Алименты', slug='alimony', parent=self.root)
    self.divorce = Category.objects.create(title='Расторжение брака', slug='divorce', parent=self.root)
    self.claim = Category.objects.create(title='Иск', slug='claim', parent=self.alimony)
    self.petition = Category.objects.create(title='Заявление', slug='petition', parent=self.divorce)
    Category.objects.create(title='Без документа', slug='empty', parent=self.divorce)
    labour = Category.objects.create(title='Трудовое право', slug='labour')
    firing = Category.objects.create(title='Увольнение', slug='firing', parent=labour)
    resignation = Category.objects.create(title='Заявление об увольнении', slug='resignation', parent=firing)

    self.detailed = Documents.objects.create(
      title='Иск о взыскании алиментов', slug='claim-document', category=self.claim, price=590,
      description='Для взыскания алиментов на ребёнка', pages=4)
    self.detailed.tags.add(
      Tag.objects.create(title='дети', slug='children'),
      Tag.objects.create(title='алименты', slug='alimony'))
    self.plain = Documents.objects.create(title='Заявление о расторжении брака', slug='petition-document', category=self.petition)
    Documents.objects.create(title='Заявление об увольнении', slug='resignation-document', category=resignation)
    # Attached to a subsection instead of a third-level category: it has no page, so it is not listed.
    Documents.objects.create(title='Не на своём месте', slug='misplaced-document', category=self.divorce)

  def test_category_lists_all_its_documents_with_details(self):
    response = self.client.get('/api/categories/family/documents/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual([item['id'] for item in response.data], [self.detailed.pk, self.plain.pk])
    self.assertEqual(response.data[0], {
      'id': self.detailed.pk,
      'title': 'Иск о взыскании алиментов',
      'slug': 'claim-document',
      'price': 590,
      'url': '/categories/family/alimony/claim',
      'description': 'Для взыскания алиментов на ребёнка',
      'pages': 4,
      'tags': ['алименты', 'дети'],
      'section': {'title': 'Алименты', 'url': '/categories/family/alimony'},
    })

  def test_document_without_details_has_empty_values(self):
    item = self.client.get('/api/categories/family/documents/').data[1]
    self.assertEqual((item['description'], item['pages'], item['tags']), ('', None, []))
    self.assertEqual(item['section'], {'title': 'Расторжение брака', 'url': '/categories/family/divorce'})

  def test_subsection_and_document_category_return_their_own_documents(self):
    for slug in ('alimony', 'claim'):
      data = self.client.get(f'/api/categories/{slug}/documents/').data
      self.assertEqual([item['url'] for item in data], ['/categories/family/alimony/claim'])
      self.assertEqual(data[0]['section'], {'title': 'Алименты', 'url': '/categories/family/alimony'})
    self.assertEqual(self.client.get('/api/categories/empty/documents/').data, [])

  def test_unknown_category_returns_404(self):
    self.assertEqual(self.client.get('/api/categories/missing/documents/').status_code, 404)

  def test_number_of_queries_does_not_depend_on_number_of_documents(self):
    for index in range(5):
      leaf = Category.objects.create(title=f'Иск {index}', slug=f'claim-{index}', parent=self.alimony)
      Documents.objects.create(title=f'Документ {index}', slug=f'document-{index}', category=leaf)
    # category, descendants, documents, tags
    with self.assertNumQueries(4):
      response = self.client.get('/api/categories/family/documents/')
    self.assertEqual(len(response.data), 7)
    # a nested category adds one query for its ancestors
    with self.assertNumQueries(5):
      response = self.client.get('/api/categories/alimony/documents/')
    self.assertEqual(len(response.data), 6)

  def test_existing_endpoints_carry_new_fields(self):
    data = self.client.get('/api/categories/path/family/alimony/claim/').data
    self.assertEqual(data['document']['description'], 'Для взыскания алиментов на ребёнка')
    self.assertEqual(data['document']['pages'], 4)
    self.assertEqual(data['document']['tags'], ['алименты', 'дети'])
    categories = self.client.get('/api/categories/').data
    self.assertEqual(categories[0]['description'], 'Документы для семейных споров')

  def test_title_search_works_on_a_fresh_database(self):
    response = self.client.get('/api/categories/', {'title': 'Алименты'})
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data[0]['title'], 'Алименты')


class DocumentFormTests(TestCase):
  def setUp(self):
    root = Category.objects.create(title='Семейное право', slug='family')
    parent = Category.objects.create(title='Алименты', slug='alimony', parent=root)
    self.taken = Category.objects.create(title='Иск', slug='claim', parent=parent)
    self.free = Category.objects.create(title='Заявление', slug='petition', parent=parent)
    self.document = Documents.objects.create(title='Иск', slug='claim-document', category=self.taken, file='claim.docx')

  def test_new_document_is_offered_only_free_categories(self):
    self.assertEqual(list(DocumentForm().fields['category'].queryset), [self.free])

  def test_existing_document_can_be_saved_in_its_own_category(self):
    tag = Tag.objects.create(title='алименты', slug='alimony')
    form = DocumentForm(instance=self.document, data={
      'title': 'Иск', 'slug': 'claim-document', 'category': self.taken.pk, 'price': 0,
      'description': 'Кратко', 'pages': 3, 'tags': [tag.pk],
    })
    self.assertTrue(form.is_valid(), form.errors)
    document = form.save()
    self.assertEqual((document.description, document.pages, list(document.tags.all())), ('Кратко', 3, [tag]))


class AdminPagesTests(TestCase):
  def setUp(self):
    self.client.force_login(get_user_model().objects.create_superuser('admin', 'admin@example.com', 'password'))
    root = Category.objects.create(title='Семейное право', slug='family')
    parent = Category.objects.create(title='Алименты', slug='alimony', parent=root)
    self.leaf = Category.objects.create(title='Иск', slug='claim', parent=parent)
    self.document = Documents.objects.create(title='Иск', slug='claim-document', category=self.leaf, file='claim.docx')

  def test_document_form_offers_new_fields_and_current_category(self):
    response = self.client.get(f'/admin/categories/documents/{self.document.pk}/change/')
    self.assertEqual(response.status_code, 200)
    for field in ('description', 'pages', 'tags'):
      self.assertContains(response, f'name="{field}"')
    self.assertContains(response, f'<option value="{self.leaf.pk}" selected>')

  def test_category_and_tag_pages_open(self):
    self.assertContains(self.client.get(f'/admin/categories/category/{self.leaf.pk}/change/'), 'name="description"')
    self.assertEqual(self.client.get('/admin/categories/tag/add/').status_code, 200)
    self.assertEqual(self.client.get('/admin/categories/documents/').status_code, 200)

