from django.urls import path

from .views import CreateNewOrderView, PaymentStatusView, PaymentConfigView
app_name = 'orders'



urlpatterns = [
    path('config/', PaymentConfigView.as_view(), name='payment_config'),
    path('', CreateNewOrderView.as_view(), name='create_order'),
    path('notification/', PaymentStatusView.as_view(), name='payment_status')
]