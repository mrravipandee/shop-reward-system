"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CreditCard,
  Banknote, // Used for Cash
  ShoppingBag,
  MoreVertical,
  Loader2,
} from "lucide-react";

// Matches your MongoDB Data exactly
interface TransactionData {
  _id: string;
  user?: {
    name: string;
    photo?: string;
  };
  amount: number;               // Corrected from amountSpent
  coinsEarned: number;
  paymentMode: "cash" | "online"; // Corrected from paymentType
  timestamp: string;
}

export default function LastTransactions() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/admin/transactions/latest");
        const data = await res.json();
        // Ensure we handle the array safely
        if (res.ok) setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // --- Helper: Format Date ---
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      });
    } catch (error) {
      return "";
    }
  };

  // --- Helper: Get Icon & Styles based on Payment Mode ---
  const getPaymentBadge = (mode: "cash" | "online") => {
    if (mode === "online") {
      return (
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full w-16 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          <CreditCard className="w-3.5 h-3.5" />
          <span className="capitalize">Online</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full w-16 text-xs font-medium bg-green-50 text-green-700 border border-green-100">
          <Banknote className="w-3.5 h-3.5" />
          <span className="capitalize">Cash</span>
        </div>
      );
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full w-full border border-gray-200 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 h-full w-full border border-gray-200">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Last Transactions</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No recent transactions found.
        </div>
      ) : (
        <>
          {/* === Mobile View (Stacked Cards) === */}
          <div className="block md:hidden space-y-3">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 shrink-0">
                      <Image
                        src={t.user?.photo || "/user/avatar.png"}
                        alt="User"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {t.user?.name || "Unknown User"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(t.timestamp)}
                      </span>
                    </div>
                  </div>
                  {/* Payment Badge Top Right on Mobile */}
                  {getPaymentBadge(t.paymentMode)}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="flex items-center text-amber-600 text-xs font-medium">
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                    {t.coinsEarned} Coins
                  </div>
                  <p className="font-bold text-gray-900">
                    ₹{(t.amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* === Desktop View (Table Rows) === */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 mb-3 px-3 text-xs uppercase text-gray-400 font-semibold tracking-wider">
              <div className="col-span-5">Customer</div>
              <div className="col-span-3">Payment Mode</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Coins</div>
            </div>

            <div className="space-y-2">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="grid grid-cols-12 gap-4 items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-transparent hover:border-gray-100"
                >
                  {/* 1. User */}
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="relative w-9 h-9 shrink-0">
                      <Image
                        src={t.user?.photo || "/user/avatar.png"}
                        alt="User"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {t.user?.name || "Unknown User"}
                      </h4>
                      <span className="text-xs text-gray-500 block">
                        {formatDate(t.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* 2. Payment Badge */}
                  <div className="col-span-3">
                    {getPaymentBadge(t.paymentMode)}
                  </div>

                  {/* 3. Amount */}
                  <div className="col-span-2 text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      ₹{(t.amount || 0).toLocaleString()}
                    </p>
                  </div>

                  {/* 4. Coins */}
                  <div className="col-span-2 flex justify-end items-center space-x-1">
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {t.coinsEarned}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}