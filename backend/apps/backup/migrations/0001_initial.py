# Generated by Django 5.2 on 2025-06-09 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BackUpForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, verbose_name='Имя')),
                ('phone', models.CharField(max_length=50, verbose_name='Телефон')),
                ('email', models.EmailField(max_length=155, verbose_name='Почта')),
                ('text', models.TextField(max_length=1000, verbose_name='Сообщение')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='создано')),
            ],
            options={
                'verbose_name': 'Обратная связь',
                'verbose_name_plural': 'Обратные связи',
            },
        ),
    ]
