import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";



export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/me");
      return res.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Auth failed");
    }
  }
);


const initialState = {
  user: null,
  isLoggedIn: false,
  loading: true,
  error: null,
};



const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
