import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState([]);

  const scannerRef = useRef(null);
  const lastScannedRef = useRef(null);
  const toastCooldownRef = useRef(false);

  const SCANNER_SIZE = 600;

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
            width: SCANNER_SIZE,
            height: SCANNER_SIZE,
          },
        },
        (decodedText) => {
          try {
            const decoded = JSON.parse(decodedText);
            const { sku } = decoded;

            if (!sku) return;
            if (lastScannedRef.current === sku) return;

            lastScannedRef.current = sku;

            setScannedData((prev) =>
              prev.includes(sku) ? prev : [...prev, sku]
            );

            // 🔔 Toast cooldown
            if (!toastCooldownRef.current) {
              toast.success("Product added to cart");
              toastCooldownRef.current = true;

              setTimeout(() => {
                toastCooldownRef.current = false;
              }, 800);
            }
          } catch {
            toast.error("Invalid QR code");
          }
        },
        () => {}
      );
    } catch (error) {
      console.error("Scanner start failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      <div
        id="qr-reader"
        className="rounded-xl overflow-hidden shadow-lg"
        style={{ width: SCANNER_SIZE + 40 }}
      />

      <button
        onClick={isScanning ? stopScanner : startScanner}
        className={`px-6 py-3 rounded-lg text-white font-medium transition
          ${
            isScanning
              ? "bg-red-500 hover:bg-red-600"
              : "bg-black hover:bg-gray-800"
          }`}
      >
        {isScanning ? "Stop Scanner" : "Start Scanner"}
      </button>

      {scannedData.length > 0 && (
        <div className="bg-white px-4 py-2 rounded-lg shadow text-sm max-h-48 overflow-auto">
          <span className="font-semibold">Scanned:</span>
          {scannedData.map((val, ind) => (
            <div key={ind}>{val}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Scanner;
