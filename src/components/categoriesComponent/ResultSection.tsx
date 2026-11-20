import ItemCards from "../ui/ItemCards";
import Pagination from "../ui/Pagination";
import productStore from "../../store/productStore";
import { useEffect, useState, useRef } from "react";
import { Search, ArrowUpDown, PackageOpen, RotateCcw, X } from "lucide-react";

const CATEGORY_NAMES: Record<string, string> = {
  AllProducts: "All Products",
  Smartphone: "Smartphones",
  Laptop: "Laptops & Notebooks",
  Tablet: "Tablets & iPads",
  Smartwatch: "Smartwatches",
  Headphone: "Headphones & Audio",
};

function ResultSection() {
  const {
    categoryItems,
    fetchProductByCategory,
    selectedCategory,
    setSelectedCategory,
    categoryloading,
    categoryPagination,
  } = productStore();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isFirstMount = useRef(true);

  // Debounce search input for seamless backend querying (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1); // reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Main data loader triggered on category, page, search, or sort change
  useEffect(() => {
    const category =
      selectedCategory ||
      localStorage.getItem("selectedCategory") ||
      "AllProducts";

    fetchProductByCategory(category, {
      page: currentPage,
      limit: 5,
      search: debouncedSearch,
      sort: sortBy,
    });

    if (!isFirstMount.current) {
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
    isFirstMount.current = false;
  }, [selectedCategory, currentPage, debouncedSearch, sortBy]);

  const activeCategory = selectedCategory || "AllProducts";
  const categoryTitle = CATEGORY_NAMES[activeCategory] || activeCategory;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // reset to page 1 on sort change
  };

  const handleResetFilters = async () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSortBy("featured");
    setCurrentPage(1);
    setSelectedCategory("AllProducts");
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Top Filter & Toolbar Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {categoryTitle}
            </h2>
            {!categoryloading && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {categoryPagination?.totalProducts ?? categoryItems.length}{" "}
                {(categoryPagination?.totalProducts ?? categoryItems.length) === 1
                  ? "product"
                  : "products"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse genuine devices with manufacturer warranty.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick Search */}
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-black focus:bg-white transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:border-black focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Area */}
      {categoryloading ? (
        /* Shimmer Skeletons Grid (Prevents layout shift) */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs animate-pulse flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-48 rounded-xl bg-slate-200" />
                <div className="mt-4 space-y-2">
                  <div className="w-20 h-4 bg-slate-200 rounded-md" />
                  <div className="w-4/5 h-5 bg-slate-200 rounded-md" />
                  <div className="w-1/2 h-4 bg-slate-200 rounded-md" />
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="w-24 h-6 bg-slate-200 rounded-md" />
                <div className="w-28 h-9 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : categoryItems.length > 0 ? (
        <>
          {/* Rendered Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {categoryItems.map((val: any, index: number) => (
              <ItemCards
                key={val._id || index}
                cardImage={val.images?.[0] || ""}
                cardTitle={val.name}
                cardPrice={val.baseprice}
                productId={val._id}
              />
            ))}
          </div>

          {/* Backend Page-by-Page Pagination */}
          <Pagination
            currentPage={categoryPagination?.currentPage || currentPage}
            totalPages={categoryPagination?.totalPages || 1}
            onPageChange={handlePageChange}
            isLoading={categoryloading}
          />
        </>
      ) : (
        /* Empty State */
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
            <PackageOpen size={38} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            No products match your criteria
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            {searchInput
              ? `No items found matching "${searchInput}". Try adjusting your keywords or clearing the search.`
              : "There are currently no products listed under this category. Please check back soon."}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>View All Products</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultSection;
