import React, { useRef, useState } from 'react';
import ScannerComponent from '../Components/scannercomponent'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { cartUpdate } from '../Redux/Slices/StoreSlice';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cart ,Store} = useSelector((s) => s.shop);
  const [showScanner, setShowScanner] = useState(false);
  const dispatch = useDispatch();
const debounceRef = useRef(null);

  // For demo if cart is empty
  const [demoCart, setDemoCart] = useState({
    "shopId": "697af8a02a28daddbe4c1619",
    "items": {
      "BAN-GAR-XX5": {
        "productId": "6982265dbfa45fab911e8d9f",
        "sku": "BAN-GAR-XX5",
        "name": "band",
        "price": 200,
        "unit": "piece",
        "quantity": 1,
        "lineTotal": 200
      },
      "GHE-AMU-XX4": {
        "productId": "698225f5bfa45fab911e8d9b",
        "sku": "GHE-AMU-XX4",
        "name": "Ghee",
        "price": 1500,
        "unit": "kg",
        "quantity": 1,
        "lineTotal": 1500
      },
      "MAG-NES-XX3": {
        "productId": "698225d3bfa45fab911e8d97",
        "sku": "MAG-NES-XX3",
        "name": "maggie",
        "price": 14,
        "unit": "piece",
        "quantity": 4,
        "lineTotal": 56
      }
    },
    "totalQuantity": 6,
    "totalAmount": 1756
  });

 
  const cartData = cart || demoCart;
const syncQuantityWithBackend = (sku, quantity) => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  debounceRef.current = setTimeout(async () => {
    try {
      const shopId = Store?._id;

      await axios.post(
        "http://localhost:5001/api/updatequantity",
        { sku, quantity, shopId },
        { withCredentials: true }
      );

      
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error(error);
    }
  }, 600);
};

const handleIncrement = (sku) => {
  const item = cart.items[sku];
  if (!item) return;

  const newQuantity = item.quantity + 1;

  // 1️⃣ Update Redux immediately (UI instant)
  dispatch(
    cartUpdate({
      ...cart,
      items: {
        ...cart.items,
        [sku]: {
          ...item,
          quantity: newQuantity,
          lineTotal: newQuantity * item.price,
        },
      },
      totalQuantity: cart.totalQuantity + 1,
      totalAmount: cart.totalAmount + item.price,
    })
  );

  
  syncQuantityWithBackend(sku, newQuantity);
};


const handleDecrement = (sku) => {
  const item = cart.items[sku];
  if (!item || item.quantity <= 1) return;

  const newQuantity = item.quantity - 1;

 
  dispatch(
    cartUpdate({
      ...cart,
      items: {
        ...cart.items,
        [sku]: {
          ...item,
          quantity: newQuantity,
          lineTotal: newQuantity * item.price,
        },
      },
      totalQuantity: cart.totalQuantity - 1,
      totalAmount: cart.totalAmount - item.price,
    })
  );

  
  syncQuantityWithBackend(sku, newQuantity);
};


const handleDelete = async (sku) => {
  try {
    console.log("Delete:", sku);

    const shopId = Store?._id;

    const res = await axios.delete(
      "http://localhost:5001/api/deleteproduct",
      {
        data: { sku, shopId },
        withCredentials: true,
      }
    );

    dispatch(cartUpdate(res.data.cart));
    toast.success("Product deleted");
  } catch (error) {
    toast.error("Delete error");
    console.error(error);
  }
};


  const handleCheckout = () => {
    console.log('Checkout initiated');
    
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6 text-center">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Part - Cart Items */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Cart Items ({cartData.totalQuantity})
            </h2>
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              {showScanner ? 'Hide Scanner' : 'Show Scanner'}
            </button>
          </div>
          
          {/* Mobile Scanner (only visible on mobile when toggled) */}
          {showScanner && (
            <div className="mb-6 lg:hidden bg-gray-50 p-4 rounded-lg">
              <ScannerComponent scannerSize={250} />
            </div>
          )}
          
          <div className="space-y-4">
            {Object.values(cartData.items).length > 0 ? (
              Object.values(cartData.items).map((item) => (
                <div key={item.sku} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">SKU: {item.sku}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Unit: {item.unit}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          <button
                            onClick={() => handleDecrement(item.sku)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrement(item.sku)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(item.sku)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-4 py-2 border border-red-200 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right min-w-[120px]">
                      <p className="text-lg font-semibold text-blue-600">₹{item.price?.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">each</p>
                      <p className="text-md font-medium text-gray-800 mt-2">
                        Line Total: ₹{item.lineTotal?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty. Scan products to add them.
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
              <span className="text-xl md:text-2xl font-bold text-blue-600">
                ₹{cartData.totalAmount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Part - Desktop Scanner and Checkout */}
        <div className="lg:w-1/2 space-y-6">
          {/* Scanner (hidden on mobile, visible on desktop) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
            <ScannerComponent scannerSize={350} className="justify-start" />
          </div>
          
          {/* Order Summary and Checkout */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{cartData.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">{cartData.totalQuantity || 0}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Grand Total</span>
                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                    ₹{cartData.totalAmount?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              disabled={!cartData.totalQuantity || cartData.totalQuantity === 0}
            >
              Proceed to Checkout
            </button>
            
            {(!cartData.totalQuantity || cartData.totalQuantity === 0) && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Add items to cart to checkout
              </p>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Payment Methods</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">Credit Card</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Debit Card</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">UPI</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Cash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;