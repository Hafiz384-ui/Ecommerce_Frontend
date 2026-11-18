import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Package,
  Ticket,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import userStore from "../../store/userStore";
import { toast } from "react-toastify";
import productStore from "../../store/productStore";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);

  const { user, logoutUser, isAuthChecking, token, clearAuth } = userStore();
  const { wishListProducts, cartItems } = productStore();

  // Active auth sync: immediately clears stale in-memory user when token is removed or expired
  useEffect(() => {
    const syncAuth = () => {
      const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
      const isExpired = expiry ? Date.now() > Number(expiry) : false;

      // If token is missing from localStorage or expired, but Zustand still has user/token
      if ((!localToken || isExpired) && (token || user)) {
        clearAuth();
      }
    };

    syncAuth();

    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("storage", syncAuth);
    const interval = setInterval(syncAuth, 2000);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("storage", syncAuth);
      clearInterval(interval);
    };
  }, [token, user, clearAuth]);
  
  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userMenuTriggerRef.current &&
        !userMenuTriggerRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const logoutHandler = async () => {
    try {
      setUserMenuOpen(false);
      const result = await logoutUser();
      if (result.success) {
        toast.success("Logout successful!");
      } else {
        toast.error(result.message || "Logout failed!");
      }
    } catch (err) {
      toast.error("Something went wrong during logout!");
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <nav className="max-w-7xl mx-auto h-18 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT SECTION: Brand & Desktop Nav */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900 group"
          >
            <span>DARAZ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block mb-1 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 self-end mb-1">
              Lite
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-slate-900 font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-slate-900 font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-slate-900 font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              Orders
            </NavLink>
            <NavLink
              to="/coupon"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-slate-900 font-semibold bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              Coupons
            </NavLink>
          </div>
        </div>

        {/* RIGHT SECTION: Actions & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAuthChecking ? (
            /* Stable Loading Skeleton */
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
              <div className="w-24 h-10 rounded-full bg-slate-100 animate-pulse hidden sm:block" />
            </div>
          ) : (token && user) ? (
            <>
              {/* Wishlist Icon */}
              <NavLink
                to="/wishlist"
                aria-label="Saved Wishlist"
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 group ${
                    isActive
                      ? "bg-rose-50 text-rose-600"
                      : "text-slate-700 hover:text-rose-600 hover:bg-rose-50/70"
                  }`
                }
              >
                <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {wishListProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                    {wishListProducts.length > 99
                      ? "99+"
                      : wishListProducts.length}
                  </span>
                )}
              </NavLink>

              {/* Shopping Cart Icon */}
              <NavLink
                to="/cart"
                aria-label="Shopping Cart"
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-95 group ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </NavLink>

              {/* User Account Trigger Button */}
              <div className="relative">
                <button
                  ref={userMenuTriggerRef}
                  aria-label="User Account Menu"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 active:scale-98 cursor-pointer focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-slate-800 to-slate-950 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[80px] truncate hidden sm:inline">
                    {user?.username ? user.username.split(" ")[0] : "Account"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Professional User Dropdown Menu Card */}
                {userMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* User Identity Header */}
                    <div className="p-3 bg-slate-50/80 rounded-xl mb-1.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                        {user?.username ? user.username[0].toUpperCase() : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user?.username || "Valued Customer"}
                          </p>
                          {user?.role === "admin" && (
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user?.email || "No email provided"}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/80">
                          {user?.role ? user.role.toUpperCase() : "CUSTOMER"}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5 py-1">
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-black hover:bg-slate-100 transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-black hover:bg-slate-100 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Wishlist</span>
                      </Link>

                      <Link
                        to="/coupon"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-black hover:bg-slate-100 transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-amber-500" />
                        <span>Discounts & Coupons</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 my-1" />

                    {/* Logout Button */}
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged Out CTA */
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all duration-200 shadow-xs hover:shadow cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            aria-label="Toggle Mobile Navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/categories"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Orders
            </Link>
            <Link
              to="/coupon"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Coupons
            </Link>
          </div>

          {!(token && user) && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;