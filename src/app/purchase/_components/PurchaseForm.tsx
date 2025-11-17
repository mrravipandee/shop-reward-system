"use client";
import { useState, useEffect } from "react";
import { IndianRupee, CreditCard, Wallet, Store, Coins, Sparkles } from "lucide-react";

interface PurchaseFormProps {
  customerPhone: string;
  isNewCustomer?: boolean;
  onSubmit: (purchaseData: any) => void;
  onBack: () => void;
}

export default function PurchaseForm({ customerPhone, isNewCustomer = false, onSubmit, onBack }: PurchaseFormProps) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "online">("cash");
  const [shopCode, setShopCode] = useState("RAVI001");
  const [calculatedCoins, setCalculatedCoins] = useState(0);

  const calculateCoins = (purchaseAmount: number) => {
    if (purchaseAmount < 30) return 0;
    if (purchaseAmount <= 50) return Math.floor(Math.random() * 4) + 1;
    if (purchaseAmount <= 100) return Math.floor(Math.random() * 5) + 4;
    if (purchaseAmount <= 250) return Math.floor(Math.random() * 16) + 10;
    if (purchaseAmount <= 500) return Math.floor(Math.random() * 21) + 30;
    if (purchaseAmount <= 1000) return Math.floor(Math.random() * 51) + 50;
    
    // For purchases above 1000
    const spinRewards = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    return spinRewards[Math.floor(Math.random() * spinRewards.length)];
  };

  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const coins = calculateCoins(Number(amount));
      setCalculatedCoins(coins);
    } else {
      setCalculatedCoins(0);
    }
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 1) return;

    const purchaseData = {
      amount: Number(amount),
      paymentMode,
      shopCode,
      coinsEarned: calculatedCoins,
      customerPhone,
      timestamp: new Date().toISOString()
    };

    onSubmit(purchaseData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
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
                  onChange={(e) => setAmount(e.target.value)}
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

            {/* Shop Code */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Shop Code
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 w-5 h-5" />
                <input
                  type="text"
                  value={shopCode}
                  onChange={(e) => setShopCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Coins Calculation */}
            {calculatedCoins > 0 && (
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-secondary">Coins to Earn:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xl font-bold text-primary">{calculatedCoins}</span>
                  </div>
                </div>
                <p className="text-secondary/60 text-xs mt-2">
                  {Number(amount) >= 1000 
                    ? "Lucky spin reward!" 
                    : "Coins earned based on purchase amount"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={!amount || Number(amount) < 1}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process Purchase
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
        </div>
      </div>
    </div>
  );
}