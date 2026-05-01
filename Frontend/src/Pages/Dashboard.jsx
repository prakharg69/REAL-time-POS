import React from "react";
import SalesOverview from "../Components/SalesOverview";
import TopSellingProducts from "../Components/TopSellingProducts";
import SalesTrend from "../Components/SalesTrend";
import LowStockAlert from "../Components/LowStockAlert";
import InventoryStats from "../Components/InventoryStats";
import CategoryPerformance from "../Components/CategoryPerformance";

function Dashboard() {
  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      
      {/* 🔹 Full Width */}
      <div>
        <SalesOverview />
      </div>

      {/* 🔹 Full Width */}
      <div>
        <SalesTrend />
      </div>

      {/* 🔹 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts />
        <LowStockAlert />
      </div>

      {/* 🔹 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryStats />
        <CategoryPerformance />
      </div>

    </div>
  );
}

export default Dashboard;