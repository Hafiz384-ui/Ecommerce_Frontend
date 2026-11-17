import CouponCard from "../../components/couponComponent/CouponCard";
import MainLayout from "../../components/layout/MainLayout";
import { useEffect } from "react";
import couponStore from "../../store/couponStore";
import { Link } from "react-router-dom";
import { ChevronRight, Tag, ArrowRight, Sparkles } from "lucide-react";

function Coupon() {
  const { coupons, fetchCoupon, loading } = couponStore();

  useEffect(() => {
    fetchCoupon();
  }, []);

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#FBFBFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">Coupons & Offers</span>
          </nav>

          {/* Header */}
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Sparkles size={13} className="text-amber-500" />
                <span>Rewards & Discounts</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-sans">
                Available Coupons
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal">
                Copy active promotional vouchers and paste them at checkout for instant savings.
              </p>
            </div>

            <Link
              to="/categories"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 hover:text-black underline underline-offset-4 transition-colors"
            >
              Shop Discounted Items
            </Link>
          </div>

          {/* Coupons List / Skeletons */}
          {loading ? (
            /* Shimmer Skeletons Grid (Prevents layout shift) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs animate-pulse space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-slate-200 rounded-md" />
                    <div className="w-16 h-5 bg-slate-200 rounded-full" />
                  </div>
                  <div className="space-y-2 py-2">
                    <div className="w-32 h-8 bg-slate-200 rounded-md" />
                    <div className="w-48 h-3 bg-slate-200 rounded-sm" />
                  </div>
                  <div className="pt-4 border-t border-dashed border-slate-200">
                    <div className="w-full h-11 bg-slate-100 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : coupons?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {coupons.map((coupon, index) => (
                <CouponCard
                  key={index}
                  index={index}
                  isActive={coupon?.isActive}
                  code={coupon?.code}
                  discount={coupon?.discountValue}
                  expiry={coupon?.expiryDate}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
                <Tag size={38} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                No active coupons available
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-sm">
                Check back during seasonal promotional events, flash sales, and holiday campaigns.
              </p>
              <Link
                to="/categories"
                className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Coupon;
