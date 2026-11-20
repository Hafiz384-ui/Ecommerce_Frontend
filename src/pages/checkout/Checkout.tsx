import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Plus,
  Truck,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Package,
  CheckCircle2,
} from "lucide-react";
import productStore from "../../store/productStore";
import orderStore from "../../store/orderStore";
import addressStore from "../../store/addressStore";
import MainLayout from "../../components/layout/MainLayout";
import AddressCard from "../../components/checkoutComponent/AddressCard";
import { toast } from "react-toastify";
import { showGlobalLoader, hideGlobalLoader } from "../../store/loadingStore";

interface CartItem {
  id: string;
  name: string;
  color: string;
  rom: string;
  image: string;
  price: number;
  quantity: number;
  variantQuantity: number;
  productId: string;
  variantId: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchCartItems, deleteCartItems, discount, productLoading } = productStore();
  const { createOrder } = orderStore();
  const { addresses } = addressStore();

  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Fetch cart items from backend
  useEffect(() => {
    const getItems = async () => {
      try {
        const res = (await fetchCartItems()) as any;
        if (res.success && res.data?.items) {
          const formattedItems = res.data.items.map((item: any) => ({
            id: item._id,
            name: item.product?.name || "Unnamed Product",
            color: item.variant?.color || "N/A",
            rom: item.variant?.storage || "N/A",
            image: item.product?.images?.[0] || "",
            price: item.variant?.price || item.product?.baseprice || 0,
            quantity: item.quantity || 1,
            variantQuantity: item.variant?.quantity,
            productId: item.product?._id,
            variantId: item.variant?._id,
          }));
          setLocalCart(formattedItems);
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };
    getItems();
  }, [fetchCartItems, deleteCartItems]);

  // Calculate summary values dynamically
  const { subtotal, deliveryFee, totalItems, discountedTotal, discountAmount } =
    useMemo(() => {
      const subtotal = localCart.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );

      const deliveryFee = localCart.length > 0 ? localCart.length * 200 : 0;
      const totalItems = localCart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      const total = subtotal + deliveryFee;
      const discountVal = (total * (discount || 0)) / 100;
      const discountedTotal = total - discountVal;

      return {
        subtotal,
        deliveryFee,
        totalItems,
        total,
        discountedTotal,
        discountAmount: discountVal,
      };
    }, [localCart, discount]);

  // Use Address callback
  const onUseAddress = (address: any) => {
    setSelectedAddress(address);
    setSelectedAddressId(address._id);
  };

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address to proceed");
      return;
    }

    if (localCart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      items: localCart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        image: item.image,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: selectedAddress,
      totalAmount: discountedTotal,
      discountAmount: discountAmount,
      paymentMethod: "COD",
    };

    try {
      showGlobalLoader("Placing your order...");
      const result = await createOrder(orderData as any);
      hideGlobalLoader();

      if (result.success) {
        productStore.setState({ cartItems: [] });
        toast.success("Order placed successfully!");
        setTimeout(() => navigate("/ordersuccess"), 800);
      } else {
        toast.error(result.message || "Failed to place order!");
      }
    } catch (error: any) {
      hideGlobalLoader();
      toast.error(error.message || "Something went wrong while placing order");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFC]">
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/cart" className="hover:text-black transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Checkout</span>
          </nav>

          {/* Page Title & Progress Steps */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">
                Checkout
              </h1>
              <p className="text-sm text-slate-500">
                Confirm your delivery destination and finalize your order.
              </p>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Cart
              </span>
              <span className="w-4 h-px bg-slate-300" />
              <span className="flex items-center gap-1.5 text-slate-900 font-bold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                Shipping & Review
              </span>
              <span className="w-4 h-px bg-slate-300" />
              <span className="text-slate-400">Payment</span>
            </div>
          </div>

          {productLoading ? (
            /* Shimmer Skeleton (Zero Layout Shift) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-1/4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="h-44 bg-slate-100 rounded-2xl" />
                    <div className="h-44 bg-slate-100 rounded-2xl" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-16 bg-slate-100 rounded-xl" />
                  <div className="h-16 bg-slate-100 rounded-xl" />
                  <div className="h-12 bg-slate-200 rounded-xl" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SECTION: Shipping Address & Payment (8 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                
                {/* Shipping Address Container Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          Delivery Address
                        </h2>
                        <p className="text-xs text-slate-500">
                          Choose where you want your order delivered
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/createaddress")}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  {/* Address List */}
                  <div className="w-full">
                    <AddressCard
                      setAddress={onUseAddress}
                      selectedAddressId={selectedAddressId}
                    />

                    {/* Empty State when no address exists */}
                    {(!addresses || addresses.length === 0) && (
                      <div className="p-8 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">
                          No shipping address added yet
                        </h4>
                        <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                          Please provide a delivery address so we can deliver your order safely to your door.
                        </p>
                        <button
                          onClick={() => navigate("/createaddress")}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Your First Address</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Container Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-5 mb-5 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Payment Method
                      </h2>
                      <p className="text-xs text-slate-500">
                        Select your preferred payment option
                      </p>
                    </div>
                  </div>

                  {/* COD Selected Option */}
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-black bg-white flex items-start justify-between gap-4 shadow-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-5 h-5 rounded-full border-2 border-black bg-black text-white flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            Cash on Delivery (COD)
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Pay in cash when your parcel is delivered right at your doorstep. No advance fee required.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Safe & Secure Guarantee */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>100% Genuine Products Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-600" />
                      <span>7 Days Easy Return Policy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION: Sticky Order Summary (4 cols) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs sticky top-24 space-y-6">
                  
                  {/* Summary Title */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                      Order Summary
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Cart Items Scroll Area */}
                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {localCart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3.5 pb-3.5 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              width={56}
                              height={56}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold text-slate-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            {item.color !== "N/A" && (
                              <span>Color: {item.color}</span>
                            )}
                            {item.rom !== "N/A" && (
                              <span>• {item.rom}</span>
                            )}
                            <span>• Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-slate-900">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        Rs {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-slate-900">
                        Rs {deliveryFee.toLocaleString()}
                      </span>
                    </div>

                    {discount ? (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupon Discount ({discount}%)</span>
                        <span>- Rs {discountAmount.toLocaleString()}</span>
                      </div>
                    ) : null}

                    {/* Total Price */}
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900">
                          Grand Total
                        </span>
                        <p className="text-[10px] text-slate-400">
                          All taxes & duties included
                        </p>
                      </div>
                      <span className="text-xl font-black text-slate-900 tracking-tight">
                        Rs {discountedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={localCart.length === 0}
                    className="group relative w-full bg-slate-900 hover:bg-black text-white text-sm font-bold py-3.5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    By confirming this order, you agree to our Terms of Sale and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </div>
  );
};

export default CheckoutPage;
