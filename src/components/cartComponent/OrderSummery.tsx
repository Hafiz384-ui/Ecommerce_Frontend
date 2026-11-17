import React, { useMemo, useState } from "react";
import { Tag, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";
import productStore from "../../store/productStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderSummary: React.FC = () => {
  const { applyCouponCode, discount, cartThings } = productStore();
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const [applyingCoupon, setApplyingCoupon] = useState<boolean>(false);

  const { subtotal, deliveryFee, totalItems, discountAmount, discountedTotal } =
    useMemo(() => {
      const subtotal = (cartThings || []).reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );

      const deliveryFee =
        (cartThings || []).length > 0 ? (cartThings || []).length * 200 : 0;
      const totalItems = (cartThings || []).reduce(
        (acc, item) => acc + (item.quantity || 0),
        0
      );

      const total = subtotal + deliveryFee;
      const discountAmount = Math.round((total * (discount || 0)) / 100);
      const discountedTotal = Math.max(0, total - discountAmount);

      return {
        subtotal,
        deliveryFee,
        totalItems,
        discountAmount,
        discountedTotal,
      };
    }, [cartThings, discount]);

  const orderHandler = (itemsCount: number) => {
    if (itemsCount > 0) {
      navigate("/checkout");
    } else {
      toast.error("Your shopping bag is empty");
    }
  };

  // Coupon code apply handler
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.info("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    try {
      const result = await applyCouponCode(code.trim());
      if (result.success) {
        toast.success(result.message || "Coupon applied successfully!");
      } else {
        toast.error(result.message || "Invalid or expired coupon code!");
      }
    } catch {
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          Order Summary
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {totalItems} {totalItems === 1 ? "unit" : "units"}
        </span>
      </div>

      {/* Price Details Breakdown */}
      <div className="py-5 space-y-3.5 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            Rs {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center gap-1.5">
            <span>Shipping & Handling</span>
          </div>
          <span className="font-semibold text-slate-900 tabular-nums">
            {deliveryFee === 0 ? "Free" : `Rs ${deliveryFee.toLocaleString()}`}
          </span>
        </div>

        {discount && discount > 0 ? (
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-500" />
              Coupon Discount ({discount}%)
            </span>
            <span className="font-bold tabular-nums">
              -Rs {discountAmount.toLocaleString()}
            </span>
          </div>
        ) : null}

        <div className="pt-4 border-t border-dashed border-slate-200">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-base font-bold text-slate-900">Total Amount</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Including all applicable taxes
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                Rs {discountedTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code Form */}
      <form onSubmit={submitHandler} className="mt-2 pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Promotional Code
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Tag size={16} />
          </div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter promo code"
            className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-black focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={applyingCoupon || !code.trim()}
            className="absolute right-1.5 px-4 py-2 rounded-lg bg-black text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-black transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {applyingCoupon ? "Applying..." : "Apply"}
          </button>
        </div>

        {discount && discount > 0 ? (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
            <Check size={14} strokeWidth={2.5} />
            <span>Discount voucher active: {discount}% OFF applied!</span>
          </div>
        ) : null}
      </form>

      {/* Checkout CTA Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => orderHandler(totalItems)}
          disabled={totalItems === 0}
          className="group relative w-full py-4 px-6 bg-black text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {/* Subtle shine hover effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="relative flex items-center gap-2">
            <span>Proceed to Checkout</span>
          </span>

          <span className="relative flex items-center gap-1.5 text-xs font-semibold bg-white/15 px-3 py-1 rounded-full">
            <span>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
            <ArrowRight
              size={14}
              className="transform group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </button>
      </div>

      {/* Security Assurance */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>Guaranteed 256-bit Secure Checkout</span>
      </div>
    </div>
  );
};

export default OrderSummary;
