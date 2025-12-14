"use client";

import React, { useState } from 'react';
import { Send, Calculator, CreditCard, Banknote, Coins, Loader2 } from 'lucide-react';

const NewPurchaseForm = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online'>('Cash');
  const [loading, setLoading] = useState(false);

  // FIX: Derive state directly during render (No useEffect needed)
  const calculatedCoins = (typeof amount === 'number' && amount > 0) 
    ? Math.floor(amount / 10) 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/purchases/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: Number(amount),
          paymentMode
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to record purchase');

      // Success Feedback
      alert(`Purchase Recorded! ${data.transaction.coins} coins sent to ${phone}`);
      
      // Reset form
      setPhone('');
      setAmount('');
      
    } catch (error: unknown) {
      console.error(error);
      // Safe type narrowing instead of 'any'
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        New Purchase Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Mobile Number</label>
          <input 
            type="tel" 
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit number"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              required
              min="1"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMode('Cash')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-all ${
                paymentMode === 'Cash' 
                  ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-500' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Banknote className="w-4 h-4" />
              Cash
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('Online')}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-all ${
                paymentMode === 'Online' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Online
            </button>
          </div>
        </div>

        {/* Coin Preview */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100 flex items-center justify-between">
          <span className="text-sm text-amber-800 font-medium">Customer will earn:</span>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-xl font-bold text-amber-600">{calculatedCoins}</span>
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? "Recording..." : "Record Purchase"}
        </button>
      </form>
    </div>
  );
};

export default NewPurchaseForm;