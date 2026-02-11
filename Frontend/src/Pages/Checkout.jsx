import React, { useRef, useState } from 'react';
import ScannerComponent from '../Components/scannercomponent';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { cartUpdate } from '../Redux/Slices/StoreSlice';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { cart, Store } = useSelector((s) => s.shop);
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
        "name": "Band",
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
        "name": "Maggie",
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Header */}
      <header className="bg-blue-900 text-white border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Checkout Terminal</h1>
            <p className="text-blue-200 text-sm mt-1">
              Store: {Store?.shopName || 'Demo Store'} <span className="mx-2 text-blue-700">|</span> ID: {Store?._id ? Store._id.substring(0, 8) + '...' : '...'}
            </p>
          </div>
          <div className="hidden md:block bg-blue-800 px-4 py-1.5 rounded text-xs text-blue-100 border border-blue-700 uppercase tracking-wider font-semibold">
            System Online
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: Cart Items (Span 7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Mobile Scanner Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 px-4 rounded border border-blue-700 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
              {showScanner ? 'Close Scanner' : 'Open Scanner'}
            </button>
            
            {showScanner && (
              <div className="mt-4 bg-white p-2 rounded-lg border border-blue-200 shadow-sm">
                <ScannerComponent scannerSize={280} />
              </div>
            )}
          </div>

          {/* Cart Header */}
          <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-800">
              Current Order
              <span className="ml-3 text-sm font-normal text-slate-500">
                ({cartData.totalQuantity} Items)
              </span>
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Clear All</button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3">
            {Object.values(cartData.items).length > 0 ? (
              Object.values(cartData.items).map((item) => (
                <div key={item.sku} className="bg-white rounded border border-slate-200 p-0 overflow-hidden grid grid-cols-1 sm:grid-cols-12 gap-0">
                  
                  {/* Item Info (Left) */}
                  <div className="col-span-1 sm:col-span-8 p-4 border-b sm:border-b-0 sm:border-r border-slate-100 flex gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded shrink-0 flex items-center justify-center text-slate-400 border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-9"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{item.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-slate-300 rounded bg-slate-50">
                          <button onClick={() => handleDecrement(item.sku)} className="px-2 py-1 text-slate-600 font-bold hover:bg-slate-200 border-r border-slate-300">−</button>
                          <span className="px-3 py-1 text-sm font-semibold text-slate-700 min-w-12 text-center">{item.quantity}</span>
                          <button onClick={() => handleIncrement(item.sku)} className="px-2 py-1 text-slate-600 font-bold hover:bg-slate-200 border-l border-slate-300">+</button>
                        </div>
                        <button 
                          onClick={() => handleDelete(item.sku)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-100 px-2 py-1 rounded bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price Info (Right) */}
                  <div className="col-span-1 sm:col-span-4 p-4 flex flex-col justify-between items-start sm:items-end bg-slate-50/50">
                    <div className="text-right w-full">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Unit Price</p>
                      <p className="text-sm font-semibold text-slate-700">₹{item.price?.toFixed(2)}</p>
                    </div>
                    <div className="text-right w-full mt-2">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-blue-700 font-mono">₹{item.lineTotal?.toFixed(2)}</p>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white rounded border border-slate-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Items in Cart</h3>
                <p className="text-slate-500 mt-1">Scan a product to begin checkout.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Scanner (Span 5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-6">
            
            {/* Desktop Scanner Section */}
            <div className="hidden lg:block bg-white rounded-lg border border-slate-200">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Scanner Input</h2>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center bg-slate-100/50 relative">
                {/* Visual Crosshairs for "Target" Feel */}
                <div className="absolute inset-4 border-2 border-blue-100 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between"><div className="w-4 h-4 border-t-4 border-l-4 border-blue-500 rounded-tl-sm"></div><div className="w-4 h-4 border-t-4 border-r-4 border-blue-500 rounded-tr-sm"></div></div>
                  <div className="flex justify-between"><div className="w-4 h-4 border-b-4 border-l-4 border-blue-500 rounded-bl-sm"></div><div className="w-4 h-4 border-b-4 border-r-4 border-blue-500 rounded-br-sm"></div></div>
                </div>
                <ScannerComponent scannerSize={260} />
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 text-lg">Payment Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">₹{cartData.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax (0%)</span>
                  <span className="font-mono font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Discount</span>
                  <span className="font-mono font-medium text-red-500">- ₹0.00</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-slate-800">Total Payable</span>
                    <span className="text-3xl font-extrabold text-blue-600 font-mono tracking-tight">
                      ₹{cartData.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!cartData.totalQuantity || cartData.totalQuantity === 0}
                  className={`w-full mt-6 font-bold text-lg py-4 px-6 rounded flex items-center justify-center gap-2
                    ${!cartData.totalQuantity || cartData.totalQuantity === 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-700 text-white border-b-4 border-blue-900 active:border-b-0 active:mt-1'}`}
                >
                  COMPLETE CHECKOUT
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                
                {!cartData.totalQuantity && (
                  <p className="text-center text-xs text-slate-400 mt-2">Add items to enable checkout</p>
                )}
              </div>

              {/* Footer Badges */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  <span className="text-xs font-medium">Card / UPI</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 justify-end">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                  <span className="text-xs font-medium">Cash Accepted</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;