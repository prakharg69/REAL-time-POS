import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStockAlert } from "../Redux/Slices/StatsSlice";

// Sub-component: Compact Circular Progress Indicator (Smallest)
const StockCircle = ({ current, min }) => {
  const percentage = Math.min(100, Math.max(0, (current / min) * 100));
  
  // Smallest radius for compact look
  const radius = 15; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  let strokeColor = "#ef4444"; // Red
  if (current > 0 && current < min) strokeColor = "#f97316"; // Orange
  if (current >= min) strokeColor = "#10b981"; // Green

  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      <svg width="36" height="36" className="transform -rotate-90">
        <circle cx="18" cy="18" r={radius} stroke="#e2e8f0" strokeWidth="4" fill="none" />
        <circle
          cx="18" cy="18" r={radius} stroke={strokeColor} strokeWidth="4" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-slate-700">
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
        
        {/* Header - Minimal Spacing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Low Stock Alerts
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Products requiring immediate restock
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3 mb-4 text-center text-red-600 bg-red-50 rounded-lg border border-red-100 font-semibold text-xs">
            {error}
          </div>
        )}

        {/* Content - Compact Spacing */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-blue-600 text-sm font-bold animate-pulse">
              Checking inventory...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-semibold">
            Stock levels healthy
          </div>
        ) : (
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {products.map((item, index) => (
              <div
                key={index}
                className="group relative flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                
                {/* Left Accent Border */}
                <div 
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                        item.status === "Out of Stock" ? "bg-red-500" : "bg-orange-500"
                    }`} 
                />

                {/* Left Side - Compact */}
                <div className="flex items-center gap-3 pl-3 flex-1">
                    {/* Smaller Colored Icon */}
                    <div 
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                            item.status === "Out of Stock" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate leading-tight">
                            {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                                SKU: {item.sku}
                            </p>
                            <span 
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm border ${
                                    item.status === "Out of Stock"
                                        ? "bg-white text-red-700 border-red-100"
                                        : "bg-white text-orange-700 border-orange-100"
                                }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Compact Circle */}
                <div className="flex items-center gap-4 flex-shrink-0 pl-3 border-l border-slate-100 ml-2">
                    
                    <div className="flex flex-col items-center justify-center">
                        <StockCircle current={item.currentStock} min={item.minimumStock} />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
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