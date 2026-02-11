import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchInventoryLogs } from "../Redux/Slices/InventorySlice";

function InventoryForm({ product }) {
  const [productData, setProductData] = useState(null);
  const [changeType, setChangeType] = useState("add");
  const [quantity, setQuantity] = useState("1");
  const [newStock, setNewStock] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!product) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5001/api/getproductdetail?sku=${product}`,
          { withCredentials: true }
        );
        setProductData(res.data.product);
      } catch (error) {
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product]);

  useEffect(() => {
    if (!productData) return;

    const prevStock = productData.stockQuantity;
    const qty = Number(quantity);

    if (isNaN(qty)) {
      setNewStock(prevStock);
      return;
    }

    let calculatedStock = prevStock;

    if (changeType === "add") {
      calculatedStock = prevStock + qty;
    }

    if (changeType === "remove") {
      calculatedStock = prevStock - qty;
    }

    if (changeType === "adjust") {
      calculatedStock = qty;
    }

    setNewStock(calculatedStock);
  }, [changeType, quantity, productData]);

  const handleSubmit = async () => {
    if (!productData) return;

    const qty = Number(quantity);

    if (!qty || qty < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (newStock < 0) {
      toast.error("Stock cannot go below 0");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5001/api/createlog",
        {
          sku: productData.sku,
          changeType,
          quantity: qty,
          reason,
        },
        { withCredentials: true }
      );

      toast.success("Inventory updated successfully");
      setQuantity("1");
      setReason("");
      setChangeType("add");
      dispatch(fetchInventoryLogs({ page: 1, limit: 5 }));
      setProductData(null);
    } catch (error) {
      toast.error("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  if (!productData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500">Scan a product to update inventory</p>
        <p className="text-sm text-gray-400 mt-2">Use the scanner above to get started</p>
      </div>
    );
  }

  const qtyNum = Number(quantity);
  const isInvalid =
    isNaN(qtyNum) ||
    qtyNum < 0 ||
    (changeType === "remove" && qtyNum > productData.stockQuantity);

  return (
    <div className="space-y-6">
      {/* Product Info Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{productData.name}</h3>
            <p className="text-sm text-gray-600">SKU: {productData.sku}</p>
          </div>
          <button
            onClick={() => setProductData(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="text-xl font-bold text-blue-700">
              {productData.stockQuantity} <span className="text-sm font-normal">{productData.unit}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${productData.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}>
              {productData.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["add", "remove", "adjust"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChangeType(type)}
                className={`py-2 text-sm font-medium rounded-lg transition-colors
                  ${changeType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quantity"
            />
            <span className="text-gray-600 whitespace-nowrap">{productData.unit}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason <span className="text-gray-400 text-sm font-normal">(Optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Restock, Customer order, Damaged goods"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Stock Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Stock Summary</span>
            <span className={`text-sm font-medium ${newStock < 0 ? "text-red-600" : "text-green-600"}`}>
              {newStock < 0 ? "Invalid" : "Valid"}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Previous</p>
              <p className="font-medium text-gray-900">{productData.stockQuantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Change</p>
              <p className={`font-medium ${qtyNum > 0 ? "text-green-600" : qtyNum < 0 ? "text-red-600" : "text-gray-900"}`}>
                {changeType === "adjust" ? "→" : qtyNum > 0 ? `+${qtyNum}` : qtyNum}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">New Stock</p>
              <p className={`font-bold ${newStock < 0 ? "text-red-600" : "text-blue-700"}`}>
                {newStock}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isInvalid || loading}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200
            ${isInvalid || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:transform active:scale-[0.98]"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating...
            </span>
          ) : (
            "Update Inventory"
          )}
        </button>

        {isInvalid && (
          <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {changeType === "remove" && qtyNum > productData.stockQuantity
                ? `Cannot remove more than ${productData.stockQuantity} units`
                : "Please enter a valid quantity"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryForm;