import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStockAlert } from "../Redux/Slices/StatsSlice";


const LowStockAlert = () => {
  const dispatch = useDispatch();

  const { data: products = [], loading, error } = useSelector(
    (state) => state.stats.lowStock
  );

  useEffect(() => {
    dispatch(fetchLowStockAlert());
  }, [dispatch]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#0f172a]">
          Low Stock Alerts
        </h2>
        <p className="text-xs text-gray-400">
          Products below minimum stock
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-xs mb-3 text-center">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-6 text-sm">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          No low stock items
        </div>
      ) : (
        <div className="space-y-3 max-h-75 overflow-y-auto">
          {products.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-red-50"
            >
              {/* Left */}
              <div>
                <p className="text-sm font-medium text-[#0f172a]">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500">
                  SKU: {item.sku || "N/A"}
                </p>

                {/* Status */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded mt-1 inline-block ${
                    item.status === "Out of Stock"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">
                  {item.currentStock}
                </p>
                <p className="text-xs text-gray-500">
                  Min: {item.minimumStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;