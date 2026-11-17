import { create } from "zustand";
import axios from "axios";
import type { User } from "../types/user";
import {
  registerUserApi,
  loginUserApi,
  logoutUserApi,
  fetchCurrentUserApi,
} from "../services/userService";

interface UserStore {
  loading: boolean;
  isAuthChecking: boolean;
  error: string | null;
  message: string | null;
  user: User | null;
  token: string | null;
  registerUser: (
    data: User
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  loginUser: (
    data: User
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  logoutUser: () => Promise<{ success: boolean; message?: string }>;
  fetchCurrentUser: () => Promise<void>;
}

const initialToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const initialExpiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
const isInitialExpired = initialExpiry ? Date.now() > Number(initialExpiry) : false;
const hasInitialToken = Boolean(initialToken && !isInitialExpired);

const userStore = create<UserStore>((set) => ({
  loading: false,
  isAuthChecking: hasInitialToken,
  error: null,
  message: null,
  user: null,
  token: hasInitialToken ? initialToken : null,

  registerUser: async (data: User) => {
    try {
      set({ loading: true, error: null });
      const responseData = await registerUserApi(data);
      const { message, user } = responseData;
      set({
        loading: false,
        error: null,
        message: message || "Registered successfully!",
        user: user || null,
      });
      return { success: true, data: responseData };
    } catch (err: any) {
      if (axios.isCancel(err)) return { success: false, message: "Request cancelled" };
      const message = err.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  loginUser: async (data: User) => {
    try {
      set({ loading: true, error: null });
      const responseData = await loginUserApi(data);

      set({
        loading: false,
        error: null,
        user: responseData.user || null,
        token: responseData.token || null,
        isAuthChecking: false,
        message: responseData.message || "Login successful!",
      });
      if (responseData.token) {
        const expiryTime: any = Date.now() + 7 * 24 * 60 * 60 * 1000;
        await localStorage.setItem("token", responseData.token);
        await localStorage.setItem("tokenExpiry", expiryTime);

        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          set({ user: null, token: null });
          window.location.href = "/login";
        }, expiryTime - Date.now());
      }
      return {
        success: true,
        data: responseData,
        message: responseData.message,
      };
    } catch (err: any) {
      if (axios.isCancel(err)) return { success: false, message: "Request cancelled" };
      const message = err.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  logoutUser: async () => {
    try {
      await logoutUserApi();
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      set({ user: null, token: null, isAuthChecking: false });
      window.location.href = "/";

      return { success: true };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      console.error("Logout failed:", error);
      set({ loading: false });
      return { success: false, message: error.message };
    }
  },

  fetchCurrentUser: async () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    const isExpired = expiry && Date.now() > Number(expiry);

    if (!token || isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      set({ isAuthChecking: false, loading: false, user: null, token: null });
      return;
    }

    set({ isAuthChecking: true, loading: true, error: null });
    try {
      const responseData = await fetchCurrentUserApi();
      set({
        isAuthChecking: false,
        loading: false,
        error: null,
        user: responseData.user || null,
        token,
      });
    } catch {
      // Unauthenticated / expired token check fails gracefully without breaking public browsing
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      set({
        isAuthChecking: false,
        loading: false,
        user: null,
        token: null,
      });
    }
  },
}));

export default userStore;
