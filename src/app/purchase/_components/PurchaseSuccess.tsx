"use client";
import { CheckCircle, Coins, IndianRupee, ShoppingBag, Sparkles } from "lucide-react";

interface PurchaseSuccessProps {
  purchaseData: {
    amount: number;
    coinsEarned: number;
    paymentMode: string;
    customerPhone: string;
  };
  onNewPurchase: () => void;
  onBack: () => void;
}

export default function PurchaseSuccess({ purchaseData, onNewPurchase, onBack }: PurchaseSuccessProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          {/* Success Message */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
              Purchase Successful!
            </h1>
            <p className="text-secondary/80 text-sm">
              Thank you for shopping with us
            </p>
          </div>

          {/* Purchase Details */}
          <div className="bg-secondary/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">Amount:</span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-bold">
                <IndianRupee className="w-4 h-4" />
                <span className="text-lg">{purchaseData.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-medium">Coins Earned:</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-primary">{purchaseData.coinsEarned}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-secondary font-medium">Payment Mode:</span>
              <span className="font-semibold text-secondary capitalize">{purchaseData.paymentMode}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-secondary font-medium">Customer:</span>
              <span className="font-semibold text-secondary">{purchaseData.customerPhone}</span>
            </div>
          </div>

          {/* Rewards Info */}
          {purchaseData.coinsEarned > 0 && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold text-primary">Rewards Added!</span>
              </div>
              <p className="text-secondary/80 text-xs">
                {purchaseData.coinsEarned} coins have been added to customer&apos;s wallet. 
                They can redeem these coins for exciting rewards.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onNewPurchase}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Process New Purchase
            </button>
            
            <button
              onClick={onBack}
              className="w-full border border-secondary/20 text-secondary py-3 rounded-xl font-medium hover:bg-secondary/5 transition-all duration-300"
            >
              Back to Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}