from django.contrib import admin

from .models import BackUpForm


@admin.register(BackUpForm)
class BackUpFormAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'phone', 'created_at')
  list_display_links = ('id', 'name',)