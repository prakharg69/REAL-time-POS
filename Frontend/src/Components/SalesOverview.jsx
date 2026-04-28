import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesOverview = () => {
  const [filter, setFilter] = useState("day");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProductsSold: 0,
    totalProfit: 0,
  });

  const fetchSalesOverview = async (selectedFilter = filter) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5001/api/dashboard/sales-overview?filter=${selectedFilter}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.log("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOverview();
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    fetchSalesOverview(value);
  };

  return (
    <div className="p-6 bg-[#f5f9ff] min-h-screen">
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