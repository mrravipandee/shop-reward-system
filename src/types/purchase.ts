export interface PurchaseData {
  success: boolean;
  newBalance: number;
  userName: string;
  // add any other fields the backend returns, e.g.:
  // purchaseId?: string;
  // coinsEarned?: number;
  // message?: string;
}

export interface PurchaseStats {
  totalRevenue: number;
  coinsIssued: number;
  totalPurchases: number;
  uniqueCustomers: number;
}

export interface PurchaseTransaction {
  id: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  coins: number;
  paymentMode: 'Cash' | 'Online';
  timestamp: string;
  status: 'Completed' | 'Failed';
}

export interface CustomerHistory {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  totalCoins: number;
  lastVisit: string;
  transactions: PurchaseTransaction[];
}
