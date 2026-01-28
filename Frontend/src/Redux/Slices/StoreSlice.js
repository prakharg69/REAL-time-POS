import { configureStore, createSlice } from "@reduxjs/toolkit";
const initialState = {
    Store:null,
    StoreItems:[],
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
    }
})
export const {setStore,addItems} = StoreSlice.actions;
export default StoreSlice.reducer;