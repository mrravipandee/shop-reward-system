"use client";
import { useState } from "react";
import { QrCode, Camera, Scan } from "lucide-react";

interface QRScannerProps {
  onScanComplete: (customerData: any) => void;
}

export default function QRScanner({ onScanComplete }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  // Simulate different customer scenarios
  const mockCustomers = [
    { phone: "+91 98765 43210", exists: true, name: "Ravi Sharma" },
    { phone: "+91 98765 43211", exists: false },
    { phone: "+91 98765 43212", exists: true, name: "Priya Patel" },
    { phone: "+91 98765 43213", exists: false }
  ];

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate QR scan with random customer data
    setTimeout(() => {
      const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
      onScanComplete(randomCustomer);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Scan Customer QR
          </h1>
          <p className="text-secondary/80 text-sm sm:text-base">
            Scan QR code to process purchase and reward coins
          </p>

          {/* Scanner Area */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto bg-secondary/10 rounded-2xl border-2 border-dashed border-secondary/20 flex items-center justify-center">
              {isScanning ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-secondary/60 text-sm">Scanning QR Code...</p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <Camera className="w-12 h-12 text-secondary/40 mx-auto" />
                  <p className="text-secondary/60 text-sm">Position QR code in frame</p>
                </div>
              )}
            </div>
            
            {/* Scanner Frame */}
            <div className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none animate-pulse"></div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <Scan className="w-5 h-5" />
            {isScanning ? "Scanning..." : "Scan QR Code"}
          </button>

          {/* Help Text */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-secondary/80 text-xs text-center">
              • Point camera at customer&apos;s QR code<br/>
              • Ensure good lighting<br/>
              • Hold steady for 2-3 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}