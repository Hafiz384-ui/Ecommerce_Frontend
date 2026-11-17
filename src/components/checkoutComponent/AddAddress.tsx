import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  ChevronRight,
  User,
  Save,
} from "lucide-react";
import addressStore from "../../store/addressStore";
import MainLayout from "../../components/layout/MainLayout";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { showGlobalLoader, hideGlobalLoader } from "../../store/loadingStore";

interface UserAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const AddAddress: React.FC = () => {
  const { createAddress, loading } = addressStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserAddress, string>>>({});

  const addressSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .required("Full name is required"),

    phone: Yup.string()
      .trim()
      .min(8, "Please enter a valid phone number")
      .required("Phone number is required"),

    address: Yup.string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .required("Street address is required"),

    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State/Province is required"),

    zip: Yup.string().trim().required("ZIP/Postal code is required"),

    country: Yup.string().trim().required("Country is required"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrors({});
      await addressSchema.validate(formData, { abortEarly: false });

      showGlobalLoader("Saving address...");
      const result = await createAddress(formData as any);
      hideGlobalLoader();

      if (result.success) {
        toast.success("Address saved successfully!");
        setFormData({
          fullName: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        });
        navigate("/checkout");
      } else {
        toast.error(result.message || "Failed to save address!");
      }
    } catch (err: any) {
      hideGlobalLoader();
      if (err.inner && err.inner.length > 0) {
        const validationErrors: Partial<Record<keyof UserAddress, string>> = {};
        err.inner.forEach((error: any) => {
          if (error.path && !validationErrors[error.path as keyof UserAddress]) {
            validationErrors[error.path as keyof UserAddress] = error.message;
          }
        });
        setErrors(validationErrors);
        toast.error("Please fill all required fields correctly.");
      } else {
        toast.error(err.message || "Validation failed");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFC]">
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/checkout" className="hover:text-black transition-colors">
              Checkout
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">New Address</span>
          </nav>

          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">
                Add Shipping Address
              </h1>
              <p className="text-sm text-slate-500">
                Provide accurate delivery coordinates to ensure smooth and on-time shipment.
              </p>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Checkout</span>
            </button>
          </div>

          {/* Form Container Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: Recipient Information */}
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Recipient Information
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Who should we deliver the package to?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="e.g. John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.fullName
                            ? "border-rose-400 focus:ring-rose-200"
                            : "border-slate-200 focus:border-black focus:ring-black/5"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. +92 300 1234567"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.phone
                            ? "border-rose-400 focus:ring-rose-200"
                            : "border-slate-200 focus:border-black focus:ring-black/5"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Destination Address */}
              <div>
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Destination Address
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Exact street address and postal details
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      rows={2}
                      placeholder="e.g. Apartment, Suite, House #, Street Name"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-none transition-all ${
                        errors.address
                          ? "border-rose-400 focus:ring-rose-200"
                          : "border-slate-200 focus:border-black focus:ring-black/5"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City & State Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Lahore, Karachi"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.city
                            ? "border-rose-400 focus:ring-rose-200"
                            : "border-slate-200 focus:border-black focus:ring-black/5"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* State / Province */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        State / Province <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g. Punjab, Sindh"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.state
                            ? "border-rose-400 focus:ring-rose-200"
                            : "border-slate-200 focus:border-black focus:ring-black/5"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ZIP & Country Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* ZIP Code */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Postal / ZIP Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="e.g. 54000"
                        value={formData.zip}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.zip
                            ? "border-rose-400 focus:ring-rose-200"
                            : "border-slate-200 focus:border-black focus:ring-black/5"
                        }`}
                      />
                      {errors.zip && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">
                          {errors.zip}
                        </p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="e.g. Pakistan"
                        value={formData.country}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.country
                            ? "border-rose-400 focus:ring-rose-200"
                            : "border-slate-200 focus:border-black focus:ring-black/5"
                        }`}
                      />
                      {errors.country && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Use Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default AddAddress;
