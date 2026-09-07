import { backendUrl } from "./_variables";
import { CreateOrderData } from "@/app/payment_page/types";

export const createNewOrder = (data: CreateOrderData) => backendUrl.post('orders/', data);

export const getPaymentConfig = async (): Promise<boolean> => {
  const response = await backendUrl.get('orders/config/');
  return response.data.payments_enabled;
};
