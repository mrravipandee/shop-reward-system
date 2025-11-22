"use client";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function PhoneLogin() {
  const { signIn, isLoaded } = useSignIn();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);

  if (!isLoaded) return null;

  const sendOtp = async () => {
    await signIn.create({
      identifier: `+91${phone}`,
    });
    setSent(true);
  };

  const verifyOtp = async () => {
    const result = await signIn.attemptFirstFactor({
      strategy: "phone_code",
      code,
    });

    if (result.status === "complete") {
      window.location.href = "/coins";
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      {!sent ? (
        <>
          <input
            className="w-full border p-3 rounded"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={sendOtp}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            className="w-full border p-3 rounded"
            placeholder="Enter OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={verifyOtp}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
