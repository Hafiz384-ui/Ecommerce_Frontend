import ItemCards from "../ui/ItemCards";
import productStore from "../../store/productStore";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

function NewModelSection() {
  const { product, fetchProducts, hasNextPage, nextPage, loading } = productStore();
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Initial fetch of 8 items for a balanced 2-row grid (4x2)
    fetchProducts(1, 5, false);
  }, []);

  const handleLoadMore = async () => {
    if (hasNextPage && !loading && !loadingMore) {
      setLoadingMore(true);
      await fetchProducts(nextPage, 5, true);
      setLoadingMore(false);
    }
  };

  return (
    <section className="w-full bg-[#FBFBFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-10 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>Latest Drops</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-sans">
              New Arrivals
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal">
              Explore the newest flagship flagships, ultrabooks, and high-fidelity audio gear.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-black transition-colors"
          >
            <span>View All Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Product Cards Grid with Shimmer Skeleton */}
        {loading && product.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs animate-pulse space-y-4"
              >
                <div className="w-full h-48 bg-slate-200 rounded-2xl" />
                <div className="space-y-2 pt-2">
                  <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
                  <div className="w-1/3 h-6 bg-slate-200 rounded-md" />
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <div className="w-20 h-4 bg-slate-200 rounded-md" />
                  <div className="w-24 h-9 bg-slate-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {product?.map((val: any, index: number) => (
              <ItemCards
                key={val?._id || index}
                cardImage={val?.images?.[0]}
                cardTitle={val?.name}
                cardPrice={val?.baseprice}
                productId={val?._id}
              />
            ))}
          </div>
        )}

        {/* Load More Button or Finished Indicator */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3">
          {hasNextPage ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore || loading}
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading more items...</span>
                </>
              ) : (
                <>
                  <span>Load More Products</span>
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          ) : (
            product.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 py-4">
                <span className="w-8 h-px bg-slate-200" />
                <span>You've reached the end of the collection</span>
                <span className="w-8 h-px bg-slate-200" />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default NewModelSection;
