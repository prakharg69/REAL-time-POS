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

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700">
        <p className="text-xs text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm font-bold">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="capitalize">
              {entry.name === "totalSales" ? "Sales" : "Profit"}: 
            </span>
            <span>₹ {entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sales Trend
          </h2>
          <p className="text-slate-500 mt-1 text-base font-medium">
            Sales & Profit over time
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-fit">
          {["week", "month", "year"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
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

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold text-slate-700 uppercase">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-bold text-slate-700 uppercase">Profit</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 mb-4 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 font-semibold">
          {error}
        </div>
      )}

      {/* Chart Area - Reduced Height */}
      {loading ? (
        <div className="h-[250px] flex items-center justify-center">
          <div className="text-blue-600 text-lg font-bold animate-pulse">
            Loading chart data...
          </div>
        </div>
      ) : formattedData.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center">
          <div className="text-slate-400 text-lg font-semibold">
            No data available
          </div>
        </div>
      ) : (
        <div className="w-full h-[250px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="4 4" 
                vertical={false} 
                stroke="#e2e8f0" 
              />

              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b' }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="totalSales"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
              />

              <Line
                type="monotone"
                dataKey="totalProfit"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesTrend;