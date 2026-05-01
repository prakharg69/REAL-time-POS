import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchCategoryPerformance } from "../Redux/Slices/StatsSlice";

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f97316", // orange
  "#ef4444", // red
  "#a855f7", // purple
];

const CategoryPerformance = () => {
  const dispatch = useDispatch();

  const { data = [], loading, error } = useSelector(
    (state) => state.stats.categoryStats
  );

  useEffect(() => {
    dispatch(fetchCategoryPerformance());
  }, [dispatch]);

  const formattedData = data.map((item) => ({
    ...item,
    category: item.category || "Uncategorized",
  }));

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-[#0f172a]">
          Category Performance
        </h2>
        <p className="text-xs text-gray-400">
          Sales distribution by category
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 text-xs text-center mb-2">
          {error}
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <div className="text-center py-10 text-sm">Loading...</div>
      ) : formattedData.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          No data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="percentage"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={0}   // ✅ no gap
              stroke="none"      // ✅ no white border
            >
              {formattedData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Center Text */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-semibold fill-gray-700"
            >
              Categories
            </text>

            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="mt-3 space-y-1">
        {formattedData.map((item, index) => (
          <div key={index} className="flex justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              ></span>
              {item.category}
            </div>
            <span>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPerformance;