import { create } from "zustand";
import axios from "axios";
import type { Order } from "../types/order";
import { createOrderApi, fetchOrdersApi } from "../services/orderService";

interface OrderStore {
  Orders: Order[];
  loading: boolean;
  error: string | null;
  message: string | null;
  orderPagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchOrder: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  createOrder: (
    data: Order
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
}

const orderStore = create<OrderStore>((set) => ({
  Orders: [],
  loading: false,
  error: null,
  message: null,
  orderPagination: {
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 5,
    hasNextPage: false,
    hasPrevPage: false,
  },

  // Create order
  createOrder: async (data: Order) => {
    try {
      set({ loading: true, error: null });
      const responseData = await createOrderApi(data);
      const { message } = responseData;
      set({
        loading: false,
        error: null,
        message: message || "Order placed successfully!",
      });
      return { success: true, data: responseData };
    } catch (err: any) {
      if (axios.isCancel(err)) return { success: false, message: "Request cancelled" };
      const message = err.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  fetchOrder: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    try {
      set({ loading: true, error: null });
      const responseData = await fetchOrdersApi(params);
      const orders = responseData.orders || [];

      set({
        loading: false,
        error: null,
        Orders: orders,
        message: responseData.message,
        orderPagination: responseData.pagination || {
          totalOrders: orders.length,
          totalPages: 1,
          currentPage: params?.page || 1,
          limit: params?.limit || 5,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
      return {
        success: true,
        data: responseData,
        message: responseData.message,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },
}));

export default orderStore;
