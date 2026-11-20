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
  categoryPagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  wishlistPagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summaryItems: any[];
  selectedCategory: string;
  discount: number | null;
  hasNextPage: boolean;
  nextPage: number;
  totalProductsCount: number;
  totalHomePages: number;
  currentHomePage: number;
  cartLength: number;
  cartThings: any[];
  addItemsToSummary: (data: any[]) => void;
  setSelectedCategory: (cat: string) => void;
  fetchProductByCategory: (
    id: string,
    params?: { page?: number; limit?: number; search?: string; sort?: string }
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
  fetchWishListItems: (params?: { page?: number; limit?: number }) => Promise<{
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
  totalProductsCount: 0,
  totalHomePages: 1,
  currentHomePage: 1,
  categoryPagination: {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 5,
    hasNextPage: false,
    hasPrevPage: false,
  },
  wishlistPagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 5,
    hasNextPage: false,
    hasPrevPage: false,
  },

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
      const { docs, hasNextPage, nextPage, totalDocs, totalPages } = responseData.products;

      set((state) => ({
        product: append ? [...state.product, ...docs] : docs,
        loading: false,
        error: null,
        hasNextPage,
        nextPage: hasNextPage ? nextPage : 1,
        totalProductsCount: totalDocs || 0,
        totalHomePages: totalPages || 1,
        currentHomePage: page,
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

  fetchProductByCategory: async (
    category: string,
    params?: { page?: number; limit?: number; search?: string; sort?: string }
  ) => {
    try {
      set({ categoryloading: true, error: null });
      const responseData = await fetchProductByCategoryApi(category, params);
      localStorage.setItem("selectedCategory", category);

      set({
        categoryloading: false,
        error: null,
        message: responseData.message,
        categoryItems: responseData.products || [],
        selectedCategory: category,
        categoryPagination: responseData.pagination || {
          totalProducts: responseData.products?.length || 0,
          totalPages: 1,
          currentPage: params?.page || 1,
          limit: params?.limit || 9,
          hasNextPage: false,
          hasPrevPage: false,
        },
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
      const responseData = await addProductToWishListApi(id);

      // Optimistic update of local wishlist state without extra API calls
      set((state) => {
        const isCurrentlyInWishlist = state.wishListProducts.some((p) => p._id === id);
        let updatedList = [...state.wishListProducts];

        if (responseData.action === "removed" || isCurrentlyInWishlist) {
          updatedList = updatedList.filter((p) => p._id !== id);
        } else if (responseData.action === "added" && responseData.product) {
          updatedList = [responseData.product, ...updatedList];
        }

        const totalItems = responseData.action === "removed"
          ? Math.max(0, state.wishlistPagination.totalItems - 1)
          : state.wishlistPagination.totalItems + 1;

        return {
          wishListProducts: updatedList,
          wishlistPagination: {
            ...state.wishlistPagination,
            totalItems,
            totalPages: Math.ceil(totalItems / (state.wishlistPagination.limit || 8)) || 1,
          },
        };
      });

      return {
        success: true,
        message: responseData.message,
        data: responseData,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) return { success: false, message: "Request cancelled" };
      const message = error.message;
      return { success: false, message };
    }
  },

  fetchWishListItems: async (params?: { page?: number; limit?: number }) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
    const isExpired = expiry ? Date.now() > Number(expiry) : false;
    if (!token || isExpired) {
      set({ wishListProducts: [], wishlistLoading: false });
      return { success: false, message: "User not logged in" };
    }

    try {
      set({ wishlistLoading: true, error: null });
      const responseData = await fetchWishListItemsApi(params);

      const wishlistItems = responseData?.wishlistItems
        ?.map((item: any) => item.product)
        .filter(Boolean) || [];

      set({
        wishlistLoading: false,
        error: null,
        message: responseData?.message,
        wishListProducts: wishlistItems,
        wishlistPagination: responseData?.pagination || {
          totalItems: wishlistItems.length,
          totalPages: 1,
          currentPage: params?.page || 1,
          limit: params?.limit || 8,
          hasNextPage: false,
          hasPrevPage: false,
        },
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
