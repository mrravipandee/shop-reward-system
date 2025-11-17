export interface Customer {
  id: string;
  phone: string;
  name: string;
  photo?: string;
  dob?: string;
  coins: number;
  totalPurchases: number;
  createdAt: string;
}

export interface Purchase {
  id: string;
  customerId: string;
  amount: number;
  coinsEarned: number;
  paymentMode: 'cash' | 'online';
  shopCode: string;
  createdAt: string;
}