import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios.js";
export const fetchStore = createAsyncThunk(
  "Store/fetchStore",
  async (_, { rejectWithValue }) => {
    try {
         console.log("hello");

      const res = await api.get("/api/getmyshop");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Store api error",
      );
    }
  },
);

export const fetchProduct = createAsyncThunk(
  "Store/fetchProduct",
  async ({ page = 1, limit = 2 }, { rejectWithValue }) => {
    try {
        console.log("chll be chutiyeee");
        
      const res = await api.get("/api/getproduct", {
        params: { page, limit },
      });
      return res.data;
    } catch (error) {
      console.error("FETCH PRODUCT ERROR:", error.response);
      return rejectWithValue(
        error.response?.data?.message || "Product api error"
      );
    }
  }
);

const initialState = {
  Store: null,
  StoreItems: [],
  currentPage: 1,
  limit: 2,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
  cart: [],
  error: {
    store: null,
    StoreItems: null,
    cart: null,
  },
  loading: {
    store: false,
    StoreItems: false,
    cart: false,
  },
};
const StoreSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStore(state, action) {
      state.Store = action.payload;
    },
    addItems(state, action) {
      state.StoreItems.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStore.pending, (state) => {
        state.loading.store = true;
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.Store = action.payload;
        state.loading.store = false;
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.error.store = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading.StoreItems = true;
        state.error.StoreItems = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        const {
          currentPage,
          limit,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        } = action.payload.pagination;
        state.StoreItems = action.payload.data;
        state.hasNextPage = hasNextPage;
        state.currentPage = currentPage;
        state.limit = limit;
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        state.hasPrevPage = hasPrevPage;
        state.loading.StoreItems = false;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        console.error("REDUX ERROR:", action.payload);
        state.error.StoreItems = action.payload;
      });
  },
});
export const { setStore, addItems } = StoreSlice.actions;
export default StoreSlice.reducer;
