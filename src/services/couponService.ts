import api from "./api";

/**
 * Coupon Service — All coupon-related API calls.
 */

export const fetchCouponsApi = async () => {
  const response = await api.get("/coupon/mycoupons");
  return response.data;
};
