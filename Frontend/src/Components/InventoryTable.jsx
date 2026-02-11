import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryLogs } from "../Redux/Slices/InventorySlice";

function InventoryTable() {
  const dispatch = useDispatch();
  const { inventoryLogs, pagination, loading } = useSelector(
    (s) => s.inventory
  );

  useEffect(() => {
    dispatch(fetchInventoryLogs({ page: 1, limit: 5 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Product</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Qty Change</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Previous</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">New Stock</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Reason</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
            </tr>
          </thead>

          <tbody>
            {inventoryLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center">
                  <div className="text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500">No inventory logs found</p>
                  </div>
                </td>
              </tr>
            ) : (
              inventoryLogs.map((log) => {
                const isAdd = log.changeType === "add";
                const isRemove = log.changeType === "remove";

                return (
                  <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {log.productId?.name || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.productId?.sku}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${isAdd ? "bg-green-100 text-green-800" : ""}
                        ${isRemove ? "bg-red-100 text-red-800" : ""}
                        ${!isAdd && !isRemove ? "bg-yellow-100 text-yellow-800" : ""}
                      `}>
                        {log.changeType}
                      </span>
                    </td>

                    {/* Quantity Changed */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold
                        ${log.quantityChanged > 0 ? "text-green-600" : "text-red-600"}
                      `}>
                        {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                      </span>
                    </td>

                    {/* Previous Stock */}
                    <td className="py-3 px-4 text-gray-700">
                      {log.previousStock}
                    </td>

                    {/* New Stock */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        {log.newStock}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.reason || (
                        <span className="text-gray-400 italic">No reason provided</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {inventoryLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inventory logs found
          </div>
        ) : (
          inventoryLogs.map((log) => {
            const isAdd = log.changeType === "add";
            const isRemove = log.changeType === "remove";

            return (
              <div key={log._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{log.productId?.name || "—"}</h3>
                    <p className="text-sm text-gray-500">{log.productId?.sku}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${isAdd ? "bg-green-100 text-green-800" : ""}
                    ${isRemove ? "bg-red-100 text-red-800" : ""}
                    ${!isAdd && !isRemove ? "bg-yellow-100 text-yellow-800" : ""}
                  `}>
                    {log.changeType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Quantity Change:</span>
                    <span className={`font-semibold ml-2 ${log.quantityChanged > 0 ? "text-green-600" : "text-red-600"}`}>
                      {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">New Stock:</span>
                    <span className="font-semibold ml-2 text-blue-700">{log.newStock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Previous:</span>
                    <span className="ml-2">{log.previousStock}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2">{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {log.reason && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">Reason:</span>
                    <p className="text-sm text-gray-700 mt-1">{log.reason}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing page {pagination.currentPage} of {pagination.totalPages}
            <span className="hidden sm:inline"> • {pagination.totalItems} total items</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination?.hasPrevPage}
              onClick={() =>
                dispatch(
                  fetchInventoryLogs({
                    page: pagination.currentPage - 1,
                    limit: pagination.limit,
                  })
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === pagination.currentPage;
                const shouldShow = 
                  pageNum === 1 || 
                  pageNum === pagination.totalPages ||
                  (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1);
                
                if (!shouldShow) {
                  if (pageNum === pagination.currentPage - 2 || pageNum === pagination.currentPage + 2) {
                    return <span key={pageNum} className="px-2">...</span>;
                  }
                  return null;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() =>
                      dispatch(
                        fetchInventoryLogs({
                          page: pageNum,
                          limit: pagination.limit,
                        })
                      )
                    }
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                      ${isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              disabled={!pagination?.hasNextPage}
              onClick={() =>
                dispatch(
                  fetchInventoryLogs({
                    page: pagination.currentPage + 1,
                    limit: pagination.limit,
                  })
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default InventoryTable;