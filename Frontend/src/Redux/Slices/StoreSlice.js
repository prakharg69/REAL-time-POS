import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
export const fetchStore = createAsyncThunk("Store/fetchStore",async(_,{rejectWithValue})=>{
    try {
        const res =await api.get("/api/getmyshop");
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Store api error");
    }
})


const initialState = {
    Store:null,
    StoreItems:[],
    cart: [],
    error:{
        store:null,
        StoreItems:null,
        cart:null
    },
    loading: {
      store: false,
      StoreItems: false,
      cart: false,
    }
    
}
const StoreSlice = createSlice({
    name:"store",
    initialState,
    reducers:{
        setStore(state,action){
            state.Store = action.payload;
        },
        addItems(state,action){
            state.StoreItems.push(action.payload);
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchStore.pending,(state)=>{
                state.loading.store =true;
        }).addCase(fetchStore.fulfilled,(state,action)=>{
            state.Store = action.payload;
            state.loading.store= false;
        }).addCase(fetchStore.rejected,(state,action)=>{
            state.error.store = action.payload;
        })
    }
})
export const {setStore,addItems} = StoreSlice.actions;
export default StoreSlice.reducer;