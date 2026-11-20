import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useEffect } from "react";
import productStore from "../../store/productStore";
import userStore from "../../store/userStore";
import { ToastContainer } from "react-toastify";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { fetchWishListItems, fetchCartItems, cartItems, wishListProducts } = productStore();
  const { token } = userStore();

  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const expiry = typeof window !== "undefined" ? localStorage.getItem("tokenExpiry") : null;
    const isExpired = expiry ? Date.now() > Number(expiry) : false;

    if ((token || localToken) && !isExpired) {
      if (wishListProducts.length === 0) {
        fetchWishListItems();
      }
      if (cartItems.length === 0) {
        fetchCartItems();
      }
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 w-full min-h-screen flex flex-col">{children}</main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default MainLayout;
