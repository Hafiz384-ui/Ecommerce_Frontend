import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

// Code-split heavy & non-initial routes for optimal initial bundle size and FCP/LCP
const ProductDetails = lazy(() => import("../pages/productDetails/ProductDetails"));
const Cart = lazy(() => import("../pages/cart/Cart"));
const WishList = lazy(() => import("../pages/wishList/WishList"));
const Categories = lazy(() => import("../pages/categories/Categories"));
const Orders = lazy(() => import("../pages/orders/Orders"));
const Signup = lazy(() => import("../pages/signup/Signup"));
const Login = lazy(() => import("../pages/login/Login"));
const Checkout = lazy(() => import("../pages/checkout/Checkout"));
const OrderSuccess = lazy(() => import("../pages/orderSuccess/OrderSuccess"));
const AddAddress = lazy(() => import("../components/checkoutComponent/AddAddress"));
const Coupon = lazy(() => import("../pages/coupon/Coupon"));

const RouteFallback = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#FBFBFC]">
    <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);

function Routing() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public Browsing Routes */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/products" element={<PublicRoute><Categories /></PublicRoute>} />
          <Route path="/categories" element={<PublicRoute><Categories /></PublicRoute>} />
          <Route path="/product/:id" element={<PublicRoute><ProductDetails /></PublicRoute>} />
          <Route path="/productdetails/:productId" element={<PublicRoute><ProductDetails /></PublicRoute>} />

          {/* Public Auth Routes */}
          <Route path="/signup" element={<PublicRoute restricted><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute restricted><Login /></PublicRoute>} />

          {/* Protected Private Routes */}
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><WishList /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/createaddress" element={<PrivateRoute><AddAddress /></PrivateRoute>} />
          <Route path="/ordersuccess" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="/coupon" element={<PrivateRoute><Coupon /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default Routing;