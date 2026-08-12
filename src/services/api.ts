import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Map to store pending GET requests for deduplication
const pendingRequests = new Map<string, AbortController>();

/**
 * Generate a unique key for a request based on method, URL, parameters, and body.
 */
const getRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return [
    method || "",
    url || "",
    JSON.stringify(params || ""),
    JSON.stringify(data || ""),
  ].join("&");
};

const addPendingRequest = (config: InternalAxiosRequestConfig): void => {
  // GET request cancellation is disabled to prevent aborting concurrent requests 
  // made by different components mounting at the same time.
  return;
};

/**
 * Remove request from the pending requests map.
 */
const removePendingRequest = (config: InternalAxiosRequestConfig): void => {
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
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;