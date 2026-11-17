import { create } from "zustand";
import axios from "axios";
import type { Order } from "../types/order";
import { createOrderApi, fetchOrdersApi } from "../services/orderService";

interface OrderStore {
  Orders: Order[];
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchOrder: () => Promise<{ success: boolean; data?: any; message?: string }>;
  createOrder: (
    data: Order
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
}

const orderStore = create<OrderStore>((set) => ({
  Orders: [],
  loading: false,
  error: null,
  message: null,

  // Create order
  createOrder: async (data: Order) => {
    try {
      set({ loading: true, error: null });
      const responseData = await createOrderApi(data);
      const { message } = responseData;
      set({
        loading: false,
        error: null,
        message: message || "Address created successfully!",
      });
      return { success: true, data: responseData };
    } catch (err: any) {
      if (axios.isCancel(err)) return { success: false, message: "Request cancelled" };
      const message = err.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  fetchOrder: async () => {
    try {
      set({ loading: true, error: null });
      const responseData = await fetchOrdersApi();
      console.log("items in store", responseData.orders);

      set({
        loading: false,
        error: null,
        Orders: responseData.orders,
        message: responseData.message,
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
