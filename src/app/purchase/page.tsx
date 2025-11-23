"use client";
import { useState } from "react";
import WelcomePage from "./_components/welcome"; 
import PurchaseForm from "./_components/PurchaseForm"; 

// Define a type for the purchase data structure for better clarity
interface PurchaseData {
    success: boolean;
    newBalance: number;
    userName: string;
}

export default function PurchasePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  // 1. Updated the data type from 'any' to a specific interface
  const handlePurchaseComplete = (data: PurchaseData) => {
    console.log("Purchase Completed:", data);
    
    // Check if the transaction was successful before showing success message
    if (data.success) {
        alert(`Purchase successful! ${data.userName} now has ${data.newBalance} coins.`);
    } else {
        alert("Transaction completed, but received unexpected data.");
    }
    
    // Use the onComplete prop name that the PurchaseForm expects
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