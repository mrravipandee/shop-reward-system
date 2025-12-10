import React from 'react';
import { Users, TrendingUp, TrendingDown, Coins, DollarSign, Calendar, Activity } from 'lucide-react';

interface UserStatsCardsProps {
  stats?: {
    totalUsers: number;
    newUsersToday: number;
    activeUsers: number;
    totalCoins: number;
    totalCoinValue: number;
    totalSpent: number;
    avgMonthlySpent: number;
    growthRate: number;
  };
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  // Default stats
  const defaultStats = {
    totalUsers: 1245,
    newUsersToday: 42,
    activeUsers: 856,
    totalCoins: 7850,
    totalCoinValue: 7850000,
    totalSpent: 28400000,
    avgMonthlySpent: 12000,
    growthRate: 15.8
  };

  const statsData = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{statsData.totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm text-green-600">+{statsData.growthRate}% this month</span>
        </div>
      </div>

      {/* Active Users Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{statsData.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">{statsData.newUsersToday} new today</p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${(statsData.activeUsers / statsData.totalUsers) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {Math.round((statsData.activeUsers / statsData.totalUsers) * 100)}% active rate
          </p>
        </div>
      </div>

      {/* Total Coins & Value Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Coins</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{statsData.totalCoins.toLocaleString()}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Coins className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-sm text-gray-600">Coins</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-primary mr-1" />
                <span className="text-sm text-gray-600">Value</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-full">
            <Coins className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg font-bold text-primary">
            ₹{(statsData.totalCoinValue / 100000).toFixed(1)}L Total Value
          </p>
        </div>
      </div>

      {/* Spending Analysis Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹{(statsData.totalSpent / 100000).toFixed(1)}L</p>
            <p className="text-sm text-gray-600 mt-1">Avg. ₹{statsData.avgMonthlySpent}/month per user</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Monthly Growth</p>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="font-medium text-green-600">+8.2%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">User Retention</p>
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="font-medium text-red-600">-2.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;