// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { 
  FiPackage, 
  FiShoppingCart, 
  FiBarChart2,
  FiSettings,
  FiGrid,
  FiCreditCard,
  FiUser,
  FiHome
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function Sidebar() {
    const {user} = useSelector((s)=> s.auth);
    const {Store} = useSelector((s)=> s.shop);
  return (
    <div className="w-full h-full bg-white p-6 rounded-xl shadow-sm flex flex-col">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <FiShoppingCart className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-800">My POS</h2>
          <p className="text-xs text-blue-400">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {/* Dashboard */}
        <NavLink 
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-blue-700 hover:bg-blue-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiHome className={`text-lg ${isActive ? 'text-blue-500' : 'text-blue-400'}`} />
              <span className="font-medium">Dashboard</span>
            </>
          )}
        </NavLink>

        {/* Products */}
        <NavLink 
          to="/products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-blue-700 hover:bg-blue-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiPackage className={`text-lg ${isActive ? 'text-blue-500' : 'text-blue-400'}`} />
              <span className="font-medium">Products</span>
            </>
          )}
        </NavLink>

        {/* POS Section Header */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">POS</p>
        </div>

        {/* Scanner */}
        <NavLink 
          to="/pos/scanner"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ml-2 ${
              isActive 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-blue-700 hover:bg-blue-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiGrid className={`text-lg ${isActive ? 'text-blue-500' : 'text-blue-400'}`} />
              <span className="font-medium">Scanner</span>
            </>
          )}
        </NavLink>

        {/* Checkout */}
        <NavLink 
          to="/pos/checkout"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ml-2 ${
              isActive 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-blue-700 hover:bg-blue-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiCreditCard className={`text-lg ${isActive ? 'text-blue-500' : 'text-blue-400'}`} />
              <span className="font-medium">Checkout</span>
            </>
          )}
        </NavLink>

        {/* Inventory */}
        <NavLink 
          to="/inventory"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-blue-700 hover:bg-blue-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiBarChart2 className={`text-lg ${isActive ? 'text-blue-500' : 'text-blue-400'}`} />
              <span className="font-medium">Inventory</span>
            </>
          )}
        </NavLink>

        {/* Settings */}
        <NavLink 
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-blue-700 hover:bg-blue-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <FiSettings className={`text-lg ${isActive ? 'text-blue-500' : 'text-blue-400'}`} />
              <span className="font-medium">Settings</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* User Profile - Now positioned properly within flex container */}
      <div className="pt-4 mt-4 border-t border-blue-100">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">{user?.fullName || "guest"}</p>
            <p className="text-xs text-blue-400">ShopName: {Store?.shopName || "guest"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}