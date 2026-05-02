import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchCategoryPerformance } from "../Redux/Slices/StatsSlice";

const COLORS = [
  "#2563eb", // Royal Blue
  "#3b82f6", // Blue 500
  "#60a5fa", // Blue 400
  "#0ea5e9", // Sky 500
  "#6366f1", // Indigo 500
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700">
        <p className="text-xs text-slate-300 font-medium mb-1">
          {payload[0].payload.category}
        </p>
        <p className="text-xl font-extrabold text-white">
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

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
    <div className="w-full p-5 bg-slate-50">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 h-full flex flex-col">
        
        {/* Header - Compact */}
        <div className="mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Category Performance
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Sales distribution by category
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 mb-4 text-center text-red-600 bg-red-50 rounded-lg border border-red-100 font-semibold text-sm">
            {error}
          </div>
        )}

        {/* Chart Area - Reduced Height */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-blue-600 text-sm font-bold animate-pulse">
              Loading chart...
            </div>
          </div>
        ) : formattedData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm font-semibold">
            No data available
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
            
            {/* Left: Chart (Reduced Height) */}
            <div className="w-full md:w-1/2 flex justify-center">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={formattedData}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    cornerRadius={8}
                    stroke="none"
                  >
                    {formattedData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
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
                    className="fill-slate-800 font-extrabold text-base"
                    style={{ fontSize: '18px' }}
                  >
                    Total
                  </text>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right: Legend (Compact) */}
            <div className="w-full md:w-1/2 grid grid-cols-1 gap-2.5">
              {formattedData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></span>
                    <span className="text-sm font-bold text-slate-800">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-slate-900">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPerformance;