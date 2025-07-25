from rest_framework import serializers
from decimal import Decimal
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
    order_amount = validated_data.get('price', None)
    user_email = validated_data.get('user_email', None)
    order_doc = validated_data.get('description', None)
    logger.info(
      f'Создан Заказ клиента {user_email}, doc: {order_doc}, price: {order_amount}'
    )
    if None in (order_amount, user_email, order_doc):
      logger.error('Данные для создания заказа пусты') 
    document = Documents.objects.get(pk=validated_data['description'])
    payment = create_payment(
      amount=validated_data['price'],
      description=validated_data['description'],
      client_email=validated_data['user_email'],
      document_name=document.title
    )
    try:
      payment_amount = payment['amount']['value']
    except AttributeError:
      logger.error('Не пришла стоимость заказа из кассы')
    paid = payment['paid']
    validated_data['order_id'] = payment['id']
    validated_data['price'] = int(float(payment_amount))
    validated_data['is_paid'] = paid
    # self._confirmation_token = payment['confirmation']['confirmation_url']
    order = Order.objects.create(**validated_data)
    return (order, payment['confirmation']['confirmation_url'])


class AmountSerializer(serializers.Serializer):
  value = serializers.DecimalField(max_digits=10, decimal_places=2)
  currency = serializers.CharField()

  def validate_value(self, value):
    if isinstance(value, str):
      value = Decimal(value)
    return value


class PaymentStatusSerializer(serializers.Serializer):
  id = serializers.UUIDField()
  status = serializers.CharField()
  amount = AmountSerializer()