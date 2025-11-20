"use client";

import CoinDashboard from "@/app/coins/_components/CoinDashboard";
import EnterNumber from "@/components/EnterNumber";
import VerifyOtp from "@/components/VerifyOtp";

export default function CoinsPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            {/* <EnterNumber onVerified={(phone) => console.log("Verified phone:", phone)} />
            <VerifyOtp onSuccess={() => console.log("OTP verified successfully")} /> */}
            <CoinDashboard />
        </div>
    );
}