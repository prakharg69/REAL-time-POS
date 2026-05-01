import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductPerformance } from "../Redux/Slices/StatsSlice";


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
      <div className="p-4 bg-white rounded-xl shadow-sm border text-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-sm border text-red-500 text-center">
        {error}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: data.totalProducts,
      color: "text-blue-600",
    },
    {
      label: "Active Products",
      value: data.totalActive,
      color: "text-green-600",
    },
    {
      label: "Out of Stock",
      value: data.totalOutOfStock,
      color: "text-red-600",
    },
    {
      label: "Low Stock",
      value: data.totalLowStock,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold text-[#0f172a] mb-4">
        Inventory Overview
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-gray-50 flex flex-col items-center justify-center"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryStats;