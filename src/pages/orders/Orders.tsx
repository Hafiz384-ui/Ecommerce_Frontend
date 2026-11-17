import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import OrderTrackingCard from "../../components/ui/OrderTrackingCard";
import PopupCard from "../../components/ui/PopupCard";
import { Link } from "react-router-dom";
import { ChevronRight, HelpCircle } from "lucide-react";

function Orders() {
  const [popup, setPopup] = useState(false);
  const [productId, setProductId] = useState<string>("");

  const popupHandler = (prodId: string, _event: React.MouseEvent) => {
    setProductId(prodId);
    setPopup(true);
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#FBFBFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">Orders & Tracking</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-sans">
                Order History & Tracking
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal">
                Check delivery milestones, inspect order items, or share your product feedback.
              </p>
            </div>

            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-black transition-colors"
            >
              <HelpCircle size={15} />
              <span>Explore Products</span>
            </Link>
          </div>

          {/* Orders Tracking Card List */}
          <OrderTrackingCard onOpen={popupHandler} />
        </div>

        {/* Review Dialog Popup */}
        {popup && (
          <PopupCard
            onClose={() => setPopup(false)}
            productId={productId}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default Orders;
