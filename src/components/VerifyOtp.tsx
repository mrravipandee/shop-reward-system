"use client";

import { useState, useRef } from "react";

export default function VerifyOtp({ onSuccess }: { onSuccess: () => void }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Only single digit allowed

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next box automatically
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length < 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (finalOtp === "1234") {
        onSuccess();
      } else {
        setError("Incorrect OTP. Try again.");
      }
    }, 800);
  };

  return (
    <div className="text-center bg-white shadow-lg rounded-2xl p-8 max-w-md mx-auto animate-fadeIn">
      <h2 className="text-3xl font-bold text-primary mb-3">Verify OTP 🔐</h2>
      <p className="text-gray-600 mb-6">
        We’ve sent a 4-digit OTP to your mobile number.
      </p>

      {/* OTP Input Boxes */}
      <div className="flex justify-between gap-3 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mb-3 animate-shake">{error}</p>
      )}

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="bg-primary text-white w-full py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-purple-300"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      {/* Resend OTP */}
      <button
        onClick={() => {
          setOtp(["", "", "", ""]);
          inputsRef.current[0]?.focus();
          setError("");
        }}
        className="text-primary mt-4 underline font-medium"
      >
        Resend OTP
      </button>
    </div>
  );
}
