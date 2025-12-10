"use client";

import React, { useEffect, useState } from 'react';
import { Users, CreditCard, TrendingUp, Loader2 } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- Interfaces ---

interface UserAnalysis {
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  totalUsers: number;
}

interface PaymentCategory {
  amount: number;
  percentage: number;
  transactions: number;
}

interface PaymentAnalysis {
  online: PaymentCategory;
  cash: PaymentCategory;
  card: PaymentCategory;
}

interface ApiResponse {
  userData: UserAnalysis;
  paymentData: PaymentAnalysis;
}

// Interface for Custom Tooltip Props
interface CustomTooltipProps {
  active?: boolean;
  payload?: { 
    name: string; 
    value: number; 
    payload: { color: string } 
  }[];
}

// --- Component ---

const TotalAnalysis = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats/total-analysis");
        if (!res.ok) throw new Error("Failed to fetch");
        const jsonData: ApiResponse = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full w-full lg:w-[40%] border border-gray-200 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Fallback if data failed to load
  if (!data) return null;

  const { userData, paymentData } = data;

  // Prepare Pie Chart Data
  // Filter out categories with 0 value to avoid ugly empty segments
  const pieData = [
    { name: 'Online', value: paymentData.online.percentage, color: '#7B61FF' },
    { name: 'Cash', value: paymentData.cash.percentage, color: '#4F46E5' },
    { name: 'Card', value: paymentData.card.percentage, color: '#F3ECFF' },
  ].filter(item => item.value > 0);

  // Type-safe Custom Tooltip
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: dataPoint.payload.color }}
            />
            <p className="font-medium text-gray-800 text-sm">{dataPoint.name}</p>
          </div>
          <p className="text-primary font-bold">{dataPoint.value}%</p>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = 
    paymentData.online.amount + 
    paymentData.cash.amount + 
    paymentData.card.amount;

  const totalTransactions = 
    paymentData.online.transactions + 
    paymentData.cash.transactions + 
    paymentData.card.transactions;

  const avgTransaction = totalTransactions > 0 
    ? Math.round(totalRevenue / totalTransactions) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full w-full lg:w-[40%] border-2 border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Total Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Analysis Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">User Analysis</h3>
            <Users className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">New Users</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {userData.newUsers.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+8.2%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {userData.activeUsers.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">Returning Users</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {userData.returningUsers.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="text-sm">--</span>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {userData.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-5 h-5 mr-1" />
                  <span className="font-medium">+15.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Analysis Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Payment Analysis</h3>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          
          <div className="h-[200px] mb-6 relative">
             {/* Handle empty data case for chart */}
             {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
             ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                   No payment data
                </div>
             )}
          </div>
          
          <div className="space-y-3">
            {/* Online Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Online</p>
                  <p className="text-xs text-gray-500">
                    {paymentData.online.transactions} txns
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">
                  ₹{paymentData.online.amount.toLocaleString()}
                </p>
                <p className="text-xs text-primary">
                  {paymentData.online.percentage}%
                </p>
              </div>
            </div>
            
            {/* Cash Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Cash</p>
                  <p className="text-xs text-gray-500">
                    {paymentData.cash.transactions} txns
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">
                  ₹{paymentData.cash.amount.toLocaleString()}
                </p>
                <p className="text-xs text-indigo-600">
                  {paymentData.cash.percentage}%
                </p>
              </div>
            </div>
            
            {/* Card Row (Hidden if 0 or displayed as per request) */}
            <div className="flex justify-between items-center opacity-60">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Card</p>
                  <p className="text-xs text-gray-500">
                    {paymentData.card.transactions} txns
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">
                  ₹{paymentData.card.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {paymentData.card.percentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs uppercase font-semibold">Total Revenue</p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs uppercase font-semibold">Avg. Txn</p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              ₹{avgTransaction.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-xs uppercase font-semibold">Success Rate</p>
            <p className="text-lg font-bold text-green-600 mt-1">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalAnalysis;