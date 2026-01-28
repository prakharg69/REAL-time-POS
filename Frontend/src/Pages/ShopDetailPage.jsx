import React, { useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";

function ShopDetailPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: "",
    city: "",
    businessType: "",
    category: "",
    shopSize: "small",
  });

  const businessOptions = [
    { id: "wholesaler", label: "Wholesaler" },
    { id: "retailer", label: "Retailer" },
    { id: "both", label: "Both" },
  ];

  const shopSizeOptions = [
    { id: "small", label: "Small (0-500 sq ft)" },
    { id: "medium", label: "Medium (500-2000 sq ft)" },
    { id: "large", label: "Large (2000+ sq ft)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, businessType: type }));
  };

  const handleShopSizeChange = (size) => {
    setFormData((prev) => ({ ...prev, shopSize: size }));
  };

  const handleNext = () => {
    if (
      step === 1 &&
      formData.shopName &&
      formData.city &&
      formData.businessType
    ) {
      setStep(2);
    }
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Form submitted:", formData);
      const res = await axios.post(
        "http://localhost:5001/api/Shopcreated",
        formData,
        { withCredentials: true },
      );
      console.log("dataaaaa ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isStep1Valid = () => {
    return formData.shopName && formData.city && formData.businessType;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Tracker - Clean version */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${step >= 1 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-500"}`}
              >
                {step > 1 ? (
                  <Check size={24} />
                ) : (
                  <span className="text-lg font-semibold">1</span>
                )}
              </div>
              <span
                className={`mt-3 text-sm font-semibold ${step >= 1 ? "text-blue-600" : "text-gray-500"}`}
              >
                Shop Details
              </span>
            </div>

            {/* Connecting Line Only */}
            <div className="w-24 h-0.5 mx-8 bg-gray-300 relative">
              <div
                className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ${step >= 2 ? "w-full" : "w-0"}`}
              ></div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${step >= 2 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-500"}`}
              >
                <span className="text-lg font-semibold">2</span>
              </div>
              <span
                className={`mt-3 text-sm font-semibold ${step >= 2 ? "text-blue-600" : "text-gray-500"}`}
              >
                Business Details
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Shop Information
                </h2>
                <p className="text-gray-600">
                  Enter basic details about your shop
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Enter shop name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Business Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {businessOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                          formData.businessType === option.id
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                        }`}
                        onClick={() => handleBusinessTypeChange(option.id)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                              formData.businessType === option.id
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.businessType === option.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`font-medium ${
                              formData.businessType === option.id
                                ? "text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStep1Valid()}
                  className={`flex items-center px-8 py-3.5 rounded-lg font-medium text-lg ${
                    isStep1Valid()
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } transition-all duration-200`}
                >
                  Continue
                  <ChevronRight size={22} className="ml-3" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Business Details
                </h2>
                <p className="text-gray-600">
                  Complete your business information
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Enter business category (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Shop Size
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {shopSizeOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                          formData.shopSize === option.id
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                        }`}
                        onClick={() => handleShopSizeChange(option.id)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                              formData.shopSize === option.id
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.shopSize === option.id && (
                              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="text-left">
                            <span
                              className={`font-medium block ${
                                formData.shopSize === option.id
                                  ? "text-blue-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {option.label.split("(")[0].trim()}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 block">
                              {option.label.match(/\(([^)]+)\)/)?.[1]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-8 py-3.5 rounded-lg font-medium text-lg text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  <ChevronLeft size={22} className="mr-3" />
                  Back
                </button>

                <button
                  type="submit"
                  className="flex items-center px-8 py-3.5 rounded-lg font-medium text-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ShopDetailPage;
