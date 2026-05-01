import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchSalesTrend } from "../Redux/Slices/StatsSlice";

const SalesTrend = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("week");

  const { data = [], loading, error } = useSelector(
    (state) => state.stats.salesTrend
  );

  useEffect(() => {
    dispatch(fetchSalesTrend({ filter }));
  }, [dispatch, filter]);

  const formattedData = useMemo(() => {
    return data.map((item) => {
      if (filter === "year") {
        return {
          ...item,
          label: new Date(item._id + "-01").toLocaleString("default", {
            month: "short",
          }),
        };
      }
      return {
        ...item,
        label: item._id.slice(5),
      };
    });
  }, [data, filter]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-[#0f172a]">
            Sales Trend
          </h2>
          <p className="text-gray-400 text-xs">
            Sales & Profit over time
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {["week", "month", "year"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-xs text-center mb-2">
          {error}
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="text-center py-6 text-sm">Loading...</div>
      ) : formattedData.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          No data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={formattedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }} // ✅ spacing fix
          >
            <CartesianGrid strokeDasharray="2 2" />

            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="totalProfit"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesTrend;