
import { Route, Routes } from 'react-router-dom'
import './App.css'

import React from 'react'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { ToastContainer } from 'react-toastify'
import ShopDetailPage from './Pages/ShopDetailPage'

function App() {
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
      <Route  path='/login' element={<Login></Login>} />
      <Route  path='/Signup' element={<SignUp></SignUp>} />
      <Route  path='/ShopDetail' element={<ShopDetailPage></ShopDetailPage>} />
      
    </Routes>
    </>
  )
}

export default App
