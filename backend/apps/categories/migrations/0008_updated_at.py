import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0007_trigram_extension'),
    ]

    operations = [
        # Existing rows get the moment of the migration as their modification date.
        migrations.AddField(
            model_name='category',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now, verbose_name='Изменено'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='documents',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now, verbose_name='Изменено'),
            preserve_default=False,
        ),
    ]
