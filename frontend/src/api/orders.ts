import { backendUrl } from "./_variables";

import { CreateOrderData } from "@/app/payment_page/types";

export const createNewOrder = async (createOrderData: CreateOrderData) => {
  try {
    const response = await backendUrl.post('/orders/', createOrderData);
    return response;
  } catch (error: any) {
    return error.response?.data
  }
}