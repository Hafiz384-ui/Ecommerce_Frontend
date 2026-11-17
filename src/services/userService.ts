import api from "./api";
import type { User } from "../types/user";

/**
 * User Service — All user-related API calls.
 * Stores should import these functions instead of calling `api` directly.
 */

export const registerUserApi = async (data: User) => {
  const response = await api.post("/user/register", data);
  return response.data;
};

export const loginUserApi = async (data: User) => {
  const response = await api.post("/user/login", data);
  return response.data;
};

export const logoutUserApi = async () => {
  const response = await api.post("/user/logout");
  return response.data;
};

export const fetchCurrentUserApi = async () => {
  const response = await api.get("/user/mydata");
  return response.data;
};
