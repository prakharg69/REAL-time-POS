// DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";


export default function DashboardLayout() {
   
  return (
    <div className="flex flex-col md:flex-row h-screen bg-blue-50 p-2 md:p-4 gap-3 md:gap-4">
      {/* Sidebar - Responsive */}
      <div className="w-full md:w-64 lg:w-72 h-full bg-white rounded-xl shadow-sm overflow-hidden">
        <Sidebar />
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-full p-4 md:p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}