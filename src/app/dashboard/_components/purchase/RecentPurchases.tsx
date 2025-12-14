import React from 'react';
import { MoreHorizontal, CreditCard, Banknote, Clock } from 'lucide-react';
import { PurchaseTransaction } from '@/types/purchase';

interface Props {
  purchases: PurchaseTransaction[];
  onCustomerClick: (transaction: PurchaseTransaction) => void;
}

const RecentPurchases: React.FC<Props> = ({ purchases, onCustomerClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <button className="text-sm text-primary hover:underline font-medium">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coins</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {purchases.map((txn) => (
              <tr 
                key={txn.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onCustomerClick(txn)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{txn.customerName}</span>
                    <span className="text-xs text-gray-500">{txn.customerPhone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-bold text-gray-900">₹{txn.amount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    txn.paymentMode === 'Online' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {txn.paymentMode === 'Online' ? <CreditCard size={12} /> : <Banknote size={12} />}
                    {txn.paymentMode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">🪙</span>
                    <span className="text-sm font-medium text-gray-700">+{txn.coins}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Clock size={14} />
                    {txn.timestamp}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPurchases;