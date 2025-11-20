"use client";

import { useState } from "react";
import PurchaseForm from "./PurchaseForm";
import CustomerRegistration from "./CustomerRegistration";
import PurchaseSuccess from "./PurchaseSuccess";

// App States
type AppState = "purchase" | "registration" | "success";

// Purchase data structure
interface PurchaseData {
  customerPhone: string;
  amount: number;
  paymentMode: "cash" | "online";
  shopCode: string;
  coinsEarned: number;
  timestamp: string;
  reward?: string;
}

export default function QRSystem() {
  // 🔥 Correct State Management
  const [currentState, setCurrentState] = useState<AppState>("purchase");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);

  // 🔥 CUSTOMER REGISTRATION
  const handleRegistrationSubmit = (customerData: Record<string, unknown>) => {
    console.log("Customer registered:", customerData);

    // After registration, show Purchase Form
    setIsNewCustomer(false);
    setCurrentState("purchase");
  };

  // 🔥 PURCHASE SUBMIT
  const handlePurchaseSubmit = (data: PurchaseData) => {
    console.log("Purchase submitted:", data);

    // Save purchase, move to success screen
    setPurchaseData(data);
    setCurrentState("success");
  };

  // 🔙 BACK TO PURCHASE FORM
  const handleBackToScanner = () => {
    setCurrentState("purchase");
    setCustomerPhone("");
    setPurchaseData(null);
  };

  // ➕ NEW PURCHASE
  const handleNewPurchase = () => {
    setCurrentState("purchase");
    setCustomerPhone("");
    setPurchaseData(null);
  };

  return (
    <div className="min-h-screen">
      
      {/* Purchase Form */}
      {currentState === "purchase" && (
        <PurchaseForm
          customerPhone={customerPhone}
          isNewCustomer={isNewCustomer}
          onSubmit={handlePurchaseSubmit}
          onBack={handleBackToScanner}
        />
      )}

      {/* New Customer Registration */}
      {currentState === "registration" && (
        <CustomerRegistration
          customerPhone={customerPhone}
          onSubmit={handleRegistrationSubmit}
          onBack={handleBackToScanner}
        />
      )}

      {/* Purchase Success Screen */}
      {currentState === "success" && purchaseData && (
        <PurchaseSuccess
          purchaseData={purchaseData}
          onNewPurchase={handleNewPurchase}
          onBack={handleBackToScanner}
        />
      )}
    </div>
  );
}
