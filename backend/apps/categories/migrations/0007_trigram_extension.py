from django.contrib.postgres.operations import TrigramExtension
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0006_document_details'),
    ]

    operations = [
        # The catalog title search relies on similarity() from pg_trgm.
        TrigramExtension(),
    ]
