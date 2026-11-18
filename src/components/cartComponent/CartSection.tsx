import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import productStore from "../../store/productStore";
import { toast } from "react-toastify";

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

const CartSection: React.FC = () => {
  const navigate = useNavigate();
  const { fetchCartItems, productLoading, deleteCartItems, addToCart } =
    productStore();
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch cart items from backend once on mount
  useEffect(() => {
    const getItems = async () => {
      window.scrollTo(0, 0);
      const res = (await fetchCartItems()) as any;
      console.log("data fetch from backend..", res.data?.items);

      if (res.success && res.data?.items) {
        const formattedItems = res.data.items.map((item: any) => ({
          id: item._id,
          name: item.product?.name || "Unnamed Product",
          color: item.variant?.color || "N/A",
          rom: item.variant?.storage || "N/A",
          image: item.product?.images?.[0] || "",
          price: item.variant?.price || item.product?.baseprice || 0,
          quantity: item.quantity || 1,
          variantQuantity: item.variant?.quantity || 10,
          productId: item.product?._id,
          variantId: item.variant?._id,
        }));
        setLocalCart(formattedItems);
        productStore.setState({ cartThings: formattedItems });
      }
    };
    getItems();
  }, []);

  useEffect(() => {
    productStore.setState({ cartItems: localCart });
  }, [localCart]);

  // Increase quantity
  const increaseQuantity = async (
    id: string,
    productId: string,
    variantId: string,
    variantQuantity: number,
    quantity: number
  ) => {
    if (quantity >= variantQuantity) {
      toast.error(`Only ${variantQuantity} items available in stock`);
      return;
    }

    setUpdatingId(id);
    setLocalCart((prev) => {
      const updatedCart = prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      productStore.setState({ cartThings: updatedCart });
      return updatedCart;
    });

    try {
      const res = await addToCart({
        productId,
        variantId,
        quantity: 1,
        variantMaxQuantity: variantQuantity,
      } as any);
      console.log("Cart updated:", res.message);
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to update item quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (
    id: string,
    productId: string,
    variantId: string,
    variantQuantity: number
  ) => {
    setUpdatingId(id);
    setLocalCart((prev) => {
      const updatedCart = prev
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      productStore.setState({ cartThings: updatedCart });
      return updatedCart;
    });

    try {
      const res = await addToCart({
        productId,
        variantId,
        quantity: -1,
        variantMaxQuantity: variantQuantity,
      } as any);
      console.log("Quantity decreased:", res.message);
    } catch (err) {
      console.error("Error decreasing cart quantity:", err);
      toast.error("Failed to update item quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove product
  const removeItem = async (id: string) => {
    try {
      setUpdatingId(id);
      const res = await deleteCartItems(id);      
      if (res.success) {
        setLocalCart((prev) => {
          const updatedCart = prev.filter((item) => item.id !== id);
          productStore.setState({ cartThings: updatedCart });
          return updatedCart;
        });
        toast.success(res.message || "Item removed from cart successfully");
      } else {
        toast.error(res.message || "Failed to remove item from cart");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove item from cart");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white px-5 sm:px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Items in Cart
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {localCart.length} {localCart.length === 1 ? "item" : "items"}
          </span>
        </div>
        {localCart.length > 0 && (
          <button
            onClick={() => navigate("/categories")}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-black transition-colors cursor-pointer"
          >
            + Add more items
          </button>
        )}
      </div>

      {/* Loading Skeleton State */}
      {productLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-2">
                  <div className="w-36 sm:w-48 h-5 bg-slate-200 rounded-md" />
                  <div className="flex gap-2">
                    <div className="w-16 h-4 bg-slate-200 rounded-sm" />
                    <div className="w-16 h-4 bg-slate-200 rounded-sm" />
                  </div>
                  <div className="w-24 h-5 bg-slate-200 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="w-28 h-9 rounded-full bg-slate-200" />
                <div className="w-9 h-9 rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : localCart.length === 0 ? (
        /* Empty State */
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
            <ShoppingBag size={38} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Your shopping bag is empty
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            Looks like you haven't added anything to your cart yet. Explore our curated selection of top electronics.
          </p>
          <Link
            to="/categories"
            className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Product Item Cards List */
        <div className="space-y-3 sm:space-y-4">
          {localCart.map((item) => (
            <div
              key={item.id}
              className={`group bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 ${
                updatingId === item.id ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                  <div
                    onClick={() => navigate(`/productdetails/${item.productId}`)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 cursor-pointer overflow-hidden group-hover:scale-102 transition-transform"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <ShoppingBag size={24} className="text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/productdetails/${item.productId}`)}
                      className="font-bold text-slate-900 text-sm sm:text-base hover:text-slate-700 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {item.name}
                    </h3>

                    {/* Variant Specification Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {item.rom !== "N/A" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {item.rom}
                        </span>
                      )}
                      {item.color !== "N/A" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {item.color}
                        </span>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-base sm:text-lg font-black text-slate-900">
                        Rs {item.price.toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <span className="text-xs text-slate-400">
                          (Rs {item.price.toLocaleString()} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper, Subtotal & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Counter Pill */}
                  <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-full p-1 shadow-inner">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.productId,
                          item.variantId,
                          item.variantQuantity
                        )
                      }
                      disabled={item.quantity <= 1 || updatingId === item.id}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-black hover:bg-white transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Minus size={13} strokeWidth={2.5} />
                    </button>

                    <span className="w-8 text-center text-xs sm:text-sm font-bold text-slate-800 tabular-nums">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.productId,
                          item.variantId,
                          item.variantQuantity,
                          item.quantity
                        )
                      }
                      disabled={
                        item.quantity >= item.variantQuantity ||
                        updatingId === item.id
                      }
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-black hover:bg-white transition-all disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right sm:min-w-[110px]">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold hidden sm:block">
                      Subtotal
                    </p>
                    <p className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(item.id)}
                    disabled={updatingId === item.id}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[34px] min-h-[34px]"
                  >
                    {updatingId === item.id ? (
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={18} strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartSection;
