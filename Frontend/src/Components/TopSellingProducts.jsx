import React, { useEffect, useState } from "react";
import axios from "axios";

const TopSellingProducts = () => {
  const [filter, setFilter] = useState("day");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchTopProducts = async (selectedFilter = filter) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5001/api/dashboard/top-selling-products?filter=${selectedFilter}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.log("Top Products Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    fetchTopProducts(value);
  };

  return (
    <div className="p-6 bg-[#f5f9ff] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f172a]">
            Top Selling Products
          </h1>
          <p className="text-gray-500 mt-1">
            Track your best performing products
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-lg font-medium">
            Loading top products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No products found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Quantity Sold
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Revenue
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
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
                  <td className="p-4 font-medium text-[#0f172a]">
                    {product.productName}
                  </td>

                  <td className="p-4">
                    {product.totalQuantitySold}
                  </td>

                  <td className="p-4 text-blue-600 font-semibold">
                    ₹ {product.totalRevenue}
                  </td>

                  <td className="p-4 text-green-600 font-semibold">
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