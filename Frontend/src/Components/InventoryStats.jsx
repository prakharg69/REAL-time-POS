import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductPerformance } from "../Redux/Slices/StatsSlice";

// Icons (Cleaner versions)
const BoxIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const CheckIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const WarningIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const InventoryStats = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state) => state.stats.inventoryStats
  );

  useEffect(() => {
    dispatch(fetchProductPerformance());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full h-full p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
        <div className="text-blue-600 text-lg font-bold animate-pulse">Loading inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center">
        <div className="text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl">{error}</div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: data.totalProducts,
      // Full Gradient Card
      gradient: "bg-gradient-to-br from-blue-600 to-blue-500",
      icon: <BoxIcon />,
      decoration: "from-blue-400"
    },
    {
      label: "Active Products",
      value: data.totalActive,
      gradient: "bg-gradient-to-br from-emerald-600 to-emerald-500",
      icon: <CheckIcon />,
      decoration: "from-emerald-400"
    },
    {
      label: "Out of Stock",
      value: data.totalOutOfStock,
      gradient: "bg-gradient-to-br from-red-600 to-red-500",
      icon: <AlertIcon />,
      decoration: "from-red-400"
    },
    {
      label: "Low Stock",
      value: data.totalLowStock,
      gradient: "bg-gradient-to-br from-orange-600 to-orange-500",
      icon: <WarningIcon />,
      decoration: "from-orange-400"
    },
  ];

  return (
    // h-full ensures it fills the container
    <div className="w-full h-full flex flex-col bg-slate-50">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 h-full flex flex-col">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory Overview
          </h2>
        </div>

        {/* Grid - Fills remaining space */}
        <div className="grid grid-cols-2 gap-5 flex-1">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl p-6 shadow-lg ${item.gradient} text-white hover:scale-[1.02] transition-transform duration-300 h-full flex flex-col justify-between`}
            >
              
              {/* Decorative Background Circle */}
              <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}></div>

              {/* Top Section: Icon */}
              <div className="relative z-10 flex justify-between items-start">
                 {/* Icon Container with Glass Effect */}
                 <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-sm">
                    {item.icon}
                 </div>
                 {/* Small arrow/visual indicator */}
                 <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>

              {/* Bottom Section: Text */}
              <div className="relative z-10 mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">
                  {item.label}
                </p>
                
                {/* Value - Highlighted and Bigger */}
                <p className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none">
                  {item.value}
                </p>
              </div>

              {/* Bottom Shine Effect */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.decoration} to-transparent opacity-50`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;