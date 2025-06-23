from rest_framework import serializers

from .models import Order
from apps.categories.models import Documents
from .utils import create_payment

import logging
logger = logging.getLogger(__name__)

class OrderSerializer(serializers.ModelSerializer):

  class Meta:
    model = Order
    fields = '__all__'
    read_only_fields = ('created_at', 'updated_at', 'order_id')

  def create(self, validated_data):
    document = Documents.objects.get(pk=validated_data['description'])
    payment = create_payment(
      amount=validated_data['price'],
      description=validated_data['description'],
      client_email=validated_data['user_email'],
      document_name=document.title
    )
    logger.debug('payment', payment)
    amount = payment['amount']['value']
    paid = payment['paid']
    validated_data['order_id'] = payment['id']
    validated_data['price'] = int(float(amount))
    validated_data['is_paid'] = paid
    # self._confirmation_token = payment['confirmation']['confirmation_url']
    order = Order.objects.create(**validated_data)
    return (order, payment['confirmation']['confirmation_url'])
