
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from 'react'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { ToastContainer } from 'react-toastify'
import ShopDetailPage from './Pages/ShopDetailPage'
import { fetchUser } from './Redux/Slices/AuthSlice';
import { fetchStore } from './Redux/Slices/StoreSlice';
import DashboardRoute from './routes/DashboardRoute';
import ShopSetupRoute from './routes/ShopSetupRoute';
import DashboardLayout from './Pages/ DashboardLayout';
import Dashboard from './Pages/Dashboard';
import Products from './Pages/Products';
import Scanner from './Pages/Scanner';
import Checkout from './Pages/Checkout';
import Inventory from './Pages/Inventory';
import { Settings } from 'lucide-react';

function App() {
const dispatch = useDispatch();
const {isLoggedIn,user} = useSelector((s)=> s.auth);
useEffect(()=>{
     dispatch(fetchUser());
},[dispatch]);
useEffect(()=>{
    dispatch(fetchStore());
},[user])
  return (
   <>
   <ToastContainer
position="top-left"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
    <Routes>
      <Route  path='/login' element={<Login/>} />
      <Route  path='/Signup' element={<SignUp/>} />
      <Route  path='/shopdetail' element={<ShopSetupRoute><ShopDetailPage/></ShopSetupRoute>}/>
      <Route element={<DashboardLayout></DashboardLayout>}> 
      
       <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/products" element={<Products />} />
          
            <Route path="/pos/scanner" element={<Scanner />} />
        <Route path="/pos/checkout" element={<Checkout />} />
           <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>


    </Routes>
    </>
  )
}

export default App
