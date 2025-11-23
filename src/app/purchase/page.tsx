"use client";
import { useState } from "react";
import WelcomePage from "./_components/welcome"; 
import PurchaseForm from "./_components/PurchaseForm"; 

export default function PurchasePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handlePurchaseComplete = () => {
    console.log("Purchase Completed");
    // Additional logic can be added here if needed
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