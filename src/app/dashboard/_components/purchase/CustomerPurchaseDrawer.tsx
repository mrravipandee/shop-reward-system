"use client";

import React, { useEffect, useState } from 'react';
import { X, Phone, Calendar, Award, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';

// Define the interface locally if not importing shared types
interface Transaction {
  id: string;
  amount: number;
  coins: number;
  timestamp: string;
}

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  totalCoins: number;
  joinedAt: string;
  transactions: Transaction[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null; // Changed from full object to just ID
}

const CustomerPurchaseDrawer: React.FC<Props> = ({ isOpen, onClose, customerId }) => {
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when drawer opens or ID changes
  useEffect(() => {
    if (isOpen && customerId) {
      const fetchCustomerDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/admin/customers/${customerId}`);
          if (!res.ok) throw new Error("Failed to load customer data");
          
          const json = await res.json();
          setData(json.customer);
        } catch (err) {
          console.error(err);
          setError("Could not load customer history.");
        } finally {
          setLoading(false);
        }
      };

      fetchCustomerDetails();
    } else {
      // Reset when closed
      setData(null); 
    }
  }, [isOpen, customerId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col">
        
        {/* Loading State */}
        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-gray-500 text-sm">Loading history...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
             <div className="p-3 bg-red-50 rounded-full mb-3">
               <AlertCircle className="w-8 h-8 text-red-500" />
             </div>
             <p className="text-gray-800 font-medium">{error}</p>
             <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-900 underline">Close</button>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && data && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <Phone size={14} />
                  <span className="text-sm">{data.phone}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <ShoppingBag size={16} />
                    <span className="text-xs font-bold uppercase">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{data.totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                    <Award size={16} />
                    <span className="text-xs font-bold uppercase">Total Coins</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{data.totalCoins.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-semibold text-gray-800 mb-4">Transaction History</h3>
                {data.transactions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No transactions found.</p>
                ) : (
                  <div className="space-y-4">
                    {data.transactions.map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-gray-50 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Purchase</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <Calendar size={12} />
                            {txn.timestamp}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{txn.amount}</p>
                          <p className="text-xs font-medium text-amber-600">+{txn.coins} coins</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Customer since {new Date(data.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CustomerPurchaseDrawer;