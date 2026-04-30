import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesOverview } from "../Redux/Slices/StatsSlice";


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
    <div className="p-6 bg-[#f5f9ff] min-h-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">
            Sales Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Track your shop performance
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3">
          {["day", "month", "year"].map((item) => (
            <button
              key={item}
              onClick={() => handleFilterChange(item)}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                filter === item
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="text-center text-lg font-medium">
          Loading dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-2">Total Sales</p>
            <h2 className="text-3xl font-bold text-blue-600">
              ₹ {stats.totalSales}
            </h2>
          </div>

          {/* Total Profit */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-2">Total Profit</p>
            <h2 className="text-3xl font-bold text-green-600">
              ₹ {stats.totalProfit}
            </h2>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-2">Total Orders</p>
            <h2 className="text-3xl font-bold text-[#0f172a]">
              {stats.totalOrders}
            </h2>
          </div>

          {/* Products Sold */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm mb-2">
              Products Sold
            </p>
            <h2 className="text-3xl font-bold text-purple-600">
              {stats.totalProductsSold}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOverview;