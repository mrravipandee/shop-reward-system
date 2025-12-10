"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  Loader2
} from "lucide-react";

interface StatDetail {
  amount: number;
  percentage: number;
  change: number;
}

interface CollectionStatsType {
  online: StatDetail;
  cash: StatDetail;
  total: number;
}

export default function CollectionStats() {
  const [stats, setStats] = useState<CollectionStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats/collection");
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch collection stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full border border-gray-200 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Fallback if API fails or returns null
  if (!stats) return <div className="p-6 text-center text-gray-500">No data available</div>;

  const isPositive = (value: number) => value >= 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full w-[40%] border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Collection Stats</h2>
      
      <div className="space-y-6">
        
        {/* === Online Collection === */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Online</h4>
                <div className="flex items-center space-x-1">
                  {isPositive(stats.online.change) ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${isPositive(stats.online.change) ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.online.change)}%
                  </span>
                  <span className="text-xs text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              ₹{stats.online.amount.toLocaleString()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.online.percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {stats.online.percentage}% of total collection
          </p>
        </div>

        {/* === Cash Collection === */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Cash</h4>
                <div className="flex items-center space-x-1">
                  {isPositive(stats.cash.change) ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${isPositive(stats.cash.change) ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.cash.change)}%
                  </span>
                  <span className="text-xs text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              ₹{stats.cash.amount.toLocaleString()}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.cash.percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {stats.cash.percentage}% of total collection
          </p>
        </div>

        {/* === Summary Footer === */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total This Month</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{stats.total.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cash Collected</p>
              <p className="text-lg font-bold text-green-600">
                ₹{stats.cash.amount.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * Comparison based on previous month&apos;s performance
          </p>
        </div>
      </div>
    </div>
  );
}