import CartSection from "../../components/cartComponent/CartSection";
import OrderSummery from "../../components/cartComponent/OrderSummery";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

function Cart() {
  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#FBFBFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">Shopping Bag</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-sans">
                Shopping Bag
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal">
                Review your items, apply discounts, and complete your order.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 hover:text-black underline underline-offset-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Main Cart Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Cart Items Area */}
            <div className="lg:col-span-7 xl:col-span-8 w-full">
              <CartSection />
            </div>

            {/* Order Summary Sticky Area */}
            <div className="lg:col-span-5 xl:col-span-4 w-full lg:sticky lg:top-28">
              <OrderSummery />
            </div>
          </div>

          {/* Trust Value Propositions */}
          <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-slate-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <Truck size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Swift & Insured Delivery</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Reliable tracking on all orders</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-slate-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <RotateCcw size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">7-Day Seamless Return</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Hassle-free return policy</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-slate-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                  <ShieldCheck size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Genuine Tech</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Verified authentic hardware</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Cart;
