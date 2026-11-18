import { create } from "zustand";
import axios from "axios";
import type { Product } from "../types/product";
import type { Cart } from "../types/cart";
import {
  fetchProductsApi,
  findProductApi,
  fetchProductByCategoryApi,
  addToCartApi,
  fetchCartItemsApi,
  deleteCartItemsApi,
  addProductToWishListApi,
  fetchWishListItemsApi,
  applyCouponCodeApi,
  createReviewApi,
} from "../services/productService";

interface ProductStore {
  product: Product[];
  currentProduct: Product | null;
  wishListProducts: Product[];
  message: string | null;
  loading: boolean;
  productDetailLoading: boolean;
  cartActionLoading: boolean;
  productLoading: boolean;
  wishlistLoading: boolean;
  categoryloading: boolean;
  error: string | null;
  cartItems: any[];
  categoryItems: any[];
  summaryItems: any[];
  selectedCategory: string;
  discount: number | null;
  hasNextPage: boolean;
  nextPage: number;
  cartLength: number;
  cartThings: any[];
  addItemsToSummary: (data: any[]) => void;
  setSelectedCategory: (cat: string) => void;
  fetchProductByCategory: (
    id: string
  ) => Promise<{ success: boolean; message?: string; data?: any }>;
  fetchProducts: (
    page: number,
    limit: number,
    append: boolean
  ) => Promise<void>;
  findProduct: (id: string) => Promise<void>;
  addToCart: (data: Cart) => Promise<{ success: boolean; message?: string }>;
  fetchCartItems: (
  ) => Promise<{ success: boolean; message?: string }>;
  deleteCartItems: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;
  addProductToWishList: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;
  fetchWishListItems: () => Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  applyCouponCode: (
    code: string
  ) => Promise<{ success: boolean; message?: string }>;
  createReview: (
    data: any
  ) => Promise<{ success: boolean; message?: string }>;
}

const productStore = create<ProductStore>((set) => ({
  hasNextPage: true,
  nextPage: 2,
  product: [],
  currentProduct: null,
  wishListProducts: [],
  loading: false,
  productDetailLoading: false,
  cartActionLoading: false,
  productLoading: false,
  wishlistLoading: false,
  categoryloading: false,
  error: null,
  message: null,
  cartItems: [],
  cartLength: 0,
  categoryItems: [],
  summaryItems: [],
  cartThings: [],
  selectedCategory: localStorage.getItem("selectedCategory") || "AllProducts",
  discount: null,

  setCartThings: (items: any) => set({ cartThings: items }),

  addItemsToSummary: (data: any[]) => {
    set(() => {
      const summary = data;
      console.log("summary data in store", summary);

      return { summaryItems: summary };
    });
  },

  // Fetch all products from API
  fetchProducts: async (page: number, limit: number, append: boolean) => {
    try {
      set({ loading: true, error: null });
      const responseData = await fetchProductsApi(page, limit);
      const { docs, hasNextPage, nextPage } = responseData.products;

      set((state) => ({
        product: append ? [...state.product, ...docs] : docs,
        loading: false,
        error: null,
        hasNextPage,
        nextPage: hasNextPage ? nextPage : 1,
      }));
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      set({ loading: false, error: err.message });
    }
  },

  // Fetch single product by ID
  findProduct: async (id: string) => {
    try {
      set({ productDetailLoading: true, loading: true, error: null });
      const responseData = await findProductApi(id);
      set({
        currentProduct: responseData.product || null,
        productDetailLoading: false,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      set({ productDetailLoading: false, loading: false, error: err.message });
    }
  },

  addToCart: async (data: Cart) => {
    try {
      set({ cartActionLoading: true, error: null });

      // Smooth delay so the loader is clearly visible to the user as requested
      // await new Promise((resolve) => setTimeout(resolve, 800));

      const responseData = await addToCartApi(data);
      console.log("add to cart response in store", responseData);
      const newCartItems = responseData.cart?.items || [];
      set({
        cartActionLoading: false,
        error: null,
        message: responseData.message,
        cartItems: newCartItems,
      });
      return {
        success: true,
        data: responseData,
        message: responseData.message || "Product added to cart successfully!",
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add product to cart";
      set({ cartActionLoading: false, error: message });
      return { success: false, message };
    }
  },

  fetchCartItems: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
    const isExpired = expiry ? Date.now() > Number(expiry) : false;
    if (!token || isExpired) {
      set({ cartItems: [], productLoading: false });
      return { success: false, message: "User not logged in" };
    }

    try {
      set({ productLoading: true, error: null });
      const responseData = await fetchCartItemsApi();
      console.log("items in store", responseData.items);
      const items = responseData.items || [];

      set({
        productLoading: false,
        error: null,
        cartItems: items,
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
      set({ productLoading: false, error: message });
      return { success: false, message };
    }
  },

  deleteCartItems: async (id: string) => {
    try {
      set({ cartActionLoading: true, error: null });

      const responseData = await deleteCartItemsApi(id);
      const updatedCartItems = responseData.cart?.items || [];

      set({
        cartActionLoading: false,
        error: null,
        cartItems: updatedCartItems,
        message: responseData.message,
      });

      return {
        success: true,
        message: responseData.message,
        data: responseData.cart,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete cart item";
      set({ cartActionLoading: false, error: message });
      return { success: false, message };
    }
  },

  setSelectedCategory: (cat: string) => {
    localStorage.setItem("selectedCategory", cat);
    set({ selectedCategory: cat });
  },

  fetchProductByCategory: async (category: string) => {
    try {
      set({ categoryloading: true, error: null });
      const responseData = await fetchProductByCategoryApi(category);
      localStorage.setItem("selectedCategory", category);
      console.log("categoryItems in store", responseData.products);
      set({
        categoryloading: false,
        error: null,
        message: responseData.message,
        categoryItems: responseData.products || [],
        selectedCategory: category,
      });
      return {
        success: true,
        message: responseData.message,
        data: responseData,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      set({ categoryloading: false, error: message });
      return { success: false, message };
    }
  },

  addProductToWishList: async (id: string) => {
    try {
      set({ wishlistLoading: true, error: null });
      const responseData = await addProductToWishListApi(id);
      const wishlistData = await fetchWishListItemsApi();
      const wishlistItems = wishlistData.wishlistItems
        .map((item: any) => item.product)
        .filter(Boolean);
      set({
        wishlistLoading: false,
        error: null,
        wishListProducts: wishlistItems,
      });
      return {
        success: true,
        message: responseData.message,
        data: responseData,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      set({ wishlistLoading: false, error: message });
      return { success: false, message };
    }
  },

  fetchWishListItems: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
    const isExpired = expiry ? Date.now() > Number(expiry) : false;
    if (!token || isExpired) {
      set({ wishListProducts: [], wishlistLoading: false });
      return { success: false, message: "User not logged in" };
    }

    try {
      set({ wishlistLoading: true, error: null });
      const responseData = await fetchWishListItemsApi();
      console.log("wish list items", responseData);

      const wishlistItems = responseData?.wishlistItems
        ?.map((item: any) => item.product)
        .filter(Boolean) || [];
      set({
        wishlistLoading: false,
        error: null,
        message: responseData?.message,
        wishListProducts: wishlistItems,
      });
      return {
        success: true,
        message: responseData?.message,
        data: responseData,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      set({ wishlistLoading: false, error: message });
      return { success: false, message };
    }
  },

  applyCouponCode: async (code: string) => {
    try {
      set({ loading: true, error: null });
      const responseData = await applyCouponCodeApi(code);
      set({
        loading: false,
        error: null,
        message: responseData.message,
        discount: responseData.discount || null,
      });

      if (responseData.success) {
        return {
          success: true,
          message: responseData.message,
          data: responseData,
        };
      } else {
        return {
          success: false,
          message: responseData.message || "Coupon apply failed",
        };
      }
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },

  createReview: async (data: any) => {
    try {
      set({ loading: true, error: null });
      const responseData = await createReviewApi(data);

      set({
        loading: false,
        error: null,
        message: responseData.message,
      });
      return {
        success: true,
        message: responseData.message,
        data: responseData,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      set({ loading: false, error: message });
      return { success: false, message };
    }
  },
}));

// Clear cart & wishlist when session is unauthorized / logged out
if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    productStore.setState({
      cartItems: [],
      wishListProducts: [],
      cartThings: [],
    });
  });
}

export default productStore;
