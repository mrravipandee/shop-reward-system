"use client";
import { useState } from "react";
import QRScanner from "./QRScanner";
import PurchaseForm from "./PurchaseForm";
import CustomerRegistration from "./CustomerRegistration";
import PurchaseSuccess from "./PurchaseSuccess";

type AppState = "scanning" | "purchase" | "registration" | "success";

export default function QRSystem() {
  const [currentState, setCurrentState] = useState<AppState>("scanning");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);

  const handleScanComplete = (customerData: any) => {
    setCustomerPhone(customerData.phone);
    if (customerData.exists) {
      setCurrentState("purchase");
      setIsNewCustomer(false);
    } else {
      setCurrentState("registration");
      setIsNewCustomer(true);
    }
  };

  const handlePurchaseSubmit = (purchaseData: any) => {
    console.log("Purchase submitted:", purchaseData);
    // Simulate API call to backend
    setPurchaseData(purchaseData);
    setCurrentState("success");
    
    // Here you would actually send to your backend:
    // fetch('/api/purchases', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(purchaseData)
    // })
  };

  const handleRegistrationSubmit = (customerData: any) => {
    console.log("Customer registered:", customerData);
    // Simulate API call to backend
    setCurrentState("purchase");
    setIsNewCustomer(false);
    
    // Here you would actually send to your backend:
    // fetch('/api/customers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(customerData)
    // })
  };

  const handleBackToScanner = () => {
    setCurrentState("scanning");
    setCustomerPhone("");
    setPurchaseData(null);
  };

  const handleNewPurchase = () => {
    setCurrentState("scanning");
    setCustomerPhone("");
    setPurchaseData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {currentState === "scanning" && (
        <QRScanner onScanComplete={handleScanComplete} />
      )}
      
      {currentState === "purchase" && (
        <PurchaseForm
          customerPhone={customerPhone}
          isNewCustomer={isNewCustomer}
          onSubmit={handlePurchaseSubmit}
          onBack={handleBackToScanner}
        />
      )}
      
      {currentState === "registration" && (
        <CustomerRegistration
          customerPhone={customerPhone}
          onSubmit={handleRegistrationSubmit}
          onBack={handleBackToScanner}
        />
      )}
      
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