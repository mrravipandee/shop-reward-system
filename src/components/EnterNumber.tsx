"use client";
import { useState } from "react";
import { Phone, Send, Loader2, Shield, Coins } from "lucide-react";

export default function EnterNumber({ onVerified }: { onVerified: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    const cleanedPhone = phone.replace(/\D/g, '');
    
    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid Indian mobile number");
      return;
    }

    setError("");
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onVerified(`+91${cleanedPhone}`);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendOtp();
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (error) setError("");
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 max-w-md mx-auto border border-secondary/20">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">₪</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
          Check Your Coins
        </h2>
        <p className="text-secondary/80 text-sm sm:text-base leading-relaxed">
          Enter your mobile number to check your coin balance and claim exciting rewards
        </p>
      </div>

      {/* Phone Input */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-secondary/60" />
          </div>
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={phone}
            onChange={handlePhoneChange}
            onKeyPress={handleKeyPress}
            maxLength={12}
            className="block w-full pl-10 pr-4 py-4 text-lg border border-secondary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 text-center placeholder-secondary/50 bg-white"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-secondary/60 font-medium">+91</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-primary text-sm bg-primary/10 p-3 rounded-lg border border-primary/20">
            <Shield className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSendOtp}
        disabled={loading || phone.replace(/\D/g, '').length !== 10}
        className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending OTP...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send OTP
          </>
        )}
      </button>

      {/* Features */}
      <div className="mt-6 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
        <div className="grid grid-cols-2 gap-3 text-xs text-secondary/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Instant Balance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Claim Rewards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Fast Process</span>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 text-center">
        <p className="text-secondary/60 text-xs">
          We respect your privacy. Your number is only used for coin verification.
        </p>
      </div>
    </div>
  );
}