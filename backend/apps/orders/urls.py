from django.urls import path

from .views import CreateNewOrderView, PaymentStatusView
app_name = 'orders'



urlpatterns = [
    path('', CreateNewOrderView.as_view(), name='create_order'),
    path('notification/', PaymentStatusView.as_view(), name='payment_status')
]