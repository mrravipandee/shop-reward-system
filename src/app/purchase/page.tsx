"use client";
import { useState } from "react";
import WelcomePage from "./_components/welcome";
import QRSystem from "./_components/QRSystem";

export default function PurchasePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
    // Here you can navigate to your main page or show the main content
    console.log("Continue to main page");
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <WelcomePage onContinue={handleContinue} />
      </div>
    );
  }

  // Your main page content goes here
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 mt-14">
        <QRSystem />
      </div>
    </div>
  );
}