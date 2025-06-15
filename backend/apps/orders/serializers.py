from rest_framework import serializers

from .models import Order
from .utils import create_payment

class OrderSerializer(serializers.ModelSerializer):

  class Meta:
    model = Order
    fields = '__all__'
    read_only_fields = ('created_at', 'updated_at', 'order_id')

  def create(self, validated_data):
    payment = create_payment(
      amount=validated_data['price'],
      description=validated_data['description'],
    )
    order_id = payment['id']
    # desc = payment['description']
    amount = payment['amount']['value']
    paid = payment['paid']
    validated_data['order_id'] = order_id
    # validated_data['description'] = desc
    validated_data['price'] = int(float(amount))
    validated_data['is_paid'] = paid
    self._confirmation_token = payment['confirmation']['confirmation_token']
    order = Order.objects.create(**validated_data)
    return (order, payment['confirmation']['confirmation_token'])
