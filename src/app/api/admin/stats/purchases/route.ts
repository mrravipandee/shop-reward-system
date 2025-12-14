import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await dbConnect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // --- Aggregation Pipeline for TODAY ---
    const todayStats = await Transaction.aggregate([
      { $match: { timestamp: { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalCoins: { $sum: "$coinsEarned" },
          totalPurchases: { $sum: 1 },
          uniqueCustomers: { $addToSet: "$userId" } // Collect unique IDs
        }
      }
    ]);

    const data = todayStats[0] || { 
      totalRevenue: 0, 
      totalCoins: 0, 
      totalPurchases: 0, 
      uniqueCustomers: [] 
    };

    return NextResponse.json({
      stats: {
        totalRevenue: data.totalRevenue,
        coinsIssued: data.totalCoins,
        totalPurchases: data.totalPurchases,
        uniqueCustomers: data.uniqueCustomers.length // Count size of array
      }
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Purchase Stats API Error:", error);
    return NextResponse.json({ message: "Failed to load stats" }, { status: 500 });
  }
}