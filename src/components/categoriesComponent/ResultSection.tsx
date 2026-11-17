import ItemCards from "../ui/ItemCards";
import productStore from "../../store/productStore";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown, PackageOpen, RotateCcw } from "lucide-react";

interface CardItem {
  images: string[];
  name: string;
  baseprice: number;
  _id: string;
}

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
  } = productStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    const init = async () => {
      window.scrollTo(0, 0);
      const category =
        selectedCategory ||
        localStorage.getItem("selectedCategory") ||
        "AllProducts";

      if (!categoryItems.length) {
        await fetchProductByCategory(category);
      }
    };
    init();
  }, []);

  const activeCategory = selectedCategory || "AllProducts";
  const categoryTitle = CATEGORY_NAMES[activeCategory] || activeCategory;

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let list: CardItem[] = Array.isArray(categoryItems) ? [...categoryItems] : [];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => item.name?.toLowerCase().includes(q));
    }

    // Sorting
    if (sortBy === "price-low") {
      list.sort((a, b) => (a.baseprice || 0) - (b.baseprice || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (b.baseprice || 0) - (a.baseprice || 0));
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [categoryItems, searchQuery, sortBy]);

  const handleResetFilters = async () => {
    setSearchQuery("");
    setSortBy("featured");
    setSelectedCategory("AllProducts");
    await fetchProductByCategory("AllProducts");
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
                {filteredAndSortedItems.length}{" "}
                {filteredAndSortedItems.length === 1 ? "product" : "products"}
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
              placeholder="Filter products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-52 pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:border-black focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
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
      ) : filteredAndSortedItems.length > 0 ? (
        /* Rendered Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((val, index) => (
            <ItemCards
              key={val._id || index}
              cardImage={val.images?.[0] || ""}
              cardTitle={val.name}
              cardPrice={val.baseprice}
              productId={val._id}
            />
          ))}
        </div>
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
            {searchQuery
              ? `No items found matching "${searchQuery}". Try adjusting your keywords or clearing the search.`
              : "There are currently no products listed under this category. Please check back soon."}
          </p>
          <button
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
