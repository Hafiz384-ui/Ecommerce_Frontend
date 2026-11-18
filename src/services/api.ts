import axios from "axios";
import type { AxiosResponse } from "axios";

const addPendingRequest = (_config?: unknown): void => {
  return;
};

/**
 * Remove request from the pending requests map.
 */
const removePendingRequest = (_config?: unknown): void => {
  return;
};

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Request Interceptors
api.interceptors.request.use(
  (config) => {
    // 1. Inject authorization token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Prevent duplicate GET requests
    addPendingRequest(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    removePendingRequest(response.config);
    return response;
  },
  (error) => {
    if (error.config) {
      removePendingRequest(error.config);
    }

    // Handle cancellation silently
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Extract user-friendly error message from backend
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";
    error.message = message;

    // Handle 401 Unauthorized globally (exclude auth endpoints to prevent loops)
    const isAuthEndpoint =
      error.config?.url?.includes("/user/login") ||
      error.config?.url?.includes("/user/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Silently clear local auth credentials
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      // Notify all stores and UI components to instantly clear user state without requiring page reload
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }

      // Check current URL pathname to determine if on a public browsing route
      const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
      const isPublicRoute =
        currentPath === "/" ||
        currentPath === "/categories" ||
        currentPath === "/products" ||
        currentPath.startsWith("/productdetails") ||
        currentPath.startsWith("/product/") ||
        currentPath === "/login" ||
        currentPath === "/signup";

      // Only redirect to login if the user was actively accessing a protected private route
      if (!isPublicRoute) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
