"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import ScratchCardOverlay from "./ScratchCardOverlay";
import UserDetailsSection from "./UserDetailsSection";
import TransactionForm from "./TransactionForm";

// --- Type Definitions ---
interface TransactionSuccessData {
  success: boolean;
  newBalance: number;
  userName: string;
  error?: string;
}

interface PurchaseFormProps {
  onComplete: (destination: string) => void;
}

// --- Helper: Coin Calculation ---
const calculateCoins = (purchaseAmount: number): number => {
  if (purchaseAmount < 10) return 0;
  if (purchaseAmount < 30) return Math.floor(Math.random() * 4) + 2;
  if (purchaseAmount < 50) return Math.floor(Math.random() * 4) + 5;
  if (purchaseAmount < 100) return Math.floor(Math.random() * 6) + 10;
  if (purchaseAmount < 250) return Math.floor(Math.random() * 11) + 25;
  if (purchaseAmount < 500) return Math.floor(Math.random() * 16) + 35;
  if (purchaseAmount < 1000) return Math.floor(Math.random() * 31) + 50;
  return Math.floor(purchaseAmount / 20);
};

// --- Main Component ---
export default function PurchaseForm({ onComplete }: PurchaseFormProps) {
  const router = useRouter();
  
  // Data States
  const [phone, setPhone] = useState<string>("");
  const [formattedPhone, setFormattedPhone] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "online">("cash");
  const [shopCode, setShopCode] = useState<string>("");

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Scratch States
  const [calculatedCoins, setCalculatedCoins] = useState<number>(0);
  const [showScratchCard, setShowScratchCard] = useState<boolean>(false);
  const [isScratched, setIsScratched] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null); 

  // --- HANDLE PHONE ENTRY & API CHECK ---
  const handleUserCheck = async (rawDigits: string): Promise<void> => {
    setUserName(null);
    setErrorMsg("");

    if (rawDigits.length !== 10) return;

    setIsLoading(true);
    try {
      const res: Response = await fetch("/api/user/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: rawDigits }),
      });

      if (res.ok) {
        const data = await res.json();
        const name: string = data.user.name || "Customer";
        setUserName(name);
        // The useEffect hook above will now trigger the speakGreeting
      } else if (res.status === 404) {
        // If user not found, redirect to /register
        router.push(`/register?phone=${rawDigits}`); 
      } else {
        setErrorMsg("API Error during user check.");
      }
    } catch (err) {
      setErrorMsg("Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLE AMOUNT & COIN CALCULATION ---
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setAmount(value);
    if (value && !isNaN(Number(value))) {
      setCalculatedCoins(calculateCoins(Number(value)));
    } else {
      setCalculatedCoins(0);
    }
  };

  // --- SUBMIT TO SCRATCH ---
  const handlePreSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!userName || !amount || !shopCode || Number(amount) <= 0) {
      setErrorMsg("Please fill all required fields correctly.");
      return;
    }
    setErrorMsg("");
    setShowScratchCard(true);
  };

  // --- FINAL API SUBMISSION (After Scratch) ---
  const processTransaction = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      const res: Response = await fetch("/api/transaction/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerPhone: phone,
          amount: Number(amount),
          coinsEarned: calculatedCoins,
          paymentMode,
          shopCode
        }),
      });

      const data: TransactionSuccessData = await res.json();

      if (res.ok) {
        if (calculatedCoins > 0) {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        }
        
        const destination = '/coins'; // Assuming this is the next page after a successful transaction

        setTimeout(() => {
          router.push(destination);
        }, 4000); // Gives time to view confetti/scratch result

      } else {
        console.error(data.error || "Transaction failed.");
        setErrorMsg(data.error || "Transaction failed. Please check Shop Code.");
        setShowScratchCard(false);
        setIsScratched(false);
      }
    } catch (error) {
      console.error("A critical error occurred during transaction.", error);
      setErrorMsg("A critical error occurred during transaction.");
      setShowScratchCard(false);
      setIsScratched(false);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // --- MISSING FUNCTION IMPLEMENTATION ---
  const handleCancelScratch = (): void => {
    if (isProcessing) return;
    setShowScratchCard(false);
    setIsScratched(false);
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden relative">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

      <div className="p-6 sm:p-8 space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">New Purchase</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Coin Terminal</p>
        </div>

        {/* 1. Phone Input & User Check */}
        <UserDetailsSection
          phone={phone}
          setPhone={setPhone}
          formattedPhone={formattedPhone}
          setFormattedPhone={setFormattedPhone}
          userName={userName}
          isLoading={isLoading}
          errorMsg={errorMsg}
          onCheck={handleUserCheck}
        />

        {/* 2. Transaction Details (Only if user found) */}
        {userName && (
          <TransactionForm
            amount={amount}
            shopCode={shopCode}
            paymentMode={paymentMode}
            calculatedCoins={calculatedCoins}
            setShopCode={setShopCode}
            setPaymentMode={setPaymentMode}
            handleAmountChange={handleAmountChange}
            handlePreSubmit={handlePreSubmit}
          />
        )}
      </div>

      {/* Scratch Card Overlay */}
      {showScratchCard && (
        <ScratchCardOverlay
          canvasRef={canvasRef}
          calculatedCoins={calculatedCoins}
          isScratched={isScratched}
          setIsScratched={setIsScratched}
          isProcessing={isProcessing}
          processTransaction={processTransaction}
          onCancel={handleCancelScratch} // This function is now correctly defined
        />
      )}
    </div>
  );
}