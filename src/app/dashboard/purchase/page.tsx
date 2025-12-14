"use client";

import React, { useState } from 'react';
import PurchaseSummaryCards from '../_components/purchase/PurchaseSummaryCards';
import NewPurchaseForm from '../_components/purchase/NewPurchaseForm';
import PurchaseAnalytics from '../_components/purchase/PurchaseAnalytics';
import RecentPurchases from '../_components/purchase/RecentPurchases';
import CustomerPurchaseDrawer from '../_components/purchase/CustomerPurchaseDrawer';
import { PurchaseStats, PurchaseTransaction, CustomerHistory } from '@/types/purchase';

// --- Mock Data ---
const MOCK_STATS: PurchaseStats = {
  totalRevenue: 12450,
  coinsIssued: 312,
  totalPurchases: 48,
  uniqueCustomers: 41,
};

const MOCK_PURCHASES: PurchaseTransaction[] = [
  { id: '1', customerName: 'Ravi Pandey', customerPhone: '9876543210', amount: 540, coins: 54, paymentMode: 'Online', timestamp: '10:45 AM', status: 'Completed' },
  { id: '2', customerName: 'Sarah Smith', customerPhone: '8877665544', amount: 120, coins: 12, paymentMode: 'Cash', timestamp: '10:30 AM', status: 'Completed' },
  { id: '3', customerName: 'Mike Ross', customerPhone: '9988776655', amount: 2500, coins: 250, paymentMode: 'Online', timestamp: '09:15 AM', status: 'Completed' },
];

export default function PurchasePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerHistory | null>(null);

  const handleCustomerClick = (txn: PurchaseTransaction) => {
    // In a real app, fetch full customer history based on txn.customerId
    const mockCustomerHistory: CustomerHistory = {
      id: txn.id,
      name: txn.customerName,
      phone: txn.customerPhone,
      totalSpent: 15400,
      totalCoins: 1540,
      lastVisit: 'Today',
      transactions: MOCK_PURCHASES // Showing same list for demo
    };
    
    setSelectedCustomer(mockCustomerHistory);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. Header & Summary */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Purchase Management</h1>
          <PurchaseSummaryCards stats={MOCK_STATS} />
        </div>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Purchase Form */}
          <div className="lg:col-span-1">
            <NewPurchaseForm />
          </div>

          {/* Right: Analytics */}
          <div className="lg:col-span-2">
            <PurchaseAnalytics />
          </div>
        </div>

        {/* 3. Recent Purchases Table */}
        <RecentPurchases 
          purchases={MOCK_PURCHASES} 
          onCustomerClick={handleCustomerClick} 
        />
      </div>

      {/* 4. Sliding Drawer */}
      <CustomerPurchaseDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        customer={selectedCustomer} 
      />
    </div>
  );
}