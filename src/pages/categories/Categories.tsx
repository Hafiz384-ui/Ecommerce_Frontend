import FilterSection from "../../components/categoriesComponent/FilterSection";
import ResultSection from "../../components/categoriesComponent/ResultSection";
import MainLayout from "../../components/layout/MainLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import productStore from "../../store/productStore";

function Categories() {
  const { selectedCategory } = productStore();

  const formattedCategoryName =
    selectedCategory === "AllProducts" || !selectedCategory
      ? "All Products"
      : selectedCategory;

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#FBFBFC] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Categories</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 font-semibold">{formattedCategoryName}</span>
          </nav>

          {/* Page Banner / Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Explore Collection
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-normal">
                Discover innovative technology, flagship smartphones, laptops, and premium audio.
              </p>
            </div>
          </div>

          {/* Catalog Layout: Sidebar + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Filter Sidebar Column */}
            <aside className="lg:col-span-3 w-full lg:sticky lg:top-28">
              <FilterSection />
            </aside>

            {/* Results Grid Column */}
            <main className="lg:col-span-9 w-full">
              <ResultSection />
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Categories;
