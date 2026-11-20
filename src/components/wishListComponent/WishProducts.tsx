import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import productStore from "../../store/productStore";
import ItemCards from "../ui/ItemCards";
import Pagination from "../ui/Pagination";

function WishProducts() {
  const navigate = useNavigate();
  const { fetchWishListItems, wishlistLoading, wishListProducts, wishlistPagination } =
    productStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const isFirstMount = useRef(true);

  const loadWishlist = async (page = currentPage) => {
    try {
      setError(null);
      await fetchWishListItems({ page, limit: 8 });
    } catch (err: any) {
      setError("Failed to load wishlist items. Please try again.");
    }
  };

  useEffect(() => {
    loadWishlist(currentPage);
    if (!isFirstMount.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    isFirstMount.current = false;
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full bg-[#FBFBFC] py-8 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Saved Wishlist
              </h1>
              {!wishlistLoading && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                  {wishlistPagination?.totalItems ?? wishListProducts?.length ?? 0}{" "}
                  {(wishlistPagination?.totalItems ?? wishListProducts?.length ?? 0) === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Curate your personal collection and save items for upcoming purchases.
            </p>
          </div>

          {wishListProducts?.length > 0 && !wishlistLoading && (
            <button
              onClick={() => navigate("/categories")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-black transition-colors cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Error State */}
        {error ? (
          <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Unable to load wishlist
            </h3>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => loadWishlist(currentPage)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : wishlistLoading ? (
          /* Shimmer Skeleton Grid (Zero Layout Shift) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs animate-pulse"
              >
                <div className="w-full h-48 bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-9 bg-slate-200 rounded-xl w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : wishListProducts?.length === 0 ? (
          /* Clean Luxury Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Heart className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
              Explore our catalog to find items you love. Tap the heart icon on any product to save it here for later.
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-black shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Discover Products</span>
            </button>
          </div>
        ) : (
          /* Wishlist Items Grid with Pagination */
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishListProducts.map((product, index) => (
                <ItemCards
                  key={product?._id || index}
                  cardImage={product?.images?.[0]}
                  cardTitle={product?.name}
                  cardPrice={product?.baseprice}
                  productId={product?._id}
                  onWishToggle={() => loadWishlist(currentPage)}
                />
              ))}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={wishlistPagination?.currentPage || currentPage}
              totalPages={wishlistPagination?.totalPages || 1}
              onPageChange={handlePageChange}
              isLoading={wishlistLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default WishProducts;