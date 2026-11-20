import api from "./api";
import type { Order } from "../types/order";

/**
 * Order Service — All order-related API calls.
 */

export const createOrderApi = async (data: Order) => {
  const response = await api.post("/order/createorder", data);
  return response.data;
};

export const fetchOrdersApi = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await api.get("/order/getorder", { params });
  return response.data;
};
