"use client";
import { useState, useEffect, useRef } from "react";
import {
  IndianRupee, CreditCard, Wallet, Store,
  Coins, Sparkles, Lock, Scissors
} from "lucide-react";

// --- Props Interface ---
interface PurchaseFormProps {
  customerPhone: string;
  isNewCustomer?: boolean;
  onSubmit: (purchaseData: {
    amount: number;
    paymentMode: "cash" | "online";
    shopCode: string;
    coinsEarned: number;
    customerPhone: string;
    timestamp: string;
  }) => void;
  onBack: () => void;
}

// --- Helper Functions ---
const generateExpectedCode = () => {
  const now = new Date();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  return minutes + "70" + hours;
};

const calculateCoins = (purchaseAmount: number) => {
  if (purchaseAmount < 30) return 0;
  if (purchaseAmount <= 50) return Math.floor(Math.random() * 4) + 1;
  if (purchaseAmount <= 100) return Math.floor(Math.random() * 5) + 4;
  if (purchaseAmount <= 250) return Math.floor(Math.random() * 16) + 10;
  if (purchaseAmount <= 500) return Math.floor(Math.random() * 21) + 30;
  if (purchaseAmount <= 1000) return Math.floor(Math.random() * 51) + 50;

  // Make sure high amounts get bigger rewards, not smaller!
  return Math.floor(purchaseAmount / 20); // E.g. ₹2000 gives 100 coins
};

export default function PurchaseForm({
  customerPhone, isNewCustomer = false, onSubmit, onBack
}: PurchaseFormProps) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "online">("cash");
  const [shopCode, setShopCode] = useState("");
  const [shopCodeError, setShopCodeError] = useState("");
  const [calculatedCoins, setCalculatedCoins] = useState(0);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Validate Shop Code ---
  const validateShopCode = (code: string) => {
    if (!code || code.length !== 6) return "Shop code is required";
    if (code !== generateExpectedCode()) return "Invalid shop code";
    return "";
  };

  const handleShopCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShopCode(value);
    setShopCodeError(validateShopCode(value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value && !isNaN(Number(value))) {
      setCalculatedCoins(calculateCoins(Number(value)));
    } else {
      setCalculatedCoins(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate before showing scratch card
    const codeError = validateShopCode(shopCode);
    setShopCodeError(codeError);
    if (!amount || Number(amount) < 1 || codeError) return;
    setIsScratched(false); // Reset on new card
    setShowScratchCard(true);
  };

  const processPurchaseAfterScratch = () => {
    const purchaseData = {
      amount: Number(amount),
      paymentMode,
      shopCode,
      coinsEarned: calculatedCoins,
      customerPhone,
      timestamp: new Date().toISOString(),
    };
    onSubmit(purchaseData);
  };

  // --- SCRATCH CARD LOGIC: SUPPORTS MOUSE AND TOUCH ---
  const initializeScratchCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Ensure the canvas size matches its display size
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill base with "scratchable" gray
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Texture add
    ctx.fillStyle = "#a0a0a0";
    for (let i = 0; i < canvas.width; i += 10) {
      for (let j = 0; j < canvas.height; j += 10) {
        if ((i + j) % 20 === 0) {
          ctx.fillRect(i, j, 5, 5);
        }
      }
    }
    // Scratch message
    ctx.fillStyle = "#666";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
  };

  // --- SCRATCH HELPER ---
  const scratch = (xy: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(xy.x, xy.y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const getXY = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e && e.touches.length) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left;
      y = (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top;
    }
    return { x, y };
  };

  // --- SCRATCH CARD EVENTS ---
  const handleScratchStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(getXY(e));
  };
  const handleScratchMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(getXY(e));
  };
  const handleScratchEnd = () => {
    setIsScratching(false);
    // Check how much scratched
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }
    const transparencyRatio = transparentPixels / (pixels.length / 4);
    if (transparencyRatio > 0.3 && !isScratched) {
      setIsScratched(true);
      setTimeout(processPurchaseAfterScratch, 1500);
    }
  };
  // --- INITIALIZE CARD WHEN SHOWN ---
  useEffect(() => {
    if (showScratchCard) {
      setTimeout(initializeScratchCard, 100);
    }
  }, [showScratchCard, calculatedCoins]);

  // --- RENDER ---
  if (showScratchCard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Scissors className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
              Scratch & Reveal!
            </h1>
            <p className="text-secondary/80 text-sm">
              Scratch the card to reveal your coins reward
            </p>
            {/* SCRATCH CARD UI */}
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Prize BG */}
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Coins className="w-8 h-8 text-yellow-200" />
                    <span className="text-3xl font-bold">{calculatedCoins}</span>
                  </div>
                  <p className="text-yellow-100 text-lg font-semibold">Coins Earned!</p>
                  <p className="text-yellow-200 text-sm mt-2">Purchase: ₹{amount}</p>
                </div>
                {/* Scratch Layer */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={200}
                  className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl"
                  style={{ touchAction: "none" }}
                  onMouseDown={handleScratchStart}
                  onMouseMove={handleScratchMove}
                  onMouseUp={handleScratchEnd}
                  onMouseLeave={handleScratchEnd}
                  onTouchStart={handleScratchStart}
                  onTouchMove={handleScratchMove}
                  onTouchEnd={handleScratchEnd}
                />
              </div>
            </div>
            {/* Instructions */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-secondary text-sm">How to Play</span>
              </div>
              <p className="text-secondary/60 text-xs text-center">
                Click and drag (or use your finger) to scratch the silver layer. Reveal 30% to claim your coins!
              </p>
            </div>
            {/* Loading State */}
            {isScratched && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 justify-center">
                  <Sparkles className="w-5 h-5 text-green-600 animate-pulse" />
                  <span className="font-semibold text-green-700">Coins added to your account!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- STANDARD FORM ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
              {isNewCustomer ? "Welcome!" : "Process Purchase"}
            </h1>
            <p className="text-secondary/80 text-sm">
              Customer: {customerPhone}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Purchase Amount (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  min="1"
                  required
                />
              </div>
            </div>
            {/* Payment Mode */}
            <div>
              <label className="block text-secondary font-medium mb-3">
                Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode("cash")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    paymentMode === "cash"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-secondary border-secondary/20 hover:border-primary"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("online")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    paymentMode === "online"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-secondary border-secondary/20 hover:border-primary"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Online</span>
                </button>
              </div>
            </div>
            {/* Shop Code Input */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Shop Security Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="text"
                  value={shopCode}
                  onChange={handleShopCodeChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 font-mono text-center text-lg tracking-wider"
                  required
                />
              </div>
              {shopCodeError && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {shopCodeError}
                </p>
              )}
              {/* Positive Feedback */}
              {shopCode && !shopCodeError && shopCode.length === 6 && (
                <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  Valid shop code - Ready to process
                </p>
              )}
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={
                  !amount ||
                  Number(amount) < 1 ||
                  !shopCode ||
                  !!shopCodeError
                }
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Scissors className="w-5 h-5" />
                Process & Scratch to Reveal Coins
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full border border-secondary/20 text-secondary py-3 rounded-xl font-medium hover:bg-secondary/5 transition-all duration-300"
              >
                Back to Scanner
              </button>
            </div>
          </form>
          {/* Instructions */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold text-secondary text-sm">How it works</span>
            </div>
            <ul className="text-secondary/60 text-xs space-y-1">
              <li>• Enter purchase amount and shop security code</li>
              <li>• Scratch card will reveal your coins reward</li>
              <li>• Coins are added after scratching the card</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
