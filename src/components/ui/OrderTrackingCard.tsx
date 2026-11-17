import React, { useEffect, useMemo, useState } from "react";
import orderStore from "../../store/orderStore";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  PackageOpen,
  ArrowRight,
  MapPin,
  CreditCard,
  AlertCircle,
  Copy,
  Check,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface IProps {
  onOpen: (prodId: string, event: any) => void;
}

const TRACKING_STEPS = [
  { id: "Pending", label: "Order Placed", icon: Clock },
  { id: "Processing", label: "Processing", icon: PackageCheck },
  { id: "Shipped", label: "In Transit", icon: Truck },
  { id: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

const OrderTrackingCard: React.FC<IProps> = ({ onOpen }) => {
  const { fetchOrder, Orders, loading } = orderStore();
  const [filterTab, setFilterTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      window.scrollTo(0, 0);
      await fetchOrder();
    };
    fetchOrders();
  }, []);

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    let list = Array.isArray(Orders) ? [...Orders] : [];

    // Tab filter
    if (filterTab === "active") {
      list = list.filter(
        (o) =>
          o.status === "Pending" ||
          o.status === "Processing" ||
          o.status === "Shipped" ||
          (o.status as any) === "Placed"
      );
    } else if (filterTab === "delivered") {
      list = list.filter((o) => o.status === "Delivered");
    } else if (filterTab === "cancelled") {
      list = list.filter((o) => o.status === "Cancelled");
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o._id?.toLowerCase().includes(q) ||
          o.items?.some((item) => item.name?.toLowerCase().includes(q))
      );
    }

    return list;
  }, [Orders, filterTab, searchQuery]);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Filter Tabs & Search Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl w-fit">
          {[
            { id: "all", label: "All Orders", count: Orders?.length || 0 },
            {
              id: "active",
              label: "In Transit",
              count:
                Orders?.filter(
                  (o) =>
                    o.status === "Pending" ||
                    o.status === "Processing" ||
                    o.status === "Shipped" ||
                    (o.status as any) === "Placed"
                ).length || 0,
            },
            {
              id: "delivered",
              label: "Delivered",
              count: Orders?.filter((o) => o.status === "Delivered").length || 0,
            },
            {
              id: "cancelled",
              label: "Cancelled",
              count: Orders?.filter((o) => o.status === "Cancelled").length || 0,
            },
          ].map((tab) => {
            const active = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    active
                      ? "bg-slate-100 text-slate-800"
                      : "bg-slate-200/60 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Orders List Area */}
      {loading ? (
        /* Shimmer Skeletons */
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="w-full bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 animate-pulse space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="w-40 h-5 bg-slate-200 rounded-md" />
                  <div className="w-24 h-4 bg-slate-200 rounded-md" />
                </div>
                <div className="w-28 h-8 bg-slate-200 rounded-full" />
              </div>

              <div className="py-4">
                <div className="w-full h-8 bg-slate-100 rounded-full" />
              </div>

              <div className="space-y-4 pt-2">
                {[1, 2].map((j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                      <div className="space-y-2">
                        <div className="w-36 h-4 bg-slate-200 rounded-md" />
                        <div className="w-20 h-3 bg-slate-200 rounded-sm" />
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-slate-200 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        /* Orders List */
        <div className="space-y-6">
          {filteredOrders.map((order, orderIdx) => {
            const rawStatus = order.status as string;
            const normalizedStatus =
              rawStatus === "Placed" ? "Pending" : rawStatus;

            const isCancelled = normalizedStatus === "Cancelled";
            const stepIndex = TRACKING_STEPS.findIndex(
              (s) => s.id === normalizedStatus
            );
            const currentStep = stepIndex >= 0 ? stepIndex : 0;

            return (
              <div
                key={order._id || orderIdx}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Order
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                        #{order._id?.slice(-8) || order._id}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyOrderId(order._id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copy Order ID"
                      >
                        {copiedId === order._id ? (
                          <Check size={13} className="text-emerald-600" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Expected Delivery:{" "}
                      <span className="font-semibold text-slate-800">
                        {order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Scheduled Soon"}
                      </span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {normalizedStatus === "Delivered" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <CheckCircle2 size={13} strokeWidth={2.5} />
                        <span>Delivered</span>
                      </span>
                    ) : normalizedStatus === "Shipped" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/70">
                        <Truck size={13} strokeWidth={2.5} />
                        <span>In Transit</span>
                      </span>
                    ) : normalizedStatus === "Processing" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                        <PackageCheck size={13} strokeWidth={2.5} />
                        <span>Processing</span>
                      </span>
                    ) : isCancelled ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70">
                        <AlertCircle size={13} strokeWidth={2.5} />
                        <span>Cancelled</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Clock size={13} strokeWidth={2.5} />
                        <span>Order Placed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Tracking Progress Section */}
                {isCancelled ? (
                  <div className="my-6 p-4 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">
                        This order was cancelled
                      </h4>
                      <p className="text-xs text-rose-600 mt-0.5">
                        If you have any questions or were charged, please contact customer support.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="my-8 px-2 sm:px-6">
                    <div className="relative">
                      {/* Background Bar */}
                      <div className="absolute top-4 sm:top-5 left-0 w-full h-1 bg-slate-100 rounded-full" />

                      {/* Active Progress Fill */}
                      <div
                        className="absolute top-4 sm:top-5 left-0 h-1 bg-black rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`,
                        }}
                      />

                      {/* Step Points */}
                      <div className="relative flex justify-between items-start w-full">
                        {TRACKING_STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const isCompleted = idx < currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div
                              key={step.id}
                              className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[100px]"
                            >
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  isCurrent
                                    ? "bg-black text-white ring-4 ring-slate-200 shadow-md scale-105"
                                    : isCompleted
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-400 border-2 border-slate-200"
                                }`}
                              >
                                <Icon size={16} strokeWidth={2.2} />
                              </div>
                              <p
                                className={`mt-2 text-[11px] sm:text-xs font-bold leading-tight ${
                                  isCurrent || isCompleted
                                    ? "text-slate-900"
                                    : "text-slate-400 font-normal"
                                }`}
                              >
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="divide-y divide-slate-100 pt-2 border-t border-slate-100">
                  {order.items?.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          ) : (
                            <PackageOpen size={24} className="text-slate-300" />
                          )}
                        </div>

                        <div>
                          <Link
                            to={`/productdetails/${item.productId}`}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-slate-600 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-slate-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-500">
                              Rs {item.price?.toLocaleString()} each
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <p className="text-sm sm:text-base font-black text-slate-900 tabular-nums">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Review / Feedback Action */}
                        {(order.status === "Shipped" ||
                          order.status === "Delivered") && (
                          <button
                            type="button"
                            onClick={(e) => onOpen(item.productId, e)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer"
                          >
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span>Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex flex-wrap items-center gap-4">
                    {order.shippingAddress && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-slate-400 shrink-0" />
                        <span>
                          Ship to:{" "}
                          <strong className="text-slate-800">
                            {order.shippingAddress.fullName || "Recipient"}
                          </strong>{" "}
                          ({order.shippingAddress.city || "Pakistan"})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <CreditCard size={15} className="text-slate-400 shrink-0" />
                      <span>
                        Payment:{" "}
                        <strong className="text-slate-800">
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 self-end sm:self-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Total Paid:
                    </span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                      Rs {order.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
            <PackageOpen size={38} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {searchQuery || filterTab !== "all"
              ? "No matching orders found"
              : "No orders placed yet"}
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            {searchQuery || filterTab !== "all"
              ? "Try adjusting your search query or switching to another status tab."
              : "When you purchase items, your order history and tracking updates will appear here."}
          </p>
          <Link
            to="/categories"
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingCard;
