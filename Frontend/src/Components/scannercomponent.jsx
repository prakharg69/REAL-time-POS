import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartUpdate,  } from "../Redux/Slices/StoreSlice";

function ScannerComponent({ scannerSize = 300, showButton = true, className = ""}) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const { Store } = useSelector((s) => s.shop);
  const scannerRef = useRef(null);
  const lastScannedRef = useRef(null);
  const dispatch = useDispatch();

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
  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");

    return () => {
      stopScanner();
    };
  }, []);


  const startScanner = async () => {
    if (!scannerRef.current) return;

    setIsScanning(true);

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: scannerSize,
            height: scannerSize,
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
            toast.error("Invalid QR code",error);
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
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div
        id="qr-reader"
        className="rounded-xl overflow-hidden shadow-lg"
        style={{ 
          width: scannerSize + 40,
          maxWidth: "100%"
        }}
      />

      {showButton && (
        <button
          onClick={isScanning ? stopScanner : startScanner}
          className={`px-6 py-3 mt-4 rounded-lg text-white font-medium transition
            ${
              isScanning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isScanning ? "Stop Scanner" : "Start Scanner"}
        </button>
      )}

      {scannedData.length > 0 && (
        <div className="bg-white px-4 py-2 mt-4 rounded-lg shadow text-sm max-h-48 overflow-auto">
          <span className="font-semibold">Scanned:</span>
          {scannedData.map((val, ind) => (
            <div key={ind}>{val}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScannerComponent;