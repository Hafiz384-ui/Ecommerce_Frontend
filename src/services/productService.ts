import api from "./api";
import type { Cart } from "../types/cart";

/**
 * Product Service — All product-related API calls.
 * Stores should import these functions instead of calling `api` directly.
 */

// ─── Products ────────────────────────────────────────────────────────

export const fetchProductsApi = async (page: number, limit: number) => {
  const response = await api.get("/product/fetchproducts", {
    params: { page, limit },
  });
  return response.data;
};

export const findProductApi = async (id: string) => {
  const response = await api.get(`/product/getproduct/${id}`);
  return response.data;
};

export const fetchProductByCategoryApi = async (
  category: string,
  params?: { page?: number; limit?: number; search?: string; sort?: string }
) => {
  const response = await api.get(`/product/getproductsbycategory/${category}`, {
    params,
  });
  return response.data;
};

// ─── Cart ────────────────────────────────────────────────────────────

export const addToCartApi = async (data: Cart) => {
  const response = await api.post("/product/addtocart", data);
  return response.data;
};

export const fetchCartItemsApi = async () => {
  const response = await api.get("/product/cartitems");
  return response.data;
};

export const deleteCartItemsApi = async (id: string) => {
  const response = await api.delete(`/product/deletecartitems/${id}`);
  return response.data;
};

// ─── Wishlist ────────────────────────────────────────────────────────

export const addProductToWishListApi = async (id: string) => {
  const response = await api.post(`/product/addtowishlist/${id}`);
  return response.data;
};

export const fetchWishListItemsApi = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get("/product/getwishlist", { params });
  return response.data;
};

// ─── Coupon ──────────────────────────────────────────────────────────

export const applyCouponCodeApi = async (code: string) => {
  const response = await api.post("/coupon/applycoupon", { code });
  return response.data;
};

// ─── Reviews ─────────────────────────────────────────────────────────

export const createReviewApi = async (data: any) => {
  const response = await api.post("/product/review", data);
  return response.data;
};
