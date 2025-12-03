import React from 'react';
import { IndianRupee, Scissors, Lock, Eye, EyeOff } from 'lucide-react';

// --- Types ---
interface TransactionFormProps {
    amount: string;
    shopCode: string;
    paymentMode: "cash" | "online";
    calculatedCoins: number;
    setShopCode: React.Dispatch<React.SetStateAction<string>>;
    setPaymentMode: React.Dispatch<React.SetStateAction<"cash" | "online">>;
    handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePreSubmit: (e: React.FormEvent) => void;
}

// --- Main Component ---
export default function TransactionFormWithGreeting({
    amount, shopCode, paymentMode, calculatedCoins,
    setShopCode, setPaymentMode, handleAmountChange, handlePreSubmit
}: TransactionFormProps) {
    const [showShopCode, setShowShopCode] = React.useState<boolean>(false);
    
    // --- Render ---
    return (
        <form onSubmit={handlePreSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Amount */}
            <div className="space-y-2">
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
                {/* Coin Preview */}
                {Number(amount) > 0 && (
                    <p className="text-xs text-indigo-600 font-semibold ml-1">
                        Potential Reward: **{calculatedCoins}** Coins
                    </p>
                )}
            </div>

            {/* Payment Mode */}
            <div className="p-1 bg-gray-100 rounded-xl grid grid-cols-2 gap-1">
                <button
                    type="button"
                    onClick={() => setPaymentMode("cash")}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${paymentMode === "cash" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                >
                    Cash
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMode("online")}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${paymentMode === "online" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
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
    );
}