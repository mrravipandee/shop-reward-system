/**
 * Interface for the User object, used across components and the store.
 * The optional fields are made optional with '?' to match potential
 * partial data updates or initial store state.
 */
export interface User {
  id: string; // Added ID for completeness
  name: string;
  phone: string;
  dob?: string;
  photo?: string;
  coins: number;
  coinValue: number;
  totalSpent?: number;
  weeklySpent?: number;
  monthlySpent?: number;
  createdAt: string; 
}

/**
 * Interface for a single product in the rewards store.
 */
export interface RedeemProduct {
  id: number;
  name: string;
  category: "grocery" | "cash" | "gifts";
  requiredCoins: number;
  image: string;
  originalPrice: string;
  currentPrice: string;
  stock: number;
  popular: boolean;
  savings: string;
  rating: number;
}

/**
 * Interface for menu items in the dashboard.
 */
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}