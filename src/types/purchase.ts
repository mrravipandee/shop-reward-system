export interface PurchaseData {
  success: boolean;
  newBalance: number;
  userName: string;
  // add any other fields the backend returns, e.g.:
  // purchaseId?: string;
  // coinsEarned?: number;
  // message?: string;
}
