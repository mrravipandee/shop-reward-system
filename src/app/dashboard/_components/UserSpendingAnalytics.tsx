// components/UserSpendingAnalytics.tsx
"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ShoppingBag, PieChart as PieChartIcon, User2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

interface PeriodSpending {
  period: string;
  totalSpent: number;
  users: number;
  avgPerUser: number;
}

interface SpendingDistribution {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface UserSpendingAnalyticsData {
  spendingByPeriod: PeriodSpending[];
  spendingDistribution: SpendingDistribution[];
  highValueUsers: number;
  avgTransactionValue: number;
}

interface UserSpendingAnalyticsProps {
  data?: Partial<UserSpendingAnalyticsData>;
}

interface PieChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: PieChartData;
  }>;
}

// Custom tooltip for pie chart
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-gray-800">{data.name}</p>
        <p className="text-primary">₹{data.value.toLocaleString()}</p>
        <p className="text-gray-600 text-sm">{data.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const UserSpendingAnalytics: React.FC<UserSpendingAnalyticsProps> = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Month');

  // Default data
  const defaultData: UserSpendingAnalyticsData = {
    spendingByPeriod: [
      { period: 'Today', totalSpent: 124500, users: 45, avgPerUser: 2767 },
      { period: 'This Week', totalSpent: 845200, users: 156, avgPerUser: 5418 },
      { period: 'This Month', totalSpent: 2840000, users: 420, avgPerUser: 6762 },
      { period: 'This Year', totalSpent: 45200000, users: 1245, avgPerUser: 36305 },
    ],
    spendingDistribution: [
      { category: 'Electronics', amount: 12000000, percentage: 42, color: '#7B61FF' },
      { category: 'Fashion', amount: 8500000, percentage: 30, color: '#4F46E5' },
      { category: 'Groceries', amount: 4500000, percentage: 16, color: '#F3ECFF' },
      { category: 'Others', amount: 3400000, percentage: 12, color: '#E5E7EB' },
    ],
    highValueUsers: 86,
    avgTransactionValue: 2450,
  };

  // Merge provided data with defaults
  const analyticsData: UserSpendingAnalyticsData = {
    spendingByPeriod: data?.spendingByPeriod || defaultData.spendingByPeriod,
    spendingDistribution: data?.spendingDistribution || defaultData.spendingDistribution,
    highValueUsers: data?.highValueUsers || defaultData.highValueUsers,
    avgTransactionValue: data?.avgTransactionValue || defaultData.avgTransactionValue,
  };

  // Pie chart data - created outside of JSX to avoid render-time creation
  const pieData: PieChartData[] = analyticsData.spendingDistribution.map(item => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: item.color
  }));

  // Get trend percentage based on period
  const getTrendPercentage = (period: string): string => {
    switch (period) {
      case 'Today': return '+12.5%';
      case 'This Week': return '+8.2%';
      case 'This Month': return '-3.1%';
      case 'This Year': return '+15.8%';
      default: return '+0.0%';
    }
  };

  // Get trend icon based on period
  const getTrendIcon = (period: string) => {
    if (period === 'Today' || period === 'This Week' || period === 'This Year') {
      return <TrendingUp className="w-4 h-4 mr-1" />;
    }
    return <TrendingDown className="w-4 h-4 mr-1" />;
  };

  // Get trend text color based on period
  const getTrendColor = (period: string): string => {
    if (period === 'Today' || period === 'This Week') return 'text-green-600';
    if (period === 'This Month') return 'text-red-600';
    return 'text-gray-600';
  };

  // Format amount in thousands or millions
  const formatAmount = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Spending Analytics</h2>
            <p className="text-sm text-gray-600">User spending patterns and distribution</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending by Period */}
        <div>
          <h3 className="font-medium text-gray-800 mb-4">Spending by Period</h3>
          
          <div className="space-y-4">
            {analyticsData.spendingByPeriod.map((period) => (
              <div key={period.period} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{period.period}</span>
                  <div className="flex items-center space-x-1">
                    <User2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{period.users} users</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatAmount(period.totalSpent)}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Avg. ₹{period.avgPerUser}/user</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center justify-end ${getTrendColor(period.period)}`}>
                      {getTrendIcon(period.period)}
                      <span className="text-sm">
                        {getTrendPercentage(period.period)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Distribution */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Spending Distribution</h3>
            <PieChartIcon className="w-5 h-5 text-primary" />
          </div>
          
          <div className="h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {analyticsData.spendingDistribution.map((item) => (
              <div key={item.category} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-800">{item.category}</p>
                    <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatAmount(item.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-600">High Value Users</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {analyticsData.highValueUsers}
              </p>
              <p className="text-xs text-gray-600 mt-1">Spending ₹10K+/month</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-600">Avg. Transaction Value</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                ₹{analyticsData.avgTransactionValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Per transaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSpendingAnalytics;