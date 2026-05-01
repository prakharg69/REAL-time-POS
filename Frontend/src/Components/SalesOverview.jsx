import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesOverview } from "../Redux/Slices/StatsSlice";

// Simple Icon Components
const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ProfitIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const OrderIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
);
const ProductIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);

const SalesOverview = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("day");

  const { data: stats, loading, error } = useSelector(
    (state) => state.stats.salesStats
  );

  useEffect(() => {
    dispatch(fetchSalesOverview({ filter }));
  }, [dispatch, filter]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <div className="w-full p-6 bg-slate-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sales Overview
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Track your shop performance
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {["day", "month", "year"].map((item) => (
            <button
              key={item}
              onClick={() => handleFilterChange(item)}
              className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                filter === item
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 mb-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 font-semibold">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-blue-600 text-lg font-bold animate-pulse">
            Loading dashboard data...
          </div>
        </div>
      ) : (
        /* Stats Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Total Sales Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            {/* items-center fixes alignment */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                  Total Sales
                </p>
                <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">
                  ₹ {stats.totalSales}
                </h2>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CurrencyIcon />
              </div>
            </div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                  Total Profit
                </p>
                <h2 className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  ₹ {stats.totalProfit}
                </h2>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ProfitIcon />
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                  Total Orders
                </p>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {stats.totalOrders}
                </h2>
              </div>
              <div className="p-3 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <OrderIcon />
              </div>
            </div>
          </div>

          {/* Products Sold Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                  Products Sold
                </p>
                <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                  {stats.totalProductsSold}
                </h2>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ProductIcon />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default SalesOverview;