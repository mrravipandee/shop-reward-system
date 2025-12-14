import React from 'react';
import { IndianRupee, Coins, ShoppingBag, Users } from 'lucide-react';
import { PurchaseStats } from '@/types/purchase';

interface Props {
  stats: PurchaseStats;
}

const PurchaseSummaryCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Revenue */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Revenue Today</p>
          <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <IndianRupee className="w-6 h-6 text-green-600" />
        </div>
      </div>

      {/* Coins */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Coins Issued Today</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.coinsIssued.toLocaleString()}</h3>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg">
          <Coins className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      {/* Purchases */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Purchases</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Customers */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Unique Customers</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.uniqueCustomers}</h3>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummaryCards;