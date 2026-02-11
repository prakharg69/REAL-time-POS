import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios"; 

const initialState = {
  inventoryLogs: [],
  pagination: {
    currentPage: 1,
    limit: 10,
    totalLogs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  error: null,
};


export const fetchInventoryLogs = createAsyncThunk(
  "inventory/fetchInventoryLogs",
  async ({ page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/getlogs", {
        params: { page, limit },
      });

      return res.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Inventory API error"
      );
    }
  }
);


const inventoryLogSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    resetInventoryLogs(state) {
      state.inventoryLogs = [];
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

     
      .addCase(fetchInventoryLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryLogs = action.payload.data;
        state.pagination = action.payload.pagination;
      })

    
      .addCase(fetchInventoryLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetInventoryLogs } = inventoryLogSlice.actions;
export default inventoryLogSlice.reducer;
