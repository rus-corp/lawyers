from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
import logging
logger = logging.getLogger(__name__)

from .models import Order
from .serializers import OrderSerializer
from .utils import send_document_to_email



class CreateNewOrderView(generics.CreateAPIView):
  queryset = Order.objects.all()
  serializer_class = OrderSerializer

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    order = serializer.save()
    return Response({
        'order_id': order[0].order_id,
        'confirmation_token': order[1],
        'message': 'Order created successfully',
      }, status=status.HTTP_201_CREATED)



class PaymentStatusView(generics.CreateAPIView):
  queryset = Order.objects.all()
  serializer_class = OrderSerializer

  def post(self, request, *args, **kwargs):
    event = request.data.get('event', None)
    payment_data = request.data.get('object', None)
    if not payment_data:
      return Response({'error': 'Payment data not provided'}, status=status.HTTP_400_BAD_REQUEST)
    payment_id = payment_data.get('id')
    payment_status = payment_data.get('status')
    if payment_status == 'succeeded':
      try:
        order = Order.objects.get(order_id=payment_id)
        order.is_paid = True
        mail = send_document_to_email(
          document_id=order.description,
          client_email=order.user_email
        )
        order.is_completed = True
        order.save()
        return Response(
          {'message': 'Payment succeeded'},
          status=status.HTTP_200_OK
        )
      except Order.DoesNotExist:
        return Response(
          {'error': 'Order not found'},
          status=status.HTTP_404_NOT_FOUND
        )
    else:
      return Response(
        {'message': 'Payment not succeeded'},
        status=status.HTTP_403_FORBIDDEN
      )


