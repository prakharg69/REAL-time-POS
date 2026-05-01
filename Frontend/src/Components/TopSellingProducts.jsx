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
    <div className="w-full p-6 bg-slate-50">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        
        {/* Header - Reduced padding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="min-w-max">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Top Selling Products
            </h1>
            {/* Subtitle made smaller and tighter */}
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Track your best performing products
            </p>
          </div>

          {/* Filters */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-fit">
            {["day", "month", "year"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                  filter === item
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 mb-4 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 font-semibold text-sm">
            {error}
          </div>
        )}

        {/* Table Container */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-blue-600 text-lg font-bold animate-pulse">
              Loading products...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-semibold">
            No products found
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {/* Fixed widths for perfect alignment */}
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/2">
                    Product Name
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-1/6">
                    Quantity
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-1/6">
                    Revenue
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider w-1/6">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-blue-50/50 transition-colors duration-200"
                  >
                    {/* Product Name */}
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-800 text-sm whitespace-nowrap">
                        {product.productName}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-3">
                      <div className="text-slate-600 font-medium text-center text-sm">
                        {product.totalQuantitySold}
                      </div>
                    </td>

                    {/* Revenue - Force one line */}
                    <td className="px-5 py-3">
                      <div className="text-blue-600 font-bold text-right text-sm whitespace-nowrap">
                        ₹ {product.totalRevenue.toLocaleString()}
                      </div>
                    </td>

                    {/* Profit - Force one line */}
                    <td className="px-5 py-3">
                      <div className="text-emerald-600 font-bold text-right text-sm whitespace-nowrap">
                        ₹ {product.totalProfit.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;