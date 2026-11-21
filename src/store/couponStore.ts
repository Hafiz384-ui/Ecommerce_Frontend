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

      // Support both new enhanced objects or fallback legacy array
      const rawCoupons = Array.isArray(responseData?.coupon) ? responseData.coupon : [];
      const formattedCoupons = rawCoupons.map((item: any) => {
        // If backend already formatted it directly into an enhanced coupon object
        if (item.code && item.discountValue !== undefined) {
          return item;
        }
        // Fallback if raw populated doc
        return item.coupon || item;
      });

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
