import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import DetailsSection from "../../components/productDetailComponents/DetailsSection";
import ProductDetail from "../../components/productDetailComponents/ProductDetail";
import RatingReview from "../../components/productDetailComponents/RatingReview";
import { useParams } from "react-router-dom";
import productStore from "../../store/productStore";
import GlobalLoader from "../../components/ui/GlobalLoader";

function ProductDetails() {
  const { productId, id } = useParams();
  const currentId = productId || id;
  const { findProduct, productDetailLoading, currentProduct } = productStore();
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    const fetchProductById = () => {
      window.scrollTo(0, 0);
      if (currentId) {
        findProduct(currentId);
      }
    };
    fetchProductById();
  }, [currentId]);

  const isInitialLoading = productDetailLoading || (!currentProduct && !!currentId);

  return (
    <div className="w-full min-h-screen">
      <MainLayout>
        {isInitialLoading ? (
          <GlobalLoader fullScreen={false} message="Loading product details..." />
        ) : (
          <div>
            <DetailsSection />
            {/* Tabs Section */}
            <div className="w-full bg-white">
              {/* Tab Buttons */}
              <div className="w-full mx-auto flex justify-center items-center gap-8 sm:gap-20 py-4 sm:py-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`relative text-base sm:text-lg font-semibold transition-all duration-300 cursor-pointer
              ${
                activeTab === "details"
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
                >
                  Product Details
                  <span
                    className={`absolute left-0 -bottom-1 h-[3px] w-full bg-black transition-all duration-300 
                ${
                  activeTab === "details" ? "scale-x-100" : "scale-x-0"
                } origin-left`}
                  ></span>
                </button>

                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`relative text-base sm:text-lg font-semibold transition-all duration-300 cursor-pointer
              ${
                activeTab !== "details"
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
                >
                  Rating & Reviews
                  <span
                    className={`absolute left-0 -bottom-1 h-[3px] w-full bg-black transition-all duration-300 
                ${
                  activeTab !== "details" ? "scale-x-100" : "scale-x-0"
                } origin-left`}
                  ></span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="w-full mx-auto px-10 py-5 text-gray-700">
                {activeTab === "details" ? <ProductDetail /> : <RatingReview />}
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </div>
  );
}

export default ProductDetails;
