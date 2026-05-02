import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStockAlert } from "../Redux/Slices/StatsSlice";

// Sub-component: Circular Progress Indicator
const StockCircle = ({ current, min }) => {
  // Calculate percentage relative to the Minimum Stock required
  // If current >= min, it's 100% (Good). If 0, it's 0% (Critical).
  const percentage = Math.min(100, Math.max(0, (current / min) * 100));
  
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Color Logic
  let strokeColor = "#ef4444"; // Red for critical
  if (current > 0 && current < min) strokeColor = "#f97316"; // Orange for low
  if (current >= min) strokeColor = "#10b981"; // Emerald for healthy

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <svg width="40" height="40" className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={strokeColor}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Number in center */}
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-600">
        {current}
      </div>
    </div>
  );
};

const LowStockAlert = () => {
  const dispatch = useDispatch();

  const { data: products = [], loading, error } = useSelector(
    (state) => state.stats.lowStock
  );

  useEffect(() => {
    dispatch(fetchLowStockAlert());
  }, [dispatch]);

  return (
    <div className="w-full p-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        {/* Header - Compact */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Low Stock Alerts
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5">
              Items needing attention
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 mb-3 text-center text-red-600 bg-red-50 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-blue-600 text-xs font-bold animate-pulse">
              Loading...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 text-xs font-semibold">
            Stock levels healthy
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((item, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all duration-200"
              >
                {/* Left Side */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Small Product Icon Placeholder */}
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 truncate">
                            {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-slate-400 font-medium uppercase">
                                SKU: {item.sku}
                            </p>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                item.status === "Out of Stock"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-orange-100 text-orange-700"
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Circle & Min Info */}
                <div className="flex items-center gap-4 flex-shrink-0 pl-2 border-l border-slate-200 ml-2">
                    
                    {/* The Dynamic Circle */}
                    <div className="flex flex-col items-center justify-center">
                        <StockCircle current={item.currentStock} min={item.minimumStock} />
                        <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                            Min: {item.minimumStock}
                        </span>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;