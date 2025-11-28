"use client";
import { useState, useEffect, useRef } from "react";
// Removed: import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  IndianRupee,
  Coins, Scissors,
  User, CheckCircle2, Eye, EyeOff, Loader2, Lock, X
} from "lucide-react";

// --- Type Definitions ---
interface TransactionSuccessData {
  success: boolean;
  newBalance: number;
  userName: string;
  error?: string; // Optional error field for API responses
}

interface PurchaseFormProps {
  // UPDATED: onComplete now expects the destination path (e.g., '/coins', '/home')
  onComplete: (destination: string) => void;
}


// --- Helper: Coin Calculation ---
const calculateCoins = (purchaseAmount: number): number => {
  if (purchaseAmount < 10) return 0;

  if (purchaseAmount < 30) {
    return Math.floor(Math.random() * 4) + 2; // 2 - 5
  }

  if (purchaseAmount < 50) {
    return Math.floor(Math.random() * 4) + 5; // 5 - 8
  }

  if (purchaseAmount < 100) {
    return Math.floor(Math.random() * 6) + 10; // 10 - 15
  }

  if (purchaseAmount < 250) {
    return Math.floor(Math.random() * 11) + 25; // 25 - 35
  }

  if (purchaseAmount < 500) {
    return Math.floor(Math.random() * 16) + 35; // 35 - 50
  }

  if (purchaseAmount < 1000) {
    return Math.floor(Math.random() * 31) + 50; // 50 - 80
  }

  // For higher range: 1 coin per ₹20 spent
  return Math.floor(purchaseAmount / 20);
};


// --- Main Component ---
export default function PurchaseForm({ onComplete }: PurchaseFormProps) {
  // Removed: const router = useRouter();

  // Data States
  const [phone, setPhone] = useState<string>(""); // Raw digits for API
  const [formattedPhone, setFormattedPhone] = useState<string>(""); // Formatted display string
  const [userName, setUserName] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "online">("cash");
  const [shopCode, setShopCode] = useState<string>("");

  // Voice State
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false); // For API check
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // For transaction API
  const [showShopCode, setShowShopCode] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Scratch States
  const [calculatedCoins, setCalculatedCoins] = useState<number>(0);
  const [showScratchCard, setShowScratchCard] = useState<boolean>(false);
  const [isScratched, setIsScratched] = useState<boolean>(false);
  const [isScratching, setIsScratching] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Voice Loading Effect ---
  useEffect(() => {
    // Function to load voices. Wait for voices to be loaded
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    // Load immediately and set up a listener for when voices change (important for Chrome/Safari)
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);


  // --- Helper: Text To Speech ---
  const speakGreeting = (name: string): void => {
    if (typeof window === "undefined" || !window.speechSynthesis || availableVoices.length === 0) return;

    window.speechSynthesis.cancel();
    const text = `Namaste ${name} ji, aapka swagat hai Ravi Kirana pe. Dhanyawadd.`;
    const utterance = new SpeechSynthesisUtterance(text);

    // Define a priority list for voices to ensure a clear, pleasant sound.
    const preferredVoices = [
      "Microsoft Heera - Hindi (India)", // Windows
      "Google हिन्दी",                     // Chrome
      "Apple Hindi",                      // Safari
      "Microsoft Ravi - English (India)", // Windows fallback
      "Google India English",              // Chrome fallback
      "Apple English"                     // Safari fallback
    ];

    // Find the highest priority voice available
    let selectedVoice: SpeechSynthesisVoice | undefined;
    for (const pref of preferredVoices) {
      selectedVoice = availableVoices.find(v => v.name.includes(pref) || v.lang.includes(pref));
      if (selectedVoice) break;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    window.speechSynthesis.speak(utterance);
  };
  // ---------------------------------------------


  // --- HANDLE PHONE ENTRY & API CHECK (The "Namaste" logic) ---
  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    // 1. Get value and remove all non-digits
    const inputValue: string = e.target.value.replace(/\D/g, "");
    const rawDigits: string = inputValue.slice(0, 10);

    // 2. Format the digits for display: "+91 98765 43210"
    let formatted: string = " ";
    if (rawDigits.length > 5) {
      formatted += rawDigits.slice(0, 5) + " " + rawDigits.slice(5);
    } else {
      formatted += rawDigits;
    }

    // 3. Update both raw and formatted states
    setPhone(rawDigits); // Raw number for API
    setFormattedPhone(formatted); // Formatted string for display
    setUserName(null);
    setErrorMsg("");

    // 4. Trigger API check only when 10 digits are complete
    if (rawDigits.length === 10) {
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
          speakGreeting(name);
        } else if (res.status === 404) {
          // FIX: Instead of router.push(), show an error message.
          setErrorMsg(`User with phone ${rawDigits} not found. Please register them.`);
        } else {
          setErrorMsg("API Error during user check.");
        }
      } catch (err) {
        setErrorMsg("Network error. Try again.");
      } finally {
        setIsLoading(false);
      }
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
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

        // DETERMINE DESTINATION: If user verified, go to /coins, otherwise /home.
        const destination = userName ? '/coins' : '/home';

        // Call parent completion function with the destination path
        setTimeout(() => onComplete(destination), 3000);

      } else {
        console.error(data.error || "Transaction failed. Please check Shop Code.");
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

  // --- SCRATCH CARD CANVAS LOGIC ---
  const initCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 300;
    canvas.height = 200;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#A9A9A9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#555";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", 150, 100);
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const rect: DOMRect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x: number = clientX - rect.left;
    const y: number = clientY - rect.top;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkReveal = (): void => {
    setIsScratching(false);
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    if (!ctx) return;
    const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent: number = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }

    if (transparent / (imageData.data.length / 4) > 0.4) {
      setIsScratched(true);
      processTransaction();
    }
  };

  const handleCancelScratch = (): void => {
    if (isProcessing) return;
    setShowScratchCard(false);
    setIsScratched(false);
  }

  useEffect(() => {
    if (showScratchCard) setTimeout(initCanvas, 100);
  }, [showScratchCard]);

  // --- RENDER: SCRATCH CARD OVERLAY ---
  if (showScratchCard) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center relative overflow-hidden">

          {/* Cancel Button */}
          <button
            onClick={handleCancelScratch}
            disabled={isScratched || isProcessing}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scratch To Claim!</h2>
          <p className="text-sm text-gray-500 mb-6">Your reward is ready.</p>

          <div className="relative w-full max-w-[300px] h-[200px] mx-auto rounded-xl overflow-hidden shadow-2xl ring-4 ring-indigo-500/20">

            {/* The Prize (Behind Canvas) */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-500 flex flex-col items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center text-white">
                  {/* Loader spins in a circle via animate-spin */}
                  <Loader2 className="w-10 h-10 animate-spin mb-2" />
                  <span className="font-bold">Crediting...</span>
                </div>
              ) : (
                <>
                  <Coins className="w-14 h-14 text-white drop-shadow-md mb-2" />
                  <div className="text-5xl font-black text-white drop-shadow-md">{calculatedCoins}</div>
                  <div className="text-white font-bold text-lg mt-1">COINS</div>
                </>
              )}
            </div>

            {/* The Scratch Layer */}
            {!isScratched && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                onMouseDown={(e) => { setIsScratching(true); scratch(e); }}
                onMouseMove={(e) => isScratching && scratch(e)}
                onMouseUp={checkReveal}
                onMouseLeave={checkReveal}
                onTouchStart={(e) => { setIsScratching(true); scratch(e); }}
                onTouchMove={(e) => isScratching && scratch(e)}
                onTouchEnd={checkReveal}
              />
            )}
          </div>

          {isScratched && !isProcessing && (
            <div className="mt-6 text-green-600 font-bold flex items-center justify-center gap-2 animate-pulse">
              <CheckCircle2 className="w-6 h-6" />
              <span>Coins Added!</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN FORM ---
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden relative">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

      <div className="p-6 sm:p-8 space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">New Purchase</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Coin Terminal</p>
        </div>

        {/* 1. Phone Input & User Check */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 ml-1">CUSTOMER MOBILE</label>
          <div className="relative group">
            {/* Fixed +91 prefix for visual clarity */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-700/70 transition-colors pointer-events-none">
              +91
            </span>

            <input
              type="tel"
              value={formattedPhone}
              onChange={handlePhoneChange}
              maxLength={16}
              placeholder="98765 43210"
              className="w-full pl-16 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-lg text-gray-900 tracking-wider focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all outline-none"
            />
            {isLoading && (
              // This Loader2 icon rotates in a circle due to animate-spin
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600 animate-spin" />
            )}
          </div>

          {/* Found User Badge */}
          {userName && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="bg-green-50 border border-green-100 p-3 rounded-xl flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <User className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <p className="text-[10px] text-green-600 font-bold uppercase">Verified</p>
                  <p className="text-sm font-bold text-green-800">{userName}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
              </div>
            </div>
          )}
          {errorMsg && <p className="text-red-500 text-xs ml-1">{errorMsg}</p>}
        </div>

        {/* 2. Transaction Details (Only if user found) */}
        {userName && (
          <form onSubmit={handlePreSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold text-gray-700 ml-1">AMOUNT (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full pl-9 pr-2 py-3 bg-gray-50 rounded-xl font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Coins Preview - Removed as requested */}
              {/* <div className="space-y-2">...</div> */}
            </div>

            {/* Payment Mode */}
            <div className="p-1 bg-gray-100 rounded-xl grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setPaymentMode("cash")}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${paymentMode === "cash" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("online")}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${paymentMode === "online" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                Online
              </button>
            </div>

            {/* Shop Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 ml-1">SECURITY CODE</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showShopCode ? "text" : "password"}
                  value={shopCode}
                  onChange={(e) => setShopCode(e.target.value)}
                  maxLength={6}
                  placeholder="------"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-center text-lg tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowShopCode(!showShopCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600"
                >
                  {showShopCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!amount || !shopCode || Number(amount) <= 0}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Scissors className="w-5 h-5" />
              <span>Process Purchase</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}