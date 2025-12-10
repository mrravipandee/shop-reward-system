import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import Redemption from "@/models/Redemption";

// --- Database Document Interfaces ---

interface TransactionDocument {
  _id: Types.ObjectId;
  amount: number;
  paymentMode: string;
  coinsEarned: number;
  timestamp: Date;
}

interface RedemptionDocument {
  _id: Types.ObjectId;
  productName: string;
  status: string;
  redeemCode?: string; // Optional field
  coinsSpent: number;
  createdAt: Date;
}

// --- Output Interface ---

interface HistoryItem {
  id: string; // Changed to string to safely hold ObjectId.toString()
  type: "EARN" | "SPEND";
  title: string;
  subtitle: string;
  coins: number;
  isPositive: boolean;
  date: Date;
  status: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
        return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }
    
    await dbConnect();

    // 1. Fetch Earnings (Shopping) with strict typing
    const earnings = await Transaction.find({ userId })
      .lean<TransactionDocument[]>();
    
    // 2. Fetch Spendings (Redemptions) with strict typing
    const redemptions = await Redemption.find({ userId })
      .lean<RedemptionDocument[]>();

    // 3. Normalize Data
    const normalizedEarnings: HistoryItem[] = earnings.map((item) => ({
      id: item._id.toString(),
      type: "EARN",
      title: `Shopping ₹${item.amount}`,
      subtitle: `Payment: ${item.paymentMode}`,
      coins: item.coinsEarned,
      isPositive: true,
      date: new Date(item.timestamp),
      status: "COMPLETED"
    }));

    const normalizedRedemptions: HistoryItem[] = redemptions.map((item) => ({
      id: item._id.toString(),
      type: "SPEND",
      title: `Redeemed: ${item.productName}`,
      // Safe access because interface defines redeemCode as optional
      subtitle: item.status === 'PENDING' ? `Code: ${item.redeemCode || 'N/A'}` : item.status,
      coins: item.coinsSpent,
      isPositive: false,
      date: new Date(item.createdAt),
      status: item.status
    }));

    // 4. Merge and Sort by Date (Newest first)
    const combinedHistory: HistoryItem[] = [...normalizedEarnings, ...normalizedRedemptions].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    return NextResponse.json({ history: combinedHistory });

  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json({ message: "Failed to load history" }, { status: 500 });
  }
}