from django.contrib import admin

from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
  list_display = ('order_id', 'user_email', 'price', 'created_at', 'is_paid', 'is_completed', 'is_canceled')
  search_fields = ('order_id', 'user_email')
  list_filter = ('is_paid', 'is_completed', 'is_canceled')
  ordering = ('-created_at',)
  readonly_fields = ('created_at', 'updated_at')