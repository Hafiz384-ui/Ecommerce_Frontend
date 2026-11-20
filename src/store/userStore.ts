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
  clearAuth: () => void;
}

const initialToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const initialExpiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
const isInitialExpired = initialExpiry ? Date.now() > Number(initialExpiry) : false;
const hasInitialToken = Boolean(initialToken && !isInitialExpired);

let hasVerifiedOnce = false;
let autoLogoutTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleAutoLogout = (expiryTime: number) => {
  if (typeof window === "undefined") return;
  if (autoLogoutTimer) {
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;
  }

  const remainingMs = expiryTime - Date.now();
  if (remainingMs <= 0) {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    return;
  }

  // Cap setTimeout to ~24 days to avoid 32-bit integer overflow in Node/browsers (2147483647 ms)
  const safeTimeoutMs = Math.min(remainingMs, 2147483647);
  autoLogoutTimer = setTimeout(() => {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }, safeTimeoutMs);
};

// If page reloads and a valid unexpired token exists, resume the auto-logout timer immediately!
if (hasInitialToken && initialExpiry) {
  scheduleAutoLogout(Number(initialExpiry));
}

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
        const expiryDuration = 7 * 24 * 60 * 60 * 1000;
        const expiryTime = Date.now() + expiryDuration;
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("tokenExpiry", String(expiryTime));

        scheduleAutoLogout(expiryTime);
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
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
        autoLogoutTimer = null;
      }
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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
    const isExpired = expiry && Date.now() > Number(expiry);

    if (!token || isExpired) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
      }
      hasVerifiedOnce = true;
      set({ isAuthChecking: false, loading: false, user: null, token: null });
      return;
    }

    if (!hasVerifiedOnce) {
      set({ isAuthChecking: true, loading: true, error: null });
    }

    try {
      const responseData = await fetchCurrentUserApi();
      hasVerifiedOnce = true;
      set({
        isAuthChecking: false,
        loading: false,
        error: null,
        user: responseData.user || null,
        token,
      });
    } catch {
      // Unauthenticated / expired token check fails gracefully without breaking public browsing
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
      }
      hasVerifiedOnce = true;
      set({
        isAuthChecking: false,
        loading: false,
        user: null,
        token: null,
      });
    }
  },

  clearAuth: () => {
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
      autoLogoutTimer = null;
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
    hasVerifiedOnce = true;
    set({
      user: null,
      token: null,
      isAuthChecking: false,
      loading: false,
      error: null,
    });
  },
}));

// Listen for global 401 unauthorized events from Axios interceptor
if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    userStore.getState().clearAuth();
  });
}

export default userStore;
