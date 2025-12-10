// components/UserCoinsAnalytics.tsx
import React from 'react';
import { Coins, TrendingUp, Award, Target, BarChart3 } from 'lucide-react';

interface UserCoinsAnalyticsProps {
  analytics?: {
    topUsersByCoins: Array<{
      name: string;
      coins: number;
      coinValue: number;
      rank: number;
    }>;
    coinDistribution: Array<{
      range: string;
      users: number;
      percentage: number;
    }>;
    avgCoinsPerUser: number;
    totalCoinTransactions: number;
  };
}

const UserCoinsAnalytics: React.FC<UserCoinsAnalyticsProps> = ({ analytics }) => {
  // Default analytics data
  const defaultAnalytics = {
    topUsersByCoins: [
      { name: 'David Brown', coins: 3200, coinValue: 32000, rank: 1 },
      { name: 'Mike Johnson', coins: 2100, coinValue: 21000, rank: 2 },
      { name: 'John Doe', coins: 1250, coinValue: 12500, rank: 3 },
      { name: 'Sarah Smith', coins: 850, coinValue: 8500, rank: 4 },
      { name: 'Emma Wilson', coins: 450, coinValue: 4500, rank: 5 },
    ],
    coinDistribution: [
      { range: '0-500', users: 420, percentage: 34 },
      { range: '501-1000', users: 385, percentage: 31 },
      { range: '1001-2000', users: 280, percentage: 22 },
      { range: '2000+', users: 160, percentage: 13 },
    ],
    avgCoinsPerUser: 785,
    totalCoinTransactions: 4528,
  };

  const analyticsData = analytics || defaultAnalytics;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Coins className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Coins Analytics</h2>
            <p className="text-sm text-gray-600">User coin distribution and rankings</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Users by Coins */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Top Users by Coins</h3>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          
          <div className="space-y-3">
            {analyticsData.topUsersByCoins.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    user.rank === 1 ? 'bg-amber-500' :
                    user.rank === 2 ? 'bg-gray-400' :
                    user.rank === 3 ? 'bg-amber-800' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.coins.toLocaleString()} coins</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{user.coinValue.toLocaleString()}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+12.5%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coin Distribution */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Coin Distribution</h3>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.coinDistribution.map((item) => (
              <div key={item.range} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">{item.range} coins</span>
                  <span className="text-sm text-gray-600">{item.users} users ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <p className="text-sm text-gray-600">Avg. Coins per User</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.avgCoinsPerUser}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCoinTransactions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCoinsAnalytics;