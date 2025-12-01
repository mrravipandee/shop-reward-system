import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import Redemption from "@/models/Redemption";

// --- HistoryItem Interface ---
// Define the output structure for the combined history
interface HistoryItem {
  id: number | string; 
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

    // 1. Fetch Earnings (Shopping)
    // In a real app, you'd use ITransaction[] here if available
    const earnings = await Transaction.find({ userId }).lean();
    
    // 2. Fetch Spendings (Redemptions)
    // In a real app, you'd use IRedemption[] here if available
    const redemptions = await Redemption.find({ userId }).lean();

    // 3. Normalize Data with explicit typing
    const normalizedEarnings: HistoryItem[] = earnings.map((item: any) => ({
      id: item._id,
      type: "EARN",
      title: `Shopping ₹${item.amount}`,
      subtitle: `Payment: ${item.paymentMode}`,
      coins: item.coinsEarned,
      isPositive: true,
      date: new Date(item.timestamp),
      status: "COMPLETED"
    }));

    const normalizedRedemptions: HistoryItem[] = redemptions.map((item: any) => ({
      id: item._id,
      type: "SPEND",
      title: `Redeemed: ${item.productName}`,
      // FIX: Ensure redeemCode exists before accessing
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