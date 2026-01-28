import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice.js"
import shopReducer from "./Slices/StoreSlice.js"
export const store = configureStore({
    reducer:{
            auth:authReducer,
            shop:shopReducer,
    }
})