import { useState } from "react";
import {
  X,
  SlidersHorizontal,
  LayoutGrid,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Check,
} from "lucide-react";
import productStore from "../../store/productStore";
import { toast } from "react-toastify";

interface CategoryOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { id: "AllProducts", name: "All Products", icon: LayoutGrid },
  { id: "Smartphone", name: "Smartphones", icon: Smartphone },
  { id: "Laptop", name: "Laptops & Notebooks", icon: Laptop },
  { id: "Tablet", name: "Tablets & iPads", icon: Tablet },
  { id: "Smartwatch", name: "Smartwatches", icon: Watch },
  { id: "Headphone", name: "Headphones & Audio", icon: Headphones },
];

function FilterSection() {
  const { fetchProductByCategory, selectedCategory, setSelectedCategory } =
    productStore();

  const [isOpen, setIsOpen] = useState(false);

  const categoryHandler = async (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);

    const res = await fetchProductByCategory(category);
    if (!res.success) toast.error(res.message || "Failed to load category products");
  };

  const activeCategory = selectedCategory || "AllProducts";
  const activeCategoryItem = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <>
      {/* MOBILE FILTER TRIGGER BAR */}
      <div className="lg:hidden mb-4 flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          {activeCategoryItem && (
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
              <activeCategoryItem.icon size={16} />
            </div>
          )}
          <div>
            <p className="text-xs text-slate-400 font-medium">Selected Category</p>
            <p className="text-sm font-bold text-slate-900">
              {activeCategoryItem?.name || "All Products"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>
      </div>

      {/* SIDEBAR PANEL (Desktop Static + Mobile Drawer) */}
      <div
        className={`fixed lg:static top-0 left-0 z-50 lg:z-auto
          h-full lg:h-auto w-4/5 sm:w-80 lg:w-full
          bg-white border-r lg:border border-slate-200/80 shadow-2xl lg:shadow-xs
          p-5 sm:p-6 overflow-y-auto lg:overflow-visible
          rounded-r-3xl lg:rounded-3xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Mobile Drawer Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Filter By Category</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
            className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Sidebar Header */}
        <div className="hidden lg:flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-500" />
            <span>Categories</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            {CATEGORIES.length} options
          </span>
        </div>

        {/* Category Buttons List */}
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => categoryHandler(cat.id)}
                className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm transition-all duration-200 cursor-pointer text-left ${
                  active
                    ? "bg-black text-white font-bold shadow-md shadow-black/10 scale-[1.01]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200/70"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span>{cat.name}</span>
                </div>

                {active && (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}
    </>
  );
}

export default FilterSection;
