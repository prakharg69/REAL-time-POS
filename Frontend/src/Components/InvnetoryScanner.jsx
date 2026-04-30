import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InventoryScanner({
  onScanSuccess,
  scannerSize = 280,
  showButton = true,
  className = "",
}) {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const lastScannedRef = useRef(null);

   
  const stopScanner = async () => {
    try {
      if (
        scannerRef.current &&
        scannerRef.current.getState &&
        scannerRef.current.getState() === 2
      ) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (err) {
      console.error("Stop scanner error:", err);
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
          qrbox: { width: scannerSize, height: scannerSize },
        },
        (decodedText) => {
          try {
            const decoded = JSON.parse(decodedText);
            const { sku } = decoded;

            if (!sku) return;

           
            if (lastScannedRef.current === sku) return;
            lastScannedRef.current = sku;

            toast.success(`Scanned SKU: ${sku}`);

            
            onScanSuccess(sku);

            setTimeout(() => {
              lastScannedRef.current = null;
            }, 800);
          } catch {
            toast.error("Invalid QR code");
          }
        }
      );
    } catch (error) {
      console.error("Scanner start failed:", error);
      toast.error("Failed to start scanner");
      setIsScanning(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div
        id="qr-reader"
        className="rounded-xl overflow-hidden shadow-md"
        style={{
          width: scannerSize + 40,
          maxWidth: "100%",
        }}
      />

      {showButton && (
        <button
          onClick={isScanning ? stopScanner : startScanner}
          className={`mt-4 px-6 py-2 rounded-lg text-white font-medium transition
            ${
              isScanning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isScanning ? "Stop Scanner" : "Start Scanner"}
        </button>
      )}
    </div>
  );
}

export default InventoryScanner;
