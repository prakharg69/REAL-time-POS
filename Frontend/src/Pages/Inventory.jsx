import React, { useState } from "react";
import InventoryTable from "../Components/InventoryTable";
import InventoryForm from "../Components/InventoryForm";
import InventoryScanner from "../Components/InvnetoryScanner";

function Inventory() {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Track and manage your inventory in real-time</p>
      </div>

    
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showScanner ? "Hide Scanner" : "Show Scanner"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT SIDE - Table */}
        <div className="lg:w-[60%] w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Inventory Logs</h2>
              <div className="text-sm text-gray-500">
                <span className="inline-flex items-center mr-4">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  Add
                </span>
                <span className="inline-flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                  Remove
                </span>
              </div>
            </div>
            <InventoryTable />
          </div>
        </div>

        {/* RIGHT SIDE - Scanner & Form */}
        <div className="lg:w-[40%] w-full flex flex-col gap-4">
          {/* Scanner Card - Hidden on mobile unless toggled */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 ${showScanner ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Scan Product</h2>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Ready to scan</span>
              </div>
            </div>
            <InventoryScanner onScanSuccess={setScannedProduct} />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Update Inventory</h2>
              <p className="text-sm text-gray-600">Modify product stock levels</p>
            </div>
            <InventoryForm product={scannedProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;