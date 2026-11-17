import api from "./api";
import type { Address } from "../types/order";

/**
 * Address Service — All address-related API calls.
 */

export const createAddressApi = async (data: Address) => {
  const response = await api.post("/address/createaddress", data);
  return response.data;
};

export const fetchAddressesApi = async () => {
  const response = await api.get("/address/getaddresses");
  return response.data;
};

export const deleteAddressApi = async (id: string) => {
  const response = await api.get(`/address/deleteaddress/${id}`);
  return response.data;
};
