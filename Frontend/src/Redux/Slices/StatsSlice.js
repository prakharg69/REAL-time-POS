import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchSalesOverview = createAsyncThunk(
  "stats/fetchSalesOverview",
  async ({ filter = "day" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/dashboard/sales-overview", {
        params: { filter },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "SalesOverview API error",
      );
    }
  },
);

export const fetchTopSellingProducts = createAsyncThunk(
  "stats/fetchTopSellingProducts",
  async ({ filter = "day" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/dashboard/top-selling-products", {
        params: { filter },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "fetchTopSellingProducts API error",
      );
    }
  },
);
export const fetchSalesTrend = createAsyncThunk("stats/fetchSalesTrend",async({filter="week"}={},{rejectWithValue})=>{
    try {
        const res = await api.get("/api/dashboard/sales-trend", {
        params: { filter },
      });

      return res.data;
    } catch (error) {
        return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "fetchSalesTrend API error",
      );
    }
})

export const fetchLowStockAlert = createAsyncThunk("stats/fetchLowStockAlert",async(_,{rejectWithValue})=>{
  try {
      const res = await api.get("/api/low-stock-alert");
      return res.data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "fetchLowStockAlert API error",
      );
  }
})

const initialState = {
  salesStats: {
    data: {
      totalSales: 0,
      totalOrders: 0,
      totalProductsSold: 0,
      totalProfit: 0,
    },
    loading: false,
    error: null,
  },

  inventoryStats: {
    data: {
      totalProducts: 0,
      totalActive: 0,
      totalOutOfStock: 0,
      totalLowStock: 0,
    },
    loading: false,
    error: null,
  },

  salesTrend: {
    filter: "week",
    data: [],
    loading: false,
    error: null,
  },

  topProducts: {
    filter: "day",
    data: [],
    loading: false,
    error: null,
  },

  lowStock: {
    data: [],
    loading: false,
    error: null,
  },
};

const statsSlice = createSlice({
  name: "stats",
  initialState,

  reducers: {
    setSalesStats(state, action) {
      state.salesStats.data = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchSalesOverview.pending, (state) => {
        state.salesStats.loading = true;
        state.salesStats.error = null;
      })

      .addCase(fetchSalesOverview.fulfilled, (state, action) => {
        state.salesStats.loading = false;
        state.salesStats.data = action.payload.data;
      })

      .addCase(fetchSalesOverview.rejected, (state, action) => {
        state.salesStats.loading = false;
        state.salesStats.error = action.payload;
      })
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.topProducts.loading = true;
        state.topProducts.error = null;
      })

      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.topProducts.loading = false;
        state.topProducts.data = action.payload.data;
        state.topProducts.filter = action.payload.filter;
      })

      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.topProducts.loading = false;
        state.topProducts.error = action.payload;
      })
       .addCase(fetchSalesTrend.pending, (state) => {
        state.salesTrend.loading = true;
        state.salesTrend.error = null;
      })

      .addCase(fetchSalesTrend.fulfilled, (state, action) => {
        state.salesTrend.loading = false;
        state.salesTrend.data = action.payload.data;
        state.salesTrend.filter = action.payload.filter;
      })

      .addCase(fetchSalesTrend.rejected, (state, action) => {
        state.salesTrend.loading = false;
        state.salesTrend.error = action.payload;
      })
       .addCase(fetchLowStockAlert.pending, (state) => {
        state.lowStock.loading = true;
        state.lowStock.error = null;
      })

      .addCase(fetchLowStockAlert.fulfilled, (state, action) => {
        state.lowStock.loading = false;
        state.lowStock.data = action.payload.data;
        
      })

      .addCase(fetchLowStockAlert.rejected, (state, action) => {
        state.lowStock.loading = false;
        state.lowStock.error = action.payload;
      })
  },
});

export const { setSalesStats } = statsSlice.actions;
export default statsSlice.reducer;
