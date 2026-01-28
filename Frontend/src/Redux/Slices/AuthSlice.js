import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    User:null,
    isLoggedIn:null,
}
const AuthSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser(state,action){
            state.User = action.payload
            state.isLoggedIn = true
        },
        Logout(state){
            state.User = null,
            state.isLoggedIn = null
        }
    }

})

export  const {setUser,Logout} = AuthSlice.actions;
export default AuthSlice.reducer;
