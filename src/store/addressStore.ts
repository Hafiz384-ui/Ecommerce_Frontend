import { create } from "zustand";
import axios from "axios";
import type { Address } from "../types/order";
import {
  createAddressApi,
  fetchAddressesApi,
  deleteAddressApi,
} from "../services/addressService";

interface AddressStore {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchaddress: () => Promise<void>;
  deleteaddress: (id: string) => Promise<void>;
  createAddress: (
    data: Address
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
}

const addressStore = create<AddressStore>((set) => ({
  addresses: [],
  loading: false,
  error: null,
  message: null,

  // Create address
  createAddress: async (data: Address) => {
    try {
      set({ loading: true, error: null });
      const responseData = await createAddressApi(data);
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

  fetchaddress: async () => {
    try {
      set({ loading: true, error: null });
      const responseData = await fetchAddressesApi();
      console.log("address in store ...", responseData.addresses);
      set({
        addresses: responseData.addresses || [],
        loading: false,
        error: null,
      });
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      set({ loading: false, error: err.message });
    }
  },

  deleteaddress: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await deleteAddressApi(id);

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr._id !== id),
        loading: false,
        error: null,
      }));
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      set({ loading: false, error: err.message });
    }
  },
  
}));

export default addressStore;
