import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 🔹 Precomputed (from DashboardStats)
  stats: {
    totalSales: 0,
    totalOrders: 0,
    totalProductsSold: 0,
    totalProfit: 0,

    totalProducts: 0,
    totalActive: 0,
    totalOutOfStock: 0,
    totalLowStock: 0,
  },

  // 🔹 Dynamic analytics (aggregation APIs)

  // Sales Trend (graph)
  salesTrend: {
    filter: "week", // week | month | year
    data: [],       // [{ _id: "2026-04-30", totalSales: 1000, totalProfit: 200 }]
    loading: false,
    error: null,
  },

  // Top Selling Products
  topProducts: {
    filter: "week",
    data: [], // [{ productId, name, quantitySold, revenue, profit }]
    loading: false,
    error: null,
  },

  // Low Stock Alerts (list view)
  lowStock: {
    data: [], // [{ productId, name, stockQuantity, minimumStock }]
    loading: false,
    error: null,
  },

  // 🔹 UI/Global states
  loading: false,
  error: null,
};

const statSlice = createSlice({
    name:"stat",
    initialState,
    reducers:{
        setStats(state,action){
                state.totalSales = action.payload;
        }
    }
})
export default  statSlice.reducer;