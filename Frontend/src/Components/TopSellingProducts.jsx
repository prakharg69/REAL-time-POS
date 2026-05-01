import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopSellingProducts } from "../redux/slices/statsSlice";

const TopSellingProducts = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("day");

  const { data: products = [], loading, error } = useSelector(
    (state) => state.stats.topProducts
  );

  useEffect(() => {
    dispatch(fetchTopSellingProducts({ filter }));
  }, [dispatch, filter]);

  return (
    <div className="p-4 bg-[#f5f9ff]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#0f172a]">
            Top Selling Products
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Track your best performing products
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["day", "month", "year"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === item
                  ? "bg-blue-600 text-white"
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
        <div className="text-red-500 text-center text-sm mb-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-sm font-medium">
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No products found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">
                  Product Name
                </th>
                <th className="text-left p-3 font-medium text-gray-700">
                  Quantity
                </th>
                <th className="text-left p-3 font-medium text-gray-700">
                  Revenue
                </th>
                <th className="text-left p-3 font-medium text-gray-700">
                  Profit
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-[#0f172a]">
                    {product.productName}
                  </td>

                  <td className="p-3">
                    {product.totalQuantitySold}
                  </td>

                  <td className="p-3 text-blue-600 font-medium">
                    ₹ {product.totalRevenue}
                  </td>

                  <td className="p-3 text-green-600 font-medium">
                    ₹ {product.totalProfit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;