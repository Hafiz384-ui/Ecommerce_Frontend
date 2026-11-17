import { create } from "zustand";
import axios from "axios";
import type { Coupon } from "../types/coupon";
import { fetchCouponsApi } from "../services/couponService";

interface CouponStore {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  message: string | null;
  fetchCoupon: () => Promise<void>;
}

const couponStore = create<CouponStore>((set) => ({
  coupons: [],
  loading: false,
  error: null,
  message: null,

  fetchCoupon: async () => {
    try {
      set({ loading: true, error: null });
      const responseData = await fetchCouponsApi();
      console.log("Coupon response:", responseData);

      // Extract nested coupon data
      const formattedCoupons = responseData.coupon.map((item: any) => item.coupon);

      set({
        coupons: formattedCoupons || [],
        loading: false,
      });
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      set({
        loading: false,
        error: err.message,
      });
    }
  },
}));

export default couponStore;
