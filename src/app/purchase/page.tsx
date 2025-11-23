"use client";
import { useState } from "react";
import WelcomePage from "./_components/welcome";
import PurchaseForm from "./_components/PurchaseForm";
import { PurchaseData } from "@/types/purchase";


export default function PurchasePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  // 1. Updated the data type from 'any' to a specific interface
  const handlePurchaseComplete = (data: PurchaseData) => {
    console.log("Purchase Completed:", data);
    if (data.success) {
      alert(`Purchase successful! ${data.userName} now has ${data.newBalance} coins.`);
    } else {
      alert("Transaction completed, but received unexpected data.");
    }
    window.location.reload();
  };


  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <WelcomePage onContinue={handleContinue} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PurchaseForm onComplete={handlePurchaseComplete} />
    </div>
  );
}