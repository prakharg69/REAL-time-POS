import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartUpdate } from "../Redux/Slices/StoreSlice";

function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const { Store } = useSelector((s) => s.shop);
  const scannerRef = useRef(null);
  const lastScannedRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (
      scannerRef.current &&
      scannerRef.current.getState &&
      scannerRef.current.getState() === 2
    ) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    }
    setIsScanning(false);
    lastScannedRef.current = null;
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;

    setIsScanning(true);

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          try {
            const decoded = JSON.parse(decodedText);
            const { sku } = decoded;

            if (!sku) return;
            if (!Store?._id) return;

            if (lastScannedRef.current === sku) return;
            lastScannedRef.current = sku;

            const res = await axios.post(
              `http://localhost:5001/api/cartadd?sku=${sku}&shopId=${Store._id}`,
              {},
              { withCredentials: true },
            );
            dispatch(cartUpdate(res.data.cart));

            toast.success("Product added to cart");

            setTimeout(() => {
              lastScannedRef.current = null;
            }, 700);

          } catch (error) {
            toast.error("Invalid QR code format");
          }
        },
        () => {},
      );
    } catch (error) {
      console.error("Scanner start failed:", error);
      toast.error("Failed to start scanner");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-50 p-4">
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        theme="light"
        toastClassName="bg-white border border-blue-100 shadow-lg rounded-lg"
      />

      <div className="max-w-md mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            QR Code Scanner
          </h1>
          <p className="text-gray-600">
            Scan product QR codes to add items to cart
          </p>
        </div>

        {/* Scanner Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
          {/* Scanner Frame with Mask */}
          <div className="relative mb-6">
            {/* Camera Preview Container */}
            <div
              id="qr-reader"
              className="relative rounded-lg overflow-hidden mx-auto"
              style={{ 
                width: 320,
                height: 320,
              }}
            >
              {/* Scanner Border Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="relative w-64 h-64">
                 
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg"></div>
                  
                  {/* Corner decorations */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-blue-500 rounded-tl"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-blue-500 rounded-tr"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-blue-500 rounded-bl"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-blue-500 rounded-br"></div>

                </div>
              </div>
              
              {/* Dark overlay around scanner area */}
              
            </div>
          </div>

          {/* Control Button */}
          <div className="flex justify-center">
            <button
              onClick={isScanning ? stopScanner : startScanner}
              className={`
                px-8 py-3 rounded-lg font-semibold text-white 
                transition-all duration-300 shadow-md hover:shadow-lg
                flex items-center gap-2
                ${isScanning 
                  ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                  : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                }
              `}
            >
              {isScanning ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Scanning
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Scanner
                </>
              )}
            </button>
          </div>
        </div>

        {/* Professional Tips */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">Scanning Guide</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Position QR Code</p>
                <p className="text-xs text-gray-500">Place QR code within the scanning frame</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Hold Steady</p>
                <p className="text-xs text-gray-500">Keep device stable for 2-3 seconds</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Good Lighting</p>
                <p className="text-xs text-gray-500">Ensure adequate lighting for best results</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Products are automatically added to cart on successful scan</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isScanning ? 'Scanning in progress...' : 'Scanner ready'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Scanner;